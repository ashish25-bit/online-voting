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

  string private adminUsername;
  string private adminPassword;

  uint public startTimestamp;
  uint public endTimestamp;

  mapping(string => bool) public voters;
  uint public totalVotes;

  constructor() public {
    adminUsername = "Admin";
    adminPassword = "1234567890";

    startTimestamp = 1644820200000;
    endTimestamp   = 1644827400000;

    addCandidate("AAP", "Acchhe beete paanch saal, lage raho Kejriwal", "Arvind Kejriwal\nLeader1");
    addCandidate("BJP", "Acchhe din aane wale hai", "PM Narendra Modi\nAmit Sha");
    addCandidate("Congress", "Congress hand in hand with the common man", "Rahul Gandhi\nMan Mohan Singh\nSonia Gandhi");
  }

  function addCandidate(string memory _partyName, string memory _partyDescription, string memory _leads) public {
    candidateCount++;
    candidates[candidateCount] = Candidate(candidateCount, _partyName, _partyDescription, _leads, 0);
  }

  function vote(string memory _voterId, uint _candidateID, uint _currentTimestamp) public returns (bool) {
    if (_currentTimestamp < startTimestamp || _currentTimestamp > endTimestamp)
      return false;

    voters[_voterId] = true;
    totalVotes++;
    candidates[_candidateID].voteCount++;
    return true;
  }

  function verifyPassword(string memory _username, string memory _password) public view returns (bool) {
    if (
      keccak256(bytes(_username)) == keccak256(bytes(adminUsername)) &&
      keccak256(bytes(_password)) == keccak256(bytes(adminPassword))
    )
      return true;

    return false;
  }

  function changeStartDate(uint _timestamp) public {
    startTimestamp = _timestamp;
  }

  function changeEndDate(uint _timestamp) public {
    endTimestamp = _timestamp;
  }
}