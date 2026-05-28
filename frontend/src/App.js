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

  if (!userId) {
    return React.createElement(LoginPage, { onAuth: setUserId });
  }

  return React.createElement(
    "main",
    null,
    React.createElement("h1", null, "HealthCoin"),
    React.createElement(
      "nav",
      null,
      Object.entries(pages).map(([key, label]) =>
        React.createElement(
          "button",
          {
            key,
            type: "button",
            onClick: () => setPage(key)
          },
          label
        )
      ),
      React.createElement(
        "button",
        {
          type: "button",
          onClick: () => setUserId("")
        },
        "Logout"
      )
    ),
    page === "dashboard" && React.createElement(DashboardPage, { userId }),
    page === "activity" &&
      React.createElement(ActivityPage, {
        userId,
        onActivityCreated: setLastActivity
      }),
    page === "ledger" &&
      React.createElement(LedgerPage, {
        userId,
        lastActivity
      }),
    page === "wallet" && React.createElement(WalletPage, { userId })
  );
}
