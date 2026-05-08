# Shader Component Integration Guide

## Project Setup Status

### ✅ Already Configured
- **Tailwind CSS**: Installed and configured
- **React**: Version 19.2.4
- **React Router**: Version 6.30.3
- **Lucide Icons**: Version 1.14.0 (for SVG icons)

### ⚠️ To Enable Full Shader Effects

#### Option 1: Install @paper-design/shaders-react (Recommended)

```bash
cd frontend
npm install @paper-design/shaders-react
```

Then update `/components/ui/subject-shader-cards.tsx` to use the `Warp` component:

```tsx
import { Warp } from "@paper-design/shaders-react"

// Replace the gradient implementation with shader-based rendering
<Warp
  style={{ height: "100%", width: "100%" }}
  proportion={shaderConfig.proportion}
  softness={shaderConfig.softness}
  distortion={shaderConfig.distortion}
  swirl={shaderConfig.swirl}
  swirlIterations={shaderConfig.swirlIterations}
  shape={shaderConfig.shape}
  shapeScale={shaderConfig.shapeScale}
  scale={1}
  rotation={0}
  speed={0.8}
  colors={shaderConfig.colors}
/>
```

#### Option 2: Use Current Gradient Implementation (No Dependencies)

The current implementation uses CSS gradients which works perfectly without additional dependencies and provides:
- ✨ Beautiful gradient backgrounds
- 🎨 Smooth hover effects
- 📱 Responsive design
- ⚡ Lightweight (no WebGL overhead)

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── feature-shader-cards.jsx      (Features showcase)
│   │       ├── subject-shader-cards.tsx      (Subject cards with gradients)
│   │       └── ...other components
│   ├── pages/
│   │   └── LandingPage.jsx                   (Integrated components)
│   └── ...
└── package.json
```

## Components Overview

### 1. **SubjectShaderCards** (`subject-shader-cards.tsx`)
- Displays subject cards with shader/gradient backgrounds
- Responsive grid layout (1-4 columns based on screen size)
- Interactive hover effects
- 6 unique color schemes rotating across cards

**Props:**
```tsx
interface SubjectShaderCardsProps {
  subjects: Array<{
    code: string
    name: string
  }>
  onSubjectClick: (subject: any) => void
}
```

### 2. **FeaturesCards** (`feature-shader-cards.jsx`)
- Displays feature showcase with gradient effects
- Used for educational content highlights
- 6 predefined feature items with Lucide icons

### 3. **LandingPage** (`LandingPage.jsx`)
- Main entry point
- Manages semester/subject navigation
- Renders subject cards when semester is selected
- Shows subject details when subject is clicked

## Features Implemented

### ✅ Semester Selection Flow
1. Click "BSc CSIT" → Shows semester dropdown
2. Click semester → Shows subject cards with gradient backgrounds
3. Click subject → Shows subject details with tabs (Chapters, Syllabus, Notes, Q/A, Questions)

### ✅ Visual Effects
- **Gradient Backgrounds**: 6 unique color schemes
- **Hover Effects**: Card scale and translate animations
- **Responsive Layout**: Adapts to all screen sizes
- **Smooth Transitions**: All animations use cubic-bezier easing

### ✅ Color Schemes
1. Purple → Pink
2. Blue → Cyan  
3. Green → Emerald
4. Orange → Red
5. Indigo → Purple
6. Rose → Pink

## Installation Instructions

### For Development
```bash
cd frontend
npm install
npm run dev
```

### For Production
```bash
cd frontend
npm run build
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Tips

1. The gradient implementation is lightweight and performant
2. No WebGL overhead (optional @paper-design/shaders-react)
3. CSS animations are GPU-accelerated
4. Responsive grid prevents layout shifts

## Future Enhancements

1. **Shader Version**: Install `@paper-design/shaders-react` for WebGL-based shader effects
2. **Dark Mode**: Already supported via dark: prefixes in Tailwind
3. **Animations**: Can add more complex animations with Framer Motion
4. **Search/Filter**: Add semester/subject search functionality
5. **Bookmarks**: Allow users to save favorite subjects

## Troubleshooting

### Cards not appearing
- Ensure LandingPage.jsx is imported correctly
- Check browser console for React errors
- Verify SubjectShaderCards component is properly imported

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check that all CSS classes are in tailwind.config.js
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Performance issues
- Reduce the number of subjects displayed at once
- Use pagination for large lists
- Disable animations on mobile if needed

## Support

For issues or questions, refer to:
- Tailwind CSS docs: https://tailwindcss.com
- @paper-design/shaders-react: https://github.com/paper-design/shaders-react
- Lucide React icons: https://lucide.dev
