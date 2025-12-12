import React from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Logout = () => {
  const { logout } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // or your desired redirect path
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900">
      <div className="border border-orange-400 p-6 rounded-lg text-center">
        <h2 className="text-stone-100 text-2xl mb-4">Confirm Logout</h2>
        <p className="text-stone-100 mb-4">Are you sure you want to logout?</p>
        <button
          onClick={handleLogout}
          className="mr-2 px-4 py-2 bg-orange-400 text-stone-100 rounded"
        >
          Logout
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-700 text-stone-100 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Logout;
