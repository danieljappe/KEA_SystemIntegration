from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/fastapiData")
def get_data():
    return {
        "data": "Data from fastAPI" #dictionary data type
    }

@app.get("/requestExpressData")
def get_expressData():
    response = requests.get("http://localhost:3000/expressData")
    data = response.json()
    return data
