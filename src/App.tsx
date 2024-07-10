import { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SearchProfessionals from "./pages/SearchProfessionals";
import Footer from "./components/Footer";
import ProfessionalsInfo from "./pages/ProfessionalsInfo";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import JoinAsPro from "./pages/JoinAsPro";
import AddAProject from "./components/AddAProject";
import Testing from "./components/Testing";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./pages/Profile";
import { AuthContext } from "./context/Login";
import axios from "axios";
import Error from "./pages/Error";

function App() {
  const [count, setCount] = useState(0);
  // const u = import.meta.env.VITE_API_URL;

  const { setLogin, setState, setUserDetails } = useContext(AuthContext);

  useEffect(() => {
    const func = async () => {
      try {
        const user_data = await axios.get(
          "https://designmatch.ddns.net/user/details",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (user_data) {
          setLogin(true);
          setUserDetails(user_data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchStateData = async () => {
      try {
        const response = await axios.get(
          "https://designmatch.ddns.net/location/states"
        );
        setState(response.data.data);
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };
    func();
    fetchStateData();
  }, []);
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
          <Route path="/join-pro" element={<JoinAsPro />} />
          <Route path="/test" element={<AddAProject />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
