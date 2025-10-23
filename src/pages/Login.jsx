import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ import toast

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const res = await login(form);
console.log('response',res);

      if (res.status === true) {
        
        toast.success(res.data?.message || "Logged in successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed", err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar login />
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h4">Login</Typography>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button variant="contained" onClick={handleSubmit}>
            Login
          </Button>
        </Box>
      </Container>
    </>
  );
}
