import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Loading from '../componenets/Loading';
import { toast } from 'react-toastify';
import db from "../config/firebase";
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { FaShareFromSquare } from "react-icons/fa6";
import { IoBed } from "react-icons/io5";
import { FaBath } from "react-icons/fa";
import { FaSquareParking } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getAuth } from 'firebase/auth';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


import "swiper/css/bundle";
import Contact from '../componenets/Contact';

export default function Listing() {

    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLanlord, setContactLandlord] = useState(false);
    const auth = getAuth();

    const params = useParams();
    SwiperCore.use([Autoplay, Navigation, Pagination]);

    const customIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41], // Default Leaflet icon size
        iconAnchor: [12, 41], // Position the icon correctly
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
                console.log("listing", docSnap.data());

            } else {
                toast.error("Listing not found");
            }

        }
        fetchListing();
    }, [params.listingId]);

    if (loading) {
        return <Loading />;
    }

    const contactLanlordClick = (value) => {
        setContactLandlord(value);
    }



    return (
        <main>
            <Swiper
                slidesPerView={1}
                navigation
                pagination={{ type: "progressbar" }}
                effect="fade"
                modules={[EffectFade]}
                autoplay={{ delay: 3000 }}
            >
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="relative w-full overflow-hidden h-[300px]"
                            style={{
                                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                                backgroundSize: "cover",
                            }}
                        ></div>
                    </SwiperSlide>
                ))}

            </Swiper>
            <div
                className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareLinkCopied(true);
                    setTimeout(() => {
                        setShareLinkCopied(false);
                    }, 2000);
                }}
            >
                <FaShareFromSquare className="text-lg text-slate-500" />
            </div>
            {shareLinkCopied && (
                <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
                    Link Copied
                </p>
            )}

            <div className='m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
                <div className='listing-information w-full'>
                    <p className="text-2xl font-bold mb-3 text-blue-900">
                        {listing.propertyName} - ${" "}
                        {listing.rentOrSell
                            ? listing.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : listing.regularPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {listing.type === "rent" ? " / month" : ""}
                    </p>
                    <p className="flex items-center mt-6 mb-3 font-semibold">
                        <FaMapMarkerAlt className="text-green-700 mr-1" />
                        {listing.address}
                    </p>
                    <div className="flex justify-start items-center space-x-2 w-[75%]">
                        <span class="bg-red-100 text-red-800 text-s font-medium me-2 px-2.5 
                        py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">{listing.type === "rent" ? "Rent" : "Sale"}</span>


                        {listing.rentOrSell && (
                            <span class="bg-green-100 text-green-800 text-s font-medium me-2 px-2.5 
                            py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">${+listing.regularPrice - +listing.discountedPrice} discount</span>
                        )}
                    </div>
                    <p className="mt-3 mb-3">
                        <span className="font-semibold">Description - </span>
                        {listing.description}
                    </p>
                    <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
                        <li className="flex items-center whitespace-nowrap">
                            <IoBed className="text-lg mr-1" />
                            {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaBath className="text-lg mr-1" />
                            {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaSquareParking className="text-lg mr-1" />
                            {listing.parking ? "Parking spot" : "No parking"}
                        </li>

                    </ul>
                    {listing.userRef === auth.currentUser?.uid && !contactLanlord &&

                        (<div>
                            <button type="button" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                    font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                onClick={() => contactLanlordClick(true)}
                    >Contact Seller</button>
                        </div>)

                    }
                    {
                        contactLanlord &&
                        <Contact
                            listing={listing}
                        />
                    }

                </div>
                <div className='w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2'>
                    {listing.geoLocation?.lat && listing.geoLocation?.lon &&
                        (
                            <MapContainer center={[listing.geoLocation.lat, listing.geoLocation.lon]}
                                zoom={13}
                                scrollWheelZoom={false}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[listing.geoLocation.lat, listing.geoLocation.lon]} icon={customIcon}>
                                    <Popup>
                                        {listing.address}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )
                    }

                </div>
            </div>

        </main>
    )
}
