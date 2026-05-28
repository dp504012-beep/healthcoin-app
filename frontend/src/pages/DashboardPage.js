import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export default function DashboardPage({ userId }) {
  const [rewardPoints, setRewardPoints] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    setMessage("");

    try {
      const reward = await apiRequest(`/reward/${userId}`);
      const wallet = await apiRequest(`/wallet/${userId}/balance`);

      setRewardPoints(reward.totalPoints);
      setWalletBalance(wallet.balance);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [userId]);

  return React.createElement(
    "section",
    null,
    React.createElement("h2", null, "Dashboard"),
    React.createElement("p", null, `User ID: ${userId}`),
    React.createElement("p", null, `Reward Points: ${rewardPoints}`),
    React.createElement("p", null, `Wallet Balance: ${walletBalance}`),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: loadDashboard
      },
      "Refresh"
    ),
    message && React.createElement("p", null, message)
  );
}
