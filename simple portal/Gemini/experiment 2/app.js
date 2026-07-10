/**
 * AetherPortal - Application Logic
 * Integrates interactive widgets, state management, layouts, themes, and visualizations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE INITIALIZATION ---
    const state = {
        accent: localStorage.getItem('portal-accent') || 'blue',
        username: localStorage.getItem('portal-username') || 'Alexander',
        role: localStorage.getItem('portal-role') || 'Administrator',
        weatherLocation: localStorage.getItem('portal-weather-loc') || 'San Francisco, CA',
        notes: localStorage.getItem('portal-notes') || '',
        shortcuts: JSON.parse(localStorage.getItem('portal-shortcuts')) || [
            { id: '1', name: 'Google', url: 'https://google.com', icon: 'globe' },
            { id: '2', name: 'GitHub', url: 'https://github.com', icon: 'github' },
            { id: '3', name: 'YouTube', url: 'https://youtube.com', icon: 'video' },
            { id: '4', name: 'Wikipedia', url: 'https://wikipedia.org', icon: 'book-open' }
        ],
        tasks: JSON.parse(localStorage.getItem('portal-tasks')) || [
            { id: '1', text: 'Analyze thesis experiment data', completed: false },
            { id: '2', text: 'Refactor portal dashboard styles', completed: true },
            { id: '3', text: 'Prepare weekly progress report', completed: false }
        ],
        history: JSON.parse(localStorage.getItem('portal-history')) || [
            { id: 'LOG-3912', timestamp: '2026-06-26 15:30:12', category: 'security', event: 'Admin session authenticated successfully', origin: '192.168.1.104', status: 'success' },
            { id: 'LOG-3911', timestamp: '2026-06-26 15:10:45', category: 'system', event: 'AetherPortal core state synchronized', origin: 'Localhost', status: 'info' },
            { id: 'LOG-3910', timestamp: '2026-06-26 14:55:00', category: 'user', event: 'Updated user preferences dashboard', origin: '192.168.1.104', status: 'success' },
            { id: 'LOG-3909', timestamp: '2026-06-26 12:40:22', category: 'security', event: 'Failed login attempt detected', origin: '45.122.88.5', status: 'failed' },
            { id: 'LOG-3908', timestamp: '2026-06-26 09:15:33', category: 'deployment', event: 'Web server package built & served', origin: 'CI-CD Pipeline', status: 'success' },
            { id: 'LOG-3907', timestamp: '2026-06-25 18:22:10', category: 'system', event: 'Cloud storage backup threshold warning', origin: 'AWS-S3 Sync', status: 'warning' }
        ],
        policies: [
            { id: 'POL-SEC-01', code: 'POL-SEC-01', title: 'Information Security Policy', department: 'Security', date: '2026-01-15', summary: 'Defines requirements for information asset access, password controls, data classification, and security incident reports.', details: ['Multi-factor authentication (MFA) is mandatory for all access.', 'Passwords must have at least 14 characters and change every 90 days.', 'All company equipment must lock automatically after 5 minutes of inactivity.', 'Incident reporting must occur within 2 hours of detection.'] },
            { id: 'POL-OPS-03', code: 'POL-OPS-03', title: 'Remote Work Protocol', department: 'Operations', date: '2026-03-10', summary: 'Guidelines for operating securely and productively from remote locations, specifying approved software tools and communication standards.', details: ['All remote work must use the company VPN.', 'No business data may be transferred to personal devices.', 'Zoom or Teams must be used for official video calls.', 'Daily sync meetings must be attended at 09:30 AM local time.'] },
            { id: 'POL-CMP-07', code: 'POL-CMP-07', title: 'Data Retention Guidelines', department: 'Compliance', date: '2025-11-20', summary: 'Establishes storage schedules and destruction criteria for customer details and financial logs to comply with GDPR/CCPA rules.', details: ['Customer PII data must be encrypted at rest and in transit.', 'Financial transaction logs must be archived for 7 years.', 'Inactive user profiles must be purged after 3 years of zero activity.', 'Request for deletion (GDPR Article 17) must be serviced within 30 days.'] },
            { id: 'POL-HR-12', code: 'POL-HR-12', title: 'Acceptable Use Standard', department: 'HR', date: '2026-02-05', summary: 'Outlines employee duties when operating corporate networks, software accounts, emails, and internet access.', details: ['Corporate email accounts must be used for business services only.', 'Social media blogging using company networks is prohibited during work hours.', 'Software installations on company laptops require IT Helpdesk clearance.', 'Harassment or sharing of offensive files leads to immediate disciplinary actions.'] },
            { id: 'POL-OPS-15', code: 'POL-OPS-15', title: 'Business Continuity Plan', department: 'Operations', date: '2025-08-14', summary: 'Strategy for handling natural disasters, infrastructure downtime, server outages, and recovery operations.', details: ['System data backups are scheduled hourly to secondary geographic zones.', 'Core services must maintain a recovery time objective (RTO) under 4 hours.', 'The crisis team roster is updated monthly on the intranet portal.', 'Emergency backup generators are tested quarterly.'] }
        ],
        currentSearchEngine: 'google'
    };

    // --- DOM ELEMENT REFERENCES ---
    const body = document.body;
    const topnavMenu = document.querySelector('.topnav-menu');
    
    // User profile elements
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserRole = document.getElementById('sidebarUserRole');
    const greetingMessage = document.getElementById('greetingMessage');
    
    // Search elements
    const searchEngineBtn = document.getElementById('searchEngineBtn');
    const searchEngineMenu = document.getElementById('searchEngineMenu');
    const currentEngineText = document.getElementById('currentEngineText');
    const portalSearchInput = document.getElementById('portalSearchInput');
    const portalSearchBtn = document.getElementById('portalSearchBtn');
    
    // Clock elements
    const clockHours = document.getElementById('clockHours');
    const clockMinutes = document.getElementById('clockMinutes');
    const clockSeconds = document.getElementById('clockSeconds');
    const clockAmPm = document.getElementById('clockAmPm');
    const currentDateString = document.getElementById('currentDateString');
    const miniCalendar = document.getElementById('miniCalendar');
    
    // News elements
    const newsCategorySelect = document.getElementById('newsCategorySelect');
    const newsFeedList = document.getElementById('newsFeedList');
    
    // Shortcut elements
    const launchpadGrid = document.getElementById('launchpadGrid');
    const addShortcutBtn = document.getElementById('addShortcutBtn');
    const addShortcutModal = document.getElementById('addShortcutModal');
    const closeShortcutModal = document.getElementById('closeShortcutModal');
    const cancelShortcutBtn = document.getElementById('cancelShortcutBtn');
    const addShortcutForm = document.getElementById('addShortcutForm');
    
    // Task elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const tasksCompletedCount = document.getElementById('tasksCompletedCount');
    const tasksTotalCount = document.getElementById('tasksTotalCount');
    const taskFilters = document.querySelectorAll('.task-filter');
    
    // Notes elements
    const scratchpadArea = document.getElementById('scratchpadArea');
    const noteSaveIndicator = document.getElementById('noteSaveIndicator');
    
    // Settings elements
    const navSettingsBtn = document.getElementById('navSettingsBtn');
    const profileBadgeBtn = document.getElementById('profileBadgeBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
    const settingsForm = document.getElementById('settingsForm');
    const settingsName = document.getElementById('settingsName');
    const settingsRole = document.getElementById('settingsRole');
    const settingsWeatherLoc = document.getElementById('settingsWeatherLoc');
    const colorDots = document.querySelectorAll('.color-dot');
    
    // Notifications elements
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationMenu = document.getElementById('notificationMenu');
    const clearAllNotifications = document.getElementById('clearAllNotifications');
    const notificationBadge = document.getElementById('notificationBadge');
    const notificationList = document.getElementById('notificationList');
    
    // Chart canvas
    const analyticsCanvas = document.getElementById('analyticsCanvas');
    let activityChart = null;

    // --- INITIALIZE VIEWS & PLUGINS ---
    function init() {
        applyStatePreferences();
        setupClock();
        setupCalendar();
        setupWeather();
        renderShortcuts();
        renderTasks();
        setupAnalyticsChart();
        setupNewsFeed();
        setupNotePad();
        setupNotifications();
        renderHistory();
        renderPolicies();
        setupHistoryControls();
        setupPoliciesControls();
        setupContactForm();
        setupFaqAccordion();
        lucide.createIcons();
    }

    // Apply basic states: theme class, accent color theme, names
    function applyStatePreferences() {
        // Theme
        body.className = ''; // Reset
        body.classList.add(`theme-${state.accent}`);

        // Sidebar and headers
        sidebarUserName.textContent = state.username;
        sidebarUserRole.textContent = state.role;
        updateGreeting();

        // Populate fields in Settings form
        settingsName.value = state.username;
        settingsRole.value = state.role;
        settingsWeatherLoc.value = state.weatherLocation;

        colorDots.forEach(dot => {
            if (dot.getAttribute('data-theme') === state.accent) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Dynamic greeting based on time of day
    function updateGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Good evening';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        
        greetingMessage.textContent = `${greeting}, ${state.username}`;
    }

    // Mobile Navigation Dropdown Trigger
    const mobileMenuToggleBtn = document.getElementById('mobileMenuToggleBtn');
    if (mobileMenuToggleBtn) {
        mobileMenuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (topnavMenu) {
                topnavMenu.classList.toggle('mobile-open');
            }
        });
    }

    // Close mobile topnav dropdown on click outside
    document.addEventListener('click', () => {
        if (topnavMenu && window.innerWidth <= 992) {
            topnavMenu.classList.remove('mobile-open');
        }
    });

    if (topnavMenu) {
        topnavMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Handle Active Tab Highlighting & View Swapping
    const menuItems = document.querySelectorAll('.menu-item');
    const views = document.querySelectorAll('.portal-view');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = item.getAttribute('data-tab');
            if (item.id === 'navSettingsBtn' || !tab) {
                if (item.id === 'navSettingsBtn') {
                    e.preventDefault();
                    openSettingsModal();
                }
                return;
            }

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Switch active view panel
            views.forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(`view-${tab}`);
            if (targetView) {
                targetView.classList.add('active');
                showToast(`Switched view to ${tab.charAt(0).toUpperCase() + tab.slice(1)}`, 'info');
                
                // Trigger renders if needed
                if (tab === 'history') {
                    renderHistory();
                } else if (tab === 'policies') {
                    renderPolicies();
                }
            }

            // Close topnav dropdown on mobile after clicking item
            if (window.innerWidth <= 992 && topnavMenu) {
                topnavMenu.classList.remove('mobile-open');
            }
        });
    });

    // Clicking profile badge at bottom opens settings
    profileBadgeBtn.addEventListener('click', openSettingsModal);

    // --- CLOCK & DATE FUNCTION ---
    function setupClock() {
        function tick() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            
            hours = hours % 12;
            hours = hours ? hours : 12; // The hour '0' should be '12'
            const hoursStr = String(hours).padStart(2, '0');

            clockHours.textContent = hoursStr;
            clockMinutes.textContent = minutes;
            clockSeconds.textContent = seconds;
            clockAmPm.textContent = ampm;

            // Date String
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            currentDateString.textContent = now.toLocaleDateString('en-US', options);
        }
        tick();
        setInterval(tick, 1000);
    }

    // --- MINI CALENDAR COMPONENT ---
    function setupCalendar() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // First day of current month
        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
        // Total days in current month
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        // Total days in previous month
        const prevTotalDays = new Date(currentYear, currentMonth, 0).getDate();

        let daysHtml = `
            <div class="calendar-header-strip">
                <span>${monthNames[currentMonth]} ${currentYear}</span>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-label">S</div>
                <div class="calendar-day-label">M</div>
                <div class="calendar-day-label">T</div>
                <div class="calendar-day-label">W</div>
                <div class="calendar-day-label">T</div>
                <div class="calendar-day-label">F</div>
                <div class="calendar-day-label">S</div>
        `;

        // Render previous month's trailing days
        for (let i = firstDayIndex; i > 0; i--) {
            daysHtml += `<div class="calendar-date prev-month">${prevTotalDays - i + 1}</div>`;
        }

        // Render current month's days
        for (let i = 1; i <= totalDays; i++) {
            const isToday = i === currentDate;
            daysHtml += `<div class="calendar-date current-month ${isToday ? 'today' : ''}">${i}</div>`;
        }

        // Render next month's leading days to complete grid rows
        const gridCellCount = firstDayIndex + totalDays;
        const remainingCells = (7 - (gridCellCount % 7)) % 7;
        for (let i = 1; i <= remainingCells; i++) {
            daysHtml += `<div class="calendar-date next-month">${i}</div>`;
        }

        daysHtml += '</div>';
        miniCalendar.innerHTML = daysHtml;
    }

    // --- SEARCH BAR ENGINE HANDLING ---
    // Toggle Search Engine Dropdown
    searchEngineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchEngineBtn.parentElement.classList.toggle('open');
    });

    // Close search dropdown on click outside
    document.addEventListener('click', () => {
        searchEngineBtn.parentElement.classList.remove('open');
    });

    // Select Search Engine
    const engineOptions = document.querySelectorAll('.engine-option');
    engineOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            engineOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            const engine = opt.getAttribute('data-engine');
            const iconName = opt.getAttribute('data-icon');
            state.currentSearchEngine = engine;
            currentEngineText.textContent = opt.textContent.trim();
            
            // Swap icon in button
            const btnIcon = searchEngineBtn.querySelector('i[data-lucide]');
            btnIcon.setAttribute('data-lucide', iconName);
            lucide.createIcons();

            searchEngineBtn.parentElement.classList.remove('open');
            portalSearchInput.focus();
        });
    });

    // Execute Web Search or Local Widget Filtering
    function executeSearch() {
        const query = portalSearchInput.value.trim();
        if (!query) return;

        // Check if query is a local command or widget highlight keyword
        const cleanQuery = query.toLowerCase();
        
        // Match widgets keywords
        const widgets = {
            'clock': 'widgetClock',
            'time': 'widgetClock',
            'calendar': 'widgetClock',
            'weather': 'widgetWeather',
            'temperature': 'widgetWeather',
            'launchpad': 'widgetLaunchpad',
            'shortcut': 'widgetLaunchpad',
            'bookmark': 'widgetLaunchpad',
            'chart': 'widgetChart',
            'analytics': 'widgetChart',
            'stats': 'widgetChart',
            'task': 'widgetTasks',
            'todo': 'widgetTasks',
            'productivity': 'widgetTasks',
            'note': 'widgetNotes',
            'scratchpad': 'widgetNotes',
            'news': 'widgetNewsFeed',
            'feed': 'widgetNewsFeed',
            'pulse': 'widgetNewsFeed'
        };

        let matchedLocal = false;
        Object.keys(widgets).forEach(key => {
            if (cleanQuery.includes(key)) {
                const widgetEl = document.getElementById(widgets[key]);
                if (widgetEl) {
                    matchedLocal = true;
                    // Ensure we switch to the dashboard view first
                    views.forEach(v => v.classList.remove('active'));
                    const dashboardView = document.getElementById('view-dashboard');
                    if (dashboardView) dashboardView.classList.add('active');
                    
                    menuItems.forEach(i => {
                        if (i.getAttribute('data-tab') === 'dashboard') {
                            i.classList.add('active');
                        } else {
                            i.classList.remove('active');
                        }
                    });

                    // Temporary focus highlight animation
                    widgetEl.style.borderColor = 'var(--color-accent)';
                    widgetEl.style.boxShadow = 'var(--shadow-accent)';
                    widgetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    showToast(`Widget Located: ${widgetEl.querySelector('h2')?.textContent || 'Target Panel'}`, 'info');

                    setTimeout(() => {
                        widgetEl.style.borderColor = '';
                        widgetEl.style.boxShadow = '';
                    }, 3000);
                }
            }
        });

        if (matchedLocal) {
            portalSearchInput.value = '';
            return;
        }

        // Otherwise, perform web redirect search
        const activeEngineOpt = document.querySelector('.engine-option.active');
        const searchBaseUrl = activeEngineOpt.getAttribute('data-url');
        window.open(searchBaseUrl + encodeURIComponent(query), '_blank');
        portalSearchInput.value = '';
    }

    portalSearchBtn.addEventListener('click', executeSearch);
    portalSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    });

    // --- INTERACTIVE WEATHER MODULE ---
    // Deterministic simulation based on location string hash
    function getStringHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    function setupWeather() {
        const weatherLocationSpan = document.querySelector('#weatherLocation span');
        weatherLocationSpan.textContent = state.weatherLocation;

        const hash = getStringHash(state.weatherLocation);
        
        // Simulating 4 weather states: Sunny, Rainy, Cloudy, Stormy
        const conditions = [
            { icon: 'sun', desc: 'Sunny / Clear Sky', baseTemp: 82, humidity: 40, wind: 6, uv: 'High (7)' },
            { icon: 'cloud-sun', desc: 'Partly Cloudy', baseTemp: 71, humidity: 55, wind: 9, uv: 'Moderate (4)' },
            { icon: 'cloud-rain', desc: 'Scattered Showers', baseTemp: 62, humidity: 85, wind: 14, uv: 'Low (2)' },
            { icon: 'cloud-lightning', desc: 'Severe Thunderstorm', baseTemp: 58, humidity: 95, wind: 22, uv: 'Low (1)' }
        ];

        const activeWeather = conditions[hash % conditions.length];
        
        // Render current stats
        document.getElementById('currentTemp').textContent = `${activeWeather.baseTemp}°F`;
        document.getElementById('currentDesc').textContent = activeWeather.desc;
        document.getElementById('weatherHumidity').textContent = `${activeWeather.humidity}%`;
        document.getElementById('weatherWind').textContent = `${activeWeather.wind} mph`;
        document.getElementById('weatherUV').textContent = activeWeather.uv;

        // Render main weather icon
        const iconContainer = document.getElementById('weatherMainIcon');
        iconContainer.innerHTML = `<i data-lucide="${activeWeather.icon}" class="weather-svg animate-bounce-slow"></i>`;

        // Render 5-day forecast
        const forecastStrip = document.getElementById('weatherForecastStrip');
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDayIndex = new Date().getDay();

        let forecastHtml = '';
        for (let i = 1; i <= 5; i++) {
            const dayName = days[(currentDayIndex + i) % 7];
            const dailyHash = hash + i;
            const forecastCond = conditions[dailyHash % conditions.length];
            const dailyTemp = activeWeather.baseTemp + (dailyHash % 7) - 3;
            
            forecastHtml += `
                <div class="forecast-day">
                    <span class="forecast-day-name">${dayName}</span>
                    <i data-lucide="${forecastCond.icon}" class="forecast-icon"></i>
                    <span class="forecast-temp">${dailyTemp}°</span>
                </div>
            `;
        }
        forecastStrip.innerHTML = forecastHtml;
        lucide.createIcons();
    }

    // --- QUICK LAUNCHPAD SHORTCUTS ---
    function renderShortcuts() {
        launchpadGrid.innerHTML = '';
        state.shortcuts.forEach(shortcut => {
            const card = document.createElement('div');
            card.className = 'shortcut-card';
            card.innerHTML = `
                <button class="delete-shortcut-btn" data-id="${shortcut.id}" title="Remove Shortcut" aria-label="Remove Bookmark">
                    <i data-lucide="trash-2"></i>
                </button>
                <div class="shortcut-icon-wrapper">
                    <i data-lucide="${shortcut.icon || 'globe'}"></i>
                </div>
                <span class="shortcut-name">${shortcut.name}</span>
            `;
            
            // Event listener to open link
            card.addEventListener('click', (e) => {
                if (e.target.closest('.delete-shortcut-btn')) return; // Ignore if delete is clicked
                window.open(shortcut.url, '_blank');
            });

            // Event listener to delete link
            const deleteBtn = card.querySelector('.delete-shortcut-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeShortcut(shortcut.id);
            });

            launchpadGrid.appendChild(card);
        });
        lucide.createIcons();
    }

    // Add Shortcut Functions
    addShortcutBtn.addEventListener('click', () => {
        addShortcutModal.classList.add('open');
    });

    function closeShortcutModalBox() {
        addShortcutModal.classList.remove('open');
        addShortcutForm.reset();
    }
    
    closeShortcutModal.addEventListener('click', closeShortcutModalBox);
    cancelShortcutBtn.addEventListener('click', closeShortcutModalBox);

    addShortcutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('shortcutName').value.trim();
        const url = document.getElementById('shortcutUrl').value.trim();
        const icon = document.getElementById('shortcutIcon').value;

        if (name && url) {
            const newShortcut = {
                id: Date.now().toString(),
                name,
                url,
                icon
            };
            state.shortcuts.push(newShortcut);
            saveShortcuts();
            renderShortcuts();
            closeShortcutModalBox();
            showToast(`Added shortcut for "${name}"`, 'success');
            addLogEntry('user', `Created quick shortcut bookmark for "${name}"`, 'Localhost', 'success');
        }
    });

    function removeShortcut(id) {
        const itemToRemove = state.shortcuts.find(s => s.id === id);
        state.shortcuts = state.shortcuts.filter(s => s.id !== id);
        saveShortcuts();
        renderShortcuts();
        if (itemToRemove) {
            showToast(`Removed shortcut "${itemToRemove.name}"`, 'info');
            addLogEntry('user', `Deleted quick shortcut bookmark "${itemToRemove.name}"`, 'Localhost', 'info');
        }
    }

    function saveShortcuts() {
        localStorage.setItem('portal-shortcuts', JSON.stringify(state.shortcuts));
    }

    // --- PRODUCTIVITY DESK (TASK MANAGER) ---
    let currentTaskFilter = 'all';

    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = state.tasks;
        if (currentTaskFilter === 'pending') {
            filteredTasks = state.tasks.filter(t => !t.completed);
        } else if (currentTaskFilter === 'completed') {
            filteredTasks = state.tasks.filter(t => t.completed);
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-item-left">
                    <button class="task-checkbox-custom" aria-label="Toggle task status">
                        <i data-lucide="check"></i>
                    </button>
                    <span class="task-label">${task.text}</span>
                </div>
                <button class="task-delete-btn" aria-label="Delete task">
                    <i data-lucide="trash-2"></i>
                </button>
            `;

            // Toggle Complete
            const chkBtn = li.querySelector('.task-checkbox-custom');
            chkBtn.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
                updateTaskCounts();
                showToast(task.completed ? 'Task completed!' : 'Task set active.', 'success');
                addLogEntry('user', `Goal "${task.text}" set to ${task.completed ? 'completed' : 'active'}`, 'Localhost', 'success');
            });

            // Delete Task
            const delBtn = li.querySelector('.task-delete-btn');
            delBtn.addEventListener('click', () => {
                state.tasks = state.tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
                updateTaskCounts();
                showToast('Task removed from goals.', 'info');
                addLogEntry('user', `Goal "${task.text}" removed from Productivity desk`, 'Localhost', 'info');
            });

            taskList.appendChild(li);
        });

        updateTaskCounts();
        lucide.createIcons();
    }

    function updateTaskCounts() {
        const total = state.tasks.length;
        const completed = state.tasks.filter(t => t.completed).length;
        
        tasksTotalCount.textContent = total;
        tasksCompletedCount.textContent = completed;
    }

    // Add new goal Form Submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const goalText = taskInput.value.trim();
        if (goalText) {
            const newTask = {
                id: Date.now().toString(),
                text: goalText,
                completed: false
            };
            state.tasks.push(newTask);
            saveTasks();
            taskInput.value = '';
            renderTasks();
            showToast('New goal added!', 'success');
            addLogEntry('user', `Added goal: "${goalText}" to productivity desk`, 'Localhost', 'success');
        }
    });

    // Task Filter Tabs
    taskFilters.forEach(tab => {
        tab.addEventListener('click', () => {
            taskFilters.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            currentTaskFilter = tab.getAttribute('data-filter');
            renderTasks();
        });
    });

    function saveTasks() {
        localStorage.setItem('portal-tasks', JSON.stringify(state.tasks));
    }

    // --- QUICK NOTES SCRATCHPAD ---
    function setupNotePad() {
        scratchpadArea.value = state.notes;
        
        let debounceTimer;
        scratchpadArea.addEventListener('input', () => {
            noteSaveIndicator.classList.remove('visible');
            clearTimeout(debounceTimer);
            
            // Auto save note to local storage after 600ms pause typing
            debounceTimer = setTimeout(() => {
                state.notes = scratchpadArea.value;
                localStorage.setItem('portal-notes', state.notes);
                noteSaveIndicator.classList.add('visible');
            }, 600);
        });
    }

    // --- PULSE RSS NEWS simulator ---
    function setupNewsFeed() {
        const mockNews = [
            { id: 1, category: 'tech', date: '5 mins ago', title: 'DeepMind introduces Gemini 3.5 series with extreme agency capabilities', summary: 'The new model architecture boasts enhanced code synthesis, reasoning nodes, and native workspace tool hooks for complex developer operations.' },
            { id: 2, category: 'science', date: '42 mins ago', title: 'James Webb captures massive structural plumes in Kepler systems', summary: 'Spectroscopic analysis suggests carbon components and liquid formations on newly scanned exoplanets, triggering new research directions.' },
            { id: 3, category: 'finance', date: '2 hours ago', title: 'Global markets stabilize as technology indexes break high records', summary: 'Increased adoption of autonomous services drives hardware demands to record valuation peaks across semiconductor giants.' },
            { id: 4, category: 'tech', date: '4 hours ago', title: 'W3C approves final specifications for decentralized browser layouts', summary: 'A comprehensive standard shift targeting hardware acceleration integration and high-privacy network protocols.' },
            { id: 5, category: 'science', date: '6 hours ago', title: 'Biophysicists engineer self-assembling cellular lattices', summary: 'Created structures demonstrate programmable paths that can guide nerve tissue reconstruction, offering hope for spinal treatments.' },
            { id: 6, category: 'finance', date: '12 hours ago', title: 'Micro-credentials take lead in professional developer certifications', summary: 'Global software groups favor project-based portfolio audits over traditional testing systems for corporate talent hiring.' }
        ];

        function renderNews(categoryFilter = 'all') {
            newsFeedList.innerHTML = '';
            
            const filteredNews = categoryFilter === 'all' 
                ? mockNews 
                : mockNews.filter(item => item.category === categoryFilter);

            filteredNews.forEach(item => {
                const article = document.createElement('div');
                article.className = 'news-item';
                article.innerHTML = `
                    <div class="news-meta">
                        <span class="news-category-badge ${item.category}">${item.category}</span>
                        <span class="news-date">${item.date}</span>
                    </div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-summary">${item.summary}</p>
                `;

                article.addEventListener('click', () => {
                    showToast(`Article: "${item.title.substring(0, 30)}..."`, 'info');
                });

                newsFeedList.appendChild(article);
            });
        }

        renderNews('all');

        newsCategorySelect.addEventListener('change', () => {
            renderNews(newsCategorySelect.value);
        });
    }

    // --- CHART.JS ANALYTICS DASHBOARD ---
    function setupAnalyticsChart() {
        const datasets = {
            week: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [42, 65, 88, 56, 75, 94, 110],
                label: 'Portal Invocations'
            },
            month: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [310, 480, 520, 680],
                label: 'Portal Total Visits'
            }
        };

        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#6366f1';

        const chartConfig = {
            type: 'line',
            data: {
                labels: datasets.week.labels,
                datasets: [{
                    label: datasets.week.label,
                    data: datasets.week.data,
                    borderColor: accentColor,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: accentColor,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 15, 26, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#e2e8f0',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        titleFont: { family: 'Outfit', weight: 'bold' },
                        bodyFont: { family: 'Plus Jakarta Sans' }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(156, 163, 175, 0.8)',
                            font: { size: 11, family: 'Plus Jakarta Sans' }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(156, 163, 175, 0.08)'
                        },
                        ticks: {
                            color: 'rgba(156, 163, 175, 0.8)',
                            font: { size: 11, family: 'Plus Jakarta Sans' }
                        }
                    }
                }
            }
        };

        activityChart = new Chart(analyticsCanvas, chartConfig);

        // Chart Filter Range Toggles
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const range = btn.getAttribute('data-range');
                const selectedData = datasets[range];

                activityChart.data.labels = selectedData.labels;
                activityChart.data.datasets[0].data = selectedData.data;
                activityChart.data.datasets[0].label = selectedData.label;
                activityChart.update();
            });
        });
    }

    // Helper to update chart colors dynamically when accent changes
    function updateChartAccent() {
        if (!activityChart) return;
        const newAccent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
        activityChart.data.datasets[0].borderColor = newAccent;
        activityChart.data.datasets[0].pointBackgroundColor = newAccent;
        activityChart.update();
    }

    // --- MODAL: PORTAL PREFERENCES (SETTINGS) ---
    function openSettingsModal() {
        settingsName.value = state.username;
        settingsRole.value = state.role;
        settingsWeatherLoc.value = state.weatherLocation;
        
        // Highlight active accent dot
        colorDots.forEach(dot => {
            if (dot.getAttribute('data-theme') === state.accent) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        settingsModal.classList.add('open');
    }

    function closeSettingsModalBox() {
        settingsModal.classList.remove('open');
    }

    closeSettingsModal.addEventListener('click', closeSettingsModalBox);
    cancelSettingsBtn.addEventListener('click', closeSettingsModalBox);

    // Accent Palette selection listener
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            const themeAccent = dot.getAttribute('data-theme');
            state.accent = themeAccent;
        });
    });

    // Save preferences form
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        state.username = settingsName.value.trim();
        state.role = settingsRole.value.trim();
        state.weatherLocation = settingsWeatherLoc.value.trim();

        // Save states to local storage
        localStorage.setItem('portal-username', state.username);
        localStorage.setItem('portal-role', state.role);
        localStorage.setItem('portal-weather-loc', state.weatherLocation);
        localStorage.setItem('portal-accent', state.accent);

        // Apply changes
        applyStatePreferences();
        setupWeather();
        updateChartAccent();
        closeSettingsModalBox();
        showToast('Settings saved successfully!', 'success');
        addLogEntry('user', `Updated portal settings (Username: "${state.username}", Accent: "${state.accent}")`, 'Localhost', 'success');
    });

    // --- TOAST NOTIFICATIONS DESK ---
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast`;
        
        let iconName = 'check-circle-2';
        if (type === 'info') iconName = 'info';
        if (type === 'warning') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}" class="toast-icon"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        lucide.createIcons();

        // Reflow browser triggers animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3.5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);

        // Append to notification feed badge
        addNotificationFeed(message, type);
    }

    // --- NOTIFICATION DROPDOWN SYSTEM ---
    let notificationCount = 3;

    function setupNotifications() {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationBtn.parentElement.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            notificationBtn.parentElement.classList.remove('open');
        });

        clearAllNotifications.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationList.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                    No new notifications
                </div>
            `;
            notificationCount = 0;
            notificationBadge.style.display = 'none';
        });
    }

    function addNotificationFeed(message, type) {
        notificationCount++;
        notificationBadge.textContent = notificationCount;
        notificationBadge.style.display = 'block';

        // Remove placeholder "no new notifications" if present
        const emptyState = notificationList.querySelector('div[style*="text-align: center"]');
        if (emptyState) {
            notificationList.innerHTML = '';
        }

        const item = document.createElement('div');
        item.className = 'notification-item unread';
        item.innerHTML = `
            <div class="notification-icon ${type === 'success' ? 'success' : (type === 'warning' ? 'warning' : 'info')}">
                <i data-lucide="${type === 'success' ? 'check-circle-2' : (type === 'warning' ? 'alert-triangle' : 'info')}"></i>
            </div>
            <div class="notification-details">
                <p class="notification-text">${message}</p>
                <span class="notification-time">Just now</span>
            </div>
        `;
        
        // Add click listener to mark read
        item.addEventListener('click', () => {
            if (item.classList.contains('unread')) {
                item.classList.remove('unread');
                notificationCount = Math.max(0, notificationCount - 1);
                if (notificationCount === 0) {
                    notificationBadge.style.display = 'none';
                } else {
                    notificationBadge.textContent = notificationCount;
                }
            }
        });

        notificationList.insertBefore(item, notificationList.firstChild);
        lucide.createIcons();
    }



    // Add Event Log Entry Utility
    function addLogEntry(category, event, origin = 'Localhost', status = 'success') {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
        const newLog = {
            id: logId,
            timestamp,
            category,
            event,
            origin,
            status
        };
        state.history.unshift(newLog);
        
        // Keep max 50 logs to avoid localstorage bloat
        if (state.history.length > 50) {
            state.history = state.history.slice(0, 50);
        }
        
        localStorage.setItem('portal-history', JSON.stringify(state.history));
        
        // Render if the renderer exists
        renderHistory();
    }

    // --- SYSTEM HISTORY LOG REGISTRY ---
    let currentHistoryFilter = 'all';

    function renderHistory() {
        const historyTableBody = document.getElementById('historyTableBody');
        if (!historyTableBody) return;
        historyTableBody.innerHTML = '';

        const searchQuery = document.getElementById('logSearchInput')?.value.trim().toLowerCase() || '';

        // Filter logs
        let filteredLogs = state.history.filter(log => {
            const matchesCategory = currentHistoryFilter === 'all' || log.category.toLowerCase() === currentHistoryFilter.toLowerCase();
            const matchesSearch = log.id.toLowerCase().includes(searchQuery) ||
                                  log.event.toLowerCase().includes(searchQuery) ||
                                  log.origin.toLowerCase().includes(searchQuery) ||
                                  log.status.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (filteredLogs.length === 0) {
            historyTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 3.5rem; color: var(--text-secondary); font-style: italic;">
                        No system events match the selected criteria.
                    </td>
                </tr>
            `;
            return;
        }

        filteredLogs.forEach(log => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-family: var(--font-heading); font-weight: 700; color: var(--color-accent);">${log.id}</td>
                <td style="font-size: 0.8rem; white-space: nowrap; color: var(--text-muted);">${log.timestamp}</td>
                <td>
                    <span style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2px; color: var(--text-secondary);">${log.category}</span>
                </td>
                <td style="font-weight: 500;">${log.event}</td>
                <td style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">${log.origin}</td>
                <td>
                    <span class="status-badge ${log.status}">${log.status}</span>
                </td>
            `;
            historyTableBody.appendChild(tr);
        });

        lucide.createIcons();
    }

    function setupHistoryControls() {
        const logSearchInput = document.getElementById('logSearchInput');
        if (logSearchInput) {
            logSearchInput.addEventListener('input', renderHistory);
        }

        const historyFilterRow = document.getElementById('historyFilterRow');
        if (historyFilterRow) {
            const filterBtns = historyFilterRow.querySelectorAll('.order-filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentHistoryFilter = btn.getAttribute('data-filter');
                    renderHistory();
                });
            });
        }

        // Clear Registry
        const clearLogsBtn = document.getElementById('clearLogsBtn');
        if (clearLogsBtn) {
            clearLogsBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to purge all system history event logs? This cannot be undone.')) {
                    state.history = [];
                    localStorage.setItem('portal-history', JSON.stringify(state.history));
                    renderHistory();
                    showToast('System event log registry cleared.', 'warning');
                    addLogEntry('system', 'System event log registry purged by administrator', 'Localhost', 'warning');
                }
            });
        }

        // Export Logs to CSV
        const exportLogsBtn = document.getElementById('exportLogsBtn');
        if (exportLogsBtn) {
            exportLogsBtn.addEventListener('click', () => {
                if (state.history.length === 0) {
                    showToast('No logs available to export.', 'warning');
                    return;
                }

                // CSV contents
                let csvContent = 'data:text/csv;charset=utf-8,';
                csvContent += 'Log ID,Timestamp,Category,Event Description,Origin,Status\n';

                state.history.forEach(log => {
                    const row = [
                        log.id,
                        log.timestamp,
                        log.category,
                        `"${log.event.replace(/"/g, '""')}"`,
                        log.origin,
                        log.status
                    ].join(',');
                    csvContent += row + '\n';
                });

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `aetherportal_event_logs_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast('Event logs exported to CSV file!', 'success');
                addLogEntry('user', 'Exported system event log registry to CSV file', 'Localhost', 'success');
            });
        }
    }

    // --- POLICIES DIRECTORY LOGIC ---
    let currentPolicyFilter = 'all';
    
    function renderPolicies() {
        const policiesGrid = document.getElementById('policiesGrid');
        if (!policiesGrid) return;
        policiesGrid.innerHTML = '';

        const searchQuery = document.getElementById('policySearchInput')?.value.trim().toLowerCase() || '';

        // Filter by category and search query
        let filteredPolicies = state.policies.filter(policy => {
            const matchesCategory = currentPolicyFilter === 'all' || policy.department.toLowerCase() === currentPolicyFilter.toLowerCase();
            const matchesSearch = policy.title.toLowerCase().includes(searchQuery) || 
                                  policy.code.toLowerCase().includes(searchQuery) ||
                                  policy.summary.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (filteredPolicies.length === 0) {
            policiesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary); background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
                    <i data-lucide="help-circle" style="width: 32px; height: 32px; color: var(--text-muted); margin-bottom: 0.75rem;"></i>
                    <p style="font-weight: 500; font-size: 0.9rem; margin: 0;">No policies matched your query.</p>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Try selecting "All Departments" or typing a different keyword.</span>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        filteredPolicies.forEach(policy => {
            const card = document.createElement('div');
            card.className = 'policy-card';
            card.innerHTML = `
                <div class="policy-meta">
                    <span class="policy-code">${policy.code}</span>
                    <span class="policy-department ${policy.department.toLowerCase()}">${policy.department}</span>
                </div>
                <h3 class="policy-title">${policy.title}</h3>
                <p class="policy-summary">${policy.summary}</p>
                
                <div class="policy-details">
                    <h4 style="margin: 0 0 0.5rem 0; font-size: 0.8rem; font-weight: 600; color: var(--text-primary);">Policy Clauses & Rules:</h4>
                    <ul>
                        ${policy.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>

                <div class="policy-footer">
                    <span class="policy-date">Updated: ${policy.date}</span>
                    <button class="policy-expand-btn">
                        <span>Read Clauses</span>
                        <i data-lucide="chevron-down" style="width: 14px; height: 14px; transition: transform var(--transition-fast);"></i>
                    </button>
                </div>
            `;

            // Expand button click handler
            const expandBtn = card.querySelector('.policy-expand-btn');
            expandBtn.addEventListener('click', () => {
                const isExpanded = card.classList.toggle('expanded');
                const chevron = expandBtn.querySelector('i');
                if (isExpanded) {
                    chevron.style.transform = 'rotate(180deg)';
                    expandBtn.querySelector('span').textContent = 'Collapse';
                } else {
                    chevron.style.transform = '';
                    expandBtn.querySelector('span').textContent = 'Read Clauses';
                }
            });

            policiesGrid.appendChild(card);
        });

        lucide.createIcons();
    }

    function setupPoliciesControls() {
        const policySearchInput = document.getElementById('policySearchInput');
        if (policySearchInput) {
            policySearchInput.addEventListener('input', renderPolicies);
        }

        const policyFilterRow = document.getElementById('policyFilterRow');
        if (policyFilterRow) {
            const filterBtns = policyFilterRow.querySelectorAll('.order-filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentPolicyFilter = btn.getAttribute('data-filter');
                    renderPolicies();
                });
            });
        }
    }

    // --- CONTACT FORM HANDLER ---
    function setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameEl = document.getElementById('contactName');
            const emailEl = document.getElementById('contactEmail');
            const messageEl = document.getElementById('contactMessage');
            
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const message = messageEl.value.trim();

            // Strict email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Remove previous validation highlights
            emailEl.style.borderColor = '';
            
            if (!name || !email || !message) {
                showToast('Please fill out all fields.', 'warning');
                return;
            }

            if (!emailRegex.test(email)) {
                emailEl.style.borderColor = '#f43f5e'; // Highlight email input red
                emailEl.focus();
                showToast('Please enter a valid email address.', 'warning');
                return;
            }

            showToast(`Message from ${name} sent successfully!`, 'success');
            addLogEntry('user', `Support ticket submitted by ${name} ("${email}")`, 'Localhost', 'success');
            contactForm.reset();
        });
    }

    // --- FAQ ACCORDION HANDLER ---
    function setupFaqAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(q => {
            q.addEventListener('click', () => {
                const parent = q.closest('.faq-item');
                const isOpen = parent.classList.contains('open');
                
                // Close other FAQs
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('open');
                });

                if (!isOpen) {
                    parent.classList.add('open');
                }
            });
        });
    }

    // --- START THE PORTAL APP ---
    init();
});
