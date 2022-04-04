import { useCallback, useEffect, useRef, useState } from "react";
import { useElection } from "../../context/ElectionContext";
import { useAlert } from "../../context/AlterContext";
import useTitle from "../../hooks/useTitle";
import { BASE_URL_FLASK_APP, currTimestamp } from "../../utils/constant";
import ElectionResult from "../ElectionResult";
import Loader from "../Loader";
import "./index.css";

function Voter() {
  useTitle("Secure Online Voting - Portal");

  const { getEthereumContract, currentAccount } = useElection();
  const { setAlertMessage } = useAlert();
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    startTime: null,
    endTime: null,
    status: 0,
  });
  const [selected, setSelected] = useState(0);
  const [voterId, setVoterId] = useState(null);
  const imageRef = useRef();

  const getAllParties = useCallback(async () => {
    try {
      const { electionContract: contract } = await getEthereumContract();

      const election_status = (await contract.voting_status(currTimestamp())).toNumber();

      // date has not been set yet
      if (election_status === 0) {
        setData(prevState => ({...prevState, status: 0}));
        setIsLoading(false);
        return;
      }

      const startTimestamp = (await contract.startTimestamp()).toNumber();
      const endTimestamp = (await contract.endTimestamp()).toNumber();

      const total = (await contract.candidateCount()).toNumber();
      if (total === 0) console.log("No parties added yet");
      let result = [];

      for (let i = 1; i <= total; i++) {
        const candidate = await contract.candidates(i);

        if (election_status === 1) {
          result.push({
            id: candidate.id.toNumber(),
            name: candidate.politicalPartyName,
          });
        }
        else if (election_status === 3) {
          result.push({
            id: candidate.id.toNumber(),
            name: candidate.politicalPartyName,
            votes: candidate.voteCount.toNumber()
          });
        }
      }

      setParties(result);
      setData((prevState) => ({ ...prevState, startTime: startTimestamp, endTime: endTimestamp, status: election_status}));
      setIsLoading(false);
    }
    catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }, [getEthereumContract]);

  useEffect(() => {
    getAllParties();
  }, [getAllParties]);

  async function vote(e) {
    try {
      if (selected === 0) {
        setAlertMessage("Nothing is selected");
        return;
      }

      if (voterId === null) {
        setAlertMessage("Voter Id not present");
        return;
      }

      e.target.disabled = true;

      const { electionContract: contract, provider } = await getEthereumContract();

      const status = (await contract.validate_system_and_id(voterId, { from: currentAccount })).toNumber();

      if (status === 1) {
        setAlertMessage(`Already voted with the voter id: ${voterId}`);
        return;
      }
      if (status === 2) {
        setAlertMessage(`Already voted with the account: ${currentAccount}`);
        return;
      }

      const is_valid_candidate_id = await contract.validate_candidate_id(selected);
      if (!is_valid_candidate_id) {
        setAlertMessage("Selected candidate is not valid. Please refresh the page");
        return;
      }

      const result = await contract.vote(voterId, selected, currTimestamp());
      await provider.waitForTransaction(result.hash);

      const sibling = document.createElement('div');
      sibling.classList.add("hash");
      sibling.innerText = `Generated Hash: ${result.hash}`;
      // sibling.innerText = `Generated Hash: 0x6d5c9e45bd2323c5d7da050af86d37eee2bdc53fc01fd42a42b70bab889092aa`;
      const parent = e.target.parentElement
      parent.appendChild(sibling);

      setAlertMessage("Vote added to the blockchain successfully. Copy the transaction hash to check later");
      setSelected(0);
    }
    catch (err) {
      setAlertMessage("Something went wrong");
      console.log(err)
    }
  }

  function selectCandidate(id) {
    if (id === selected) {
      setSelected(0);
    }
    else {
      setSelected(id);
    }
  }

  async function getEpic(e) {
    try {
      e.target.disabled = true;
      const file = imageRef.current?.files[0];
      if (!file) {
        setAlertMessage("No File selected");
        e.target.disabled = false;
        return;
      }

      const formData = new FormData();
      formData.append("userImage", file);
      imageRef.current.disabled = true;

      let fileName = await fetch(`${BASE_URL_FLASK_APP}/save/file`, { method: "POST", body: formData })
      if (!fileName.ok) {
        throw new Error("Error in uploading file for EPIC generation. Try Again");
      }

      fileName = await (fileName.text());

      let data = await fetch(`${BASE_URL_FLASK_APP}/get/epic?fileName=${fileName}`);
      if (!data.ok) {
        data = await data.text();
        throw new Error(data);
      }

      data = await data.text();
      setVoterId(data);

      imageRef.current.disabled = false;
      e.target.disabled = false;
    }
    catch (err) {
      console.log(err);
      setAlertMessage(err.message);
      imageRef.current.disabled = false;
      e.target.disabled = false;
    }
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : data.status === 0 ? (
        <h1>Election time has not been set yet</h1>
      ) : data.status === 1 ? (
        <>
          <h1>Election is ongoing</h1>
          <p>Start time: {new Date(data.startTime).toString()}</p>
          <p>End time: {new Date(data.endTime).toString()}</p>

          <div className="get-epic-container">
            <h3 style={{ marginTop: "20px" }}>Upload voter id card to extract epic number</h3>
            <input ref={imageRef} type={"file"} accept="image/png, image/jpeg, image/jpg" placeholder="Image" />
            <button onClick={getEpic}>Get EPIC</button>
            {voterId !== null && <p>Voter ID: <b>{voterId}</b></p>}
          </div>

          <div className="voting-container">
            <h2>Vote Here:</h2>
            {parties.map((party, index) =>
              <div
                key={index}
                className={selected === party.id ? "active" : null}
                onClick={() => selectCandidate(party.id)}
              >
                {party.name}
              </div>
            )}
            <button onClick={vote}>Vote</button>
          </div>
        </>
      ) : data.status === 2 ? (
        <>
          <h1>Election has not started yet</h1>
          <p>Start Time: {new Date(data.startTime).toString()}</p>
          <p>End Time: {new Date(data.endTime).toString()}</p>
        </>
      ) : (
        <ElectionResult data={parties} />
      )}
    </div>
  );
}

export default Voter;
