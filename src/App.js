import HomePage from "./Pages/HomePage";
import ForgotPassPage from "./Pages/ForgotPassPage";
import OffersPage from "./Pages/OffersPage";
import HomeSignInPagePage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import ProfilePage from "./Pages/ProfilePage";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./Pages/SignInPage";
import Header from "./componenets/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./Pages/PrivateRoute";
import CreateOffer from "./Pages/CreateOffer";
import EditOffer from "./Pages/EditOffer";
import Listing from "./Pages/Listing";
import "leaflet/dist/leaflet.css";
import Category from "./Pages/Category";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/category/:offerType/:listingId" element={<Listing />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPassPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/create-offer" element={<PrivateRoute />}>
            <Route path="/create-offer" element={<CreateOffer />} />
          </Route>
          <Route path="/edit-offer" element={<PrivateRoute />}>
            <Route path="/edit-offer/:listingId" element={<EditOffer />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
