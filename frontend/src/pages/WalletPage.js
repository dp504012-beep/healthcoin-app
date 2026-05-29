import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export default function WalletPage({ userId, refreshVersion }) {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadWallet() {
    setMessage("");

    try {
      setIsLoading(true);
      const balanceData = await apiRequest(`/wallet/${userId}/balance`);
      const historyData = await apiRequest(`/wallet/${userId}/history`);

      setBalance(balanceData.balance);
      setHistory(historyData.entries);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadWallet();
  }, [userId, refreshVersion]);

  return React.createElement(
    "section",
    { className: "page-card" },
    React.createElement(
      "div",
      { className: "section-heading" },
      React.createElement(
        "div",
        null,
        React.createElement("span", { className: "eyebrow" }, "Derived balance"),
        React.createElement("h2", null, "Wallet")
      ),
      React.createElement(
        "article",
        { className: "balance-pill" },
        React.createElement("span", null, "Balance"),
        React.createElement("strong", null, balance)
      )
    ),
    React.createElement(
      "button",
      {
        type: "button",
        disabled: isLoading,
        onClick: loadWallet
      },
      isLoading ? "Loading..." : "Refresh"
    ),
    React.createElement("h3", null, "History"),
    isLoading
      ? React.createElement("p", { className: "empty-state" }, "Loading wallet and ledger history...")
      : history.length > 0
      ? React.createElement("pre", null, JSON.stringify(history, null, 2))
      : React.createElement(
          "p",
          { className: "empty-state" },
          balance > 0
            ? "Wallet has a balance, but no detailed history was returned."
            : "Wallet is not initialized yet or has a zero balance. Create a ledger entry to populate it."
        ),
    message && React.createElement("p", { className: "message error" }, message)
  );
}
