import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutSuccess,
  signOutFailure,
  signOutStart,
} from "../redux/user/userSlice.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const { currentUser, loading, error } = user;
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/user/signout/");
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure("error.message"));
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto mt-2 bg-white rounded-lg shadow-sm">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Profile
      </h1>
      <form className="flex flex-col gap-6">
        <input
          type="text"
          placeholder="Username"
          className="border p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          name="username"
          autoComplete="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          name="email"
          autoComplete="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          name="password"
          autoComplete="password"
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="bg-blue-500 text-white font-semibold py-4 rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-75 transition-all duration-200"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-blog"
          className="bg-green-600 text-white text-center font-semibold py-4 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200"
        >
          Write A Blog
        </Link>
        <p hidden>{error ? toast.error("Update Error " + error) : null}</p>
      </form>

      <div className="flex justify-between items-center mt-6">
        <span
          className="text-red-600 cursor-pointer hover:underline"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </span>
        <span
          className="text-red-600 cursor-pointer hover:underline"
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default Profile;
