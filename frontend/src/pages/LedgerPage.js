import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export default function LedgerPage({ userId, lastActivity, onLedgerCreated }) {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function loadLedgerEntries() {
    setMessage("");

    try {
      setIsLoading(true);
      const data = await apiRequest(`/ledger/${userId}`);
      setLedgerEntries(data.ledgerEntries);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLedgerEntries();
  }, [userId]);

  async function createLedgerEntry() {
    setMessage("");
    setMessageType("error");

    if (!lastActivity) {
      setMessage("Submit an activity first.");
      return;
    }

    try {
      setIsCreating(true);
      const data = await apiRequest("/ledger/reward", {
        method: "POST",
        body: JSON.stringify({
          userId,
          activityId: lastActivity.activityId,
          type: "EARN"
        })
      });

      setLedgerEntries((current) => [...current, data.ledgerEntry]);
      setMessageType("success");
      setMessage("Reward ledger entry created successfully.");
      onLedgerCreated(data.ledgerEntry);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsCreating(false);
    }
  }

  return React.createElement(
    "section",
    { className: "page-card" },
    React.createElement(
      "div",
      { className: "section-heading" },
      React.createElement(
        "div",
        null,
        React.createElement("span", { className: "eyebrow" }, "Append-only"),
        React.createElement("h2", null, "Ledger")
      ),
      React.createElement(
        "p",
        null,
        lastActivity ? `Latest activity: ${lastActivity.activityId}` : "Create an activity before writing a reward entry."
      )
    ),
    React.createElement(
      "button",
      {
        type: "button",
        disabled: isCreating,
        onClick: createLedgerEntry
      },
      isCreating ? "Creating..." : "Create Ledger Entry"
    ),
    React.createElement(
      "button",
      {
        className: "secondary-button",
        type: "button",
        disabled: isLoading,
        onClick: loadLedgerEntries
      },
      isLoading ? "Loading..." : "Refresh Ledger"
    ),
    message && React.createElement("p", { className: `message ${messageType}`, role: "status" }, message),
    isLoading
      ? React.createElement("p", { className: "empty-state" }, "Loading ledger entries...")
      : ledgerEntries.length > 0 &&
      React.createElement("pre", null, JSON.stringify(ledgerEntries, null, 2)),
    !isLoading &&
      ledgerEntries.length === 0 &&
      React.createElement("p", { className: "empty-state" }, "No ledger entries yet. Create a reward entry after submitting activity.")
  );
}
