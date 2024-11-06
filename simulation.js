document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const chartCanvas = document.getElementById('chartCanvas');
    const ctx2 = chartCanvas.getContext('2d');
    const temperatureSlider = document.getElementById('temperature');
    const DiffconstSlider = document.getElementById('Diffconst');
    const PressureSlider = document.getElementById('DeltaP');
    const toggleWallBtn = document.getElementById('toggleWall');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    let particles = [];
    let animationFrameId;
    let wallIsActive = true; // Wall starts as closed
    const wallPosition = canvas.width * 0.25; // Wall closer to one side
    let timeArray = [];
    let pressureArray = [];
    let steps = 0;
    let P1_calc = 0;
    let P2_calc = 0;
    setInterval(updateSimulationData, 1000);
    function initParticles() {
        particles = [];
        steps = 0;
        let timeArray = [];
        let pressureArray = [];
        
        // Significantly more particles on one side of the wall
	    const DeltaP= parseFloat(PressureSlider.value);
        const numberOfParticles = 1000;

        const leftSideParticles = numberOfParticles*.25+numberOfParticles/2*DeltaP/100;
        const rightSideParticles = numberOfParticles*.75-numberOfParticles/2*DeltaP/100;
        for (let i = 0; i < leftSideParticles; i++) {
            particles.push({
                x: Math.random() * wallPosition, // Particles on the left side
                y: Math.random() * canvas.height,
                vx: Math.random() * 2-1,
                vy: Math.random() * 2-1
            });
        }
        for (let i = 0; i < rightSideParticles; i++) {
            particles.push({
                x: wallPosition + Math.random() * (canvas.width - wallPosition), // Particles on the right side
                y: Math.random() * canvas.height,
                vx: Math.random() * 2-1,
                vy: Math.random() * 2-1
            });
        }
    }

    function update() {
        steps =steps+ 1;
        const temperature = parseFloat(temperatureSlider.value);
        const Diffconst = parseFloat(DiffconstSlider.value);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        
        
        P1_calc+=particles.filter(particle => particle.x < wallPosition).length;
        P2_calc+=particles.filter(particle => particle.x > wallPosition).length;
        
        particles.forEach(particle => {
            const speedAdjustment = temperature / 300*(Diffconst / 10)/10;
            particle.x += particle.vx * speedAdjustment;
            particle.y += particle.vy * speedAdjustment;

            //particle.vx *= 
            //particle.vy *= (1 - Diffconst / 10000);

            if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

            if (wallIsActive && particle.x > wallPosition - 5 && particle.x < wallPosition + 5) {
                particle.vx *= -1;
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });

        if (wallIsActive) {
            ctx.beginPath();
            ctx.moveTo(wallPosition, 0);
            ctx.lineTo(wallPosition, canvas.height);
            ctx.stroke();
        }
        
        // update chart
       

        animationFrameId = requestAnimationFrame(update);

        


    }
    
    function updateSimulationData() {

        const DeltaP_calc = P1_calc/.25 - P2_calc/.75;
        timeArray.push(steps);
        pressureArray.push(DeltaP_calc);
        updateChart(timeArray, pressureArray);
        const resultElement = document.getElementById('result');
        //resultElement.textContent = DeltaP_calc: ${DeltaP_calc};
        P1_calc = 0;
        P2_calc = 0;
       
    }
    function stopSimulation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function resetSimulation() {
        stopSimulation();
        initParticles();
        wallIsActive = true; // Ensure the wall is closed on reset
        update();
    }

    toggleWallBtn.addEventListener('click', function() {
        wallIsActive = !wallIsActive;
        toggleWallBtn.textContent = wallIsActive ? "Open Wall" : "Close Wall";
    });

    startBtn.addEventListener('click', resetSimulation);
    stopBtn.addEventListener('click', stopSimulation);

    initParticles(); // Initialize particles on page load
    
    
});