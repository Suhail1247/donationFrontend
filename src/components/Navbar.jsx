import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar(props) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // State for dialog visibility
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // Open the dialog
  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  // Close the dialog without logging out
  const handleCancel = () => {
    setOpenLogoutDialog(false);
  };

  // Confirm logout
  const handleConfirmLogout = () => {
    setOpenLogoutDialog(false);
    logout();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Donation App
          </Typography>

          {!user ? (
            <>
              {currentPath === "/login" && (
                <Button color="inherit" onClick={() => navigate("/register")}>
                  Register
                </Button>
              )}
              {currentPath === "/register" && (
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
              )}
            </>
          ) : (
            <>
              <Typography sx={{ marginRight: 2 }}>{user.name}</Typography>
              <Button color="inherit" onClick={handleLogoutClick}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
