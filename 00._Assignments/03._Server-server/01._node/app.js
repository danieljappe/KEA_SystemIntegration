import express from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import yaml from 'js-yaml';

const app = express();

// Serve CSV
app.get('/csv', (req, res) => {
    const results = [];
    fs.createReadStream('../02._Text_based_Data_Formats/me.csv')
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => res.json(results));
});

// Serve JSON
app.get('/json', (req, res) => {
    const data = fs.readFileSync('../02._Text_based_Data_Formats/me.json', 'utf8');
    res.json(JSON.parse(data));
});

// Serve TXT
app.get('/txt', (req, res) => {
    const data = fs.readFileSync('../02._Text_based_Data_Formats/me.txt', 'utf8');
    res.send(data);
});

// Serve XML
app.get('/xml', (req, res) => {
    const data = fs.readFileSync('../02._Text_based_Data_Formats/me.xml', 'utf8');
    res.send(data);
});

// Serve YAML
app.get('/yaml', (req, res) => {
    const data = fs.readFileSync('../02._Text_based_Data_Formats/me.yaml', 'utf8');
    const parsedData = yaml.load(data);
    res.json(parsedData);
});

async function fetchFastAPIData(format) {
    const response = await fetch(`http://localhost:8000/${format}`);
    const data = await response.json();
    return data;
}

app.get('/requestFastapiCsv', async (req, res) => {
    res.json(await fetchFastAPIData('csv'));
});

app.get('/requestFastapiJson', async (req, res) => {
    res.json(await fetchFastAPIData('json'));
});

app.get('/requestFastapiTxt', async (req, res) => {
    res.json(await fetchFastAPIData('txt'));
});

app.get('/requestFastapiXml', async (req, res) => {
    res.json(await fetchFastAPIData('xml'));
});

app.get('/requestFastapiYaml', async (req, res) => {
    res.json(await fetchFastAPIData('yaml'));
});


const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});