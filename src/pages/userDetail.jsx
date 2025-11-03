import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { fetchUserById, markOfflinePayment } from "../Api/connect";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserById(id);
        // Axios returns data in res.data, adjust if backend wraps user
        setUser(data.user || data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  // Handle offline payment
  const handleOfflinePayment = async () => {
    try {
      await markOfflinePayment(id);
      alert("Payment marked as paid (offline).");

      const updated = await fetchUserById(id);
      setUser(updated.user || updated);
    } catch (error) {
      console.error("Failed to mark payment:", error);
    }
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading user details...</Typography>;
  if (!user) return <Typography sx={{ p: 3 }}>User not found.</Typography>;

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: "#ebc191", minHeight: "100vh", py: 4 }}>
        <Box
          sx={{
            backgroundColor: "white",
            width: "90%",
            maxWidth: 900,
            mx: "auto",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {user.name}'s Account
          </Typography>

          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phone}</Typography>
          <Typography>Role: {user.role}</Typography>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#ebc191",
              color: "black",
              "&:hover": { backgroundColor: "#dba46d" },
            }}
            onClick={handleOfflinePayment}
          >
            Mark Offline Payment
          </Button>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Payment History</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#ebc191" }}>
                  <TableRow>
                    <TableCell><strong>Month</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.monthlyDonations?.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell>{d.month}</TableCell>
                      <TableCell>
                        ₹{d.donations?.reduce((sum, item) => sum + item.amount, 0) || "—"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: d.donations?.length > 0 ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {d.donations?.length > 0 ? "Paid" : "Unpaid"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Button
            variant="outlined"
            sx={{ mt: 3 }}
            onClick={() => navigate("/admin")}
          >
            Back to Admin Panel
          </Button>
        </Box>
      </Box>
    </>
  );
}
