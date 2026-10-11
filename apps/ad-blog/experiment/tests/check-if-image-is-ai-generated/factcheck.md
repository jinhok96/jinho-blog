# Fact-check sheet: check-if-image-is-ai-generated.mdx (2026-10-11)

Legend for "How verified":
- **Opened**: page/file opened directly in this session (WebFetch, git clone, curl of raw file, or package download).
- **Search extract**: only seen as a WebSearch extract limited to the official domain (domain not reachable from WebFetch or the shell). Claim is attributed ("Google says", "According to Google") and kept high level.
- **Own test**: observed in our test; scripts and raw output in this folder (`scripts/`, `out/`).

Reachability note: WebFetch and the shell could NOT open blog.google, synthid.com, deepmind.google, support.google.com, openai.com, help.openai.com, developers.openai.com, c2pa.org, contentauthenticity.org, inspect.cr, leginfo.legislature.ca.gov or news sites (DNS failure / proxy). GitHub and PyPI worked. CAI documentation was read from its source repo (github.com/contentauth/opensource.contentauth.org, main @ 0da710d4, committed 2026-10-07). OpenAI's API behavior was read from OpenAI's official Python SDK (openai 3.28.0 wheel from PyPI; same file on GitHub main returned HTTP 200).

| # | Claim in post | Source URL | How verified |
|---|---|---|---|
| 1 | SynthID Detector (synthid.com) looks for an invisible SynthID watermark | https://synthid.com/ ; https://deepmind.google/models/synthid/ | Search extract (official domains), corroborated by several news extracts |
| 2 | Inspect (inspect.cr) is Adobe's Content Credentials viewer, in beta ("Inspect tool on Adobe Content Authenticity (Beta)"), a C2PA conforming validator | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/getting-started/aca-inspect.mdx | Opened (repo clone) |
| 3 | A screenshot and seven other everyday edits erased Content Credentials completely | out/results.txt, out/results.json | Own test |
| 4 | The C2PA Verify tool is at verify.contentauthenticity.org | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/conformance/trust-lists.mdx ; docs/getting-started/index.mdx | Opened (repo clone) |
| 5 | Inspect reads JPEG, PNG, WebP, HEIC, AVIF and others; shows "No Content Credential" when there is no manifest store | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/getting-started/aca-inspect.mdx | Opened (repo clone) |
| 6 | SynthID Detector checks images, video and audio for watermarks from Google and partners including OpenAI, NVIDIA and Kakao | https://blog.google/innovation-and-ai/models-and-research/google-deepmind/synth-id-ai-content/ ; https://deepmind.google/models/synthid/ | Search extract (two official domains agree); "soon Apple" dropped |
| 7 | You can upload an image to the Gemini app and ask whether it was made with Google AI | https://support.google.com/gemini/answer/16722517 ; https://blog.google/innovation-and-ai/products/ai-image-verification-gemini-app/ | Search extract (official domains) |
| 8 | OpenAI has a verification tool (openai.com/research/verify) that looks for C2PA and SynthID | https://openai.com/research/verify/ | Search extract (official domain); the two-signal part is also confirmed by OpenAI's SDK (row 18) |
| 9 | Images made with OpenAI tools can carry both C2PA and SynthID | https://github.com/openai/openai-python/blob/main/src/openai/types/content_provenance_check.py ("Image results include C2PA and SynthID"); https://help.openai.com/en/articles/8912793-c2pa-and-synthid-in-openai-generated-images (title) | Opened (SDK) + search extract (help article) |
| 10 | Google Lens and TinEye do reverse image search | (none) | General knowledge, not opened; no features or menus claimed |
| 11 | Visual clues (garbled text, hands, shadows, backgrounds) are common signs but unreliable alone | (none) | Advice framed as non-proof; no factual claim about model quality kept |
| 12 | SynthID is from Google DeepMind and sits in the content itself, not a separate label | https://deepmind.google/models/synthid/ ; https://help.openai.com/en/articles/8912793-c2pa-and-synthid-in-openai-generated-images | Search extract (official domains) |
| 13 | In early October 2026 Google opened SynthID Detector to everyone, globally in English, after testing with journalists and media professionals | https://blog.google/innovation-and-ai/models-and-research/google-deepmind/synth-id-ai-content/ | Search extract ("starting today", page dated ~3 days before 2026-10-11); 3P extracts (PetaPixel 2026-10-08, Lowyat, Crypto Briefing) say Oct 7. Softened to "early October 2026" |
| 14 | SynthID Detector "is not a general AI detector"; only detects media from companies that use SynthID | https://synthid.com/ | Search extract (official page quote) |
| 15 | A negative SynthID result doesn't rule out AI; a positive result means likely made or edited with a SynthID-enabled model | https://synthid.com/ | Search extract (official page) |
| 16 | CAI describes watermarking as surviving cropping, rotation and screen capture | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/getting-started/faqs.mdx | Opened (repo clone) |
| 17 | OpenAI docs list a degraded watermark as a reason a check can miss OpenAI content | https://github.com/openai/openai-python/blob/main/src/openai/types/content_provenance_check.py | Opened (openai 3.28.0 wheel; GitHub raw HTTP 200) |
| 18 | OpenAI's API returns a separate result per signal: C2PA with status trusted/valid/invalid/not_present, and SynthID | same as 17 (ResultC2PA.validation_state, ResultSynthID) | Opened (SDK). API added in openai-python 2.52.0, 2026-07-31 (CHANGELOG) - not used in post |
| 19 | Quote: "the metadata was stripped or has evidence of tampering, the watermark was degraded, it comes from a legacy generation model, or it was created before provenance signals were available" | same as 17 | Opened (verbatim docstring) |
| 20 | OpenAI's tool doesn't detect AI images from other companies | same as 17 ("Content could also still be AI-generated by another company's model, which the tool currently does not detect") | Opened |
| 21 | Content Credentials = signed record of origin and edit history | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/getting-started/index.mdx | Opened |
| 22 | C2PA = Coalition for Content Provenance and Authenticity | https://github.com/contentauth/c2pa-rs (README) | Opened (WebFetch) |
| 23 | The record usually lives inside the file | docs/getting-started/index.mdx ("Storing a manifest in file ... the only approach available to developers other than Adobe") | Opened |
| 24 | Generative AI output is marked with c2pa.created + digitalSourceType trainedAlgorithmicMedia | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/manifest/writing/assertions-actions.md | Opened |
| 25 | Signed record lets a checker show who signed and whether the file changed | docs/getting-started/index.mdx (claim signature, content binding) | Opened + own test (signer shown; dataHash mismatch detected) |
| 26 | CAI FAQ: positive signal about origin, not a negative signal about authenticity | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/getting-started/faqs.mdx | Opened |
| 27 | Test environment: Ubuntu 24.04.5 LTS x86_64; Python 3.13.16; c2pa-python 0.38.0 (SDK 0.91.0); c2patool 0.27.22; Pillow 12.3.0; ImageMagick 6.9.12-98; Chromium 141.0.7390.37 | out/versions.txt; https://pypi.org/pypi/c2pa-python/json (0.38.0, uploaded 2026-09-29) | Own test |
| 28 | C.jpg is a signed sample from c2pa-rs test fixtures, signed with a test certificate | https://raw.githubusercontent.com/contentauth/c2pa-rs/main/sdk/tests/fixtures/C.jpg (main @ 58b9a092) | Own test (issuer "C2PA Test Signing Cert") |
| 29 | Our image: synthetic 1600x1067, signed with c2patool sample test cert, labeled trainedAlgorithmicMedia | scripts/make_source.py | Own test |
| 30 | Both checkers trusted the C2PA test root; originals validated as Trusted | scripts/check.py; out/results.txt | Own test |
| 31 | Results table (12 edits x 2 images) | out/results.txt, out/results.json | Own test (reproduced twice, identical) |
| 32 | c2patool and c2pa-python agreed on every file | out/results.txt | Own test |
| 33 | 8 of 11 ordinary edits removed credentials completely ("No claim found" / ManifestNotFound) | out/results.txt | Own test |
| 34 | Screenshot was pixel-for-pixel identical to original | out/pixdiff.txt (mean abs diff 0.0) | Own test |
| 35 | ImageMagick copied the C2PA block (APP11) into its re-saved JPEG; checkers marked it Invalid (assertion.dataHash.mismatch) | out/segments.txt, out/results.txt | Own test |
| 36 | Removing only EXIF (pixels identical) -> Invalid, hash mismatch | out/results.txt, out/pixdiff.txt | Own test (own image only; C.jpg has no EXIF) |
| 37 | AI label still readable in Invalid files | out/results.json (digital_source_type present) | Own test |
| 38 | C2PA-aware edit (c2patool, original as parent) -> Trusted, original AI label kept in history | out/results.txt (manifests=2, dst_any=trainedAlgorithmicMedia) | Own test |
| 39 | CAI FAQ says a screenshot wouldn't include C2PA metadata | docs/getting-started/faqs.mdx | Opened |
| 40 | Inspect shows "The Content Credential issuer couldn't be recognized" for test certificates | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/signing/test-certs.md | Opened |
| 41 | Platforms might remove C2PA data if their software doesn't support the standard | https://github.com/contentauth/opensource.contentauth.org/blob/main/docs/durable-cr/index.md | Opened |
| 42 | An image may never have been labeled (predates provenance labels / tool doesn't add them) | same as 17 (legacy model, created before provenance signals, another company's model) | Opened |

## Dropped or softened

- **California SB 942** (operative date, free detection-tool duty): statute not openable; only backlog/3P extracts. Dropped.
- **Exact Oct 7, 2026 date** for SynthID Detector: only 3P extracts state it; official extract says "starting today". Softened to "early October 2026".
- **SynthID Detector sign-in requirement / "free"**: extracts conflict (one says Google/Apple/ChatGPT sign-in required; synthid.com extract shows "Not signed in"). Dropped.
- **Apple "soon", ElevenLabs, 180 billion items watermarked, 1M daily checks, CNET test result**: extract-only details. Dropped.
- **Google expanding Content Credentials/SynthID checks to Search and Chrome (I/O 2026)**: extract only. Dropped.
- **openai.com/verify login requirement and OpenAI's "don't crop/convert before checking" tip**: extract only. Dropped (our own test supports the "use the original file" advice).
- **Gemini Help 100 MB limit and "crop tight around screenshots" tip**: extract only. Dropped.
- **Platform labels (Meta, YouTube, TikTok, LinkedIn, etc.)**: not verifiable. Dropped; FAQ says we didn't test platforms.
