import './index.css';
import { useAlert } from "../../context/AlterContext";

function Alert() {
  const { message } = useAlert();

  return message !== "" ? <div className='alert-container'>{message}</div> : <div></div>
}

export default Alert;