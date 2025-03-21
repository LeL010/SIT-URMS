const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/auth");
const multer = require("multer");

//Get user Profile
router.get("/profile", validateToken, async (req, res) => {
  try {
    // Find user profile using Sequelize
    const userProfile = await Profile.findOne({
      where: { user_id: req.user.id },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const userInfo = {
      id: userProfile.user_id,
      name: userProfile.full_name,
      email: userProfile.user.email,
      mobileNumber: userProfile.mobile_number,
      profilePicture: userProfile.profile_picture
        ? `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${
            userProfile.profile_picture
          }`
        : null,
    };

    res.status(200).json({ user: userInfo });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});

//Update user Profile
router.put("/profile", validateToken, async (req, res) => {
  try {
    let userId = req.user.id;

    // Find user profile using Sequelize
    const userProfile = await Profile.findOne({ where: { user_id: userId } });
    const { name, mobile } = req.body;

    //Update user profile using sequelize
    const updatedRows = await userProfile.update(
      {
        name: name,
        mobile: mobile,
      },
      { where: { id: userId } }
    );

    //No change to profile
    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "Profile not found or no changes made" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Update profile error:" });
  }
});

// Configure multer storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define upload directory and create it if it doesn't exist
    const uploadDir = "./uploads/profile-pictures";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp to prevent overwriting
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create multer upload instance with file filtering
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Only allow image file types
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post(
  "/picture",
  validateToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.id;
      const profilePicture = req.file.filename;

      // Fetch the current profile using Sequelize
      const userProfile = await Profile.findOne({ where: { user_id: userId } });

      if (!userProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // If there is an old profile picture, delete it
      if (userProfile.profile_picture) {
        const oldPicturePath = path.join(
          __dirname,
          "uploads",
          "profile-pictures",
          userProfile.profile_picture
        );
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }

      // Update profile with new picture using Sequelize
      await userProfile.update({ profile_picture: profilePicture });

      res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePicture: `${req.protocol}://${req.get(
          "host"
        )}/uploads/profile-pictures/${profilePicture}`,
      });
    } catch (error) {
      console.error("Profile picture upload error:", error);
      res
        .status(500)
        .json({ message: "Server error while uploading profile picture" });
    }
  }
);

module.exports = router;
