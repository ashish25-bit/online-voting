pragma solidity ^0.5.16;

contract Election {
  struct Candidate {
    uint id;
    string politicalPartyName;
    string politicalPartyDescription;
    string leaders;
    uint voteCount;
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
    return false;
  }
}