# Circular Command Menu Integration Guide

## Project Setup Status

✅ **Project Requirements Met:**
- ✅ React framework (Vite-based)
- ✅ Tailwind CSS configured
- ✅ All required dependencies installed

## Dependencies

The following packages are already installed in your project:

```json
{
  "framer-motion": "^12.38.0",
  "lucide-react": "^1.14.0",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "tailwindcss": "^3.4.19"
}
```

No additional package installation required! ✅

## Component Structure

### New Files Created:

#### 1. `/src/lib/utils.js`
A utility function for merging Tailwind CSS classes conditionally:
```javascript
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
```

#### 2. `/src/components/ui/circular-command-menu.jsx`
The main circular command menu component featuring:
- Circular menu layout with smooth animations
- Keyboard navigation (Arrow keys, Enter, Escape)
- Tooltips with keyboard shortcuts
- Responsive menu items
- Framer Motion animations
- Lucide React icons support

### Modified Files:

#### 1. `/vite.config.js`
Added path alias configuration to support `@/` imports:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

#### 2. `/src/components/Navbar.jsx`
- Imported the `CircularCommandMenu` component
- Imported icons from `lucide-react` (Home, BookOpen, HelpCircle, Users, Info)
- Added command menu items array with navigation actions
- Integrated circular menu in the navbar's right section (displays when user is not signed in)

## Component API

### CircularCommandMenu Props

```javascript
{
  items: CommandItem[],        // Array of menu items
  trigger: ReactNode,          // Custom trigger button (optional)
  className: string,           // Additional CSS classes
  radius: number,              // Radius of circular layout (default: 120)
  onSelect: (item) => void     // Callback when item is selected
}
```

### CommandItem Structure

```javascript
{
  id: string,                  // Unique identifier
  icon: ReactNode,             // Icon component (lucide-react)
  label: string,               // Display label
  shortcut?: string,           // Keyboard shortcut display
  onClick?: () => void         // Action handler
}
```

## Features

### ✨ Implemented Features

1. **Circular Menu Layout**
   - Smooth circular positioning of menu items
   - Configurable radius (default: 120px)
   - Animated entrance/exit

2. **Keyboard Navigation**
   - Arrow keys: Navigate between items
   - Enter: Select active item
   - Escape: Close menu

3. **Visual Feedback**
   - Active item highlighting with ring effect
   - Hover states
   - Tooltip display on hover/keyboard navigation
   - Smooth spring animations

4. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation support
   - Focus management

5. **Responsive Design**
   - Tailwind CSS classes
   - Backdrop blur overlay
   - Mobile-friendly

## Navigation Menu Items

The navbar now includes 5 command menu items:

```javascript
const commandItems = [
  { 
    id: "home", 
    icon: <Home />, 
    label: "Home", 
    shortcut: "⌘H"
  },
  { 
    id: "programs", 
    icon: <BookOpen />, 
    label: "Programs", 
    shortcut: "⌘P"
  },
  { 
    id: "contact", 
    icon: <Users />, 
    label: "Contact", 
    shortcut: "⌘K"
  },
  { 
    id: "help", 
    icon: <HelpCircle />, 
    label: "Help", 
    shortcut: "⌘?" 
  },
  { 
    id: "about", 
    icon: <Info />, 
    label: "About", 
    shortcut: "⌘A"
  },
]
```

## Usage Example

The component is already integrated in the navbar. To use it elsewhere:

```jsx
import { CircularCommandMenu } from '@/components/ui/circular-command-menu'
import { Home, Copy, Download } from 'lucide-react'

const MyComponent = () => {
  const items = [
    { 
      id: "home", 
      icon: <Home className="h-5 w-5" />, 
      label: "Home",
      onClick: () => console.log("Home clicked")
    },
    { 
      id: "copy", 
      icon: <Copy className="h-5 w-5" />, 
      label: "Copy",
      onClick: () => console.log("Copy clicked")
    },
  ]

  return (
    <CircularCommandMenu 
      items={items}
      radius={120}
      onSelect={(item) => console.log(`Selected: ${item.label}`)}
    />
  )
}
```

## Styling Customization

The component uses Tailwind CSS classes. To customize:

1. **Button Colors:** Edit the trigger button classes in `circular-command-menu.jsx`
   - Current: `bg-blue-600` (primary) and `bg-blue-700` (hover)
   - Update these classes to change colors

2. **Menu Item Colors:** Customize the menu item classes
   - Current: `bg-white` (default) and `bg-gray-100` (hover)
   - Active state: `ring-2 ring-blue-600 bg-gray-100`

3. **Tooltip Colors:** Modify the tooltip styling
   - Current: `bg-gray-900` (dark tooltip)
   - Text: `text-white`

## Display Behavior

The circular command menu in the navbar:
- **Shows:** When user is NOT signed in
- **Hides:** When user IS signed in (sign-in button appears instead)
- **Position:** Right side of the navbar, before the Sign In button

## Testing

To test the component:

1. Start the development server: `npm run dev`
2. Navigate to the landing page (when not signed in)
3. Look for the circular menu icon (+) in the top-right of the navbar
4. Click to open the circular menu
5. Use mouse or keyboard to navigate and select items

## Keyboard Shortcuts Display

The menu displays recommended keyboard shortcuts:
- ⌘H - Home
- ⌘P - Programs
- ⌘K - Contact
- ⌘? - Help
- ⌘A - About

These are purely for display purposes and can be customized.

## Notes

- The component uses `framer-motion` for smooth animations
- All styling uses Tailwind CSS utility classes
- Icons are from `lucide-react` library
- The component is fully responsive
- The component supports custom icons via the `trigger` prop

## Future Enhancements

Possible improvements:
1. Add actual keyboard shortcut bindings
2. Add more menu items with different icons
3. Customize animation speeds
4. Add sound effects on menu interactions
5. Add menu item grouping/separators
6. Add submenu support

---

**Integration Complete!** ✅ The circular command menu is now fully integrated into your landing page navigation.
