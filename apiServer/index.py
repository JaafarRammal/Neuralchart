from flask import Flask, send_file
from .script_generation import generate_script
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/download')
def download():
    generate_script()
    return send_file('Data/example.py', 'text/x-python', True, 'model.py')
