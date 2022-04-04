import electionContract from './Elections.json';

export const contractABI = electionContract.abi;
export const contractAddress = electionContract.networks[5777].address;
// export const contractAddress = '0x3dF3030eae91201bc46f1F90a77aC070aEe5b760'

export function currTimestamp() {
  return new Date().getTime();
}

export const BASE_URL_FLASK_APP = "http://127.0.0.1:5000";