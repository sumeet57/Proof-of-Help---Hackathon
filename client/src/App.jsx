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

export default function App() {
  return (
    <>
      <ToastContainer />

      <BrowserRouter>
        <ScrollToTop />

        {/* All global contexts wrapped ONCE */}
        <UserContextProvider>
          <WalletContextProvider>
            <RequestContextProvider>
              <DonationContextProvider>
                <LayoutContextProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Protected App Routes (Inside MainLayout) */}
                    <Route path="/home" element={<MainLayout />} />
                    <Route path="/create" element={<Create />} />

                    {/* Request Details + Donate Nested Route */}
                    <Route path="/:requestId" element={<Details />}>
                      <Route path="donate" element={<Donation />} />
                    </Route>

                    {/* Services Page (Header + Content) */}
                    <Route
                      path="/service"
                      element={
                        <>
                          <Header />
                          <Service />
                        </>
                      }
                    />

                    {/* Logout */}
                    <Route path="/logout" element={<Logout />} />
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
