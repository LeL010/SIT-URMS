// src/pages/AddressForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

function AddressForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEdit = Boolean(id);

  // Fetch address data for editing
  useEffect(() => {
    if (isEdit) {
      const fetchAddress = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `http://localhost:3000/api/v1/addresses/${id}`
          );
          setFormData(res.data);
        } catch (err) {
          setError(`Failed to load address : ${err}`);
        } finally {
          setLoading(false);
        }
      };
      fetchAddress();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:3000/api/v1/addresses/${id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/api/v1/addresses", formData);
      }
      navigate("/addresses");
    } catch (err) {
      setError(`Save failed. Please try again.\n Traceback : ${err}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 2, maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Address" : "Create New Address"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Existing Form Fields */}
        <TextField
          label="Address Line 1"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address Line 2"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {error && <Typography color="error">{error}</Typography>}

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
      </form>
    </Box>
  );
}

export default AddressForm;
