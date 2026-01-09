## ⚙️ Configuration Guide

### Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/typing-platform
PORT=3000
NODE_ENV=development

# Optional
CORS_ORIGIN=*
ANTI_CHEAT_ENABLED=true
LEADERBOARD_UPDATE_INTERVAL=1000
MAX_CONCURRENT_USERS=100
```

### CSS Customization

**Change Primary Color (variables.css):**
```css
--color-primary: #2180a0;        /* Teal-500 */
--color-primary-hover: #1d7480;  /* Teal-600 */
```

**Change Font Size:**
```css
--font-size-base: 16px;  /* Default 14px */
--font-size-lg: 18px;
```

**Change Spacing:**
```css
--space-8: 8px;
--space-16: 16px;
--space-24: 24px;
```

### Socket.io Configuration

```javascript
const socket = io({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: Infinity,
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000
});
```
### Dark Mode / Theme Toggle

The platform supports **light and dark themes**. Users can switch themes manually using the **theme toggle button** (🌙 / ☀️) at the top-right corner.

The theme is controlled via the `data-color-scheme` attribute on the `<html>` element:

- `data-color-scheme="light"` — Light mode
- `data-color-scheme="dark"` — Dark mode

Semantic CSS variables define the colors for each mode. For example:

```css
/* Light Mode */
[data-color-scheme='light'] {
  --color-background: var(--color-cream-50);
  --color-surface: var(--color-cream-100);
  --color-text: var(--color-slate-900);
  --color-primary: var(--color-teal-500);
}

/* Dark Mode */
[data-color-scheme='dark'] {
  --color-background: var(--color-charcoal-700);
  --color-surface: var(--color-charcoal-800);
  --color-text: var(--color-gray-200);
  --color-primary: var(--color-teal-300);
}
