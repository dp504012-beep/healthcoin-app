import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export default function WalletPage({ userId }) {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  async function loadWallet() {
    setMessage("");

    try {
      const balanceData = await apiRequest(`/wallet/${userId}/balance`);
      const historyData = await apiRequest(`/wallet/${userId}/history`);

      setBalance(balanceData.balance);
      setHistory(historyData.entries);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadWallet();
  }, [userId]);

  return React.createElement(
    "section",
    null,
    React.createElement("h2", null, "Wallet"),
    React.createElement("p", null, `Balance: ${balance}`),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: loadWallet
      },
      "Refresh"
    ),
    React.createElement("h3", null, "History"),
    history.length > 0
      ? React.createElement("pre", null, JSON.stringify(history, null, 2))
      : React.createElement("p", null, "No wallet history yet."),
    message && React.createElement("p", null, message)
  );
}
