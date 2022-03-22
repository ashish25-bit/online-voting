pragma solidity ^0.5.16;

contract Election {
  // to store the inforamtion about the candidates
  struct Candidate {
    uint id;
    string politicalPartyName;
    string politicalPartyDescription;
    string leaders;
    uint voteCount;
  }

  // structure for executors
  // username: for login username
  // password: for login password
  // role: viewer or editor
  // role value = 1: viewer
  // role value = 2: editor
  struct Executor {
    string username;
    string password;
    uint role;
  }

  // fetch the candidate
  mapping(uint => Candidate) public candidates;
  uint public candidateCount;

  // election admininstrator
  string private adminUsername;
  string private adminPassword;

  // store the mapping of voter id number who has already voted
  mapping(string => bool) public voters;
  uint public totalVotes;

  // to keep track of the starting and ending time of the election
  // it will be initialized to zero meaning the elections time has not been set
  uint256 public startTimestamp;
  uint256 public endTimestamp;

  // create the mapping for executors
  // this is done to keep the unique usernames
  mapping(string => Executor) public executors;
  // array for keeping the executors
  string[] public executor_names;


  constructor() public {
    // default election administrator credentials
    adminUsername = "Admin";
    adminPassword = "1234567890";

    startTimestamp = 0;
    endTimestamp = 0;

    addCandidate("AAP", "Acchhe beete paanch saal, lage raho Kejriwal", "Arvind Kejriwal\nLeader1");
    addCandidate("BJP", "Acchhe din aane wale hai", "PM Narendra Modi\nAmit Sha");
    addCandidate("Congress", "Congress hand in hand with the common man", "Rahul Gandhi\nMan Mohan Singh\nSonia Gandhi");
  }

  // this function will return the current timestamp
  function timestamp() public view returns (uint256) {
    return block.timestamp;
  }

  // adding the new political participant
  function addCandidate(string memory _partyName, string memory _partyDescription, string memory _leads) public returns (bool) {
    candidateCount++;
    candidates[candidateCount] = Candidate(candidateCount, _partyName, _partyDescription, _leads, 0);
    return true;
  }

  // for editing/updating the candidate data
  // type == "name" -> political party name
  // type == "desc" -> political party description
  // type == "leader" -> political party leaders
  function editCandidate(uint _id, string memory _type, string memory _data) public {
    if (candidates[_id].id == 0)
      return;

    if (keccak256(bytes(_type)) == keccak256(bytes("name")))
      candidates[_id].politicalPartyName = _data;

    else if (keccak256(bytes(_type)) == keccak256(bytes("desc")))
      candidates[_id].politicalPartyDescription = _data;

    else if (keccak256(bytes(_type)) == keccak256(bytes("leader")))
      candidates[_id].leaders = _data;
  }

  // this is the main function for the application
  // this will handle the vote logic of the appliation
  // voter id number and the candidate id is required as arguments to this function
  function vote(string memory _voterId, uint _candidateID, uint _currentTimestamp) public returns (bool) {
    if (_currentTimestamp < startTimestamp || _currentTimestamp > endTimestamp)
      return false;

    voters[_voterId] = true;
    totalVotes++;
    candidates[_candidateID].voteCount++;
    return true;
  }

  // verifying the username and password for the administrator or the executors
  function verifyPassword(string memory _username, string memory _password) public view returns (bool) {
    if (
      keccak256(bytes(_username)) == keccak256(bytes(adminUsername)) &&
      keccak256(bytes(_password)) == keccak256(bytes(adminPassword))
    )
      return true;

    return false;
  }

  // add the current timestamp and check that the start timestamp is valid
  function changeStartDate(uint256 _timestamp) public {
    startTimestamp = _timestamp;
  }

  // add the current timestamp and check the end timestamp is valid
  function changeEndDate(uint256 _timestamp) public {
    endTimestamp = _timestamp;
  }

  // change password
  // _type == 1 -> administrator
  // _type == 2 -> executor
  function changePassword(string memory _name, string memory _new_password, uint _type) public returns (bool) {
    // for administrator
    if (_type == 1) {
      if (keccak256(bytes(_name)) == keccak256(bytes(adminUsername))) {
        adminPassword = _new_password;
        return true;
      }
      return false;
    }

    // for the executor
    if (_type == 2) {
      if (executors[_name].role == 0)
        return false;

      executors[_name].password = _new_password;
      return true;
    }

    return false;
  }

  // adding a new executor
  function addExecutor(string memory _username, string memory _password, uint _role) public returns (bool) {
    if (executors[_username].role != 0)
      return false;

    if (_role <= 0 || _role >= 3)
      return false;

    executor_names.push(_username);
    executors[_username] = Executor(_username, _password, _role);
    return true;
  }

  // editing the executor data
  function editExecutorRole(string memory _name, uint _role) public returns (bool) {
    if (executors[_name].role == 0)
      return false;

    if (_role <= 0 || _role >= 3)
      return false;

    executors[_name].role = _role;
  }

  function deleteExecutor(string memory _name) public returns (bool) {
    if (executors[_name].role == 0)
      return false;

    return true;
  }

  // to get the total number of executors added by the admininstrator
  function executorArrayLength() public view returns(uint count) {
    return executor_names.length;
  }
}