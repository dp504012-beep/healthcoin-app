import React, { useState } from "react";
import { apiRequest } from "../api/client";

export default function LoginPage({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loadingAction, setLoadingAction] = useState("");

  function validate() {
    if (!email.trim()) {
      return "Email is required.";
    }

    if (!password) {
      return "Password is required.";
    }

    return "";
  }

  async function submit(path, actionLabel) {
    setMessage("");
    setMessageType("error");

    const validationError = validate();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      setLoadingAction(actionLabel);
      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password })
      });

      setMessageType("success");
      setMessage(`${actionLabel} successful. Loading dashboard...`);
      onAuth(data.user.id, `${actionLabel} successful.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingAction("");
    }
  }

  return React.createElement(
    "main",
    { className: "login-shell" },
    React.createElement(
      "div",
      { className: "login-hero" },
      React.createElement("span", { className: "eyebrow" }, "HealthCoin MVP"),
      React.createElement("h1", null, "HealthFi Console"),
      React.createElement(
        "p",
        null,
        "Track activity, calculate rewards, write ledger entries, and inspect wallet balance from one clean dashboard."
      ),
      React.createElement(
        "div",
        { className: "flow-strip" },
        ["Auth", "Activity", "Reward", "Ledger", "Wallet"].map((item) =>
          React.createElement("span", { key: item }, item)
        )
      )
    ),
    React.createElement(
      "section",
      { className: "login-panel" },
      React.createElement("h2", null, "Sign in"),
      React.createElement(
        "label",
        null,
        "Email",
        React.createElement("input", {
          value: email,
          placeholder: "you@example.com",
          onChange: (event) => setEmail(event.target.value)
        })
      ),
      React.createElement(
        "label",
        null,
        "Password",
        React.createElement("input", {
          type: "password",
          value: password,
          placeholder: "Enter password",
          onChange: (event) => setPassword(event.target.value)
        })
      ),
      React.createElement(
        "div",
        { className: "action-row" },
        React.createElement(
          "button",
          {
            type: "button",
            disabled: Boolean(loadingAction),
            onClick: () => submit("/auth/login", "Login")
          },
          loadingAction === "Login" ? "Logging in..." : "Login"
        ),
        React.createElement(
          "button",
          {
            className: "secondary-button",
            type: "button",
            disabled: Boolean(loadingAction),
            onClick: () => submit("/auth/register", "Register")
          },
          loadingAction === "Register" ? "Registering..." : "Register"
        )
      ),
      message &&
        React.createElement("p", { className: `message ${messageType}`, role: "status" }, message)
    )
  );
}
