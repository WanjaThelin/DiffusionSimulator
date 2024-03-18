document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationFrameId;

    // Initialize particles
    function initParticles() {
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
    }

    // Update and draw particles
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Reflect particles off the boundaries
            if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(update);
    }

    // Start simulation
    document.getElementById('startBtn').addEventListener('click', function() {
        if (!animationFrameId) {
            update();
        }
    });

    // Stop simulation
    document.getElementById('stopBtn').addEventListener('click', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    });

    initParticles();
});
