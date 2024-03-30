import React from "react";
import { FaGoogle } from "react-icons/fa";

export default function GoogleOAuth(props) {
  return (
    <button className="flex bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-5 transition duration-300 ease-in-out justify-center items-center">
      <FaGoogle className="text-2x mr-2" />
      {props.source === "sign-in" ? "Sign In" : "Sign Up"} with Google
    </button>
  );
}
