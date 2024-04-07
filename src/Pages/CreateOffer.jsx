import React, { useState } from "react";

export default function CreateOffer() {
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
    images: {},
  });

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
    images,
  } = formData;

  function OnRentOrSellChange(value) {
    setFormData({
      ...formData,
      rentOrSell: value,
    });
  }

  function onPropertyNameChange(event) {
    setFormData({
      ...formData,
      propertyName: event.target.value,
    });
  }

  function onPropertyDetailChange(event) {
    console.log(event);
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  }

  function onParkingChange(value) {
    setFormData({
      ...formData,
      parking: value,
    });
  }

  function onAddressChange(event) {
    setFormData({
      ...formData,
      address: event.target.value,
    });
  }

  function onDescriptionChange(event) {
    setFormData({
      ...formData,
      description: event.target.value,
    });
  }

  function SetImages(event) {
    setFormData({
      ...formData,
      images: event.target.value,
    });
  }

  function onCreateClick() {
    console.log(formData);
  }

  return (
    <div>
      <div className="text-3xl text-cyan-900 font-bold text-center py-10">
        Create an Offer
      </div>
      <div>
        <form class="max-w-sm mx-auto">
          {/* name */}
          <div class="mb-5">
            <label
              for="name"
              class="block mb-2 text-sm font-medium dark:text-cyan-950"
            >
              Property Name
            </label>
            <input
              type="text"
              id="name"
              minLength="10"
              maxLength="32"
              class="bg-white  border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              placeholder="Type Property Name..."
              value={propertyName}
              onChange={onPropertyNameChange}
              required
            />
          </div>
          {/* name ends */}

          {/* Rent or sell start*/}
          <div className="mb-5">
            <label
              for="rentordsell"
              class="block mb-2 text-sm font-medium dark:text-cyan-950"
            >
              Rent or Sell
            </label>
            <ul
              class="items-center w-full text-sm font-medium text-cyan-900 bg-white border border-gray-200 rounded-lg sm:flex"
              id="rentorsell"
            >
              <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                <div class="flex items-center ps-3">
                  <input
                    id="sell"
                    type="radio"
                    value={rentOrSell === "sell"}
                    name="list-radio"
                    onChange={() => OnRentOrSellChange("sell")}
                    class="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 "
                  />
                  <label
                    for="sell"
                    class="w-full py-3 ms-2 text-sm font-medium text-cyan-900 "
                  >
                    Sell
                  </label>
                </div>
              </li>
              <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                <div class="flex items-center ps-3">
                  <input
                    id="rent"
                    type="radio"
                    value={rentOrSell === "rent"}
                    name="list-radio"
                    onChange={() => OnRentOrSellChange("rent")}
                    class="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 "
                  />
                  <label
                    for="rent"
                    class="w-full py-3 ms-2 text-sm font-medium text-cyan-900"
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
              for="propertydetails"
              class="block text-sm font-medium dark:text-cyan-900 mb-2"
            >
              Property Details
            </label>
            <div className="flex space-x-10" id="propertydetails">
              <div className="w-full">
                <label
                  for="bathroom"
                  class="block  text-xs font-medium text-gray-500 mb-2"
                >
                  Bathroom
                </label>
                <input
                  type="number"
                  id="bathroom"
                  min="1"
                  max="50"
                  class="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  value={bathroom}
                  onChange={onPropertyDetailChange}
                  required
                />
              </div>
              <div className="w-full">
                <label
                  for="bedroom"
                  class="block text-xs font-medium text-gray-500 mb-2 "
                >
                  Bedroom
                </label>
                <input
                  type="number"
                  id="bedroom"
                  min="1"
                  max="50"
                  class="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  value={bedroom}
                  onChange={onPropertyDetailChange}
                  required
                />
              </div>
              <div className="w-full">
                <label
                  for="kitchen"
                  class="block text-xs font-medium text-gray-500 mb-2 "
                >
                  Kitchen
                </label>
                <input
                  type="number"
                  id="kitchen"
                  min="0"
                  max="6"
                  class="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  value={kitchen}
                  onChange={onPropertyDetailChange}
                  required
                />
              </div>
            </div>
          </div>
          {/* Property Deatils end */}

          {/* Parking start*/}
          <div className="mb-5">
            <label
              for="parking"
              class="block mb-2 text-sm font-medium dark:text-cyan-900"
            >
              Parking Availability
            </label>
            <ul
              class="items-center w-full text-sm font-medium text-cyan-900 bg-white border border-gray-200 rounded-lg sm:flex"
              id="parking"
            >
              <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                <div class="flex items-center ps-3">
                  <input
                    id="parking-yes"
                    type="radio"
                    value={parking === "yes"}
                    name="list-radio"
                    onChange={() => onParkingChange("yes")}
                    class="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 "
                  />
                  <label
                    for="parking-yes"
                    class="w-full py-3 ms-2 text-sm font-medium text-cyan-900 "
                  >
                    Yes
                  </label>
                </div>
              </li>
              <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                <div class="flex items-center ps-3">
                  <input
                    id="parking-no"
                    type="radio"
                    value={parking === "no"}
                    onChange={() => onParkingChange("no")}
                    name="list-radio"
                    class="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500 "
                  />
                  <label
                    for="parking-no"
                    class="w-full py-3 ms-2 text-sm font-medium text-cyan-900"
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
              for="address"
              class="block mb-2 text-sm font-medium text-cyan-900 "
            >
              Address
            </label>
            <textarea
              id="address"
              rows="4"
              class="block p-2.5 w-full text-sm text-cyan-900 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Write your address here..."
              value={address}
              onChange={onAddressChange}
              required
              minLength="10"
              maxLength="100"
            ></textarea>
          </div>

          {/* Address End */}

          {/* Property description start */}

          <div className="mb-5">
            <label
              for="description"
              class="block mb-2 text-sm font-medium text-cyan-900 "
            >
              Description of Property
            </label>
            <textarea
              id="description"
              rows="4"
              class="block p-2.5 w-full text-sm text-cyan-900 bg-white rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Write the description here..."
              value={description}
              onChange={onDescriptionChange}
              required
              minLength="10"
              maxLength="100"
            ></textarea>
          </div>

          {/* Property description End */}

          {/* Price details start */}

          <div className="mb-5">
            <label
              for="pricedetails"
              class="block text-sm font-medium dark:text-cyan-900 mb-2"
            >
              Price Details
            </label>
            <div className="flex space-x-10" id="pricedetails">
              <div className="w-full">
                <label
                  for="regularPrice"
                  class="block  text-xs font-medium text-gray-500 mb-2"
                >
                  Regular Price
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="regularPrice"
                    min="1000"
                    class="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    value={regularPrice}
                    onChange={onPropertyDetailChange}
                    required
                  />
                  {rentOrSell === "rent" && (
                    <p className=" text-xs text-gray-500 ">₹/Month</p>
                  )}
                </div>
              </div>
              <div className="w-full">
                <label
                  for="discountedPrice"
                  class="block text-xs font-medium text-gray-500 mb-2 "
                >
                  Discounted Price
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="discountedPrice"
                    min="500"
                    class="bg-white border border-gray-300 text-cyan-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    value={discountedPrice}
                    onChange={onPropertyDetailChange}
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
              class="block mb-2 text-sm font-medium text-cyan-900 "
              for="multiple_files"
            >
              Upload Property Photos (max 6)
            </label>
            <input
              class="block w-full  text-cyan-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 h-10 p-1"
              id="multiple_files"
              type="file"
              multiple
              accept=".jpg,.png,.jpeg"
              required
              onChange={SetImages}
            />
          </div>

          {/* upload file ends */}

          <div class="w-full max-w-md mx-auto mb-10">
            <button
              type="submit"
              class="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm  px-5 py-2.5 w-full text-center flex items-center justify-center"
              onClick={onCreateClick}
            >
              Create Offer
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
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
