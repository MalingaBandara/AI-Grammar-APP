
// Import necessary modules
import 'dotenv/config'; // Load environment variables from a .env file
import express from 'express'; // Import Express.js framework
import fetch from 'node-fetch'; // Import node-fetch for making HTTP requests
import ejs from 'ejs'; // Import EJS for templating

const app = express(); // Initialize an Express application
const port = process.env.PORT || 3000;

// Set EJS as the view engine for rendering templates
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded request bodies (e.g., form data)
app.use( express.urlencoded({ extended: true }) );


app.get('/', (req, res) => {
    res.render('index');
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});