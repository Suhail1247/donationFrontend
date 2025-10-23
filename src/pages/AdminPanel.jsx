import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers } from "../Api/connect";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const data = await fetchAllUsers();
        // Adjust if your API returns { users: [...] }
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (error) {
        console.error("Error fetching all users:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: "#ebc191", minHeight: "100vh", py: 4 }}>
        <Box
          sx={{
            backgroundColor: "white",
            width: "95%",
            maxWidth: 1100,
            mx: "auto",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#ebc191" }}>
                <TableRow>
                  <TableCell><strong>#</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Current Month</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u, idx) => {
                  const paid =
                    u.monthlyDonations?.some(
                      (d) => d.month === currentMonth && d.donations?.length > 0
                    ) ?? false;

                  return (
                    <TableRow
                      key={u._id || idx}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/user/${u._id}`)} // ✅ navigate to user page
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell
                        sx={{
                          color: paid ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {paid ? "Paid" : "Unpaid"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
