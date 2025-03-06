from fastapi import FastAPI
import requests
import csv
import json
import xmltodict
import yaml

app = FastAPI()

# Responses

@app.get("/fastapiData")
def get_data():
    return {
        "data": "Data from fastAPI" #dictionary data type
    }

@app.get("/requestExpressData")
def get_expressData():
    response = requests.get("http://localhost:8080/expressData")
    data = response.json()
    return data

@app.get("/csv")
def get_csv():
    return { 
        "Go back": "/",
        "CSV": read_csv_file("../../../02._Text_based_Data_Formats/me.csv")}

@app.get("/json")
def get_json():
    return { 
        "Go back": "/",
        "JSON": read_json_file("../../../02._Text_based_Data_Formats/me.json")}

@app.get("/txt")
def get_txt():
    return { 
        "Go back": "/",
        "TXT": read_txt_file("../../../02._Text_based_Data_Formats/me.txt")}

@app.get("/xml")
def get_xml():
    return { 
        "Go back": "/",
        "XML": read_xml_file("../../../02._Text_based_Data_Formats/me.xml")}

@app.get("/yaml")
def get_yaml():
    return { 
        "Go back": "/",
        "YAML": read_yaml_file("../../../02._Text_based_Data_Formats/me.yaml")}

# Requests
@app.get("/requestExpressCsv")
def get_express_csv():
    response = requests.get("http://localhost:8080/csv")
    return response.json()

@app.get("/requestExpressJson")
def get_express_json():
    response = requests.get("http://localhost:8080/json")
    return response.json()

@app.get("/requestExpressTxt")
def get_express_txt():
    response = requests.get("http://localhost:8080/txt")
    return response.json()

@app.get("/requestExpressXml")
def get_express_xml():
    response = requests.get("http://localhost:8080/xml")
    return response.json()

@app.get("/requestExpressYaml")
def get_express_yaml():
    response = requests.get("http://localhost:8080/yaml")
    return response.json()

# Methods
def read_csv_file(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        return list(reader)
    
def read_json_file(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file)
    
def read_txt_file(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        return file.read()
    
def read_xml_file(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        return xmltodict.parse(file.read())
    
def read_yaml_file(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)

