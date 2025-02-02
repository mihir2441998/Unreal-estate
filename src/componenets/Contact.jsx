import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import db from '../config/firebase'
import { toast } from 'react-toastify';

export default function Contact({ listing }) {

    const { register, handleSubmit, watch } = useForm({
        mode: 'onChange'
    });
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        async function getLandlord() {
            const docRef = doc(db, "users", listing.userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
                console.log(landlord);

            } else {
                toast.error("Could not get landlord data");
            }
        }
        getLandlord();
    }, [listing.userRef]);

    const onSubmit = (data) => {
        console.log(`mailto:${landlord.email}?Subject=${listing.propertyName}&body=${data.message}`);

        window.location.href = `mailto:${landlord.email}?Subject=${listing.propertyName}&body=${data.message}`;

    }

    return (
        <>
            {landlord !== null &&

                (<div>

                    <form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
                        <label for="message" className="block mb-2 text-sm font-medium text-gray-900">{`Contact ${landlord.nametext} for ${listing.propertyName}`}</label>
                        <textarea {...register('message', { required: true })} rows="4" className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Leave a message..."></textarea>

                        <a
                            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
                        >
                            <button type="submit" class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg class="w-3 h-3 text-white me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                </svg>
                                Send Email
                            </button>
                        </a>
                    </form>

                </div>)
            }

        </>

    )
}
