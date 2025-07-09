import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await axios.post("http://localhost:8000/api/auth/login", form);
//       const { token, user } = res.data;

//       // Optional: Save token to localStorage
//       localStorage.setItem("token", token);

//       alert("Login successful!");
//       // Navigate to home/dashboard (create later)
//       navigate("/dashboard");
//     } catch (err) {
//       const msg = err.response?.data?.message || "Login failed. Try again.";
//       setError(msg);
//     }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post("http://localhost:8000/api/auth/login", form);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));  // Save user info too!

    toast.success("✅ loginsuccessfully!");
    navigate("/");
  } catch (err) {
    const msg = err.response?.data?.message || "Login failed. Try again.";
    setError(msg);
  }
};

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p style={{ textAlign: "center" }}>
  Don’t have an account?{" "}
  <button
    type="button"
    onClick={() => navigate("/register")}
    style={{
      background: "none",
      border: "none",
      color: "#4f46e5",
      cursor: "pointer",
      textDecoration: "underline",
    }}
  >
    Register here
  </button>
</p>

      </form>
    </div>
  );
};

export default Login;
