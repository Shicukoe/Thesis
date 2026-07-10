/**
 * AetherPortal - Interactive Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const portalTime = document.getElementById('portal-time');
  const portalDate = document.getElementById('portal-date');
  const greetingText = document.getElementById('greeting-text');
  
  const themeBtn = document.getElementById('theme-btn');
  const themeDropdown = document.getElementById('theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  
  const notepad = document.getElementById('notebook-textarea');
  const charCount = document.getElementById('char-count');
  const notebookStatus = document.getElementById('notebook-status');
  const clearNotesBtn = document.getElementById('clear-notes');
  
  const searchTrigger = document.getElementById('search-trigger');
  const cmdBackdrop = document.getElementById('cmd-backdrop');
  const cmdInput = document.getElementById('cmd-search-input');
  const cmdResults = document.getElementById('cmd-results-list');
  const logList = document.getElementById('log-list');
  const toastHolder = document.getElementById('toast-holder');

  // --- Real-time Clock ---
  function updateClock() {
    const now = new Date();
    
    // Time
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    portalTime.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    portalDate.textContent = now.toLocaleDateString('en-US', options);
    
    // Greeting
    let greeting = "Welcome back, Evelyn";
    if (now.getHours() < 12) greeting = "Good morning, Evelyn";
    else if (now.getHours() < 18) greeting = "Good afternoon, Evelyn";
    else greeting = "Good evening, Evelyn";
    greetingText.textContent = greeting;
  }
  
  setInterval(updateClock, 1000);
  updateClock();

  // --- Theme Management ---
  function setTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('portal-theme', themeName);
    
    // Update dropdown UI
    themeOptions.forEach(opt => {
      if (opt.getAttribute('data-theme') === themeName) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
    
    showToast(`System layout set to: ${themeName.toUpperCase()}`, 'success');
  }

  // Load Saved Theme
  const savedTheme = localStorage.getItem('portal-theme') || 'light';
  setTheme(savedTheme);

  // Toggle theme dropdown
  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    themeDropdown.classList.remove('show');
  });

  themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      const theme = option.getAttribute('data-theme');
      setTheme(theme);
    });
  });

  // --- Research Scratchpad Logic ---
  // Load saved notes
  const savedNotes = localStorage.getItem('portal-notes') || '';
  notepad.value = savedNotes;
  updateNoteStats();

  function updateNoteStats() {
    const text = notepad.value;
    charCount.textContent = `${text.length} char${text.length !== 1 ? 's' : ''}`;
  }

  let noteSaveTimeout;
  notepad.addEventListener('input', () => {
    updateNoteStats();
    notebookStatus.textContent = 'Saving...';
    
    clearTimeout(noteSaveTimeout);
    noteSaveTimeout = setTimeout(() => {
      localStorage.setItem('portal-notes', notepad.value);
      notebookStatus.textContent = 'Saved auto';
    }, 800);
  });

  clearNotesBtn.addEventListener('click', () => {
    if (notepad.value.length > 0) {
      if (confirm('Clear all contents in the scratchpad?')) {
        notepad.value = '';
        localStorage.setItem('portal-notes', '');
        updateNoteStats();
        showToast('Scratchpad cleared', 'warning');
      }
    }
  });

  // --- Toast Notification Helper ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') {
      icon = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (type === 'warning') {
      icon = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else if (type === 'danger') {
      icon = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>';
    } else {
      icon = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>';
    }

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastHolder.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // --- Real-time Simulated Telemetry Charts ---
  class TelemetrySparkline {
    constructor(canvasId, initialVal, minRange, maxRange, formatFn) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.valElement = this.canvas.previousElementSibling.previousElementSibling; // relative to container layout
      
      this.minRange = minRange;
      this.maxRange = maxRange;
      this.formatFn = formatFn;
      this.data = Array.from({ length: 15 }, () => initialVal + (Math.random() - 0.5) * (maxRange - minRange) * 0.1);
      
      // Auto-resize canvas for sharp display
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * window.devicePixelRatio;
      this.canvas.height = rect.height * window.devicePixelRatio;
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.draw();
    }

    update(newVal) {
      this.data.push(newVal);
      if (this.data.length > 20) {
        this.data.shift();
      }
      this.draw();
    }

    draw() {
      if (!this.canvas) return;
      const ctx = this.ctx;
      const w = this.canvas.width / window.devicePixelRatio;
      const h = this.canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, w, h);
      
      if (this.data.length < 2) return;

      // Draw sparkline path
      ctx.beginPath();
      
      const getX = (index) => (index / (this.data.length - 1)) * w;
      const getY = (val) => {
        const range = this.maxRange - this.minRange;
        const norm = (val - this.minRange) / range;
        return h - 4 - (norm * (h - 8)); // padding top/bottom
      };

      ctx.moveTo(getX(0), getY(this.data[0]));
      for (let i = 1; i < this.data.length; i++) {
        ctx.lineTo(getX(i), getY(this.data[i]));
      }

      // Read accent color from styles
      const styles = getComputedStyle(document.body);
      const accentColor = styles.getPropertyValue('--accent').trim();
      
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Shadow glow for line
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Area gradient
      ctx.lineTo(getX(this.data.length - 1), h);
      ctx.lineTo(getX(0), h);
      ctx.closePath();
      
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, accentColor.replace(')', ', 0.15)').replace('rgb', 'rgba').replace('#3b82f6', 'rgba(59,130,246,0.15)').replace('#2563eb', 'rgba(37,99,235,0.15)').replace('#ff007f', 'rgba(255,0,127,0.15)'));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // Initialize simulated metrics
  const powerChart = new TelemetrySparkline('power-chart', 94.8, 90, 100, (v) => `${v.toFixed(1)}%`);
  const latencyChart = new TelemetrySparkline('latency-chart', 14, 5, 30, (v) => `${Math.round(v)} ms`);
  const computeChart = new TelemetrySparkline('compute-chart', 8.4, 6, 12, (v) => `${v.toFixed(1)} TFlops`);

  // Telemetry loop (every 1.5 seconds)
  setInterval(() => {
    // 1. Power oscillations
    let currentPower = parseFloat(document.getElementById('power-stat').textContent);
    currentPower += (Math.random() - 0.5) * 0.8;
    currentPower = Math.max(90, Math.min(100, currentPower));
    document.getElementById('power-stat').textContent = `${currentPower.toFixed(1)}%`;
    powerChart.update(currentPower);

    // 2. Latency jumps
    let currentLatency = parseInt(document.getElementById('latency-stat').textContent);
    currentLatency += Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : -2) : (Math.random() - 0.5) * 1;
    currentLatency = Math.max(8, Math.min(25, currentLatency));
    document.getElementById('latency-stat').textContent = `${Math.round(currentLatency)} ms`;
    latencyChart.update(currentLatency);

    // 3. Compute workloads
    let currentCompute = parseFloat(document.getElementById('compute-stat').textContent);
    currentCompute += (Math.random() - 0.5) * 0.4;
    currentCompute = Math.max(7, Math.min(11, currentCompute));
    document.getElementById('compute-stat').textContent = `${currentCompute.toFixed(1)} TFlops`;
    computeChart.update(currentCompute);
  }, 1500);

  // --- Add Event Log helper ---
  function appendLog(message, type = 'info') {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    let colorClass = '';
    let iconSvg = '';

    if (type === 'success') {
      colorClass = 'success';
      iconSvg = '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (type === 'warning') {
      colorClass = 'warning';
      iconSvg = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else if (type === 'danger') {
      colorClass = 'danger';
      iconSvg = '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    item.innerHTML = `
      <div class="activity-icon-wrapper ${colorClass}">${iconSvg}</div>
      <div class="activity-details">
        <span class="activity-text">${message}</span>
        <span class="activity-time">${timeStr}</span>
      </div>
    `;

    logList.insertBefore(item, logList.firstChild);
    if (logList.children.length > 20) {
      logList.lastChild.remove();
    }
  }

  // --- Command Palette Command Registration & Logic ---
  const navigateTo = (tabName) => {
    const item = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (item) item.click();
  };

  const commands = [
    { id: 'nav-dashboard', label: 'Navigate to Dashboard', group: 'Navigation', action: () => navigateTo('dashboard'), icon: 'dashboard' },
    { id: 'nav-policies', label: 'Navigate to Policies', group: 'Navigation', action: () => navigateTo('policies'), icon: 'policies' },
    { id: 'nav-history', label: 'Navigate to History', group: 'Navigation', action: () => navigateTo('history'), icon: 'history' },
    { id: 'nav-contact', label: 'Navigate to Contact', group: 'Navigation', action: () => navigateTo('contact'), icon: 'contact' },
    { id: 'theme-light', label: 'Switch theme to Light Mist', group: 'Preferences', action: () => setTheme('light'), icon: 'sun' },
    { id: 'theme-cyberpunk', label: 'Switch theme to Cyberpunk Mode', group: 'Preferences', action: () => setTheme('cyberpunk'), icon: 'zap' },
    { id: 'run-analysis', label: 'Run Quantum Decoy Analysis', group: 'Experiments', action: () => runQuantumDecoy(), icon: 'play' },
    { id: 'clear-notes', label: 'Clear Research Scratchpad', group: 'Tools', action: () => clearScratchpad(), icon: 'trash' },
    { id: 'trigger-mock-warning', label: 'Simulate Intranode Warning Alert', group: 'Diagnostics', action: () => simulateNodeWarning(), icon: 'alert' }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...commands];

  function openCommandPalette() {
    cmdBackdrop.classList.add('show');
    cmdInput.value = '';
    cmdInput.focus();
    selectedIndex = 0;
    renderCommandList();
  }

  function closeCommandPalette() {
    cmdBackdrop.classList.remove('show');
  }

  function getIconSvg(iconName) {
    switch (iconName) {
      case 'dashboard': return '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>';
      case 'policies': return '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      case 'history': return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
      case 'contact': return '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
      case 'moon': return '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      case 'sun': return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      case 'zap': return '<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
      case 'play': return '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      case 'trash': return '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
      case 'alert': return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      default: return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';
    }
  }

  function renderCommandList() {
    cmdResults.innerHTML = '';
    if (filteredCommands.length === 0) {
      cmdResults.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No matching commands found</div>';
      return;
    }

    let lastGroup = '';
    filteredCommands.forEach((cmd, idx) => {
      // Group header
      if (cmd.group !== lastGroup) {
        lastGroup = cmd.group;
        const groupHeader = document.createElement('div');
        groupHeader.className = 'cmd-group-title';
        groupHeader.textContent = lastGroup;
        cmdResults.appendChild(groupHeader);
      }

      // Command option item
      const item = document.createElement('div');
      item.className = `cmd-item ${idx === selectedIndex ? 'active' : ''}`;
      item.innerHTML = `
        <div class="cmd-item-icon">${getIconSvg(cmd.icon)}</div>
        <span class="cmd-item-label">${cmd.label}</span>
        <span class="cmd-item-shortcut">↵ Enter</span>
      `;
      
      item.addEventListener('click', () => {
        cmd.action();
        closeCommandPalette();
      });

      cmdResults.appendChild(item);
    });

    // Keep active option in view
    const activeItem = cmdResults.querySelector('.cmd-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }

  // Action registrations
  function runQuantumDecoy() {
    showToast('Quantum Decoy Analysis triggered', 'success');
    appendLog('Manual Quantum Decoy scan triggered via console.', 'success');
    
    // Simulate active task animation reset
    const pb = document.querySelector('.project-item:first-child .progress-bar-fill');
    if (pb) {
      pb.style.transition = 'none';
      pb.style.width = '0%';
      setTimeout(() => {
        pb.style.transition = 'width 5s cubic-bezier(0.4, 0, 0.2, 1)';
        pb.style.width = '100%';
        setTimeout(() => {
          appendLog('Quantum Decoy Analysis scan completed successfully.', 'success');
          showToast('Quantum Decoy analysis completed!', 'success');
        }, 5000);
      }, 50);
    }
  }

  function clearScratchpad() {
    notepad.value = '';
    localStorage.setItem('portal-notes', '');
    updateNoteStats();
    showToast('Scratchpad cleared', 'warning');
    appendLog('Cleared active researcher notes buffer.', 'info');
  }

  function simulateNodeWarning() {
    showToast('Node calibration warning triggered!', 'danger');
    appendLog('Core thermal anomaly detected in Node #4 sectors.', 'warning');
  }

  // Keyboard shortcut listener
  document.addEventListener('keydown', (e) => {
    // Open Ctrl+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    
    // Escape to close
    if (e.key === 'Escape') {
      closeCommandPalette();
    }

    // Modal navigation
    if (cmdBackdrop.classList.contains('show')) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        renderCommandList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        renderCommandList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          closeCommandPalette();
        }
      }
    }
  });

  // Filter commands on search input
  cmdInput.addEventListener('input', () => {
    const val = cmdInput.value.toLowerCase().trim();
    if (val === '') {
      filteredCommands = [...commands];
    } else {
      filteredCommands = commands.filter(cmd => 
        cmd.label.toLowerCase().includes(val) || 
        cmd.group.toLowerCase().includes(val)
      );
    }
    selectedIndex = 0;
    renderCommandList();
  });

  // Trigger from search bar click
  searchTrigger.addEventListener('click', openCommandPalette);

  // Close when clicking outside modal
  cmdBackdrop.addEventListener('click', (e) => {
    if (e.target === cmdBackdrop) {
      closeCommandPalette();
    }
  });

  // --- Nav Tab Clicks (Simulated Tabs) ---
  const navItems = document.querySelectorAll('.nav-item');
  const tabViews = document.querySelectorAll('.tab-view');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const tabName = item.getAttribute('data-tab');
      
      // Toggle tab views visibility
      tabViews.forEach(view => {
        view.style.display = 'none';
        view.classList.remove('active-view');
      });
      
      const targetView = document.getElementById(`view-${tabName}`);
      if (targetView) {
        targetView.style.display = 'block';
        targetView.classList.add('active-view');
        
        // Triggers sparkline redraws if switching back to active telemetry dashboards
        if (tabName === 'dashboard') {
          setTimeout(() => {
            if (powerChart && powerChart.resize) powerChart.resize();
            if (latencyChart && latencyChart.resize) latencyChart.resize();
            if (computeChart && computeChart.resize) computeChart.resize();
          }, 100);
        }
      }
      
      showToast(`Loading: ${tabName.toUpperCase()} segment`, 'info');
      appendLog(`Routed user workspace viewport to ${tabName}.`, 'info');
    });
  });
  
  // --- Contact Form Validations & Submissions ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactMessage = document.getElementById('contact-message');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Clean previous styles/displays
      nameError.style.display = 'none';
      emailError.style.display = 'none';
      messageError.style.display = 'none';
      contactName.style.borderColor = '';
      contactEmail.style.borderColor = '';
      contactMessage.style.borderColor = '';
      
      // Validate Name
      if (contactName.value.trim() === '') {
        nameError.style.display = 'block';
        contactName.style.borderColor = 'var(--accent-danger)';
        isValid = false;
      }
      
      // Validate Email address format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail.value.trim())) {
        emailError.style.display = 'block';
        contactEmail.style.borderColor = 'var(--accent-danger)';
        isValid = false;
      }
      
      // Validate Message details
      if (contactMessage.value.trim() === '') {
        messageError.style.display = 'block';
        contactMessage.style.borderColor = 'var(--accent-danger)';
        isValid = false;
      }
      
      if (isValid) {
        const senderEmail = contactEmail.value.trim();
        showToast('Support query transmitted successfully!', 'success');
        appendLog(`Support request diagnostic ticket logged from: ${senderEmail}`, 'success');
        
        // Reset form fields
        contactForm.reset();
      } else {
        showToast('Form inputs failed security checks.', 'danger');
      }
    });
  }

  // Notification Bell Click
  const notifBtn = document.getElementById('notif-btn');
  notifBtn.addEventListener('click', () => {
    const bellBadge = notifBtn.querySelector('.badge-dot');
    if (bellBadge) {
      bellBadge.style.display = 'none';
      showToast('Notifications marked as read.', 'success');
    } else {
      showToast('No new notifications.', 'info');
    }
  });

  // Initial greeting toast
  setTimeout(() => {
    showToast('AetherPortal systems nominal.', 'success');
  }, 1000);
});
