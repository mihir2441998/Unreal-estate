import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDone } from "react-icons/md";
import { toast } from "react-toastify";
import db from "../config/firebase";

export default function ProfilePage() {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    displayName: auth.currentUser.displayName,
    email: auth.currentUser.email,
    since: auth.currentUser.metadata.creationTime,
  });
  const [isEditing, setIsEditing] = useState(false);
  const { displayName, email, since } = formData;

  async function onEditClick(e) {
    e.preventDefault();
    setIsEditing(!isEditing);
    try {
      if (auth.currentUser.displayName !== displayName) {
        await updateProfile(auth.currentUser, {
          displayName,
        });

        const docRef = doc(db, "users", auth.currentUser.uid);
        console.log(auth.currentUser.displayName, displayName, docRef);
        await updateDoc(docRef, {
          nametext: displayName,
        });
        toast.success("User profile updated!");
      }
    } catch (error) {
      console.log("Erro on profile update: ", error);
      toast.error("Something went wrong!");
    }
  }

  function formatDate() {
    const date = new Date(since);

    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function onNameChange(event) {
    setFormData((prev) => ({
      ...prev,
      displayName: event.target.value,
    }));
  }

  return (
    <div className="">
      <div className="w-full text-white bg-main-color"></div>

      <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          {/* left side */}

          <div className="w-full md:w-3/12 md:mx-2">
            {/* profile card */}
            <form action="">
              <div className="bg-white p-3 border-t-4 border-cyan-400">
                {/* Name input */}
                <div className="w-72 mt-4 font-semibold">
                  <div className="relative w-full min-w-[200px] h-10">
                    <div className="absolute grid w-5 h-5 place-items-center top-2/4 right-3 -translate-y-2/4">
                      <button type="submit" onClick={onEditClick}>
                        {isEditing ? <MdDone /> : <FiEdit2 />}
                      </button>
                    </div>
                    <input
                      style={{ color: !isEditing ? "black" : "" }}
                      className="peer w-full h-full bg-transparent font-sans outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent px-3 py-2.5 rounded-[7px] !pr-9 border-blue-gray-200 focus:border-gray-900 text-sm lg:text-lg"
                      value={displayName}
                      disabled={!isEditing}
                      onChange={onNameChange}
                    />
                  </div>
                </div>

                {/* Name input end */}

                <h3 className="text-gray-600 font-lg text-semibold leading-6 pl-3 pt-4">
                  {email}
                </h3>

                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>Status</span>
                    <span className="ml-auto">
                      <span className="bg-cyan-500 py-1 px-2 rounded text-white text-sm">
                        Active
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>Member since</span>
                    <span className="ml-auto">{formatDate()}</span>
                  </li>
                </ul>
              </div>
            </form>
            {/* end of card */}
          </div>

          {/* right side */}
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span clas="text-green-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">My Offers</span>
              </div>
              <div className="text-gray-700"></div>
              <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                Show Full Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
