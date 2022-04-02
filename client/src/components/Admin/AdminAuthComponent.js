import React, { useRef } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useElection } from "../../context/ElectionContext";
import { useAlert } from "../../context/AlterContext";
import AddPartyComponent from "./AddPartyComponent";
import ExecutorListComponent from "./ExecutorListComponent";
import ChangePassword from "./ChangePassword";
import useTitle from "../../hooks/useTitle";
import ElectionData from "./ElectionData";
import { currTimestamp } from "../../utils/constant";

function AdminAuthComponent({ username }) {
  useTitle('Admin - Dashboard');

  const addexecutor_name = useRef();
  const addexecutor_password = useRef();
  const addexecutor_role = useRef();
  const startTime_ref = useRef();
  const endTime_ref = useRef();

  const { getEthereumContract } = useElection();
  const { authAdmin } = useAdmin();
  const { setAlertMessage } = useAlert();

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

  async function updateTime() {
    try {
      const { electionContract: contract } = await getEthereumContract();
      const no_error = await contract.no_error();

      let startTime = startTime_ref.current.value;
      let endTime = endTime_ref.current.value;

      if (startTime === "" || endTime === "") {
        setAlertMessage("Time cannot be empty");
        return;
      }

      const action = await contract.validate_action(currTimestamp());

      if (action === false) {
        setAlertMessage("Cannot alter time now since the election is ongoing");
        return;
      }

      startTime = new Date(startTime).getTime();
      endTime = new Date(endTime).getTime();

      const is_data_valid = await contract.validate_timestamp(startTime, endTime, currTimestamp());

      if (is_data_valid !== no_error) {
        setAlertMessage(is_data_valid);
        return;
      }

      await contract.changeElectionTiming(startTime, endTime, currTimestamp());
      setAlertMessage("Time updated successfully");
    }
    catch (err) {
      console.log(err);
      setAlertMessage('Unable to update election timing');
    }
  }

  return (
    <div>
      <p style={{ textTransform: "uppercase" }}>User: {username}</p>
      <button className="logout-btn" onClick={() => authAdmin(null, null, -1)}>
        Logout
      </button>

      <ElectionData />

      <div className="change-time-container">
        <h1>Change Election time</h1>
        <input ref={startTime_ref} type={"datetime-local"} />
        <input ref={endTime_ref} type={"datetime-local"} />
        <button onClick={updateTime}>Update Election Timing</button>
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
