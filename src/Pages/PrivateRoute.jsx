import React from "react";
import { Navigate, Outlet } from "react-router";
import useAuthStatusHook from "../hooks/useAuthStatusHook";

export default function PrivateRoute() {
  const {loggedIn, checkingStatus} = useAuthStatusHook();
  if(checkingStatus){
    return <h3>loading...</h3>
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
  
}
