import React, { useRef, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useElection } from "../../context/ElectionContext";
import { useAlert } from "../../context/AlterContext";

function AdminAuthComponent() {
  const nameRef = useRef();
  const descRef = useRef();
  const { getEthereumContract } = useElection();
  const { authAdmin } = useAdmin();
  const { setAlertMessage } = useAlert();

  const [leadersData, setLeadersData] = useState([]);

  async function addParty() {
    try {
      const name = nameRef.current.value;
      const desc = descRef.current.value;

      if (name === "" || desc === "") {
        alert("Both the fields are required");
        return;
      }

      if (leadersData.length === 0) {
        alert("Atleast one leader is required");
        return;
      }

      let leaders = leadersData.join('\n');

      const { electionContract: contract } = await getEthereumContract();
      await contract.addCandidate(name, desc, leaders);

      setAlertMessage("Data Added");
    }
    catch (err) {
      setAlertMessage(err.message)
      console.log(err);
    }
  }

  function addLeader() {
    const data = prompt("Enter Leader Name");

    if (data === "")
      return;

    setLeadersData(prevData => [...prevData, data]);
  }

  return (
    <div>
      <button className="logout-btn" onClick={() => authAdmin(null, null)}>
        Logout
      </button>
      <h1>Add Participants</h1>
      <div className="add-participant-container">
        <input ref={nameRef} type={"text"} placeholder="name of the party" />
        <input ref={descRef} type={"text"} placeholder="desc of the party" />

        <div className="add-leader-container">
          <div className="leaders">
            {leadersData.map((data, index) => {
              return <div key={index}>{data}</div>;
            })}
          </div>
          <button onClick={addLeader}>Add leader</button>
        </div>

        <button onClick={addParty}>Add Party</button>
      </div>
    </div>
  );
}

export default AdminAuthComponent;
