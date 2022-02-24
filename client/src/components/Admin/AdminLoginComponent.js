import React, { useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useElection } from '../../context/ElectionContext';

function AdminLoginComponent() {

  const userNameRef = useRef();
  const passwordRef = useRef();
  const { getEthereumContract } = useElection();
  const { authAdmin } = useAdmin();

  useEffect(() => {
    userNameRef.current.value = "Admin";
    passwordRef.current.value = "1234567890";
  }, [])

  async function loginAdmin() {
    try {
      const { electionContract: contract } = await getEthereumContract();
      const name = userNameRef.current.value;
      const password = passwordRef.current.value;

      const result = await contract.verifyPassword(name, password);
      if (result)
        authAdmin(name, password);
      else {
        console.log('wrong password or username');
        authAdmin(null, null);
      }
    }
    catch (err) {
      console.log(err);
      authAdmin(null, null);
    }
  }

  return (
    <div>
      <input ref={userNameRef} type={"text"} placeholder="enter the username" />
      <input ref={passwordRef} type={"text"} placeholder="enter the password" />
      <button onClick={loginAdmin}>Login</button>
    </div>
  );
}

export default AdminLoginComponent;
