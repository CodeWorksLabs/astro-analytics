# Analytics for Astro Handoff Checkpoint

Updated: 2026-09-14

## Active alpha.16 correction after F5 review — 2026-09-14

The internal F5 review was incomplete after a reviewer-created workspace
integrity event, but it established three P1 blockers before stopping: failed
or missing destination-prelude execution could disclose `cwl_journey` to all
five providers, both sandbox workflows retained the alpha.14 integrity value,
and the alpha.15 archive contained CRLF working-tree bytes rather than exact
canonical Git-tree bytes. It also found stale product and sandbox recovery
records. The external F5 turn ended after only a partial doctrine read and did
not issue a substantive disposition. No F5 PASS exists.

The reviewer's eleven exact untracked generated-doc files were removed after
their origin and paths were verified; no tracked product byte had changed. The
working product is now `0.1.0-alpha.16`. Its runtime remains byte-identical to
alpha.14. The new immutable candidate version records corrected shipped status
and will be packed from a clean Git export, with every package member verified
against the corresponding Git blob before either sandbox is rebound.

The grouped consumer correction replaces the fragile destination-head prelude
with an analytics-free handoff boundary, binds each workflow to one mechanically
verified artifact identity, and restores the complete documented local recovery
gate. Product, both consumers, and generated docs must then be committed and
frozen together, with sandboxes and docs remaining local because pushing each
repository's own `main` deploys its site.

Accepted Brand Navigation commit `e215ec8` remains the supplied boundary. Its
pipeline and content are not part of this correction and must not be reopened.

Next: complete the alpha.16 grouped correction, run exact clean-export package,
consumer, docs, and Wrangler dry-run gates, refresh all four checkpoints,
commit and push the product repository's own `main`, keep sandbox/docs commits
local, and launch a fresh identical simultaneous internal/external review. No
npm publication, tag, GitHub Release, sandbox/docs push, deployment, or provider
action is authorized.

## Historical doctrine-complete alpha.13 correction — 2026-09-13

The simultaneous F2 review of exact alpha.12 commit
`da6843ab0be4babc3886ddd5e48b0addd0325d4e` was blocking. Both reviews found
that Fathom reentry could accept substituted vendor state and that Fathom,
Plausible, and GA4 failure cleanup retained enough completion history to replay
a page captured before an observation gap. Additional findings covered Fathom's
empty-referrer fallback, same-URL in-flight live-state capture, partial setup
cleanup, sandbox feedback and receipt identity, repository CI, documentation
truth, and platform-dependent package bytes.

The working product is now `0.1.0-alpha.13`. It binds Fathom readiness to the
exact load-proven vendor object and methods, invalidates stale completion state
across Fathom/Plausible/GA4 failure gaps, waits through Fathom's
`astro:before-preparation`/`astro:page-load` boundary even when the URL is
unchanged, never supplies an explicit empty Fathom referrer, and cleans partial
Fathom listener/append setup before retry. Five focused regressions raise the
suite to 156 tests. Pinned product CI and an LF `.gitattributes` policy have
been added. The latest local product gate passed strict TypeScript, 156/156
tests, a zero-vulnerability production audit, diff checks, and the expected
19-member dry-run package surface.

The runtime, tests, package version, documentation, LF policy, and pinned CI
were committed and pushed to the product repository's own `main` as
`023835d35055bd3b7f7f380d3372cffbc301e29f`. A follow-up checkpoint commit
removes the two blank EOF lines reported during that commit and records this
handoff state. Product commit `a9c7d60b4eca51e6ce22aeede48283322b708f2b`
then corrected both pinned action identities against the authoritative v7.0.1
and v7.0.0 Git tags; the package payload was unchanged. This checkpoint-only
successor is the canonical product freeze. Next: pack a canonical tarball from a clean export of the final
checkpoint commit, prove member bytes against Git blobs, then bind that artifact
into both sandboxes. Correct the two
sandbox journey UIs and verification workflows, synchronize and correct the
documentation repository, run all local consumer gates, commit sandbox/docs
work locally without pushing it, and record the next exact multi-repository
freeze. Pushes to either sandbox repository's own `main` or the documentation
repository's own `main` trigger Cloudflare deployment and remain prohibited.
Do not deploy, publish to npm, create or move a tag, or create a GitHub Release.

After that freeze, launch the same doctrine mandate simultaneously with an
internal reviewer and the external Code Reviewer task. Iterate corrections,
commits, and product pushes until both reviews return a non-blocking
disposition.

Before documentation synchronization, the source was incorrectly changed to
claim that the public product repository was private. The F3 review confirmed
the contradiction against GitHub metadata; alpha.14 corrects the product source
before regenerating the public documentation snapshot.

The subsequent documentation pass also found alpha.12 status prose within the
shipped product guides. The final alpha.13 source replaces those stale labels
with durable qualification requirements. This is a package-byte change and
requires one final artifact regeneration and consumer rebind.

The first hosted CI executions exposed a defective bundled npm in GitHub's
Node.js 22.22.2 image (`promise-retry` was absent). Product commit
`debf4d244fcf0a3228839e1acbaefb84d396f778` activates pinned npm 11.12.1
through Node's bundled Corepack instead of asking the broken npm to overwrite
itself. GitHub Actions run `34802022578` then passed every workflow step. This
checkpoint-only successor is the final product identity for the next review
freeze; the 19-member package payload is unchanged from commit
`bf7982427937229746c39ed2c3594ba0810a328e`: 49,042 bytes, SHA-256
`36f213f7c7a4fbc06af29a3eaa1a837e64fadfc1fc475341c0224841d183b4ac`,
SHA-1 `2073f46d6a8a05815b26fd107a33f0b49b27285d`, and npm integrity
`sha512-+ciAGDmkC26bFqGFbdfIdKf6qOYTFZNFxr8qADY/TrR4TZnXBoug7zykRk+cpu3sCLmp/xoWQNdzANIMKEf83A==`.

## Historical doctrine-complete alpha.12 correction — 2026-09-13

The alpha.11 freeze received simultaneous internal and external
doctrine-complete review under `AFA-RC-READINESS-20260913-F1`. Both reviewers
blocked that freeze. The shared P1 findings covered event-only reentry sending
pageviews, inferred ClientRouter startup completions, stale GA4 title/referrer
context, insufficient proof at external script/global ownership boundaries, and
cleanup that could remove or overwrite unrelated page state. The external
review also identified sandbox receipt/bfcache handling, Starlight contrast,
stale published documentation, and mutable documentation inputs.

The working `0.1.0-alpha.12` correction is uncommitted at this checkpoint. It
removes synthetic ClientRouter startup completions, preserves exact completed
navigation identity and virtual-referrer context, keeps `pageviews: "none"`
event-only across matching reentry, and requires exact configured script and
load-generation evidence before Fathom, Plausible, GA4, or Matomo can become
ready. Cleanup now preserves unrelated scripts and globals. Deterministic public
runtime identifiers are explicitly non-secret coordination labels rather than
authentication credentials. Focused regressions raise the product suite from
146 to 151 tests; the latest complete product gate passed strict TypeScript and
151/151 tests.

Both sandbox repositories contain local, uncommitted receipt, storage-failure,
bfcache, and Starlight contrast corrections. Each passes `astro check` with no
diagnostics and a production build. They still consume the prior alpha.11
artifact and must not be committed as an alpha.12 freeze until rebound to the
exact packed alpha.12 artifact. The documentation repository still needs to be
synchronized from the eventual exact product commit and verified. Pushes to
each sandbox repository's own `main` and the documentation repository's own
`main` trigger Cloudflare deployments and remain prohibited in this review
cycle. Product commits and pushes are authorized. Do not deploy, publish to npm,
create or move a tag, or create a GitHub Release.

After completing all repository gates, record an exact F2 freeze and launch the
same doctrine mandate simultaneously with the internal reviewer and the Code
Reviewer task. Iterate corrections, commits, and product pushes until both
reviews return a non-blocking disposition.

## Historical doctrine-complete alpha.11 cycle — 2026-09-13

Phil commissioned the complete Code Review Doctrine workflow after clarifying
that earlier focused reviews are not sufficient for the RC gate. The working
review is `AFA-RC-READINESS-20260913-W1`. Its opening product identity was clean
`main`/`origin/main` commit `50a5135c51e1f4a1a7e46875f37d525f1c58d641`;
the two sandbox and docs repositories were likewise clean and synchronized.

The working review found one cross-provider P1 correctness family: Fathom,
Plausible, GA4, and Matomo used URL equality as completed-navigation identity,
unlike the corrected Umami adapter, and could suppress a genuine consecutive
`astro:page-load` completion at the same URL. It also found that Plausible and
GA4 could report ready after failing to install their Astro navigation observer,
while Fathom's recovery could infer a route across that observation gap. The
alpha.11 correction gives all five adapters completion
identity, preserves GA4/Matomo same-URL referrer and title context, and keeps
Fathom/Plausible/GA4 closed until observation is installed. Regression coverage
has increased from 140 to 146 tests. Product commit
`22a1119b0606599c73bcfcc0bd6361b4d916e7b1` passed the complete product gate;
its exact package then passed clean stock Astro and Starlight consumer gates.

Baseline before mutation passed 140/140 tests, strict typecheck, a deterministic
alpha.10 dry-run pack, and zero-vulnerability production audits in the product,
both sandboxes, and docs repository. The correction is still in progress:
reconcile the new consumer evidence into the shipped documentation, rebuild the
exact alpha.11 artifact, rebind both self-contained sandbox repositories and
synchronized docs, then record the new multi-repository freeze. Pushes to the
sandbox and docs repositories' own `main` branches are deployment triggers and
remain prohibited during this no-deployment review cycle. Only then launch the
identical doctrine-complete internal and external Code Reviewer reviews
simultaneously. Do not deploy, publish to npm, create a GitHub Release, or move
an existing tag during this cycle.

## Active alpha.10 correction — 2026-09-13

The immutable public `v0.1.0-alpha.9` tag remains at product commit
`43473be89dd9e29144c92f3ac0f6e6ab0776f104`. Both repository-driven sandboxes
and their self-hosted Umami records successfully qualified that exact candidate.
Afterward, a fresh full committed internal review found one P2: Umami used URL
equality as its pageview deduplication identity, so a legitimate consecutive
`astro:page-load` completion at the same URL was suppressed and its updated
title and route context were lost. Alpha.9 is therefore superseded; its tag must
not be moved or deleted, and its npm package was never published.

The working `0.1.0-alpha.10` correction gives every observed completion a
monotonic identity and deduplicates only reentry of that exact retained
completion. A direct regression fires consecutive `astro:page-load` events at
the same URL with a changed title and proves that both payloads are sent with
the appropriate completed-route context. The first alpha.10 internal review
then found that the newly sent second completion still inherited the older
route's referrer. That P2 is corrected: every observed completion now uses the
immediately preceding completed URL as its referrer, including when both URLs
are equal, and the regression asserts the exact `A → B → B` edge. The first
alpha.10 review artifact and freeze ledger are superseded. A second internal
pass then identified that the new documentation overclaimed this behavior for
completions observed before tracker readiness. That path intentionally retains
only the latest confirmed route and does not replay superseded history. The
claim is narrowed to post-readiness completions, and regression coverage now
proves both ready same-URL delivery and pre-ready same-URL coalescing with the
latest title and exact route edge. The R2 freeze is also superseded. At that
point the candidate was still uncommitted and untagged and required
fresh source gates, both independent reviews, exact-artifact consumer
qualification, sandbox deployment, browser-runtime qualification, and
provider-side verification. The subsequent results are recorded below.

Code Reviewer completed the R3 comprehensive source/static/execution/artifact
phase with 0 P0, 0 P1, 1 P2, and 0 P3 findings. Its P2 found that the
compatibility tables did not bind their “current” evidence explicitly to a
candidate and could therefore be read as pre-claiming alpha.10 qualification.
The finding was accepted. Both tables now identify the alpha.10 R3 artifact and
the September 13, 2026 qualification date.

Before that documentation correction, the exact R3 artifact (45,981 bytes,
SHA-256
`6101EED01D314BC3CEE5E322788E69E6775CB991803455204EC6C0A1DF88572F`)
was installed into fresh disposable clones under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha10-r3-consumers-20260913`.
Both installed exact version `0.1.0-alpha.10`, reported zero production
dependency vulnerabilities, completed production builds, emitted their
configured Umami runtime and website UUID, and passed Wrangler deployment
dry-runs without uploading. The Astro lock SHA-256 is
`5F448DE53318944A4E25DBF0D84FA97EC271CB47938414B061F254EDFE4DDCAC`;
the Starlight lock SHA-256 is
`070FBABA5BBA27CC07BC443A37248848AAE26FFACB90CDD21A65E245E9092307`.
The initial disposable Astro command ran from its parent directory and failed
before testing; it was replayed from the correct clone and passed. No canonical
repository was affected.

Because the P2 correction changes shipped documentation members, the R3 archive
is superseded as the prospective release artifact even though its runtime bytes
and consumer behavior remain applicable. The replacement R4 archive is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha10-r4-review-20260913\codeworkslabs-astro-analytics-0.1.0-alpha.10.tgz`

It contains the intended 19 members, is 46,103 bytes compressed / 222,319 bytes
unpacked, and has SHA-256
`6FF1B0809F463345577C50A918AF68A60AEABD788416EE2BEDD3D64EA629B565`.
Fresh disposable clones under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha10-r4-consumers-20260913`
installed that exact archive as version `0.1.0-alpha.10`. Both reported zero
production dependency vulnerabilities, completed production builds, and passed
Wrangler deployment dry-runs without uploading. Astro built three pages and has
lock SHA-256
`E980EF85BD16BF9DEF750D7A0B760C98362F5CCB749ED40E33DC3F463A35FC7D`.
Starlight built six pages, with only its expected empty-i18n and missing-404
warnings, and has lock SHA-256
`F6A6E98C1239A1AB0EB176988FB333C8E50887B3E0166FD9477E788F3AC5DD70`.
No canonical repository was affected. Localized internal and Code Reviewer
closure remain required before commit/tag or canonical sandbox mutation.

### Alpha.10 R4 replacement freeze

The product owner freezes R4 for localized closure of A10R3-01. Implementation,
shipped documentation, package inputs, the exact archive, both disposable
consumer inputs, and their recorded evidence are stable; editing has stopped and
no changes are queued. The base is public `main`/`origin/main` at
`e8829a0c4cf660f717a2f5bffac56dbc182d43d8`, with base tree
`3bf9a24c3922dea6e14aac73f08fe379d60abb04`. Twelve tracked files are modified,
zero files are staged, and zero files are untracked. The byte-preserving product
diff identity excluding this checkpoint is
`db155247ae046746ca1395549ff28ed7023fd6ef`.

The complete shipped R3-to-R4 archive-member delta is limited to
`docs/getting-started.md`, `docs/README.md`, and
`docs/versioning-and-releases.md`; package runtime, tests, manifest, lockfile,
and all other shipped members are byte-identical. The R3 consumer evidence is
the separately identified pre-correction run above. The R4 consumer evidence is
the replacement run and locks recorded immediately above.

The localized reviewer may inspect all source, archive, receipt, and generated
consumer evidence read-only. It may also rerun builds, audits, tests, archive
inspection, and Wrangler dry-runs in the declared disposable R4 consumer tree;
permitted incidental effects are disposable `node_modules`, build output,
caches, registry reads, and read-only GitHub fetches. Canonical repository
mutation, deployment, provider administration, commit, push, tag, GitHub
Release, and npm publication remain outside this freeze.

Code Reviewer then closed A10R3-01 on R4 with a census of 0 P0, 0 P1, 0 P2,
and 0 P3 and disposition `INTERNAL CODE REVIEW PASS`. It independently matched
all 12 declared source hashes, both Git diff identities, the 19-member archive,
the complete three-member R3-to-R4 archive delta, both consumer lineages and
locks, generated asset references, and the declared Astro 7.3.2 / Starlight
0.42.0 / Node 22.22.2 matrix. It freshly replayed both R4 production audits,
builds, and Wrangler dry-runs in the disposable consumers. This localized
closure is not a new comprehensive runtime or live/release acceptance.

### Alpha.10 R5 tag-stable documentation freeze

Before commit/tag, four shipped documents were made tag-state-neutral so the
act of creating the immutable source tag cannot immediately make its own package
documentation false. `README.md`, `docs/README.md`,
`docs/getting-started.md`, and `docs/versioning-and-releases.md` no longer call
the candidate “untagged” or leave the already completed R4 documentation review
pending. No runtime, test, manifest, lockfile, configuration contract, or
consumer input changed.

The exact R5 archive is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha10-r5-review-20260913\codeworkslabs-astro-analytics-0.1.0-alpha.10.tgz`

It contains the intended 19 members, is 46,002 bytes compressed / 222,181 bytes
unpacked, has SHA-256
`3B290C116721A1792FB8653064074FF06DABD81A322951F8B7921EE2769DA8FF`,
npm SHA-1 `9500AAF04B35C3FC2DD6CCB239CD19283C0F70C6`, and integrity
`sha512-P85JDEHeFEhorEISW47eOE78ivR++6aKtWw/xedl6SrojkaLliut9JaY3doS6A+v+g+bMyUWGXTumeWS8GLPbg==`.
Strict TypeScript checking, all 140 tests, full and production audits, and
`git diff --check` pass. R5 is frozen with editing stopped and no queued changes
for a final localized documentation/archive identity check. Canonical sandbox
mutation, commit, push, tag, GitHub Release, npm publication, provider
administration, and deployment have not occurred in this R5 preparation.

Code Reviewer completed the localized R5 check with 0 P0, 0 P1, 1 P2, and 1 P3.
A10R5-01 found that the tag-neutral status text called R4 only a “replacement
artifact,” allowing readers to misattribute R4's exact consumer qualification
to the distinct R5 archive. The corrected text names R4 and limits its relevance
for later documentation-only archives to unchanged runtime; exact acceptance is
reserved for source-tag archive installation. A10R5-02 found that the declared
R5 unpacked size was 38 bytes high. The corrected 19-member sum is 222,181
bytes; compressed size and cryptographic identities were already correct. R5 is
therefore superseded as documentation evidence, with runtime and other shipped
members unchanged.

### Alpha.10 R6 documentation correction freeze

R6 corrects A10R5-01 and A10R5-02 only. The R4 qualification is now named
explicitly in both affected shipped documents, later documentation-only archives
claim only unchanged-runtime relevance, and exact acceptance is reserved for the
source-tag archive installed by the repository-driven sandboxes. The R5 unpacked
size is corrected above.

The exact R6 archive is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha10-r6-review-20260913\codeworkslabs-astro-analytics-0.1.0-alpha.10.tgz`

It contains the intended 19 members, is 46,122 bytes compressed / 222,514 bytes
unpacked, has SHA-256
`38B0A09AA82BB6712FF18C72C6FCF82CD0190A6202E225023D7D81A3BEEF46E1`,
npm SHA-1 `9A0C3EF079BAB6A0C4F2C469FB9D80167CB9BD9F`, and integrity
`sha512-MamdgmY5gvwNN/r5OCcqhHcLfjZceQw4WR24pirXTN2aQtd8kQsQOCKDPPDlpwj92HwaXoaXJkIGyeLqslcCfA==`.
The complete R5-to-R6 shipped delta is exactly `docs/README.md` and
`docs/versioning-and-releases.md`; the other 17 members are byte-identical.
`git diff --check` passes. R6 is frozen with editing stopped and no queued
changes for localized closure of the two R5 documentation findings.

At the R6 freeze, the documentation-site repository contained prepared but
uncommitted alpha.9 source synchronization. Publication had been halted when the
P2 was found. The subsequent work below preserved that history, regenerated the
section from accepted alpha.10, and published it only after the applicable gates
closed. No npm publication or GitHub Release was authorized.

### Alpha.10 R6 closure, immutable tag, and live qualification

Code Reviewer completed the localized R6 closure of A10R5-01 and A10R5-02 with
0 P0, 0 P1, 0 P2, and 0 P3 and disposition `INTERNAL CODE REVIEW PASS`. The
separate visible internal review also completed with no actionable defect.
Strict TypeScript checking, all 140 tests, full and production audits, and diff
validation passed. No localized evidence gap remains.

The accepted R6 product was committed to this repository's `main` as
`06d8e3f4185a2509f1cdf155ae2d6b91b2ed245d` with tree
`09dff8b702c9ef17a74627944c2ae3afb07b39c4`, then pushed. Immutable annotated
tag `v0.1.0-alpha.10` has tag-object identity
`d0e8f42280e7c56b03dfaf683547bd2efa14b543` and resolves to that exact commit.
The archive freshly packed from a public clone of the tag is byte-identical to
R6. It has 19 members, is 46,122 bytes compressed / 222,514 bytes unpacked, and
retains SHA-256
`38B0A09AA82BB6712FF18C72C6FCF82CD0190A6202E225023D7D81A3BEEF46E1`, npm
SHA-1 `9A0C3EF079BAB6A0C4F2C469FB9D80167CB9BD9F`, and integrity
`sha512-MamdgmY5gvwNN/r5OCcqhHcLfjZceQw4WR24pirXTN2aQtd8kQsQOCKDPPDlpwj92HwaXoaXJkIGyeLqslcCfA==`.

Both canonical sandbox repositories installed that exact public tag archive and
passed clean install, production audit, production build, Wrangler dry-run, and
exact-tag identity checks. The Astro sandbox repository's `main` commit is
`f72d5878a33b98ea3fb4a0ae39f9bc00c1d76eb6`; GitHub run `34783356819`
passed and Cloudflare serves Worker version
`0cfba6c1-dbe7-4b17-b96b-8d2cc7f9e23b` at 100 percent. The stock Starlight
sandbox repository's `main` commit is
`c338beccce4938a044ab96e7c246ae6765b6457a`; GitHub run `34783361990`
passed and Cloudflare serves Worker version
`6683e6fa-357d-43fa-acf8-6f3c19c7fac2` at 100 percent.

Live browser verification on both sandboxes confirmed the intended Plausible,
Google Analytics 4, Matomo, and Umami scripts and identifiers. Each harness
reported Umami ready, accepted its explicit journey event, and advanced to the
destination. Both distinct self-hosted Umami website dashboards then displayed
the new `/analytics/` pageview, named journey event, and
`/analytics/next/` pageview in order. Plausible, GA4, and Matomo also accepted
the journey in that browser run. Fathom reported `adapter-not-loaded` in that
specific browser session; its previously completed dedicated sandbox/provider
qualification remains the applicable Fathom evidence and alpha.10 did not alter
the Fathom runtime.

The public documentation was regenerated from the pinned annotated alpha.10 tag.
Its sync validates tag type, exact commit, package version, and every source page
before writing, and can reproduce the section from a clean docs checkout without
a parent or sibling product checkout. The final docs review first found three P2
issues—partial writes on late validation failure, the external-checkout
dependency plus unproved tag type, and an event summary that omitted Umami. All
were corrected; failure atomicity, lightweight-tag rejection, clean-clone sync,
fresh install, zero-vulnerability production audit, 33-page build, Pagefind,
sitemap, Wrangler dry-run, diff validation, and final no-defect internal review
all passed.

Docs publication commit `e1bb02b4a3d7bac262afea1a00a94d4ac5b89caf` passed
GitHub run `34785042143` and deployed Cloudflare Worker version
`9b94a90d-5b84-429a-abeb-155a60864a76`. The follow-up evidence commit
`b52272735f6aa4f7a96c58784452f1b31e3fbb69` passed GitHub run
`34785145720`; Cloudflare serves resulting Worker version
`609a49a8-0527-463e-a581-92188099ba0f` at 100 percent. Live verification of
`https://docs.codeworkslabs.dev/analytics-for-astro/` confirmed the exact tag and
commit, all five providers, npm-unpublished status, complete ten-page menu,
sandbox qualification links, release notes, versioning guidance, and exact
ownership wording.

The first-stable feature set and all five provider adapter gates are now
satisfied. The next product action is a formal RC-readiness assessment, not an
automatic RC tag. npm publication and a GitHub Release remain absent and require
separate authorization.

## Current State

The independent product repository is
`C:\CodeProjects\Products\Astro Analytics`. Phil confirmed on 2026-09-12 that
Astro Analytics is developed in public and that `main` is its authoritative
integrated branch. The complete alpha.7 implementation originally preserved in
commit `6f6e1c0` and its subsequent documentation/checkpoint commits have been
fast-forwarded onto local `main` for the public-repository correction. The
temporary `codex/pre-rc` policy and private cross-repository build mechanism are
retired. Short-lived development branches may be used when useful, but they do
not replace `main` and are removed after integration. Tags, package publication,
GitHub Releases, and production-site integration remain separately controlled.

The source repository is public under the MIT license. The npm package remains
unpublished and retains `"private": true` as a publication safeguard until an
authorized package-release change. The current intended Milestone 2 candidate
version is the `0.1.0-alpha.10` source candidate described above.
It contains the five implemented providers, provider readiness and independent
result reporting, and the reviewed Astro/Starlight support boundary. Alpha.10
has completed clean artifact-consumer qualification and documentation closure;
repository-sandbox, browser-runtime, and provider-side gates remain before it
replaces superseded alpha.9. The package remains unpublished to npm.
Its canonical public remote is
`https://github.com/CodeWorksLabs/astro-analytics`.
The public-facing product title is now **Analytics for Astro**. The npm package
identifier remains `@codeworkslabs/astro-analytics`; no repository, directory,
remote, or package rename was performed.

## Alpha.5 Plausible and readiness candidate — 2026-09-11

After the live Astro sandbox correctly failed a fast event with
`adapter-not-loaded`, Phil confirmed proceeding to Plausible. The failure
revealed that the sandbox called a configured provider “ready” before its
external script had loaded. The working alpha.5 candidate therefore adds the
non-tracking `providerStatuses()` API and a `status()` method on the shared
browser client. Fathom reports `ready`, `adapter-not-loaded`, or
`consent-pending` from authenticated runtime state so operator controls can
remain disabled until actual adapter readiness.

The working Plausible adapter follows official documentation freshly checked on
2026-09-11: a site-specific `pa-*.js` script, the documented pre-load queue,
`plausible.init({ autoCapturePageviews: false })`, manual `pageview` calls from
Astro's post-swap lifecycle, and `plausible(name, { props })` custom events.
Optional endpoint and localhost settings flow through `init`; deferred/external
consent fails closed. Plausible's 30-property boundary is enforced per provider,
and generic numeric/boolean values are serialized to strings to match its
current custom-property type. Reentry deduplicates the runtime; occupied vendor
globals and setup/script failures fail closed and revoke owned partial state.

Final working-tree gates pass strict TypeScript checking, all 91 tests,
`git diff --check`, the complete dependency audit, and the production-only
audit. The thorough internal review and repeated closure passes found no
remaining actionable defect. In particular, Plausible terminal failures can
retry without deleting unrelated globals, including non-function replacement
failures and stale callbacks.

The exact final alpha.5 candidate artifact is
`C:\Users\Owner\AppData\Local\Temp\afa-m2-alpha5-final-20260911\codeworkslabs-astro-analytics-0.1.0-alpha.5.tgz`.
It is 30,641 bytes and has SHA-256
`48401dd55a32cc5793f4651371a7099cb4be1b227b1555839b6f34552611b68a`,
SHA-1 `4e92417367ef9e847f42a3e9b0aa3fbbf6ec03dd`, and integrity
`sha512-z8UjZIIzw4scjHayOO8Sq1gtI1xiGwt+Q9Qfq3xWuZoL6HzUWPfGUdU7/UonVXrvKCSwvKGgnBCjVKXaYqJypg==`.
Its 19-member package contents passed the dry-run gate.

That exact tarball installed as alpha.5 in three clean consumers under
`C:\Users\Owner\AppData\Local\Temp\afa-compat-alpha5-final-20260911`: stock
Astro 7.3.2, Starlight 0.41.11/Astro 7.3.2, and Starlight 0.42.0/Astro 7.3.2.
Every production audit found zero vulnerabilities and every production build
passed. The stock Astro fixture qualified simultaneous Fathom and Plausible
configuration; the Starlight fixtures qualified the supported wrapper range.

The Astro sandbox now vendors that exact alpha.5 artifact. Its journey uses
`providerStatuses()` and remains disabled until the selected event adapter is
actually ready. Fathom and Plausible are simultaneously configured, using the
supplied Plausible site-specific
`https://plausible.io/js/pa-vcAvq0UHdTBO2WXWvp6qy.js` script. The authorized
deployment is Worker version `702f57c6-f71a-470a-8afb-2bd45c920979`. Live HTTP
checks passed for the root, both journey routes, the unknown-route 404, and
blocking `robots.txt`. A clean in-app browser independently reported Fathom and
Plausible ready. One selected-Plausible journey advanced and displayed both
`Fathom accepted the event.` and `Plausible accepted the event.` The user's
Chrome profile kept Fathom blocked and correctly remained gated; it was not
treated as a package failure or bypassed. After Phil explicitly authorized the
Plausible account verification action, `I've installed it` advanced to the site
dashboard with the authoritative confirmation `🎉 Your first pageview has
landed!`. Phil then independently loaded the site in Firefox and reported the
Plausible realtime dashboard showing `1 current visitor`.

The stock Starlight sandbox was subsequently upgraded from alpha.2 to the same
exact alpha.5 artifact and configured with Fathom `FRMRGPFB` plus supplied
Plausible script
`https://plausible.io/js/pa-CBnNKxrJQtEjbu5PVs0LA.js`. Wrangler was advanced
from 4.130.0 to the non-major security-fixed 4.131.1 after the complete audit
identified its vulnerable bundled Miniflare/sharp chain. Complete and
production audits then reported zero vulnerabilities; the four-page Starlight
build, emitted-runtime inspection, Wrangler dry-run, and diff check passed.
Worker version `de6269e8-dbf1-4a5d-97db-5a61285491a8` is live. A clean browser
observed both owned vendor scripts connected with their exact identities. Live
route and blocking `robots.txt` checks passed. Plausible's installation screen
was confirmed after Phil's explicit authorization and advanced to the provider
dashboard with `🎉 Your first pageview has landed!`.

## Alpha.4 multi-provider candidate and sandbox qualification — 2026-09-11

Phil confirmed that simultaneous analytics sources are a normal product use
case. The public configuration now prefers ordered `providers`, rejects empty
or duplicate provider sets, and retains singular `provider` as deprecated
compatibility input. One authenticated coordinator owns the frozen browser
client; adapters register independently; `track()` fans out once and returns
an exact result for every configured provider. `configuredProviders()` exposes
the runtime order for diagnostics. Aggregate `ok` means every provider
accepted, while a common top-level reason is supplied only for generic failures
or when every provider fails identically.

A thorough read-only internal review found three issues and one closure-pass
documentation omission: validation initially occurred after fan-out, the old
`EventOptions` input had been removed without migration treatment, provider
failure typing admitted `disabled` although the coordinator did not, and the
new provider-failure type was absent from the API inventory. All four were
corrected. Event validation and copying now occur at the coordinator boundary
before any adapter receives input; direct multi-provider invalid-event coverage
proves that no handler is called. Deprecated `EventOptions` remains accepted as
enabled, queue-free compatibility input. Provider-level failures exclude the
generic `disabled` state. The closure review reported no remaining correctness,
security, fail-closed, or reentry defect.

Final source gates passed strict TypeScript checking, all 82 Node tests,
`git diff --check`, the complete dependency audit, the production-only audit,
and the 19-member package dry-run. The exact final candidate artifact is
`C:\Users\Owner\AppData\Local\Temp\afa-m2-alpha4-final-20260911\codeworkslabs-astro-analytics-0.1.0-alpha.4.tgz`.
It is 27,458 bytes and has SHA-256
`a7a14be4043495eeae5df9de098f2ba1301db5f1cab91666286285a53b0e4efe`,
SHA-1 `4c8ed6c71396fc67973ef2c047c114912b411d7b`, and integrity
`sha512-Xc8uOVqs0Zwktg+msZ/LaDc+q32SYRQ4cgei6adGJWRnJpyPXP0gXYKCmOzVS8VaR0PBLthR85CijXCYdT6P4Q==`.
The earlier `afa-m2-alpha4-gate-20260911` artifact predates the final docs
correction and is not the candidate to use. Frozen alpha.3 remains untouched.

The exact final alpha.4 tarball installed into three clean disposable consumers
under `C:\Users\Owner\AppData\Local\Temp\afa-compat-alpha4-final-20260911`:
stock Astro 7.3.2, Starlight 0.41.11/Astro 7.3.2, and Starlight 0.42.0/Astro
7.3.2. Every production audit was zero-vulnerability, every production build
passed, every installed package reported alpha.4, and every generated site
contained its configured Fathom ID. Lockfile SHA-256 values respectively are
`8f9420b205b69ecfc9c1fe2cd64d334103543e456e9f76dad282ec80abd52ff3`,
`f6b1a6d9ccdc73a65ff18f8de7f396e5f28f9cfccbd1dceed6506528a254e35a`,
and `8ca7293ccd1a8f395167d6f2f32ae10aacde1d98415e8956d5215a74cc819773`.

The Astro sandbox now vendors that exact alpha.4 artifact and uses plural
configuration. Its operator journey populates an adapter selector from
`configuredProviders()`, fans the event out to all configured providers, and
uses the selected adapter as the navigation success criterion. The destination
preserves and renders every provider outcome, including the explicit sentence
`Fathom accepted the event.` Local and live browser traversals both passed. The
authorized deployment is Worker version
`64688e90-ac31-4d5d-878d-ffc4e012fd74`; root, both journey routes, the 404, and
blocking `robots.txt` were verified. No commit, push, tag, release, or package
publication was performed.

## Continuity

Historical provenance from predecessor task
`019fa757-d158-7f23-877c-ded260c18f3e` was reconciled on 2026-09-08. The former
workspace `C:\CodeProjects\CodeWorksLabs\Astro\astro-development` no longer
exists. Historical outer-repository commits `ec16194` and `9bb583a`, the old
untracked-package status, its lack of a remote, and its ownership/patch-probe
history belong only to that obsolete workspace.

The current independent repository contains all implementation paths named in
the predecessor handoff. Before correction, `src/config.ts` exactly matched the
historical 5,664-byte Git blob
`813a728e78cd6cdeffd2a239f8d1d565d5e494ad`; other predecessor files had no
recorded hashes, so their byte identity could not be proven.

## Authorized Correction Candidate

The uncommitted candidate now:

- validates root, environment, provider, consent, pageview, boolean, URL,
  provider-config, and extra-field behavior strictly at runtime;
- rejects unknown, null, nonobject, malformed, symbol-keyed, and unsupported
  configuration branches;
- removes event queue configuration and claims;
- makes `events` an exact boolean opt-in and injects no event global when it is
  false or omitted;
- bounds event names, property counts, key/string lengths, property values, and
  `TrackResult` values;
- guards SSR, missing and malformed globals, hostile getters/proxies, throwing
  client functions, and invalid client returns;
- executes a newly created frozen, branded, exact-shape bootstrap client through the
  single `astroAnalytics` reserved global, including repeat execution, state
  mismatches, hostile accessors, and accepting/rejecting proxy cases; and
- compiles against real Astro and Starlight exported types rather than a local
  hand-declared Starlight shape.

The 2026-09-10 review identified three P1 defects in the preceding frozen
candidate. The current replacement candidate addresses all three as one bounded
correction batch:

- `TrackResult` fields are read once and copied only after exact-key and
  exact-value validation, preventing changing getters from escaping the declared
  result union;
- bootstrap installation now uses one reserved global, so accepting or rejecting
  an installation cannot strand a marker/client pair in a partial state; and
- all record-shaped configuration branches and event property bags reject
  branded/non-record objects while retaining ordinary and null-prototype
  records.

Review `AFA-M1-C1-2026-09-10` produced conflicting results: the separate Code
Reviewer issued PASS, while the in-task internal review reproduced two
additional P1 hostile-global cases. The stricter result controlled continued
engineering. The C2 attempt added a self-referential root predicate, but both C2
reviews then independently showed that an attacker-controlled Proxy could forge
that predicate, accept the first of two writes, reject the second, and reject
rollback. C2 was blocked and superseded.

The C3 candidate removed the impossible two-global transaction. Client
reentry was initially detected through the frozen, exact-shape, branded
`astroAnalytics` object itself. Bootstrap performed at most one reserved
global definition and never reads, creates, replaces, or removes the former
`__astroAnalyticsRuntime` marker. Tests cover a self-referential Proxy that
accepts the single definition and one that rejects it: the first ends with a
complete owned client, the second preserves the original client, and both
preserve any unrelated legacy marker.

The separate Code Reviewer PASSed C3, but the in-task internal review reproduced
a further P1: an ordinary preexisting frozen object could copy the public brand
and exact shape, causing bootstrap to preserve its substituted `track()` method
as supposedly package-owned. The stricter result controlled. C4 removes the
ownership predicate entirely. The public brand is descriptive metadata, not an
authentication credential; every bootstrap execution installs a newly created
fallback whenever the sole reserved property is safely replaceable. Tests now
prove that repeat execution and an exact frozen public-brand forgery are both
replaced. C3 is superseded.

No vendor adapter, vendor script, external analytics request, real analytics
identifier, demo, or site-specific integration was added.

## Compatibility Evidence

Compatibility information was freshly verified on 2026-09-09 against official
Astro and Starlight documentation and their published packages:

- Astro `7.3.2`: `AstroIntegration`, `astro:config:setup`, command values, and
  `injectScript("page", ...)`.
- Starlight `0.42.0`: `StarlightPlugin`, `config:setup`, and `addIntegration()`.
- TypeScript is pinned to `5.9.3`; Astro 7.3.2's declarations did not compile
  under the newly published TypeScript 7.0.2 during the first gate attempt.

Official sources:

- `https://docs.astro.build/en/reference/integrations-reference/`
- `https://starlight.astro.build/reference/plugins/`
- `https://www.npmjs.com/package/astro`
- `https://www.npmjs.com/package/@astrojs/starlight`

## Verification

Fresh result on 2026-09-10:

- `npm run typecheck`: passed using `tsc --noEmit --project tsconfig.json`.
- `npm test`: 36 tests passed, 0 failed.
- `npm run verify`: passed.
- `git diff --check`: passed; only Git's expected LF-to-CRLF working-tree
  conversion warnings were emitted.
- An internal uncommitted-change review on 2026-09-09 found two P2 issues:
  non-atomic bootstrap ordering and a Node engine-floor mismatch. The temporary
  Node `>=22.19.0` floor was later found to reflect development-only tooling and
  has been restored to the existing consumer contract of `>=22.18.0`. The
  intermediate sentinel-first correction was superseded by the C3 single-global
  design.
- Historical internal advisory reviews that reported no actionable defects were
  superseded on 2026-09-10. Review `AFA-M1-2026-09-10` independently reproduced
  P1 defects AFA-01 (changing result getter), AFA-02 (non-atomic bootstrap), and
  AFA-03 (malformed-record acceptance). A separate in-task internal review also
  reproduced AFA-02. Both reviews BLOCKED the preceding exact candidate; neither
  disposition carries forward to this corrected replacement candidate.
- Disposable local builds outside all repositories passed through the package's
  declared exports with Astro `7.3.2` directly and Starlight `0.42.0` on Astro
  `7.3.2`. Both generated outputs contained the injected, bundled bootstrap.
  Dependencies were installed offline from the local npm cache using synthetic
  identifiers. The disposable fixture and its generated state were removed.
- Historical C4 package-artifact record, superseded by the documentation
  artifacts below: `npm pack` initially exposed an unintended publication surface containing
  repository governance, checkpoint, test, and typecheck files. A package
  `files` allowlist now limits the tarball to `src` plus npm's required package
  metadata. The C4 replacement tarball contains 9 files, is 7,085 bytes packed,
  has SHA-1 `19b41d6fdffac813c326e20e3d076fa442ef0788`, SHA-256
  `6b556c8838d64c44a61c7b641f0dea25ec58295f456a1dc14705899cf0dc932c`,
  and integrity
  `sha512-dCSH3LU0yigaaVoPa4s3fJs0mIzSMFSnUVK2Bif4LarTIPAEpAmDF45A/izg1606J3eElzDGpLwNbl9sbW+3MA==`.
- Fresh clones of the authoritative stock sandbox repositories were exercised
  only in a disposable directory. The exact tarball installed successfully in
  both, `npm ci` reproduced both installs, stock Astro and stock Starlight builds
  passed, and both Wrangler `deploy --dry-run` checks passed. The generated
  C4 outputs contained `astro-analytics:client:v1`, contained no obsolete
  runtime sentinel, and contained no synthetic
  measurement ID or Google Analytics, Plausible, or Fathom vendor URL. Both
  `npm audit --omit=dev` checks reported zero vulnerabilities. Starlight emitted
  its pre-existing empty-i18n/missing-404 content warnings but completed.
- The authoritative sandbox repositories, their working directories, and their
  live Cloudflare Workers were not modified or deployed. The active disposable
  evidence directories are
  `C:\Users\Owner\AppData\Local\Temp\analytics-for-astro-integration-20260910-103704`
  and
  `C:\Users\Owner\AppData\Local\Temp\analytics-for-astro-integration-20260910-1744`.
  Both are newly created disposable state. Cleanup was attempted only after
  verifying that both resolved beneath `%TEMP%` and no child process remained,
  but the execution policy rejected recursive deletion before it ran; both
  directories therefore remain as identified residue.
- A fresh replacement-candidate run used disposable root
  `C:\Users\Owner\AppData\Local\Temp\analytics-for-astro-correction-20260910-1902`.
  Fresh clones of both stock sandbox repositories installed the replacement
  tarball. Astro 7.3.2 and Starlight 0.42.0/Astro 7.3.2 builds passed; both
  generated outputs contained the runtime sentinel; both production-only audits
  reported zero vulnerabilities; and both Wrangler dry runs passed. The initial
  Starlight fixture mistakenly placed the Starlight plugin in Astro's top-level
  integration list, producing no sentinel; the disposable fixture was corrected
  to use Starlight's `plugins` option and the complete Starlight evidence was
  replayed successfully. No authoritative site or repository was changed.
- The follow-up hostile-root correction was rebound in disposable root
  `C:\Users\Owner\AppData\Local\Temp\analytics-for-astro-correction-c2-20260910-1931`.
  Both stock consumers freshly installed the new tarball, built successfully,
  produced a runtime-bearing chunk, passed `npm audit --omit=dev` with zero
  vulnerabilities, and passed Wrangler dry runs. Astro's runtime chunk SHA-256
  is `881bf7e6b64ae39bd97c047af7bd3c6829875128563fafff6812ee19ba6e9adb`;
  Starlight's is
  `46dedc129f066460743abbe4d447dc1b52495e0a2680652d0b0784574d05c7f6`.
  This C2 evidence is retained historical evidence for the blocked candidate.
- The C3 single-global candidate was rebound in disposable root
  `C:\Users\Owner\AppData\Local\Temp\analytics-for-astro-correction-c3-20260910-2010`.
  Fresh clones of both stock sandbox repositories installed the exact C3
  tarball and reproduced it with `npm ci --offline`. Astro 7.3.2 and Starlight
  0.42.0/Astro 7.3.2 production builds passed; both production-only audits found
  zero vulnerabilities; and both Wrangler 4.130.0 dry runs passed. Output
  censuses found one branded runtime chunk in each consumer, no obsolete
  sentinel, no synthetic identifier, and no vendor URL. Astro's chunk is
  `_astro/page.BFQGBTyi.js`, SHA-256
  `4b72da0b4fc0c81903dca24482e57b6b974b84ee1505a3ae202076f7ecddf609`;
  Starlight's is `_astro/page.fTamEBXb.js`, SHA-256
  `05c2fb47f8c943abe469e8cc6bec21f0fb7ca659b179d1233aa31ae0d483c725`.
- A managed local browser loaded the exact C3 Astro chunk through retained probe
  `astro/dist/probe.html`, SHA-256
  `7cc43814583a214387270286989cd8251ee9edb093cdbcb54131bde7a0c01c90`.
  It reported client brand `astro-analytics:client:v1`, frozen state, exact keys
  `__astroAnalyticsBrand` and `track`, fallback result
  `{ ok: false, reason: "adapter-not-loaded" }`, and no own
  `__astroAnalyticsRuntime` property. The temporary browser tab and local server
  were closed; port 4393 was confirmed not listening. The evidence root and
  browser-profile residue remain under the identified C3 disposable root.
  This C3 evidence is retained historical evidence for the superseded candidate.
- The C4 no-trust candidate was rebound in disposable root
  `C:\Users\Owner\AppData\Local\Temp\analytics-for-astro-correction-c4-20260910-2020`.
  Fresh stock clones installed the exact C4 tarball, reproduced it with
  `npm ci --offline`, built with Astro 7.3.2 and Starlight 0.42.0/Astro 7.3.2,
  passed both production-only audits with zero vulnerabilities, and passed both
  Wrangler 4.130.0 dry runs. Output censuses found the client brand in one chunk
  per consumer, with no obsolete sentinel, synthetic identifier, vendor URL, or
  removed ownership-predicate code. Astro's chunk is
  `_astro/page.DP18WvGC.js`, SHA-256
  `b6462c9b7de0bf79528ae7f749d049b8d15f2296b8ab49685a116dec9abea20a`;
  Starlight's is `_astro/page.CWx1SGOW.js`, SHA-256
  `45c1d553ceb2c479c421e9e9c9798ba3ed7fecf9e568c921e6d7e01ae6975326`.
- The managed local browser loaded that exact C4 Astro chunk after the retained
  probe installed an exact frozen public-brand forgery. It reported
  `forgedClientReplaced: true`, the expected brand, frozen state, exact two-key
  shape, `{ ok: false, reason: "adapter-not-loaded" }`, and no obsolete sentinel.
  The temporary tab and local server were closed; port 4394 was confirmed not
  listening. The C4 probe SHA-256 is
  `84830b4bb6524fce3d2abeeab51311a3c440c3398bbab550e3bd42788b355cee`.

Exact candidate path inventory:

- Modified: `README.md`, `SUCCESSOR_CHECKPOINT.md`, `package.json`,
  `src/adapters/types.ts`, `src/config.ts`, `src/events.ts`, `src/index.ts`,
  `src/runtime.ts`, `src/starlight/index.ts`, `test/config.test.ts`,
  `test/integration.test.ts`, and `test/starlight.test.ts`.
- Added and untracked: `CHANGELOG.md`, `docs/README.md`,
  `docs/api-reference.md`, `docs/configuration.md`, `docs/development.md`, `docs/events.md`,
  `docs/getting-started.md`, `docs/runtime-and-safety.md`,
  `docs/starlight.md`, `docs/versioning-and-releases.md`, `package-lock.json`,
  `test/events.test.ts`, `tsconfig.json`, and `typecheck/astro-starlight.ts`.
- Staged: none.

## Documentation and Versioning Phase

On 2026-09-10, after the C4 implementation passed both the in-task internal
review and the separate doctrine-complete Code Reviewer gate, a repository-native
documentation set was added. It covers getting started, complete configuration,
the event client, Starlight use, runtime and safety guarantees, development and
verification, and versioning and releases. The README now leads with the
Milestone 1 limitation that no vendor is loaded and no analytics data is sent.

Current Astro documentation was freshly checked on 2026-09-10. Astro prescribes
ordinary npm package metadata for community integrations and does not define a
special integration version format. npm requires a valid SemVer package version.
The local CodeWorksLabs precedents were also compared: DiscussionBridge uses
numbered SemVer alpha identifiers, while Brand Navigation uses normal SemVer and
numbered release candidates plus Discourse-specific compatibility branches.
Only the general SemVer practice applies here; Discourse compatibility branches
do not.

The package and lockfile now identify `0.1.0-alpha.1` as the first Milestone 1
candidate. This is a candidate identity, not a release claim. The documented
policy uses immutable `v<VERSION>` tags and matching GitHub Releases only after
separate authorization; changed released prereleases receive the next numbered
identifier. The `private: true` publication guard remains in place.

The package allowlist now includes `src`, `docs`, and `CHANGELOG.md`. A dry-run
for `@codeworkslabs/astro-analytics@0.1.0-alpha.1` contains 18 members, is 13,730
bytes packed and 46,240 bytes unpacked, has SHA-1
`a95f5a4a1aaca0e3d2af756e42911bb189775174`, and npm integrity
`sha512-q8MVVkBTsxA/F23fMrw2tP9Oc+oL6R5ecTsut/iN4jCjWed1RX7SgBYk3Ua4lPr8tAMB5qdQwxQQXIDn1M+0KQ==`.
It includes the usable package documentation and excludes tests, typecheck
fixtures, governance, and this checkpoint. All local links in the ten current
Markdown files resolve. `npm run verify` still passes strict typecheck and all
36 tests.

That first documentation artifact is superseded. Composite review
`AFA-DOCS-2026-09-10` issued PASS WITH P2/P3 FINDINGS on its exact bytes and
identified five correction properties: explain build-time rather than runtime
preview policy; separate peer eligibility from demonstrated compatibility;
correct the configurable/non-writable descriptor rule; inventory all exported
API; and disclose the Astro-native TypeScript consumption boundary. The in-task
review also reproduced `TS5097` when an ordinary TypeScript consumer encountered
the package's explicit relative `.ts` specifiers, despite issuing a no-actionable
conclusion. The concrete failure controlled the correction decision.

The corrected source package uses private package import maps for its internal
TypeScript modules. This retains Astro-native TypeScript publication while
allowing a normal strict NodeNext TypeScript consumer to resolve the package
without `allowImportingTsExtensions`. Direct native Node 22 import from
`node_modules` remains explicitly outside Milestone 1. The docs now state the
preview/build boundary, the exact qualified consumer matrix, the corrected
descriptor behavior, the complete API inventory, and the source-TypeScript
toolchain requirement. The `astro-integration` discovery keyword was removed
because `astro add` invokes a zero-argument factory while this package currently
requires explicit provider configuration.

Correction qualification used disposable root
`C:\Users\Owner\AppData\Local\Temp\analytics-for-astro-docs-c2-20260910-141444`.
An ordinary strict TypeScript 5.9.3 NodeNext consumer installed the exact
correction tarball and passed without `allowImportingTsExtensions`. Fresh
disposable copies of the stock CodeWorksLabs Astro and Starlight sandboxes
installed that tarball, reproduced their installs with `npm ci --offline`, and
passed production builds, production-only audits with zero vulnerabilities, and
Wrangler 4.130.0 dry runs. Starlight emitted only its pre-existing empty-i18n and
missing-404 warnings. Generated runtime chunks are byte-identical to C4: Astro
`_astro/page.DP18WvGC.js` SHA-256
`b6462c9b7de0bf79528ae7f749d049b8d15f2296b8ab49685a116dec9abea20a` and
Starlight `_astro/page.CWx1SGOW.js` SHA-256
`45c1d553ceb2c479c421e9e9c9798ba3ed7fecf9e568c921e6d7e01ae6975326`.
Neither output contains the synthetic qualification ID, a vendor URL, or the
obsolete sentinel. No authoritative sandbox tree or live Worker was changed.

Separate correction review `AFA-DOCS-C1-2026-09-10` passed the C3 artifact and
closed all five earlier documentation findings without adding a new finding.
The subsequent in-task review raised one useful documentation ambiguity: event
input validation actually precedes environment/client lookup, so a malformed SSR
call returns `invalid-event`, not `disabled`. That ordering is deliberate and is
now stated in `docs/events.md` and regression-locked in `test/events.test.ts`.
Its other observation misread a clearly historical C4 artifact record as the
current artifact; the historical label has nevertheless been made more explicit.

The current replacement documentation candidate tarball is
`C:\Users\Owner\AppData\Local\Temp\analytics-for-astro-docs-c4-20260910-143934\codeworkslabs-astro-analytics-0.1.0-alpha.1.tgz`.
It contains 19 members, is 15,620 bytes packed and 52,245 bytes unpacked, has
SHA-256 `8b702c40feabd5d75fe22af89263053b09b84579483c7894d2e71d60cab7a7ad`,
SHA-1 `00ecc1aeb334f8a9f0216548315dcfb87dc0b1b7`, and integrity
`sha512-Dn28HEzupPto6tl6ah71SSAmFZdK59v6uTfD1cyKxr/fiVBk7buO9joyhTMFEDANQGh1mfbpJ1DwjW1TWq3x4w==`.
It was installed over the disposable ordinary TypeScript consumer; strict
typecheck passed and npm reported zero vulnerabilities. All 13 repository
Markdown files pass relative-link checking. The repository gate passes strict
typecheck and 36/36 tests, and `git diff --check` passes with only expected
LF/CRLF notices.

Official sources checked:

- `https://docs.astro.build/en/guides/integrations/#publishing-your-integration-to-npm`
- `https://docs.astro.build/en/reference/integrations-reference/#allow-installation-with-astro-add`
- `https://docs.npmjs.com/cli/v8/configuring-npm/package-json/#version`

## Review Disposition and Next Work

The visible in-task `codex review --uncommitted` completed with no actionable
defects. It independently reran strict typecheck and all 36 tests and found the
package contents, documentation, and behavior aligned.

Separate Code Reviewer report `AFA-DOCS-FINAL-2026-09-10` issued
`INTERNAL CODE REVIEW PASS` for the exact C4 documentation artifact and narrow
event-precedence correction. It established no actionable P0/P1/P2/P3 findings,
freshly passed the 11-test event suite and strict TypeScript check, matched all
19 installed artifact members to the tarball and canonical tree, and resolved
all 27 relative links across the 11 packaged Markdown files. The review was
read-only and grants no release or integration authority.

This administrative disposition update was made after the frozen review and is
excluded from the package artifact. The documentation and versioning phase is
complete. The next product work may proceed from `0.1.0-alpha.1` under a new
bounded candidate/review cycle. No commit, push, publication, deployment, or
site integration is authorized.

## Live Sandbox Harness

Phil subsequently authorized deployment and package integration specifically
for the two CodeWorksLabs Astro sandboxes. On 2026-09-10, the exact reviewed
`0.1.0-alpha.1` tarball was vendored into both independent sandbox repositories.
The plain Astro site uses the core integration and the stock Starlight site uses
the Starlight wrapper, each with `events: true` and a clearly non-production
Fathom placeholder. The M1 output contains only the inert fallback and no vendor
URL or provider identifier.

Both sandboxes passed completed offline clean installs, production-only audits
with zero vulnerabilities, builds, and Wrangler dry-runs. They were deployed as
Worker versions `10f5f155-64ab-473b-b0bd-5c8ebebf70e4` (Astro) and
`951df61f-a195-43cf-8195-d1485f897ef7` (Starlight). Public roots return HTTP 200,
unknown routes return 404, and crawler exclusion remains active. Sandbox source
changes are local and uncommitted; no repository was pushed. These two live
sites are now ready for Fathom registration and the separately reviewed M2 real
adapter phase. The five production-facing CodeWorksLabs sites remain out of
scope.

## Milestone 2 Fathom Adapter Candidate

Phil supplied public Fathom site IDs `KVFDQBQP` for the Astro sandbox and
`CTRRUUJD` for the Starlight sandbox. The product working tree now advances to
unpublished candidate `0.1.0-alpha.2` and implements the first real provider
adapter. It dynamically installs Fathom's current official deferred embed with
`data-site`, maps supported DNT/canonical/pageview attributes, and connects the
bounded package client to `fathom.trackEvent()` after that API exists.

Fathom provider-owned pageviews load independently of the optional package event
client. Deferred and external consent modes fail closed without loading Fathom;
there is not yet a consent activation API. Custom events are not queued. Only a
non-negative safe-integer `_value` is forwarded as Fathom event metadata; an
invalid supplied `_value` returns `invalid-event`, and other accepted generic
properties are not transmitted by the Fathom adapter.

The visible internal review found one P1 defect before packaging: default
provider-owned pageviews captured the initial load but not Astro client-side
navigation. The candidate now emits Fathom's supported `data-spa="auto"` for
`pageviews: "provider"`, and regression coverage protects that behavior for
`ClientRouter`/view-transition sites.

The correction re-review then found one P2 resilience defect: a hostile global
during optional event-client installation could abort independent Fathom
pageview loading. Client installation now has its own non-throwing boundary, and
a proxy-based regression proves the Fathom script still appends after that
client-boundary failure.

The next internal pass found one P2 package-compatibility regression: the Node
engine floor had been raised for development-only dependencies. The manifest,
root lockfile metadata, and consumer documentation now preserve the existing
Node `>=22.18.0` contract; package runtime code has no 22.19-only requirement.

Separate composite review `AFA-M2-FINAL-2026-09-10` passed the frozen artifact
with two P2 findings and one P3 finding. The candidate is being replaced in the
same bounded correction phase: unrelated DOM ID collisions no longer suppress
Fathom loading; shared document-scoped runtime state prevents manual pageview
listener accumulation across script removal/reentry and permits retry after a
failed script; and event documentation now states that provider-specific
`_value` validation follows consent and Fathom API readiness.

The next visible internal review found a P1 in Fathom's generic SPA handler:
browser history traversal could be recorded before Astro swapped the destination
canonical link. Both enabled Fathom pageview modes now disable eager vendor
automation and share a URL-deduplicated `astro:page-load` path, so initial,
client-side, replacement, and history navigation are sent after Astro's swap.

Official Fathom embed, Astro, and advanced-script guidance was freshly checked
on 2026-09-10. An initial visible in-task review found no actionable defects
after independently rerunning strict typecheck and 45 tests. Its additional
disposable Astro smoke command was blocked by the review subprocess policy
before execution; this was not a product failure.

The resulting artifact, SHA-256
`61518f91cb276a21aecb1a51e1df6b9cdc08632f250f67288076f95e8d483a02`,
is superseded and must not be installed. Separate affected-gate review
`AFA-M2-C1-2026-09-10` blocked it with one P1 and three P2 findings: delayed
vendor readiness during an in-flight navigation could send with stale canonical
metadata; forgeable document state could suppress initialization or substitute
an executable callback; rejected state publication still left repeatable script
and listener side effects; and `Symbol.for` lookup occurred outside the
non-throwing boundary.

The reopened correction replaces all four behaviors. Vendor readiness sends an
initial pageview only if the installation URL is still current, retains a
post-swap lifecycle signal received before readiness, and otherwise waits for
the destination's post-swap signal. Connected script reuse is based on verified
DOM identity and current configuration rather than descriptive state fields.
Document state is used only to remove a preceding listener and never to execute
a stored callback. New state must be published and read back identically before
any listener or script side effect. Symbol discovery is inside the guarded
boundary. A subsequent in-task review found one P2 double-collision case in the
first fallback DOM ID; the loader now scans a bounded fallback set both to choose
an unused ID and to rediscover a connected owned script. Strict typecheck and
51/51 tests then passed. The next in-task review found one P1: the script-load
callback still sent an initial pageview for explicit `pageviews: "none"`. That
path is now gated before any manual send and has direct zero-call coverage.
Strict typecheck and 51/51 tests pass, including direct coverage
for every finding and the surrounding initial/navigation/readiness/retry paths;
`git diff --check` passes with expected line-ending notices only.

Separate affected-gate review `AFA-M2-C2-2026-09-10` PASSed the superseded
`c59acd9f...` artifact with three actionable P2 findings. Script replacement
reset URL deduplication; an inert matching `SCRIPT` could suppress real
initialization; and a malformed `Symbol.for()` return could redirect the package
write to an unrelated document property. The reopened C3 correction carries
only non-executable last-URL state across replacement, validates executable and
configuration-compatible script settings before reuse, and requires an actual
symbol key. It also fails closed if the preceding listener cannot be removed.
Strict typecheck and 53/53 tests pass. The `c59acd9f...` artifact is superseded
and must not be installed.

Separate affected-gate review `AFA-M2-C3-2026-09-10` PASSed the superseded
`c223cb0c...` artifact with two actionable P2 findings. Real dynamic scripts
begin force-async, so created scripts failed the reuse predicate, and a removed
pending script's late load callback could send after replacement. C4 explicitly
sets `async = false`, matching the reuse contract, and every load/error callback
must match the document's current state generation before acting. Direct
regressions cover both. The `c223cb0c...` artifact is superseded and must not be
installed.

The next visible in-task review found one P1 consent-transition defect: a later
deferred/external bootstrap could leave an earlier immediate runtime's Astro
page-load listener active in the same document. C5 adds an explicitly revocable
runtime lifecycle, removes the preceding listener when consent becomes pending,
and invalidates late load/error callbacks. A direct immediate-to-pending
regression proves that neither the old pending script nor later Astro navigation
can send. Strict typecheck and all 55 tests pass.

The corrected C5 visible in-task review completed with no actionable defects
after independently rerunning the full verification suite. The candidate still
requires an exact replacement tarball, a separate Code Reviewer affected-gate
refresh, sandbox installation with the supplied IDs, deployment, and live
Fathom-request verification. No production-facing site is in scope, and no
commit, push, publication, or production deployment is authorized.

Separate composite review `AFA-M2-C5-2026-09-10` BLOCKed the superseded
`a3c8d2a8...` artifact with one P1 and one P2. Pending consent revoked pageview
callbacks but not an earlier retained event client, and a later immediate
bootstrap mistook the still-connected revoked script for an active runtime. C6
uses the same revocable lifecycle for event dispatch, including retained clients
and `events: false` transitions, and only reuses a connected script when it is
bound to the active document generation. A connected revoked script is removed
and replaced on immediate reentry. Direct regressions cover both pending modes,
both event settings, retained/current clients, readiness before and after the
transition, loaded/loading scripts, deduplication, and repeated page-load
behavior. The `a3c8d2a8...` artifact is superseded and must not be installed.

The next visible in-task review found two P2 issues in C6. A new event client was
exposed before its revocable document state had been published, and multiple
Astro page-loads before Fathom readiness overwrote one pending URL slot. C7
publishes and verifies state before installing the event client, and retains
pre-readiness post-swap URLs in order, using Fathom's explicit URL argument for
earlier destinations and normal canonical resolution for the current one.
Direct regressions cover rejected publication and ordered rapid navigation. A
subsequent internal probe froze the publicly reachable lifecycle object and also
checked an `events: true` to `events: false` reentry. C8 makes client validity
depend on current document-state identity, so replacing state revokes retained
clients even if the old lifecycle was frozen; script reuse also requires the
current events setting, causing an event-policy change to establish a fresh
pageview generation without duplicate views. Strict typecheck and all 58 tests
pass.

The next visible internal review found one further P1: revoking callbacks did not
disconnect an in-flight third-party script, allowing it to finish loading after
consent became pending. C9 publishes the inactive generation first and then
disconnects the previous package script; the pending state retains no reusable
script reference. The immediate-to-pending regression now proves the old script
is disconnected before its late callback is exercised.

That removal-based C9 approach was rejected because a prepared classic script
cannot be reliably cancelled. C10 makes consent immutable after the first vendor
load attempt and documents that build-time boundary. It detects package script
ownership independently of configuration matching and rejects any conflicting
same-document bootstrap instead of appending a second Fathom runtime. Prior state
is accepted only with exact shape and a connected DOM-verified package script;
saved cleanup objects from forged or disconnected state are never invoked. A
vendor error now deactivates its generation, clears pending URLs, removes its own
page-load listener, and permits a clean retry.

The next visible review found one P2 result-semantics issue: a superseded or
failed immediate client returned `consent-pending`. C11 now reserves that reason
for a bootstrap actually configured with deferred/external consent; inactive or
superseded immediate clients return `adapter-not-loaded`.

The next visible review found one P2 Speculation Rules edge: a manual pageview
could be attempted during prerender and then lost or counted early. C12 buffers
page-load signals while `document.prerendering` is true and flushes the current
generation once on `prerenderingchange`; abandoned prerenders send nothing.

The following visible internal review found two P2 failure-path defects. Freezing
the exposed lifecycle object could prevent script-error cleanup, and a script
could report `load` without exposing Fathom's pageview API, silently consuming
buffered URLs and blocking retry. C13 keeps mutable activity state private behind
a frozen inspection object and routes both script errors and missing-API loads
through isolated cleanup that disconnects the failed script and permits retry.
Strict typecheck and all 62 tests pass, including direct regressions for both
findings. C13 still requires a fresh clean internal review, exact tarball freeze,
and separate Code Reviewer approval before sandbox installation or deployment.

That review then found one further P2: exact public state shape plus matching DOM
attributes still allowed a pre-populated lookalike state/script pair to claim an
active runtime. C14 generates an unpredictable token per integration instance,
embeds it in every page bootstrap produced by that instance, and requires the
same proof before state reuse. A direct forged matching-script regression proves
the lookalike is replaced rather than trusted. Strict typecheck and all 63 tests
pass. C14 still requires a fresh clean internal review, exact artifact freeze,
and separate Code Reviewer approval before sandbox installation or deployment.

The next visible review found two P2 analytics-accuracy defects in C14. Queued
historical navigations used raw browser URLs instead of the canonical identity
present after their own swap, and distinct identical integration instances had
different proofs and could replace a prepared script. C15 captures both browser
and canonical identity at every post-swap signal, uses the captured canonical for
historical sends, and scopes one unpredictable proof to the loaded package module
so matching integrations deduplicate. Direct regressions cover both. Strict
typecheck and all 65 tests pass. C15 still requires a fresh clean internal review,
exact artifact freeze, and separate Code Reviewer approval before sandbox work.

Separate composite review `AFA-M2-C15-2026-09-10` returned PASS WITH P2/P3
FINDINGS on exact SHA-256 `40af354438c825e05656e6bf45ab6322848e26daa9055fe1dc0b9a76ca34856c`,
with two actionable P2s. First, a copied legitimate public state record could
replay the real token and script while replacing lifecycle data, making existing
callbacks inert and suppressing reinitialization. Second, canonical payload URL
was also used as the dedup key, collapsing distinct browser navigations sharing a
canonical URL. That artifact is superseded and must not be installed.

C16 never treats a saved activity flag or callback as an active generation.
Matching reentry publishes fresh state and callbacks around the already-connected
script, detects an already-present Fathom API without reinserting the vendor, and
leaves older callbacks inert by identity. It also separates browser-navigation
deduplication identity from the canonical URL payload. Direct regressions cover a
copied real token/script with an untrusted callback, ready and queued distinct
navigations sharing a canonical, duplicate signals for one navigation,
`canonical: false`, and ordered different canonicals. Strict typecheck and all
68 tests pass. C16 requires a fresh clean internal review, replacement exact
artifact, and separate affected-gate review before sandbox installation.

The next visible internal review found two P2 listener-retention issues in C18:
matching reentry added a new document page-load listener without removing the
previous ordinary listener, and already-ready script reuse attached load/error
listeners for events that had already occurred. C19 removes the preceding trusted
document listener before adding its replacement and skips script-event listeners
when the reused Fathom API is already present. Direct assertions now keep ordinary
document and script listener counts stable across matching reentry. Strict
typecheck and all 69 tests must pass before a clean internal review and new exact
artifact gate.

The next visible internal review found one P2 client-state ordering issue in C19:
a retained pending-consent client returned `consent-pending` before verifying it
still belonged to the current document generation, so a later pending
`events: false` configuration did not visibly invalidate it. C20 checks state
identity first; only the current pending client reports `consent-pending`, while a
superseded client reports `adapter-not-loaded`. Direct regression coverage was
added. Strict typecheck and all 70 tests must pass before the next clean internal
review and exact artifact gate.

The next visible internal review found one P2 public-boundary mismatch in C20:
direct calls through the exported and globally declared
`window.astroAnalytics.track()` could bypass the imported helper's event name and
property limits. C21 applies the same bounded normalization at the global client
before state/provider checks and forwards the normalized name plus only Fathom's
supported `_value`. Direct invalid-name/property regressions and name trimming
coverage were added. Strict typecheck and all 70 tests must pass before the next
clean internal review and exact artifact gate.

The next visible internal review found one P2 mixed-provider ordering issue in
C21: a later validation-only Google Analytics or Plausible fallback with events
enabled could overwrite the active Fathom global client. C22 makes the
non-networking fallback preserve an existing package-branded callable client;
Fathom still replaces an earlier fallback when it initializes. A direct
Fathom-then-fallback regression proves the provider client remains usable.
Strict typecheck and all 71 tests must pass before the next clean internal review
and exact artifact gate.

The next visible internal review found a P1 provider-attribution defect in C22:
an unrelated preexisting `globalThis.fathom` API could receive events before this
integration's configured script became ready, potentially assigning them to a
different site. C23 binds event dispatch to the current generation's private
`vendorReady` closure, which becomes true only after this script's verified load
or verified already-ready reuse. Direct regression coverage must prove a
preexisting API receives no event before readiness. Strict verification and a
clean internal review are required before any new artifact gate.

The C23 visible internal review found a further P1 in matching-script reentry:
while the package-owned script was still downloading, an unrelated preexisting
Fathom pageview API could be mistaken for evidence that the owned script had
loaded. C24 adds a closure-backed readiness record that becomes true only after
the current owned-script generation verifies its load. Matching reentry may reuse
that proof, but cannot infer readiness from the global API alone. A direct
regression covers reentry before load, an inert superseded load callback, and
activation only through the current generation's load callback. Strict
verification and a clean internal review are required before a new exact gate.

The C24 visible internal review independently reran strict typechecking and all
72 tests, inspected package contents and compatibility metadata, and found no
actionable correctness defect. The next permitted step is to freeze one exact
C24 tarball and obtain the separate Code Reviewer decision on that immutable
artifact before installing either sandbox.

Separate composite review `AFA-M2-C24-2026-09-10` returned PASS WITH two P2 and
two P3 findings on exact SHA-256
`e2cbeffd028e32d2626d570542da821b00038fb6a077809b71a8012903d90818`.
The P2s showed that substituted public readiness could still activate or suppress
reuse and that matching reentry reset the in-flight navigation guard. The P3s
showed callable property bags differed between direct and imported event paths,
and the safety guide retained an obsolete unconditional replacement statement.
That artifact is superseded and must not be installed. C25 binds accepted state
identity to the owned script, carries its authenticated initial URL across
reentry, rejects callable bags directly, and corrects the safety guide. New
regressions cover true/false readiness substitution and both pageview modes during
an in-flight reentry. Strict verification and both clean reviews are required
before another artifact can reach the sandboxes.

The next visible internal review found one P2 availability edge in C16: the
ordered pre-ready pageview queue could grow without bound if the vendor request
stalled throughout a long-running SPA session. C17 retains only the newest 100
distinct post-swap pageviews, bounding both memory and a later recovery burst.
A direct 105-navigation regression proves the oldest five are discarded and the
newest 100 retain order. Strict typecheck and all 69 tests must pass before the
next internal review and replacement-artifact gate.

That review found one further P2 in C17: Fathom derives campaign query data from
the live `location.search` even when `trackPageview({ url })` names an older URL,
so replaying historical queued routes could assign the current route's UTM data
to an earlier page. C18 replaces historical replay with one pending current
navigation. It sends only after the latest post-swap URL is still current, using
Fathom's live canonical and query lookup; this also supersedes the 100-entry cap
with a tighter one-slot memory/traffic bound. Updated regressions cover rapid
navigation, 105-route stalls, current canonical/query context, `canonical: false`,
same-canonical navigation while ready, and pre-ready coalescing. Strict typecheck
and all 69 tests pass. C18 requires a clean internal review, replacement exact
artifact, and separate affected-gate review before sandbox installation.

The C25 visible internal review independently reran strict typechecking and all
74 tests and inspected the affected runtime, event-boundary, documentation, and
package surfaces. It reported no discrete actionable correctness defect. C25 is
therefore eligible to be frozen once as an immutable tarball and submitted to
the separate Code Reviewer composite gate. It remains forbidden from either
sandbox until that exact artifact receives a clean decision.

Separate composite review `AFA-M2-C25-20260910` completed on exact SHA-256
`657a1b2759b24210e07d0904faea5ee2b0d63ca76c09a7e281147d3ddcb5d81f`
with two P2 and one P3 findings. Paired replacement of the writable script and
document state bindings could still forge readiness; matching reentry after a
completed pre-ready page-load discarded that pending navigation; and the
changelog overstated deduplication and listener-cleanup behavior during untrusted
script replacement. C25 is superseded and must not be installed. C26 makes the
script binding non-configurable and non-writable, restores replaceable document
state from that binding, retains the authenticated generation and its completed
pending navigation on matching reentry, and corrects the changelog. Direct
regressions cover paired substitution attempts in loading and loaded states,
in-flight and completed-navigation reentry in both pageview modes, prerender
activation, listener reuse, and event-client invalidation. Strict typechecking
and all 75 tests pass; a clean visible internal review and a new exact-artifact
gate are required before sandbox installation.

The C26 visible internal review found two P2 interactions before packaging. A
matching `events: false` generation could be disabled but not re-enabled by a
later `events: true` bootstrap, and a missing or throwing prerender listener
registration could escape asynchronously from the vendor load callback. C27's
authenticated event control now supports both transitions, and prerender
registration is guarded at callback time. Direct false-to-true event dispatch
and hostile/missing asynchronous registration regressions were added. C26 was
never frozen and is superseded. Strict verification and a clean internal review
are required before freezing C27.

The C27 visible internal review independently confirmed strict typechecking, all
77 tests, the 19-member package inventory, and consistency among implementation,
documentation, and manifest. It found no actionable correctness defect. C27 is
eligible to be frozen once and submitted to the separate composite gate; neither
sandbox may receive it before that exact hash is cleared.

Separate composite review `AFA-M2-C27-20260910` examined exact SHA-256
`9bee1c3acf8d78a3982b8560a93a4eee0dbb5d5093b824121b652fac681dd1f2`
and returned two actionable P2 findings. A newly connected lookalike script
could copy the publicly observable token and inspection state, while temporary
replacement of the document inspection state during a one-shot load or error
event could consume that terminal callback and strand the legitimate runtime.
C27 is superseded and must not be installed.

C28 moves runtime authority behind a non-replaceable, closure-backed document
coordinator. The public document and script state records remain available for
inspection, but neither is used as an authentication credential: only the
coordinator closure can retain and advance the authentic generation. Matching
bootstrap executions invoke that retained coordinator, copied public state on a
lookalike script cannot enter its private authority, and terminal script events
remain effective even while public inspection state is temporarily replaced.
Direct regressions cover copied immutable bindings in loading/loaded and
events-disabled/events-enabled states, plus temporary inspection-state
replacement during both successful load and error/retry paths. Strict
typechecking and all 79 tests pass. C28 requires a fresh clean visible internal
review, a newly frozen exact artifact, and a clean separate composite review
before either sandbox may be changed or deployed.

The C28 visible internal review completed on 2026-09-11 with no actionable
correctness defects. It independently reran strict TypeScript checking and all
79 tests, inspected the 19-member package surface, traced the coordinator and
reentry paths, checked the documentation and lockfile, and confirmed
implementation consistency with the declared Fathom runtime and event-client
behavior. C28 is eligible for one newly frozen immutable artifact and the
separate Code Reviewer composite gate; sandbox installation and deployment
remain prohibited until that exact artifact receives a clean decision.

The exact C28 gate artifact is the read-only file
`C:\Users\Owner\AppData\Local\Temp\afa-m2-c28-gate-20260911\codeworkslabs-astro-analytics-0.1.0-alpha.2.tgz`.
It contains 19 members, is 23,774 bytes packed and 87,462 bytes unpacked,
has SHA-256
`6f9e10c19b4703113de37f1978fda23063f094ea9893cb0609def8f7ecea421b`,
SHA-1 `918d64d2b2b2e7a69c4d3560a0f95167312805f6`, and integrity
`sha512-0D6/WN1BblMCSK6bqxVDkofowh3CsUqiLNDZnccJCEcZcTki8eTIqSNlXhSfGjRGPh5ZiSYCAYnQm16f1oL77g==`.
Fresh pre-freeze verification passed strict typechecking and all 79 tests. The
artifact and doctrine-complete authorization/evidence ledger were sent to Code
Reviewer task `01a0448f-96ef-7740-b95c-27e780a06014`. No changes are queued
against the frozen bytes. Both sandbox trees and Workers remain unchanged while
that separate decision is pending.

Separate composite review `AFA-M2-C28-20260911` concluded with **INTERNAL CODE
REVIEW PASS** and a complete clean census: 0 P0, 0 P1, 0 P2, and 0 P3. All six
declared sub-gates independently passed: complete active package codebase, C27
correction closure and interactions, runtime qualification, artifact
qualification, stock Astro 7.3.2 consumer, and stock Starlight 0.42.0 on Astro
7.3.2 consumer. Fresh evidence included strict source typechecking and 79 tests,
an ordinary strict consumer typecheck, 37 matrix groups plus closure and nine
additional adversarial groups, separate install and `npm ci` replays, production
builds, zero-vulnerability production audits, Wrangler dry-runs, and emitted
runtime execution. C27-01 and C27-02 are closed in source and emitted runtime.

The admissible durable report is
`C:\Users\Owner\AppData\Local\Temp\afa-m2-c28-review-20260911\REVIEW-REPORT.md`,
16,129 bytes, SHA-256
`818a6d23797c2dcac4688ae24818f6f92e69c6631145d69dcd024074551a902c`.
The commissioner independently verified and read that report and reverified the
unchanged frozen artifact hash. The report clears only the prerequisite for
Phil's already-authorized installation and deployment of the two sandbox sites;
it does not authorize a commit, push, publication, release, production-site
integration, or production deployment.

## Authorized Sandbox Qualification and Deployment

On 2026-09-11, exact C28 SHA-256
`6f9e10c19b4703113de37f1978fda23063f094ea9893cb0609def8f7ecea421b`
replaced the superseded alpha.1 artifact in both independent sandbox
repositories. The Astro integration is configured with Fathom site ID
`KVFDQBQP`; the Starlight wrapper is configured with `CTRRUUJD`; both use
`events: true`. The superseded alpha.1 copies were removed only from the two
site-local `vendor` directories after the alpha.2 copies were hash-verified.

Both repositories remain on `main` with HEAD exactly equal to `origin/main` and
all integration changes local and uncommitted. Each alpha.2 install reproduced
with `npm ci`, each production-only audit reported zero vulnerabilities, each
production build passed, and each Wrangler dry-run passed. The Astro emitted
runtime is `_astro/page.XXVonQSm.js`, SHA-256
`920a629cab105545affc8befb3ac8dc332f6fb3045f47aaeaac2a884c4042dcb`;
the Starlight runtime is `_astro/page.Gehn-MAk.js`, SHA-256
`54def1193b3c17b54c67170f21c0c79fcf785c2a51f77d560704483e40fe9270`.
Both contain their correct site ID, the official Fathom script URL,
`data-auto`, and the C28 coordinator marker.

The live deployments completed successfully:

- `astro.sandbox.codeworkslabs.dev`: Worker version
  `d6c92caf-5464-42b6-b46e-47a71b134b50` (current after live-event probe
  cleanup).
- `stockstarlight.sandbox.codeworkslabs.dev`: Worker version
  `64094fcd-b3a1-40b3-a516-194085ae6918` (current after live-event probe
  cleanup).

Both roots returned HTTP 200, unknown routes returned 404, and `robots.txt`
returned `User-agent: *` plus `Disallow: /`. Real Chrome loaded both deployed
HTTPS roots. A clean extension-free profile showed each exact Fathom script in
the live DOM with `data-auto="false"` and captured a tracking request bearing
the correct Fathom site ID. Network/DOM evidence is retained under
`C:\Users\Owner\AppData\Local\Temp\afa-live-astro-20260911` and
`C:\Users\Owner\AppData\Local\Temp\afa-live-starlight-20260911`.

Fathom dashboard acceptance was then verified directly on 2026-09-11 with
ordinary, extension-free Edge profiles. The Starlight dashboard showed two
current visitors, two site visitors, and two pageviews for `/`; the Astro
dashboard showed one current visitor, one site visitor, and one pageview for
`/`. Earlier automated Chrome requests were not valid acceptance evidence:
Fathom identified and blocked two bot requests on each dashboard. Fathom's
domain allow-list and IP block-list were also inspected read-only and were
empty, so neither firewall list excluded the sandbox hosts or test client.

No commit, push, npm publication, release, or production-facing site change was
performed. The package, deployment, live DOM, outbound request, and provider
dashboard acceptance sides are now verified.

After that acceptance test, Phil opened a replacement Fathom site for
`stockstarlight.sandbox.codeworkslabs.dev` under ID `FRMRGPFB` and explicitly
selected it as canonical. The Starlight config was changed from the superseded
`CTRRUUJD`; a forced clean build emitted `_astro/page.Cv3fsKFr.js`, SHA-256
`b674c8b4eca11b555b84ab6c4e231b4e43657f5da23b87dd0b9ca1bf5d0567d9`,
with `FRMRGPFB` present and `CTRRUUJD` absent. The zero-vulnerability production
audit and Wrangler dry-run passed, and sandbox Worker version
`a442a8f0-e371-4ff6-a1ca-53f0e645f4cb` was deployed. Live HTTP and runtime-ID
checks passed; an ordinary extension-free Edge visit registered on the new
dashboard; and Fathom's installation verifier reported successful collection.
No commit, push, npm publication, release, or production-facing change was
performed.

Phil then authorized permanent removal of the three noncanonical Fathom site
records for the Starlight hostname. Site IDs `CTRRUUJD`, `XMTWPVGM`, and
`ZSSEHZYH` and their associated analytics data were deleted from Fathom on
2026-09-11. A final `starlight` inventory search returned only canonical site
ID `FRMRGPFB`; the account site count fell from 33 to 30.

The live public-client event gate then passed on both sandboxes. Temporary
unlinked, `noindex` probe routes imported
`@codeworkslabs/astro-analytics/client`, waited only for
`adapter-not-loaded` readiness, and called `track()` with site-specific probe
names. Fathom recorded one probe-path pageview and one event completion for
each of `KVFDQBQP` and `FRMRGPFB`. Each probe was removed immediately after the
observation; forced clean builds, zero-vulnerability production audits, and
Wrangler dry-runs passed; and clean sandbox Workers were redeployed. Both live
probe URLs now return 404, both roots return 200, and their current runtime
chunks contain the correct Fathom IDs. No probe source remains in either site
repository.

## Alpha.3 Compatibility Qualification

The post-sandbox compatibility phase on 2026-09-11 established that successful
compilation alone is not an acceptable release-support claim. Exact
`0.1.0-alpha.2` consumers built on Astro 5.18.2 and 6.4.8, but their clean
production dependency trees retained critical upstream Astro advisories for
which no safe patch exists within those major lines. Astro 7.3.2 built cleanly
and reported zero production vulnerabilities. Published Starlight peer metadata
then established that Starlight 0.35 through 0.40 require those excluded Astro
5/6 lines; Starlight 0.41.11 and 0.42.0 support Astro 7 and were qualified
directly. The package declarations and documentation now state:

- `astro: ">=7.3.2 <8"`
- `@astrojs/starlight: ">=0.41.11 <0.43"` (optional)

Because this changes package metadata and the documented support boundary, the
immutable candidate advanced to `0.1.0-alpha.3`; reviewed alpha.2 remains the
historical runtime artifact installed on the two live sandboxes. The exact new
read-only candidate is
`C:\Users\Owner\AppData\Local\Temp\afa-m2-alpha3-gate-20260911\codeworkslabs-astro-analytics-0.1.0-alpha.3.tgz`.
It contains 19 members, is 24,113 bytes packed, has SHA-256
`68ff175d942da27232ac1a7b666fda457e0201ff3948b96ec85bda5d77cd39d6`,
SHA-1 `85bff383747b06d565ad7af873113a355e6fad65`, and integrity
`sha512-+ZyTjrUFa+QF6mop1IzCUsuVwOiNUKjTQg1zVC++GRO8CLSfRKxAjcX498JK4m4p1G1u8HL4Og3G7t8eSIrpxA==`.

Fresh source verification passed strict TypeScript checking and all 79 tests;
`npm audit --omit=dev` found zero vulnerabilities; and `npm pack --dry-run`
reproduced the 19-member publication surface. The exact alpha.3 tarball was then
installed into three clean disposable consumers under
`C:\Users\Owner\AppData\Local\Temp\afa-compat-alpha3-20260911`:

- Astro 7.3.2, lockfile SHA-256
  `052b3b32ebc4414d71a97bc68b7c9cf846e2c8dad6c13cc8d41e08366b8f186c`;
- Starlight 0.41.11 on Astro 7.3.2, lockfile SHA-256
  `70d82c2ebdf747b318b41dadca0beed6a0ebcd5c98b409b476e91d071f8103d6`;
- Starlight 0.42.0 on Astro 7.3.2, lockfile SHA-256
  `66f2129fd371c7cf9aed7dd2dc1bcace57d807ddde7920c2c80024de5b9e9457`.

Every consumer installed alpha.3 exactly, reported zero production
vulnerabilities, completed its production build, and emitted the expected
Fathom integration with the fixture's correct site ID. Wrangler 4.130.0 read
all three `dist` trees and exited successfully at `--dry-run` using explicit
compatibility date `2026-09-08`; nothing was uploaded or deployed. The first
dry-run attempt intentionally made no upload and failed only because no
compatibility date had been supplied, after which the explicit-date runs passed.

The fresh visible internal `codex review --uncommitted` completed on 2026-09-11
with no actionable defects. It independently reran all 79 tests, strict
TypeScript checking, the 19-member package dry-run, `git diff --check`, and the
production dependency audit; every check passed and the audit census was zero at
all severities. The review was read-only. The separate Code Reviewer decision on
the exact alpha.3 artifact is still required. The candidate must not be tagged,
published, released, committed, pushed, or installed into production-facing
sites on the strength of compatibility qualification or the in-task review
alone. No authoritative site was changed during this phase, and the live
sandboxes remain on the exact reviewed alpha.2 runtime.

Separate doctrine-complete composite review `AFA-M2-ALPHA3-20260911` was then
completed by Code Reviewer task `01a0448f-96ef-7740-b95c-27e780a06014` under a
strict read-only Static Review profile. It issued **INTERNAL CODE REVIEW PASS**
with a complete clean census: P0 0, P1 0, P2 0, P3 0. All eight declared
sub-gates independently passed: complete active candidate scope; C28 A-F
behavioral preservation; alpha.3 version/peer/document consistency; exact
artifact identity and publication surface; stock Astro 7.3.2; stock Starlight
0.41.11/Astro 7.3.2; stock Starlight 0.42.0/Astro 7.3.2; and the security/support
boundary excluding Astro 5/6 and Starlight 0.35-0.40.

The reviewer verified that exactly seven scoped files differ from C28 and that
all executable, test, typecheck, and unchanged documentation files remain C28
bytes. It reran all 79 tests, strict no-emit typechecking, the C28 37-group
matrix plus closure/interactions in memory, and the current emitted-runtime
closure/interactions for all three consumers. It verified every tar member
against canonical source and each installed consumer, all 27 relative package
links, all three lock and emitted-runtime identities, and stable opening/closing
repository and artifact identities. The reviewed source lock SHA-256 is
`fc88344a1ce630fd4bb44c0a8ce727314749bb8c9eab452421ddba82e78a9fb8`.

This clean review completes the alpha.3 correction and compatibility review
gates only. It does not authorize commit, push, tag, GitHub Release, npm
publication, deployment, site integration, or product acceptance. The exact
alpha.3 artifact and candidate source remain frozen with zero queued candidate
changes; any later candidate change supersedes this disposition.

## Astro Bluesky Comments Checkout Reconciliation

A 2026-09-11 continuity advisory from the Astro Bluesky Comments task reported
Phil's authorized removal of the redundant nested checkout at
`C:\CodeProjects\Products\Astro Bluesky Comments\astro-analytics`. That task
verified before deletion that the nested checkout contained no unique tracked
tree, refs, stashes, reflog history, or unreachable Git objects, and preserved
the canonical Analytics for Astro repository.

This task reconciled the advisory read-only before making this checkpoint-only
administrative update. The nested path is absent. The canonical repository is
still on `main` at HEAD
`5702da4a9fb5e5e3c3b3b9683bcb3a675b3a0bad`, with HEAD tree
`7df16e34d5cd81d283b42351d4b1a69d5bf3000b`, tracking `origin/main` at the
same commit. Its substantial modified and untracked census matches the frozen
task/user-owned alpha.3 candidate plus this excluded checkpoint. The exact
read-only alpha.3 artifact remains 24,113 bytes with SHA-256
`68ff175d942da27232ac1a7b666fda457e0201ff3948b96ec85bda5d77cd39d6`.
No package member, test, lockfile, repository ref, index entry, or site was
changed during reconciliation.

## Provider Roadmap Research

Fresh official-provider research on 2026-09-11 confirms that alpha status must
continue: Phil requires real Google Analytics and Plausible adapters in addition
to the completed Fathom adapter, and the intended `0.1.0` feature boundary is
therefore not complete. The recommended bounded first-stable provider set is:

1. Fathom (implemented and live-qualified on the sandboxes).
2. Google Analytics 4.
3. Plausible Analytics, including compatible hosted/self-hosted endpoints.
4. Matomo Cloud or Matomo On-Premise.
5. Umami Cloud or self-hosted Umami.

Matomo is the mature full-featured self-hosted candidate. Its official tracker
uses the `_paq` queue, supports manual `trackPageView` and `trackEvent`, requires
explicit SPA URL/title/referrer maintenance, provides tracking- and
cookie-consent APIs, and has a free On-Premise edition. Umami is the strongest
lightweight self-hosted complement: its current tracker can disable automatic
pageviews while retaining initialization, exposes `umami.track()` for pageviews
and events with bounded event data, supports configurable host URLs and DNT, and
is documented as open-source, cookieless, and self-hostable. Plausible itself
also offers an AGPL Community Edition for self-hosting.

The implementation should preserve Astro-owned post-swap pageview timing across
providers rather than trusting generic History API interception. GA4 must set
`send_page_view: false` and documentation must require disabling Enhanced
Measurement history page changes to avoid duplicates. Plausible should use its
current per-site script/init contract with `autoCapturePageviews: false`. Umami
should use `data-auto-pageview="false"`. Matomo should omit the initial automatic
pageview and explicitly update URL, title, and referrer before `trackPageView`.

Provider event mappings are not identical and must be explicit: GA4 uses
`gtag("event", name, parameters)`; Plausible uses
`plausible(name, { props, ... })`; Umami uses `umami.track(name, data)`; Matomo's
`trackEvent` requires category and action semantics that the current generic
`track(name, properties)` contract does not define. Matomo therefore needs a
reviewed mapping/configuration decision rather than an implicit lossy mapping.

A provider-neutral runtime/consent design should precede the remaining adapters.
Google requires a default consent command before configuration or events and an
update command after user choice. Matomo separately supports tracking consent
and cookie consent. The current deferred/external modes have no activation API,
so completing GA4 and Matomo correctly likely requires a small public consent
controller in addition to `track()`; this is a public-contract decision and
keeps the package in alpha.

Cloudflare Web Analytics is a useful future pageview/RUM-only adapter, especially
for the CodeWorksLabs estate, but official documentation says it does not yet
support custom events or UTM parameters. Simple Analytics and Pirsch are credible
hosted privacy providers with SPA/event support, but overlap the initial privacy
set and should wait for demand. PostHog covers product analytics, autocapture,
session replay, flags, experiments, and identity; it exceeds the current minimal
web-analytics contract and should be evaluated only as a later, explicitly wider
product-analytics lane.

Official sources consulted:

- `https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications`
- `https://developers.google.com/analytics/devguides/collection/ga4/views`
- `https://developers.google.com/tag-platform/gtagjs/reference`
- `https://developers.google.com/tag-platform/security/guides/consent`
- `https://plausible.io/docs/script-extensions`
- `https://plausible.io/docs/custom-event-goals`
- `https://plausible.io/self-hosted-web-analytics`
- `https://developer.matomo.org/guides/tracking-javascript-guide`
- `https://developer.matomo.org/guides/spa-tracking`
- `https://developer.matomo.org/guides/tracking-javascript`
- `https://matomo.org/guide/installation-maintenance/matomo-on-premise-self-hosted/`
- `https://docs.umami.is/docs`
- `https://docs.umami.is/docs/tracker-functions`
- `https://docs.umami.is/docs/tracker-configuration`
- `https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/`
- `https://developers.cloudflare.com/web-analytics/faq/`

This research is a roadmap recommendation, not authorization to change the
frozen alpha.3 candidate. Any adapter or consent-controller work starts a new
numbered alpha candidate and requires its own bounded implementation and review
cycle.

Phil accepted the provider assessment on 2026-09-11 and set the intended first
stable provider boundary to exactly these five first-party adapters, in this
roadmap order:

1. Fathom.
2. Plausible Analytics.
3. Google Analytics 4.
4. Matomo.
5. Umami.

The product is being built for CodeWorksLabs' Cloudflare implementation rather
than as an infrastructure-neutral deployment system. Cloudflare Web Analytics
is therefore an operational Cloudflare feature, enabled at the Cloudflare layer
where desired, and is not part of the Analytics for Astro adapter roadmap.
Matomo and Umami remain in scope because they provide materially different
self-hosted analytics choices rather than alternative hosting targets for this
package. The package remains alpha until the four remaining provider adapters
and their shared consent/lifecycle contract are complete and qualified.

## Astro sandbox UI and live Fathom qualification — 2026-09-11

The Astro sandbox at `https://astro.sandbox.codeworkslabs.dev/` now has a
deployed two-page test surface with shared navigation and an explicit
`/analytics/` event-control page. Wrangler was updated from 4.130.0 to 4.131.1,
resolving the development-tree Miniflare/Sharp audit findings. `npm ci`, the
complete and production-only audits, `npm run build`, and
`npm run deploy:dry-run` all passed before deployment.

Cloudflare Worker version `a7ad94d1-b695-47f4-b96a-dcc158aedf6c` is live. Root
and `/analytics/` returned 200, an unknown route returned 404, and `robots.txt`
continues to block indexing. One explicitly authorized live primary event
returned `{\"ok\":true}`; Fathom then showed `/analytics/` and exactly one
unique/completion for `CWL Astro primary interaction`. No automatic custom
events or synthetic traffic were added. Site changes remain uncommitted and
unpushed. The next product implementation phase is the Plausible adapter and
the provider-neutral consent/lifecycle work required by the accepted roadmap.

The sandbox controls were then refined into a realistic journey and deployed
as Worker version `4d5b3dd5-1f87-48d5-8c17-8ffc6508f0d8`. Arrival at
`/analytics/` is the landing pageview; the single CTA records
`CWL Astro journey continued`; `/analytics/next/` is the destination pageview
and displays the client receipt. The live receipt returned `{\"ok\":true}` and
Fathom showed both pages plus exactly one unique/completion for the journey
event. The three-page build, production audit, Wrangler dry-run, and local
journey qualification passed before deployment. No commit or push was made.

## GA4 alpha.6 implementation and sandbox deployment — 2026-09-11

Phil supplied separate GA4 Measurement IDs for the two dedicated sandboxes:
`G-T44ECDWXRJ` for `astro.sandbox.codeworkslabs.dev` and
`G-QNPCRXMMW5` for `stockstarlight.sandbox.codeworkslabs.dev`.

The package advanced locally from unpublished alpha.5 to unpublished
`0.1.0-alpha.6`. The GA4 browser adapter is now implemented rather than
validation-only. It owns its `gtag`/`dataLayer` bootstrap, emits configured
Consent Mode defaults before `config`, forces `send_page_view: false`, sends
Astro-lifecycle pageviews with current location/title and virtual referrer,
routes events to the configured Measurement ID, and reports independent
provider readiness/results. Deferred and external consent still fail closed
until a future activation API exists.

The existing internal review task performed multiple passes. It found and
closed substantive lifecycle, cleanup, exception-containment, GA limit, and
naming defects. Final review result: no actionable defects in the GA4 alpha.6
scope. Final source gates passed: strict typecheck plus 97/97 tests, zero npm
audit vulnerabilities, correct npm pack dry-run, and git diff check clean apart
from line-ending warnings.

The exact immutable local candidate artifact is:
`C:\Users\Owner\AppData\Local\Temp\afa-m2-alpha6-final-20260911\codeworkslabs-astro-analytics-0.1.0-alpha.6.tgz`
with SHA256
`162977FFE743B9339F0C70E4D236DA5A5616BCAC52FE27AEC6677DC3B2340A01`.
Byte-identical copies are present in both sandbox `vendor` directories.
Both sites reference that exact alpha.6 filename, retain Fathom and Plausible,
and add their separate GA4 providers with immediate analytics storage granted
and all three advertising consent fields denied. The Astro journey event was
renamed to the GA-compatible `cwl_astro_journey_continued`.

Both consumer installs, complete audits, production audits, Astro builds,
Wrangler dry-runs, and diff checks exited successfully. Both authorized
Cloudflare sandbox deployments then succeeded:

- Astro Worker version `4cdb0355-3426-43df-9c52-eb888769cb1b`.
- Stock Starlight Worker version `c515e878-f9da-4af9-a9be-23d276290777`.

HTTP checks after deployment returned 200 for both roots and representative
content routes; the Astro unknown route returned 404. A raw HTML substring scan
did not find provider markers because Astro emits the injected page runtime
through generated assets, so this is not a provider failure determination.
The next action is clean live-browser inspection of both sites: verify all
three configured provider statuses become ready, confirm the emitted Google
script marker and correct per-site Measurement ID, and send one explicitly
selected GA4 journey event from the Astro operator page. Then obtain
provider-side Realtime/DebugView evidence if available. Also remind Phil to
disable **Page changes based on browser history events** under Enhanced
Measurement for each GA4 web stream to prevent duplicate Astro SPA pageviews.

No commit, push, npm publication, tag, release, or production-site integration
occurred. Preserve all preexisting and current uncommitted work.

### GA4 live verification correction — 2026-09-11

The first post-crash Wrangler deployments above referenced stale pre-crash
`dist` directories and reported no changed assets. They did not put the alpha.6
runtime live and are superseded as deployment evidence. Each sandbox was then
rebuilt directly, its generated runtime was inspected for the correct GA4
marker and Measurement ID, and Wrangler uploaded five changed assets:

- Astro Worker version `d62618e2-12a7-40f0-9c16-08e7c4cd2475`.
- Stock Starlight Worker version `3d1b74a4-dc57-4809-8cea-30fb08245739`.

Live browser inspection then confirmed all three owned provider scripts on
both sites and the correct per-site GA4 IDs. On the Astro operator page,
Google Analytics 4 reported ready. One explicitly selected GA4 journey sent
`cwl_astro_journey_continued`; the destination reported that Plausible and GA4
accepted the event while Fathom was `adapter-not-loaded` in that browser
session. In this contract, GA4 acceptance proves entry into the package-owned
Google queue, not receipt by Google's reporting service.

Provider-side verification is currently blocked by Google Analytics account
configuration, not by the deployed adapter. The signed-in `Code Works Labs /
codeworkslabs.dev` property exposes only web stream `15763732272` with
Measurement ID `G-GVB6HKL9PR`. Universal-picker search locates
`astro.sandbox.codeworkslabs.dev` only as a **deleted** property beneath the
separate `RVing Community` account (`a109241805p553838991`), and finds no result
for `stockstarlight.sandbox`. Therefore neither supplied sandbox Measurement ID
can presently be verified in Realtime/DebugView from the intended Code Works
Labs Analytics scope. Do not claim Google-side receipt until valid sandbox
streams are available in the intended account and the live test is repeated.

Once the correct streams exist, disable **Page changes based on browser history
events** in Enhanced Measurement for each stream so Google's automatic history
tracking does not duplicate Astro's package-owned lifecycle pageviews.

### Corrected Code Works Labs GA4 streams — 2026-09-12

Phil corrected the temporary Analytics-account placement and supplied the
replacement Code Works Labs Measurement IDs:

- Astro: `G-BZRRREHHE5`, stream ID `15764265298`.
- Stock Starlight: `G-SW9Z74X4XT`, stream ID `15764286673`.

Both streams were verified read-only under `Code Works Labs / codeworkslabs.dev`.
The two site configurations were changed only at their Measurement IDs. Clean
installs, complete and production audits, builds, Wrangler dry-runs, and diff
checks passed for both sites; both audits reported zero vulnerabilities. Built
assets contain only the correct replacement ID and contain neither superseded
sandbox ID. The exact builds were deployed:

- Astro Worker version `4e5cbe91-129c-40ed-a5c0-f78936d1c118`.
- Stock Starlight Worker version `720d970a-2c38-4110-8eec-34d436d31558`.

Live DOM inspection confirmed Google loads
`gtag/js?id=G-BZRRREHHE5` on Astro and `gtag/js?id=G-SW9Z74X4XT` on
Starlight. One Chrome GA4 journey and one extension-free in-app GA4 journey
both advanced. The clean-browser receipt reported Fathom, Plausible, and GA4
all accepted the event. Fresh pageviews were also loaded on both sites without
extensions and no browser console warnings or errors were recorded.

Google Realtime for the Code Works Labs property continued to report zero
active users after the new-stream tests. Treat Google-side receipt as pending,
not failed or passed: the deployed tag, owned command queue, and browser client
are verified, but the newly created streams may still be provisioning and no
authoritative provider-side event has appeared. Recheck Realtime later before
closing provider qualification. Enhanced Measurement remains enabled on both
streams; disabling browser-history page changes still requires an explicit
provider-setting decision.

### GA4 alpha.7 live defect correction and qualification — 2026-09-12

Repeated remote, Chrome, and extension-free visits continued to produce zero
Google Realtime traffic after alpha.6 reported local acceptance. Source tracing
against Google's current official gtag.js installation contract identified the
cause: alpha.6 defined `gtag` with a rest parameter and pushed the resulting
ordinary array, while Google's loader requires the canonical JavaScript
`arguments` object queued by `function gtag(){dataLayer.push(arguments);}`.
The malformed queue explained the exact symptom: the Google script loaded,
provider readiness became true, and the package accepted commands locally, but
Google ignored them.

The unpublished package advanced to `0.1.0-alpha.7`. Its owned gtag function is
now a non-arrow function that pushes its `arguments` object. The primary GA4
integration test asserts `[object Arguments]` before checking command order and
content, preventing the earlier array implementation from passing. Version,
changelog, README, and package documentation were advanced consistently.

Strict typechecking, all 97 tests, complete and production audits, the
19-member package dry-run, and diff check passed. The existing internal review
found the runtime correction sound and one P3 versioning-guide omission; that
omission was corrected and the closure review reported no actionable defects.
The exact final artifact is
`C:\Users\Owner\AppData\Local\Temp\afa-m2-alpha7-final2-20260912\codeworkslabs-astro-analytics-0.1.0-alpha.7.tgz`,
SHA-256
`1EEAD543DD0A9BFF4668B68BDA72554D0FF5C93A18118E8ED0A0FBCD2073EE9E`.

Both sandboxes vendor byte-identical copies of that artifact. Their clean
installs, complete and production audits, builds, emitted-runtime inspections,
Wrangler dry-runs, and diff checks passed. The emitted runtimes visibly contain
the minified equivalent of `function(){dataLayer.push(arguments)}`. The exact
builds were deployed:

- Astro Worker version `d1f95b77-fb8f-4bcf-86fe-eb36452fc7a0`.
- Stock Starlight Worker version `64d3e206-5b06-4b95-8e96-d06dc8bf75d3`.

An extension-free live load supplied the Starlight pageview, and an
extension-free Astro journey supplied the landing pageview, explicit
`cwl_astro_journey_continued` event, and destination pageview. The browser
receipt reported Fathom, Plausible, and GA4 all accepted. Google Realtime then
provided authoritative provider-side evidence: one active user in both the
five- and thirty-minute windows; three pageviews; page titles for the Astro
landing, Astro destination, and Starlight root; and
`cwl_astro_journey_continued` with event count one. GA4 pageview and custom-event
qualification is therefore complete for both sandbox implementations.

Phil subsequently reported the GA4 page-path table showing `/` with two active
users and three views, `/analytics/` with two active users and three views, and
`/analytics/next/` with two active users and two views. This independently
confirms continued provider ingestion after the initial qualification. Because
both sandbox streams share the Code Works Labs property, the `/` row aggregates
root traffic across the Astro and Starlight streams rather than identifying one
hostname by itself.

Phil then exercised the Starlight content routes and reported the expanded GA4
table: `/` with two active users and six views, `/analytics/` with two active
users and three views, `/analytics/next/` with two active users and two views,
`/guides/example/` with one active user and one view, and
`/reference/example/` with one active user and one view. The two Starlight-only
content paths provide direct provider-side route evidence for that stream; the
shared `/` row remains aggregated across both sandbox hostnames.

## Next-provider execution decisions — 2026-09-12

Documentation is continuous implementation work. Each Matomo and Umami adapter
phase must update its configuration reference, runtime and consent behavior,
Astro and Starlight examples, versioning notes, and changelog alongside code and
tests; documentation is not to be deferred until the release-candidate phase.

Live qualification will use self-hosted Matomo and Umami installations on
`codeworkslabs-platform-01`. Their installation, persistence, ingress/TLS,
upgrades, credentials, and provider administration are infrastructure work and
must be coordinated with the server/platform authority. Their persistent data
must be included in platform-01's existing server-wide backups; no separate
application backup system is required. This product repository must not store
their secrets. Once each service supplies its public tracker endpoint and
non-secret site/website identifier, the adapter can be configured on both
dedicated sandboxes and qualified provider-side.

Enhanced Measurement remains enabled. Its observed automatic `scroll` event is
separate from the package lifecycle, but browser-history page-change tracking
should still be disabled before testing Astro client-side navigation to avoid
duplicate pageviews. The alpha.7 candidate and later checkpoint corrections are
now committed and pushed only on `codex/pre-rc` under the authorization boundary
in Current State. No package publication, tag, release, merge to `main`, or
production-site integration occurred.

## Repository-driven sandbox deployment decision — 2026-09-12

Phil accepted the permanent sandbox deployment architecture. Both sandbox
domains and their existing public repositories will remain after product
development. Local deployments are to be replaced by repository-authoritative
builds, consistent with the established CodeWorksLabs site estate.

During the private pre-RC period, each sandbox build will pin an exact Analytics
for Astro commit from `codex/pre-rc`. GitHub Actions will use a narrowly scoped
GitHub App to check out the private product repository, pack and install that
candidate without committing its source tarball to the public sandbox
repository, run the sandbox verification contract, and deploy with Wrangler.
Each resulting deployment must therefore be attributable to both an exact
sandbox commit and an exact product commit.

After package publication, each sandbox will replace the private cross-repo
checkout with a pinned npm dependency and use the estate's normal GitHub
verification plus native Cloudflare Workers Builds deployment from sandbox
`main`. The sandbox repositories, domains, pages, and test purpose remain
permanent; only the temporary private-package acquisition path is retired.

## Public documentation preparation — 2026-09-12

Phil authorized preparation and publication of the product documentation at
`https://docs.codeworkslabs.dev/analytics-for-astro/` before Matomo and Umami
adapter development resumes. Canonical alpha.7 documentation now states that
Fathom, Plausible, and Google Analytics 4 are implemented and that Matomo and
Umami are planned first-stable providers only: alpha.7 does not accept their
provider names, load their scripts, or expose event results for them. The event
guide was also corrected to name the existing GA4 `gtag()` event path. Product
verification remains clean at 97/97 tests plus strict typecheck. These docs are
to be published as a self-contained, provenance-bound snapshot in the public
docs-site repository; no private product source tarball is to enter that public
repository.

Publication completed from the docs repository on 2026-09-12. Product commit
`454893359f8588a71d35d51d1a5e0d16bf355c63` is the documented source
identity. Docs commit `1052ccaaa967fb79edc5b341092e27720e95eab9` added the
nine-page `/analytics-for-astro/` section, and `9216442` corrected the existing
Brand Navigation sync so pinned full commits do not consume GitHub API quota.
GitHub Actions run `34713005898` passed clean install, production audit,
Starlight build, and Wrangler dry-run. Cloudflare Workers Builds deployed
version `b59030fb-e16a-4e17-a9c0-35c8a2efa7c1`; live overview,
configuration, and legacy-name handoff routes returned 200. The docs were built
from GitHub rather than locally deployed.

Repository-driven sandbox source is locally committed but deliberately not yet
pushed: Astro commit `b75544d11a6a42e82bdd0144f2fb7aa3aa954a61` and
Starlight commit `647a94e03fe862232044e56e93f00d28e8146190`. Both pin
this product commit and packed SHA-256
`84B98B37FF5B7D2852BC31E1E9A218A242973FDB313D75E33C513ADABC88B69B`,
ignore the private tarball in their public repositories, and contain verified
GitHub Actions workflows for private checkout, hash validation, consumer gates,
and Wrangler deployment. Phil confirmed credential creation. GitHub then
required interactive sudo reauthentication, which Phil completed.

The organization-owned GitHub App `CodeWorksLabs Sandbox Builds` was created on
2026-09-12 with App ID `4923745`. It has no webhook, OAuth flow, organization
permissions, or user permissions; its only repository permissions are read-only
Contents plus GitHub's mandatory read-only Metadata permission. Installation
`161215866` is restricted to the single private repository
`CodeWorksLabs/astro-analytics`. The App ID and downloaded private key were
installed as encrypted Actions secrets named `CWL_BUILD_APP_ID` and
`CWL_BUILD_APP_PRIVATE_KEY` in both public sandbox repositories and their secret
names/timestamps were verified. The downloaded PEM remains locally at the
product repository root pending Phil's retention/deletion decision and is
excluded locally through `.git/info/exclude`; it must never be committed.

Cloudflare's current API-token permission model cannot scope `Workers Scripts
Edit` to individual Worker script names. The narrowest supported external-CI
token is account-scoped Workers Scripts write access, optionally combined with
zone-scoped Workers Routes access for `codeworkslabs.dev`. Do not broaden the
original two-Worker intent silently: obtain Phil's explicit decision on this
platform limitation before creating the Cloudflare token. Until that token is
stored as `CLOUDFLARE_API_TOKEN` in both sandbox repositories, do not push the
two prepared sandbox commits because each push would trigger its deploy
workflow.

## Public repository and temporary credential correction — 2026-09-12

Phil confirmed that Astro Analytics is a coding-in-public product. The earlier
private pre-RC model was an unsupported task inference, not product policy. The
historical private-build plan above remains provenance only and is superseded by
this correction.

The alpha.7 implementation and documentation history were fast-forwarded onto
local `main`. Current product documentation now identifies `main` as the
authoritative integrated branch and distinguishes the public source repository
from the still-unpublished npm package. The temporary `codex/pre-rc` branch is
to be deleted after the corrected `main` is published.

The two public sandbox repositories contain legitimate local demo work mixed
with an unnecessary private-repository checkout and direct-deploy workflow.
Their published `main` branches do not contain that mechanism. The local commits
must retain their demo implementation while replacing the private checkout with
an exact public-source checkout and leaving deployment to the existing
repository-connected Cloudflare build path. They must not require
`CWL_BUILD_APP_ID`, `CWL_BUILD_APP_PRIVATE_KEY`, or a newly created
`CLOUDFLARE_API_TOKEN`.

The temporary GitHub App, both active private keys, the four repository secret
entries, and the recoverable downloaded PEM are obsolete credential residue.
Their removal is part of the bounded repository correction, not product
development. No credential value was committed: current-tree, Git-history, and
GitHub code searches found no PEM filename or private-key material.

### Correction completion — 2026-09-12

The public repository correction is complete. Integrated `main` was published
at `b01bb82`, the obsolete local and remote `codex/pre-rc` branches were
deleted, and annotated tag `v0.1.0-alpha.7` was published at exact product
commit `454893359f8588a71d35d51d1a5e0d16bf355c63`. No GitHub Release or npm
publication was created.

The Astro sandbox correction is published through commits `853a3e2`,
`dd51db6`, and checkpoint commit `d1c7379`. The Stock Starlight correction is
published through commits `363fd11`, `56ef789`, and checkpoint commit
`a05d182`. Both active workflows now check out annotated public tag
`v0.1.0-alpha.7`, verify that it resolves to exact commit `4548933`, pack on
the Linux runner, and run clean install, production audit, consumer build, and
Wrangler dry-run. They contain no GitHub App credential reference and no
non-dry-run deployment command.

The first two remote runs exposed and rejected a nonportable fixed tarball hash
caused by Windows CRLF versus Linux LF packing. The replacement tag-plus-commit
identity is stable across those environments. GitHub Actions runs
`34731822799` and `34731828128` passed the corrected workflow; final
checkpoint-triggered runs `34732050887` and `34732050773` also passed every
step. Local sequential verification independently passed for both consumers;
their production audits found zero vulnerabilities.

These pushes did not create a Cloudflare version. Existing live Worker versions
remain `d1f95b77-fb8f-4bcf-86fe-eb36452fc7a0` for Astro and
`64d3e206-5b06-4b95-8e96-d06dc8bf75d3` for Stock Starlight; both public roots
returned HTTP 200. No Cloudflare configuration or manual deployment occurred.

Credential retirement is complete. Both `CWL_BUILD_APP_ID` and
`CWL_BUILD_APP_PRIVATE_KEY` were deleted from both sandbox repositories. GitHub
App `CodeWorksLabs Sandbox Builds` and installation `161215866` were deleted,
invalidating both private keys; the App endpoint now returns 404 and the
organization has no matching installation. The matching recycled PEM and its
Recycle Bin metadata were permanently deleted and verified absent.

Astro Analytics may resume ordinary development against public `main`. Future
GitHub release, permission, Actions-architecture, or Cloudflare operations stay
outside the development lane unless assigned as an exact bounded action.

## Matomo alpha.8 working candidate — 2026-09-12

Ordinary product development resumed on public `main` from clean correction
baseline `61d26fe2f3cbabb4e529d60d57b661584a2e3449`. The current working tree is
an uncommitted `0.1.0-alpha.8` Matomo candidate; no tag, GitHub Release, npm
publication, sandbox integration, provider administration, or deployment has
occurred.

The candidate adds strict `matomo` configuration for an exact public HTTPS
`matomo.php` tracker endpoint, positive integer site ID, explicit event
category, optional HTTPS script URL, pageview mode, and existing build-time
consent mode. It creates the standard startup `_paq` queue and adopts Matomo's
validated replacement command proxy, rejects occupied globals and script IDs,
configures the tracker endpoint and site ID, waits for script readiness,
and sends initial and client-navigation pageviews from Astro's post-swap
lifecycle using current URL/title and the preceding virtual URL as referrer.
Failure cleanup removes the package script, listener, and owned queue so a
matching bootstrap can retry. Deferred and external consent remain fail-closed
without a runtime activation API.

Matomo custom events use the reviewed explicit mapping required by its
category/action API: provider `eventCategory` is category, package event name is
action, optional `_name` is Matomo's event name, and optional finite numeric
`_value` is its event value. Other validated properties remain available to
simultaneous providers but are not misrepresented as Matomo fields.

Canonical package documentation is being updated continuously with the code,
including Astro/Starlight configuration, self-hosted endpoint guidance,
runtime/consent behavior, event mapping, API inventory, versioning, and
changelog.

Four visible `codex review --uncommitted` passes were completed. The first three
found and drove corrections for: rejection of Matomo's real post-load `_paq`
proxy; blocking globals left by partial initialization failure; and incorrect
virtual-referrer attribution when one or more Astro navigations precede delayed
Matomo readiness. Regression coverage was added for each. The fourth full review
reported no actionable regression. Strict typecheck and all 106 source tests pass;
`git diff --check` reports no whitespace errors (only the repository's expected
LF-to-CRLF warnings).

The actual alpha.8 package artifact was built and inspected at
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha8-6aa1ff141c35420c9b50caa32eca2e03\codeworkslabs-astro-analytics-0.1.0-alpha.8.tgz`.
It contains 19 intended entries, is 38,201 bytes compressed, and has SHA-256
`45EF9985EF92D4A460F375EA1E5663C2DE63DAD062C05467E1D98EB8594D1487`.
That tarball was installed as version `0.1.0-alpha.8` into isolated copies of the
CodeWorksLabs stock Astro and stock Starlight consumers. Both production builds
passed, both generated Matomo runtime output, both dependency audits reported
zero vulnerabilities, and both Wrangler deployment dry-runs passed. The real
sandbox repositories and deployments were not mutated.

Separate Code Reviewer review, documentation publication, and live self-hosted
Matomo qualification remain outstanding. No commit, push, tag, GitHub Release,
npm publication, canonical sandbox integration, provider administration, or
deployment has occurred in this Matomo phase.

## Matomo alpha.8 Code Reviewer block and remediation — 2026-09-12

The separate doctrine-complete Code Reviewer gate reviewed the exact first
alpha.8 artifact and both isolated consumers under case
`AFA-MATOMO-ALPHA8-20260912`. It issued `BLOCK` with 0 P0, 3 P1, 3 P2, and no
evidence blocker. The prior artifact with SHA-256
`45EF9985EF92D4A460F375EA1E5663C2DE63DAD062C05467E1D98EB8594D1487` is therefore
historical blocked evidence and must not be presented as the candidate.

All six findings were handled in one bounded correction batch:

- A8-01: `pageviews: "none"` now retains an Astro page-load listener and applies
  each completed route's URL, title, and preceding virtual URL to Matomo before
  events without sending `trackPageView`.
- A8-02: completed navigation history is distinct from a pending pageview, so
  Matomo readiness during an in-flight route waits for completion and preserves
  the immediately preceding completed URL as referrer.
- A8-03: completed route state survives script cleanup; matching retries restore
  same-page or navigated pageviews exactly once and wait out in-flight routes.
- A8-04: cleanup claims only structurally recognizable Matomo partial state;
  nonconforming globals installed by another script are preserved.
- A8-05: runtime status now requires the retained Matomo proxy and aliases plus
  a callable `push`; a failed proxy call revokes readiness without affecting
  simultaneous providers.
- A8-06: current alpha.8 qualification now names only Astro 7.3.2 and Starlight
  0.42.0/Astro 7.3.2 on Node 22.22.2. Starlight 0.41.11 is explicitly labeled
  historical alpha.3 evidence from September 11, 2026 while remaining eligible
  under the peer range.

Strict typecheck and all 112 tests pass after correction. A fresh visible
`codex review --uncommitted` inspected the remediation and reported no actionable
regression. The replacement artifact is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha8-remediation-e75a6e7919b64d6a8160bd4039669b76\codeworkslabs-astro-analytics-0.1.0-alpha.8.tgz`

It contains 19 intended entries, is 39,316 bytes compressed / 184,287 bytes
unpacked, has SHA-256
`9EB1C8A9EB8A4A6B547F1E39B01683877775518A7297E3C925713E436BC66AB2`, npm SHA-1
`40e0e6b04a5b0001d249c8154ac0c1b34740a302`, and integrity
`sha512-p0nWPVXcFC2YfJ34xkq+AOzNN2wMI5oMMxnkW1IOTC5IkhWMlOcJWjZPpZSeJaM1YCzZPvrESoHW88vQtTX5AQ==`.

Fresh isolated replacement consumers are under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-consumers-alpha8-remediation-1fcbcfa81ab84f7a9fd9841a47e547ca`.
Both install alpha.8 exactly, report zero dependency vulnerabilities, complete
production builds, emit the replacement Matomo runtime, and pass Wrangler
deployment dry-runs without uploading:

- stock Astro 7.3.2: lock SHA-256
  `03C8AB1FA9A5079D3159B7C66463ADD2FB80F42694C557E4DCCB27A6384F9DF8`;
  emitted `dist/_astro/page.Cs5dBhw6.js`, SHA-256
  `439985A3E98BDCF5AE8BB26F26B2DCF1F700E60DCEA26C6E6C728EF1C0D09F01`;
- stock Starlight 0.42.0/Astro 7.3.2: lock SHA-256
  `93B0EA53295171E0A5792C3A181DFD4234EC5E3C932F2C782766B406A742C68B`;
  emitted `dist/_astro/page.CcZz2qLD.js`, SHA-256
  `AD1334D437A79077B95CB18EFF468081221BF83974B85528C7CD91E7A8629940`.

The corrected tree and replacement artifact/consumers still require a new exact
freeze and Code Reviewer re-review. Live Matomo qualification and documentation
publication remain later gates. No commit, push, tag, GitHub Release, npm
publication, canonical sandbox mutation, provider administration, or deployment
occurred in this correction batch.

## Matomo alpha.8 R1 block and second remediation — 2026-09-13

Code Reviewer re-reviewed the first remediation under case
`AFA-MATOMO-ALPHA8-20260912-R1` and issued `BLOCK` with 0 P0, 1 P1, 2 P2,
and no evidence blocker. The R1 artifact with SHA-256
`9EB1C8A9EB8A4A6B547F1E39B01683877775518A7297E3C925713E436BC66AB2` and its
isolated consumers are historical blocked evidence and must not be presented as
the current candidate.

All three R1 findings were corrected together:

- A8R-01: the coordinator now retains one full-document Astro navigation
  observer for its lifetime, including inactive failure-to-retry intervals, so
  a retry restores the latest completed route and its virtual referrer.
- A8R-02: cleanup ownership is based on assignments made while the package's
  own script is `document.currentScript`, rather than structural similarity.
  Structurally conforming foreign Matomo globals and later foreign replacements
  are preserved, including after stale load/error callbacks.
- A8R-03: an invocation exception revokes readiness, while a later matching
  bootstrap can requalify the exact retained package-owned proxy and aliases,
  restore route context, and continue without a duplicate pageview.

Targeted integration coverage now includes failure followed by multiple
completed routes and retry in `provider`, `astro`, and `none` modes; initial
failure followed by navigation and retry during the next in-flight route;
preservation of structurally conforming foreign Matomo state; exact-proxy
requalification after a transient throwing `push`; and multi-provider recovery
while Fathom and Plausible remain operational.

Strict typecheck and all 116 tests pass. A new visible full
`codex review --uncommitted` inspected this second remediation and reported no
actionable correctness regression. A fresh R2 artifact and new isolated
consumer evidence must be produced before the next Code Reviewer freeze. No
commit, push, tag, GitHub Release, npm publication, canonical sandbox mutation,
provider administration, or deployment occurred in this remediation batch.

### Matomo alpha.8 R2 artifact and consumer evidence — 2026-09-13

The fresh R2 artifact is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha8-r2-210152653a5a44ce8f1c70bb35c095e7\codeworkslabs-astro-analytics-0.1.0-alpha.8.tgz`

It contains 19 intended entries, is 39,776 bytes compressed / 185,491 bytes
unpacked, has SHA-256
`7013BBF251DCEC8DDD4E642344F366E1950D8B790398D3228F87966C2CAF5653`, npm SHA-1
`afdb689f897316a555403831cdd9ebf94d8ac322`, and integrity
`sha512-0/uXCQYtQYr68NGhJ+hqZ3fHoAIZ6o3NQ+fZBfLkhRXMTOojumrHv6+KCFSVbD7yqx2axQq6m+SIYUePDA8eZQ==`.

Fresh isolated consumers are under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-consumers-alpha8-r2-66d6f2079a854ea88f1b41a59bee9a88`.
Both install version `0.1.0-alpha.8` from that exact tarball, report zero
dependency vulnerabilities, complete production builds, emit the R2 Matomo
runtime, and pass Wrangler deployment dry-runs without uploading:

- stock Astro 7.3.2: lock SHA-256
  `67F048A2374A072B7982D54D0DF0C56989F94F52237273B6E2BA59FED5C338B4`;
  emitted `dist/_astro/page.C1LDJMvr.js`, SHA-256
  `D1C9202EB8AE1FE9ADCF50D23C285A7E10D4DEBA404F585888A3B2BFBBE79C24`;
- stock Starlight 0.42.0/Astro 7.3.2: lock SHA-256
  `192B56406FEE055200C6BE96D788AF9CAAB922E0D34D51F4A5223B9284C103C4`;
  emitted `dist/_astro/page.SI6BSblR.js`, SHA-256
  `C413F6CE6125724F4F7CBE1128304B76AADE7CD32ABF10AA16A8CE6F8FEC63F8`.

The R2 consumer exercise initially used numeric placeholder site IDs and the
package correctly rejected them before build. The isolated fixtures were
corrected to digit strings (`'1'` and `'2'`) as required by the public contract;
no product or canonical sandbox file changed as a result.

### R2 Code Reviewer freeze

Implementation is stopped for the R2 Code Reviewer gate. The exact frozen
source identity is public `main` HEAD
`61d26fe2f3cbabb4e529d60d57b661584a2e3449`, HEAD tree
`a3f3267ddf826ffd69f77cadf146a1b7aef8837e`, product diff SHA-1
`f0c3dba8e89ef408fe8417cc1753e7f3d810e7bd` (binary Git diff excluding this
checkpoint), and package-lock SHA-256
`906D86A31A8B00E473C724DB0C83F333CA21636AA27BEAF0687B79A8F77A3919`.
There are 20 modified tracked files, zero staged files, and zero untracked
files. The exact R2 artifact and isolated consumer identities are recorded
above. No implementation changes are queued while this freeze is active.

## Matomo alpha.8 R2 block and third remediation — 2026-09-13

Code Reviewer completed the four declared Static Review gates under case
`AFA-MATOMO-ALPHA8-20260912-R2` and issued `BLOCK` with 0 P0, 1 P1, 1 P2,
and no material evidence blocker. The R2 artifact with SHA-256
`7013BBF251DCEC8DDD4E642344F366E1950D8B790398D3228F87966C2CAF5653` and its
isolated consumers are historical blocked evidence and must not be presented as
the current candidate. The reviewer independently confirmed that all three R1
findings now pass replay.

Both R2 findings were corrected together:

- A8R2-01: matching reentry can requalify only a provider identity that already
  passed the package's genuine script-load validation. The never-validated
  startup array remains not loaded, cannot accept events, and continues
  coalescing completed navigation until real readiness.
- A8R2-02: Matomo setup now requires successful singleton Astro navigation
  observer registration. Missing or throwing registration keeps the adapter
  fail-closed, and matching reentry safely retries after restoration without
  adding duplicate listeners.

New closure coverage exercises repeated matching bootstrap before load across
`provider`, `astro`, and `none` pageview modes with events enabled and disabled;
completed and in-flight navigation; eventual error and eventual successful
load; truthful status and event rejection; current-route-only readiness; and
retention of post-load transient-proxy recovery. Observer coverage exercises
both missing and throwing registration APIs across all pageview modes, then
restoration, matching retry, singleton registration, in-flight completion, and
correct URL/title/virtual-referrer behavior.

Strict typecheck and all 119 tests pass. A fresh visible full
`codex review --uncommitted` also exercised the adapter with a real Matomo script
in headless Chrome, found the source, event behavior, documentation, and tests
internally consistent, and reported no actionable regression. A fresh R3
artifact and isolated consumers must be produced before another Code Reviewer
freeze. No commit, push, tag, GitHub Release, npm publication, canonical sandbox
mutation, provider administration, documentation publication, or deployment
occurred in this remediation batch.

### Matomo alpha.8 R3 artifact and consumer evidence — 2026-09-13

The fresh R3 artifact is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha8-r3-3bbdd2a511e448fbba8ec27aca89fb32\codeworkslabs-astro-analytics-0.1.0-alpha.8.tgz`

It contains 19 intended entries, is 40,072 bytes compressed / 186,782 bytes
unpacked, has SHA-256
`C9AB9C4283E057925930498FC9338653A50C971AE343A8B7E61DF32336E04A20`, npm SHA-1
`e68a96566e261e6e83af3785b93d637af38e0dbb`, and integrity
`sha512-9uZLoZhKStuKOB/kF2Ob90mpW+KCONwGRp5nlZyOoOxaqqBUb5AG2QVX2hmkNUBJbNXsrmMDr+gEjcdXgwnt/g==`.

Fresh isolated R3 consumers are under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-consumers-alpha8-r3-9a94c5dee3954931838bba758caca3f0`.
Both install version `0.1.0-alpha.8` from that exact tarball, report zero
dependency vulnerabilities, complete production builds, emit the R3 Matomo
runtime, and pass Wrangler deployment dry-runs without uploading:

- stock Astro 7.3.2: lock SHA-256
  `8F496F7B4E0AC7F103630F2C745B1160F164E0582501436C5936AA0E4E002DCA`;
  emitted `dist/_astro/page.DHo9sC_9.js`, SHA-256
  `16666DCC61B50B2B2938B5409D13DAC3D4FA3772BB1F00194D36380EAF923B3F`;
- stock Starlight 0.42.0/Astro 7.3.2: lock SHA-256
  `6F8FAA84EA906754E85FBD5EFD4F580CEFA27529C11ADFB82C71AF22BDAEC7EE`;
  emitted `dist/_astro/page.B1Y3Sw-z.js`, SHA-256
  `A1C1823DBDF373E11B9B66AFED5F7A903CB1918815DA0232E68335E96ABD51F5`.

### R3 Code Reviewer freeze

Implementation is stopped for the R3 Code Reviewer gate. The exact frozen
source identity is public `main` HEAD
`61d26fe2f3cbabb4e529d60d57b661584a2e3449`, HEAD tree
`a3f3267ddf826ffd69f77cadf146a1b7aef8837e`, product diff SHA-1
`3c19ebb3f64b27c2ee9fb45f3e6a1fb15be6814e` (binary Git diff excluding this
checkpoint), and package-lock SHA-256
`906D86A31A8B00E473C724DB0C83F333CA21636AA27BEAF0687B79A8F77A3919`.
There are 20 modified tracked files, zero staged files, and zero untracked
files. The exact R3 artifact and isolated consumer identities are recorded
above. No implementation changes are queued while this freeze is active.

## Matomo alpha.8 R3 residual and fourth remediation — 2026-09-13

Code Reviewer completed all four declared R3 Static Review gates with `PASS
WITH P2/P3 FINDINGS`: 0 P0, 0 P1, 1 P2, 0 P3, and no material evidence blocker.
The exact R3 artifact and consumers passed the gate but retain one known P2 and
therefore are historical superseded evidence, not the current candidate. The
product authority did not accept or defer that residual risk.

A8R3-01 showed that one or more Astro routes could complete while initial
navigation-observer registration was unavailable. Restored reentry installed
the observer, but the adapter could not know whether the current URL was already
complete or in flight. The correction now records an observation gap, remains
not loaded after listener recovery, and waits for the next real
`astro:page-load` completion before starting Matomo. The first supported route
after the gap receives an explicit unknown-referrer state, which suppresses both
virtual-edge inference and fallback to a stale external `document.referrer`.
This remains true when navigation returned to the last known URL.

Closure coverage exercises missing and throwing listener APIs; one and multiple
missed routes; an in-flight destination after recovery; return to the original
URL; all three pageview modes; a nonempty external document referrer; truthful
not-loaded status until supported completion; singleton observer installation;
correct current URL/title; no invented `setReferrerUrl`; and exact pageview or
events-only behavior.

Strict typecheck and all 119 tests pass. A fresh visible full
`codex review --uncommitted` verified the correction and the real Matomo runtime
and reported no actionable correctness regression. A fresh R4 artifact and
isolated consumers must be produced before another Code Reviewer freeze. No
commit, push, tag, GitHub Release, npm publication, canonical sandbox mutation,
provider administration, documentation publication, or deployment occurred in
this remediation batch.

### Matomo alpha.8 R4 artifact, consumers, and review freeze — 2026-09-13

The fresh R4 artifact is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha8-r4-a01b84572d5c40b7acd53cbce14d615c\codeworkslabs-astro-analytics-0.1.0-alpha.8.tgz`

It contains 19 intended entries, is 40,413 bytes compressed / 188,164 bytes
unpacked, has SHA-256
`4BE33B40706CBAF3C0A3419ABB37BBADAD6163124C0551500FE232F66F8C52F2`, npm SHA-1
`e4737bbd2b209c29a619f4c633e77bb5b74f74f6`, and integrity
`sha512-iSRmVmt5vYVeHWPVl27XGAkWH4rikvOfh1kfCrbiWlC+iOuUlPJljouFw24aki0AUY8fFaN6F0TE36TaED+UcA==`.

Fresh isolated R4 consumers are under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-consumers-alpha8-r4-45edfe92944a4f06b60c2e145c64c090`.
Both install exact version `0.1.0-alpha.8`, report zero dependency
vulnerabilities, complete production builds, emit the R4 Matomo runtime, and
pass Wrangler deployment dry-runs without uploading:

- stock Astro 7.3.2: lock SHA-256
  `4D3A2EC6035CD8DE9CE800FBD446D33BE51F43533E9FE34FCD78B89A620EE37F`;
  emitted `dist/_astro/page.CO8aatp3.js`, SHA-256
  `C5351B37E54A87087449557CD207E50F16681FC4107BE850BD25141F81101953`;
- stock Starlight 0.42.0/Astro 7.3.2: lock SHA-256
  `F87D57839D35ED345481BBB5113450A524AB1B6C0B0F57B2E24C1EE25330D076`;
  emitted `dist/_astro/page.DoRVe-Oj.js`, SHA-256
  `37F135D40E8666C7102EDA8364A954B9186A1D745442D658A6A669544FE90410`.

Implementation is stopped for the R4 Code Reviewer gate. The exact frozen
source identity is public `main` HEAD
`61d26fe2f3cbabb4e529d60d57b661584a2e3449`, HEAD tree
`a3f3267ddf826ffd69f77cadf146a1b7aef8837e`, product diff SHA-1
`2466b217bb6275d96309b8fc6b27bf55e7f3c9e6` (binary Git diff excluding this
checkpoint), package-lock SHA-256
`906D86A31A8B00E473C724DB0C83F333CA21636AA27BEAF0687B79A8F77A3919`, runtime
SHA-256 `F84664EA164625C33DC05E46E664D8C93AA279D04DDE99950D8EF0EBFDD1BFEE`, and
integration-test SHA-256
`7108A172928510F8E37DE9D9DBECF03778A5B6D9D274BDA58859460FD75661AE`.
There are 20 modified tracked files, zero staged files, and zero untracked
files. No implementation changes are queued while this freeze is active.

## Matomo alpha.8 R4 residual and fifth remediation — 2026-09-13

Code Reviewer completed all four R4 Static Review gates with `PASS WITH P2/P3
FINDINGS`: 0 P0, 0 P1, 1 P2, 0 P3, and no material evidence blocker. R4 is
historical superseded evidence; the product authority did not accept or defer
the P2.

A8R4-01 established that omitting a `setReferrerUrl` command did not clear
Matomo's own default referrer. With a nonempty original `document.referrer`, the
real vendor still transmitted that stale external value on the first supported
route after an observation gap. The correction preserves the explicit unknown
sentinel through `sendPageview` and maps it to `setReferrerUrl("")` at the vendor
boundary. This clears Matomo's internal referrer state without inventing a
virtual predecessor. Subsequent observed navigation again uses the exact known
preceding URL.

Closure tests cover missing and throwing observer registration, one/multiple
missed routes, in-flight recovery, return to the original URL, all pageview
modes, a nonempty external referrer, explicit empty vendor referrer on the first
supported route, and the correct known virtual referrer on the next route.

Strict typecheck and all 119 tests pass. A fresh visible full
`codex review --uncommitted` inspected Matomo's real `setReferrerUrl`
implementation, confirmed the vendor-boundary effect, and reported no actionable
regression. A fresh R5 artifact and isolated consumers must be produced before
another Code Reviewer freeze. No commit, push, tag, GitHub Release, npm
publication, canonical sandbox mutation, provider administration,
documentation publication, or deployment occurred in this remediation batch.

### Matomo alpha.8 R5 artifact, consumers, and review freeze — 2026-09-13

The fresh R5 artifact is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha8-r5-ea81aa8abb6849e0be675bb54511bf6b\codeworkslabs-astro-analytics-0.1.0-alpha.8.tgz`

It contains 19 intended entries, is 40,534 bytes compressed / 188,595 bytes
unpacked, has SHA-256
`FE5C5FD1F8DFECDD2BF0C233663FE88507A5C9744DD6FE8C98E2D42AD71E0717`, npm SHA-1
`3cfa5968b07ae3787f9827cf83ceb64c4c43bfff`, and integrity
`sha512-KImKM3WLhfwGWSFubaMShL7f8LsDjX0y+PPm8nCnGjecG92hDqruL21b1oqxnwYIjbiJbaH+43QOlInl1iE63g==`.

Fresh isolated R5 consumers are under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-consumers-alpha8-r5-158a343df3df461682fe94bf78c9785e`.
Both install exact version `0.1.0-alpha.8`, report zero dependency
vulnerabilities, complete production builds, emit the R5 Matomo runtime, and
pass Wrangler deployment dry-runs without uploading:

- stock Astro 7.3.2: lock SHA-256
  `E3AE90C07109E00AC634BFD5F87A4EB6D2755B62907967CC7AF85A2B27E25DD1`;
  emitted `dist/_astro/page.BcUtzoZk.js`, SHA-256
  `F3AEC450DFB5E7FCC5910AC5ADB2E207D9D75A91F3D0C67357A9E9FED5DC4334`;
- stock Starlight 0.42.0/Astro 7.3.2: lock SHA-256
  `424D0CE4C013CFAA6D55156BCF665A8F9A691CE377E51D25274CB345659E545D`;
  emitted `dist/_astro/page.Be4poJKJ.js`, SHA-256
  `A310795E8E868CBC5AA6DA8306EAD40659B649AE69C8E1E5BE72F7C7A980698A`.

Implementation is stopped for the R5 Code Reviewer gate. The exact frozen
source identity is public `main` HEAD
`61d26fe2f3cbabb4e529d60d57b661584a2e3449`, HEAD tree
`a3f3267ddf826ffd69f77cadf146a1b7aef8837e`, product diff SHA-1
`7e909610d05ba0361b7172b6d28474697ee5b737` (binary Git diff excluding this
checkpoint), package-lock SHA-256
`906D86A31A8B00E473C724DB0C83F333CA21636AA27BEAF0687B79A8F77A3919`, runtime
SHA-256 `632AA7DDF9FAAE03CA5DCCA07470BE5F729C76633C0B575CE70C8D29CED593AA`, and
integration-test SHA-256
`653D5633C75AF1899605127B24BA91B0D04EF1967FFF5E6E759B105953CD9BE4`.
There are 20 modified tracked files, zero staged files, and zero untracked
files. The R4 freeze ended solely because A8R4-01 was corrected; no
implementation changes are queued while this R5 freeze is active.

No commit, push, tag, GitHub Release, npm publication, canonical sandbox
mutation, provider administration, documentation publication, or deployment
occurred while producing or validating R5.

## Matomo alpha.8 R5 Code Reviewer disposition — 2026-09-13

Code Reviewer completed the doctrine-complete independent review under case
`AFA-MATOMO-ALPHA8-20260912-R5`. All four declared Static Review gates issued
`INTERNAL CODE REVIEW PASS`. The complete finding census is 0 P0, 0 P1, 0 P2,
and 0 P3, with no accepted or deferred risks and no material unresolved evidence
blocker.

The reviewer independently closed A8R4-01 on the exact frozen R5 candidate. It
replayed the package runtime and both emitted consumer bundles with the frozen
real Matomo script and confirmed that `setReferrerUrl("")` clears the stale
external referrer on the first supported post-gap request, while the next
observed route sends its exact known preceding URL. It also independently ran
all 119 tests, strict TypeScript checking, malformed-configuration and fault
injection probes, package/member/installed-consumer reconciliation, installed
API compiler checks, documentation-link checks, and source/vendor/consumer
runtime replays. All passed.

The reviewer reverified the frozen identities recorded above without source,
Git, service, provider, sandbox, or checkpoint mutation. Its closing source and
artifact identities match the R5 freeze exactly. The R5 Static Review gate is
therefore complete and the implementation freeze ends only for this disposition
record. Any candidate change requires a new identity, evidence set, and
applicable review.

This is a clean static candidate disposition, not live Matomo qualification or
release authorization. No commit, push, tag, GitHub Release, npm publication,
canonical sandbox mutation, provider administration, documentation publication,
or deployment was authorized or performed by the review.

## Matomo alpha.8 release identity and live qualification — 2026-09-13

The reviewed R5 candidate was committed to public `main` as
`f480c3ce152c49637efcfea6dc38c7577fa28d82`, tagged with annotated public tag
`v0.1.0-alpha.8`, and pushed. No npm publication or GitHub Release occurred.
Both canonical CodeWorksLabs sandbox repositories retain the exact reviewed
40,534-byte package archive with SHA-256
`FE5C5FD1F8DFECDD2BF0C233663FE88507A5C9744DD6FE8C98E2D42AD71E0717`, making
fresh Cloudflare Git checkouts independently installable. Their GitHub clean
verification runs passed.

Cloudflare Workers Builds now connects each Worker directly to its matching
CodeWorksLabs repository on production branch `main`, root `/`, build command
`npm run build`, and deploy command `npm run deploy`. The corrected live
repository-driven versions are Astro
`fd130e33-afb2-45c5-bed8-223dc0970b4f` from sandbox commit `b583414` and stock
Starlight `997b454e-6dba-4188-8211-07d99511f33b` from sandbox commit `4138950`.
GitHub verification runs `34767915445` and `34767917638` passed for those exact
commits.

Live Chrome qualification selected Matomo explicitly on both permanent journey
pages. Each browser client reported Matomo `ready`, accepted the named event,
advanced to `/analytics/next/`, and displayed Matomo's accepted-event receipt.
The self-hosted Matomo dashboard independently recorded the full sequences:

- site ID `2`: `/analytics/`, event
  `Astro sandbox - cwl_astro_journey_continued`, then `/analytics/next/`;
- site ID `3`: `/analytics/`, event
  `Starlight sandbox - cwl_starlight_journey_continued`, then
  `/analytics/next/`.

This completes alpha.8 Matomo package-consumer, repository-driven deployment,
browser-runtime, and provider-side qualification. Fathom was blocked in the
qualification Chrome profile, while Plausible and Google Analytics 4 accepted
the same fan-out events; the Fathom profile result does not qualify or
disqualify Matomo. Product documentation now treats Matomo as implemented and
live-qualified. Umami remains the only accepted first-stable provider not yet
implemented.

## Umami alpha.9 R1 implementation and review freeze — 2026-09-13

The working `0.1.0-alpha.9` candidate adds the fifth accepted first-stable
provider, Umami, for Umami Cloud and self-hosted Umami 3.2 or later. The
configuration requires a public website UUID and HTTPS tracker URL, accepts an
optional HTTPS collection host, disables vendor automatic pageviews, sends
Astro-owned pageviews with current URL/title/referrer, maps package events to
`umami.track(name, data)`, and enforces Umami's provider-specific event limits.
Deferred and external consent fail closed without a script or global.

The runtime accepts only the exact tracker assigned by the package-owned script
during its own execution, verifies the retained client and `track` function on
every use, preserves unrelated replacement state, supports clean failure retry,
deduplicates matching pre-load reentry, waits for prerender activation, and
recovers navigation observation only at the next observed Astro page-load.
Documentation, configuration tests, type-level examples, and runtime tests were
updated in the same working candidate.

The product gate passes strict TypeScript checking and all 130 tests. Both full
and production-only npm audits report zero vulnerabilities, and `git diff
--check` reports no errors. The fresh R1 artifact is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha9-r1-837e8413dffb46369fc6d99cf31d4b38\codeworkslabs-astro-analytics-0.1.0-alpha.9.tgz`

It contains 19 intended entries, is 43,841 bytes compressed / 212,954 bytes
unpacked, has SHA-256
`7B0AAD247B939CC7B6F8649FEEEC471CA0B0D235FBAD14E862D6F4C41255FD6D`, npm SHA-1
`0a26cfeb113820ce94bddfd6fffb69c2bc83b181`, and integrity
`sha512-CifRIvetkhH6oEK520i1v6e2H22ooW42HV3WUdLlsDJIW4mZ9m8IxLaoH8b51N20fxVsH56Y8IQx8Dp1HEKmjQ==`.

Fresh isolated R1 consumers are under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-consumers-alpha9-r1-e2337bda8798481db8b888bd599412af`.
Both install exact version `0.1.0-alpha.9`, report zero production dependency
vulnerabilities, complete production builds, emit the Umami runtime, and pass
Wrangler deployment dry-runs without uploading:

- stock Astro: lock SHA-256
  `65261A5218BC95C81B2FD9EFFBEBFE82C120F2B872CA5EA8408843BAC94DC8A4`;
  emitted `dist/_astro/page.DjbPHnq4.js`, SHA-256
  `95DA9C1F42A5EE679F7787F6BC08B6D6466B267150F42C50F66A6A7B37734325`;
- stock Starlight: lock SHA-256
  `A06D6E246B4DC10596937AE727319F684A4CF2B50073F83D767C6703E50F9EA0`;
  emitted `dist/_astro/page.BUIK7--2.js`, SHA-256
  `B77C30433E429365F693EAE53F6C6B313A2E938B7366018480D6CDA2CC57C5D2`.

Implementation is frozen for independent review. The exact source identity is
public `main` HEAD `9641c5caf150e8b0df5d80c3a03a1e0b687ac782`, HEAD tree
`c02ff110687a5c57d72aa3000448ab818929616c`, product diff SHA-1
`d7badaa2ae4eeef75dcaf97a47864d5b48b234c6` (byte-preserving binary Git diff excluding this
checkpoint), package-lock SHA-256
`ACDC776375D22BAEC00A4B09AA9B8C491FC5B65E1072243B7306D420155538BC`, runtime
SHA-256 `50AC2448488C809838477F8E80554D85090C74DFB5324213ED6306D9BADB9E30`, and
integration-test SHA-256
`8C9A96087879ED9A6B4615B5E7AD09B7659FD5E5068D66FA5570C16BEEE27548`.
There are 20 modified tracked files, zero staged files, and zero untracked
files. No commit, push, tag, GitHub Release, npm publication, canonical sandbox
mutation, provider administration, documentation publication, or deployment
occurred while producing or validating R1.

## Umami alpha.9 R1 review block and R2 correction freeze — 2026-09-13

Code Reviewer completed composite review
`AFA-UMAMI-ALPHA9-20260913-R1` with a census of 0 P0, 2 P1, 2 P2, and 0 P3.
Its disposition was `INTERNAL CODE REVIEW BLOCK` based on:

- U9-01 P1: custom events used Umami's private navigation state and could be
  attributed to a stale route/referrer after browser-history traversal or
  delayed readiness;
- U9-02 P1: assignment provenance did not revalidate configured script source,
  website, host, automatic-pageview setting, executable mode, or DOM binding;
- U9-03 P2: initial readiness could send before the documented Astro page-load
  completion boundary;
- U9-04 P2: a synchronous pageview exception consumed the pending record and
  matching reentry could not retry it.

All four findings were accepted and corrected coherently. Pageviews and events
now use the same completed Astro URL/title/referrer edge; event-only mode observes
Astro completions without sending pageviews. Initial tracking waits for the first
Astro page-load signal. The exact package script configuration and DOM identity
are verified at assignment, load, and every later use. A synchronously rejected
pageview remains pending for bounded matching-bootstrap retry. Documentation was
updated to state these contracts accurately.

The replacement product gate passes strict TypeScript checking and all 135
tests. Full and production-only npm audits report zero vulnerabilities, and
`git diff --check` reports no errors. New regression evidence covers each R1
trigger and closure property, including forward/back traversal, delayed and
in-flight readiness, event-only context, source/site/host/auto-pageview/type/DOM
substitution, post-load restoration, initial completion timing, synchronous
retry, stale generations, prerender, and observation-gap recovery.

The fresh R2 artifact is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha9-r2-f0c29c54d23041c1a04ce9df769cdb0e\codeworkslabs-astro-analytics-0.1.0-alpha.9.tgz`

It contains 19 intended entries, is 44,835 bytes compressed / 217,981 bytes
unpacked, has SHA-256
`3F360F85F1F4DFD8C18AED948A82B5C76EA4E3381AB2A520F0B8916A2CCE6ACF`, npm SHA-1
`db964c137c35ea1e31fd26838578d36e87a77bd1`, and integrity
`sha512-KoDJlPmN+j2jvdtOSu8mIFVba+iBE3h//73jvNB8RK5N5gOgEEiVaKyCs7I3dXK1nNN9KmJ28Pkp3GItrRZMuw==`.

Fresh isolated R2 consumers are under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-consumers-alpha9-r2-1828fef91c6c435cb9bbd47133d12410`.
Both install exact version `0.1.0-alpha.9`, report zero production dependency
vulnerabilities, complete production builds, emit the corrected Umami runtime,
and pass Wrangler deployment dry-runs without uploading:

- stock Astro: package SHA-256
  `3722F4FD00C6F23CBE56D2AC08B43773A9A626C3AC442C2DFEE415848057BCA4`,
  lock SHA-256
  `388B5C820AE1416436C6F5E9557DA6A83157BEAAB0AD8F9AEAFA7FBE5007AA04`,
  emitted `dist/_astro/page.td-qhlHX.js`, SHA-256
  `596E0CB23875ACB0E40281DE98B63654B94662F5321B8BE7D18B2A77AE4E2BF9`;
- stock Starlight: package SHA-256
  `066C03F565E8C757C840E8E4C1477664CBC03D289FBC5EF8DE36ABEF487B01AB`,
  lock SHA-256
  `F6327DA81ED3C6EEB0F233945CA447AFA10A299B0F3597DB0A81C69F2E2607CD`,
  emitted `dist/_astro/page.CMHS04-I.js`, SHA-256
  `4FA0AD1FDD1F6001633D52D690FD7EE2BBE9609A58D8E47667DD465858D8CDF8`.

R2 is frozen for correction closure. The exact source identity is public `main`
HEAD `9641c5caf150e8b0df5d80c3a03a1e0b687ac782`, HEAD tree
`c02ff110687a5c57d72aa3000448ab818929616c`, product diff SHA-1
`9a973474a106e25c4037891bc330089b421aa96f` (byte-preserving binary Git diff
excluding this checkpoint), package-lock SHA-256
`ACDC776375D22BAEC00A4B09AA9B8C491FC5B65E1072243B7306D420155538BC`, runtime
SHA-256 `0B5A4134A4B870E75697E65E1924FF31F37F17D4DEFE6063626BB03DCE961216`, and
integration-test SHA-256
`1E12744FDE3C2B271931F340017B040E1DA28E975FA614BA450D873A4B53E080`.
There are 20 modified tracked product files, zero staged files, and zero
untracked files; this checkpoint is the declared excluded record. No commit,
push, tag, GitHub Release, npm publication, canonical sandbox mutation, provider
administration, documentation publication, or deployment occurred while
correcting and validating R2.

## Umami alpha.9 R2 review block and R3 correction freeze — 2026-09-13

The visible internal review found one P2 race: if route A completed before the
tracker became ready and `location.href` then changed for an uncompleted route B,
the readiness flush discarded A's confirmed pending pageview. Code Reviewer
completed composite review `AFA-UMAMI-ALPHA9-20260913-R2` with 0 P0, 2 P1, 0 P2,
and 0 P3. It independently established that stock non-ClientRouter Astro and
Starlight consumers do not emit `astro:page-load`, leaving Umami permanently not
ready, and that Astro ClientRouter's ordinary head swap removes the dynamic
tracker element, causing the strict connected-DOM proof to reject the genuine
load-proven tracker. R2 is blocked and superseded.

All three findings were corrected as one lifecycle batch. An ordinary MPA now
establishes its initial completed route at DOM readiness, while a page containing
Astro's ClientRouter marker waits for `astro:page-load` on the initial route and
each client navigation. The original exact tracker element remains acceptable
after legitimate head disposal only while its immutable object identity,
ownerDocument, source, executable settings, package data attributes, load-proven
client, and track method remain exact and no replacement owns its DOM ID. A
foreign binding still closes readiness. A confirmed pending pageview now survives
an uncompleted URL change and is superseded only by a later observed completion.
Documentation was reconciled to these MPA and ClientRouter contracts.

The R3 product gate passes strict TypeScript checking and all 140 tests. Full and
production-only npm audits report zero vulnerabilities, and `git diff --check`
reports no errors. New direct regression evidence covers ordinary loading and
already-ready documents without a synthetic Astro event, ClientRouter initial
timing, normal head disposal, foreign replacement binding, delayed tracker load
crossing a head swap, subsequent and back navigation, events-only readiness, and
retention of the last confirmed route during an in-flight transition.

The fresh R3 artifact is:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha9-r3-a43593af44e44dedbc6cb21a04acd87f\codeworkslabs-astro-analytics-0.1.0-alpha.9.tgz`

It contains 19 intended entries, is 45,307 bytes compressed / 219,600 bytes
unpacked, has SHA-256
`C11579E99582CCDB2925A6033B260ADB245D5992015F02FC4542CB3476A5CBFF`, npm SHA-1
`1df30e562556a9c534d41a0aa0617c7200a50f03`, and integrity
`sha512-pbK632fySEXFRtVu2a5N/PnWZhLtKF84bsI4+jshiW7H9pUQcWBEEOSBrprCW0P0TDd2IKjHMGyC8u8Q/SJc/w==`.

Fresh isolated R3 consumers are under
`C:\Users\Owner\AppData\Local\Temp\astro-analytics-consumers-alpha9-r3-7b671c4f8f084da982e4133a5224d313`.
Both install exact version `0.1.0-alpha.9` with installed runtime SHA-256
`4DC88354F6C562FC42A1BA64889819958C36FC966706038FC55C1B103F598400`, report zero
production dependency vulnerabilities, complete production builds, and pass
Wrangler deployment dry-runs without uploading:

- stock Astro: lock SHA-256
  `937B75F6530D31A497D016AC96A47E55B9A00CE7844B38180BFF523E48C2E1A5`;
  emitted `dist/_astro/page.5s7CmLTQ.js`, SHA-256
  `3364394826B3A496C4319BC22914DCE7BEA70E6FCC5B7D30AE766158C7E529E4`;
- stock Starlight: lock SHA-256
  `CA66A3830518537E602133D75878E54B99F04871A63EE2A8E198628679CB4E97`;
  emitted `dist/_astro/page.DFWhsHy_.js`, SHA-256
  `074055F14CFA946695DACF727BF664539E16ED9A2BAC73457EE979161B3F2680`.

R3 is frozen for replacement review. The exact source identity is public `main`
HEAD `9641c5caf150e8b0df5d80c3a03a1e0b687ac782`, HEAD tree
`c02ff110687a5c57d72aa3000448ab818929616c`, product diff SHA-1
`0F5DF7C13266D61D9093E077ED71E1C783DD1351` (byte-preserving binary Git diff
excluding this checkpoint), package-lock SHA-256
`ACDC776375D22BAEC00A4B09AA9B8C491FC5B65E1072243B7306D420155538BC`, runtime
SHA-256 `4DC88354F6C562FC42A1BA64889819958C36FC966706038FC55C1B103F598400`, and
integration-test SHA-256
`0872361DB589DA71FABB5F432F3745E28038A81164FE68BD5DF0BF48D7C85A03`.
There are 20 modified tracked product files, zero staged files, and zero
untracked files; this checkpoint is the declared excluded record. No commit,
push, tag, GitHub Release, npm publication, canonical sandbox mutation, provider
administration, documentation publication, or deployment occurred while
correcting and validating R3.

## Umami alpha.9 R3 pass and R4 test-oracle correction — 2026-09-13

Code Reviewer completed composite review `AFA-UMAMI-ALPHA9-20260913-R3` with a
grouped census of 0 P0, 0 P1, 0 P2, and 1 P3 and disposition
`INTERNAL CODE REVIEW PASS WITH P2/P3 FINDINGS`. All four R1 findings, both R2
P1 findings, and the visible internal pending-pageview P2 were independently
closed against the exact source, artifact, both emitted consumers, the official
Umami tracker, and actual installed Astro head-swap semantics. All six composite
sub-gates passed. The sole P3, U9R3-01, found that a detached-script entry in the
pre-execution negative table appeared to prove rejection but remained not-ready
only because the test had not established a completed route; unchanged detachment
is intentionally accepted for ClientRouter head disposal.

The P3 test oracle was corrected without changing any shipped package member.
The detached-original case was removed from the substitution-negative table,
where it conflicted with the accepted lifecycle contract. Every remaining true
substitution case now records an otherwise-valid completed route before mutation
and activation, so its `adapter-not-loaded` assertion would fail if rejection
were absent. The separate head-disposal and delayed-load tests continue to prove
intentional detached-original acceptance. Strict TypeScript checking and all 140
tests pass, and `git diff --check` reports no errors.

R4 is frozen for the applicable localized closure review. The package archive is
byte-identical to reviewed R3 because tests are not shipped:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha9-r4-d772baaf269246e7aa171b0fa2b7124a\codeworkslabs-astro-analytics-0.1.0-alpha.9.tgz`

It remains 45,307 bytes with SHA-256
`C11579E99582CCDB2925A6033B260ADB245D5992015F02FC4542CB3476A5CBFF`; therefore
the exact R3 installed consumers, locks, configurations, Wrangler bindings, and
emitted bundles remain the applicable unchanged artifact-consumer evidence.
The R4 product diff SHA-1 is
`E9C8F3DD7F7DB2F031A16696E13D85F11B39E647` (byte-preserving binary Git diff
excluding this checkpoint), runtime SHA-256 remains
`4DC88354F6C562FC42A1BA64889819958C36FC966706038FC55C1B103F598400`, and
integration-test SHA-256 is
`912B31B2E8292913E7728BFD396F2C45AECF438D863C53C7ACBEC2B7C85521CB`.
No product changes are queued. There are 20 modified tracked product files, zero
staged files, and zero untracked files; this checkpoint remains excluded. No
commit, push, tag, GitHub Release, npm publication, canonical sandbox mutation,
provider administration, documentation publication, or deployment occurred.

## Umami alpha.9 R4 review closure — 2026-09-13

The localized independent Code Reviewer closure `AFA-UMAMI-ALPHA9-20260913-R4`
closed U9R3-01 with a census of 0 P0, 0 P1, 0 P2, and 0 P3 and disposition
`INTERNAL CODE REVIEW PASS`. It verified that the revised mutation table now
establishes route completion before each genuine substitution, that every
negative fails under a counterfactual false-acceptance runtime, and that the
separate legitimate-detachment and delayed-load positives remain intact. Its
fresh gates passed TypeScript checking, all 140 tests, and `git diff --check`.

The separate visible internal `codex review --uncommitted` also completed with
no actionable correctness defects. It independently reported consistent Umami
wiring across configuration, runtime injection, event typing, documentation,
and tests; TypeScript checking, all 140 tests, and diff validation passed.

The reviewed R4 source identity remains the product diff SHA-1
`E9C8F3DD7F7DB2F031A16696E13D85F11B39E647`, runtime SHA-256
`4DC88354F6C562FC42A1BA64889819958C36FC966706038FC55C1B103F598400`,
integration-test SHA-256
`912B31B2E8292913E7728BFD396F2C45AECF438D863C53C7ACBEC2B7C85521CB`, and
byte-identical R4 artifact SHA-256
`C11579E99582CCDB2925A6033B260ADB245D5992015F02FC4542CB3476A5CBFF`.

The next authorized phase is to commit the reviewed product and checkpoint to
public `main`, create and push annotated tag `v0.1.0-alpha.9`, obtain the two
public Umami website configurations from Analytics Tools, upgrade and qualify
the two canonical repository-driven sandboxes, and then reconcile and publish
the documentation. npm publication and a GitHub Release remain outside the
current authorization.

Immediately before the source commit/tag, four release-status passages were
reconciled from pre-gate wording (`working` / `untagged` / review still needed)
to the evidence above: source-tagged alpha.9, independent review and clean
consumer qualification complete, repository-sandbox and provider-side live
qualification still pending. This documentation-only reconciliation did not
change any shipped package member or test. The full `npm run verify` gate again
passed all 140 tests and strict TypeScript checking, and `git diff --check`
again passed. The R4 artifact and runtime hashes above remain exact.

### Tag-archive identity correction

The preceding sentence that the release-status reconciliation changed no
shipped package member is incorrect. npm always includes the root README, and
this package also explicitly includes `docs/`; the final wording therefore
changed four documentation members while leaving every runtime, type, test,
dependency, export, and manifest member unchanged. The immutable public tag
must be qualified using the archive packed from actual tag commit
`43473be89dd9e29144c92f3ac0f6e6ab0776f104`, not the pre-tag R4 archive:

`C:\Users\Owner\AppData\Local\Temp\astro-analytics-alpha9-tag-43473be\codeworkslabs-astro-analytics-0.1.0-alpha.9.tgz`

The tag archive contains the same 19 intended members, is 45,298 bytes, has
SHA-256
`0F52A54583AB7A875BEC39B55E2B1095B872D47C712588335B634B8EC9AE253A`, npm
SHA-1 `deaec6489bd04f65ceb3d33e7f3af3f75afd8a96`, and integrity
`sha512-tQOoC/1EadcOP0sHjhGbD0ecI0HzJsONFXyP/pJzk6+hygbeEn/y6d73DQryOYuFE92UucJF0t/qWN56NkcaGQ==`.
The canonical sandboxes are being bound to this exact tag-built artifact. A
localized Code Reviewer tag/archive closure and a visible internal committed
review were opened against the immutable tag identity.
