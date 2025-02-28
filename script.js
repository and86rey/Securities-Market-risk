async function fetchRiskData() {
    const input = document.getElementById("securityInput").value.trim();
    const outputDiv = document.getElementById("output");
    const betaCanvas = document.getElementById("betaChart").getContext("2d");
    const varCanvas = document.getElementById("varChart").getContext("2d");

    if (!input) {
        outputDiv.innerHTML = "<p style='color:red;'>Please enter a valid ISIN or stock ticker.</p>";
        return;
    }

    const apiUrl = `http://127.0.0.1:5000/analyze?symbol=${input}`; // Adjust for R API if needed

    try {
        outputDiv.innerHTML = "<p>Fetching market risk data...</p>";

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            outputDiv.innerHTML = `<p style='color:red;'>${data.error}</p>`;
            return;
        }

        const riskInfo = `
            <h3>${data.symbol}</h3>
            <p><strong>Volatility (5 Days):</strong> ${data.volatility}%</p>
        `;
        outputDiv.innerHTML = riskInfo;

        // Display Graph
        document.getElementById("graph").src = data.image;

    } catch (error) {
        console.error("Error fetching data:", error);
        outputDiv.innerHTML = "<p style='color:red;'>Error fetching market risk data. Please try again later.</p>";
    }
}
