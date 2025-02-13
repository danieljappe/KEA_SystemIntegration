import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send({
        documentation: `Welcome to the Express Server!

Available Endpoints:
1. GET / - Displays this documentation.
2. GET /requestFastAPIData - Fetches data from FastAPI server running at http://localhost:8000/fastapiData.
3. GET /names/:name - Replaces :name with any value and returns 'Your name is {name}'.

Example Usage:
- GET /names/John -> Response: { data: 'Your name is John' }
- GET /requestFastAPIData -> Response: Data fetched from FastAPI server

Ensure the FastAPI server is running on port 8000 for /requestFastAPIData to work.

Server runs on http://localhost:8080`
    });
});

app.get('/requestFastAPIData', async (req, res) => {
    const response = await fetch('http://localhost:8000/fastapiData');
    const data = await response.json();
    res.send(data);
})

app.get("/names/:name", (req, res) => {
    console.log(req.params.name)
    res.send({ data: `Your name is ${req.params.name}`})
})

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});