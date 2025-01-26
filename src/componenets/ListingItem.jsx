import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import Moment from "react-moment";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

export default function ListingItem({ id, listing, onDelete, onEdit }) {
  return (
    <>
      <div className="relative max-w-sm justify-between bg-white border border-gray-200 rounded-lg shadow dark:bg-white transition-shadow duration-150 m-[10px]">
        {/* image */}
        <Link to={`/category/${listing.rentOrSell}/${id}`}>
          <img
            className="rounded-t-lg h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
            src={listing.imgUrls[0]}
            alt=""
          />
          <Moment
            className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
            fromNow
          >
            {listing.timestamp?.toDate()}
          </Moment>
        </Link>
        <div className="p-5">
          <Link to={`/category/${listing.rentOrSell}/${id}`}>
            <div className="flex items-center space-x-1">
              <IoLocationSharp className="h-4 w-4 text-cyan-600" />
              <p className="text-xs mb-[2px] text-gray-600 truncate">
                {listing.address}
              </p>
            </div>

            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-cyan-700 truncate">
              {listing.propertyName}
            </h5>

            <p className="text-cyan-600 mt-2 font-semibold text-xl pb-1">
              ₹
              {listing.discountedPrice
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.rentOrSell === "rent" && " / month"}
            </p>
          </Link>

          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs text-cyan-700">
                {listing.bedroom > 1 ? `${listing.bedroom} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs text-cyan-700">
                {listing.bathroom > 1 ? `${listing.bathroom} Baths` : "1 Bath"}
              </p>
            </div>

            {onDelete && (
              <div className="absolute bottom-2 right-2 pt-2">
                <MdDeleteForever
                  color="red"
                  size={20}
                  onClick={() => onDelete(listing.id)}
                />
              </div>
            )}

            {onEdit && (
              <div className="absolute bottom-2 right-7 pt-2">
                <FaRegEdit
                  color="#0E7490"
                  size={19}
                  onClick={() => onEdit(listing.id)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
