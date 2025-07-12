import React from "react";

export default function ErrorModal({ error, onClose }) {
  console.log("ErrorModal", error);
  if (!error) return null;
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
        boxShadow: "0 2px 16px rgba(0,0,0,0.2)"
      }}>
        <h4 style={{ color: "red" }}>Terjadi Kesalahan</h4>
        <div style={{ marginBottom: 16 }}>
          {
            typeof error === "string" ? (
              <p>{error}</p>
            ) : (
              <ul>
                {Array.isArray(error) ? (
                  error.map((err, index) => <li key={index}>{err}</li>)
                ) : (
                  Object.entries(error).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))
                )}
              </ul>
            )
          }
          
        </div>
        <button className="btn btn-danger" onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}