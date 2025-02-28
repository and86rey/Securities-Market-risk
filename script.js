async function fetchRiskData() {
    let input = document.getElementById("securityInput").value;
    let outputDiv = document.getElementById("output");

    if (!input) {
        outputDiv.innerHTML = "<p>Please enter a valid ISIN or security name.</p>";
        return;
    }

    try {
        let response = await fetch(`https://api.marketdata.app/v1/stocks/${input}?apikey=YOUR_API_KEY`);
        let data = await response.json();

        if (data.error) {
            outputDiv.innerHTML = `<p>Error: ${data.error}</p>`;
            return;
        }

        let riskInfo = `
            <h3>${data.name} (${data.symbol})</h3>
            <p>Volatility: ${data.volatility}%</p>
            <p>Beta: ${data.beta}</p>
            <p>VaR (Value at Risk): ${data.var}</p>
        `;

        outputDiv.innerHTML = riskInfo;

    } catch (error) {
        outputDiv.innerHTML = `<p>Error fetching data.</p>`;
    }
}
