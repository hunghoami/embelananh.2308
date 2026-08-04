/* ==========================================================================
   PURE REAL-TIME PRODUCTION CONTROLLER (MINIMALIST & EXIT HANDLER v800.0)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🔒 Production Mode: Clean Minimalist View & Exit Button Handler Enabled.");

    // DOM Elements
    const stageCountdown = document.getElementById('stage-countdown');
    const stageParty = document.getElementById('stage-party');
    const audioBtn = document.getElementById('audio-control-btn');
    const audioStatus = document.getElementById('audio-status');
    const interactiveCakeWrapper = document.getElementById('interactive-cake-wrapper');
    const interactiveGiftBox = document.getElementById('interactive-gift-box');
    const btnCloseCard = document.getElementById('btn-close-card');

    // Controls
    const entryOverlay = document.getElementById('immersive-entry-overlay');
    const btnStartImmersive = document.getElementById('btn-start-immersive-experience');
    const btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');
    const btnOverlayFullscreen = document.getElementById('btn-trigger-fullscreen-overlay');
    const btnExitApp = document.getElementById('btn-exit-app');

    // Multi-Media Polaroid Carousel Elements
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    // REAL BIRTHDAY TARGET TIME CONFIGURATION
    const targetBirthdayDate = "2026-08-15T00:00:00"; 
    console.log("🎯 Real Birthday Moment Locked:", targetBirthdayDate);

    // ----------------------------------------------------------------------
    // FULLSCREEN & LANDSCAPE LOCK HANDLER
    // ----------------------------------------------------------------------
    const requestFullscreenAndLandscapeLock = () => {
        const docEl = document.documentElement;

        const fsPromise = docEl.requestFullscreen ? docEl.requestFullscreen() :
                          (docEl.webkitRequestFullscreen ? docEl.webkitRequestFullscreen() : Promise.resolve());

        if (fsPromise && fsPromise.then) {
            fsPromise.then(() => {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(() => {});
                }
            }).catch(() => {});
        } else {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {});
            }
        }

        if (entryOverlay) {
            entryOverlay.classList.remove('active');
        }
    };

    // ----------------------------------------------------------------------
    // EXIT FULLSCREEN HANDLER (NÚT THOÁT LUÔN HIỂN THỊ)
    // ----------------------------------------------------------------------
    if (btnExitApp) {
        btnExitApp.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("🚪 Exit Button Tapped. Exiting Fullscreen...");
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

            if (window.audioMgr) {
                window.audioMgr.stopBackgroundMusic();
                if (audioStatus) audioStatus.textContent = "Tắt";
            }
        });
    }

    if (btnStartImmersive) {
        btnStartImmersive.addEventListener('click', (e) => {
            e.stopPropagation();
            requestFullscreenAndLandscapeLock();
            unlockAudio();
        });
    }

    if (btnToggleFullscreen) {
        btnToggleFullscreen.addEventListener('click', (e) => {
            e.stopPropagation();
            requestFullscreenAndLandscapeLock();
        });
    }

    if (btnOverlayFullscreen) {
        btnOverlayFullscreen.addEventListener('click', (e) => {
            e.stopPropagation();
            requestFullscreenAndLandscapeLock();
        });
    }

    // Audio Interaction Unlock
    const unlockAudio = () => {
        requestFullscreenAndLandscapeLock();
        if (window.audioMgr) {
            window.audioMgr.init();
            window.audioMgr.startBackgroundMusic();
            if (audioStatus) audioStatus.textContent = "Bật";
        }
    };

    document.body.addEventListener('click', unlockAudio, { once: true });
    document.body.addEventListener('touchstart', unlockAudio, { once: true });

    if (audioBtn) {
        audioBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.audioMgr) {
                const isMuted = window.audioMgr.toggleMute();
                if (audioStatus) audioStatus.textContent = isMuted ? "Tắt" : "Bật";
            }
        });
    }

    // Interactive Cake Candle Blowing
    if (interactiveCakeWrapper) {
        interactiveCakeWrapper.addEventListener('click', () => {
            if (window.cinematicOrch) {
                window.cinematicOrch.blowCandlesOut();
            }
        });
    }

    // Fetch Real-time Internet Clock & Run Pure Countdown
    if (window.timeSyncMgr) {
        await window.timeSyncMgr.fetchInternetTime();
        window.timeSyncMgr.setTargetTime(targetBirthdayDate);

        window.timeSyncMgr.startCountdown(() => {
            triggerBirthdaySequence();
        });
    }

    // Interactive Gift Box & Love Letter Modal
    if (interactiveGiftBox) {
        interactiveGiftBox.addEventListener('click', () => {
            if (window.cinematicOrch) {
                window.cinematicOrch.openHandwrittenCard();
            }
        });
    }

    if (btnCloseCard) {
        btnCloseCard.addEventListener('click', () => {
            if (window.cinematicOrch) {
                window.cinematicOrch.closeHandwrittenCard();
            }
        });
    }

    // MULTI-MEDIA CAROUSEL SLIDER CONTROLLER
    const updateCarousel = (index) => {
        currentSlide = (index + totalSlides) % totalSlides;
        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });

        slides.forEach((slide, idx) => {
            const video = slide.querySelector('video');
            if (video) {
                if (idx === currentSlide) {
                    video.currentTime = 0;
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            }
        });

        if (window.audioMgr) window.audioMgr.playCardUnfold();
    };

    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => updateCarousel(currentSlide - 1));
    }
    if (carouselNext) {
        carouselNext.addEventListener('click', () => updateCarousel(currentSlide + 1));
    }
    
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => updateCarousel(idx));
        });
    }

    // REAL BIRTHDAY SCENE TRIGGER AT 00:00:00
    function triggerBirthdaySequence() {
        console.log("🎉 MIDNIGHT MOMENT ARRIVED! Starting Real Birthday Sequence...");

        unlockAudio();

        if (stageCountdown) stageCountdown.classList.remove('active');
        if (stageParty) stageParty.classList.add('active');

        if (window.cinematicOrch) {
            window.cinematicOrch.launchFireworksExplosion();
        }

        setTimeout(() => {
            if (window.cinematicOrch) {
                window.cinematicOrch.transitionToGardenStage();
            }
        }, 6500);
    }
});
