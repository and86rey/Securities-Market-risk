const betaCanvas = document.getElementById("betaChart").getContext("2d");
const varCanvas = document.getElementById("varChart").getContext("2d");

// Clear previous charts
if (window.betaChart) window.betaChart.destroy();
if (window.varChart) window.varChart.destroy();

// Create Beta Trend Chart
window.betaChart = new Chart(betaCanvas, {
    type: "line",
    data: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        datasets: [{
            label: "Beta",
            data: data.beta_values,
            borderColor: "red",
            fill: false,
            tension: 0.3
        }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: false } } }
});

// Create VaR Trend Chart
window.varChart = new Chart(varCanvas, {
    type: "line",
    data: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        datasets: [{
            label: "Value-at-Risk (VaR)",
            data: data.var_values,
            borderColor: "green",
            fill: false,
            tension: 0.3
        }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: false } } }
});
