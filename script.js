async function fetchRiskData() {
    const input = document.getElementById("securityInput").value.trim();
    const outputDiv = document.getElementById("output");

    if (!input) {
        outputDiv.innerHTML = "<p style='color:red;'>Please enter a valid ISIN or security name.</p>";
        return;
    }

    const apiKey = "WcXMJO2SufKTeiFKpSxxpBO1sO41uUQI"; // Your FMP API Key
    const url = `https://financialmodelingprep.com/api/v3/profile/${input}?apikey=${apiKey}`;

    try {
        outputDiv.innerHTML = "<p>Fetching market risk data...</p>";

        const response = await fetch(url);
        const data = await response.json();

        if (!data || data.length === 0) {
            outputDiv.innerHTML = "<p style='color:red;'>No data found. Please check the security name or ISIN.</p>";
            return;
        }

        const stock = data[0];
        const riskInfo = `
            <h3>${stock.companyName} (${stock.symbol})</h3>
            <p><strong>Market Cap:</strong> $${stock.mktCap.toLocaleString()}</p>
            <p><strong>Beta:</strong> ${stock.beta || 'N/A'}</p>
            <p><strong>Stock Price:</strong> $${stock.price}</p>
            <p><strong>52-Week Range:</strong> ${stock.range}</p>
            <p><strong>Last Dividend:</strong> ${stock.lastDiv || 'N/A'}</p>
        `;

        outputDiv.innerHTML = riskInfo;

    } catch (error) {
        console.error("Error fetching data:", error);
        outputDiv.innerHTML = "<p style='color:red;'>Error fetching market risk data. Please try again later.</p>";
    }
}
