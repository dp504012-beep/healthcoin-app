import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ActivityPage from "./pages/ActivityPage";
import LedgerPage from "./pages/LedgerPage";
import WalletPage from "./pages/WalletPage";

const pages = {
  dashboard: "Dashboard",
  activity: "Activity",
  ledger: "Ledger",
  wallet: "Wallet"
};

export default function App() {
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState("dashboard");
  const [lastActivity, setLastActivity] = useState(null);
  const [appMessage, setAppMessage] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);

  function handleAuth(nextUserId, message) {
    setUserId(nextUserId);
    setPage("dashboard");
    setLastActivity(null);
    setAppMessage(message);
    setRefreshVersion((current) => current + 1);
  }

  function handleActivityCreated(activity) {
    setLastActivity(activity);
    setPage("ledger");
    setRefreshVersion((current) => current + 1);
    setAppMessage("Activity submitted. Review the reward and create a ledger entry.");
  }

  function handleLedgerCreated() {
    setPage("wallet");
    setRefreshVersion((current) => current + 1);
    setAppMessage("Ledger entry created. Wallet balance refreshed.");
  }

  function handleLogout() {
    setUserId("");
    setPage("dashboard");
    setLastActivity(null);
    setAppMessage("");
  }

  if (!userId) {
    return React.createElement(LoginPage, { onAuth: handleAuth });
  }

  return React.createElement(
    "main",
    { className: "app-shell" },
    React.createElement(
      "aside",
      { className: "sidebar" },
      React.createElement(
        "div",
        { className: "brand-block" },
        React.createElement("span", { className: "brand-mark" }, "H"),
        React.createElement(
          "div",
          null,
          React.createElement("strong", null, "HealthFi"),
          React.createElement("small", null, "MVP Console")
        )
      ),
      React.createElement(
        "nav",
        null,
        Object.entries(pages).map(([key, label]) =>
          React.createElement(
            "button",
            {
              key,
              type: "button",
              className: page === key ? "active" : "",
              onClick: () => setPage(key)
            },
            label
          )
        )
      ),
      React.createElement(
        "button",
        {
          className: "logout-button",
          type: "button",
          onClick: handleLogout
        },
        "Logout"
      )
    ),
    React.createElement(
      "div",
      { className: "content-shell" },
      React.createElement(
        "header",
        { className: "app-header" },
        React.createElement(
          "div",
          null,
          React.createElement("span", { className: "eyebrow" }, "HealthCoin MVP"),
          React.createElement("h1", null, "HealthFi Operations"),
          React.createElement(
            "p",
            null,
            "AI exercise validation, reward points, append-only ledger, and wallet balance in one operational console."
          )
        ),
        React.createElement(
          "div",
          { className: "header-status" },
          React.createElement("span", null, "Active user"),
          React.createElement("strong", null, userId)
        )
      ),
      appMessage &&
        React.createElement(
          "p",
          { className: "message success", role: "status" },
          appMessage
        ),
      page === "dashboard" &&
        React.createElement(DashboardPage, {
          userId,
          refreshVersion
        }),
      page === "activity" &&
        React.createElement(ActivityPage, {
          userId,
          onActivityCreated: handleActivityCreated
        }),
      page === "ledger" &&
        React.createElement(LedgerPage, {
          userId,
          lastActivity,
          onLedgerCreated: handleLedgerCreated
        }),
      page === "wallet" &&
        React.createElement(WalletPage, {
          userId,
          refreshVersion
        })
    )
  );
}
