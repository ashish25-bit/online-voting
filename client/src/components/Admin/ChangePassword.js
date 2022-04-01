import { useElection } from '../../context/ElectionContext';
import { useAdmin } from '../../context/AdminContext';
import { useAlert } from "../../context/AlterContext";
import { useRef } from 'react';

function ChangePassword() {
  const { getEthereumContract } = useElection();
  const { setAlertMessage } = useAlert();
  const { authData, authAdmin } = useAdmin();

  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();

  async function changePassword() {
    try {
      const { electionContract: contract } = await getEthereumContract();
      const no_error = await contract.no_error();

      const username = authData.username;
      const currentPassword = currentPasswordRef.current.value.trim();
      const newPassword = newPasswordRef.current.value.trim();

      if (currentPassword === "" || newPassword === "") {
        setAlertMessage("Password field cannot be empty");
        return;
      }

      const type = (await contract.get_user_type(username)).toNumber();
      if (type === -1) {
        setAlertMessage("Unable to change password");
        return;
      }

      const is_old_password_correct = await contract.verifyPassword(username, currentPassword, type);

      if (is_old_password_correct !== no_error) {
        setAlertMessage('Current Password is incorrect');
        return;
      }

      await contract.changePassword(username, newPassword, type);
      authAdmin(username, newPassword, type);
      setAlertMessage('Password changed successfully');
      currentPasswordRef.current.value = "";
      newPasswordRef.current.value = "";
    }
    catch (err) {
      console.log(err);
      setAlertMessage('Unable to change password');
    }
  }

  return (
    <div className="change-password-container">
      <h1>Change Password</h1>
      <input type={"password"} ref={currentPasswordRef} placeholder="Enter Current Password" />
      <input type={"password"} ref={newPasswordRef} placeholder="Enter New Password" />
      <button onClick={changePassword}>Change</button>
    </div>
  )
}

export default ChangePassword;