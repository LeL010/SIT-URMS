import React from "react";
import { Typography, Box, Button } from "@mui/material";

function LandingPage() {
  // You can add any logic here, such as data fetching

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Landing Page
      </Typography>

      <Typography variant="body1" paragraph>
        This is your main entry point. Use this page to direct users to
        registration, login, or highlight your site’s key features.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // For instance, maybe navigate or do something else
          console.log("Landing Page Button Clicked");
        }}
      >
        Get Started
      </Button>
    </Box>
  );
}

export default LandingPage;
