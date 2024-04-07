import React from "react";
import { Navigate, Outlet } from "react-router";
import useAuthStatusHook from "../hooks/useAuthStatusHook";
import Loading from "../componenets/Loading";

export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatusHook();
  if (checkingStatus) {
    return <Loading />;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}
