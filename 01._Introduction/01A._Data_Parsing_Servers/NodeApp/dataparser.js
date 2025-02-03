const fs = require("fs");
const csv = require("csv-parser");
const yaml = require("js-yaml");
const xml2js = require("xml2js");

// Read CSV file
function readCsvFile(filepath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filepath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}

// Read JSON file
function readJsonFile(filepath) {
    return fs.promises.readFile(filepath, "utf-8").then(JSON.parse);
}

// Read TXT file
function readTxtFile(filepath) {
    return fs.promises.readFile(filepath, "utf-8");
}

// Read XML file
function readXmlFile(filepath) {
    return fs.promises.readFile(filepath, "utf-8").then((data) => {
        return xml2js.parseStringPromise(data, { explicitArray: false })
            .then((result) => {
                if (result.me?.hobbies?.hobby) {
                    result.me.hobbies = result.me.hobbies.hobby; // Extract array directly
                }
                return result;
            });
    });
}

// Read YAML file
function readYamlFile(filepath) {
    return fs.promises.readFile(filepath, "utf-8").then(yaml.load);
}

// File paths
const basePath = "../../../02._Text_based_Data_Formats/";

async function main() {
    console.log("--------- CSV File: ---------");
    console.log(await readCsvFile(basePath + "me.csv"));

    console.log("--------- JSON File: ---------");
    console.log(await readJsonFile(basePath + "me.json"));

    console.log("--------- Text File: ---------");
    console.log(await readTxtFile(basePath + "me.txt"));

    console.log("--------- XML File: ---------");
    console.log(await readXmlFile(basePath + "me.xml"));

    console.log("--------- YAML File: ---------");
    console.log(await readYamlFile(basePath + "me.yaml"));
}

main().catch(console.error);

// node dataparser.js