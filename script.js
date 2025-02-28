document.getElementById("searchButton").addEventListener("click", fetchFinancialData);

async function fetchFinancialData() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) {
        alert("Please enter a company name, ISIN, or ticker.");
        return;
    }

    const apiKey = "YOUR_FMP_API_KEY"; // Replace with your actual FMP API key
    const url = `https://financialmodelingprep.com/api/v3/profile/${query}?apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length === 0) {
            alert("No data found. Check the ticker or ISIN.");
            return;
        }

        displayFinancialData(data[0]);
        fetchBetaAndVar(query, apiKey);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to retrieve financial data.");
    }
}

function displayFinancialData(data) {
    document.getElementById("financialData").innerHTML = `
        <h2>${data.companyName} (${data.symbol})</h2>
        <p>Industry: ${data.industry}</p>
        <p>Market Cap: $${(data.mktCap / 1e9).toFixed(2)}B</p>
        <p>Stock Price: $${data.price}</p>
    `;
}

async function fetchBetaAndVar(ticker, apiKey) {
    try {
        const betaResponse = await fetch(`https://financialmodelingprep.com/api/v3/stock-beta/${ticker}?apikey=${apiKey}`);
        const betaData = await betaResponse.json();

        const varResponse = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?timeseries=5&apikey=${apiKey}`);
        const varData = await varResponse.json();

        const betaValues = betaData.map(entry => entry.beta);
        const varValues = varData.historical.map(entry => entry.changePercent);

        drawChart("betaChart", "Beta Over Time", betaValues);
        drawChart("varChart", "Value at Risk (VaR) - Last 5 Days", varValues);
    } catch (error) {
        console.error("Error fetching Beta/Var data:", error);
    }
}

function drawChart(canvasId, title, dataValues) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: Array.from({ length: dataValues.length }, (_, i) => `Day ${i + 1}`),
            datasets: [{
                label: title,
                data: dataValues,
                borderColor: "#f8b400",
                backgroundColor: "rgba(248, 180, 0, 0.2)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
