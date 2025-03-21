import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

// MUI Toggle
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// Import pages/components
import LandingPage from "./pages/LandingPage";
import Addresses from "./pages/Addresses";
import AddressForm from "./pages/AddressForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProfileEdit from "./pages/ProfileEdit";

// Suppose you have a context that stores user info
import UserContext from "./contexts/UserContext";

export default function App() {
  const { user } = useContext(UserContext);
  // user is `null` or `undefined` if not logged in,
  // or an object if the user is logged in

  // For toggling between showing the Login or Register components
  const [authMode, setAuthMode] = useState("login");

  const handleAuthMode = (event, newMode) => {
    if (newMode) {
      setAuthMode(newMode);
    }
  };

  return (
    <Router>
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            {/* Left side: Link to home */}
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                User Management & Registration
              </Typography>
            </Link>

            {/* Show Addresses and Profile icon only if user is logged in */}
            {user && (
              <>
                <Link
                  to="/addresses"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button color="inherit">Addresses</Button>
                </Link>

                {/* Profile icon on the right */}
                <IconButton
                  color="inherit"
                  onClick={() => {
                    // Navigate to /profile
                    window.location.href = "/profile";
                  }}
                  sx={{ ml: "auto" }}
                >
                  <AccountCircle />
                </IconButton>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ mt: 2 }}>
        {/* If user is NOT logged in, show a toggle for login/register */}
        {!user && (
          <ToggleButtonGroup
            value={authMode}
            exclusive
            onChange={handleAuthMode}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="login">Login</ToggleButton>
            <ToggleButton value="register">Register</ToggleButton>
          </ToggleButtonGroup>
        )}

        <Routes>
          {/* Landing Page: allow / if user is logged in, else show “wrapper”? 
              In simpler setups, you might just do a ternary on the element. */}
          <Route
            path="/"
            element={
              user ? (
                <LandingPage />
              ) : authMode === "login" ? (
                <Login />
              ) : (
                <Register />
              )
            }
          />

          {/* Show these only if user is logged in. You can also create a PrivateRoute for them */}
          {user && (
            <>
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/addresses/create" element={<AddressForm />} />
              <Route path="/addresses/edit/:id" element={<AddressForm />} />
              <Route path="/profile" element={<ProfileEdit />} />
            </>
          )}

          {/* 
            Otherwise, if you do not want a private-route logic, 
            you might handle it in the component itself or via a custom wrapper.
          */}
        </Routes>
      </Container>
    </Router>
  );
}
