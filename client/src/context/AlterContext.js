import { createContext, useContext, useState } from "react";

const AlterContext = createContext();
export function useAlert() {
  return useContext(AlterContext);
}

const ALERT_MESSAGE_TIME = 5000;

export const AlertProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  function setAlertMessage(data) {
    if (!data || data === "")
      return;

    setMessage(data);

    setTimeout(() => setMessage(""), ALERT_MESSAGE_TIME);
  }

  return (
    <AlterContext.Provider
      value={{
        message,
        setAlertMessage
      }}
    >
      {children}
    </AlterContext.Provider>
  )
}
