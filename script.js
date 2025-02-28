async function fetchRiskData() {
    const input = document.getElementById("securityInput").value.trim();
    const outputDiv = document.getElementById("output");
    const graphImage = document.getElementById("graph");

    if (!input) {
        outputDiv.innerHTML = "<p style='color:red;'>Please enter a valid ISIN or stock ticker.</p>";
        return;
    }

    const backendUrl = "https://securities-market-risk-api.onrender.com"; // Replace with your actual Render URL

    try {
        outputDiv.innerHTML = "<p>Fetching market risk data...</p>";

        const response = await fetch(`${backendUrl}/analyze?symbol=${input}`);
        const data = await response.json();

        if (data.error) {
            outputDiv.innerHTML = `<p style='color:red;'>${data.error}</p>`;
            return;
        }

        // Display text data
        const riskInfo = `
            <h3>${data.symbol}</h3>
            <p><strong>Volatility (5 Days):</strong> ${data.volatility}%</p>
        `;
        outputDiv.innerHTML = riskInfo;

        // Display Base64 Image
        if (data.image) {
            graphImage.src = data.image; // Set image source
            graphImage.style.display = "block"; // Make sure it's visible
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        outputDiv.innerHTML = "<p style='color:red;'>Error fetching market risk data. Please try again later.</p>";
    }
}
