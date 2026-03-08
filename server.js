//import libraries
const dns = require("dns");
// Fix for querySrv ECONNREFUSED: Force Google DNS to resolve MongoDB Atlas
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch (e) { console.log("Could not set custom DNS"); }

const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const fs = require("fs");
const connectDB = require("./config/db.js");


//import cors middleware
const cors = require("cors");

//loads environment variables form .env file
require("dotenv").config();

const DEFAULT_JWT_SECRET_PLACEHOLDERS = ["your_secure_secret_key_123", "a-very-secure-and-random-secret-key-for-jwt"];
if (!process.env.JWT_SECRET || DEFAULT_JWT_SECRET_PLACEHOLDERS.includes(process.env.JWT_SECRET)) {
  console.error("FATAL ERROR: JWT_SECRET is not defined or is set to a default placeholder.");
  console.error("Please generate a strong, unique secret and set it in your .env file.");
  console.error("You can generate one by running: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
  process.exit(1);
}
//run this command in the terminal to get the secrete 
//node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// Import Routes
const userRoutes = require("./routes/userRoutes");
const procurementRoutes = require("./routes/procurementRoutes");
const salesRoutes = require("./routes/salesRoutes");
const branchRoutes = require("./routes/branchRoutes");

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');



//create an express application
const app = express();


// Set Pug as template engine
app.set('view engine', 'pug');

// Set the folder where Pug templates are located
app.set('views', path.join(__dirname, 'frontend/views'));

//tells the express app to use CORS middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", // Allow requests from your Vue frontend
  credentials: true,
};
app.use(cors(corsOptions));

//adds middleware to parse incoming JSON request automatically
app.use(express.json());

const legacyPublicPath = path.join(__dirname, 'frontend/public');
const vueDistPath = path.join(__dirname, 'frontend-vue/dist');
const hasVueBuild = fs.existsSync(vueDistPath);

// Keep legacy pages available during migration
app.use('/legacy', express.static(legacyPublicPath));

if (hasVueBuild) {
  app.use(express.static(vueDistPath));
} else {
  app.use(express.static(legacyPublicPath));
}

//connect the application to mongoDB
connectDB();


// API Routes
app.use("/api/users", userRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/branches", branchRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

if (hasVueBuild) {
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(vueDistPath, 'index.html'));
  });
}




//start the server and listens for incoming requestes on specified port(5000)
app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
