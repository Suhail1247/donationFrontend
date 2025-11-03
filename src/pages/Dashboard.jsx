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
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const getAllUsers = () => navigate("/admin");

  const handleSubmit = async (month) => {
    try {
      await handleRazorpayPayment(month);
      const data = await fetchUserData();
      setUserData(data);
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
            <Typography variant="h5" gutterBottom>Account Summary</Typography>

            {userData?.role === "superAdmin" && (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#ebc191", color: "black" }}
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
        </Box>

        {/* Table */}
        <Box sx={{ width: "90%", maxWidth: 900, mx: "auto", backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
          <TableContainer component={Paper}>
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
              {userData?.monthlyDonations?.map((d, i) => (
  <TableRow key={i}>
    <TableCell>{d.month}</TableCell>
    <TableCell>₹{d.donations?.[0]?.amount || 100}</TableCell>
    <TableCell
      sx={{
        color: d.donations?.length > 0 ? "green" : "red",
        fontWeight: "bold",
      }}
    >
      {d.donations?.length > 0 ? "Paid" : "Unpaid"}
    </TableCell>
    <TableCell align="center">
      {d.donations?.length === 0 && (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#ebc191", color: "black" }}
          onClick={() => handleSubmit(d.month)}
        >
          Pay Now
        </Button>
      )}
    </TableCell>
  </TableRow>
))}

              </TableBody>

            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
