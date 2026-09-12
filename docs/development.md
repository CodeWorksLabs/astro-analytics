# Development and verification

## Repository boundary

Reusable package source belongs in this repository. Site implementations belong
under `C:\CodeProjects\Sites`, and reusable Astro operating doctrine belongs
under `C:\CodeProjects\Platforms\Astro`.

## Install pinned development dependencies

```powershell
npm ci
```

The lockfile pins the development verification environment, including Astro,
Starlight, TypeScript, and Node type declarations.

## Run the complete local source gate

```powershell
npm run verify
```

This runs:

```powershell
npm run typecheck
npm test
```

The typecheck compiles package source, tests, and the real Astro/Starlight type
fixture without emitting files. The test suite exercises configuration, event,
Astro integration, Starlight wrapper, and hostile-global behavior.

## Inspect the package surface

```powershell
npm pack --dry-run
```

The package allowlist intentionally includes `src`, `docs`, and `CHANGELOG.md`;
npm also includes required metadata such as `package.json`, `README.md`, and
`LICENSE`. Including `docs` keeps links from the packaged README usable.
Repository governance, tests, checkpoints, and development fixtures must not
enter the package artifact.

The artifact intentionally contains Astro-native TypeScript source rather than
compiled JavaScript. Test both Astro loading and ordinary TypeScript resolution;
plain Node.js 22 import from `node_modules` is outside the current contract.

## Consumer qualification

Before release or site integration, qualify an exact tarball in clean stock Astro
and Starlight consumers. Bind the evidence to the package hash, consumer commit
and lockfile, generated runtime chunk, installed versions, and command results.

At minimum, run the consumer's clean install, production build, production-only
dependency audit, and hosting dry-run. A dry-run is not authorization to deploy.

## Current restrictions

The current working phase does not authorize commits, pushes, npm publication,
deployment, or authoritative site integration. See the repository checkpoint for
the exact candidate and review state.

Version choice and artifact qualification are separate from release authority.
See [Versioning and releases](versioning-and-releases.md).
