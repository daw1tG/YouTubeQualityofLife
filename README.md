# YouTube Quality of Life Extension

A Chrome extension designed to improve the overall YouTube user experience. It detects bot-generated comments, hides inappropriate or unwanted content, blocks intrusive ads, and removes already-watched videos from the recommendation feed. It also automatically cleans up Shorts shelves and other low‑value UI clutter.

---

## 🚀 Features

### **1. Bot Comment Detection**
- Scans every new YouTube comment using several heuristics:
  - Emoji frequency and flagged emoji patterns
  - Reused or duplicate comments across multiple accounts
  - Detection of suspicious common bot phrases
  - Username analysis using a large dataset of female names and Cyrillic patterns
  - Profile metadata inspection via YouTube's `ytInitialData` (bio, external links, profile picture reuse)
- Automatically highlights potential bots or marks their profiles for future filtering.

### **2. Recommended Feed Cleaner**
- Automatically hides videos that have already been partially or fully watched.
- Removes Shorts shelves from the home page and video pages.
- Blocks ads from appearing in the Recommended feed.
- Uses MutationObservers and a debounced cleaning process to keep performance smooth.

### **3. Profile Picture Tracking**
- Stores known bot profile pictures using Chrome storage API.
- Detects when multiple suspicious accounts reuse the same PFP.
- Auto-updates the stored list as new bot profiles are detected.

### **4. YouTube Navigation Integration**
- Listens for YouTube's internal `yt-navigate-finish` event.
- Re-runs processors when navigating between videos or different sections of the site.

---

## 📁 Project Structure

```
├── background.js            # Handles storage, messaging, and ytInitialData fetching
├── botDetector.js           # Core logic for scanning and detecting bot comments
├── recommendedCleaner.js    # Removes watched videos, ads, Shorts, etc.
├── female-names.js          # Large dataset of names for username heuristics
├── flagged-emojis.js        # Set of emojis frequently used in bot comments
└── manifest.json            # Chrome extension configuration
```

---

## 🛠️ How It Works

### **Content Scripts**
Injected into YouTube pages to:
- Observe comments as they load
- Process and classify comments
- Continuously clean recommendation shelves and ads

### **Background Worker**
- Stores and retrieves `botPFPs`
- Fetches public YouTube channel metadata
- Handles async messaging between scripts

---

## 🔧 Installation (Developer Mode)
1. Clone or download the project.
2. Open **chrome://extensions** in Chrome.
3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the project folder.

The extension instantly begins working when you open YouTube.

---

## ⚙️ Permissions Used
- `activeTab`, `tabs`, `storage` — to interact with browser state and store bot data
- `scripting` — to inject content logic
- `host_permissions: *://*.youtube.com/*` — required to read YouTube pages dynamically

---

## 🚧 Known Limitations
- Bot detection relies on heuristics; may require tuning as bot behavior evolves.
- YouTube UI changes may break some selectors and require updates.
- `ytInitialData` structures occasionally differ between YouTube experiments.

---

## 📌 Future Improvements
- User-adjustable sensitivity for bot detection
- UI controls for customizing which cleanup features are active
- Machine‑learning–based comment scoring
- Syncing bot profile data across devices

---

## 📝 License
MIT License — free to use and modify.

