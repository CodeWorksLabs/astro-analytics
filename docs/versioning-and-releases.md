# Versioning and releases

Analytics for Astro uses [Semantic Versioning 2.0.0](https://semver.org/).
Astro does not require a different version-number scheme for community
integrations. Astro and Starlight compatibility is declared separately through
bounded peer dependencies.

## Current version

The repository currently identifies `0.1.0-alpha.20`. It is an unpublished
development version with breaking contract cleanup:

- `providers` is the sole provider configuration input;
- `events` is boolean;
- the public package exports only implemented configuration, client, and
  Starlight contracts; and
- all five provider runtimes use shared lifecycle, location, script, and event
  infrastructure.

The version in `package.json` identifies source intent. It does not prove an npm
publication, Git tag, GitHub Release, deployment, or compatibility result.

## Increment rules

Before `1.0.0`:

- increment `alpha.N` for each changed alpha package candidate;
- move to `beta.N` only when the intended feature set is complete and wider
  validation is the remaining work;
- use `rc.N` only when no planned product change remains before the matching
  stable version; and
- increment the base minor or major version when the intended public contract
  requires it.

After `1.0.0`, use ordinary SemVer PATCH, MINOR, and MAJOR meaning. Changes to
entry points, configuration, runtime globals, result semantics, or peer ranges
are public-contract changes.

## Release identity

An authorized release uses an immutable annotated Git tag named `v<VERSION>`, a
matching GitHub Release, and—when authorized—a package with the same version.
Never move or reuse a published tag or version. Prereleases use the matching npm
distribution tag rather than `latest`.

The package currently retains `private: true`, so npm publication is disabled.
Changing that safeguard is a separate release action.

## Compatibility claims

Peer ranges state eligibility; they do not prove every admitted version was
tested. Release notes should name the exact Node, Astro, and Starlight versions
used for qualification. The package ships TypeScript source for Astro or another
TypeScript-aware build pipeline.
