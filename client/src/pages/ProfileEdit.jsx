import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Avatar, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileEdit = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
              "http://localhost:3000/api/v1/user/profile"
            );
            setCurrentUser(response.data.user);
        } catch (error) {
            toast.error('Failed to load profile.');
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required("Name is required")
            .matches(/^[a-zA-Z '-,.]+$/,
                "Name only allows letters, spaces and characters: ' - , ."),
        mobile: yup.string().min(8).max(15).required("Mobile is required")
            .matches(/^\+?[0-9]{8,15}$/, 'Please enter a valid mobile number')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            mobile: ''
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.put(
                  "http://localhost:3000/api/v1/user/profile",
                  values
                );
                setCurrentUser(response.data.user.user);
                toast.success('Profile updated successfully!');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to update profile.';
                toast.error(errorMessage);
                console.error('Profile update error:', error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Update formik values when currentUser changes
    useEffect(() => {
        if (currentUser) {
            formik.setValues({
                name: currentUser.name || '',
                mobile: currentUser.mobileNumber || ''
            });
        }
    }, [currentUser, formik]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Invalid file type. Only JPEG, PNG, or GIF allowed.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File is too large. Max size is 5MB.');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select an image to upload.');
            return;
        }
        
        const formData = new FormData();
        formData.append('profilePicture', selectedFile);
        
        try {
            setUploading(true);
            const response = await axios.post(
              "http://localhost:3000/api/v1/user/picture",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            
            toast.success('Profile picture updated!');
            setSelectedFile(null);
            
            // Update the current user with the new profile picture URL
            setCurrentUser({
                ...currentUser,
                profilePicture: response.data.profilePicture
            });
            
            // Clean up the object URL to avoid memory leaks
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to upload profile picture.';
            toast.error(errorMessage);
            console.error('Profile picture upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Edit Profile</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Name" 
                    {...formik.getFieldProps('name')} 
                    error={formik.touched.name && Boolean(formik.errors.name)} 
                    helperText={formik.touched.name && formik.errors.name} 
                />
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Email" 
                    value={currentUser?.email || ''} 
                    disabled 
                />
                <TextField 
                    fullWidth 
                    margin="normal" 
                    label="Mobile Number" 
                    {...formik.getFieldProps('mobile')} 
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)} 
                    helperText={formik.touched.mobile && formik.errors.mobile} 
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }} 
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Profile Picture</Typography>
                <Avatar 
                    src={previewUrl || currentUser?.profilePicture || '/images/default-avatar.png'} 
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} 
                />
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/jpeg,image/png,image/gif" 
                    style={{ display: 'none' }} 
                />
                <Box sx={{ mt: 2 }}>
                    <Button 
                        variant="outlined" 
                        onClick={() => fileInputRef.current.click()} 
                        disabled={uploading}
                    >
                        Select Image
                    </Button>
                    {previewUrl && (
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            sx={{ ml: 2 }} 
                            onClick={handleUpload} 
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    )}
                </Box>
            </Box>
            <ToastContainer position="bottom-right" />
        </Box>
    );
};

export default ProfileEdit;