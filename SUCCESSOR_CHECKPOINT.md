# Analytics for Astro Handoff

Updated: 2026-09-14

## Current product candidate

- Repository: `https://github.com/CodeWorksLabs/astro-analytics`
- Public product checkpoint before recovery cleanup:
  `c4680c80d0697271f505bdf6f43401811d527498`
- Alpha.19 content commit:
  `b7f81f7da106229dfa9112b8851788b69f46b88e`
- Version: `0.1.0-alpha.19`
- Exact package: 53,490 bytes
- Package SHA-256:
  `0ab90794159670cabbed0c7e974a722cd8254434d83f95b15286dd4366abaffa`
- Package members: 19
- Latest public tag: `v0.1.0-alpha.10`
- No Alpha.19 tag, GitHub release, npm publication, or deployment exists.
- The package remains marked `"private": true`.

The final pre-recovery product CI run `34894997885` passed at
`c4680c80d0697271f505bdf6f43401811d527498`. Earlier reports state that
typecheck and 161 tests passed. Those facts are evidence, not release
acceptance.

## Consumer and documentation candidates

- Astro sandbox: local commit
  `8077c3710a7d7d4c3b40cc87bf6497dbbb9eb00a`, one commit ahead of
  `origin/main`.
- Starlight sandbox: local commit
  `5a2725a0eb7c58e2337af2fa0d6297c1ace5600d`, one commit ahead of
  `origin/main`.
- Documentation: local commit
  `019d7bb562679c14e13b4bc91ee20649e501a46c`, three commits ahead of
  `origin/main`.
- The documentation history preserves the Brand Navigation correction as a
  distinct patch-equivalent commit
  `3adf18f85b13d92ee2a28e2c1cb70167fbb4519b`.
- None of these local candidates has been pushed or deployed.

## Live state

The live sites remain on the accepted Alpha.10 generation:

- Astro Worker: `0cfba6c1-dbe7-4b17-b96b-8d2cc7f9e23b`
- Starlight Worker: `6683e6fa-357d-43fa-acf8-6f3c19c7fac2`
- Documentation Worker: `609a49a8-0527-463e-a581-92188099ba0f`

All three public URLs returned HTTP 200 during the 2026-09-14 recovery
inventory. This does not qualify Alpha.19.

## Export state

The stopped Alpha.19 final export completed the product and Astro boundaries.
Starlight stopped during its final `astro check`; the documentation export
never began. F9 was not launched.

One verified Alpha.19 package and complete pre-cleanup repository histories are
preserved under:

`C:\CodeProjects\Archives\Astro Analytics Recovery\2026-09-14`

## Authority boundary

Specialized development owns local implementation, tests, documentation, and
packaging within the approved product boundary. It does not independently
change remote repositories, visibility or settings, branch/release strategy,
GitHub Apps or Actions architecture, credentials or secrets,
Cloudflare/provider configuration, deployment state, or product scope.

Each external or cross-lane action requires an exact assignment from Phil or
the designated end-to-end owner. “Proceed,” “finish,” lane ownership, access,
urgency, and technical necessity do not expand authority.

## Next action

Perform a direct technical assessment of Alpha.19 before further correction,
review, publication, push, or deployment. Determine what should be retained,
simplified, corrected, or discarded. Do not create Alpha.20 or restart F9 by
default.
