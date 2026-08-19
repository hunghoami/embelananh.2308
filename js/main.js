/* ==========================================================================
   PURE REAL-TIME PRODUCTION CONTROLLER (AUTO SLIDESHOW CAROUSEL v2800.0)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🔒 Production Mode: Running Bulletproof Time Sync & Auto Carousel Engine.");

    // DOM Elements
    const stageCountdown = document.getElementById('stage-countdown');
    const stageParty = document.getElementById('stage-party');
    const audioBtn = document.getElementById('audio-control-btn');
    const audioStatus = document.getElementById('audio-status');
    const interactiveCakeWrapper = document.getElementById('interactive-cake-wrapper');
    const interactiveGiftBox = document.getElementById('interactive-gift-box');
    const btnCloseCard = document.getElementById('btn-close-card');

    // Cute Floating Corner Controls
    const cuteCornerWrapper = document.getElementById('cute-corner-wrapper');
    const cuteToggleTrigger = document.getElementById('cute-toggle-trigger');
    const btnStartImmersive = document.getElementById('btn-start-immersive-experience');
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
    let autoPlayTimer = null;
    let activeVideoHandler = null;

    // PRODUCTION MODE: Exact Birthday Target Date 00:00:00 August 23, 2026
    const targetBirthdayDate = "2026-08-23T00:00:00";
    console.log("🎉 Production Mode Activated: Target Birthday Date:", targetBirthdayDate);

    // ----------------------------------------------------------------------
    // CUTE CORNER MENU TAP TOGGLE & 8-SECOND AUTO-HIDE HANDLER
    // ----------------------------------------------------------------------
    let autoHideMenuTimer = null;

    const resetAutoHideTimer = () => {
        if (autoHideMenuTimer) clearTimeout(autoHideMenuTimer);
        autoHideMenuTimer = setTimeout(() => {
            if (cuteCornerWrapper) {
                cuteCornerWrapper.classList.remove('active');
            }
        }, 8000);
    };

    if (cuteToggleTrigger && cuteCornerWrapper) {
        cuteToggleTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = cuteCornerWrapper.classList.contains('active');

            if (isActive) {
                cuteCornerWrapper.classList.remove('active');
                if (autoHideMenuTimer) clearTimeout(autoHideMenuTimer);
            } else {
                cuteCornerWrapper.classList.add('active');
                resetAutoHideTimer();
            }
        });

        document.addEventListener('click', (e) => {
            if (cuteCornerWrapper && !cuteCornerWrapper.contains(e.target)) {
                cuteCornerWrapper.classList.remove('active');
                if (autoHideMenuTimer) clearTimeout(autoHideMenuTimer);
            }
        });
    }

    // ----------------------------------------------------------------------
    // FULLSCREEN & LANDSCAPE ORIENTATION LOCK HANDLER
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

        const entryOverlay = document.getElementById('immersive-entry-overlay');
        if (entryOverlay) {
            entryOverlay.classList.remove('active');
        }

        const portraitOverlay = document.getElementById('portrait-warning');
        if (portraitOverlay) {
            portraitOverlay.classList.add('dismissed');
            portraitOverlay.style.setProperty('display', 'none', 'important');
        }
    };

    // ----------------------------------------------------------------------
    // EXIT FULLSCREEN HANDLER
    // ----------------------------------------------------------------------
    if (btnExitApp) {
        btnExitApp.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("🚪 Exit Button Tapped.");

            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

            if (window.audioMgr) {
                window.audioMgr.stopBackgroundMusic();
                if (audioStatus) audioStatus.textContent = "Tắt";
            }

            if (cuteCornerWrapper) cuteCornerWrapper.classList.remove('active');
        });
    }

    if (btnStartImmersive) {
        btnStartImmersive.addEventListener('click', (e) => {
            e.stopPropagation();
            requestFullscreenAndLandscapeLock();
            unlockAudio();
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
            resetAutoHideTimer();
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

    // ----------------------------------------------------------------------
    // INTELLIGENT AUTO-PLAY MULTI-MEDIA CAROUSEL SLIDER ENGINE
    // ----------------------------------------------------------------------
    const startAutoPlayForCurrentSlide = () => {
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
            autoPlayTimer = null;
        }

        slides.forEach((slide) => {
            const vid = slide.querySelector('video');
            if (vid && activeVideoHandler) {
                vid.removeEventListener('ended', activeVideoHandler);
            }
        });
        activeVideoHandler = null;

        const cardModal = document.getElementById('card-modal');
        if (!cardModal || !cardModal.classList.contains('active')) return;

        const currentSlideEl = slides[currentSlide];
        if (!currentSlideEl) return;

        const video = currentSlideEl.querySelector('video');

        if (video) {
            console.log(`🎬 Slide ${currentSlide + 1}: Playing Video. Waiting for video to finish...`);
            video.currentTime = 0;
            video.play().catch(() => {});

            activeVideoHandler = () => {
                console.log(`🎬 Video Ended! Advancing to Slide ${currentSlide + 2}...`);
                updateCarousel(currentSlide + 1);
            };
            video.addEventListener('ended', activeVideoHandler, { once: true });
        } else {
            console.log(`📸 Slide ${currentSlide + 1}: Displaying Photo. Auto-advancing in 3.5s...`);
            autoPlayTimer = setTimeout(() => {
                updateCarousel(currentSlide + 1);
            }, 3500);
        }
    };

    const updateCarousel = (index, isUserAction = false) => {
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
                if (idx !== currentSlide) {
                    video.pause();
                }
            }
        });

        if (isUserAction && window.audioMgr) {
            window.audioMgr.playCardUnfold();
        }

        startAutoPlayForCurrentSlide();
    };

    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => updateCarousel(currentSlide - 1, true));
    }
    if (carouselNext) {
        carouselNext.addEventListener('click', () => updateCarousel(currentSlide + 1, true));
    }
    
    // Dynamic Dot Indicators Auto-Generation Engine
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            dot.dataset.index = idx;
            dot.addEventListener('click', () => updateCarousel(idx, true));
            dotsContainer.appendChild(dot);
        });
    }

    // Export Global Carousel Controls for Cinematic Orchestrator
    window.startCarouselAutoPlay = () => {
        updateCarousel(currentSlide, false);
    };

    window.stopCarouselAutoPlay = () => {
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
            autoPlayTimer = null;
        }
        slides.forEach((slide) => {
            const vid = slide.querySelector('video');
            if (vid) {
                vid.pause();
                if (activeVideoHandler) vid.removeEventListener('ended', activeVideoHandler);
            }
        });
    };

    // REAL BIRTHDAY SCENE TRIGGER AT 00:00:00
    function triggerBirthdaySequence() {
        console.log("🎉 MIDNIGHT MOMENT ARRIVED! Starting Romantic Restaurant Birthday Sequence...");

        unlockAudio();

        const entryOverlay = document.getElementById('immersive-entry-overlay');
        if (entryOverlay) entryOverlay.classList.remove('active');

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
