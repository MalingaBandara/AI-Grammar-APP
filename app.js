
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


// Main logic route for handling text correction
app.post('/correct', async (req, res) => {
    // Get the input text from the form and trim any leading/trailing whitespace
    const text = req.body.text.trim();

    // Check if the input text is empty
    if (!text) {
        // Render the 'index' template with an error message if no text is provided
        return res.render('index', { 
            corrected: 'Please enter some text to correct.', // Error message
            originalText: text, // Pass the original text back to the template
        });
    }

    try {
        // Make a POST request to the OpenAI API for text correction
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set content type to JSON
                Authorization: `Bearer ${process.env.OPENAI_KEY}`, // Use OpenAI API key from environment variables
            },
            body: JSON.stringify({
                model: 'gpt-4', // Specify the GPT model to use
                messages: [
                    { 
                        role: 'system', 
                        content: "You are a helpful assistant." // System message to define the assistant's behavior
                    }, 
                    { 
                        role: 'user', 
                        content: `Correct the following text: ${text}` // User message with the text to correct
                    }
                ],
                max_tokens: 100, // Limit the response to 100 tokens
                n: 1, // Request only one completion
                stop: null, // No specific stop sequence
                temperature: 1, // Set creativity level (1 is balanced)
            }),
        });

        // Check if the API response is not OK (e.g., API error)
        if (!response.ok) {
            // Render the 'index' template with an error message
            return res.render('index', {
                corrected: 'Something went wrong. Please try again.', // Error message
                originalText: text, // Pass the original text back to the template
            });
        }

        // Parse the API response as JSON
        const data = await response.json();

        // Extract the corrected text from the API response
        const correctedText = data.choices[0].message.content;

        // Render the 'index' template with the corrected text and original text
        res.render('index', {
            corrected: correctedText, // Pass the corrected text to the template
            originalText: text, // Pass the original text back to the template
        });

    } catch (error) {
        // Handle any unexpected errors (e.g., network issues)
        return res.render('index', {
            corrected: 'Something went wrong. Please try again.', // Error message
            originalText: text, // Pass the original text back to the template
        });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});