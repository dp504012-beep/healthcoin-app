import React, { useState } from "react";
import { apiRequest } from "../api/client";

export default function LoginPage({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(path) {
    setMessage("");

    try {
      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      onAuth(data.user.id);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return React.createElement(
    "main",
    null,
    React.createElement("h1", null, "HealthCoin Login"),
    React.createElement(
      "label",
      null,
      "Email",
      React.createElement("input", {
        value: email,
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
        onChange: (event) => setPassword(event.target.value)
      })
    ),
    React.createElement(
      "div",
      null,
      React.createElement(
        "button",
        {
          type: "button",
          onClick: () => submit("/auth/register")
        },
        "Register"
      ),
      React.createElement(
        "button",
        {
          type: "button",
          onClick: () => submit("/auth/login")
        },
        "Login"
      )
    ),
    message && React.createElement("p", null, message)
  );
}
