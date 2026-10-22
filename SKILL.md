---
name: mascot-motion-director
description: Analyze an uploaded SVG mascot or illustrated logo, identify its character and expressive features from visual evidence, design a distinctive story-driven animation using the 12 principles of animation, and produce tested animated SVG, self-contained website embed, preview, and optional verified Lottie export. Use for mascot loops, expressive logo loaders, brand microinteractions, SVG character rigging, or animation direction from vector artwork.
license: MIT
metadata:
  author: "Open community starter"
  version: "1.0.0"
---

# Mascot Motion Director

Turn a **specific mascot** into a **specific performance**, not a generic logo bounce. The mascot's identity and available parts drive the action. Deliver a working animation asset, not only a storyboard or prompt.

## When activated

Input: one SVG file, optionally a PNG/reference and brand constraints. Default output: looping, web-embeddable, accessible vector animation for a brand loader. If the user names an action, preserve it. Never replace the source mascot with an invented mascot.

### 1. Inspect safely and form a grounded reading

1. Run `python scripts/inspect_svg.py path/to/mascot.svg --out mascot-report.json`. It inventories viewBox, colors, layer IDs, tracing complexity, and potentially unsafe elements. **This script does NOT recognize the depicted animal or character.**
2. Render the SVG to an image and actually **look at it** with a vision-capable model or available visual inspection tool. Use an SVG renderer if available; never infer a mascot solely from an ID like `owl-logo` or a filename. Record: depicted subject, confidence (0–1), observable evidence, expressive features, parts available to move, gaps/occlusions, geometry limitations, brand palette, emotional tone. Read [discovery guidance](references/visual-analysis-and-rigging.md).
3. If the environment cannot inspect pixels, distinguish file metadata from a visual claim. Request a preview/description when needed or deliver a generic, non-semantic motion study; don't hallucinate "it is an owl".
4. Check external references, `<script>`, event attributes, filters/images and dangerous constructs before embedding untrusted SVG. The builder refuses unsafe content; never defeat its guardrails by blindly stripping security warnings.

### 2. Pitch the right behavior, then plan

- First infer personality, affordances and a natural verb: owl + glasses → lower glasses, scrutinize; fox → ears perk and tail swish; robot → indicator boot, screen-eye focus; cat → curious blink, tail curl. Examples are *possibilities*, not hard-coded classifier rules.
- Plan a 2–5 second action with clear **anticipation → primary action → secondary reaction → hold → reset**. For idle loops use 2–3 subtly offset motions. Preserve recognizability in all poses, including rest and mid-loop.
- Use the **12 animation principles as an evaluation framework**, not 12 disconnected visual effects. Read [the 12-principles checklist](references/12-principles.md). Every principle needs an explicit application or an intentional N/A justified by brand tone; don't force cartoon squash onto a rigid wordmark.
- Derive timing in frames or milliseconds with meaningful holds. Eye darts can be fast, blinks very short, body floating slow and asynchronous. Separate independent actions into independent tracks/groups.

### 3. Rig without breaking the artwork

- Inspect the SVG DOM to find useful IDs/groups. IDs are structural clues, not semantic proof.
- Move only parts that can move anatomically or mechanically. Protect features that establish the mascot's identity. Reconstruct covered eyes or hidden parts **only if the reference/action requires them**, using source-compatible forms and colors.
- For auto-traced/flattened SVGs (many overlapping paths, few named groups), first create a clean layered derivative and compare it against the original. Do not pretend those 150+ paths are already riggable. Do not animate a random fill-color partition.
- **Critical: animate neutral wrapper `<g>` elements**, not a child that already has an SVG `transform`. Replacing the original transform can detach eyes and limbs from the face. The supplied compiler wraps targets to preserve existing geometry.
- Validate pivots in the current coordinate space, positions at multiple frames, occlusion and layering (glasses in front of eyes, eyebrows relative to eyelids). Avoid parts moving outside the visible head.

### 4. Make a machine-readable plan

Write a JSON motion plan following [the motion plan contract](references/motion-plan-format.md). Include:

- `subject`, `confidence`, observed `evidence`, and `tone` in `analysis`;
- `concept`, `story_beats` and explicit `principle_audit` (12 keys with `application` or `not_applicable_reason`);
- `duration_ms`, `loop`, and transform/opacity `tracks` targeting unique IDs in the cleaned SVG.

Tracks are keyframes with `at` in 0–100%, plus `translate`, `scale`, `rotate`, `opacity`, and optional `ease`. Use 0% and 100% matching transforms on seamless loops. Use separate target elements for different timing cycles. Use valid easing (`linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, or `cubic-bezier(...)`).

### 5. Compile an actual preview and web component

Run:

```sh
python scripts/build_preview.py clean-mascot.svg motion-plan.json --out-dir output
python scripts/validate_motion.py clean-mascot.svg motion-plan.json --out output/qa.json
```

Ship `output/animated.svg`, `output/preview.html`, `output/mascot-motion.js`, source SVG, JSON plan, and QA notes. The web component is self-contained; `<script defer src="mascot-motion.js"></script><mascot-motion mode="overlay"></mascot-motion>`. It supports `show()`, `hide()`, `pause()`, `play()`, `restart()` and `auto-hide="load"`. Preview in browser if a browser tool is available.

Important: this pipeline produces **animated SVG and a website component**, **not Bodymovin/Lottie JSON**. An animation plan `.json` is not a Lottie file. If the user explicitly requires Lottie, use a separate trusted conversion/authoring pipeline, validate in an actual Lottie renderer, and explain unsupported features. See [Lottie notes](references/exports-and-qa.md).

### 6. Test the performance before delivering

- Use browser screenshots at rest, anticipation, primary action, blink/secondary, return. Check eye/limb attachment, silhouette, legibility at 64px/128px, stroke consistency, and no clumsy pauses/jumps.
- Run the validator: no missing targets, duplicate target animations, out-of-range keyframes, missing 12-principle audit, malformed easing, mismatched loop ends or unsupported track properties.
- With `prefers-reduced-motion`, present a stable recognizable rest pose.
- Do **not** claim a visual test passed unless images were really inspected. Report any unresolved issues honestly.

## Result contract

Give the user: (1) one-sentence observed mascot identification with evidence and confidence/uncertainty; (2) distinctive action concept; (3) working preview; (4) embeddable asset; (5) editable clean SVG + motion plan; (6) concise QA report and what was/wasn't tested. Never substitute a concept sketch for a functional animated file.

## Start quickly (demo)

```sh
python scripts/inspect_svg.py assets/examples/robot.svg --out /tmp/robot-inspection.json
python scripts/validate_motion.py assets/examples/robot.svg assets/examples/robot-motion.json
python scripts/build_preview.py assets/examples/robot.svg assets/examples/robot-motion.json --out-dir /tmp/robot-output
```

This example is a *robot*, deliberately not the previous owl mascot. To run without native Agent Skills support, see `PROMPT_ONLY.md`.