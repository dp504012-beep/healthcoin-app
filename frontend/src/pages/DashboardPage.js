import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export default function DashboardPage({ userId, refreshVersion }) {
  const [rewardPoints, setRewardPoints] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadDashboard() {
    setMessage("");

    try {
      setIsLoading(true);
      const reward = await apiRequest(`/reward/${userId}`);
      const wallet = await apiRequest(`/wallet/${userId}/balance`);

      setRewardPoints(reward.totalPoints);
      setWalletBalance(wallet.balance);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
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
        React.createElement("span", { className: "eyebrow" }, "Overview"),
        React.createElement("h2", null, "User Dashboard")
      ),
      React.createElement("p", { className: "user-id" }, `Current User ID: ${userId}`)
    ),
    React.createElement(
      "div",
      { className: "stats-grid" },
      React.createElement(
        "article",
        { className: "stat-card" },
        React.createElement("span", null, "Reward Points"),
        React.createElement("strong", null, rewardPoints),
        React.createElement("small", null, "Calculated from persisted activities")
      ),
      React.createElement(
        "article",
        { className: "stat-card" },
        React.createElement("span", null, "Wallet Balance"),
        React.createElement("strong", null, walletBalance),
        React.createElement("small", null, "Derived from ledger entries")
      )
    ),
    React.createElement(
      "button",
      {
        type: "button",
        disabled: isLoading,
        onClick: loadDashboard
      },
      isLoading ? "Refreshing..." : "Refresh"
    ),
    message && React.createElement("p", { className: "message error" }, message)
  );
}
