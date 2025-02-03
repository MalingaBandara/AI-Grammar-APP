
// Import necessary modules
import 'dotenv/config'; // Load environment variables from a .env file
import express from 'express'; // Import Express.js framework
import fetch from 'node-fetch'; // Import node-fetch for making HTTP requests

const app = express(); // Initialize an Express application
const port = process.env.PORT || 3000;



// Set EJS as the view engine for rendering templates
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded request bodies (e.g., form data)
app.use( express.urlencoded({ extended: true }) );


app.get('/', (req, res) => {
    res.render('index', {
        corrected: '', // Initialize corrected text to an empty string
        originalText: '', // Initialize original text to an empty string
    });
});


// Main logic route for handling text correction
app.post('/correct', async (req, res) => {

    // Extract and trim input text from the form to remove leading/trailing spaces
    const text = req.body.text.trim();

    // Check if the input text is empty
    if (!text) {
        // Render the 'index' template with an error message if no text is provided
        res.render('index', { 
            corrected: 'Please enter some text to correct.', // Error message displayed on the form
            originalText: text, // Pass the original (empty) text back to the template for user convenience
        });
        return; // Exit early to avoid making an unnecessary API call
    }

    try {
        // Make a POST request to the OpenAI API for text correction
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", // Use the POST HTTP method
            headers: {
                "Content-Type": "application/json", // Specify that the request body contains JSON
                Authorization: `Bearer ${process.env.OPENAI_KEY}`, // Use OpenAI API key stored in environment variables
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Specify the GPT model to use for the correction task
                messages: [
                    { role: "system", content: "You are a helpful assistant."}, // System role for model behavior guidance
                    { 
                        role: "user", 
                        content: `correct this sentence. ${text} `, // User instruction for text correction
                    },
                ],
                max_tokens: 100, // Limit the response to 100 tokens to control the response length
                n: 1, // Request a single response completion
                stop: null, // No specific stop sequence
                temperature: 1, // Set creativity level (1 is balanced; higher values make responses more diverse)
            }),
        });

        // Check if the API response is not OK (e.g., API error, server error)
        if (!response.ok) {
            // Render the 'index' template with an error message
            res.render('index', {
                corrected: 'Something went wrong. Please try again.', // Inform the user about the error
                originalText: text, // Pass the original text back for user convenience
            });
            return; // Exit early if the response is not successful
        }

        // Parse the API response as JSON
        const data = await response.json();

        // Extract the corrected text from the API response
        const correctedText = data.choices[0].message.content;

        // Render the 'index' template with the corrected text and original text
        res.render('index', {
            corrected: correctedText, // Display the corrected text to the user
            originalText: text, // Display the original input text for reference
        });

    } catch (error) {
        // Handle unexpected errors such as network issues or code exceptions
        res.render('index', {
            corrected: 'Something went wrong. Please try again.', // Generic error message for the user
            originalText: text, // Display the original text for user convenience
        });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});