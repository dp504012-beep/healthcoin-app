import React, { useState } from "react";
import { apiRequest } from "../api/client";

export default function ActivityPage({ userId, onActivityCreated }) {
  const [steps, setSteps] = useState("");
  const [activity, setActivity] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateSteps() {
    if (steps.trim() === "") {
      return "Activity input cannot be empty.";
    }

    const numericSteps = Number(steps);
    if (!Number.isFinite(numericSteps)) {
      return "Steps must be a valid number.";
    }

    if (!Number.isInteger(numericSteps)) {
      return "Steps must be a whole number.";
    }

    if (numericSteps <= 0) {
      return "Steps must be greater than 0.";
    }

    if (numericSteps > 100000) {
      return "Steps must be 100000 or less.";
    }

    return "";
  }

  async function submitActivity() {
    setMessage("");
    setMessageType("error");
    setActivity(null);

    const validationError = validateSteps();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await apiRequest("/activity", {
        method: "POST",
        body: JSON.stringify({ userId, steps: Number(steps) })
      });

      setActivity(data.activity);
      onActivityCreated(data.activity);
      setSteps("");
      setMessageType("success");
      setMessage("Activity submitted successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
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
        React.createElement("span", { className: "eyebrow" }, "Validation"),
        React.createElement("h2", null, "Activity")
      ),
      React.createElement("p", null, "Submit step activity for reward calculation.")
    ),
    React.createElement(
      "label",
      null,
      "Steps",
      React.createElement("input", {
        type: "number",
        min: "1",
        max: "100000",
        step: "1",
        value: steps,
        onChange: (event) => setSteps(event.target.value)
      })
    ),
    React.createElement(
      "button",
      {
        type: "button",
        disabled: isSubmitting,
        onClick: submitActivity
      },
      isSubmitting ? "Submitting..." : "Submit"
    ),
    activity && React.createElement("pre", null, JSON.stringify(activity, null, 2)),
    !activity &&
      !message &&
      React.createElement("p", { className: "empty-state" }, "No activity yet. Submit steps to create the first activity record."),
    message && React.createElement("p", { className: `message ${messageType}`, role: "status" }, message)
  );
}
