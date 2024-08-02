const express = require("express");
const {
  getAllUsersController,
  deleteUserByIdController,
  createHostelFormContoller,
  getImagesController,
  getHostelDetailsController,
} = require("../controllers/adminCtrl");

const router = express.Router();

// GET METHOD || USERS
router.get("/getAllUsers", getAllUsersController);

// Delete METHOD || USERS
router.delete("/delete/:id", deleteUserByIdController);

// POST METHOD || USERS
router.post("/createHostelForm", createHostelFormContoller);

// GET METHOD || USERS
router.get("/getImages", getImagesController);

// GET METHOD || USERS
router.get("/getHostelDetails/:hostelId", getHostelDetailsController);
module.exports = router;
