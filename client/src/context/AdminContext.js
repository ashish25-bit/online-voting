import { createContext, useCallback, useContext, useState } from "react";

const AdminContext = createContext();
export function useAdmin() {
  return useContext(AdminContext);
}

export const AdminProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    username: null,
    password: null,
    isAuthenticated: false,
    loading: true,
  });

  const checkCredentials = useCallback(() => {
    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");
    return { username, password };
  }, []);

  const authAdmin = useCallback((username, password) => {
    if (!username || !password) {
      sessionStorage.clear();
      setAuthData((prevState) => ({
        ...prevState,
        username: null,
        password: null,
        isAuthenticated: false,
        loading: false,
      }));
      return;
    }

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);
    setAuthData((prevState) => ({
      ...prevState,
      username,
      password,
      isAuthenticated: true,
      loading: false,
    }));
  }, []);

  return (
    <AdminContext.Provider
      value={{
        authData,
        authAdmin,
        checkCredentials,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
