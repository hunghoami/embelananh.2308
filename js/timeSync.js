/* ==========================================================================
   REAL-TIME TIME SYNCHRONIZATION MODULE (WORLDTIMEAPI + RAF LOOP)
   ========================================================================== */

class TimeSyncManager {
    constructor() {
        this.timeOffsetMs = 0; // Offset = Internet Time - Local performance.now()
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

    // Synchronize clock with WorldTimeAPI (with fallback)
    async fetchInternetTime() {
        const startTime = performance.now();
        
        try {
            this.updateStatus("Đang gọi API worldtimeapi.org...", "syncing");
            
            // Primary API: worldtimeapi.org
            const response = await fetch('https://worldtimeapi.org/api/ip', { cache: 'no-store' });
            if (!response.ok) throw new Error('WorldTimeAPI primary failed');
            
            const data = await response.json();
            const serverUnixMs = new Date(data.datetime).getTime();
            const roundTripLatency = (performance.now() - startTime) / 2;
            
            // Calculate accurate reference offset
            this.timeOffsetMs = (serverUnixMs + roundTripLatency) - performance.now();
            this.isSynced = true;
            
            this.updateStatus(`Đã đồng bộ giờ chuẩn Internet (Độ trễ: ${Math.round(roundTripLatency)}ms)`, "success");
            console.log("⏱️ Time synced via WorldTimeAPI. Offset:", this.timeOffsetMs);

        } catch (err) {
            console.warn("Primary WorldTimeAPI failed, attempting fallback...", err);
            
            // Secondary Fallback API: timeapi.io
            try {
                const fbResponse = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Ho_Chi_Minh', { cache: 'no-store' });
                if (!fbResponse.ok) throw new Error('Fallback TimeAPI failed');
                
                const fbData = await fbResponse.json();
                const serverUnixMs = new Date(fbData.dateTime).getTime();
                const roundTripLatency = (performance.now() - startTime) / 2;
                
                this.timeOffsetMs = (serverUnixMs + roundTripLatency) - performance.now();
                this.isSynced = true;
                
                this.updateStatus("Đã đồng bộ giờ chuẩn Internet (Máy chủ dự phòng)", "success");
                console.log("⏱️ Time synced via TimeAPI fallback.");
            } catch (fallbackErr) {
                console.warn("All internet time APIs unavailable. Falling back to device clock.", fallbackErr);
                this.timeOffsetMs = Date.now() - performance.now();
                this.isSynced = false;
                this.updateStatus("Sử dụng giờ hệ thống (Offline)", "warning");
            }
        }
    }

    // Set Target Birthday Moment
    setTargetTime(targetDate) {
        this.targetTimeMs = new Date(targetDate).getTime();
        this.hasTriggeredComplete = false;
    }

    // Calculate Current Real-time Unix Timestamp
    getNowUnixMs() {
        return performance.now() + this.timeOffsetMs;
    }

    // Start High-Precision requestAnimationFrame Loop (Smooth for 120Hz Displays)
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
