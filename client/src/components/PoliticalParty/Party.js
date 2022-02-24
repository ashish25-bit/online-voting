import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useElection } from "../../context/ElectionContext";
import Loader from "../Loader";

function Party() {
  const { id } = useParams();
  const { getEthereumContract } = useElection();

  const [candidateData, setCandidateData] = useState({
    isLoading: true,
    data: null,
  });

  const initialSetup = useCallback(async () => {
    try {
      const { electionContract: contract } = await getEthereumContract();

      const candidate = await contract.candidates(parseInt(id));
      const currentID = candidate.id.toNumber();

      if (currentID === 0 || currentID !== parseInt(id)) {
        setCandidateData((prevState) => ({
          ...prevState,
          isLoading: false,
          data: null,
        }));

        return;
      }

      setCandidateData((prevState) => ({
        ...prevState,
        isLoading: false,
        data: {
          name: candidate.politicalPartyName,
          description: candidate.politicalPartyDescription,
          leaders: [...candidate.leaders.split("\n")],
        },
      }));
    }
    catch (err) {
      console.log(err);
    }
  }, [getEthereumContract, id]);

  useEffect(() => {
    initialSetup();
  }, [initialSetup]);

  return (
    <div>
      <Link to="/participating-parties">⬅ Back</Link>
      {candidateData.isLoading ? (
        <Loader />
      ) : (
        candidateData.data !== null && (
          <>
            <h1>Political Party: {candidateData.data.name}</h1>
            <p>
              <small>{candidateData.data.description}</small>
            </p>
            {candidateData.data.leaders.length !== 0 && (
              <>
                <h3>Leaders of {candidateData.data.name}</h3>
                <ul>
                  {candidateData.data.leaders.map((name, index) => {
                    return <li key={index}>{name}</li>;
                  })}
                </ul>
              </>
            )}
          </>
        )
      )}
    </div>
  );
}

export default Party;
