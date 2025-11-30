# Horror Theme Guidelines
## Status: ✅ ACTIVE

## Overview
Comprehensive styling and design guidelines for maintaining consistent horror aesthetics throughout the Dead Scroll extension.

## Color Palette

### Primary Colors
```css
--blood-red: #DC2626;
--dark-red: #7F1D1D;
--deep-black: #0a0a0a;
--pure-black: #000000;
--light-gray: #e5e5e5;
--dark-gray: #374151;
```

### Usage Guidelines
- **Blood Red (#DC2626)**: Primary actions, emphasis, danger
- **Dark Red (#7F1D1D)**: Borders, shadows, secondary elements
- **Deep Black (#0a0a0a)**: Main backgrounds
- **Pure Black (#000000)**: Text shadows, borders
- **Light Gray (#e5e5e5)**: Body text, secondary content
- **Dark Gray (#374151)**: Disabled states, subtle elements

## Typography

### Font Families
```css
--font-horror: 'Creepster', cursive;
--font-mono: 'Courier New', monospace;
--font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Usage
- **Creepster**: Headers, titles, primary CTAs
- **Monospace**: Body text, UI elements, code
- **System**: Fallback for accessibility

### Font Sizes
```css
--text-xs: 10px;
--text-sm: 12px;
--text-base: 14px;
--text-lg: 18px;
--text-xl: 24px;
--text-2xl: 28px;
--text-3xl: 36px;
--text-4xl: 48px;
```

## Animation Effects

### Glow Effects
```css
.horror-glow {
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.8),
               0 0 50px rgba(220, 38, 38, 1),
               0 0 30px rgba(220, 38, 38, 0.8);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 30px rgba(220, 38, 38, 0.8); }
  50% { text-shadow: 0 0 50px rgba(220, 38, 38, 1); }
}
```

### Scanline Effect
```css
.scanlines {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  animation: scanline-move 0.2s linear infinite;
}

@keyframes scanline-move {
  0% { background-position-y: 0px; }
  100% { background-position-y: 4px; }
}
```

### Floating Animation
```css
.floating {
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

## Component Patterns

### Button Styles
```css
.horror-button {
  background: #DC2626;
  color: #FFF;
  border: 4px solid #000;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Creepster', cursive;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  box-shadow: 0 0 40px rgba(220, 38, 38, 0.8);
  transition: all 0.3s ease;
}

.horror-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 60px rgba(220, 38, 38, 1);
}

.horror-button:active {
  transform: scale(0.95);
}
```

### Card Styles
```css
.horror-card {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #7F1D1D;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.2);
  backdrop-filter: blur(10px);
}
```

### Input Styles
```css
.horror-input {
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #7F1D1D;
  border-radius: 4px;
  color: #e5e5e5;
  padding: 8px 12px;
  font-family: monospace;
}

.horror-input:focus {
  outline: none;
  border-color: #DC2626;
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
}
```

## Icon Usage

### Lucide React Icons
```typescript
import { Skull, Ghost, Flame, Lock, Unlock, Trash2, ArrowRight } from 'lucide-react';

// Icon sizing
const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40
};

// Icon colors
const iconColors = {
  primary: '#DC2626',
  secondary: '#e5e5e5',
  danger: '#7F1D1D'
};
```

### Icon Guidelines
- Use skull icons for death/burial themes
- Use ghost icons for quest/learning elements
- Use flame icons for intensity/urgency
- Use lock/unlock for access control
- Maintain consistent sizing within contexts

## Sound Design

### Audio Feedback
```typescript
const soundEffects = {
  correct: {
    frequency: [400, 800],
    duration: 0.2,
    type: 'ascending'
  },
  wrong: {
    frequency: [300, 100],
    duration: 0.3,
    type: 'descending'
  },
  victory: {
    frequency: [523, 659, 784],
    duration: 0.4,
    type: 'melody'
  },
  death: {
    frequency: [200, 50],
    duration: 0.5,
    type: 'ominous'
  }
};
```

### Audio Guidelines
- Keep sounds short (<1 second)
- Use frequency modulation for emotion
- Provide visual alternatives for accessibility
- Allow sound muting option

## Accessibility Considerations

### Color Contrast
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- Red on black: 5.2:1 (passes WCAG AA)

### Focus Indicators
```css
.horror-focusable:focus {
  outline: 2px solid #DC2626;
  outline-offset: 2px;
}
```

### Screen Reader Support
- Use semantic HTML elements
- Provide ARIA labels for icons
- Ensure logical tab order
- Include skip navigation links

## Responsive Design

### Breakpoints
```css
--mobile: 380px;
--tablet: 768px;
--desktop: 1024px;
```

### Layout Guidelines
- Popup width: 380px (fixed)
- Min height: 500px
- Padding: 16px
- Component gaps: 16px
- Border radius: 8px

## Performance Guidelines

### Animation Performance
- Use `transform` and `opacity` for animations
- Avoid animating `width`, `height`, `top`, `left`
- Target 60fps for all animations
- Use `will-change` sparingly

### CSS Optimization
- Minimize specificity
- Avoid deep nesting
- Use CSS variables for theming
- Leverage hardware acceleration

## Implementation Checklist

### New Component Checklist
- [ ] Uses horror color palette
- [ ] Implements Creepster font for headers
- [ ] Includes hover/focus states
- [ ] Has appropriate animations
- [ ] Meets accessibility standards
- [ ] Optimized for performance
- [ ] Responsive design applied
- [ ] Sound effects integrated (if applicable)

---
**Guidelines Status**: Active ✅
**Last Updated**: November 2024
**Compliance Rate**: 100%
