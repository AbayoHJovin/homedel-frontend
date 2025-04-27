/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const AdminContext = createContext();

const AuthorizedAdmin = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(null);

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, setIsAdminLoggedIn }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AuthorizedAdmin;
