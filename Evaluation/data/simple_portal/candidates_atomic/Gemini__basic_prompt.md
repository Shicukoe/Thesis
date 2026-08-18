# Gemini__basic_prompt - candidate atomic decomposition (mode=candidate, keep-all, verbatim, hand/not-GT-blind preview)

### Requirement 1
Create a modern, responsive, and high-performance client-side web application portal for research workspace management.

### Requirement 2
The application must run entirely as a single-page app (SPA) using HTML, CSS, and vanilla JavaScript, leveraging local storage for persistence.

### Requirement 3
Typography: Import Google Fonts Outfit (for headers, titles, and navigation buttons) and Plus Jakarta Sans (for body copy).

### Requirement 4
Light theme only. Do not implement any dark mode options or toggles. Use a default background gradient based on soft pastel hues (Soft Mint base).

### Requirement 5
Use subtle, rotating blurred background blobs (.glow-orb) styled with mix-blend-mode: multiply and light opacity to render a premium glassmorphic appearance.

### Requirement 6
Include a customization drawer to switch between 4 preset light-mode gradient schemes: Soft Mint, Lilac Glow, Warm Peach, Pastel Sky.

### Requirement 7
Use semi-transparent glass cards (rgba(255,255,255,0.7)) with very fine border outlines, soft blur backdrops, and gentle hover elevations.

### Requirement 8
Navigation bar position: Horizontal top navigation bar located in the header.

### Requirement 9
Navigation buttons: Dashboard, Policies, History, Contact.

### Requirement 10
Capsule pill-shaped wrapper and button links (border-radius: 99px).

### Requirement 11
Bold sans-serif typography (Outfit, weight 700, small letter-spacing).

### Requirement 12
Default active and hover accent color is a premium blue (#2563eb).

### Requirement 13
If a button label's first character starts with "H" (e.g. History), its inactive text must be blue, and active/hover states must use a solid blue background (#3b82f6).

### Requirement 14
If a button label's first character starts with "O" (e.g. Orders), its active/hover background must use a solid red (#ef4444).

### Requirement 15
If a button label's first character starts with "D" (e.g. Dashboard), its inactive text must be gold/dark yellow, and active/hover background must use a solid yellow (#eab308).

### Requirement 16
Labels starting with other letters (e.g. Policies, Contact) fall back to the default premium blue accent.

### Requirement 17
Implement a client-side navigation router that swaps between 4 panels.

### Requirement 18
Dashboard view: Web Search Panel with an input field and a dropdown to select search targets (Google, Google Scholar, arXiv, DuckDuckGo, GitHub, Wikipedia); submitting queries redirects to search result URLs in a new tab.

### Requirement 19
Dashboard view: Simulated Weather Widget showing mock local coordinates, weather temperature/condition, humidity, wind, and an Air Quality status bar.

### Requirement 20
Dashboard view: Focus Session (Pomodoro) Widget with a countdown timer (Focus/Break cycles), a circular SVG progress ring, and a chime alarm played via the Web Audio API.

### Requirement 21
Dashboard view: Quick Notepad textarea that auto-saves to localStorage with a debounced Saved status tracker.

### Requirement 22
Dashboard view: Milestones / Active Tasks interactive checklist linked to localStorage to add, delete, and check off milestones, displaying a real-time remaining task count.

### Requirement 23
Dashboard view: Workspace Bookmarks tabbed list (Research, Tools, Development, Favorites) with custom icons and a modal to add custom bookmark links.

### Requirement 24
Policies view: a grid of card resources detailing administrative guidelines (Thesis Formatting, Plagiarism Integrity, Computer Lab Security).

### Requirement 25
Each policy card must present custom category badges, publication dates, and download info (PDF / DOCX).

### Requirement 26
History view: a procurement and milestone log datatable showing requested items (hardware, cloud credits, journal subscriptions).

### Requirement 27
History view: free-text search to filter logs by description, reference, or category.

### Requirement 28
History view: tab filters to sort by status (All, Pending, Completed).

### Requirement 29
History view: New Request button which launches a modal form to submit new procurement logs, appending them to localStorage state.

### Requirement 30
Contact view: Administrative Directory listing office location, hotline, and quick links to academic profiles (ORCID, GitHub, Google Scholar).

### Requirement 31
Contact view: Interactive Support Ticket Form with fields Full Name, Email Address (type email), and Detailed Description.

### Requirement 32
Email Validation: custom JavaScript regex check executed upon submission; if invalid, applies red boundaries and displays an inline error warning; errors clear automatically as the user types.

### Requirement 33
On validation success, clears the form inputs, mocks a support ticket ID (e.g. #SR-4029), and displays a toast notification.

### Requirement 34
Mobile: Collapse multi-column grid containers into single-column flows on screens < 768px.

### Requirement 35
Mobile: Prevent horizontal overflow of the top navigation capsule on narrow screens by making the navigation container scrollable horizontally (overflow-x: auto) with native touch momentum, hiding visual scrollbars.

### Requirement 36
Mobile: Form rows and procurement toolbar elements must scale to 100% width on mobile screens.
