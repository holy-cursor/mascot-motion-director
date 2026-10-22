# Contributing

Thanks for helping make mascot animation more expressive, reliable, and safe. This is both an **Agent Skill** and a small Python compiler. Contributions should improve real user outcomes, not merely add prompt length.

## Development setup

1. Fork and clone the repository.
2. Use **Python 3.10 or later**. No dependencies are required for core scripts.
3. Run the tests: `python -m unittest discover -s tests -p 'test_core.py' -v`.
4. Compile the sample: `python scripts/build_preview.py assets/examples/robot.svg assets/examples/robot-motion.json --out-dir demo-output`.
5. Open the preview in a browser and inspect the actual action. Run the optional Playwright smoke test when your change affects rendered CSS or controls.

## Pull request checklist

- [ ] Scope is clear, with a linked issue when appropriate.
- [ ] Both code and `SKILL.md` / references reflect any behavior change.
- [ ] New SVG manipulation is safe for existing `transform` attributes.
- [ ] Tests cover the edge case and pass on Python 3.10+.
- [ ] You inspected rest, anticipation, action, blink/secondary, and reset poses in a browser.
- [ ] All twelve principles are accounted for without adding gratuitous motion.
- [ ] Rebuilt parts retain the source mascot's recognizable identity.
- [ ] No third-party mascot artwork or other material is added without redistribution rights.
- [ ] README, CHANGELOG and examples are updated if users will notice the change.

## Code conventions

Keep core tooling standard-library only when practical, use explicit errors, avoid network requests in the compiler, and do not turn filenames or group IDs into a pretend animal-recognition classifier. Favor small scripts and documented motion-plan schemas. Don't disable SVG safety checks to make an unsafe asset compile.

## Issues and conduct

Use the bug/feature issue templates. Respect the [Code of Conduct](CODE_OF_CONDUCT.md). For vulnerabilities, use [private security reporting](SECURITY.md), not public issues.