import { useAdmin } from '../../context/AdminContext'
import useTitle from '../../hooks/useTitle';
import AddPartyComponent from './AddPartyComponent';
import ChangePassword from './ChangePassword';
import ElectionData from './ElectionData';
import ExecutorListComponent from './ExecutorListComponent';

function ExecutorEditor({ username }) {
  const { authAdmin } = useAdmin();
  useTitle(`${username} - Dashboard`);

  return (
    <div>
      <p style={{ textTransform: "uppercase" }}>Executor: {username} (Editor)</p>
      <button className="logout-btn" onClick={() => authAdmin(null, null, -1)}>Logout</button>
      <ElectionData />
      <ChangePassword />
      <AddPartyComponent />
      <ExecutorListComponent />
    </div>
  );
}

export default ExecutorEditor;
