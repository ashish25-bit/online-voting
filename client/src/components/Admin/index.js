import { useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import Loader from "../Loader";
import AdminAuthComponent from "./AdminAuthComponent";
import AdminLoginComponent from "./AdminLoginComponent";

function Admin() {
  const { authData, checkCredentials, authAdmin } = useAdmin();

  useEffect(() => {
    const { username, password } = checkCredentials();
    authAdmin(username, password);
  }, [authAdmin, checkCredentials]);

  return authData.loading ? (
    <Loader />
  ) : authData.isAuthenticated ? (
    <AdminAuthComponent />
  ) : (
    <AdminLoginComponent />
  );
}

export default Admin;
