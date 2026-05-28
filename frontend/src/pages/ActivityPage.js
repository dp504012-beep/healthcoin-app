import React, { useState } from "react";
import { apiRequest } from "../api/client";

export default function ActivityPage({ userId, onActivityCreated }) {
  const [steps, setSteps] = useState("");
  const [activity, setActivity] = useState(null);
  const [message, setMessage] = useState("");

  async function submitActivity() {
    setMessage("");
    setActivity(null);

    try {
      const data = await apiRequest("/activity", {
        method: "POST",
        body: JSON.stringify({ userId, steps: Number(steps) })
      });

      setActivity(data.activity);
      onActivityCreated(data.activity);
      setSteps("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return React.createElement(
    "section",
    null,
    React.createElement("h2", null, "Activity"),
    React.createElement(
      "label",
      null,
      "Steps",
      React.createElement("input", {
        type: "number",
        min: "0",
        value: steps,
        onChange: (event) => setSteps(event.target.value)
      })
    ),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: submitActivity
      },
      "Submit"
    ),
    activity && React.createElement("pre", null, JSON.stringify(activity, null, 2)),
    message && React.createElement("p", null, message)
  );
}
