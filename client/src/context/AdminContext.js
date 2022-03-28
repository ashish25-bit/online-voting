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
    type: -1
    /**
     * type of the logged in user
     * 1: admin
     * 2: executor viewer
     * 3: executor editor
     */
  });

  const checkCredentials = useCallback(() => {
    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");
    let type = sessionStorage.getItem("type");

    if (type !== null || type !== undefined)
      type = parseInt(type);

    return { username, password, type };
  }, []);

  const authAdmin = useCallback((username, password, type) => {
    if (!username || !password) {
      sessionStorage.clear();
      setAuthData((prevState) => ({
        ...prevState,
        username: null,
        password: null,
        isAuthenticated: false,
        loading: false,
        type: -1
      }));
      return;
    }

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);
    sessionStorage.setItem("type", type);

    setAuthData((prevState) => ({
      ...prevState,
      username,
      password,
      isAuthenticated: true,
      loading: false,
      type
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
