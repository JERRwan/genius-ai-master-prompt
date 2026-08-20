# BRIENNE AI — Design Directions

## Three distinct approaches

### 1. Field Instrument / Selected
**Very Brief Intro:** A calm, technical landing experience shaped like a premium field instrument: dark naval surfaces, precise calibration marks, warm ivory copy, and controlled safety-orange signals. It makes BRIENNE feel capable and trustworthy without relying on generic cyberpunk decoration.

**Probability:** 0.041

### 2. Quiet Intelligence Library
**Very Brief Intro:** An editorial, light-mode direction inspired by archival research rooms and annotated notebooks. It would frame BRIENNE as a reflective personal knowledge system with soft paper texture and structured typography.

**Probability:** 0.076

### 3. Signal After Dark
**Very Brief Intro:** A nocturnal data-network aesthetic that uses black surfaces, luminous cyan traces, and animated connection paths. It emphasizes the assistant's operational and systems-monitoring side.

**Probability:** 0.018

## Chosen approach: Field Instrument

### Design Movement

The direction draws from **mid-century aerospace instrumentation and contemporary technical editorial design**. It treats the landing page as a readable mission panel rather than a generic marketing template: quietly advanced, highly legible, and grounded in the user's operational control.

### Core Principles

1. **Command without spectacle:** Every visual signal earns its place by clarifying status, hierarchy, or intended action.
2. **Human control is visible:** Safety state, approval boundaries, and offline capability are primary product messages rather than small-print claims.
3. **Asymmetric composition:** A left-anchored narrative pairs with a right-side instrument surface, avoiding a centered, stacked SaaS layout.
4. **Material contrast:** Dense midnight surfaces, soft mineral panels, hairline calibration marks, and a single warm accent create depth without an overused neon treatment.

### Color Philosophy

The page uses **deep naval ink** as the primary field because it communicates focus and privacy. **Mineral ivory** provides breathable reading surfaces and practical contrast. **Signal orange** is reserved for human approval, active controls, and emergency state, making it ownable and semantically meaningful. A restrained **cold sky blue** supports ambient system indicators without becoming a glowing neon gradient.

### Layout Paradigm

The page is arranged as a **mission briefing strip**. A persistent top nav moves into an asymmetric hero with a reading column on the left and a floating assistant instrument panel on the right. Subsequent content alternates between broad narrative spans, offset status blocks, and a controlled demo workspace rather than repeating equal-width cards.

### Signature Elements

1. **Calibration rails:** Fine ruled lines, coordinate labels, and small node markers establish technical rhythm.
2. **The BRIENNE core:** A generated orbital emblem and concentric indicator motif recur in the hero, demo, and footer.
3. **Safety seals:** Small orange status seals label actions as “Human-approved,” “Local-first,” or “Review required.”

### Interaction Philosophy

Interactions simulate a deliberate assistant workflow. The live demo turns common requests into visible structured plans, asks for confirmation on medium and high-risk actions, and provides a prominent abort control. Links to Streamlit and GitHub are direct, while unavailable desktop-only functions are honestly labelled rather than imitated.

### Animation

The BRIENNE core breathes subtly through opacity and transform only. Calibration dots move in slow orbital sequences, and cards enter with short staggered fades. Buttons compress slightly on press and provide immediate textual feedback. All non-essential motion is disabled under `prefers-reduced-motion`.

### Typography System

**Space Grotesk** carries headlines and navigation, with wide tracking and firm upper-case labels. **IBM Plex Mono** carries status readouts, code commands, and coordinate captions. Body text is set in a high-legibility system sans stack. Hero headings scale dramatically but stay left aligned; data labels remain compact and never compete with primary copy.

### Brand Essence

**Positioning:** A local-first personal AI system for people who want capable assistance with visible safety boundaries and retained control.

**Personality:** Assured, meticulous, restrained.

### Brand Voice

Headlines are concise, decisive, and technically literate. CTAs name the resulting action rather than using generic language.

> “Intelligence that stays within your perimeter.”

> “Inspect the plan before the system moves.”

### Wordmark & Logo

The mark is an **abstract orbital shield**: three offset orbital arcs lock around a solid central point, suggesting cognition, scope, and human control. It contains no text so that it works as a favicon, a header mark, and a recognisable product symbol. The wordmark uses Space Grotesk with slightly expanded tracking, paired with a small monospace system designation.

### Signature Brand Color

**Approval Orange — #FF6B3D.** It appears only where the person remains decisively in the loop: safety controls, primary calls to action, selected approval states, and the emergency-stop control.

## Style Decisions

- The page uses Field Instrument styling throughout; avoid purple gradients, generic glass cards, centered hero stacks, and bright neon effects.
- The interactive demo is an honest client-side workflow simulation. It never claims to control applications, access Ollama, or inspect the user's system from the browser.
- Prominent visual areas use unique generated assets: an abstract field-instrument hero composition and an orbital shield logo.
- Copy avoids implementation-status phrasing; headlines use concise mission-control principles instead.
- The orbital shield / BRIENNE core is the primary recurring graphic. Constellation imagery remains subdued supporting texture only.
- Resources and footer retain calibration rails, coordinate labels, safety seals, and instrument-panel framing rather than reverting to generic marketing cards.
