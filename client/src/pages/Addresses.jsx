import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

function Addresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Adjust endpoint to match your backend route (e.g., '/api/addresses')
        const response = await axios.get(
          "http://localhost:3000/api/v1/addresses"
        );
        setAddresses(response.data); // Assuming response.data is an array of addresses
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Example click handlers — replace with your own logic
  const handleEdit = (id) => {
    console.log("Edit clicked for address id:", id);
    // Possibly open a dialog or navigate to an edit page
    navigate(`/addresses/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete clicked for address id:", id);
    // Possibly confirm and call DELETE /api/addresses/:id
  };

  const handleFavorite = (id) => {
    console.log("Favorite clicked for address id:", id);
    // Possibly call a PATCH /api/addresses/:id to update default/favorite
  };

  if (loading) {
    return <Typography sx={{ p: 2 }}>Loading addresses...</Typography>;
  }

  if (!addresses.length) {
    return <Typography sx={{ p: 2 }}>No addresses found.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        User Addresses
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/addresses/create")}
      >
        Create New Address
      </Button>
      <List>
        {addresses.map((addr) => (
          <ListItem
            key={addr.address_id}
            sx={{
              mb: 2,
              border: "1px solid #ccc",
              borderRadius: "4px",
              position: "relative",
            }}
          >
            <ListItemText
              primary={`${addr.addressLine1}, ${addr.city}`}
              secondary={`Zip: ${addr.postalCode}`}
            />
            {/* 
              Material UI SpeedDial: 
              a single floating button that expands to multiple actions 
            */}
            <SpeedDial
              ariaLabel="Address Actions"
              icon={<EditIcon />}
              direction="left"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
            >
              <SpeedDialAction
                icon={<EditIcon />}
                tooltipTitle="Edit"
                onClick={() => handleEdit(addr.address_id)}
              />
              <SpeedDialAction
                icon={<DeleteIcon />}
                tooltipTitle="Delete"
                onClick={() => handleDelete(addr.address_id)}
              />
              <SpeedDialAction
                icon={<StarIcon />}
                tooltipTitle="Favorite"
                onClick={() => handleFavorite(addr.address_id)}
              />
            </SpeedDial>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Addresses;
