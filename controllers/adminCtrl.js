const userModel = require("../models/userModels");
const hostelModel = require("../models/HostelModels");

const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    console.log(req.body);
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users data retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error while fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Define the controller function to delete a user
// Controller function to delete a user by user_id
const deleteUserByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (!id) {
      res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
    const data = await userModel.deleteOne({ _id: id });
    res.status(200).send({
      success: true,
      message: "data deleted successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// Create Hostel Form
const createHostelFormContoller = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        console.error("Error uploading image:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: err.message,
        });
      }

      const {
        name,
        address,
        contact,
        email,
        description,
        numberofRooms,
        numRooms,
        roomData,
      } = req.body;

      const imagePath = req.file ? req.file.filename : null;

      const parsedRoomData = JSON.parse(roomData);

      // Check if hostel already exists
      const existingHostel = await hostelModel.findOne({
        name: name,
        address: address,
      });
      if (existingHostel) {
        return res.status(200).json({
          exists: true,
          message: "Hostel Already Exists",
        });
      }

      const newHostelForm = new hostelModel({
        name: name,
        address: address,
        contact: contact,
        email: email,
        description: description,
        numberofRooms: numberofRooms,
        rooms: parsedRoomData,
        images: [imagePath],
      });

      await newHostelForm.save();

      res.status(200).json({
        success: true,
        message: "Hostel form created successfully",
      });
    });
  } catch (error) {
    console.error("Error creating hostel form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create hostel form",
      error: error.message,
    });
  }
};

// upload the images

const getImagesController = async (req, res) => {
  try {
    const hostelForms = await hostelModel.find({}); // Exclude _id and __v fields from the result

    if (!hostelForms) {
      return res.status(404).json({
        success: false,
        message: "No hostel forms found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hostel forms retrieved successfully",
      data: hostelForms,
    });
  } catch (error) {
    console.error("Error retrieving hostel forms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve hostel forms",
      error: error.message,
    });
  }
};

// Booking particular Hostel

const getHostelDetailsController = async (req, res) => {
  try {
    // Extract the hostelId from the request parameters
    const { hostelId } = req.params;

    // Perform any operation with the hostelId, such as fetching details from the database
    const hostelDetails = await hostelModel.findById(hostelId);

    if (!hostelDetails) {
      return res.status(404).json({
        success: false,
        message: "Hostel details not found",
      });
    }

    // Send the hostel details in the response
    res.status(200).json({
      success: true,
      message: "Hostel details retrieved successfully",
      data: hostelDetails,
    });
  } catch (error) {
    console.error("Error retrieving hostel details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve hostel details",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsersController,
  deleteUserByIdController,
  createHostelFormContoller,
  getImagesController,
  getHostelDetailsController,
};
