import React from "react";
import { UserContext } from "../context/UserContext";
const Logout = () => {
  const { logout } = React.useContext(UserContext);
  React.useEffect(() => {
    logout();
  }, []);

  return <div>Logout</div>;
};

export default Logout;
