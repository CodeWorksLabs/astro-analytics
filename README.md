# Astro Analytics

This repository contains `@codeworkslabs/astro-analytics`, a reusable
Astro analytics integration product made by CodeWorksLabs.

Status: experimental private development. The package is not yet published to
npm, and `private: true` prevents accidental publication while its API matures.
The code is MIT-licensed now so it can become public cleanly at the public-alpha
gate.

The package supports explicit provider configuration, environment-specific
enablement, bounded event queueing, safe custom endpoints, and a Starlight
wrapper. Package source, tests, and `package.json` live at this repository root.

Run verification with:

```powershell
npm test
```

Astro site implementations belong under `C:\CodeProjects\Sites`; reusable
Astro operating knowledge belongs under `C:\CodeProjects\Platforms\Astro`.
Working rules are in `AGENTS.md`; current recovery and handoff state is in
`SUCCESSOR_CHECKPOINT.md`.

The private development repository is
`https://github.com/CodeWorksLabs/astro-analytics`.
