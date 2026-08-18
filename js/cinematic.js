/* ==========================================================================
   ULTRA-DETAILED GSAP CINEMATIC ANIMATION ENGINE (AUTO SLIDESHOW v2800.0)
   ========================================================================== */

class CinematicOrchestrator {
    constructor() {
        this.bgCanvas = document.getElementById('bg-canvas');
        this.ctx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
        this.particles = [];
        this.shootingStars = [];
        this.flowerPetals = [];
        this.isCandleBlown = false;
        this.isTransitioning = false;

        this.initGalaxyBackground();
        this.initFallingPetals();
        this.initMouseParallax();
        this.initAmbientFireworks();
    }

    // Dynamic Mouse Parallax Tilt Effect
    initMouseParallax() {
        const appViewport = document.getElementById('app-container');
        if (!appViewport) return;

        window.addEventListener('mousemove', (e) => {
            if (this.isTransitioning) return;

            const moveX = (e.clientX - window.innerWidth / 2) * 0.012;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.012;

            if (typeof gsap !== 'undefined') {
                gsap.to('.party-scene-container, .cinematic-garden-container', {
                    x: moveX,
                    y: moveY,
                    duration: 1.2,
                    overwrite: 'auto',
                    ease: "power2.out"
                });
            }
        });
    }

    // Continuous Falling Flower Petals System
    initFallingPetals() {
        const petalColors = ['#ff758c', '#ff8fa3', '#ffb5a7', '#ffd1dc', '#ffd700'];
        const count = Math.min(Math.floor(window.innerWidth / 30), 40);

        for (let i = 0; i < count; i++) {
            this.flowerPetals.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 10 + 6,
                color: petalColors[Math.floor(Math.random() * petalColors.length)],
                alpha: Math.random() * 0.65 + 0.35,
                speedY: Math.random() * 1.2 + 0.6,
                speedX: Math.random() * 0.8 - 0.4,
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 2 - 1,
                oscillation: Math.random() * 0.05 + 0.02
            });
        }
    }

    // Galaxy Background, Floating Sparkles & Falling Flower Petals Canvas Loop
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

            // 1. Render Floating Magic Particles
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

            // 2. Render Falling Flower Petals
            this.flowerPetals.forEach(petal => {
                petal.y += petal.speedY;
                petal.x += petal.speedX + Math.sin(Date.now() * 0.002 + petal.y * 0.01) * 0.4;
                petal.rotation += petal.rotSpeed;

                if (petal.y > this.bgCanvas.height + 20) {
                    petal.y = -20;
                    petal.x = Math.random() * this.bgCanvas.width;
                }

                this.ctx.save();
                this.ctx.translate(petal.x, petal.y);
                this.ctx.rotate((petal.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = petal.alpha;
                this.ctx.fillStyle = petal.color;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = petal.color;

                // Draw Organic Rose / Sakura Petal Path
                this.ctx.beginPath();
                this.ctx.moveTo(0, -petal.size);
                this.ctx.bezierCurveTo(petal.size / 2, -petal.size / 2, petal.size, petal.size / 3, 0, petal.size);
                this.ctx.bezierCurveTo(-petal.size, petal.size / 3, -petal.size / 2, -petal.size / 2, 0, -petal.size);
                this.ctx.fill();

                this.ctx.restore();
            });

            // 3. Render Shooting Stars
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

    // Ambient Fireworks Burst Loop
    initAmbientFireworks() {
        const triggerBurst = () => {
            const stageParty = document.getElementById('stage-party');
            const stageGift = document.getElementById('stage-gift');

            const isPartyActive = stageParty && stageParty.classList.contains('active');
            const isGiftActive = stageGift && stageGift.classList.contains('active');

            if ((isPartyActive || isGiftActive) && typeof confetti === 'function') {
                confetti({
                    particleCount: Math.floor(Math.random() * 25 + 15),
                    startVelocity: 35,
                    spread: 80,
                    origin: {
                        x: Math.random() * 0.8 + 0.1,
                        y: Math.random() * 0.4 + 0.2
                    },
                    colors: ['#ffd700', '#ff758c', '#ffffff', '#e0c3fc', '#00e5ff'],
                    disableForReducedMotion: true
                });
            }
            setTimeout(triggerBurst, Math.random() * 4500 + 3500);
        };

        setTimeout(triggerBurst, 2500);
    }

    // Candle Blowing Interaction & Automatic Unfold Love Letter Modal
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
                overwrite: 'auto',
                ease: "power2.out"
            });
        } else if (flamesGroup) {
            flamesGroup.style.display = 'none';
        }

        if (candleHint) {
            candleHint.innerHTML = "✨ Ước nguyện tuổi mới đã được trao gửi! Đang mở bức thư yêu thương... 💕";
            candleHint.style.background = "linear-gradient(135deg, #00ff88, #ffd700)";
            candleHint.style.color = "#000";
        }

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 130,
                origin: { y: 0.6 },
                colors: ['#ffd700', '#ff758c', '#ffffff']
            });
        }

        // Unfold Love Letter Modal after 1.4 seconds of candle blow
        setTimeout(() => {
            this.openHandwrittenCard();
        }, 1400);
    }

    // High-Density Fireworks Explosion & Screen Flash
    launchFireworksExplosion() {
        console.log("🎆 Launching High-Density Fireworks & Screen Flash!");

        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.app-viewport', 
                { filter: 'brightness(1.8)' }, 
                { filter: 'brightness(1)', duration: 0.9, ease: "power2.out", overwrite: 'auto' }
            );

            gsap.fromTo('.wishes-neon-text .glow-word', 
                { scale: 0, opacity: 0, y: -30 }, 
                { scale: 1, opacity: 1, y: 0, duration: 1.2, stagger: 0.25, ease: "back.out(2)", overwrite: 'auto' }
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

    // GSAP Camera Transition to Garden Stage
    transitionToGardenStage() {
        console.log("🎬 Initiating GSAP Camera Transition...");
        this.isTransitioning = true;

        const stageParty = document.getElementById('stage-party');
        const stageGift = document.getElementById('stage-gift');
        const partyLayer = document.getElementById('party-stage-layer');

        if (typeof gsap === 'undefined') {
            if (stageParty) stageParty.classList.remove('active');
            if (stageGift) stageGift.classList.add('active');
            this.isTransitioning = false;
            return;
        }

        gsap.killTweensOf([partyLayer, stageParty, stageGift]);

        const tl = gsap.timeline({
            onComplete: () => {
                this.isTransitioning = false;
            }
        });

        tl.to(partyLayer, {
            scale: 1.25,
            duration: 1.8,
            ease: "power2.inOut"
        })
        .to(stageParty, {
            opacity: 0,
            duration: 0.8,
            ease: "power1.out",
            onComplete: () => {
                if (stageParty) stageParty.classList.remove('active');
                if (stageGift) stageGift.classList.add('active');
            }
        })
        .fromTo(stageGift, 
            { opacity: 0, scale: 0.94 }, 
            { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }
        )
        .fromTo('.gift-box-interactive', 
            { y: 60, opacity: 0, scale: 0.5 }, 
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }, "-=0.6"
        );
    }

    // DETAILED GIFT BOX EXPLOSION & 3D UNTIMED ENVELOPE OPENING
    openHandwrittenCard() {
        const cardModal = document.getElementById('card-modal');
        const cardContainer = document.querySelector('.card-container');
        const giftBox = document.getElementById('interactive-gift-box');
        
        if (!cardModal) return;

        if (giftBox && typeof gsap !== 'undefined') {
            gsap.to(giftBox, {
                scale: 1.25,
                duration: 0.25,
                yoyo: true,
                repeat: 1,
                overwrite: 'auto',
                ease: "power2.out"
            });
        }

        if (window.audioMgr) {
            window.audioMgr.playMagicChime();
            setTimeout(() => window.audioMgr.playCardUnfold(), 260);
        }

        cardModal.classList.add('active');

        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf([cardContainer, '.modal-couple-bottom-right', '.salutation', '.letter-paragraph', '.signature-section']);
            const tl = gsap.timeline({
                onComplete: () => {
                    if (window.startCarouselAutoPlay) {
                        window.startCarouselAutoPlay();
                    }
                }
            });

            tl.fromTo(cardContainer, 
                { scale: 0.1, rotateX: 60, opacity: 0, y: 150 }, 
                { scale: 1, rotateX: 0, opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.3)" }
            )
            .fromTo('.modal-couple-bottom-right', 
                { scale: 0, opacity: 0, x: 50, y: 50 }, 
                { scale: 1, opacity: 1, x: 0, y: 0, duration: 0.8, ease: "back.out(1.5)" }, "-=0.5"
            )
            .fromTo('.wax-seal-header', 
                { scale: 1.8, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.45, ease: "bounce.out" }, "-=0.3"
            )
            .fromTo('.card-header h2, .handwriting-sub', 
                { y: 15, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out" }, "-=0.2"
            )
            .fromTo('.salutation', 
                { x: -30, opacity: 0, scale: 0.85 }, 
                { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)" }, "-=0.2"
            )
            .fromTo('.letter-paragraph, .signature-section', 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" }, "-=0.3"
            );
        } else {
            if (window.startCarouselAutoPlay) {
                window.startCarouselAutoPlay();
            }
        }

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 110,
                spread: 140,
                origin: { y: 0.58 },
                colors: ['#ffd700', '#ff758c', '#ffffff', '#e0c3fc']
            });
        }
    }

    closeHandwrittenCard() {
        const cardModal = document.getElementById('card-modal');
        if (!cardModal) return;

        if (window.stopCarouselAutoPlay) {
            window.stopCarouselAutoPlay();
        }

        const cardContainer = document.querySelector('.card-container');

        if (typeof gsap !== 'undefined') {
            gsap.to(cardContainer, {
                scale: 0.2,
                rotateX: -40,
                opacity: 0,
                y: 100,
                duration: 0.4,
                overwrite: 'auto',
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
