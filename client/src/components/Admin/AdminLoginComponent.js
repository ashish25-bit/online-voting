import './index.css';
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

  async function loginAdmin(e) {
    e.preventDefault();

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
    <form onSubmit={loginAdmin} className='admin-login'>
      <input ref={userNameRef} type={"text"} placeholder="enter the username" />
      <input ref={passwordRef} type={"password"} placeholder="enter the password" />
      <button type={"submit"}>Login</button>
    </form>
  );
}

export default AdminLoginComponent;
