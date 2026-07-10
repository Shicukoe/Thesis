// Default Portal Data
const defaultBookmarks = {
  academic: [
    { id: 1, title: 'Google Scholar', url: 'https://scholar.google.com', icon: 'graduation-cap' },
    { id: 2, title: 'arXiv', url: 'https://arxiv.org', icon: 'book-open' },
    { id: 3, title: 'ResearchGate', url: 'https://www.researchgate.net', icon: 'globe' },
    { id: 4, title: 'Overleaf', url: 'https://www.overleaf.com', icon: 'file-text' },
    { id: 5, title: 'Semantic Scholar', url: 'https://www.semanticscholar.org', icon: 'search' },
    { id: 6, title: 'Notion', url: 'https://www.notion.so', icon: 'edit' }
  ],
  productivity: [
    { id: 7, title: 'Gmail', url: 'https://mail.google.com', icon: 'mail' },
    { id: 8, title: 'Google Drive', url: 'https://drive.google.com', icon: 'hard-drive' },
    { id: 9, title: 'Trello', url: 'https://trello.com', icon: 'columns' },
    { id: 10, title: 'Slack', url: 'https://slack.com', icon: 'message-square' },
    { id: 11, title: 'Notion Workspace', url: 'https://notion.so', icon: 'check-square' },
    { id: 12, title: 'Figma', url: 'https://figma.com', icon: 'layers' }
  ],
  social: [
    { id: 13, title: 'GitHub', url: 'https://github.com', icon: 'github' },
    { id: 14, title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'help-circle' },
    { id: 15, title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: 'code' },
    { id: 16, title: 'Claude AI', url: 'https://claude.ai', icon: 'bot' },
    { id: 17, title: 'ChatGPT', url: 'https://chat.openai.com', icon: 'cpu' },
    { id: 18, title: 'Vercel', url: 'https://vercel.com', icon: 'server' }
  ],
  custom: [
    { id: 19, title: 'GitHub Repo', url: 'https://github.com/new', icon: 'plus-circle' }
  ]
};

const defaultQuotes = [
  { text: "Research is to see what everybody else has seen, and to think what nobody else has thought.", author: "Albert Szent-Györgyi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
  { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
  { text: "If I have seen further it is by standing on the shoulders of Giants.", author: "Isaac Newton" },
  { text: "Science is not only a disciple of reason but also one of romance and passion.", author: "Stephen Hawking" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" }
];

const defaultOrders = [
  { id: 'ORD-8274', item: 'NVIDIA Jetson Orin Nano Kit', category: 'Hardware', date: '2026-06-15', cost: 499.00, status: 'Completed' },
  { id: 'ORD-5491', item: 'IEEE Xplore Annual Subscription', category: 'Literature', date: '2026-06-20', cost: 120.00, status: 'Completed' },
  { id: 'ORD-1284', item: 'Overleaf Professional License', category: 'Software', date: '2026-06-28', cost: 96.00, status: 'Pending' },
  { id: 'ORD-9304', item: 'AWS GPU EC2 Cloud Credits', category: 'Software', date: '2026-07-01', cost: 350.00, status: 'Pending' }
];

// App State
let state = {
  username: localStorage.getItem('portal_username') || 'Researcher',
  bgTheme: localStorage.getItem('portal_bg') || 'soft-mint',
  bookmarks: JSON.parse(localStorage.getItem('portal_bookmarks')) || defaultBookmarks,
  tasks: JSON.parse(localStorage.getItem('portal_tasks')) || [],
  notes: localStorage.getItem('portal_notes') || '',
  activeTab: 'academic',
  searchEngine: localStorage.getItem('portal_search_engine') || 'google',
  searchEngineUrl: localStorage.getItem('portal_search_url') || 'https://www.google.com/search?q=',
  view: localStorage.getItem('portal_view') || 'dashboard',
  orders: JSON.parse(localStorage.getItem('portal_orders')) || defaultOrders
};

// Initial Setup & DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClock();
  initSearch();
  initBookmarks();
  initNotes();
  initTasks();
  initWeather();
  initTimer();
  initQuotes();
  initSettings();
  initNavigation();
  initOrders();
  initContact();
  
  // Initial Lucide Icons Render
  lucide.createIcons();
});

// 1. Theme and Preferences Manager
function initTheme() {
  document.body.setAttribute('data-bg', state.bgTheme);
}

function setBgTheme(bgName) {
  state.bgTheme = bgName;
  document.body.setAttribute('data-bg', bgName);
  localStorage.setItem('portal_bg', bgName);
  
  // Update active state in settings drawer
  document.querySelectorAll('.theme-preset').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.bg === bgName);
  });
}

// 2. Clock and Greeting Widget
function initClock() {
  const clockTime = document.getElementById('clock-time');
  const clockAmpm = document.getElementById('clock-ampm');
  const greetingText = document.getElementById('greeting-text');
  const subtitleDate = document.getElementById('subtitle-date');
  
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Greeting depending on hours
    let greeting = 'Good day';
    if (hours >= 5 && hours < 12) greeting = 'Good morning';
    else if (hours >= 12 && hours < 17) greeting = 'Good afternoon';
    else if (hours >= 17 && hours < 22) greeting = 'Good evening';
    else greeting = 'Good night';
    
    // Format hours (12-hour clock)
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');
    
    clockTime.textContent = `${formattedHours}:${minutes}:${seconds}`;
    clockAmpm.textContent = ampm;
    greetingText.textContent = `${greeting}, ${state.username}`;
  }
  
  function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    subtitleDate.textContent = now.toLocaleDateString('en-US', options);
  }
  
  updateTime();
  updateDate();
  setInterval(updateTime, 1000);
  
  // Update date hourly
  setInterval(updateDate, 3600000);
}

// 3. Search Engine Module
function initSearch() {
  const engineTrigger = document.getElementById('engine-trigger');
  const engineDropdown = document.getElementById('engine-dropdown');
  const engineIcon = document.getElementById('engine-icon');
  const engineName = document.getElementById('engine-name');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  // Set initial selected engine
  const activeOption = engineDropdown.querySelector(`[data-engine="${state.searchEngine}"]`);
  if (activeOption) {
    selectEngine(activeOption);
  }
  
  engineTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    engineDropdown.classList.toggle('open');
    engineTrigger.classList.toggle('active');
  });
  
  document.addEventListener('click', () => {
    engineDropdown.classList.remove('open');
    engineTrigger.classList.remove('active');
  });
  
  engineDropdown.querySelectorAll('.engine-option').forEach(option => {
    option.addEventListener('click', () => {
      selectEngine(option);
    });
  });
  
  function selectEngine(element) {
    const engine = element.dataset.engine;
    const url = element.dataset.url;
    const iconName = element.querySelector('i').dataset.lucide;
    const name = element.querySelector('span').textContent;
    
    state.searchEngine = engine;
    state.searchEngineUrl = url;
    localStorage.setItem('portal_search_engine', engine);
    localStorage.setItem('portal_search_url', url);
    
    // Update trigger button UI
    engineName.textContent = name;
    engineIcon.setAttribute('data-lucide', iconName);
    lucide.createIcons(); // refresh icon
    
    // Set active in dropdown
    engineDropdown.querySelectorAll('.engine-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
    
    // Setup form
    searchForm.action = url.split('?')[0];
    const queryParamName = url.includes('?q=') ? 'q' : (url.includes('query=') ? 'query' : 'search');
    searchInput.name = queryParamName;
    
    searchInput.placeholder = `Search with ${name}...`;
    searchInput.focus();
  }
  
  searchForm.addEventListener('submit', (e) => {
    // Standard submit via get target action works. Just log it.
  });
}

// 4. Bookmarks Management
function initBookmarks() {
  const tabs = document.querySelectorAll('.bookmark-tab');
  const addBtn = document.getElementById('add-bookmark-btn');
  const modal = document.getElementById('bookmark-modal');
  const closeModalBtn = document.getElementById('close-bookmark-modal');
  const cancelModalBtn = document.getElementById('cancel-bookmark');
  const saveBookmarkBtn = document.getElementById('save-bookmark');
  
  // Tab Switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const category = tab.dataset.tab;
      state.activeTab = category;
      
      // Hide all grids, show selected
      document.querySelectorAll('.bookmarks-grid').forEach(grid => {
        grid.classList.remove('active');
      });
      document.getElementById(`${category}-grid`).classList.add('active');
    });
  });
  
  // Load bookmarks
  renderBookmarks();
  
  // Add Modal Toggles
  addBtn.addEventListener('click', () => {
    // Select current category as default in dropdown
    document.getElementById('bookmark-category').value = state.activeTab;
    modal.classList.add('open');
  });
  
  const closeModal = () => {
    modal.classList.remove('open');
    document.getElementById('bookmark-title').value = '';
    document.getElementById('bookmark-url').value = '';
    document.getElementById('bookmark-icon').value = '';
  };
  
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);
  
  saveBookmarkBtn.addEventListener('click', () => {
    const title = document.getElementById('bookmark-title').value.trim();
    let url = document.getElementById('bookmark-url').value.trim();
    const category = document.getElementById('bookmark-category').value;
    let icon = document.getElementById('bookmark-icon').value.trim() || 'link';
    
    if (!title || !url) {
      alert('Please fill out at least Name and URL.');
      return;
    }
    
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    // Add bookmark item
    const newBookmark = {
      id: Date.now(),
      title,
      url,
      icon
    };
    
    state.bookmarks[category].push(newBookmark);
    localStorage.setItem('portal_bookmarks', JSON.stringify(state.bookmarks));
    
    renderBookmarks();
    closeModal();
    
    // Switch to category tab
    const targetTab = document.querySelector(`.bookmark-tab[data-tab="${category}"]`);
    if (targetTab) targetTab.click();
  });
}

function renderBookmarks() {
  const categories = ['academic', 'productivity', 'social', 'custom'];
  
  categories.forEach(cat => {
    const grid = document.getElementById(`${cat}-grid`);
    grid.innerHTML = '';
    
    const items = state.bookmarks[cat] || [];
    
    if (items.length === 0) {
      grid.innerHTML = `<div class="empty-state-message">No bookmarks. Click Add to create one.</div>`;
      return;
    }
    
    items.forEach(bookmark => {
      const item = document.createElement('div');
      item.className = 'bookmark-item';
      
      // Check if icon is an emoji or lucide string
      const isEmoji = /\p{Emoji}/u.test(bookmark.icon) && bookmark.icon.length <= 4;
      let iconHTML = `<i data-lucide="${bookmark.icon}"></i>`;
      if (isEmoji) {
        iconHTML = `<span style="font-size: 20px; line-height: 1;">${bookmark.icon}</span>`;
      }
      
      item.innerHTML = `
        <button class="bookmark-delete-btn" data-id="${bookmark.id}" data-category="${cat}" title="Remove Bookmark">
          <i data-lucide="trash-2"></i>
        </button>
        <div class="bookmark-icon-box">
          ${iconHTML}
        </div>
        <span>${bookmark.title}</span>
      `;
      
      // Navigate on click (avoid triggers if clicking delete button)
      item.addEventListener('click', (e) => {
        if (e.target.closest('.bookmark-delete-btn')) return;
        window.open(bookmark.url, '_blank');
      });
      
      grid.appendChild(item);
    });
  });
  
  // Attach Delete Handlers
  document.querySelectorAll('.bookmark-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const cat = btn.dataset.category;
      
      state.bookmarks[cat] = state.bookmarks[cat].filter(item => item.id !== id);
      localStorage.setItem('portal_bookmarks', JSON.stringify(state.bookmarks));
      renderBookmarks();
    });
  });
  
  lucide.createIcons();
}

// 5. Notes Widget (Debounced Autosave)
function initNotes() {
  const textarea = document.getElementById('notes-textarea');
  const saveStatus = document.getElementById('note-save-status');
  let saveTimeout;
  
  textarea.value = state.notes;
  
  textarea.addEventListener('input', () => {
    saveStatus.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Saving...';
    saveStatus.classList.add('visible');
    lucide.createIcons();
    
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      state.notes = textarea.value;
      localStorage.setItem('portal_notes', state.notes);
      
      saveStatus.innerHTML = '<i data-lucide="check"></i> Saved';
      lucide.createIcons();
      
      setTimeout(() => {
        saveStatus.classList.remove('visible');
      }, 1500);
    }, 1000);
  });
}

// 6. Task List Widget
function initTasks() {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const taskCountLabel = document.getElementById('task-count');
  
  addTaskBtn.addEventListener('click', addNewTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewTask();
  });
  
  function addNewTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };
    
    state.tasks.push(newTask);
    localStorage.setItem('portal_tasks', JSON.stringify(state.tasks));
    
    taskInput.value = '';
    renderTasks();
  }
  
  window.toggleTask = function(id) {
    state.tasks = state.tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    localStorage.setItem('portal_tasks', JSON.stringify(state.tasks));
    renderTasks();
  };
  
  window.deleteTask = function(id) {
    state.tasks = state.tasks.filter(task => task.id !== id);
    localStorage.setItem('portal_tasks', JSON.stringify(state.tasks));
    renderTasks();
  };
  
  function renderTasks() {
    taskList.innerHTML = '';
    
    const activeTasks = state.tasks.filter(t => !t.completed).length;
    taskCountLabel.textContent = `${activeTasks} remaining`;
    
    if (state.tasks.length === 0) {
      taskList.innerHTML = `<li class="empty-state-message" style="padding: 10px 0; text-align: center; font-size: 0.8rem; color: var(--text-muted);">No current tasks</li>`;
      return;
    }
    
    // Sort tasks: incomplete first
    const sorted = [...state.tasks].sort((a, b) => a.completed - b.completed);
    
    sorted.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <div class="task-checkbox" onclick="toggleTask(${task.id})">
          <i data-lucide="check"></i>
        </div>
        <span class="task-text">${task.text}</span>
        <button class="task-delete" onclick="deleteTask(${task.id})" title="Delete milestone">
          <i data-lucide="trash-2"></i>
        </button>
      `;
      taskList.appendChild(li);
    });
    
    lucide.createIcons();
  }
  
  renderTasks();
}

// 7. Weather Module (Dynamic Simulation with custom presets)
function initWeather() {
  const tempEl = document.getElementById('weather-temp');
  const descEl = document.getElementById('weather-desc');
  const humidityEl = document.getElementById('weather-humidity');
  const windEl = document.getElementById('weather-wind');
  const aqiEl = document.getElementById('weather-aqi');
  const iconWrapper = document.getElementById('weather-icon-wrapper');
  
  const weatherPresets = [
    { temp: 24, desc: 'Partly Cloudy', humidity: '62%', wind: '12 km/h', aqi: 'Good (38)', icon: 'cloud-sun' },
    { temp: 27, desc: 'Sunny', humidity: '45%', wind: '8 km/h', aqi: 'Moderate (52)', icon: 'sun' },
    { temp: 21, desc: 'Light Rain', humidity: '88%', wind: '16 km/h', aqi: 'Good (24)', icon: 'cloud-rain' },
    { temp: 19, desc: 'Thundery Showers', humidity: '92%', wind: '22 km/h', aqi: 'Good (18)', icon: 'cloud-lightning' },
    { temp: 23, desc: 'Mist', humidity: '90%', wind: '5 km/h', aqi: 'Fair (45)', icon: 'cloud' }
  ];
  
  function updateWeatherSimulation() {
    const hour = new Date().getHours();
    let index = 0;
    
    // Choose weather base depending on hour
    if (hour >= 6 && hour < 11) index = 0; // partly cloudy morning
    else if (hour >= 11 && hour < 16) index = 1; // sunny noon
    else if (hour >= 16 && hour < 20) index = 4; // misty evening
    else index = 2; // rainy night
    
    // Add tiny random fluctuation
    const weather = { ...weatherPresets[index] };
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    weather.temp += change;
    
    // Render
    tempEl.textContent = `${weather.temp}°C`;
    descEl.textContent = weather.desc;
    humidityEl.textContent = weather.humidity;
    windEl.textContent = weather.wind;
    aqiEl.textContent = weather.aqi;
    
    iconWrapper.innerHTML = `<i data-lucide="${weather.icon}" class="weather-icon"></i>`;
    lucide.createIcons();
  }
  
  updateWeatherSimulation();
  // Update every 10 minutes
  setInterval(updateWeatherSimulation, 600000);
}

// 8. Pomodoro Focus Timer Widget
function initTimer() {
  const timerDisplay = document.getElementById('timer-time');
  const timerStartBtn = document.getElementById('timer-start');
  const timerResetBtn = document.getElementById('timer-reset');
  const timerModeToggleBtn = document.getElementById('timer-settings-btn');
  const timerModeLabel = document.getElementById('timer-mode');
  const circleProgress = document.getElementById('timer-progress');
  
  // Progress Ring configurations
  const radius = circleProgress.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  circleProgress.style.strokeDasharray = `${circumference} ${circumference}`;
  circleProgress.style.strokeDashoffset = circumference;
  
  let timerInterval = null;
  let isRunning = false;
  let currentMode = 'pomodoro'; // 'pomodoro' (25m) or 'break' (5m)
  let timeLeft = 25 * 60; // seconds
  let totalDuration = 25 * 60;
  
  function updateTimerUI() {
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const secs = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
    
    // Draw SVG circle progress
    const progress = timeLeft / totalDuration;
    const offset = circumference * progress;
    circleProgress.style.strokeDashoffset = offset;
  }
  
  function startTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      timerStartBtn.innerHTML = '<i data-lucide="play"></i> Start';
      isRunning = false;
    } else {
      isRunning = true;
      timerStartBtn.innerHTML = '<i data-lucide="pause"></i> Pause';
      timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          playTimerAlert();
          alert(currentMode === 'pomodoro' ? 'Focus session finished! Time for a break.' : 'Break session finished! Back to focus.');
          resetTimer();
        }
        updateTimerUI();
      }, 1000);
    }
    lucide.createIcons();
  }
  
  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timerStartBtn.innerHTML = '<i data-lucide="play"></i> Start';
    
    if (currentMode === 'pomodoro') {
      timeLeft = 25 * 60;
      totalDuration = 25 * 60;
    } else {
      timeLeft = 5 * 60;
      totalDuration = 5 * 60;
    }
    updateTimerUI();
    lucide.createIcons();
  }
  
  function toggleTimerMode() {
    if (currentMode === 'pomodoro') {
      currentMode = 'break';
      timerModeLabel.textContent = 'Short Break';
      timerModeToggleBtn.innerHTML = '<i data-lucide="brain"></i>';
      timerModeToggleBtn.title = 'Switch to Focus';
    } else {
      currentMode = 'pomodoro';
      timerModeLabel.textContent = 'Pomodoro';
      timerModeToggleBtn.innerHTML = '<i data-lucide="coffee"></i>';
      timerModeToggleBtn.title = 'Switch to Break';
    }
    resetTimer();
  }
  
  // Play dynamic synth chime using Web Audio API (completely standalone, zero media files required!)
  function playTimerAlert() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Note A5
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
      
      // Chime 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.2); // Note D6
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.2);
      gain2.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      
      osc2.start(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("Could not play timer audio alert:", e);
    }
  }
  
  timerStartBtn.addEventListener('click', startTimer);
  timerResetBtn.addEventListener('click', resetTimer);
  timerModeToggleBtn.addEventListener('click', toggleTimerMode);
  
  updateTimerUI();
}

// 9. Motivational Quotes Widget
function initQuotes() {
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  
  function setRandomQuote() {
    const rand = Math.floor(Math.random() * defaultQuotes.length);
    const quote = defaultQuotes[rand];
    textEl.textContent = `"${quote.text}"`;
    authorEl.textContent = `— ${quote.author}`;
  }
  
  setRandomQuote();
  // Rotate quotes every 3 minutes
  setInterval(setRandomQuote, 180000);
}

// 10. Drawer Settings Manager
function initSettings() {
  const trigger = document.getElementById('settings-toggle');
  const drawer = document.getElementById('settings-drawer');
  const closeBtn = document.getElementById('close-settings');
  const nameInput = document.getElementById('settings-username');
  const resetBtn = document.getElementById('reset-data-btn');
  
  trigger.addEventListener('click', () => {
    nameInput.value = state.username;
    drawer.classList.add('open');
  });
  
  const closeDrawer = () => drawer.classList.remove('open');
  closeBtn.addEventListener('click', closeDrawer);
  
  // Close drawer if clicking outside content
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });
  
  // Save custom username
  nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim() || 'Researcher';
    state.username = val;
    localStorage.setItem('portal_username', val);
    
    // Refresh greetings
    const hour = new Date().getHours();
    let greeting = 'Good day';
    if (hour >= 5 && hour < 12) greeting = 'Good morning';
    else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17 && hour < 22) greeting = 'Good evening';
    else greeting = 'Good night';
    
    document.getElementById('greeting-text').textContent = `${greeting}, ${val}`;
  });
  
  // Preset bg selectors
  document.querySelectorAll('.theme-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const bgName = btn.dataset.bg;
      setBgTheme(bgName);
    });
  });
  
  // Reset Data Handler
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all portal settings, bookmarks, notes, tasks, and orders back to defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  });
}

// 11. Global Navigation Manager
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  // Apply dynamic color classes based on button labels (first character match)
  navButtons.forEach(btn => {
    const labelSpan = btn.querySelector('span');
    const labelText = (labelSpan ? labelSpan.textContent : btn.textContent).trim();
    const firstChar = labelText.charAt(0).toUpperCase();
    
    if (firstChar === 'H') {
      btn.classList.add('nav-btn-h');
    } else if (firstChar === 'O') {
      btn.classList.add('nav-btn-o');
    } else if (firstChar === 'D') {
      btn.classList.add('nav-btn-d');
    }
  });
  
  // Switch to saved view initially
  switchView(state.view);
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      state.view = targetView;
      localStorage.setItem('portal_view', targetView);
      switchView(targetView);
    });
  });
  
  function switchView(viewName) {
    // Update nav button states
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    
    // Switch views display
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${viewName}`);
    });
    
    // Refresh icons
    lucide.createIcons();
  }
}

// 12. Procurements & Orders View Manager
function initOrders() {
  const tableBody = document.getElementById('orders-table-body');
  const searchInput = document.getElementById('order-search-input');
  const filterTabs = document.querySelectorAll('.orders-filter-tab');
  const newOrderBtn = document.getElementById('new-order-btn');
  
  const orderModal = document.getElementById('order-modal');
  const closeOrderBtn = document.getElementById('close-order-modal');
  const cancelOrderBtn = document.getElementById('cancel-order');
  const saveOrderBtn = document.getElementById('save-order');
  
  let activeFilter = 'all';
  let searchQuery = '';
  
  function renderOrdersList() {
    tableBody.innerHTML = '';
    
    const filtered = state.orders.filter(order => {
      // Status Filter
      if (activeFilter === 'pending' && order.status !== 'Pending') return false;
      if (activeFilter === 'completed' && order.status !== 'Completed') return false;
      
      // Search query filter
      if (searchQuery) {
        const itemMatch = order.item.toLowerCase().includes(searchQuery.toLowerCase());
        const refMatch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
        const catMatch = order.category.toLowerCase().includes(searchQuery.toLowerCase());
        return itemMatch || refMatch || catMatch;
      }
      
      return true;
    });
    
    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No procurements found matching filter criteria.</td></tr>`;
      return;
    }
    
    // Sort orders: pending first, then by date descending
    filtered.sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.date) - new Date(a.date);
      }
      return a.status === 'Pending' ? -1 : 1;
    });
    
    filtered.forEach(order => {
      const tr = document.createElement('tr');
      const formattedCost = typeof order.cost === 'number' ? `$${order.cost.toFixed(2)}` : order.cost;
      const statusClass = order.status === 'Completed' ? 'status-completed' : 'status-pending';
      
      tr.innerHTML = `
        <td style="font-family: monospace; font-weight: 700; color: var(--accent);">${order.id}</td>
        <td style="font-weight: 600; color: var(--text-primary);">${order.item}</td>
        <td>${order.category}</td>
        <td>${order.date}</td>
        <td style="font-weight: 600; color: var(--text-primary);">${formattedCost}</td>
        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
        <td>
          <button class="btn-icon delete-order-btn" data-id="${order.id}" title="Delete procurement request">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
    
    // Wire delete buttons
    tableBody.querySelectorAll('.delete-order-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm(`Cancel and delete procurement request ${id}?`)) {
          state.orders = state.orders.filter(ord => ord.id !== id);
          localStorage.setItem('portal_orders', JSON.stringify(state.orders));
          renderOrdersList();
        }
      });
    });
    
    lucide.createIcons();
  }
  
  // Filter tabs listeners
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderOrdersList();
    });
  });
  
  // Search query listener
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    renderOrdersList();
  });
  
  // Procurement Modal controls
  newOrderBtn.addEventListener('click', () => {
    orderModal.classList.add('open');
  });
  
  const closeOrderModal = () => {
    orderModal.classList.remove('open');
    document.getElementById('order-item').value = '';
    document.getElementById('order-cost').value = '';
  };
  
  closeOrderBtn.addEventListener('click', closeOrderModal);
  cancelOrderBtn.addEventListener('click', closeOrderModal);
  
  saveOrderBtn.addEventListener('click', () => {
    const item = document.getElementById('order-item').value.trim();
    const category = document.getElementById('order-category').value;
    const costInput = document.getElementById('order-cost').value.trim();
    
    if (!item || !costInput) {
      alert('Please enter an item description and estimated cost.');
      return;
    }
    
    const cost = parseFloat(costInput);
    if (isNaN(cost) || cost <= 0) {
      alert('Please enter a valid cost amount.');
      return;
    }
    
    // Generate order ID ORD-[random 4 digits]
    const randRef = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const today = new Date().toISOString().split('T')[0];
    
    const newOrder = {
      id: randRef,
      item,
      category,
      date: today,
      cost,
      status: 'Pending'
    };
    
    state.orders.push(newOrder);
    localStorage.setItem('portal_orders', JSON.stringify(state.orders));
    
    renderOrdersList();
    closeOrderModal();
  });
  
  // Initial render
  renderOrdersList();
}

// 13. Interactive Contact Form Manager
function initContact() {
  const form = document.getElementById('contact-form');
  const successToast = document.getElementById('contact-success');
  const ticketSpan = document.getElementById('ticket-number');
  const emailInput = document.getElementById('contact-email');
  
  // Clear error state on input
  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('has-error');
    const existingError = emailInput.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Custom email regex validation
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Clear previous errors
    emailInput.classList.remove('has-error');
    const existingError = emailInput.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    if (!emailRegex.test(emailVal)) {
      emailInput.classList.add('has-error');
      
      const errorMsg = document.createElement('span');
      errorMsg.className = 'field-error';
      errorMsg.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
      emailInput.parentNode.appendChild(errorMsg);
      
      emailInput.focus();
      return;
    }
    
    // Generate a random ticket ID
    const ticketId = Math.floor(1000 + Math.random() * 9000);
    ticketSpan.textContent = ticketId;
    
    // Reset form elements
    form.reset();
    
    // Show success message
    successToast.classList.add('visible');
    
    // Hide toast after 6 seconds
    setTimeout(() => {
      successToast.classList.remove('visible');
    }, 6000);
  });
}
