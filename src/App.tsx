import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import Navbar from "./components/Navbar";
import SearchProfessionals from "./pages/SearchProfessionals";
import ProfessionalsInfo from "./pages/ProfessionalsInfo";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import { AuthContext } from "./context/Login";
import { StateContext } from "./context/State";
import config from "./config";

const fetchUserData = async () => {
  const { data } = await axios.get(`${config.apiBaseUrl}/user/details`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return data;
};

const fetchStateData = async () => {
  const { data } = await axios.get(`${config.apiBaseUrl}/location/states`);
  return data;
};

const App: React.FC = () => {
  const authContext = useContext(AuthContext);
  const stateContext = useContext(StateContext);

  if (authContext === undefined || stateContext === undefined) {
    return;
  }
  const { setState } = stateContext;
  const { setLogin, setUserDetails } = authContext;

  useQuery("userDetails", fetchUserData, {
    onSuccess: (data) => {
      setLogin(true);
      setUserDetails(data.data);
    },
    onError: () => {
      setLogin(false);
    },
  });

  useQuery("stateData", fetchStateData, {
    onSuccess: (data) => {
      setState(data.data);
    },
    onError: () => {},
  });

  return (
    <div className="bg-prim text-text">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchProfessionals />} />
          <Route
            path="/search-professionals"
            element={<SearchProfessionals />}
          />
          <Route
            path="/search-professionals/:id"
            element={<ProfessionalsInfo />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
