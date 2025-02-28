from flask import Flask, request, jsonify
import requests
import pandas as pd
import numpy as np

app = Flask(__name__)

FMP_API_KEY = "your_fmp_api_key"
FMP_BASE_URL = "https://financialmodelingprep.com/api/v3"

def get_stock_data(ticker):
    url = f"{FMP_BASE_URL}/historical-price-full/{ticker}?apikey={FMP_API_KEY}"
    response = requests.get(url).json()
    if "historical" in response:
        df = pd.DataFrame(response["historical"][:30])  # Last 30 days
        df = df[["date", "close"]].set_index("date").sort_index()
        return df
    return None

def calculate_beta_var(ticker):
    df = get_stock_data(ticker)
    if df is None:
        return {"error": "Invalid ticker or data unavailable"}

    df["returns"] = df["close"].pct_change().dropna()
    
    market_df = get_stock_data("^GSPC")  # S&P 500 as market benchmark
    market_df["returns"] = market_df["close"].pct_change().dropna()

    combined = df.join(market_df, lsuffix="_stock", rsuffix="_market").dropna()
    beta = np.cov(combined["returns_stock"], combined["returns_market"])[0, 1] / np.var(combined["returns_market"])
    
    var_5_days = df["returns"].tail(5).quantile(0.05)

    return {
        "beta": [beta] * 5,  # Simulating for 5 days
        "var": [var_5_days] * 5
    }

@app.route("/api/metrics", methods=["GET"])
def metrics():
    ticker = request.args.get("ticker")
    if not ticker:
        return jsonify({"error": "No ticker provided"}), 400
    
    data = calculate_beta_var(ticker)
    return jsonify(data)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
