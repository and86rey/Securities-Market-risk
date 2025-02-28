from flask import Flask, request, jsonify
import requests
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64

app = Flask(__name__)

API_KEY = "WcXMJO2SufKTeiFKpSxxpBO1sO41uUQI"
FMP_URL = "https://financialmodelingprep.com/api/v3/historical-price-full/"

def get_stock_data(symbol):
    response = requests.get(f"{FMP_URL}{symbol}?timeseries=5&apikey={API_KEY}")
    data = response.json()
    return data.get("historical", [])

@app.route("/analyze", methods=["GET"])
def analyze():
    symbol = request.args.get("symbol", "").upper()
    if not symbol:
        return jsonify({"error": "No symbol provided"}), 400

    prices = get_stock_data(symbol)
    if not prices:
        return jsonify({"error": "No data found"}), 404

    # Extract closing prices
    close_prices = [p["close"] for p in prices][::-1]  # Reverse for oldest to newest
    dates = [p["date"] for p in prices][::-1]

    # Compute daily returns
    returns = np.diff(close_prices) / close_prices[:-1]

    # Compute volatility
    volatility = np.std(returns) * 100

    # Simulated Beta values (as FMP doesn’t provide daily Beta)
    beta_values = np.linspace(1, 1.2, len(dates))  # Mock example

    # Compute VaR (95% confidence level)
    VaR_values = 1.65 * beta_values * volatility

    # Plot the graph
    plt.figure(figsize=(8, 4))
    plt.plot(dates, beta_values, label="Beta", color="red")
    plt.plot(dates, VaR_values, label="VaR", color="green")
    plt.legend()
    plt.xticks(rotation=45)
    plt.xlabel("Date")
    plt.ylabel("Risk Metrics")
    plt.title(f"Beta & VaR for {symbol}")

    # Save plot to a PNG image in memory
    img_io = BytesIO()
    plt.savefig(img_io, format="png")
    img_io.seek(0)
    img_base64 = base64.b64encode(img_io.getvalue()).decode()

    return jsonify({
        "symbol": symbol,
        "volatility": round(volatility, 2),
        "beta_values": beta_values.tolist(),
        "var_values": VaR_values.tolist(),
        "image": f"data:image/png;base64,{img_base64}"
    })

if __name__ == "__main__":
    app.run(debug=True)
