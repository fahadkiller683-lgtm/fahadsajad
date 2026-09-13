---
name: Fahad Sajad — Video Editor Portfolio
description: A working contact sheet reviewed on a light table — proof of range, not a cinematic-viewer skin.
colors:
  paper: "#e9e7e1"
  paper-shadow: "#dcd9d1"
  steel-dark: "#26251f"
  ink: "#171717"
  ink-dim: "#676662"
  ink-faint: "#57564f"
  grease: "#b74a32"
  grease-dim: "#93392a"
  frame-void: "#141412"
  on-dark: "#f2f0eb"
typography:
  display:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "clamp(2.6rem, 5.6vw, 4.6rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "clamp(1.8rem, 4vw, 3.2rem)"
    fontWeight: 500
    fontStyle: "italic"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  full: "99px"
  circle: "50%"
spacing:
  edge: "clamp(1.25rem, 5vw, 3.5rem)"
  sheet-y: "clamp(4rem, 9vw, 7.5rem)"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0.95rem 1.6rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "0"
  card-frame:
    backgroundColor: "{colors.frame-void}"
    rounded: "0"
---

# Design System: Fahad Sajad — Video Editor Portfolio

## Overview

**Creative North Star: "The Proof Sheet"**

The site is a working contact sheet reviewed on a light table, not a cinematic-viewer skin. Every section is a numbered "sheet" in a proof book: frame numbers, spec codes, and a grease-pencil review mark carry real information the way they would on an editor's actual proof sheet, not as decoration borrowed from the genre. The system explicitly rejects the video-editor-portfolio default (REC dot, running timecode, film grain, tally-light red on black) that the incumbent design used before this redesign — that look is the confirmed visual anti-reference.

The palette stays cool and desaturated at rest — off-white and near-black rather than cream and brown, closer to a film lab or print-production sheet than a warm lifestyle brand; the single rust accent is rare and functional; the display type is an italic serif with real editorial character rather than a system sans or an overused "safe" display face. Depth is expressed through material contrast (paper vs. near-black frame-void) and thin, deliberate borders rather than soft shadow.

**Key Characteristics:**
- Cool, desaturated off-white light-table paper as the constant ground, never pure white, pure black, or warm cream
- One accent color, used only where it marks something real (a link, an active state, a position indicator)
- Italic serif display type carries the personality; mono type carries data
- Frame/sheet numbering is real information architecture, not a decorative device
- Flat at rest; sharp/thin borders over soft shadow; shadows only appear as a functional response to interaction, and stay tight rather than diffuse

## Colors

Cool, desaturated, and restrained — one saturated rust accent against a near-monochrome field. Corrected from an earlier warm cream/brown iteration that read closer to an organic skincare or wellness brand than a production/archive tool — this palette deliberately drops that warm cast for a cinematic, technical, editorial-archive feel.

### Primary
- **Grease-Pencil Rust** (`#b74a32`): the only accent in the system. Marks real things only — the hero's accent phrase, the *current* nav tab (both its frame-number prefix and its underline, driven by scroll position via IntersectionObserver), the Processing Log's timeline markers (one per real employment entry), hover states on interactive rows, the light-bar position indicator. Clears 4.5:1 contrast against the paper ground at small text sizes. A finish-review pass found it applied unconditionally (not state-marking) on the logo wordmark, every nav prefix at rest, and every Processing Log date — all three were corrected to `--ink-dim`/`--ink-faint`; only the footer's "Processed" stamp keeps a standing, non-state-dependent use of the accent, as the system's one deliberate exception (a real stamp is a singular authenticating mark by nature).
- **Grease-Pencil Rust, Dim** (`#93392a`): the pressed/hover fill for the accent when it needs to sit *behind* light text (e.g. the card play-button hover fill), never used as a standalone accent.

### Neutral
- **Light-Table Paper** (`#e9e7e1`): the page ground throughout. Cool, desaturated off-white, never pure white and never warm cream — reads as illuminated paper on a cool light table, not a screen background or a lifestyle-brand backdrop.
- **Paper Shadow** (`#dcd9d1`): the recessed/hover tone for paper-ground rows (service list, contact list) — one step darker than the base paper, used only on `:hover`/`:focus-visible`.
- **Steel Dark** (`#26251f`): the light-bar's track color — the one place the system references the physical light-table hardware rather than the paper or the footage.
- **Ink** (`#171717`): primary text, borders, and the grid/card structural lines. Near-black, not pure `#000`.
- **Ink Dim** (`#676662`): secondary body text (descriptions, role copy, lede paragraphs).
- **Ink Faint** (`#57564f`): small mono labels only (frame numbers, spec codes, footer). Kept close in value to Ink Dim rather than lightened, specifically to clear 4.5:1 at the small sizes it's actually used at and to read crisp/technical rather than washed-out — never use a lighter faint tone for functional text.
- **Frame Void** (`#141412`): the background for any unloaded/placeholder video frame — the "no footage loaded yet" state, and the video modal/viewer stage backdrop.
- **On Dark** (`#f2f0eb`): light text/labels set on top of `--frame-void` or card thumbnails (frame numbers, play-icon color).

### Named Rules
**The One Mark Rule.** The rust accent appears only where it marks something real — an active link, a hover state, a position indicator. It never fills a large decorative area and never appears twice in the same place for emphasis alone. If you're reaching for the accent to make something "pop" rather than to mark a real state, don't.

**The Cool Neutral Rule.** Every neutral in the system (paper, ink, ink-dim, ink-faint) carries the same cool, desaturated undertone — never a warm cream/brown bias. A neutral that leans warm is off-system.

## Typography

**Display Font:** Alegreya (italic for the hero/branding/oversized numerals, upright Medium for section and item headings), with Georgia, serif fallback
**Body Font:** Hanken Grotesk, with ui-sans-serif, system-ui, sans-serif fallback
**Label/Mono Font:** Martian Mono, with ui-monospace, SF Mono, Menlo, monospace fallback

**Character:** An editorial serif with real italic character (not a training-data default like Playfair or Fraunces) paired with a clean humanist grotesque for reading text and a technical mono for data labels — the same three-role split a real photo/print publication would use for a title, a caption, and a spec sheet. Italic is deliberately scarce: it marks the hero, the logotype, and the oversized sheet numerals as the system's expressive voice, rather than being the default style of every heading.

### Hierarchy
- **Display** (500 weight, `clamp(2.6rem, 5.6vw, 4.6rem)`, 1.04 line-height, italic): the hero headline only. `-0.01em` letter-spacing.
- **Headline** (500 weight, `clamp(1.8rem–3.2rem)`, upright): every section's `h2` — "Featured Cut," "Selected Work," "Processing Log," "Spec Index," "Let's Work Together." Non-italic Alegreya Medium.
- **Item title** (500 weight, `1.05–1.1rem`, upright): project titles, job titles, service titles (`h3` inside cards, the processing log, and the spec index). Non-italic Alegreya Medium, same family as the headline for a consistent serif voice against the sans body copy.
- **Body** (400 weight, `1rem`, 1.6 line-height): lede copy, card descriptions, service/contact descriptions. Max-width capped around 54–56ch.
- **Label** (400 weight, `0.7–0.75rem`, uppercase, `0.04–0.08em` tracking, mono): frame numbers, spec codes, nav tabs, contact labels, footer. The floor for this role is 11px (`.7rem`) — nothing in the mono label role drops below it.

### Named Rules
**The 11px Floor Rule.** No functional mono label renders below `0.7rem` (11.2px) at the page's base 16px root. This was a real defect found and fixed during the finish review (22 instances were originally below the floor) — never reintroduce a sub-11px label size.

**The Scarce Italic Rule.** Italic Alegreya is reserved for the hero headline, the logotype/branding mark (spine mark, loader mark), and the oversized low-opacity sheet numerals (`--hero__num`, `--index__num`) — the system's expressive accent, not its default heading style. Every section heading and every item title (project/job/service titles, the contact heading) renders upright Alegreya Medium instead. If a section needs to feel quieter (like Contact), reduce its size and alignment, not its italic — there's no italic left to remove there in the first place.

## Layout

Sections are called "sheets," each a `.sheet` block with `max-width: 1440px`, centered, with `padding: clamp(4rem, 9vw, 7.5rem)` vertical and `clamp(1.25rem, 5vw, 3.5rem)` horizontal (the `--edge` token). Adjacent sheets are separated by a single hairline (`1px solid var(--line)`), never a background-color change to signal a new section — the paper ground stays constant across the whole page except for the deliberate per-section grade (see Elevation & Depth).

The work grid locks to a fixed column count — 4 columns desktop, 2 tablet (≤860px) — rather than a fluid `auto-fit`. This is deliberate: the grid holds exactly 8 real project cards, and 4/2/1 are the only column counts that divide 8 evenly with no trailing empty row. Any future addition to the grid should keep the total card count a multiple of the column count, or the column count should be revisited.

Each section varies its own composition rather than repeating one template: the hero is a single, large-scale typographic statement — no supporting imagery competing with it, proof of work starts in the Featured Cut and grid that follow; the work grid is a strict card grid, each card format-tagged (Commercial / Social & Beauty / Cinematic Brand Film / Motion Graphics / Longform) so range reads at a glance, not just in the hero's own claim; the experience section is a tabular "processing log" with its own left-margin timeline rule and marker per entry; the services section is a full-bleed row list with a giant low-opacity background numeral; the contact section is left-aligned and quieter than every section before it. No two sections share the same opener structure.

## Elevation & Depth

Flat by default. The system does not use ambient shadows anywhere — depth comes from material contrast (paper vs. `--frame-void`) and from the grid's own 1px hairline structure, not from blur. The one shadow in the system is a real, offset drop shadow under the light-bar's position indicator (`0 2px 5px rgba(20,15,8,.45)`) — a genuine cast shadow with vertical offset and blur, not a glow. A zero-offset colored halo was flagged and corrected during the finish review; never reintroduce one.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The only shadow in the system belongs to the light-bar indicator, and it always carries a real offset — never a symmetrical glow.

## Shapes

Square corners throughout — no border-radius on cards, frames, or containers, matching a real proof sheet or spec document's hard edges. The one exception is fully circular elements tied to a real physical referent: the loupe cursor, the play-button badge on each frame, and pill-shaped buttons (`border-radius: 99px`) on the hero CTA. Borders are always `1px solid var(--ink)` on structural containers (the grid, the viewer stage, the contact list) — never a color other than ink, and never wider than 1.5px even on the reel corner-bracket accents.

## Components

### Buttons
- **Shape:** pill (`border-radius: 99px`)
- **Primary:** transparent fill, `1.5px solid var(--ink)` border, ink text, mono uppercase label, `0.95rem 1.6rem` padding
- **Hover / Focus:** fills solid ink with paper text — a full invert, not a tint

### Cards / Containers
- **Corner Style:** square (no radius)
- **Background:** `--paper` (info panel) over `--frame-void` (thumbnail frame)
- **Shadow Strategy:** none — see Elevation & Depth
- **Border:** `1px solid var(--ink)` around the grid as a whole; hairline `var(--line)` between individual cards
- **Internal Padding:** `1.1rem 1.2rem 1.3rem` on the info panel
- **Format Tag:** each card's info panel carries a small mono `.card__format` label between the title and description (`Commercial`, `Social & Beauty`, `Cinematic Brand Film`, `Motion Graphics`, `Longform`) — real per-project classification, not decoration, and the mechanism that makes "range across formats" legible at a glance across the grid rather than only asserted once in the hero copy.

### Navigation
- **Style:** fixed "spine" bar, paper-toned gradient fading to transparent on scroll. Tabs are mono, uppercase, `0.75rem`, each prefixed by its real frame number (`01`, `02`...) via `data-frame` + `::before` — recognition through real indexing, not decoration.
- **States:** default `--ink-dim` with an `--ink-faint` frame-number prefix; hover/focus `--ink` with a growing 1px underline in `--ink`. **Current** (scroll-position-driven via IntersectionObserver, `.is-current`): frame-number prefix and underline both switch to `--grease` — the one legitimate standing use of the accent in navigation, because it marks a real state (where the visitor actually is), not decoration.
- **Mobile:** full-screen overlay panel, slide-in from the right.

### Loupe Cursor (signature component)
A circular magnifier (`120px`, `border: 2px solid var(--ink)`) that replaces the system cursor over project frames on hover-capable devices. It samples the hovered frame's own thumbnail at `280%` background-size, tracking mouse position within the frame's bounding box to simulate a real magnifying-glass pass over a proof sheet. Gated behind a `.js` class set as the first executable statement in `script.js`, so a JS failure falls back to the native pointer rather than hiding the cursor with nothing to replace it.

### Processing Log Timeline (signature component)
A single 1px `--line-strong` vertical rule runs the full height of `.log`, offset `1.75rem` left of the row content, with a small rotated-square marker in `--grease` at each row (`.log__row::before`) — one marker per real employment entry, not a decorative rhythm device. Distinguishes the Experience section's composition from the card grid and the row-list pattern used elsewhere.

### Spec Index Background Numeral (signature component)
A single giant italic Alegreya numeral (`clamp(9rem, 24vw, 20rem)`, `4%` opacity `--ink`) sits behind the Spec Index section, matching its sheet number (`05`). Purely typographic — no photographic or textured material — and the one place in the system where the display face is used at a size disconnected from actual reading.

## Do's and Don'ts

### Do:
- **Do** keep the grease accent (`#b74a32`) rare — active states, links, the light-bar indicator, the current nav tab. Nothing else.
- **Do** keep every functional label at or above `0.7rem` (11.2px).
- **Do** vary each new section's opening composition rather than repeating the same kicker-then-heading template — the system's whole point is refusing that repetition.
- **Do** keep the work grid's card count a multiple of its column count (4 desktop / 2 tablet) so the last row never leaves a trailing empty void.
- **Do** use real SVG line icons (`stroke="currentColor"`, `stroke-width: 1.5`) for any icon, matching the contact/service/play icon system.

### Don't:
- **Don't** add a second accent color. The system is built around exactly one.
- **Don't** use a symmetrical/zero-offset shadow anywhere — every shadow needs a real vertical offset.
- **Don't** use a Unicode glyph or emoji as an icon — draw it as an SVG matching the existing stroke weight.
- **Don't** set the hero headline, the logotype, or the oversized sheet numerals upright — italic is load-bearing to the system's voice there. Don't set a section heading or item title italic, either — that's the opposite mistake.
- **Don't** reintroduce timecode, REC-dot, film-grain, or scrubber-as-video-player motifs — that is the explicitly rejected prior world.
