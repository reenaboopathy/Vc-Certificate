import React from "react";

// Displays the supplied working demo as the frontend so the UI and browser-side
// interactions match the reference demo without a second, visually different UI.
export default function App() {
  return (
    <iframe
      title="VC Certificate Management Demo"
      src="/vc-manager-demo.html"
      style={{ display: "block", width: "100%", height: "100vh", border: 0 }}
    />
  );
}
