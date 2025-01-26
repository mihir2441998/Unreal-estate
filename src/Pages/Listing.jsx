import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Loading from '../componenets/Loading';
import { toast } from 'react-toastify';
import db from "../config/firebase";
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';

import "swiper/css/bundle";

export default function Listing() {

    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);

    const params = useParams();
    SwiperCore.use([Autoplay, Navigation, Pagination]);

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

        </main>
    )
}
