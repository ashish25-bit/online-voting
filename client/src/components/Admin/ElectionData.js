import { useEffect, useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAlert } from '../../context/AlterContext';
import { currTimestamp } from '../../utils/constant';

function ElectionData() {
  const { getEthereumContract } = useElection();
  const { setAlertMessage } = useAlert();

  const [electionData, setElectionData] = useState({
    startTime: 0,
    endTime: 0,
    data: []
  });

  useEffect(() => {
    async function setup() {
      try {
        const { electionContract: contract } = await getEthereumContract();

        const has_election_started = (await contract.voting_status(currTimestamp())).toNumber();

        if (has_election_started === 0) {
          setElectionData("Election date has not been set yet");
          return;
        }

        let data = [];
        const startTime = (await contract.startTimestamp()).toNumber();
        const endTime = (await contract.endTimestamp()).toNumber();
        const candidateCount = (await contract.candidateCount()).toNumber();

        for (let id = 1; id <= candidateCount+1; id++) {
          const candidate = await contract.candidates(id);
          if (candidate.id.toNumber() === 0)
            continue;

          data.push({
            name: candidate.politicalPartyName,
            votes: candidate.voteCount.toNumber()
          });
        }

        setElectionData(prevState => ({ ...prevState, startTime, endTime, data }));
      }
      catch (err) {
        console.log(err);
        setAlertMessage("Unable to fetch election data");
      }
    }

    setup();
  }, [getEthereumContract, setAlertMessage])

  return (
    <div className="election-data">
      <h1>Election Timings</h1>
      {
        electionData && electionData?.constructor?.name === "String" ?
        <p><b>{electionData}</b></p> :
        <>
          <p>Start Time: {new Date(electionData.startTime).toString()}</p>
          <p>End Time: {new Date(electionData.endTime).toString()}</p>
        </>
      }
    </div>
  );
}

export default ElectionData;