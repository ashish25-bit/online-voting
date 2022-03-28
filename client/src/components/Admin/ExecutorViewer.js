import { useAdmin } from '../../context/AdminContext'
import ExecutorListComponent from './ExecutorListComponent';

function ExecutorViewer({ username, getEthereumContract }) {
  const { authAdmin } = useAdmin();

  return (
    <div>
      <p style={{ textTransform: "uppercase" }}>Executor: {username} (Viewer)</p>
      <button className="logout-btn" onClick={() => authAdmin(null, null, -1)}>Logout</button>
      <ExecutorListComponent />
    </div>
  );
}

export default ExecutorViewer;
