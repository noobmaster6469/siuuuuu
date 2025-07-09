import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "female",
  });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [popupError, setPopupError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerMsg("");

    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", form, {
        withCredentials: true,
      });

      setServerMsg(res.data.message);
      toast.success("🎉 Registered successfully! Please log in.");

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "female",
      });

      navigate("/login"); // ✅ Redirect to login

    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => (fieldErrors[e.field] = e.message));
        setErrors(fieldErrors);
      } else {
        const message = err.response?.data?.message || "Something went wrong.";
        if (message === "Email already registered") {
          setPopupError(message);
          setTimeout(() => setPopupError(""), 7000);
          toast.error("❌ Email already registered. Try logging in.");
        } else {
          setServerMsg(message);
          toast.error("❌ " + message);
        }
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {serverMsg && <p>{serverMsg}</p>}

      {popupError && (
        <div className="popup-error">
          {popupError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <p className={`error-text ${errors.name ? "show" : ""}`}>
          {errors.name || " "}
        </p>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <p className={`error-text ${errors.email ? "show" : ""}`}>
          {errors.email || " "}
        </p>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <p className={`error-text ${errors.password ? "show" : ""}`}>
          {errors.password || " "}
        </p>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <p className={`error-text ${errors.confirmPassword ? "show" : ""}`}>
          {errors.confirmPassword || " "}
        </p>

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button type="submit">Register</button>

        <p style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#4f46e5",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
