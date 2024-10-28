// HTTP framework for handling requests
const express = require("express");
//Instance of express framework
const app = express();
// DBMS Mysql
const mysql = require("mysql2");
// Cross Origin Resourse Sharing
const cors = require("cors");
// Environment variable doc
const dotenv = require("dotenv");

app.use(express.json());
app.use(cors());
dotenv.config();

// connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Check if there is a connection
db.connect((err) => {
    // If no connection
    if (err) return console.log("Error connecting to MYSQL");

    //If connect works successfully
    console.log("Connected to MYSQL as id: ", db.threadId);
});

// < YOUR code goes down here

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//Get method
// Question 1 goes here
app.get("/data", (req, res) => {
    // Retrieve data from database

    db.query("SELECT * FROM patients", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error Retrieving data");
        } else {
            //Display the records to the browser
            res.render("data", { results: results });
        }
    });
});

// Question 2 goes here
app.get("/providers", (req, res) => {
    const sqlQuery =
        "SELECT first_name, last_name, provider_specialty FROM providers";

    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(500).send("Error fetching data: " + err);
        }
        // Render the results in the 'providers.ejs' view
        res.render("providers", { providers: results });
    });
});

// Question 3 goes here

app.get("/patients", (req, res) => {
    const sqlQuery = "SELECT first_name FROM patients";

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching patient data:", err);
            return res.status(500).send("Error retrieving patients");
        }
        // Render the results in the 'patients.ejs' view
        res.render("patients", { patients: results });
    });
});

// Question 4 goes here

app.get("/providers/specialty", (req, res) => {
    const sqlQuery =
        "SELECT first_name, last_name, provider_specialty FROM providers ORDER BY provider_specialty";

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching provider data:", err);
            return res
                .status(500)
                .send("Error retrieving providers by specialty");
        }
        // Render the results in the 'providers_by_specialty.ejs' view
        res.render("providers_specialty", { providers: results });
    });
});

// Data is a file found in the Views folder

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser
    console.log("Sending message to browser...");
    app.get("/", (req, res) => {
        res.send("Server Started Successfully!");
    });
});
