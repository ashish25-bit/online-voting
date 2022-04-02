import { useCallback, useEffect, useState } from "react";
import { useElection } from "../../context/ElectionContext";
import useTitle from "../../hooks/useTitle";
import { currTimestamp } from "../../utils/constant";
import ElectionResult from "../ElectionResult";
import Loader from "../Loader";

function Voter() {
  useTitle("Secure Online Voting - Portal");

  const { getEthereumContract } = useElection();
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    startTime: null,
    endTime: null,
    status: -1
  });

  const getAllParties = useCallback(async () => {
    try {
      const { electionContract: contract } = await getEthereumContract();

      const election_status = (await contract.voting_status(currTimestamp())).toNumber();

      // date has not been set yet
      if (election_status === 0) {
        setData(0);
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
      setData(prevState => ({ ...prevState, startTime: startTimestamp, endTime: endTimestamp }));
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

  return <div>
    {isLoading ? <Loader /> : (
      data.status === 0 ? <h1>Election time has not been set yet</h1> :
      data.status === 1 ?
        <>
          <p>Start time: {new Date(data.startTime).toString()}</p>
          <p>End time: {new Date(data.endTime).toString()}</p>
          <p>End time: {parties.length}</p>
        </> :
        data.status === 2 ? <h1>Election has not started yet</h1> :
        <ElectionResult data={parties} />
    )}
  </div>
}

export default Voter;
