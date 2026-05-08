# Navigation Setup Guide: Hero Landing → Chapters Overall

## Overview
You have two pages:
- **Page 1 (Hero)**: Currently at `/` - Shows landing with "Master B.Sc. CSIT" heading
- **Page 2 (Chapters)**: Currently at `/hamro-csit` - Shows chapters & subjects

We need to:
1. Move Page 2 to `/chapters` route
2. Add `<Link>` components for navigation
3. Ensure SPA (no full page reload)

---

## Step 1: Update App.jsx Routing

**Change this route:**
```jsx
// OLD:
<Route
  path="/hamro-csit"
  element={<HamoCSIT onSignOut={handleSignOut} />}
/>

// NEW:
<Route
  path="/chapters"
  element={<HamoCSIT onSignOut={handleSignOut} />}
/>
```

Also update the navbar display condition:
```jsx
// OLD:
const showNavbar = location.pathname !== '/hamro-csit';

// NEW:
const showNavbar = location.pathname !== '/chapters';
```

---

## Step 2: Update Navbar.jsx - Add "Chapters Overall" Link

At the top, add import:
```jsx
import { Link } from 'react-router-dom';
```

Then update the navbar center section to use `<Link>`:
```jsx
// In NavHeader or where links are rendered:
{links.map((link) => (
  link === 'Chapters Overall' ? (
    <Link 
      key={link} 
      to="/chapters" 
      className="nav-link"
      onClick={() => setActiveLink(link)}
    >
      {link}
    </Link>
  ) : (
    <button
      key={link}
      onClick={() => {
        setActiveLink(link);
        onNavLinkClick?.(link);
      }}
      className="nav-link"
    >
      {link}
    </button>
  )
))}
```

---

## Step 3: Update LandingPage.jsx - "Start Learning Now" Button

Find the button and wrap it in `<Link>`:

```jsx
// OLD:
<button className="btn-primary-original" onClick={() => scrollToSection('actions-section')}>
  Start Learning Now
</button>

// NEW:
import { Link } from 'react-router-dom';

<Link to="/chapters" style={{ textDecoration: 'none' }}>
  <button className="btn-primary-original" style={{ cursor: 'pointer' }}>
    Start Learning Now
  </button>
</Link>
```

---

## Step 4: Update HamoCSIT.jsx - "Back to Home" Button

Find the back button and wrap it in `<Link>`:

```jsx
// OLD:
<button onClick={() => setCurrentView('semesters')}>
  ← Back
</button>

// NEW:
import { Link } from 'react-router-dom';

<Link to="/" style={{ textDecoration: 'none' }}>
  <button>
    ← Back to Home
  </button>
</Link>
```

---

## Step 5: Update NavbarLinkClick Handler (App.jsx)

Add handler for "Chapters Overall":

```jsx
const handleNavbarLinkClick = (link) => {
  if (link === 'Home') {
    // existing code...
    navigate('/');
    return;
  }

  if (link === 'Chapters Overall') {
    // Navigate to chapters page
    navigate('/chapters');
    return;
  }

  if (link === 'Programs' && location.pathname === '/') {
    // existing code...
    setIsProgramsSidebarOpen(true);
  }
};
```

---

## Complete Navigation Flow

```
Page 1 (Hero Landing) at "/"
    ↓
    [Navbar: "Chapters Overall"] → Link to="/chapters"
    [Button: "Start Learning Now"] → Link to="/chapters"
    ↓
Page 2 (Chapters Overall) at "/chapters"
    ↓
    [Button: "← Back to Home"] → Link to="/"
    ↓
Back to Page 1
```

---

## Key Points

✅ **No Full Page Reload**: Using `<Link>` instead of `<a>` keeps it SPA  
✅ **Browser History**: Back button works naturally  
✅ **Dynamic Links**: Change navbar links array based on current route  
✅ **Scroll to Top**: Add `window.scrollTo(0, 0)` in Link onClick if needed  

---

## File Changes Summary

1. **App.jsx**
   - Change route: `/hamro-csit` → `/chapters`
   - Update navbar condition
   - Add handler for "Chapters Overall" link

2. **Navbar.jsx**
   - Add `import { Link } from 'react-router-dom'`
   - Render Link for "Chapters Overall"
   - Update links array to include "Chapters Overall"

3. **LandingPage.jsx**
   - Wrap "Start Learning Now" button in Link to="/chapters"
   - Add `import { Link } from 'react-router-dom'`

4. **HamoCSIT.jsx**
   - Wrap back button in Link to="/"
   - Add `import { Link } from 'react-router-dom'`

---

## Testing

1. Click "Start Learning Now" → should navigate to `/chapters` (no page reload)
2. Click "← Back to Home" → should navigate to `/` (no page reload)
3. Browser back/forward buttons should work
4. Navbar active link should update on navigation
