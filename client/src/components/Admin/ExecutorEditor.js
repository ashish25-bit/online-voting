import { useAdmin } from '../../context/AdminContext'
import AddPartyComponent from './AddPartyComponent';
import ExecutorListComponent from './ExecutorListComponent';

function ExecutorEditor({ username, getEthereumContract }) {
  const { authAdmin } = useAdmin();

  return (
    <div>
      <p style={{ textTransform: "uppercase" }}>Executor: {username} (Editor)</p>
      <button className="logout-btn" onClick={() => authAdmin(null, null, -1)}>Logout</button>
      <AddPartyComponent />
      <ExecutorListComponent />
    </div>
  );
}

export default ExecutorEditor;
