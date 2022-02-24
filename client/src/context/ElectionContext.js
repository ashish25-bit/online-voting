import { ethers } from 'ethers';
import { createContext, useCallback, useContext, useEffect, useState} from 'react';
import { contractABI, contractAddress } from '../utils/constant';

const ElectionContext = createContext();
export function useElection() {
  return useContext(ElectionContext);
}

const { ethereum } = window;

const getEthereumContract = async () => {
  try {
    if (!ethereum) {
      throw new Error("Metamask Not installed");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const electionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return { provider, signer, electionContract };
  }
  catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

export const ElectionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();

  const checkIfWalletConnected = useCallback(async() => {
    try {
      if (!ethereum)
        return alert("Metamask not installed");

      const accounts = await ethereum.request({ method: 'eth_accounts', });

      if (accounts.length)
        setCurrentAccount(accounts[0]);
    }
    catch (err) {
      console.log(err);
    }

  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (!ethereum)
        return alert("Metamask not installed");

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    }
    catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    checkIfWalletConnected();
  },  [checkIfWalletConnected]);

  return (
    <ElectionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        getEthereumContract
      }}
    >
      {children}
    </ElectionContext.Provider>
  )
}
