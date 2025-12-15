// src/pages/PublicProfile.jsx
import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import Loading from "../components/Loading.jsx";
import { FiArrowLeft, FiMail, FiPocket, FiUser } from "react-icons/fi";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { publicProfile, loading, getPublicProfile } = useContext(UserContext);

  useEffect(() => {
    if (userId) {
      getPublicProfile(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading || !publicProfile) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loading fullScreen={false} />
      </div>
    );
  }

  const { fullName, email, walletId } = publicProfile;

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 px-4 py-6 sm:px-6">
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm bg-red-500 rounded-lg px-3 py-1.5 text-stone-100 hover:text-orange-400 mb-4"
        >
          <FiArrowLeft /> Back
        </button>

        {/* Card */}
        <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-6 space-y-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-400/20 flex items-center justify-center text-orange-400 text-xl font-bold">
              {fullName?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h1 className="text-xl font-semibold leading-tight">
                {fullName?.firstName} {fullName?.lastName}
              </h1>
              <p className="text-xs text-stone-400">Public Profile</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 text-sm">
            {/* Email */}
            <div className="flex items-start gap-3">
              <FiMail className="mt-1 text-stone-400" />
              <div>
                <div className="text-xs text-stone-400">Email</div>
                <div className="text-stone-200 break-all">{email}</div>
              </div>
            </div>

            {/* Wallet */}
            <div className="flex items-start gap-3">
              <FiPocket className="mt-1 text-stone-400" />
              <div>
                <div className="text-xs text-stone-400">Wallet Address</div>
                <div className="text-stone-200 break-all">
                  {walletId || "Not connected"}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          {walletId && (
            <a
              href={`https://etherscan.io/address/${walletId}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center py-3 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-sm font-semibold"
            >
              View on Explorer
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
