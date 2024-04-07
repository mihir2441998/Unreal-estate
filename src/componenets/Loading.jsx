import React from "react";
import loading from "../assets/loading.svg";

export default function Loading() {
  return (
    <div className="bg-white bg-opacity-30 flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 z-50">
      <img src={loading} alt="loading svg" className="h-24" />
    </div>
  );
}
