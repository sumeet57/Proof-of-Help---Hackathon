import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import { UserContextProvider } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import { LayoutContextProvider } from "./context/LayoutContext";
import MainLayout from "./layouts/MainLayout";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import { RequestContextProvider } from "./context/RequestContext";
import { WalletContextProvider } from "./context/WalletContext";
import Create from "./pages/request/Create";
import Details from "./pages/request/Details";
import { DonationContextProvider } from "./context/DonationContext";
import Donation from "./pages/Donation";
const App = () => {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LayoutContextProvider>
                <UserContextProvider>
                  <Landing />
                </UserContextProvider>
              </LayoutContextProvider>
            }
          />
          <Route
            path="/auth"
            element={
              <UserContextProvider>
                <Auth />
              </UserContextProvider>
            }
          />
          <Route
            path="/home"
            element={
              <WalletContextProvider>
                <LayoutContextProvider>
                  <UserContextProvider>
                    <RequestContextProvider>
                      <MainLayout />
                    </RequestContextProvider>
                  </UserContextProvider>
                </LayoutContextProvider>
              </WalletContextProvider>
            }
          />
          <Route
            path="/create"
            element={
              <WalletContextProvider>
                <LayoutContextProvider>
                  <UserContextProvider>
                    <RequestContextProvider>
                      <Create />
                    </RequestContextProvider>
                  </UserContextProvider>
                </LayoutContextProvider>
              </WalletContextProvider>
            }
          />
          <Route
            path="/:requestId"
            element={
              <WalletContextProvider>
                <LayoutContextProvider>
                  <UserContextProvider>
                    <RequestContextProvider>
                      <Details />
                    </RequestContextProvider>
                  </UserContextProvider>
                </LayoutContextProvider>
              </WalletContextProvider>
            }
            children={
              <Route
                path="donate"
                element={
                  <DonationContextProvider>
                    <Donation />
                  </DonationContextProvider>
                }
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
