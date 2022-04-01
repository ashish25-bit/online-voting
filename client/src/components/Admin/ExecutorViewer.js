import { useAdmin } from '../../context/AdminContext';
import useTitle from '../../hooks/useTitle';
import ChangePassword from './ChangePassword';
import ExecutorListComponent from './ExecutorListComponent';

function ExecutorViewer({ username, getEthereumContract }) {
  const { authAdmin } = useAdmin();
  useTitle(`${username} - Dashboard`);

  return (
    <div>
      <p style={{ textTransform: "uppercase" }}>Executor: {username} (Viewer)</p>
      <button className="logout-btn" onClick={() => authAdmin(null, null, -1)}>Logout</button>
      <ChangePassword />
      <ExecutorListComponent />
    </div>
  );
}

export default ExecutorViewer;
