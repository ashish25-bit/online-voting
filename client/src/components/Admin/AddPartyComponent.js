import { useRef, useState } from "react";
import { useElection } from "../../context/ElectionContext";
import { useAlert } from "../../context/AlterContext";
import { currTimestamp } from "../../utils/constant";

function AddPartyComponent() {
  const nameRef = useRef();
  const descRef = useRef();

  const { getEthereumContract } = useElection();
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

      let leaders = leadersData.join("\n");

      const { electionContract: contract } = await getEthereumContract();
      const action = await contract.validate_action(currTimestamp());

      if (action === false) {
        setAlertMessage("Cannot add participant now since the election is ongoing");
        return;
      }

      await contract.addCandidate(name, desc, leaders, currTimestamp());

      setAlertMessage("Data Added");

      nameRef.current.value = "";
      descRef.current.value = "";
      setLeadersData([]);
      setAlertMessage("Participant data added")
    }
    catch (err) {
      setAlertMessage("Error in adding participant data");
      console.log(err);
    }
  }

  function addLeader() {
    const data = prompt("Enter Leader Name");

    if (data === "") return;

    setLeadersData((prevData) => [...prevData, data]);
  }

  return (
    <div className="add-participant-container">
      <h1>Add Participants</h1>
      <input
        ref={nameRef}
        type={"text"}
        placeholder="name of the party"
      />
      <input
        ref={descRef}
        type={"text"}
        placeholder="desc of the party"
      />

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
  );
}

export default AddPartyComponent;
