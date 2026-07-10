<!-- Paste the Gemini "basic_prompt" master prompt for simple_portal here. This comment line is ignored by the scorer; the file is skipped until you paste real text. -->
Create a modern, responsive, and high-performance client-side web application portal for research workspace management. The application must run entirely as a single-page app (SPA) using HTML, CSS, and vanilla JavaScript, leveraging local storage for persistence.

---

## 1. Typography & Aesthetic Guidelines
- **Typography**: Import Google Fonts `Outfit` (for headers, titles, and navigation buttons) and `Plus Jakarta Sans` (for body copy).
- **Theme**: Light theme only. Do not implement any dark mode options or toggles. Use a default background gradient based on soft pastel hues (*Soft Mint* base).
- **Background Aesthetics**: Use subtle, rotating blurred background blobs (`.glow-orb`) styled with a `mix-blend-mode: multiply` and light opacity to render a premium glassmorphic appearance.
- **Preset Background Themes**: Include a customization drawer to switch between 4 preset light-mode gradient schemes:
  1. **Soft Mint** (Default): Pastel green gradient, emerald accents.
  2. **Lilac Glow**: Gentle purple gradient, lilac accents.
  3. **Warm Peach**: Warm orange gradient, peach accents.
  4. **Pastel Sky**: Soft blue gradient, sky-blue accents.
- **Card Aesthetics**: Use semi-transparent glass cards (`rgba(255, 255, 255, 0.7)`) with very fine border outlines, soft blur backdrops, and gentle hover elevations.

---

## 2. Navigation Bar
- **Position**: Horizontal top navigation bar located in the header.
- **Buttons**:
  - **Dashboard**, **Policies**, **History**, **Contact**.
- **Aesthetic Styling**:
  - Capsule pill-shaped wrapper and button links (`border-radius: 99px`).
  - Bold sans-serif typography (`Outfit`, weight `700`, small letter-spacing).
  - Default active and hover accent color is a premium blue (`#2563eb`).
- **Dynamic First-Letter Styling Rule**:
  - If a button label's first character starts with **"H"** (e.g. *History*), its inactive text must be blue, and active/hover states must use a solid blue background (`#3b82f6`).
  - If a button label's first character starts with **"O"** (e.g. *Orders*), its active/hover background must use a solid red (`#ef4444`).
  - If a button label's first character starts with **"D"** (e.g. *Dashboard*), its inactive text must be gold/dark yellow, and active/hover background must use a solid yellow (`#eab308`).
  - Labels starting with other letters (e.g. *Policies*, *Contact*) fall back to the default premium blue accent.

---

## 3. Page Views & Routing
Implement a client-side navigation router that swaps between the following 4 panels:

### View 1: Dashboard
- **Web Search Panel**: An input field with a dropdown to select search targets: Google, Google Scholar, arXiv, DuckDuckGo, GitHub, and Wikipedia. Submitting queries redirects to search result URLs in a new tab.
- **Simulated Weather Widget**: Shows mock local coordinates, weather temperature/condition, humidity, wind, and a healthy Air Quality status bar.
- **Focus Session (Pomodoro) Widget**: Features a countdown timer (Focus/Break cycles), a circular SVG progress ring, and a chime alarm played via the Web Audio API upon cycle completion.
- **Quick Notepad**: A simple notepad textarea that auto-saves to `localStorage` with a debounced status tracker showing "Saved".
- **Milestones / Active Tasks**: An interactive checklist linked to `localStorage` to add, delete, and check off academic milestones, displaying a real-time remaining task count.
- **Workspace Bookmarks**: A tabbed list (Research, Tools, Development, Favorites) showing links with custom icons, along with an interactive modal to add custom bookmark links.

### View 2: Policies
- A grid of card resources detailing administrative guidelines (Thesis Formatting, Plagiarism Integrity, and Computer Lab Security).
- Each policy card must present custom category badges, publication dates, and download info (PDF / DOCX) with dummy visual triggers.

### View 3: History
- A procurement and milestone log datatable showing requested items (e.g. hardware, cloud credits, journal subscriptions).
- **Controls**:
  - Free-text search to filter logs by description, reference, or category.
  - Tab filters to sort by status (All, Pending, Completed).
  - "New Request" button which launches a modal form to submit new procurement logs, automatically appending them to `localStorage` state.

### View 4: Contact
- **Administrative Directory**: Lists office location, hotline, and quick links to academic profiles (ORCID, GitHub, Google Scholar).
- **Interactive Support Ticket Form**:
  - Contains fields: **Full Name**, **Email Address** (type email), and **Detailed Description**.
  - **Email Validation**: Custom JavaScript check using regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) executed upon submission. If invalid, applies red boundaries and displays an inline error warning. Errors clear automatically as the user types.
  - On validation success, clears the form inputs, mocks a support ticket ID (e.g. `#SR-4029`), and displays a toast notification.

---

## 4. Mobile Responsiveness
- **Layout Stacking**: Collapse multi-column grid containers (the Dashboard 3-column widgets, the Policies card deck, and the Contact view layout) into single-column flows on screens `< 768px`.
- **Top Nav scrolling**: Prevent horizontal overflow of the top navigation capsule on narrow screens by making the navigation container scrollable horizontally (`overflow-x: auto`) with native touch momentum, hiding visual scrollbars.
- **Inputs & Controls**: Form rows and procurement toolbar elements must scale to 100% width on mobile screens to provide accessible touch boundaries.
