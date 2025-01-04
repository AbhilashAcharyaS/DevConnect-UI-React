import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [passowrdChange, setPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const dispatch = useDispatch();

  const handleEdit = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, about, skills, photoUrl },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setError(error?.response?.data);
    }
  };

  const showPasswordChange = () => {
    setPasswordChange(true);
    setNewPassword("");
  };

  const handlePasswordChange = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/password",
        { password: newPassword },
        { withCredentials: true }
      );
      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setPasswordChange(false);
    } catch (error) {
      setError(error?.response?.data);
    }
  };

  return (
    <>
      {showToast && (
        <div className="toast toast-center toast-top">
          <div className="alert alert-success">
            <span>Profile Saved SuccessFully!</span>
          </div>
        </div>
      )}
      <div className="flex justify-center my-10">
        
      <div>
      <div className="card bg-base-300 w-96 shadow-xl m-2 border border-slate-600">
        <figure>
          <img src={photoUrl} alt="user photo" className="w-40 h-40" />
        </figure>
        <div className="card-body">
          {lastName && (
            <h2 className="card-title">{firstName + " " + lastName}</h2>
          )}
          {!lastName && <h2 className="card-title">{firstName}</h2>}
          <div>
            {age && <span className="inline">{age}</span>}
            {gender && <span className="inline">{", " + gender}</span>}
          </div>
          <p>{about}</p>
          <p>{skills}</p>
          
        </div>
      </div>
    </div>

        <div className="flex justify-center items-center mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center mb-4 text-2xl">
                Edit Profile
              </h2>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">First Name:</span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Last Name:</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Age:</span>
                </div>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Gender:</span>
                </div>
                <select
                  className="select w-full max-w-xs"
                  value={gender}
                  placeholder="select gender"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option disabled>Pick your gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Others</option>
                </select>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Photo URL:</span>
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Bio:</span>
                </div>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Bio"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                ></textarea>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Skills:</span>
                </div>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>

              <p className="text-red-600">{error}</p>
              <div className="card-actions justify-center mt-4">
                <button
                  className="btn btn-success text-white"
                  onClick={handleEdit}
                >
                  Save
                </button>
              </div>

              <div className="card-actions justify-center mt-4">
                <button
                  className="btn btn-secondary text-white"
                  onClick={showPasswordChange}
                >
                  Change Password
                </button>
              </div>

              {passowrdChange && (
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">New Password:</span>
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value), setError("");
                    }}
                    className="input input-bordered w-full max-w-xs"
                  />
                  <div>
                    <button
                      className="btn btn-success text-white w-1/2 mx-auto my-4 flex justify-center items-center"
                      onClick={handlePasswordChange}
                    >
                      Save New Password
                    </button>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
