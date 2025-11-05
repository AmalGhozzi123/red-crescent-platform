import React, { useState } from "react";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Stockage du token et redirection directe
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin_id", data.admin_id || "");

        // Pas de message — on redirige immédiatement
        window.location.href = "/dashboard";
      } else {
        // ❌ Afficher seulement le message d'erreur
        setErrorMessage(data.detail || "Incorrect email or password!");
      }
    } catch (err) {
      setErrorMessage("Server connection error!");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="/images/logo.png"
          alt="Red Crescent Logo"
          className="logo"
        />
        <h2 className="login-title">Administrator Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        {errorMessage && (
          <div className="alert error">
            <span>{errorMessage}</span>
          </div>
        )}

        <p className="footer-text">
          © 2025 Tunisian Red Crescent – Beb Bhar Local Committee
        </p>
      </div>
    </div>
  );
}
