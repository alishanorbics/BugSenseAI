# DESIGN.md — BugSense AI

Project-specific visual identity. Implements into `helpers/colors.js` and
`assets/font/` per `mobile/CLAUDE.md`'s theming contract.

## Colors
- **Primary**: `#1FCDF3` (electric cyan) — main CTAs, active/selected states, links, icon accents, "detect" signals
- **Secondary**: `#178FC7` (deep blue) — pressed/hover states, gradients, secondary buttons, chart/data accents

### Supporting neutrals (from logo)
- **Background**: `#05060A` (near-black) — app background, dark surfaces
- **Surface text / muted**: `#D6D6D6` (silver) — secondary text, dividers, inactive icons
- **On-background**: `#FBFBFB` (off-white) — primary text/icons on dark surfaces

## Font Family
- **Heading font**: Orbitron — Google Fonts — screen titles, section headers, bug IDs/severity badges, empty states
- **Body font**: Montserrat — Google Fonts — body copy, comments, form fields, list/card content
- **Location**: `mobileapp/assets/font/`

## Dark Mode
- Enabled (dark-first) — matches the logo's black canvas and cyan-accent identity. Add a light-mode palette later only if explicitly requested.

## References
- Logo: `mobileapp/assets/images/bugsenselogo.png` — half-cyan/half-silver robotic bug mark on black; defines the "AI meets bug tracking" visual language
- Fonts: `mobileapp/assets/font/` — Orbitron and Montserrat font files
- Aesthetic direction: dark, circuit-board/robotic tech, high-contrast cyan accents against near-black surfaces
