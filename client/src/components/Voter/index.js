import { useCallback, useEffect, useState } from "react";
import { useElection } from "../../context/ElectionContext";
import useTitle from "../../hooks/useTitle";
import { currTimestamp } from "../../utils/constant";
import Loader from "../Loader";

function Voter() {
  useTitle("Secure Online Voting");

  const { getEthereumContract } = useElection();
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    startTime: null,
    endTime: null,
  });

  const getAllParties = useCallback(async () => {
    try {
      const { electionContract: contract } = await getEthereumContract();

      const election_status = (await contract.voting_status(currTimestamp())).toNumber();

      // date has not been set yet
      if (election_status === 0) {
        setData("Election time has not been set yet");
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
            vote: candidate.voteCount.toNumber()
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
      data.constructor.name === "String" ? <h1>{data}</h1> :
      <>
        <p>Start time: {new Date(data.startTime).toString()}</p>
        <p>End time: {new Date(data.endTime).toString()}</p>
        <p>End time: {parties.length}</p>
      </>
    )}
  </div>
}

export default Voter;
