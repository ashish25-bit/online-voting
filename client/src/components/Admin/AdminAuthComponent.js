import React, { useCallback, useRef } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useElection } from "../../context/ElectionContext";
import { useAlert } from "../../context/AlterContext";
import AddPartyComponent from "./AddPartyComponent";
import ExecutorListComponent from "./ExecutorListComponent";
import ChangePassword from "./ChangePassword";
import useTitle from "../../hooks/useTitle";

function AdminAuthComponent({ username }) {
  useTitle('Admin - Dashboard');

  const addexecutor_name = useRef();
  const addexecutor_password = useRef();
  const addexecutor_role = useRef();

  const { getEthereumContract } = useElection();
  const { authAdmin } = useAdmin();
  const { setAlertMessage } = useAlert();

  const getAllExecutors = useCallback(async () => {
    const { electionContract: contract } = await getEthereumContract();
    const executorLength = (await contract.executorArrayLength()).toNumber();
    let result = [];

    for (let i = 0; i < executorLength; i++) {
      try {
        const name = await contract.executor_names(i);
        const role = (await contract.executors(name)).role.toNumber();
        result.push({ name, role });
      }
      catch (_err) {
        console.log(_err);
      }
    }

    return result;
  }, [getEthereumContract]);

  async function addExecutor() {
    try {
      const name = addexecutor_name.current?.value;
      const password = addexecutor_password.current?.value;
      const role = addexecutor_role.current?.value;

      if (name === "") {
        return alert("Username is a required field");
      }
      if (password === "") {
        return alert("Password is a required field");
      }
      if (role === 0) {
        return alert("Role is a required field");
      }

      const { electionContract: contract } = await getEthereumContract();

      const no_error = await contract.no_error();
      const isValid = await contract.validate_executor_data(1, name, role);

      if (isValid !== no_error) {
        setAlertMessage(isValid);
        return;
      }

      await contract.addExecutor(name, password, role);
      const executors = await getAllExecutors();
      console.log(executors);
      setAlertMessage("Executor added successfully");

      addexecutor_name.current.value = "";
      addexecutor_password.current.value = "";
      addexecutor_role.current.value = 0;
    }
    catch (err) {
      setAlertMessage(err.message);
      console.log(err);
    }
  }

  return (
    <div>
      <p style={{ textTransform: "uppercase" }}>User: {username}</p>
      <button className="logout-btn" onClick={() => authAdmin(null, null, -1)}>
        Logout
      </button>

      <div className="election-timing">
        <h1>Election Timings</h1>
      </div>

      <div className="change-time-container">
        <h1>Change Election time</h1>
        <input type={"datetime-local"} />
        <input type={"datetime-local"} />
        <button>Update Election Timing</button>
      </div>

      <ChangePassword />
      <AddPartyComponent />

      <div className="add-executor-container">
        <h1>Add Executor</h1>
        <input
          ref={addexecutor_name}
          type={"text"}
          placeholder="Enter username for executor"
        />
        <input
          ref={addexecutor_password}
          type={"password"}
          placeholder="Enter password for executor"
        />
        <select ref={addexecutor_role}>
          <option value={0}>Select Role</option>
          <option value={1}>Viewer</option>
          <option value={2}>Editor</option>
        </select>
        <button onClick={addExecutor}>Add Executor</button>
      </div>

      <ExecutorListComponent />
    </div>
  );
}

export default AdminAuthComponent;
