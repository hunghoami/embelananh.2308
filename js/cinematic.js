/* ==========================================================================
   ULTRA-DETAILED GSAP CINEMATIC ANIMATION ENGINE (v300.0)
   ========================================================================== */

class CinematicOrchestrator {
    constructor() {
        this.bgCanvas = document.getElementById('bg-canvas');
        this.ctx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
        this.particles = [];
        this.shootingStars = [];
        this.isCandleBlown = false;

        this.initGalaxyBackground();
        this.initMouseParallax();
    }

    // Dynamic Mouse Parallax Tilt Effect
    initMouseParallax() {
        const appViewport = document.getElementById('app-container');
        if (!appViewport) return;

        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.018;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.018;

            if (typeof gsap !== 'undefined') {
                gsap.to('.party-scene-container, .cinematic-garden-container', {
                    x: moveX,
                    y: moveY,
                    duration: 1.2,
                    ease: "power2.out"
                });
            }
        });
    }

    // Galaxy Background & Shooting Stars
    initGalaxyBackground() {
        if (!this.bgCanvas || !this.ctx) return;

        const resize = () => {
            this.bgCanvas.width = window.innerWidth;
            this.bgCanvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const count = Math.min(Math.floor(window.innerWidth / 13), 90);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 3.5 + 0.8,
                color: Math.random() > 0.4 ? '#ffd700' : (Math.random() > 0.5 ? '#ff758c' : '#e0c3fc'),
                alpha: Math.random() * 0.75 + 0.25,
                speedY: -(Math.random() * 0.35 + 0.1),
                speedX: (Math.random() - 0.5) * 0.25,
                pulse: Math.random() * 0.05 + 0.01
            });
        }

        const spawnShootingStar = () => {
            if (Math.random() > 0.35) {
                this.shootingStars.push({
                    x: Math.random() * window.innerWidth * 0.8,
                    y: Math.random() * window.innerHeight * 0.4,
                    length: Math.random() * 140 + 90,
                    speed: Math.random() * 9.5 + 6,
                    angle: Math.PI / 4,
                    alpha: 1
                });
            }
            setTimeout(spawnShootingStar, Math.random() * 2000 + 1400);
        };
        setTimeout(spawnShootingStar, 500);

        const render = () => {
            this.ctx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);

            this.particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.alpha += Math.sin(Date.now() * 0.002) * p.pulse * 0.1;

                if (p.y < 0) p.y = this.bgCanvas.height;
                if (p.x < 0) p.x = this.bgCanvas.width;
                if (p.x > this.bgCanvas.width) p.x = 0;

                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
                this.ctx.fillStyle = p.color;
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });

            for (let i = this.shootingStars.length - 1; i >= 0; i--) {
                const star = this.shootingStars[i];
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.alpha -= 0.016;

                if (star.alpha <= 0) {
                    this.shootingStars.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.globalAlpha = star.alpha;
                const grad = this.ctx.createLinearGradient(
                    star.x, star.y, 
                    star.x - Math.cos(star.angle) * star.length, 
                    star.y - Math.sin(star.angle) * star.length
                );
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.5, '#ffd700');
                grad.addColorStop(1, 'transparent');

                this.ctx.strokeStyle = grad;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(star.x, star.y);
                this.ctx.lineTo(
                    star.x - Math.cos(star.angle) * star.length, 
                    star.y - Math.sin(star.angle) * star.length
                );
                this.ctx.stroke();
                this.ctx.restore();
            }

            requestAnimationFrame(render);
        };

        render();
    }

    // Candle Blowing Interaction
    blowCandlesOut() {
        if (this.isCandleBlown) return;
        this.isCandleBlown = true;

        console.log("🕯️ Candles blown out!");

        const flamesGroup = document.getElementById('flames-group');
        const candleHint = document.getElementById('candle-hint');

        if (window.audioMgr) {
            window.audioMgr.playCandleBlow();
            setTimeout(() => window.audioMgr.playMagicChime(), 300);
        }

        if (flamesGroup && typeof gsap !== 'undefined') {
            gsap.to(flamesGroup, {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        } else if (flamesGroup) {
            flamesGroup.style.display = 'none';
        }

        if (candleHint) {
            candleHint.innerHTML = "✨ Điều ước của em chắc chắn sẽ thành hiện thực! ✨";
            candleHint.style.background = "linear-gradient(135deg, #00ff88, #ffd700)";
            candleHint.style.color = "#000";
        }

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 85,
                spread: 110,
                origin: { y: 0.65 },
                colors: ['#ffd700', '#ff758c', '#ffffff']
            });
        }
    }

    // ----------------------------------------------------------------------
    // HIGH-DENSITY FIREWORKS EXPLOSION & SCREEN FLASH
    // ----------------------------------------------------------------------
    launchFireworksExplosion() {
        console.log("🎆 Launching High-Density Fireworks & Screen Flash!");

        if (typeof gsap !== 'undefined') {
            // Golden Screen Flash Effect
            gsap.fromTo('.app-viewport', 
                { filter: 'brightness(1.8)' }, 
                { filter: 'brightness(1)', duration: 0.9, ease: "power2.out" }
            );

            gsap.fromTo('.wishes-neon-text .glow-word', 
                { scale: 0, opacity: 0, y: -30 }, 
                { scale: 1, opacity: 1, y: 0, duration: 1.2, stagger: 0.25, ease: "back.out(2)" }
            );

            gsap.fromTo('.table-setup', 
                { y: 80, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.4 }
            );
        }

        if (typeof confetti !== 'function') return;

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 70 * (timeLeft / duration);

            confetti({
                particleCount: particleCount,
                startVelocity: 45,
                spread: 360,
                origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() * 0.4 + 0.2 },
                colors: ['#ffd700', '#ff758c', '#ffffff', '#e0c3fc'],
                disableForReducedMotion: true
            });

            confetti({
                particleCount: particleCount,
                startVelocity: 45,
                spread: 360,
                origin: { x: Math.random() * 0.3 + 0.6, y: Math.random() * 0.4 + 0.2 },
                colors: ['#ffd700', '#ff758c', '#ffffff', '#00e5ff'],
                disableForReducedMotion: true
            });

            if (window.audioMgr) window.audioMgr.playRealisticSparklerCrackle();
        }, 280);
    }

    // GSAP Camera Transition
    transitionToGardenStage() {
        console.log("🎬 Initiating GSAP Camera Transition...");

        const stageParty = document.getElementById('stage-party');
        const stageGift = document.getElementById('stage-gift');
        const partyLayer = document.getElementById('party-stage-layer');

        if (typeof gsap === 'undefined') {
            stageParty.classList.remove('active');
            stageGift.classList.add('active');
            return;
        }

        const tl = gsap.timeline();

        tl.to(partyLayer, {
            scale: 1.35,
            rotationX: 8,
            duration: 2.2,
            ease: "power2.inOut"
        })
        .to(stageParty, {
            opacity: 0,
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
                stageParty.classList.remove('active');
                stageGift.classList.add('active');
            }
        })
        .fromTo(stageGift, 
            { opacity: 0, scale: 0.92 }, 
            { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
        )
        .fromTo('.gift-box-interactive', 
            { y: 80, opacity: 0, scale: 0.4 }, 
            { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "elastic.out(1, 0.5)" }, "-=0.8"
        );
    }

    // ----------------------------------------------------------------------
    // DETAILED GIFT BOX EXPLOSION & 3D UNTIMED ENVELOPE OPENING
    // ----------------------------------------------------------------------
    openHandwrittenCard() {
        const cardModal = document.getElementById('card-modal');
        const cardContainer = document.querySelector('.card-container');
        const giftBox = document.getElementById('interactive-gift-box');
        
        if (!cardModal) return;

        // Trigger Gift Box Bounce Pulse Effect
        if (giftBox && typeof gsap !== 'undefined') {
            gsap.to(giftBox, {
                scale: 1.3,
                duration: 0.25,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        }

        if (window.audioMgr) {
            window.audioMgr.playMagicChime();
            setTimeout(() => window.audioMgr.playCardUnfold(), 260);
        }

        cardModal.classList.add('active');

        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();

            tl.fromTo(cardContainer, 
                { scale: 0.08, rotateX: 75, rotateY: -35, opacity: 0, y: 180 }, 
                { scale: 1, rotateX: 0, rotateY: 0, opacity: 1, y: 0, duration: 1.1, ease: "back.out(1.4)" }
            )
            .fromTo('.wax-seal-header', 
                { scale: 2, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.5, ease: "bounce.out" }, "-=0.4"
            )
            .fromTo('.card-header h2, .handwriting-sub', 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }, "-=0.3"
            )
            .fromTo('.letter-paragraph, .signature-section', 
                { y: 25, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power2.out" }, "-=0.4"
            );
        }

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 95,
                spread: 120,
                origin: { y: 0.58 },
                colors: ['#ffd700', '#ff758c', '#ffffff', '#e0c3fc']
            });
        }
    }

    closeHandwrittenCard() {
        const cardModal = document.getElementById('card-modal');
        if (!cardModal) return;

        const cardContainer = document.querySelector('.card-container');

        if (typeof gsap !== 'undefined') {
            gsap.to(cardContainer, {
                scale: 0.2,
                rotateX: -45,
                opacity: 0,
                y: 120,
                duration: 0.45,
                ease: "power3.in",
                onComplete: () => {
                    cardModal.classList.remove('active');
                }
            });
        } else {
            cardModal.classList.remove('active');
        }
    }
}

// Global Instance
window.cinematicOrch = new CinematicOrchestrator();
