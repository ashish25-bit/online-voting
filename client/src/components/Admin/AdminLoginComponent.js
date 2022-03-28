import './index.css';
import React, { useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useElection } from '../../context/ElectionContext';
import { useAlert } from '../../context/AlterContext';

function AdminLoginComponent() {

  const userNameRef = useRef();
  const passwordRef = useRef();
  const { getEthereumContract } = useElection();
  const { authAdmin } = useAdmin();
  const { setAlertMessage } = useAlert();

  useEffect(() => {
    userNameRef.current.value = "Ashish";
    passwordRef.current.value = "1234";
  }, [])

  async function loginAdmin(e) {
    e.preventDefault();

    try {
      const { electionContract: contract } = await getEthereumContract();
      const name = userNameRef.current.value;
      const password = passwordRef.current.value;

      const role = (await contract.get_user_type(name)).toNumber();

      if (role === -1) {
        setAlertMessage(`${name} is not present`);
        return;
      }

      let type = role === 1 ? 1 : 2;
      const result = await contract.verifyPassword(name, password, type);
      const no_error = await contract.no_error();

      if (result === no_error)
        authAdmin(name, password, role);
      else {
        setAlertMessage(result)
        authAdmin(null, null, -1);
      }
    }
    catch (err) {
      console.log(err);
      authAdmin(null, null, -1);
      setAlertMessage("Error while logging in.")
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
