from dotenv import load_dotenv, dotenv_values
import os

load_dotenv()

config = dotenv_values(".env")
print(os.getenv("API_KEY"))