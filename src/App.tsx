import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import Navbar from "./components/Navbar";
import SearchProfessionals from "./pages/SearchProfessionals";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Error from "./pages/Error";
import { AuthContext } from "./context/Login";
import { StateContext } from "./context/State";
import constants from "./constants";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import InteriorDesignerInfoMobile from "./pages/interior-designers/InteriorDesignerInfoMobile";
import ProfileForMobile from "./pages/ProfileForMobile";
import { jwtDecode } from "jwt-decode";
import FinancePlannerInfo from "./pages/finance-planners/FinancePlannerInfoMobile";
import InteriorDesignerInfoLaptop from "./pages/interior-designers/InteriorDesignerInfoLaptop";
import { useMediaQuery, useTheme } from "@mui/material";
import { ApiContext } from "./context/Api";

const fetchUserData = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    const { data } = await axios.get(`${constants.apiBaseUrl}/user/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  } else {
    throw Error();
  }
};

const fetchStateData = async () => {
  const { data } = await axios.get(`${constants.apiBaseUrl}/location/states`);
  return data.data;
};

const App: React.FC = () => {
  const authContext = useContext(AuthContext);
  const stateContext = useContext(StateContext);

  const apiContext = useContext(ApiContext);

  if (
    authContext === undefined ||
    stateContext === undefined ||
    apiContext === undefined
  ) {
    return;
  }
  const { setErrorInApi } = apiContext;
  const { setState } = stateContext;
  const { setLogin, setUserDetails } = authContext;

  useQuery("userDetails", fetchUserData, {
    onSuccess: (data) => {
      setLogin(true);
      const token = localStorage.getItem("token");
      if (token) {
        const decodedJWT = jwtDecode(token);

        const combinedData = {
          ...data,
          ...decodedJWT,
        };
        setUserDetails(combinedData);
      }
    },
    onError: () => {
      setLogin(false);
      localStorage.removeItem("token");
    },
  });

  useQuery("stateData", fetchStateData, {
    onSuccess: (data) => {
      setState(data);
    },
    onError: () => {
      setErrorInApi(true);
    },
  });

  const themes = useTheme();

  //device-width >900px
  const isLargeDevice = useMediaQuery(themes.breakpoints.up("md"));
  return (
    <div className="bg-prim text-black">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/interior-designers"
            element={<SearchProfessionals professional={"interiorDesigners"} />}
          />
          <Route
            path="/finance-planners"
            element={<SearchProfessionals professional={"financePlanners"} />}
          />
          <Route
            path="/interior-designers/:professionalId"
            element={
              isLargeDevice ? (
                <InteriorDesignerInfoLaptop
                  renderProfileView={false}
                  renderProfessionalInfoView={true}
                />
              ) : (
                <InteriorDesignerInfoMobile
                  renderProfileView={false}
                  renderProfessionalInfoView={true}
                />
              )
            }
          />
          <Route
            path="/finance-planners/:professionalId"
            element={
              <FinancePlannerInfo
                renderProfileView={false}
                renderProfessionalInfoView={true}
              />
            }
          />
          <Route path="/signup" element={<SignUp joinAsPro={false} />} />
          <Route path="/join-as-pro" element={<SignUp joinAsPro={true} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile-options" element={<ProfileForMobile />} />
          <Route
            path="/profile"
            element={
              //vendorType
              isLargeDevice ? (
                <InteriorDesignerInfoLaptop
                  renderProfileView={true}
                  renderProfessionalInfoView={false}
                />
              ) : (
                <InteriorDesignerInfoMobile
                  renderProfileView={true}
                  renderProfessionalInfoView={false}
                />
              )
            }
          />
          <Route path="/*" element={<Error />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
