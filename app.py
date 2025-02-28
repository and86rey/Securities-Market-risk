from flask import Flask, request, jsonify, render_template
import requests
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)

FMP_API_KEY = "WcXMJO2SufKTeiFKpSxxpBO1sO41uUQI"  # Replace with your actual API key

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/financials", methods=["GET"])
def get_financial_data():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    url = f"https://financialmodelingprep.com/api/v3/profile/{query}?apikey={FMP_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if not data:
        return jsonify({"error": "No data found"}), 404

    return jsonify(data[0])

@app.route("/api/beta", methods=["GET"])
def get_beta():
    ticker = request.args.get("ticker")
    if not ticker:
        return jsonify({"error": "No ticker provided"}), 400

    url = f"https://financialmodelingprep.com/api/v3/stock-beta/{ticker}?apikey={FMP_API_KEY}"
    response = requests.get(url)
    data = response.json()

    beta_values = [entry["beta"] for entry in data]

    return jsonify({"beta": beta_values})

@app.route("/api/var", methods=["GET"])
def get_var():
    ticker = request.args.get("ticker")
    if not ticker:
        return jsonify({"error": "No ticker provided"}), 400

    url = f"https://financialmodelingprep.com/api/v3/historical-price-full/{ticker}?timeseries=5&apikey={FMP_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if "historical" not in data:
        return jsonify({"error": "No historical data found"}), 404

    var_values = [entry["changePercent"] for entry in data["historical"]]

    return jsonify({"var": var_values})

if __name__ == "__main__":
    app.run(debug=True)
