import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, update } = useContext(UserContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.fullName?.firstName || "",
    lastName: user?.fullName?.lastName || "",
    walletId: user?.walletId || "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    try {
      await update({
        fullName: {
          firstName: form.firstName,
          lastName: form.lastName,
        },
        walletId: form.walletId,
      });

      toast.success("Profile updated");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-xl mx-auto bg-zinc-800/40 border border-zinc-700 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Profile</h2>

          <div className="flex gap-2">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-orange-400 text-zinc-900 rounded-lg font-semibold hover:opacity-90"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-400 text-zinc-900 rounded-lg font-semibold hover:opacity-90"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setForm({
                      firstName: user?.fullName?.firstName || "",
                      lastName: user?.fullName?.lastName || "",
                      walletId: user?.walletId || "",
                    });
                    setEditMode(false);
                  }}
                  className="px-4 py-2 bg-zinc-700 rounded-lg"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => navigate("/logout")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>

        {/* FULL NAME */}
        <div className="mb-4">
          <label className="text-sm text-stone-400">Full Name</label>
          {editMode ? (
            <div className="flex gap-2 mt-1">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg"
                placeholder="First Name"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg"
                placeholder="Last Name"
              />
            </div>
          ) : (
            <p className="mt-1 text-stone-200">
              {user?.fullName?.firstName} {user?.fullName?.lastName}
            </p>
          )}
        </div>

        {/* EMAIL (NOT EDITABLE) */}
        <div className="mb-4">
          <label className="text-sm text-stone-400">Email</label>
          <p className="mt-1 text-stone-200">{user?.email}</p>
        </div>

        {/* WALLET ID */}
        <div className="mb-4">
          <label className="text-sm text-stone-400">Wallet ID</label>
          {editMode ? (
            <input
              name="walletId"
              value={form.walletId}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg"
              placeholder="0x..."
            />
          ) : (
            <p className="mt-1 text-stone-200">
              {user?.walletId || "Not connected"}
            </p>
          )}
        </div>

        {/* REQUEST POINTS */}
        <div className="mb-4">
          <label className="text-sm text-stone-400">Request Points</label>
          <p className="mt-1 text-stone-200">{user?.requests}</p>
        </div>

        {/* BOAST POINTS */}
        <div className="mb-4">
          <label className="text-sm text-stone-400">Boast Points</label>
          <p className="mt-1 text-stone-200">{user?.boasts}</p>
        </div>
      </div>
    </div>
  );
}
