const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cors = require("cors");

// Initialize Express server
const server = express();

// Middleware
server.use(express.json());
server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(express.urlencoded({ extended: true }));

// Session middleware
server.use(
  session({
    secret: process.env.SESSION_SECRET || "@smarthealthcare123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true for production with HTTPS
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 365 * 100 // 1 year
    },
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/SHC")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));



// Schema and Model definitions

// authentication of user
const AuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
});

const USER = mongoose.model("User", AuthSchema);

// authentication of doctor
const DrAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  experience: { type: Number, required: true },
  currenthospital: { type: String, required: true },
  address: { type: String, required: true }
});

const DOCTOR = new mongoose.model("Doctors", DrAuthSchema);



// blood donation and req schema
const BloodSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ["Donate", "Request", "RequestCheck"] // Added "RequestCheck" 
  },
  bloodType: { 
    type: String, 
    required: true, 
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  location: { 
    type: String, 
    required: function() { 
      return this.type === "Donate" || this.type === "Request"; // Location is required for "Donate" and "Request"
    } 
  },
  name: { 
    type: String, 
    required: function() { 
      return this.type === "Donate" || this.type === "Request"; // Name is required for "Donate" and "Request"
    } 
  },
  contact: { 
    type: String, 
    required: function() { 
      return this.type === "Donate" || this.type === "Request"; // Contact is required for "Donate" and "Request"
    } 
  },
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High"], 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  available: { 
    type: Boolean, 
    required: function() { 
      return this.type === "RequestCheck"; // Available is required for "RequestCheck"
    },
    default: null 
  },
  checkedAt: { 
    type: Date, 
    required: function() { 
      return this.type === "RequestCheck"; // checkedAt is required for "RequestCheck"
    },
    default: null 
  },
});

const Blood = mongoose.model("Blood", BloodSchema);



// accident schema
const accidentSchema = new mongoose.Schema({
  location: String,
  description: String,
  status: { type: String, enum: ['Pending', 'Checkout'], default: 'Pending' },
  time: { type: Date, default: Date.now },
});
const Accident = mongoose.model('Accident', accidentSchema);




// POST route to add a new accident
server.post('/api/accidents', async (req, res) => {
  const { location, description } = req.body;
  try {
    const newAccident = new Accident({ location, description });
    await newAccident.save();
    res.status(201).json(newAccident); // Return the created accident data
  } catch (error) {
    res.status(500).json({ message: 'Error saving accident' });
  }
});


// GET route to fetch all accidents
server.get('/api/accidents', async (_req, res) => {
  try {
    const accidents = await Accident.find();
    res.json({ accidents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accidents' });
  }
});

// Update accident status
server.put('/api/accidents/:id', async (req, res) => {
  const { status } = req.body; // Status can be 'Pending' or 'Checkout'
  const { id } = req.params;

  if (!status || (status !== 'Pending' && status !== 'Checkout')) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const accident = await Accident.findByIdAndUpdate(
      id,
      { status }, // Update the status of the accident
      { new: true } // Return the updated accident
    );

    if (!accident) {
      return res.status(404).json({ error: 'Accident not found' });
    }

    res.status(200).json(accident);
  } catch (err) {
    console.error('Error updating accident:', err);
    res.status(500).json({ error: 'Failed to update the accident' });
  }
});



// Routes
server.post("/userAuth", async (req, res) => {
  const { name, email, password, userType } = req.body;
  try {
    if (await USER.findOne({ email })) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new USER({ name, email, password: hashedPassword, userType });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await USER.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({ error: "Invalid credentials" });
    }
    req.session.user = {
      userId: user._id,
      userEmail: user.email,
      userType: user.userType,
      userName: user.name,
    };
    console.log("User session set:", req.session); // Debugging session
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

server.get("/user", async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: "User not authenticated" });
    const user = await USER.findById(req.session.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ userName: user.name, userId: user._id, userEmail: user.email, userType: user.userType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// doctor registration
server.post("/doctor-registration", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      contact,
      experience,
      currentHospital, // Fix: Ensure the field matches the client-side
      address,
    } = req.body;

    // Check for missing fields
    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !contact ||
      !experience ||
      !currentHospital ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the doctor already exists
    if (await DOCTOR.findOne({ email })) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new doctor record
    const newDoctor = new DOCTOR({
      name,
      email,
      password: hashedPassword,
      specialization,
      contact,
      experience,
      currenthospital: currentHospital, // Fix field mapping
      address,
    });

    // Save the doctor to the database
    await newDoctor.save();

    // Send success response
    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (err) {
    console.error("Server Error:", err.message); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" }); // Use 500 for server errors
  }
});



// Doctor Login Route
server.post("/doctor-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find doctor by email
    const doctor = await DOCTOR.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Store doctor information in session
    req.session.doctor = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
    };

    // Send successful login response
    res.status(200).json({ message: "Login successful", doctor: req.session.doctor });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
});


// GET route to fetch doctor information (after login)
server.get("/doctor-profile", async (req, res) => {
  try {
    // Check if the doctor is logged in (by checking the session)
    if (!req.session.doctor) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Fetch doctor information from the database using the doctor’s ID from the session
    const doctor = await DOCTOR.findById(req.session.doctor.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Return doctor details
    res.status(200).json({
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      contact: doctor.contact,
      experience: doctor.experience,
      currentHospital: doctor.currenthospital,
      address: doctor.address,
    });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





// Blood Donation Route
server.post("/blood/donate", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { bloodType, quantity, location, name, contact } = req.body;

    const donationData = {
      bloodType,
      quantity,
      location,
      name: name || req.session.user.userName,  // Use the session user name if available
      contact: contact || req.session.user.userEmail,  // Use the session user email if available
    };

    const newDonation = new Blood({ type: "Donate", ...donationData });
    await newDonation.save();
    res.status(201).json({ message: "Donation recorded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Blood Request Route
server.post("/blood/request", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { bloodType, quantity, location, name, contact, priority } = req.body;

    const requestData = {
      bloodType,
      quantity,
      location,
      name: name || req.session.user.userName,  // Use the session user name if available
      contact: contact || req.session.user.userEmail,  // Use the session user email if available
      priority,
    };

    const newRequest = new Blood({ type: "Request", ...requestData });
    await newRequest.save();
    res.status(201).json({ message: "Request recorded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Blood Donation Retrieval
server.get("/blood/donations", async (_req, res) => {
  try {
    const donations = await Blood.find({ type: "Donate" });
    res.status(200).json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Blood Request Retrieval
server.get("/blood/requests", async (_req, res) => {
  try {
    const requests = await Blood.find({ type: "Request" });
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Blood Match Route (to match requests with donations)
server.get("/blood/match", async (_req, res) => {
  try {
    const matches = await Blood.aggregate([
      { $match: { type: "Request" } },
      {
        $lookup: {
          from: "bloods",  // Ensure this matches the collection name in MongoDB
          let: { requestBloodType: "$bloodType", requestLocation: "$location" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$type", "Donate"] },
                    { $eq: ["$bloodType", "$$requestBloodType"] },
                    { $eq: ["$location", "$$requestLocation"] },
                  ],
                },
              },
            },
          ],
          as: "matches",
        },
      },
    ]);
    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

server.post("/blood/request/check-availability", async (req, res) => {
  try {
    const { bloodType, quantity } = req.body;

    // Validate the input data
    if (!bloodType || !quantity) {
      return res.status(400).json({ error: "Blood type and quantity are required" });
    }

    // Find available donations for the given blood type
    const availableDonations = await Blood.aggregate([
      { $match: { type: "Donate", bloodType: bloodType } },
      { $group: { _id: "$bloodType", totalQuantity: { $sum: "$quantity" } } },
    ]);

    const isAvailable = availableDonations.length > 0 && availableDonations[0].totalQuantity >= quantity;

    // Save the check request into the database
    const checkRequest = new Blood({
      type: "RequestCheck",
      bloodType,
      quantity,
      checkedAt: new Date(), // Timestamp when the check was made
      available: isAvailable,
    });

    await checkRequest.save();

    // Respond to the client
    if (isAvailable) {
      return res.status(200).json({ available: true, message: "Sufficient blood available" });
    } else {
      return res.status(200).json({ available: false, message: "Insufficient blood available" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// get the availability
server.get("/blood/request/check-availability", async (req, res) => {
  try {
    const { bloodType } = req.query;

    // Validate the input
    if (!bloodType) {
      return res.status(400).json({ error: "Blood type is required" });
    }

    // Retrieve all RequestCheck entries for the given blood type
    const checks = await Blood.find({ type: "RequestCheck", bloodType });

    // If no records are found, respond accordingly
    if (checks.length === 0) {
      return res.status(404).json({ message: "No check records found for the specified blood type" });
    }

    // Respond with the retrieved data
    res.status(200).json(checks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Start server
server.listen(2000, () => console.log("Server is running on port 2000"));
