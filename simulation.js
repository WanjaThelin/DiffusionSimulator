document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const temperatureSlider = document.getElementById('temperature');
    const viscositySlider = document.getElementById('viscosity');
    const toggleWallBtn = document.getElementById('toggleWall');
    let particles = [];
    let animationFrameId;
    let wallIsActive = false;

    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width * 0.5, // Initialize particles on the left side
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
            // Simulate temperature effect by adjusting speed
            const speedAdjustment = temperature / 300;
            particle.x += particle.vx * speedAdjustment;
            particle.y += particle.vy * speedAdjustment;

            // Simulate viscosity by reducing velocity (simulating drag)
            particle.vx *= (1 - viscosity / 10000);
            particle.vy *= (1 - viscosity / 10000);

            // Reflect particles off the boundaries
            if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

            // Wall logic
            if (wallIsActive && particle.x > canvas.width / 2 - 5 && particle.x < canvas.width / 2 + 5) {
                particle.vx *= -1; // Reflect off the wall
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw the wall if active
        if (wallIsActive) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
        }

        animationFrameId = requestAnimationFrame(update);
    }

    toggleWallBtn.addEventListener('click', function() {
        wallIsActive = !wallIsActive;
    });

    document.getElementById('startBtn').addEventListener('click', function() {
        if (!animationFrameId) {
            initParticles();
            update();
        }
    });

    document.getElementById('stopBtn').addEventListener('click', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    });
});
