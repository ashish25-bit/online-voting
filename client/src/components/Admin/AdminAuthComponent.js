import React, { useRef } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useElection } from "../../context/ElectionContext";

function AdminAuthComponent() {
  const nameRef = useRef();
  const descRef = useRef();
  const { getEthereumContract } = useElection();
  const { authAdmin } = useAdmin();

  async function addParty() {
    try {
      const name = nameRef.current.value;
      const desc = descRef.current.value;
      let leaders = ["Lead1", "lead2"];
      leaders = leaders.join("\n");

      const { electionContract: contract } = await getEthereumContract();
      await contract.addCandidate(name, desc, leaders);
      console.log("added");
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1>Add Participants</h1>
      <div>
        <button onClick={() => authAdmin(null, null)}>Logout</button>
      </div>
      <div>
        <input ref={nameRef} type={"text"} placeholder="name of the party" />
        <input ref={descRef} type={"text"} placeholder="desc of the party" />
        <button onClick={addParty}>Add Party</button>
      </div>
    </div>
  );
}

export default AdminAuthComponent;
