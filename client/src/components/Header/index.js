import "./index.css";
import React from "react";
import { useElection } from "../../context/ElectionContext";
import { Link } from "react-router-dom";

function Header() {
  const { currentAccount, connectWallet } = useElection();

  async function clickHandler(e) {
    try {
      e.target.disabled = true;
      await connectWallet();
      console.log("connected to wallet");
    } catch (err) {
      console.log("first");
    }
  }

  return (
    <div className="header">
      {currentAccount && (
        <p>
          Current Account: <b>{currentAccount}</b>
        </p>
      )}
      {!currentAccount && (
        <button onClick={clickHandler}>Connect TO metamask wallet</button>
      )}
      {currentAccount && (
        <div style={{ marginTop: "20px" }}>
          <Link to="/">Home</Link> <Link to="/voter">Vote</Link>{" "}
          <Link to="/admin">Admin</Link>{" "}
          <Link to="/participating-parties">Participating Parties</Link>{" "}
        </div>
      )}
    </div>
  );
}

export default Header;
