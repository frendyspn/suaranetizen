import React from "react";

export default function SuccessModal({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{
        background: "white",
        padding: 32,
        borderRadius: 8,
        minWidth: 300,
        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        <h4 style={{ color: "green" }}>Berhasil!</h4>
        <div style={{ marginBottom: 16 }}>{message}</div>
        <button className="btn btn-success" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}