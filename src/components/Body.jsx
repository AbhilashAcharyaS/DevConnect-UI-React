import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user= useSelector(store=>store.user);

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res?.data));
    } catch (err) {
      if(err.status===401 || err.status===400){
        navigate("/login");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    if(!user){
      fetchUser();
    }
  }, []);

  return (
    <div className="flex flex-col justify-between">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Body;
