import useTitle from '../../hooks/useTitle';
import { useElection } from '../../context/ElectionContext';

function Home() {
  const { getEthereumContract } = useElection();
  useTitle('Home Page');

  async function clickHandler() {
    try {
      const { electionContract: contract, provider } = await getEthereumContract();
      const transaction = await contract.vote("1234", 1);
      const blockHash = await provider.waitForTransaction(transaction.hash);
      const res = await provider.getBlockWithTransactions(blockHash.blockHash);
      console.log(res)
    }
    catch (err) {
      console.log(err)
    }
  }

  return <div>
    <h1>Home</h1>
    <button onClick={clickHandler}>Click</button>
  </div>
}

export default Home;
