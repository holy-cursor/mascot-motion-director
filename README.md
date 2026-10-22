# Mascot Motion Director

**An open Agent Skill that turns an SVG mascot into a character-specific, website-ready animation.**

[![CI](https://github.com/holy-cursor/mascot-motion-director/actions/workflows/test.yml/badge.svg)](https://github.com/holy-cursor/mascot-motion-director/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-compatible-6F5DFF)](https://agentskills.io/specification)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB)](https://www.python.org/)

<p align="center">
  <img src="assets/examples/robot-animation.gif" alt="Animated robot mascot: eyes scan and blink as the head tilts" width="360">
</p>

> An owl wearing glasses should *lower its glasses and inspect something*, not perform the same bounce as a robot, cat, or abstract logo. This skill teaches a vision-capable AI agent to **inspect, recognize, rig, animate, validate, and ship** the character you provide.

## What it actually does

| Stage | Behavior |
| --- | --- |
| **See** | Render and visually inspect the supplied SVG to identify the depicted mascot from visible evidence |
| **Inspect** | Inventory SVG geometry, colors, IDs, transforms, and signs of flattening or auto-tracing |
| **Reconstruct if needed** | Guide reconstruction into semantic layers: body, face, eyes, glasses, ears, tail, etc., preserving the original style |
| **Direct** | Design an action unique to the character using anticipation, staging, acting, follow-through and the **12 animation principles** |
| **Animate** | Compile an editable motion plan into animated SVG plus a dependency-free web component |
| **QA** | Check target IDs, timing, keyframes, seamless loops, transforms, reduced-motion support, and rendered frames |

**Scope matters:** Visual subject recognition and any nontrivial reconstruction are tasks performed by the **AI agent using the skill**, not by a magic Python image classifier or automatic rigger. `inspect_svg.py` reports structural facts, not species. This repository includes a tested compilation toolchain, not native Bodymovin/Lottie JSON export. See [limitations](#limitations-and-safety).

## Install

For skills-compatible coding agents, the easiest option is the [Skills CLI](https://www.skills.sh/docs):

```bash
npx skills add holy-cursor/mascot-motion-director
```

Choose the agent and scope when prompted. Requires a Node.js/npx environment for this convenience installer. Alternatively, clone this repository and copy the **whole folder** (including `SKILL.md`, `scripts/`, and `references/`) into your agent's skill directory:

| Agent | Typical project-level directory |
| --- | --- |
| Codex | `.agents/skills/mascot-motion-director/` |
| Claude Code | `.claude/skills/mascot-motion-director/` |
| Cursor | `.cursor/skills/mascot-motion-director/` |
| Gemini CLI | `.gemini/skills/mascot-motion-director/` |

Agent directories and supported features vary by product version; consult your agent's install instructions. In ordinary AI chats without the Agent Skills format, copy [PROMPT_ONLY.md](PROMPT_ONLY.md) and attach the SVG or a rendered preview. A model that cannot see images cannot confidently identify the mascot.

## Use it

Send a mascot SVG to your agent with a request such as:

> Use **mascot-motion-director** on `assets/owl.svg`. Identify the character from the visible artwork, reconstruct layers only where necessary, then make a polished looping loading animation using the 12 principles. Preserve the branding. Generate the source, motion plan, browser preview, and web embed. Check the eyes and accessories at multiple animation frames.

The agent should (1) report what it sees and its confidence, (2) explain the specific signature gesture, (3) rebuild riggable layers when required, (4) produce and compile a motion plan, (5) inspect animation frames, and (6) deliver the working assets and QA summary.

## Try the bundled example

**Requires Python 3.10+**. The core scripts use only the Python standard library. From this repository's root:

```bash
python scripts/inspect_svg.py assets/examples/robot.svg --out robot-inspection.json
python scripts/validate_motion.py assets/examples/robot.svg assets/examples/robot-motion.json
python scripts/build_preview.py assets/examples/robot.svg assets/examples/robot-motion.json --out-dir demo-output
python -m http.server 8000 --directory demo-output
```

Open **http://localhost:8000/preview.html**. You'll see the robot example and play, pause, restart, and full-screen preview controls. This example deliberately uses an original robot rather than including a third-party brand mascot.

The compiler outputs:

```text
demo-output/
├── animated.svg        # Animated vector SVG
├── mascot-motion.js    # Drop-in, framework-free website component
├── preview.html        # Interactive browser preview
└── qa.json             # Compiler/validator report
```

### Put the result on a website

Copy `mascot-motion.js` into your site's public assets directory:

```html
<script defer src="/mascot-motion.js"></script>
<mascot-motion
  mode="overlay"
  size="300"
  background="#f0f9f7"
  auto-hide="load"
  min-duration="900"
></mascot-motion>
```

For asynchronous data loading, **omit `auto-hide="load"`** and control the loader yourself:

```js
const loader = document.querySelector('mascot-motion');
loader.show();
// Complete the required work, then:
loader.hide();

// Also available: loader.pause(), loader.play(), loader.restart()
```

Use `<mascot-motion size="120"></mascot-motion>` for an inline animation. The component respects the user's reduced-motion preference.

## How reconstruction works

Many SVGs are exported as hundreds of unlabelled paths or a single compound shape. Moving random paths would break the character. The [rigging guide](references/visual-analysis-and-rigging.md) therefore specifies:

1. Render the original and identify **observable** parts and occlusion relationships.
2. Detect whether the SVG already has independently movable semantic groups.
3. If it does not, reconstruct an editable **clean layered SVG** from the reference, retaining silhouette, color, and distinctive features; disclose newly drawn hidden parts.
4. Put motion on **neutral wrapper groups**, leaving intrinsic SVG transforms intact. This prevents the detached-eye bug that happens when animation overrides geometry transforms.
5. Compare rest, action, blink, and return frames with the original. Keep eyes within the face and accessories attached.

**The Python compiler does not automatically rebuild flattened art.** The model or a designer must do the visual reconstruction first. On difficult files, a conservative whole-mascot motion is better than invented anatomy.

## The 12 principles (intentionally, not mechanically)

Every motion plan documents the 12 principles: squash and stretch; anticipation; staging; straight-ahead and pose-to-pose; follow-through and overlapping action; slow in/slow out; arcs; secondary action; timing; exaggeration; solid drawing; and appeal. Each needs a concrete application or a justified N/A. The validator checks **documentation and structure**, not aesthetics. Read the full [principles rubric](references/12-principles.md).

## Repository layout

```text
.
├── SKILL.md                     # Agent instructions and success criteria
├── PROMPT_ONLY.md              # Fallback for ordinary chat interfaces
├── scripts/
│   ├── inspect_svg.py           # SVG structural inspection; not an image classifier
│   ├── svg_utils.py             # Safer SVG loading
│   ├── validate_motion.py       # Structural and 12-principle audit
│   └── build_preview.py         # SVG + website component generator
├── references/                  # Rigging, motion plan, 12 principles, export QA
├── assets/examples/             # Licensed original example SVG, plan, GIF
├── tests/                       # Unit + optional Chromium browser checks
└── .github/                     # CI, issue templates, PR template
```

## Test and contribute

```bash
python -m unittest discover -s tests -p 'test_core.py' -v
```

Optional real-browser test (after building the example):

```bash
python -m pip install playwright
python -m playwright install chromium
python tests/browser_smoke.py
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for a contribution checklist, [SECURITY.md](SECURITY.md) for private vulnerability reporting, and [CHANGELOG.md](CHANGELOG.md) for releases.

## Limitations and safety

- Native Lottie/Bodymovin JSON output is **not** implemented here. Motion-plan JSON is **not** a Lottie animation.
- Character recognition needs rendered visual inspection, not just XML analysis; confidence should reflect ambiguity.
- Reconstruction is an instructed design step, **not** an automatic universal SVG-rigging engine.
- The SVG loader rejects many dangerous features, but arbitrary untrusted vector input still deserves review and sandboxing.
- Animation is aimed at modern browsers; performance, aesthetics and accessibility require final human review.
- Only use artwork you own or have rights to animate. This repository does **not** contain the Oerch owl artwork from the originating private project.

## License

[MIT](LICENSE) for the skill, scripts and original sample. User-provided mascot artwork retains its own rights.