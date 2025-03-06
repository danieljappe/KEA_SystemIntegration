import express from 'express';

const app = express();

app.use(express.static('public'));

const randomNumbers = [];

app.get('/randomnumbers', (req, res) => {
    res.json({data: randomNumbers});
});

app.get('/simulatenewnumbers', (req, res) => {
    const newNumber = getRandomInt(1, 1000);
    randomNumbers.push(newNumber);
    res.send({data: newNumber});
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});