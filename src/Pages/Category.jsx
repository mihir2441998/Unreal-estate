import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import db from '../config/firebase';
import { toast } from 'react-toastify';
import Loading from '../componenets/Loading';
import ListingItem from '../componenets/ListingItem';
import { useParams } from 'react-router';

export default function Category() {

    const [lastFetchedListing, setLastFetchListing] = useState(null);
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        async function fetchListings() {
            try {
                // get reference
                const listingsRef = collection(db, "listings");
                // create the query
                const q = query(
                    listingsRef,
                    where("rentOrSell", "==", params.categoryName),
                    orderBy("timestamp", "desc"),
                    limit(12)
                );
                // execute the query
                const querySnap = await getDocs(q);
                const listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setListings(listings);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchListings();
    }, []);

    async function onFetchMoreListings() {
        try {
            const listingRef = collection(db, "listings");
            const q = query(
                listingRef,
                where("rentOrSell", "==", params.categoryName),
                orderBy("timestamp", "desc"),
                startAfter(lastFetchedListing),
                limit(4)
            );
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchListing(lastVisible);
            const listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);
        } catch (error) {
            toast.error("Could not fetch listing");
        }
    }
    return (
        <div>
            <div className="max-w-6xl mx-auto px-3">
                <h1 className="text-3xl text-center mt-6 font-bold mb-6 text-cyan-900">{params.categoryName === "rent" ? "Places for rent" : "Places for sale"}</h1>
                {loading ? (
                    <Loading />
                ) : listings && listings.length > 0 ? (
                    <>
                        <main>
                            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                {listings.map((listing) => (
                                    <ListingItem
                                        key={listing.id}
                                        id={listing.id}
                                        listing={listing.data}
                                    />
                                ))}
                            </ul>
                        </main>
                        {lastFetchedListing && (
                            <div className="flex justify-center items-center">
                                <button
                                    onClick={onFetchMoreListings}
                                    className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
                                >
                                    Load more
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>There are no current offers</p>
                )}
            </div>
        </div>
    )
}
