# JeevaPath Visual Design System

---

## 🎨 **DESIGN PHILOSOPHY**

**Core Principle:** *"Spiritual Meets Modern Intelligence"*
- Blend ancient Indian aesthetics with cutting-edge tech UI
- Calm, trustworthy, premium feel
- Zero visual clutter (respects user's mental space)

---

## 📱 **APPLICATION APPEARANCE**

### **Overall Visual Language**

**Style Direction:** *Neo-Indian Minimalism*
- **NOT**: Generic Material Design clone
- **NOT**: Overly ornate temple app aesthetic
- **YES**: Clean, breathing space + subtle cultural touches

**UI Architecture:**
```
┌─────────────────────────────┐
│   Status Bar (Translucent)  │
├─────────────────────────────┤
│                             │
│   Primary Content Zone      │
│   (Breathing room, 24px     │
│    horizontal padding)      │
│                             │
│                             │
├─────────────────────────────┤
│  Bottom Navigation (Float)  │
│    [Glassmorphic card]      │
└─────────────────────────────┘
```

---

## 🎭 **SPLASH SCREEN ANIMATION**

### **Concept: "Path Unfolds"**

**Duration:** 2.5 seconds (optimal for perceived performance)

**Animation Sequence:**

```
Second 0.0-0.8: EMERGENCE
├── Soft gradient fade-in (dark → warm)
├── Center: Lotus outline draws itself (path animation)
└── Subtle glow pulse from center

Second 0.8-1.6: TRANSFORMATION
├── Lotus morphs into abstract path/road
├── Small particles (fireflies/diyas) trace the path
└── "JeevaPath" text fades in character-by-character

Second 1.6-2.5: TRANSITION
├── Path extends to edges, becoming navigation lines
├── Screen lightens to main app background
└── Seamless morph into Home dashboard
```

---

## 🎬 **PAGE TRANSITIONS**

### **Transition System:**

**1. Navigation Transitions (between main pages)**
```tsx
// Smooth fade + slight scale
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: 0.2 }
  }
};
```

**2. Modal/Sheet Transitions**
```tsx
// Bottom sheet slides up
const sheetVariants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: { type: 'spring', damping: 30, stiffness: 300 }
  }
};
```

**3. Card Stagger Animations**
```tsx
// Places grid animates in sequence
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};
```

---

## ✍️ **TYPOGRAPHY SYSTEM**

### **Font Families:**

```css
/* Primary: Modern + Readable */
--font-sans: 'Inter', system-ui, sans-serif;

/* Display/Headers: Cultural Touch */
--font-display: 'Lora', Georgia, serif;

/* Accent/Special: Telugu Script */
--font-telugu: 'Noto Sans Telugu', sans-serif;

/* Monospace: Technical Info */
--font-mono: 'JetBrains Mono', monospace;
```

---

## 🎨 **COLOR SYSTEM**

### **Semantic Color Palette:**

```css
:root {
  /* Brand Colors */
  --color-primary: #ff6b35;      /* Saffron/Orange - Energy */
  --color-primary-light: #ff8f64;
  --color-primary-dark: #e5521f;
  
  --color-secondary: #2d1b4e;    /* Deep Purple - Spiritual */
  --color-secondary-light: #4a3472;
  --color-secondary-dark: #1a0d2e;
  
  --color-accent: #f4a261;       /* Gold - Premium */
  --color-success: #2a9d8f;      /* Teal - Nature */
  --color-warning: #e76f51;      /* Coral - Attention */
  
  /* Neutrals */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-tertiary: #e9ecef;
  
  /* Dark Mode */
  --color-dark-bg-primary: #0f172a;
  --color-dark-bg-secondary: #1e293b;
  --color-dark-text-primary: #f1f5f9;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### **Category-Specific Colors:**

```css
/* Interest Categories */
.category-spiritual { --cat-color: #9333ea; }  /* Purple */
.category-nature    { --cat-color: #059669; }  /* Green */
.category-food      { --cat-color: #dc2626; }  /* Red */
.category-water     { --cat-color: #0284c7; }  /* Blue */
.category-history   { --cat-color: #78350f; }  /* Brown */
.category-adventure { --cat-color: #ea580c; }  /* Orange */
```

---

## 📐 **SPACING & LAYOUT**

```css
/* Spacing scale (4px base) */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */

/* Border radius scale */
--radius-sm: 0.5rem;   /* 8px */
--radius-md: 1rem;     /* 16px */
--radius-lg: 1.5rem;   /* 24px */
--radius-xl: 2rem;     /* 32px */
--radius-full: 9999px;
```
