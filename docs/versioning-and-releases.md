# Versioning and releases

Analytics for Astro uses [Semantic Versioning 2.0.0](https://semver.org/) for
its npm package version. Astro does not define a different version-number
scheme for community integrations; its package guidance uses normal npm
metadata and publishing. The package version must therefore remain valid npm
SemVer.

Discourse-specific compatibility branches such as `d-compat/<YYYY>.<M>` do not
apply to this Astro package. Allowed Astro and Starlight versions are declared
independently in `peerDependencies`; tested compatibility is a narrower evidence
record and must be stated separately. The exact alpha.11 package completed clean
consumer qualification on September 13, 2026: Astro 7.3.2 and Starlight 0.42.0
with Astro 7.3.2, both on Node.js 22.22.2.
Starlight 0.41.11 with Astro 7.3.2 was qualified for alpha.3 on September 11,
2026; it remains peer-eligible, but that historical result is not current
alpha.12 execution evidence. Other versions admitted by the bounded peer ranges
are not yet compatibility claims.

## Current line

The current Milestone 2 candidate is `0.1.0-alpha.12`:

- `0.1.0` identifies the first pre-stable feature line.
- `alpha` states that the package is incomplete and not production-ready.
- `.12` identifies the doctrine-complete F1 correction: lifecycle fallback and
  `none`-mode reentry, virtual referrers, exact script/global provenance,
  non-destructive cleanup, and hardened sandbox receipt behavior. Exact-package
  consumer qualification and replacement review are pending.
- `.11` identifies the cross-provider correction that gives Fathom, Plausible,
  GA4, and Matomo the completion-identity behavior already established for
  Umami, and closes readiness when Astro navigation observation is unavailable.
  Its clean stock Astro and Starlight consumer gates passed; doctrine-complete
  review remains open.
- `.10` identifies the immutable source-tagged Umami same-URL correction. It
  completed its package, sandbox, browser-runtime, and provider-side live gates,
  but the later doctrine-complete readiness working review found the equivalent
  URL-only defect in the four older adapters. It is superseded and remains
  unpublished to npm.
- `.9` identifies the immutable source-tagged Umami adapter candidate. It
  passed those gates, but a later full committed review found that URL-only
  pageview deduplication suppressed genuine same-URL ClientRouter completions.
  It is superseded and remains unpublished to npm.
- `.8` identifies the reviewed and live-qualified Matomo adapter candidate;
  its public source tag is `v0.1.0-alpha.8`, while npm publication remains
  unauthorized and absent.
- `.7` identifies the published source tag for the corrected Google Analytics 4 adapter candidate whose
  `gtag()` queue follows Google's canonical `arguments`-object contract.
- `.6` is the superseded initial Google Analytics 4 adapter candidate built on
  the reviewed alpha.5 Fathom/Plausible multi-provider runtime.

The version in `package.json` identifies the intended candidate line; it does
not prove publication or release. While a version remains unpublished, exact
local tarballs are distinguished by their cryptographic hash and qualification
record.

## Increment rules

Before `1.0.0`:

- increment `alpha.N` for each changed immutable alpha release candidate;
- increment PATCH for compatible fixes to an established pre-stable feature
  line when a new prerelease phase is not needed;
- increment MINOR for a new feature line or a breaking public-contract change;
- use `beta.N` only when the feature set is complete and wider validation is the
  remaining work; and
- use `rc.N` only when the candidate is believed ready to become the matching
  stable version without planned feature changes.

After `1.0.0`, increment PATCH for backward-compatible fixes, MINOR for
backward-compatible features, and MAJOR for breaking public-contract changes.
Changes to exported entry points, configuration, runtime globals, event result
semantics, or supported peer-version ranges must be included in that decision.

## Release identity

An authorized release uses an annotated Git tag named `v<VERSION>` and a
matching GitHub Release. Never move or reuse a published tag or version. If a
prerelease candidate changes after release, assign the next numbered prerelease.

If npm publication is later authorized, publish alpha, beta, and release
candidate versions under a matching prerelease distribution tag rather than
`latest`. A stable version may use `latest` only after its complete release gate.

## Release gate

Choosing a version does not authorize a commit, tag, push, GitHub Release, npm
publication, site integration, or deployment. Before any release:

1. Freeze the exact candidate commit, tree, package version, tarball hash, and
   tarball member list.
2. Pass source verification and the independent code-review gate.
3. Qualify that exact tarball in clean stock Astro and Starlight consumers for
   every claimed supported major line.
4. Confirm package metadata, documentation, changelog, license, support range,
   and upgrade notes.
5. Confirm the merged tree, annotated tag, GitHub Release, and any published npm
   artifact all identify the accepted candidate.

The current `private: true` manifest is an additional fail-closed publication
guard. Removing it requires separate release authorization and review.

All five adapters completed earlier focused review, clean package-consumer,
repository-driven sandbox, browser-runtime, and provider-side live gates by
September 13, 2026. The later doctrine-complete readiness working review found
cross-provider completion-identity and observer-readiness defects, so those
earlier results remain historical evidence rather than an RC disposition.
Alpha.12 is the working correction. The line may advance to an RC only after its
exact package completes clean consumer qualification and simultaneous internal
and external review closes without a blocking disposition.

The package does not currently advertise the `astro-integration` discovery
keyword because `astro add` invokes a zero-argument default factory and this
integration requires explicit provider configuration. Add that keyword only
after automatic installation behavior is intentionally designed and qualified.
