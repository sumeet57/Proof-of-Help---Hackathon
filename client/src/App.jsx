// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ScrollToTop from "./components/ScrollToTop";

// Context Providers
import { UserContextProvider } from "./context/UserContext";
import { LayoutContextProvider } from "./context/LayoutContext";
import { WalletContextProvider } from "./context/WalletContext";
import { RequestContextProvider } from "./context/RequestContext";
import { DonationContextProvider } from "./context/DonationContext";

// Layout + Pages
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Logout from "./pages/Logout";
import Create from "./pages/request/Create";
import Details from "./pages/request/Details";
import Donation from "./pages/Donation";
import Service from "./pages/Service";
import Header from "./components/Header";
import Donations from "./pages/request/Donations";
import PublicProfile from "./pages/PublicProfile";

export default function App() {
  return (
    <>
      <ToastContainer />

      <BrowserRouter>
        <ScrollToTop />

        <UserContextProvider>
          <WalletContextProvider>
            <RequestContextProvider>
              <DonationContextProvider>
                <LayoutContextProvider>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />

                    <Route path="/home" element={<MainLayout />} />
                    <Route path="/create" element={<Create />} />

                    <Route path="/:requestId" element={<Details />}>
                      <Route path="donate" element={<Donation />} />
                      <Route path="donations" element={<Donations />} />
                    </Route>

                    <Route
                      path="/service"
                      element={
                        <>
                          <Header />
                          <Service />
                        </>
                      }
                    />

                    <Route path="/logout" element={<Logout />} />

                    <Route
                      path="/profile/:userId"
                      element={<PublicProfile />}
                    />
                  </Routes>
                </LayoutContextProvider>
              </DonationContextProvider>
            </RequestContextProvider>
          </WalletContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
}
