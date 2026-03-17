# Flora

An artistic, nature-inspired to-do app that floats elegantly in the corner of your screen. No emojis, no clutter—just refined design and purposeful functionality.

## Design Philosophy

Flora brings the calm of a botanical garden to your digital workspace. Every element is carefully considered:

- **Typography**: Cormorant Garamond for the logo, Inter for UI—classic meets modern
- **Color**: Sophisticated forest palette with sage, moss, and deep greens
- **Form**: Organic shapes, subtle textures, and gentle animations
- **Light**: Both sun-drenched and moonlit modes

## Features

- **Artistic Design**
  - Custom SVG icons throughout
  - Sophisticated color palette (no emojis, pure design)
  - Subtle grain texture overlay
  - Organic decorative elements

- **Dual Modes**
  - Light: Botanical garden aesthetic
  - Dark: Night garden with luminescent greens
  - Smooth transitions between themes

- **Interaction Design**
  - Animated checkbox with organic fill
  - Underline-style input with smooth reveal
  - Hover states with purpose
  - Toast notifications with elegant timing

- **Functionality**
  - Always-on-top floating window
  - System tray integration
  - Task completion progress bar
  - Persistent storage

## Quick Start

```bash
npm install
npm start
```

## Usage

| Control | Action |
|---------|--------|
| Type + Enter | Add task |
| Circle checkbox | Complete task (animated fill) |
| × | Delete task |
| Sun/Moon icon | Toggle light/dark mode |
| − | Hide to tray |
| × | Quit |

## Color Palette

### Light Mode
- Background: `#faf9f6` (warm white)
- Primary: `#3d5a4a` (forest)
- Accent: `#5a7a6a` (sage)
- Text: `#1a1a1a` (soft black)

### Dark Mode
- Background: `#1a1f1c` (deep forest)
- Primary: `#7a9a7a` (moonlit green)
- Accent: `#9ab89a` (sage glow)
- Text: `#e8ebe8` (moon white)

## Design Details

- **Logo**: Custom SVG combining leaf and checkmark forms
- **Checkbox**: Circular with organic dot fill animation
- **Inputs**: Underline-style with expanding focus state
- **Progress**: Gradient bar showing completion
- **Notifications**: Pill-shaped with smooth slide-up

## Keyboard

- `Enter` - Add task
- `Esc` - Clear input

## Architecture

- Electron for desktop shell
- Vanilla CSS with custom properties for theming
- Google Fonts (Cormorant Garamond, Inter)
- LocalStorage for persistence

---

Flora — cultivate your focus
