import { useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import Loader from "../Loader";
import AdminAuthComponent from "./AdminAuthComponent";
import AdminLoginComponent from "./AdminLoginComponent";
import ExecutorViewer from "./ExecutorViewer";
import ExecutorEditor from "./ExecutorEditor";

function Admin() {
  const { authData, checkCredentials, authAdmin } = useAdmin();

  useEffect(() => {
    const { username, password, type } = checkCredentials();
    authAdmin(username, password, type);

  }, [authAdmin, checkCredentials]);

  return authData.loading ? (
    <Loader />
  ) : authData.isAuthenticated ? (
    authData.type === 1 ? <AdminAuthComponent username={authData.username} /> :
    authData.type === 2 ? <ExecutorViewer username={authData.username} /> :
    authData.type === 3 ? <ExecutorEditor username={authData.username} /> :
    <AdminLoginComponent />
  ) : (
    <AdminLoginComponent />
  );
}

export default Admin;
