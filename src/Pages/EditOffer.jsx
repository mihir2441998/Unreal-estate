import React, { useEffect, useState } from "react";
import Loading from "../componenets/Loading";
import { toast } from "react-toastify";
import db from "../config/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router";

export default function EditOffer() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [formData, setFormData] = useState({
    propertyName: "",
    rentOrSell: "rent",
    bedroom: "1",
    bathroom: "1",
    kitchen: "0",
    parking: "no",
    address: "",
    description: "",
    regularPrice: "0",
    discountedPrice: "0",
    latitude: "",
    longitude: "",
    images: {},
  });

  const [loading, setLoading] = useState(false);

  const {
    propertyName,
    rentOrSell,
    bedroom,
    bathroom,
    kitchen,
    parking,
    address,
    description,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();

  const [listing, setListing] = useState(null);

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
        const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    }

    fetchListing();

  },[]);

  function checkApiCallsLimit() {
    const currentDay = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
    const apiData =
      JSON.parse(localStorage.getItem(process.env.REACT_APP_API_CALLS_KEY)) ||
      {};

    if (apiData.date === currentDay) {
      return apiData.count < process.env.REACT_APP_MAX_API_CALLS;
    }

    localStorage.setItem(
      process.env.REACT_APP_API_CALLS_KEY,
      JSON.stringify({ date: currentDay, count: 0 })
    );
    return true;
  }

  function onChange(event) {
    const { id, value, files, name, type } = event.target;
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        images: files,
      }));
    } else if (type === "radio") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    if (+discountedPrice > +regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Only upto 6 images are allowed");
      return;
    }
    let geoLocation;
    if (geoLocationEnabled) {
      if (!checkApiCallsLimit()) {
        setLoading(false);
        toast.warn(
          "You have reached the maximum number of API calls for today. Fake geolocation will be used."
        );
        geoLocation = { lat: 37.7749, lon: -72.880247 };
      } else {
        const requestOptions = {
          method: "GET",
        };

        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}`
          );
          const result = await response.json();

          const { lat, lon } = getLatLonWithHighestConfidence(result);

          if (lat === undefined || lon === undefined) {
            setLoading(false);
            toast.error("Please enter a correct address");
            return;
          }

          geoLocation = { lat, lon };
          console.log("GeoLocation:", geoLocation);
        } catch (error) {
          console.error("Error fetching geolocation:", error);
          toast.error("An error occurred while fetching the geolocation");
        }
      }
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `images/${auth.currentUser.uid}-${
          image.name
        }-${uuidv4()}`;

        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      console.log(error);

      toast.error("Images not uploaded ");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geoLocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    !formDataCopy.discountedPrice && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;

    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);

    setLoading(false);
    toast.success("Listing Edited!");
    navigate(`/profile`);
  }

  function getLatLonWithHighestConfidence(data) {
    if (!data.features || data.features.length === 0) {
      return { lat: undefined, lon: undefined }; // Handle empty features array
    }

    // Find the feature with the highest confidence
    const featureWithHighestConfidence = data.features.reduce(
      (highest, current) => {
        const currentConfidence = current.properties.rank?.confidence || 0;
        const highestConfidence = highest.properties.rank?.confidence || 0;
        return currentConfidence > highestConfidence ? current : highest;
      }
    );

    // Extract lat and lon from the geometry of the highest confidence feature
    const { lat, lon } = featureWithHighestConfidence.geometry.coordinates
      ? {
          lat: featureWithHighestConfidence.geometry.coordinates[1],
          lon: featureWithHighestConfidence.geometry.coordinates[0],
        }
      : { lat: undefined, lon: undefined };

    return { lat, lon };
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="text-3xl text-cyan-900 font-bold text-center py-10">
        Edit Offer
      </div>
      <div>
        <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
          {/* name */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium dark:text-cyan-950"
            >
              Property Name
            </label>
            <input
              type="text"
              id="propertyName"
              minLength="10"
              maxLength="32"
              className="bg-white  border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              placeholder="Type Property Name..."
              value={propertyName}
              onChange={onChange}
              required
            />
          </div>
          {/* name ends */}

          {/* Rent or sell start*/}
          <div className="mb-5">
            <label
              htmlFor="rentordsell"
              className="block mb-2 text-sm font-medium dark:text-cyan-950"
            >
              Rent or Sell
            </label>
            <ul
              className="items-center w-full text-sm font-medium text-cyan-900 bg-white border border-gray-200 rounded-lg sm:flex"
              id="rentorsell"
            >
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                <div className="flex items-center ps-3">
                  <input
                    id="sell"
                    type="radio"
                    value="sell"
                    name="rentOrSell"
                    onChange={onChange}
                    checked={rentOrSell === "sell"}
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 "
                  />
                  <label
                    htmlFor="sell"
                    className="w-full py-3 ms-2 text-sm font-medium text-cyan-900 "
                  >
                    Sell
                  </label>
                </div>
              </li>
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                <div className="flex items-center ps-3">
                  <input
                    id="rent"
                    type="radio"
                    value="rent"
                    name="rentOrSell"
                    onChange={onChange}
                    checked={rentOrSell === "rent"}
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 "
                  />
                  <label
                    htmlFor="rent"
                    className="w-full py-3 ms-2 text-sm font-medium text-cyan-900"
                  >
                    Rent
                  </label>
                </div>
              </li>
            </ul>
          </div>

          {/* Rent or sell ends*/}

          {/* Property Deatils start */}

          <div className="mb-5">
            <label
              htmlFor="propertydetails"
              className="block text-sm font-medium dark:text-cyan-900 mb-2"
            >
              Property Details
            </label>
            <div className="flex space-x-10" id="propertydetails">
              <div className="w-full">
                <label
                  htmlFor="bathroom"
                  className="block  text-xs font-medium text-gray-500 mb-2"
                >
                  Bathroom
                </label>
                <input
                  type="number"
                  id="bathroom"
                  min="1"
                  max="50"
                  className="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  value={bathroom}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="bedroom"
                  className="block text-xs font-medium text-gray-500 mb-2 "
                >
                  Bedroom
                </label>
                <input
                  type="number"
                  id="bedroom"
                  min="1"
                  max="50"
                  className="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  value={bedroom}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="kitchen"
                  className="block text-xs font-medium text-gray-500 mb-2 "
                >
                  Kitchen
                </label>
                <input
                  type="number"
                  id="kitchen"
                  min="0"
                  max="6"
                  className="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  value={kitchen}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          </div>
          {/* Property Deatils end */}

          {/* Parking start*/}
          <div className="mb-5">
            <label
              htmlFor="parking"
              className="block mb-2 text-sm font-medium dark:text-cyan-900"
            >
              Parking Availability
            </label>
            <ul
              className="items-center w-full text-sm font-medium text-cyan-900 bg-white border border-gray-200 rounded-lg sm:flex"
              id="parking"
            >
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                <div className="flex items-center ps-3">
                  <input
                    id="parking-yes"
                    type="radio"
                    value="yes"
                    name="parking"
                    onChange={onChange}
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 "
                  />
                  <label
                    htmlFor="parking-yes"
                    className="w-full py-3 ms-2 text-sm font-medium text-cyan-900 "
                  >
                    Yes
                  </label>
                </div>
              </li>
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                <div className="flex items-center ps-3">
                  <input
                    id="parking-no"
                    type="radio"
                    value="no"
                    onChange={onChange}
                    name="parking"
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 "
                  />
                  <label
                    htmlFor="parking-no"
                    className="w-full py-3 ms-2 text-sm font-medium text-cyan-900"
                  >
                    No
                  </label>
                </div>
              </li>
            </ul>
          </div>

          {/* Parking ends*/}

          {/* Address start */}

          <div className="mb-5">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-cyan-900 "
            >
              Address
            </label>
            <textarea
              id="address"
              rows="4"
              className="block p-2.5 w-full text-sm text-cyan-900 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Write your address here..."
              value={address}
              onChange={onChange}
              required
              minLength="10"
              maxLength="100"
            ></textarea>
          </div>

          {/* Address End */}

          {/* Geolocation start */}

          {!geoLocationEnabled && (
            <div className="flex space-x-6 justify-start mb-6">
              <div className="">
                <p className="text-lg font-semibold">Latitude</p>
                <input
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onChange}
                  required
                  min="-90"
                  max="90"
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
                />
              </div>
              <div className="">
                <p className="text-lg font-semibold">Longitude</p>
                <input
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onChange}
                  required
                  min="-180"
                  max="180"
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
                />
              </div>
            </div>
          )}

          {/* Geolocation End */}

          {/* Property description start */}

          <div className="mb-5">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-cyan-900 "
            >
              Description of Property
            </label>
            <textarea
              id="description"
              rows="4"
              className="block p-2.5 w-full text-sm text-cyan-900 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Write the description here..."
              value={description}
              onChange={onChange}
              required
              minLength="10"
              maxLength="100"
            ></textarea>
          </div>

          {/* Property description End */}

          {/* Price details start */}

          <div className="mb-5">
            <label
              htmlFor="pricedetails"
              className="block text-sm font-medium dark:text-cyan-900 mb-2"
            >
              Price Details
            </label>
            <div className="flex space-x-10" id="pricedetails">
              <div className="w-full">
                <label
                  htmlFor="regularPrice"
                  className="block  text-xs font-medium text-gray-500 mb-2"
                >
                  Regular Price
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="regularPrice"
                    min="1000"
                    className="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    value={regularPrice}
                    onChange={onChange}
                    required
                  />
                  {rentOrSell === "rent" && (
                    <p className=" text-xs text-gray-500 ">₹/Month</p>
                  )}
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="discountedPrice"
                  className="block text-xs font-medium text-gray-500 mb-2 "
                >
                  Discounted Price
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="discountedPrice"
                    min="500"
                    className="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    value={discountedPrice}
                    onChange={onChange}
                    required
                  />
                  {rentOrSell === "rent" && (
                    <p className=" text-xs text-gray-500 ">₹/Month</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Property Deatils end */}

          {/* upload file start */}

          <div className="mb-7  item">
            <label
              className="block mb-2 text-sm font-medium text-cyan-900 "
              htmlFor="multiple_files"
            >
              Upload Property Photos (max 6)
            </label>
            <input
              className="block w-full  text-cyan-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 h-10 p-1"
              id="multiple_files"
              type="file"
              multiple
              accept=".jpg,.png,.jpeg"
              required
              onChange={onChange}
            />
          </div>

          {/* upload file ends */}

          <div className="w-full max-w-md mx-auto mb-10">
            <button
              type="submit"
              className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm  px-5 py-2.5 w-full text-center flex items-center justify-center"
            >
              Edit Offer
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
