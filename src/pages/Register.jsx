import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ import toast
import Navbar from "../components/Navbar";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await register(form);
console.log('response',res.message);

      if (res.status === true) {
        toast.success(res.message || "Registered successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed", err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
     <Navbar login />
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {["name", "phone", "email", "password", "confirmPassword"].map((field) => (
          <TextField
            key={field}
            label={field}
            type={field.includes("password") ? "password" : "text"}
            fullWidth
            sx={{ mb: 2 }}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}
        <Button variant="contained" type="submit" fullWidth>
          Register
        </Button>
      </Box>
    </Container>
    </>
  );
};

export default Register;
