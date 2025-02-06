from fastapi import FastAPI
import csv
import json
import xmltodict
import yaml

app = FastAPI()

@app.get("/")
def list_endpoints():
    return {
        "Endpoints": ["/csv", "/json", "/txt", "/xml", "/yaml", ]
    }

@app.get("/csv")
def get_csv():
    return { 
        "Go back": "/",
        "CSV": read_csv_file("../../02._Text_based_Data_Formats/me.csv")}

@app.get("/json")
def get_json():
    return { 
        "Go back": "/",
        "JSON": read_json_file("../../02._Text_based_Data_Formats/me.json")}

@app.get("/txt")
def get_txt():
    return { 
        "Go back": "/",
        "TXT": read_txt_file("../../02._Text_based_Data_Formats/me.txt")}

@app.get("/xml")
def get_xml():
    return { 
        "Go back": "/",
        "XML": read_xml_file("../../02._Text_based_Data_Formats/me.xml")}

@app.get("/yaml")
def get_yaml():
    return { 
        "Go back": "/",
        "YAML": read_yaml_file("../../02._Text_based_Data_Formats/me.yaml")}

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
