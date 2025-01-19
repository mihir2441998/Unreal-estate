import React from "react";
import { useLocation, useNavigate } from "react-router";
import useAuthStatusHook from "../hooks/useAuthStatusHook";
import { TbLogout } from "react-icons/tb";
import { getAuth } from "firebase/auth";

export default function Header() {
  const auth = getAuth();
  const path = useLocation().pathname;
  const { loggedIn, setLoggedIn } = useAuthStatusHook();
  const navigate = useNavigate();
  function isPathCorrect(pathname) {
    return pathname === path;
  }

  function onLogOutClick() {
    auth.signOut();
    setLoggedIn(false);
    navigate("/");
  }

  return (
    <div className="bg-white shadow-sm sticky top-0 z-40">
      <header
        className="flex justify-between px-20 items-center max-w-6xl
                mx-auto"
      >
        <div>
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="logo"
            className="h-20 cursor-pointer p-2"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`
                        cursor-pointer text-lg text-gray-500 border-b-[3px] border-transparent 
                        ${
                          isPathCorrect("/") &&
                          "text-gray-800 border-b-cyan-950"
                        }
                    `}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`
                        cursor-pointer text-lg text-gray-500 border-b-[3px] border-transparent 
                        ${
                          isPathCorrect("/offers") &&
                          "text-gray-800 border-b-cyan-950"
                        }
                    `}
              onClick={() => navigate("offers")}
            >
              Offers
            </li>

            {loggedIn && (
              <li
                className={`
                        cursor-pointer text-lg text-gray-500 border-b-[3px] border-transparent 
                        ${
                          isPathCorrect("/profile") &&
                          "text-gray-800 border-b-cyan-950"
                        }
                    `}
                onClick={() => navigate("/profile")}
              >
                Profile
              </li>
            )}

            {loggedIn ? (
              <li>
                <button
                  onClick={onLogOutClick}
                  type="button"
                  className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 text-center inline-flex items-center me-2 py-1.5"
                >
                  <TbLogout />
                  Log out
                </button>
              </li>
            ) : (
              <li
                className={`
                        cursor-pointer text-lg text-gray-500 border-b-[3px] border-transparent 
                        ${
                          isPathCorrect("/sign-in") &&
                          "text-gray-800 border-b-cyan-950"
                        }
                    `}
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </li>
            )}
          </ul>
        </div>
      </header>
    </div>
  );
}
