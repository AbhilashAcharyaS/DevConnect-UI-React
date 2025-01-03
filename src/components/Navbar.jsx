import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeConnection } from "../utils/connectionSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeAllRequests } from "../utils/requestSlice";

function Navbar() {
  const user = useSelector((store) => store.user);
  const navigate= useNavigate()
  const dispatch = useDispatch()

  const handleLogout=async()=>{
    try {
      await axios.post(BASE_URL+"/logout",{},{withCredentials:true});
      navigate("/login")
      dispatch(removeUser());
      dispatch(removeConnection());
      dispatch(removeFeed());
      dispatch(removeAllRequests())
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">DevConnect</Link>
      </div>
      {user && 
       
      <div className="flex-none gap-2">
        <div>Welcome, {user?.firstName}</div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Photo"
                // src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                src={user?.photoUrl}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/connections">Connections</Link>
            </li>
            <li>
              <Link to="/requests">Requests</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>}
    </div>
  );
}

export default Navbar;
