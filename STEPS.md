* Launch ganache application to make your system a local ethereum blockchain

* Go to smart_contract folder and deploy the smart contracts using the command given below
```pwsh
cd smart_contract
truffle migrate --reset
```

* In the root directory of the project run __createFile.js__ file to take the newly build smart contract file.
```cmd
node createFile.js
```

* Connect your metamask wallet to one of the dummy accounts given by ganache. Copy the paraphrase generate in ganache. Open metamask and click on __Import using recovery phrase__ or *__mnemonic__* and paste the paraphrase there.

* Run the flask server
```pwsh
cd server
python app.py
```

* Run the client side application
```pwsh
cd client
npm start
```