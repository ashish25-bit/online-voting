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
  mapping(string => bool) public voter_ids;
  mapping(address => bool) public voter_addresses;
  uint private totalVotes;

  // to keep track of the starting and ending time of the election
  // it will be initialized to zero meaning the elections time has not been set
  uint256 public startTimestamp;
  uint256 public endTimestamp;

  // create the mapping for executors
  // this is done to keep the unique usernames
  mapping(string => Executor) public executors;
  // array for keeping the executors
  string[] public executor_names;

  // error messages
  string[] private executor_messages;
  string[] private password_messages;
  string public no_error;

  constructor() public {
    // default election administrator credentials
    adminUsername = "Admin";
    adminPassword = "1234567890";

    startTimestamp = 0;
    endTimestamp = 0;

    addCandidate("AAP", "Acchhe beete paanch saal, lage raho Kejriwal", "Arvind Kejriwal\nLeader1", 0);
    addCandidate("BJP", "Acchhe din aane wale hai", "PM Narendra Modi\nAmit Sha", 0);
    addCandidate("Congress", "Congress hand in hand with the common man", "Rahul Gandhi\nMan Mohan Singh\nSonia Gandhi", 0);

    // adding error messages
    // for executor
    executor_messages.push("Username already exists");
    executor_messages.push("Role value can only be Viewer or Editor");
    executor_messages.push("Username does not exists");
    // for validating password
    password_messages.push("Username or Password for admin is wrong");
    password_messages.push("Username or Password for executor is wrong");

    no_error = "NA";
  }


  /**
    CANDIDATE FUNCTIONS
  */
  // adding the new political participant
  function addCandidate(string memory _partyName, string memory _partyDescription, string memory _leads, uint256 _curr_timestamp) public {
    if (_curr_timestamp != 0) {
      bool is_valid_action = validate_action(_curr_timestamp);
      if (is_valid_action == false)
        revert("Cannot add candidate");
    }

    candidateCount++;
    uint voteCount = (100 * candidateCount) + (candidateCount % 2);
    candidates[candidateCount] = Candidate(candidateCount, _partyName, _partyDescription, _leads, voteCount);
  }

  // for editing/updating the candidate data
  // type == "name" -> political party name
  // type == "desc" -> political party description
  // type == "leader" -> political party leaders
  function editCandidate(uint _id, string memory _type, string memory _data, uint256 _curr_timestamp) public {
    bool is_valid_action = validate_action(_curr_timestamp);

    if (is_valid_action == false)
      revert("Cannot edit candidate details");

    if (candidates[_id].id == 0)
      revert("Cannot edit candidate details");

    if (keccak256(bytes(_type)) == keccak256(bytes("name")))
      candidates[_id].politicalPartyName = _data;

    else if (keccak256(bytes(_type)) == keccak256(bytes("desc")))
      candidates[_id].politicalPartyDescription = _data;

    else if (keccak256(bytes(_type)) == keccak256(bytes("leader")))
      candidates[_id].leaders = _data;
  }

  function deleteCandidate(uint _id, uint256 _curr_timestamp) public {
    bool is_valid_action = validate_action(_curr_timestamp);

    if (is_valid_action == false)
      revert("Cannot delete candidate");

    candidateCount--;
    delete candidates[_id];
  }

  // to check whether the candidate id is present in the blockchain
  function validate_candidate_id(uint _id) public view returns (bool) {
    if (candidates[_id].id == 0)
      return false;

    return true;
  }

  function reset() public {
    for (uint _id=1; _id <= candidateCount; _id++) {
      if (candidates[_id].id != 0) {
        delete candidates[_id];
      }
    }

    totalVotes = 0;
    candidateCount = 0;
    startTimestamp = 0;
    endTimestamp = 0;
  }


  /**
    EXECUTOR FUNCTIONS
  */
  // adding a new executor
  function addExecutor(string memory _username, string memory _password, uint _role) public {
    if (executors[_username].role != 0)
      revert("Failed to add executor");

    if (_role <= 0 || _role >= 3)
      revert("Failed to add executor");

    executor_names.push(_username);
    executors[_username] = Executor(_username, _password, _role);
  }

  // editing the executor data
  function editExecutorRole(string memory _name, uint _role) public {
    if (executors[_name].role == 0)
      revert("Failed to edit executor role");

    if (_role <= 0 || _role >= 3)
      revert("Failed to edit executor role");

    executors[_name].role = _role;
  }

  function deleteExecutor(string memory _name) public {
    if (executors[_name].role == 0)
      revert("Failed to delete executor");

    uint index = get_executor_index(_name);

    if (index >= executor_names.length)
      revert("Failed to delete executor");

    executor_names[index] = executor_names[executor_names.length - 1];
    executor_names.pop();
    delete executors[_name];
  }

  // function for validating the executor data before adding or editing
  function validate_executor_data(uint _type, string memory _username, uint _role) public view returns (string memory) {
    // adding new executor
    if (_type == 1) {
      if (executors[_username].role != 0)
        return executor_messages[0];

      if (_role <= 0 || _role >= 3)
        return executor_messages[1];
    }

    // editing existing executor
    else if (_type == 2) {
      if (executors[_username].role == 0)
        return executor_messages[2];

      if (_role <= 0 || _role >= 3)
        return executor_messages[1];
    }

    return no_error;
  }

  // to get the total number of executors added by the admininstrator
  function executorArrayLength() public view returns(uint count) {
    return executor_names.length;
  }

  function get_executor_index(string memory _name) private view returns (uint) {
    for (uint i = 0 ; i < executor_names.length; i++) {
      if (keccak256(bytes(_name)) == keccak256(bytes(executor_names[i])))
        return i;
    }

    return executor_names.length + 1;
  }


  /**
    VOTING LOGIC
  */
  // voting event
  event voteEvent (
    uint indexed _candidateID
  );

  // this is the main function for the application
  // this will handle the vote logic of the appliation
  // voter id number and the candidate id is required as arguments to this function
  function vote(string memory _voterId, uint _candidateID, uint _currentTimestamp) public {
    // check whether the election time has been set or not
    if (startTimestamp == 0 || endTimestamp == 0) {
      revert("Elections has not started yet");
    }

    // check whether the vote within the time frame of the elections
    if (_currentTimestamp < startTimestamp || _currentTimestamp > endTimestamp) {
      revert("Current Timestamp out of bound");
    }

    // check for the voter id in the voter_ids mapping
    if (voter_ids[_voterId] == true) {
      revert("Voter id already present in the mapping");
    }

    if (candidates[_candidateID].id == 0) {
      revert("Candidate is not valid");
    }

    // check for the device address in the voter_address mapping
    if (voter_addresses[msg.sender] == true) {
      revert("Account Address already present in the mapping. Please use another account");
    }

    // change the data
    voter_ids[_voterId] = true;
    voter_addresses[msg.sender] = true;
    totalVotes++;
    candidates[_candidateID].voteCount++;

    // trigger event
    emit voteEvent(_candidateID);
  }

  // required argument is the voter id
  // returns an integer
  // return value == 1: means that the voter id is already present in the mapping
  // return value == 2: means that the account address is already present in the mapping
  // return value == 0: means that the user is good to go
  function validate_system_and_id(string memory _voterId) public view returns (uint) {
    if (voter_ids[_voterId] == true) {
      return 1;
    }

    if (voter_addresses[msg.sender] == true) {
      return 2;
    }

    return 0;
  }

  // return 0: election time has not been set yet
  // return 1: election is ongoing
  // return 2: election has not started yet
  // return 3: election has ended
  function voting_status(uint256 _curr_timestamp) public view returns (int) {
    if (startTimestamp == 0 || endTimestamp == 0) {
      return 0;
    }

    else if (_curr_timestamp > endTimestamp) {
      return 3;
    }

    else if (_curr_timestamp < startTimestamp) {
      return 2;
    }

    return 1;
  }


  /**
    MISCELLANEOUS FUNCTIONS
  */
  // add the current timestamp and check that the start timestamp is valid
  function changeElectionTiming(uint256 _start_timestamp, uint _end_timestamp, uint256 _curr_timestamp) public {
    bool is_valid_action = validate_action(_curr_timestamp);

    if (is_valid_action == false)
      revert("Cannot change election timings now");

    startTimestamp = _start_timestamp;
    endTimestamp = _end_timestamp;
    totalVotes = 0;
  }

  function validate_timestamp(uint256 _start_timestamp, uint _end_timestamp, uint256 _curr_timestamp) public view returns (string memory) {
    if (_start_timestamp < _curr_timestamp || _end_timestamp < _curr_timestamp) {
      return "Selected time has already gone";
    }

    if (_start_timestamp >= _end_timestamp) {
      return "Start time is after End Time";
    }

    if (_curr_timestamp < _start_timestamp && _curr_timestamp < endTimestamp)
      return no_error;

    bool is_valid_action = validate_action(_curr_timestamp);
    if (is_valid_action == false) {
      return "Cannot change the timing since the election is going on";
    }

    if (_start_timestamp >= _end_timestamp) {
      return "Start time should be less than End time";
    }

    if ((_end_timestamp - _start_timestamp) < 3600000) {
      return "Minimum Window for voting should be atleast one hour";
    }

    if ((_end_timestamp - _start_timestamp) > 36000000) {
      return "Window for voting should not exceed 10 hours";
    }

    return no_error;
  }

  // verifying the username and password for the administrator or the executors
  function verifyPassword(string memory _username, string memory _password, uint _type) public view returns (string memory) {
    // for admin
    if (_type == 1) {
      if (
        keccak256(bytes(_username)) == keccak256(bytes(adminUsername)) &&
        keccak256(bytes(_password)) == keccak256(bytes(adminPassword))
      )
        return no_error;

      return password_messages[0];
    }

    // for executor
    else if (_type == 2) {
      if (executors[_username].role == 0)
        return executor_messages[2];

      if (keccak256(bytes(_password)) == keccak256(bytes(executors[_username].password)))
        return no_error;

      return password_messages[1];
    }

    return no_error;
  }

  // change password
  // _type == 1 -> administrator
  // _type == 2 -> executor
  function changePassword(string memory _name, string memory _new_password, uint _type) public {
    // for administrator
    if (_type == 1) {
      adminPassword = _new_password;
    }

    // for the executor
    if (_type == 2) {
      if (executors[_name].role == 0)
        revert("Failed to change password");

      executors[_name].password = _new_password;
    }
  }

  // function for getting type of user for logging in
  function get_user_type(string memory _username) public view returns (int) {
    // for admin
    if (keccak256(bytes(_username)) == keccak256(bytes(adminUsername)))
      return 1;

    // for executor
    if (executors[_username].role != 0) {
      return int(executors[_username].role + 1);
    }

    return -1;
  }

  // returns the total number of votes casted since the total_votes variable is private 
  function get_total_votes() public view returns (uint count) {
    return totalVotes;
  }

  // this function will return the current timestamp
  function timestamp() public view returns (uint256) {
    return block.timestamp;
  }

  function validate_action(uint256 _curr_timestamp) public view returns (bool) {
    if (startTimestamp == 0 || endTimestamp == 0)
      return true;

    if (_curr_timestamp >= startTimestamp && _curr_timestamp <= endTimestamp)
      return false;

    return true;
  }
}