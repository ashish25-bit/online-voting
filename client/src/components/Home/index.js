import useTitle from "../../hooks/useTitle";
import { useElection } from "../../context/ElectionContext";
import { useAlert } from "../../context/AlterContext";
import "./index.css";
import { useRef, useState } from "react";

function Home() {
  const { getEthereumContract } = useElection();
  const { setAlertMessage } = useAlert();
  useTitle('Home Page');
  const [data, setData] = useState({
    fetched: false,
    value: null,
  });
  const inputRef = useRef();

  async function clickHandler(e) {
    try {
      e.target.disabled = true;
      const { provider } = await getEthereumContract();

      const data = inputRef?.current?.value;

      if (!data || data.trim().length === 0) {
        e.target.disabled = false;
        throw new Error("Transaction hash required");
      }

      setData(prevState => ({ ...prevState, fetched: false }))

      let res = await provider.getTransactionReceipt(data);
      if (!res) {
        setData((prevState) => ({ ...prevState, fetched: true, value: null }));
        e.target.disabled = false;
        return;
      }

      const value = {
        blockHash: res.blockHash,
        blockNumber: res.blockNumber,
        confirmations: res.confirmations,
        cumulativeGasUsed: res.cumulativeGasUsed.toNumber(),
        from: res.from,
        transactionHash: res.transactionHash,
      };

      setData((prevState) => ({ ...prevState, fetched: true, value }));
      e.target.disabled = false;
    }
    catch (err) {
      setAlertMessage(err.message);
      console.log(err);
      e.target.disabled = false;
    }
  }

  return (
    <div className="home-container">
      <h1>Check transaction data here:</h1>
      <input
        ref={inputRef}
        type={"text"}
        placeholder="0x6d5c9e45bd2323c5d7da050af86d37eee2bdc53fc01fd42a42b70bab889092aa"
      />
      <button onClick={clickHandler}>Click</button>

      <div className="result">
        {data.fetched && data.value === null && (
          <>No transaction for the provided transaction hash</>
        )}
        {data.fetched && data.value !== null && (
          <>
            {Object.entries(data.value).map(([key, value], index) => (
              <div key={index}>{key}: {value}</div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
