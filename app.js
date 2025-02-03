
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


// Main logic route 
app.post('/correct', async (req, res) => {
    const text = req.body.text.trim(); // Get the input text from the form

    if (!text) {
        return res.render('index', { 
            corrected: 'Please enter some text to correct.',
            originalText: text,
        });
    }

    try{

        const response = await fetch( "https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            },
            body: JSON.stringify({
                module: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: "You are helpful assistant." }, 
                    { 
                        role: 'user', 
                        content: "Correct the following text: ${text}" 
                    }
                ],
                max_tokens: 100,
                n: 1,
                stop: null,
                temperature: 1,
            }),
        }  );

    }catch(error){

    }
})



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});