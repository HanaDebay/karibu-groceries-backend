//import libraries
const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const fs = require("fs");
const connectDB = require("./config/db.js");


//import cors middleware
const cors = require("cors");

//loads environment variables form .env file
require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined. Please check your .env file.");
}

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
