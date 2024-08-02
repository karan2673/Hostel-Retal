// Mongoose schema
const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true }, // Add contact field
  email: { type: String, required: true }, // Add email field
  numberofRooms: { type: Number, required: true }, // Number of Rooms
  description: { type: String }, // Add description field
  rooms: [
    {
      category: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  images: [{ type: String }], // Store image URLs,
});

const hostelModel = mongoose.model("Hostel", hostelSchema);

module.exports = hostelModel;
