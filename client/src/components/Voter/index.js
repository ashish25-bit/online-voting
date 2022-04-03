import { useCallback, useEffect, useState } from "react";
import { useElection } from "../../context/ElectionContext";
import { useAlert } from "../../context/AlterContext";
import useTitle from "../../hooks/useTitle";
import { currTimestamp } from "../../utils/constant";
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

      e.target.disabled = true;

      const voter_id = "1235";
      const { electionContract: contract, provider } = await getEthereumContract();

      const status = (await contract.validate_system_and_id(voter_id, { from: currentAccount })).toNumber();

      if (status === 1) {
        setAlertMessage(`Already voted with the voter id: ${voter_id}`);
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

      const result = await contract.vote(voter_id, selected, currTimestamp());
      await provider.waitForTransaction(result.hash);
      console.log(result.hash);
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
        <h1>Election has not started yet</h1>
      ) : (
        <ElectionResult data={parties} />
      )}
    </div>
  );
}

export default Voter;
