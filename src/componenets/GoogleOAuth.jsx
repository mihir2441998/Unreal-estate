import React from "react";
import { FaGoogle } from "react-icons/fa";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import db from "../config/firebase.js";
import { useNavigate } from "react-router";

export default function GoogleOAuth(props) {
  const auth = getAuth();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  function onGoogleSignInClicked() {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            displayName: user.displayName,
            email: user.email,
            timestamp: serverTimestamp(),
          });
        }
        toast.success(`Signed in with ${user.email}`);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(
          `Error occured while google sign-in ${errorCode} : ${errorMessage}`
        );
        toast.error("Google Sign-in Failed!");
      });
  }

  return (
    <button
      className="flex bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-5 transition duration-300 ease-in-out justify-center items-center"
      type="button"
      onClick={onGoogleSignInClicked}
    >
      <FaGoogle className="text-2x mr-2" />
      {props.source === "sign-in" ? "Sign In" : "Sign Up"} with Google
    </button>
  );
}
