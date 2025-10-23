import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchUserData } from "../Api/connect";
import { handleRazorpayPayment } from "../Api/payment";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate(); // ✅ use this for navigation
  const [userData, setUserData] = useState(null);
  const [currentMonthDonation, setCurrentMonthDonation] = useState(null);

  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);

        // Find only the current month donation
        const donation = data.monthlyDonations.find(
          (d) => d.month === currentMonth
        );

        setCurrentMonthDonation({
          month: currentMonth,
          amount: donation?.donations?.[0]?.amount || 100,
          status: donation?.donations?.length > 0 ? "Paid" : "Unpaid",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, [currentMonthDonation]);

  if (!user) return <Navigate to="/login" replace />;

  // ✅ Correct navigation handler
  const getAllUsers = () => {
    navigate("/admin");
  };

  // ✅ Keep handleSubmit separate
  const handleSubmit = async () => {
    try {
      await handleRazorpayPayment();

      // Refresh data after payment
      const data = await fetchUserData();
      setUserData(data);
      const donation = data.monthlyDonations.find(
        (d) => d.month === currentMonth
      );
      setCurrentMonthDonation({
        month: currentMonth,
        amount: donation?.donations?.[0]?.amount || 100,
        status: donation?.donations?.length > 0 ? "Paid" : "Unpaid",
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: "#ebc191", minHeight: "100vh", py: 4 }}>
        {/* Account Summary */}
        <Box
          sx={{
            backgroundColor: "white",
            width: "90%",
            maxWidth: 900,
            mx: "auto",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            mb: 4,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" gutterBottom>
              Account Summary
            </Typography>

            {userData?.role === "superAdmin" && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#ebc191",
                  color: "black",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#dba46d" },
                }}
                onClick={getAllUsers}
              >
                Get All Users
              </Button>
            )}
          </Stack>

          <Typography>Name: {userData?.name}</Typography>
          <Typography>Role: {userData?.role}</Typography>
          <Typography>Email: {userData?.email}</Typography>
          <Typography>Mobile: {userData?.phone}</Typography>

          {currentMonthDonation?.status === "Unpaid" && (
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#ebc191", color: "black" }}
              onClick={handleSubmit}
            >
              Pay for {currentMonth}
            </Button>
          )}
        </Box>

        {/* Table */}
        <Box
          sx={{
            width: "90%",
            maxWidth: 900,
            mx: "auto",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            pb: 2,
          }}
        >
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#ebc191" }}>
                <TableRow>
                  <TableCell><strong>Month</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentMonthDonation && (
                  <TableRow>
                    <TableCell>{currentMonthDonation.month}</TableCell>
                    <TableCell>₹{currentMonthDonation.amount}</TableCell>
                    <TableCell
                      sx={{
                        color: currentMonthDonation.status === "Paid" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {currentMonthDonation.status}
                    </TableCell>
                    <TableCell align="center">
                      {currentMonthDonation.status !== "Paid" && (
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#ebc191", color: "black" }}
                          onClick={handleSubmit}
                        >
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
