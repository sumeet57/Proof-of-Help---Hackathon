import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEdit2, FiLogOut } from "react-icons/fi";

export default function Profile() {
  const { user, update } = useContext(UserContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.fullName?.firstName || "",
    lastName: user?.fullName?.lastName || "",
    walletId: user?.walletId || "",
  });

  useEffect(() => {
    setForm({
      firstName: user?.fullName?.firstName || "",
      lastName: user?.fullName?.lastName || "",
      walletId: user?.walletId || "",
    });
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await update({
        fullName: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
        },
        walletId: form.walletId?.trim() || null,
      });
      toast.success("Profile updated");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm({
      firstName: user?.fullName?.firstName || "",
      lastName: user?.fullName?.lastName || "",
      walletId: user?.walletId || "",
    });
    setEditMode(false);
  }

  function initials() {
    const f = user?.fullName?.firstName || form.firstName || "";
    const l = user?.fullName?.lastName || form.lastName || "";
    return ((f[0] || "") + (l[0] || "")).toUpperCase() || "U";
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-xl mx-auto bg-zinc-800/30 border border-zinc-700 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div
            aria-hidden
            className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-orange-400 to-orange-600 text-zinc-900"
          >
            {initials()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-stone-100 truncate">
                  {user?.fullName?.firstName
                    ? `${user.fullName.firstName} ${
                        user.fullName.lastName || ""
                      }`
                    : user?.email || "Your profile"}
                </h2>
                <p className="text-sm text-stone-400 mt-1">
                  Manage profile & wallet information
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/40 border border-zinc-700 rounded-lg text-sm hover:bg-zinc-800/60"
                    aria-label="Edit profile"
                  >
                    <FiEdit2 className="text-stone-200" />
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-1.5 bg-orange-400 text-zinc-900 font-semibold rounded-lg hover:opacity-95 disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 bg-zinc-700 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button
                  onClick={() => navigate("/logout")}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:opacity-95"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>

            {/* FORM */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-400">First name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`mt-1 w-full bg-zinc-900 border ${
                    editMode
                      ? "border-orange-500/40 focus:ring-2 focus:ring-orange-500/30"
                      : "border-zinc-700"
                  } px-3 py-2 rounded-lg text-stone-100`}
                />
              </div>

              <div>
                <label className="text-xs text-stone-400">Last name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`mt-1 w-full bg-zinc-900 border ${
                    editMode
                      ? "border-orange-500/40 focus:ring-2 focus:ring-orange-500/30"
                      : "border-zinc-700"
                  } px-3 py-2 rounded-lg text-stone-100`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-stone-400">
                  Email (read-only)
                </label>
                <div className="mt-1 bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg text-stone-300">
                  {user?.email || "—"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-stone-400">Wallet address</label>
                <input
                  name="walletId"
                  value={form.walletId || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="0x..."
                  className={`mt-1 w-full bg-zinc-900 border ${
                    editMode
                      ? "border-orange-500/40 focus:ring-2 focus:ring-orange-500/30"
                      : "border-zinc-700"
                  } px-3 py-2 rounded-lg text-stone-100`}
                />
                <p className="text-xs text-stone-400 mt-2">
                  Paste an address or connect your wallet from the header.
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-900/20 border border-zinc-700 rounded-lg text-center">
                <div className="text-xs text-stone-400">Requests</div>
                <div className="text-lg font-semibold text-stone-100">
                  {user?.requests ?? 0}
                </div>
              </div>
              <div className="p-3 bg-zinc-900/20 border border-zinc-700 rounded-lg text-center">
                <div className="text-xs text-stone-400">Boasts</div>
                <div className="text-lg font-semibold text-stone-100">
                  {user?.boasts ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
