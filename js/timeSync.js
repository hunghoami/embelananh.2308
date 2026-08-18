/* ==========================================================================
   BULLETPROOF HIGH-PRECISION TIME SYNCHRONIZATION MODULE (v1800.0)
   ========================================================================== */

class TimeSyncManager {
    constructor() {
        this.timeOffsetMs = 0; // Delta = Internet Time - System Date.now()
        this.isSynced = false;
        this.targetTimeMs = 0;
        this.rafId = null;
        this.onCompleteCallback = null;
        this.hasTriggeredComplete = false;
        
        // DOM Elements
        this.elDays = document.getElementById('days');
        this.elHours = document.getElementById('hours');
        this.elMinutes = document.getElementById('minutes');
        this.elSeconds = document.getElementById('seconds');
        this.elMs = document.getElementById('milliseconds');
        this.elSyncStatus = document.getElementById('sync-status');
    }

    // Synchronize clock with WorldTimeAPI (Asia/Ho_Chi_Minh)
    async fetchInternetTime() {
        const startTime = performance.now();
        
        try {
            this.updateStatus("Đang đồng bộ giờ hệ thống...", "syncing");
            
            // Primary API: worldtimeapi.org Asia/Ho_Chi_Minh
            const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh', { cache: 'no-store' });
            if (!response.ok) throw new Error('WorldTimeAPI primary failed');
            
            const data = await response.json();
            const serverUnixMs = data.unixtime * 1000;
            const roundTripLatency = (performance.now() - startTime) / 2;
            const nowDeviceMs = Date.now();

            // Measure offset between server epoch and local device epoch
            const deltaMs = (serverUnixMs + roundTripLatency) - nowDeviceMs;
            
            // If delta is reasonable (< 3 minutes), use delta to fine-tune local clock
            if (Math.abs(deltaMs) < 180000) {
                this.timeOffsetMs = deltaMs;
                this.isSynced = true;
                this.updateStatus(`Đã đồng bộ giờ chuẩn Internet (Sai lệch: ${Math.round(deltaMs)}ms)`, "success");
            } else {
                // If delta is too large, rely on device system clock
                this.timeOffsetMs = 0;
                this.isSynced = true;
                this.updateStatus("Đã đồng bộ theo giờ hệ thống thiết bị", "success");
            }
            console.log("⏱️ Time synced. Server Unix:", serverUnixMs, "Local Unix:", nowDeviceMs, "Delta:", this.timeOffsetMs);

        } catch (err) {
            console.warn("Time sync API unavailable, using high-precision local device clock.", err);
            this.timeOffsetMs = 0;
            this.isSynced = false;
            this.updateStatus("Sử dụng giờ hệ thống thiết bị", "warning");
        }
    }

    // Set Target Birthday Moment cleanly
    setTargetTime(targetDate) {
        if (typeof targetDate === 'string') {
            // Parse YYYY-MM-DDTHH:mm:ss string cleanly in local time
            const cleanStr = targetDate.replace('+07:00', '').replace('Z', '');
            const parts = cleanStr.split('T');
            if (parts.length === 2) {
                const dateParts = parts[0].split('-');
                const timeParts = parts[1].split(':');
                if (dateParts.length === 3 && timeParts.length >= 2) {
                    const year = parseInt(dateParts[0], 10);
                    const month = parseInt(dateParts[1], 10) - 1;
                    const day = parseInt(dateParts[2], 10);
                    const hour = parseInt(timeParts[0], 10);
                    const minute = parseInt(timeParts[1], 10);
                    const second = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;
                    
                    // Create local date object
                    const localTarget = new Date(year, month, day, hour, minute, second);
                    this.targetTimeMs = localTarget.getTime();
                    console.log("🎯 Target Parsed Local:", localTarget.toString(), "Epoch Ms:", this.targetTimeMs);
                    return;
                }
            }
        }

        this.targetTimeMs = new Date(targetDate).getTime();
        this.hasTriggeredComplete = false;
    }

    // Calculate Current Real-time Unix Timestamp
    getNowUnixMs() {
        return Date.now() + this.timeOffsetMs;
    }

    // Start High-Precision requestAnimationFrame Loop
    startCountdown(onComplete) {
        this.onCompleteCallback = onComplete;
        
        const tick = () => {
            const now = this.getNowUnixMs();
            const diff = this.targetTimeMs - now;

            if (diff <= 0) {
                this.renderTime(0, 0, 0, 0, 0);
                if (!this.hasTriggeredComplete) {
                    this.hasTriggeredComplete = true;
                    if (this.rafId) cancelAnimationFrame(this.rafId);
                    if (this.onCompleteCallback) this.onCompleteCallback();
                }
                return;
            }

            // Time math
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            const milliseconds = Math.floor((diff % 1000) / 10);

            this.renderTime(days, hours, minutes, seconds, milliseconds);

            this.rafId = requestAnimationFrame(tick);
        };

        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(tick);
    }

    renderTime(d, h, m, s, ms) {
        if (this.elDays) this.elDays.textContent = String(d).padStart(2, '0');
        if (this.elHours) this.elHours.textContent = String(h).padStart(2, '0');
        if (this.elMinutes) this.elMinutes.textContent = String(m).padStart(2, '0');
        if (this.elSeconds) this.elSeconds.textContent = String(s).padStart(2, '0');
        if (this.elMs) this.elMs.textContent = String(ms).padStart(2, '0');
    }

    updateStatus(msg, type) {
        if (!this.elSyncStatus) return;
        this.elSyncStatus.textContent = msg;
        if (type === 'success') {
            this.elSyncStatus.style.color = '#00ff88';
        } else if (type === 'warning') {
            this.elSyncStatus.style.color = '#ffd700';
        }
    }
}

// Global instance
window.timeSyncMgr = new TimeSyncManager();
