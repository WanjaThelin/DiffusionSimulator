document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const temperatureSlider = document.getElementById('temperature');
    const viscositySlider = document.getElementById('viscosity');
    const toggleWallBtn = document.getElementById('toggleWall');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    let particles = [];
    let animationFrameId;
    let wallIsActive = true; // Wall starts as closed
    const wallPosition = canvas.width * 0.25; // Wall closer to one side

    function initParticles() {
        particles = [];
        // Significantly more particles on one side of the wall
        const leftSideParticles = 900;
        const rightSideParticles = 100;
        for (let i = 0; i < leftSideParticles; i++) {
            particles.push({
                x: Math.random() * wallPosition, // Particles on the left side
                y: Math.random() * canvas.height,
                vx: Math.random() * 2,
                vy: Math.random() * 2
            });
        }
        for (let i = 0; i < rightSideParticles; i++) {
            particles.push({
                x: wallPosition + Math.random() * (canvas.width - wallPosition), // Particles on the right side
                y: Math.random() * canvas.height,
                vx: Math.random() * 2,
                vy: Math.random() * 2
            });
        }
    }

    function update() {
        const temperature = parseFloat(temperatureSlider.value);
        const viscosity = parseFloat(viscositySlider.value);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            const speedAdjustment = temperature / 300;
            particle.x += particle.vx * speedAdjustment;
            particle.y += particle.vy * speedAdjustment;

            particle.vx *= (1 - viscosity / 10000);
            particle.vy *= (1 - viscosity / 10000);

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

        animationFrameId = requestAnimationFrame(update);
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
