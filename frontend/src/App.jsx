
import React from "react";

// Displays the working VC Certificate demo.
export default function App() {
  return (
    <iframe
      title="VC Certificate Management Demo"
      src={`${import.meta.env.BASE_URL}vc-manager-demo.html`}
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        border: 0,
      }}
    />
  );
}
