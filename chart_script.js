const chartCanvas = document.getElementById('chartCanvas');
const ctx2 = chartCanvas.getContext('2d');

// Use Chart.js for more flexible charting options
let myChart = null; // Will hold the chart object

function createChart(timeData, pressureData) {
    myChart = new Chart(chartCanvas, {
        type: 'scatter', // Scatter chart suitable for time vs. value plots
        data: {
            datasets: [{
                label: 'Pressure',
                data: timeData.map((time, index) => ({x: time, y: pressureData[index]}))
            }]
        },
        options: {
            scales: {
              x: {
                 type: 'linear', // Might need adjustments if time data is non-numeric
              }
            }
         }
    });
}

function updateChart(timeData, pressureData) {
    if (myChart === null) {
        // Create the chart initially
        createChart(timeData, pressureData);
    } else {
        // Update existing chart data
        myChart.data.datasets[0].data = timeData.map((time, index) => ({x: time, y: pressureData[index]}));
        myChart.update();
    }
}
