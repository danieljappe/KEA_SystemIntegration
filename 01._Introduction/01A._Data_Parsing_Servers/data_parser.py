# Python libraries: YAML: pyyaml, CSV: pandas, XML: xmltodict

import csv
import json
import xmltodict
import yaml

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


print("---------CSV File:---------")    
print(read_csv_file("../../02._Text_based_Data_Formats/me.csv"))

print("---------JSON File:---------")    
print(read_json_file("../../02._Text_based_Data_Formats/me.json"))

print("---------Text File:---------")    
print(read_txt_file("../../02._Text_based_Data_Formats/me.txt"))

print("---------XML File:---------")    
print(read_xml_file("../../02._Text_based_Data_Formats/me.xml"))

print("---------YAML File:---------")    
print(read_yaml_file("../../02._Text_based_Data_Formats/me.yaml"))

# python data_parser.py
