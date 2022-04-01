import { useCallback, useEffect, useState } from "react";
import { useElection } from "../../context/ElectionContext";
import useTitle from "../../hooks/useTitle";
import Loader from "../Loader";

function Voter() {
  useTitle('Secure Online Voting');

  const { getEthereumContract } = useElection();
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timestamp, setTimestamp] = useState({
    startTimestamp: null,
    endTimestamp: null,
    currentTimestamp: null,
  });

  const getAllParties = useCallback(async () => {
    try {
      const { electionContract: contract } = await getEthereumContract();

      const startTimestamp = (await contract.startTimestamp());
      const endTimestamp = (await contract.endTimestamp());
      const currentTimestamp = new Date().getTime();

      if (
        startTimestamp > currentTimestamp ||
        endTimestamp < currentTimestamp
      ) {
        setTimestamp((prevState) => ({
          ...prevState,
          startTimestamp,
          endTimestamp,
          currentTimestamp,
        }));

        setIsLoading(false);
        return;
      }

      const total = (await contract.candidateCount()).toNumber();

      if (total === 0) console.log("No parties added yet");

      let result = [];

      for (let i = 1; i <= total; i++) {
        const candidate = await contract.candidates(i);
        result.push({
          id: candidate.id.toNumber(),
          name: candidate.politicalPartyName,
        });
      }

      setIsLoading(false);
      setParties(result);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }, [getEthereumContract]);

  useEffect(() => {
    getAllParties();
  }, [getAllParties]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : timestamp.currentTimestamp >= timestamp.startTimestamp &&
        timestamp.currentTimestamp <= timestamp.endTimestamp ? (
        parties.length === 0 ? (
          <>No parties added yet</>
        ) : (
          parties.map(({ id, name }) => {
            return (
              <div key={id}>
                <p>{name}</p>
              </div>
            );
          })
        )
      ) : (
        <>
          {timestamp.startTimestamp > timestamp.currentTimestamp && <>Election has not started yet</>}
          {timestamp.currentTimestamp > timestamp.endTimestamp && <>Election has ended</>}
        </>
      )}
    </div>
  );
}

export default Voter;
