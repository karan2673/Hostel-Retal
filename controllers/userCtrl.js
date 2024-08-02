const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup callback
const signupController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user with the hashed password
    const newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    return res
      .status(201)
      .send({ message: "User Created Successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: `Failed to Create User ${error.message}`,
      success: false,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    // To check whether the user is admin or not
    const { email, password } = req.body;
    let isAdmin = false;

    if (email === "admin@gmail.com" && password === "admin123") {
      isAdmin = true;
    }
    // ----------------------------------------------------------------
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (!existingUser) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(
      req.body.password,
      existingUser.password
    ); // Compare with existingUser.password

    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid Email or Password",
        success: false,
      });
    }

    // token generation
    const token = jwt.sign(
      { id: existingUser._id, isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res
      .status(200)
      .send({ message: "Login Successfully", success: true, token, isAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in Login", success: false });
  }
};

module.exports = { signupController, loginController };
