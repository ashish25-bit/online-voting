import { useCallback, useEffect, useState } from "react";
import { useElection } from "../../context/ElectionContext";

function ExecutorListComponent() {
  const [executorData, setExecutorData] = useState([]);

  const { getEthereumContract } = useElection();

  const getAllExecutors = useCallback(async () => {
    const { electionContract: contract } = await getEthereumContract();
    const executorLength = (await contract.executorArrayLength()).toNumber();
    let result = [];

    for (let i = 0; i < executorLength; i++) {
      try {
        const name = await contract.executor_names(i);
        const role = (await contract.executors(name)).role.toNumber();
        result.push({ name, role });
      }
      catch (_err) {
        console.log(_err);
      }
    }

    return result;
  }, [getEthereumContract]);

  useEffect(() => {
    async function fetchData() {
      try {
        let result = await getAllExecutors();
        console.log(result)
        setExecutorData(result);
      }
      catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [getAllExecutors])

  return (
    <div className="executor-list">
      <h1>Executor List</h1>
      {executorData.map((data, index) => {
        return (
          <div key={index}>
            <p>
              <b>{data.name}</b>
            </p>
            <p>
              {data.role === 1 && <small>Viewer</small>}
              {data.role === 2 && <small>Editor</small>}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ExecutorListComponent;
