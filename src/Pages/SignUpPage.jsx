import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import GoogleOAuth from "../componenets/GoogleOAuth";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    nametext: "",
    email: "",
    password: "",
  });
  const { nametext, email, password } = signupForm;
  function onChangeForm(event) {
    setSignupForm((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  }

  return (
    <div>
      <section>
        <div className="text-3xl text-cyan-900 font-bold text-center py-10">
          Sign Up
        </div>
        <div className="flex flex-wrap items-center justify-center mx-auto px-6 max-w-6xl pt-10">
          <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
            <img
              src={process.env.PUBLIC_URL + "/signin-photo.jpg"}
              alt="logo"
              className="rounded-2xl"
            />
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form>
              <input
                type="text"
                className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-cyan-500 mb-6 transition duration-300 ease-in-out"
                onChange={onChangeForm}
                id="nametext"
                value={nametext}
                placeholder="Type Your Name..."
              />
              <input
                type="email"
                className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-cyan-500 mb-6 transition duration-300 ease-in-out"
                onChange={onChangeForm}
                id="email"
                value={email}
                placeholder="Type Email Here..."
              />
              <div className="relative mb-6">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-cyan-500 transition duration-300 ease-in-out"
                  onChange={onChangeForm}
                  value={password}
                  placeholder="Type Password Here..."
                />
                {showPassword ? (
                  <FaEye
                    className="absolute right-3 top-3 text-xl cursor-pointer"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                  />
                ) : (
                  <FaEyeSlash
                    className="absolute right-3 top-3 text-xl cursor-pointer"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                  />
                )}
              </div>
              <div className="flex flex-wrap justify-between text-cyan-900">
                <p className="">
                  Already have an account?
                  <Link
                    className="hover:text-red-900 ml-1 text-red-500"
                    to="/sign-in"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
              <button
                className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-5 transition duration-300 ease-in-out
                "
                type="submit"
              >
                Sign Up
              </button>
              <div className="flex my-4 before:border-t before:border-cyan-950 before:flex-1 items-center after:border-t after:border-cyan-950 after:flex-1 items-center">
                <p className="text-center font-semibold mx-4">OR</p>
              </div>
              <GoogleOAuth source="sign-up" />
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
