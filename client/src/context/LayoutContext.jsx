import { createContext, useState, useEffect } from "react";

export const LayoutContext = createContext();

export const LayoutContextProvider = ({ children }) => {
  const [sideBarSelected, setSideBarSelected] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 868);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LayoutContext.Provider
      value={{ sideBarSelected, setSideBarSelected, isMobile }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
