import React, { useState } from "react";
import { apiRequest } from "../api/client";

export default function LedgerPage({ userId, lastActivity }) {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [message, setMessage] = useState("");

  async function createLedgerEntry() {
    setMessage("");

    if (!lastActivity) {
      setMessage("Submit an activity first.");
      return;
    }

    try {
      const reward = await apiRequest(`/reward/${userId}`);
      const rewardItem = reward.rewards.find(
        (item) => item.activityId === lastActivity.activityId
      );

      if (!rewardItem) {
        setMessage("No reward points available for the latest activity.");
        return;
      }

      const data = await apiRequest("/ledger/reward", {
        method: "POST",
        body: JSON.stringify({
          userId,
          activityId: rewardItem.activityId,
          points: rewardItem.points,
          type: "EARN"
        })
      });

      setLedgerEntries((current) => [...current, data.ledgerEntry]);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return React.createElement(
    "section",
    null,
    React.createElement("h2", null, "Ledger"),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: createLedgerEntry
      },
      "Create Ledger Entry"
    ),
    message && React.createElement("p", null, message),
    ledgerEntries.length > 0 &&
      React.createElement("pre", null, JSON.stringify(ledgerEntries, null, 2))
  );
}
