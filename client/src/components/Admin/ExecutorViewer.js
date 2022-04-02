import { useAdmin } from '../../context/AdminContext';
import useTitle from '../../hooks/useTitle';
import ChangePassword from './ChangePassword';
import ElectionData from './ElectionData';
import ExecutorListComponent from './ExecutorListComponent';

function ExecutorViewer({ username }) {
  const { authAdmin } = useAdmin();
  useTitle(`${username} - Dashboard`);

  return (
    <div>
      <p style={{ textTransform: "uppercase" }}>Executor: {username} (Viewer)</p>
      <button className="logout-btn" onClick={() => authAdmin(null, null, -1)}>Logout</button>
      <ElectionData />
      <ChangePassword />
      <ExecutorListComponent />
    </div>
  );
}

export default ExecutorViewer;
