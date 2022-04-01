import { useCallback, useEffect, useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import Loader from '../Loader';
import { Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';

function PoliticalParties() {
  useTitle('Political Parties');

  const { getEthereumContract } = useElection();
  const [isLoading, setIsLoading] = useState(true);
  const [parties, setParties] = useState([]);

  const setData = useCallback(async() => {
    try {
      const { electionContract: contract } = await getEthereumContract();
      const total = (await contract.candidateCount()).toNumber();

      if (total === 0) console.log("No parties added yet");

      let result = [];

      for (let i = 1; i <= total; i++) {
        const candidate = await contract.candidates(i);
        result.push({
          id: candidate.id.toNumber(),
          name: candidate.politicalPartyName,
          description: candidate.politicalPartyDescription,
          leaders: candidate.leaders.split('\n'),
        });
      }

      setIsLoading(false);
      setParties(result);
    }
    catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }, [getEthereumContract]);

  useEffect(() => {
    setData();
  }, [setData]);

  return (
    <div>
      <h1>Political Parties participating in the election:</h1>
      {isLoading && <Loader />}
      {!isLoading && parties.length === 0 && <>No parties added yet</>}

      {
        !isLoading && parties.length !== 0 &&
        parties.map(({ id, name, description }) => {
          return (
            <div key={id}>
              <p>Name: {name}</p>
              <p>Description: {description}</p>
              <Link to={`/party/${id}`}>Visit {name}</Link>
              <hr />
            </div>
          )
        })
      }
    </div>
  )
}

export default PoliticalParties;
