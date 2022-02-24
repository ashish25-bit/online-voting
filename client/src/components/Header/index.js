import React from "react";
import { useElection } from "../../context/ElectionContext";
import { Link } from "react-router-dom";

function Header() {
  const { currentAccount, connectWallet } = useElection();

  return (
    <div>
      {currentAccount && (
        <p>
          <b>Current Account: {currentAccount}</b>
        </p>
      )}
      {!currentAccount && <button onClick={connectWallet}>Connect</button>}
      {currentAccount && (
        <div>
          <Link to="/">Home</Link> <Link to="/voter">Vote</Link>{" "}
          <Link to="/admin">Admin</Link>{" "}
          <Link to="/participating-parties">Participating Parties</Link>{" "}
        </div>
      )}
      <hr />
    </div>
  );
}

export default Header;
