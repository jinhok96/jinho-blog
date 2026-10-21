# Fact-check sheet: turn-off-ai-in-chrome.mdx

Checked 2026-10-11. Reference build: Chromium tag `155.0.8059.40` (= Chrome 155 stable).
Updated 2026-10-17: Windows policy steps changed from Command Prompt `reg add`/`reg delete` commands to Registry Editor (regedit) screen steps with the same key, value names, type (REG_DWORD) and values (see "Windows Registry Editor steps" below); the Mac policy section (Terminal `defaults` commands) removed, Mac readers pointed to the Settings switches; post `updatedAt: 2026-10-17`. No new policy, value, or Chrome fact added.
All Chromium paths are relative to `https://raw.githubusercontent.com/chromium/chromium/155.0.8059.40/` unless another tag is named.
Policy YAMLs live in `components/policy/resources/templates/policy_definitions/GenerativeAI/` (abbreviated `GenAI/`).

Method key:
- **SRC** = Chromium source file opened directly in this session (raw.githubusercontent.com)
- **OPEN** = other primary page opened directly
- **RUN** = we ran it in the container
- **EXTRACT** = search-result extract only (not opened); softened in the post
- **STD** = standard OS command syntax from vendor docs opened on GitHub, or general OS UI (noted)
- **MSDOC** = Microsoft documentation page opened directly in this session (learn.microsoft.com / support.microsoft.com, WebFetch)

## Version and environment

| Claim | Source | Method |
| --- | --- | --- |
| Chrome 155 (155.0.8059.40) is the stable release on Windows and Mac, serving since 2026-10-06 | https://versionhistory.googleapis.com/v1/chrome/platforms/win/channels/stable/versions/all/releases?filter=endtime=none&order_by=fraction%20desc (155.0.8059.40, fraction 1, start 2026-10-06T17:12:45Z); same for `platforms/mac` (start 2026-10-06T17:12:42Z) | OPEN (WebFetch) |
| A Chrome 156 build was going to a small early group | Same API: 156.0.8078.12 fraction 0.005 (Win and Mac); corroborated by search extract "early Stable release to a small percentage" | OPEN + EXTRACT |
| Tag 155.0.8059.40 exists; `main` is 157 | `chrome/VERSION` at tag (MAJOR=155 … PATCH=40) and at main (157.0.8099.0) | SRC |
| Policy YAMLs used in the post are identical on main and at 155 (except AutofillPredictionSettings/GeminiEnterpriseSettings, not used for claims; AutofillGenAiSettings is main-only, not used) | diff of each YAML main vs tag | SRC |

## Settings page labels and structure (Chrome 155)

| Claim | Source | Method |
| --- | --- | --- |
| Left-menu/page title is **AI innovations**; alternative **AI in Chrome** used only when the 2026 WebUI refresh is on | `chrome/app/settings_strings.grdp` L4385-4390; `chrome/browser/ui/webui/settings/settings_localized_strings_provider.cc` L522-525 (`IsWebuiRefresh2026Enabled() ? AI_PAGE_TITLE : AI_INNOVATIONS_PAGE_TITLE`); `chrome/browser/ui/ui_features.cc` L83, L122-125 (kWebuiRefresh2026 disabled by default); `ui/base/ui_base_features.cc` L501 (kDesktopGlowUp disabled by default) | SRC |
| Left menu entry exists for AI page | `chrome/browser/resources/settings/settings_menu/settings_menu.html` L113-116 | SRC |
| URL `chrome://settings/ai`, subpages `/ai/gemini`, `/ai/helpMeWrite`, `/ai/historySearch` | `chrome/browser/resources/settings/route.ts` L177-205 | SRC |
| Settings rows only appear for features available to the user | `chrome/browser/ui/webui/settings/settings_ui.cc` L603-664 (per-feature visibility booleans), `chrome/browser/compose/compose_enabling.cc` L224-256 (country + sign-in + per-user checks) | SRC |
| Gemini in Chrome settings: page title "Gemini in Chrome"; sections **Preferences**, **Permissions**; toggles **Show Gemini at the top of the browser**, **Show Gemini in Chrome in system tray and turn on keyboard shortcut** (Win) / **…in Mac menu bar and turn on keyboard shortcut** (Mac), **Page content sharing**, **Share current tab by default**, **Precise Location**, **Microphone** | `chrome/app/google_chrome_strings.grd` L3241-3266; `chrome/app/glic_strings.grdp` L165, L168, L174, L240, L249, L258, L267; template `chrome/browser/resources/settings/glic_page/glic_subpage.html` L1-30, L155-211; keyboard-shortcut variant chosen by kGlicHotkeyLocalScope (disabled by default on desktop: `chrome/browser/glic/public/features.cc` L252-258; strings provider L1030-1032) | SRC |
| No single on/off switch for Gemini in Chrome in Settings | `glic_subpage.html` (only preference/permission toggles), `glic_page.html` (link row only) | SRC |
| "This feature is disabled by your organization" shown when blocked by policy | `glic_strings.grdp` L135; `settings_strings.grdp` L4406; `glic_subpage.html` L3-7 | SRC |
| Help me write page: one switch **Offer writing help**; sublabel quoted | `settings_strings.grdp` L1402-1406; `chrome/browser/resources/settings/ai_page/offer_writing_help_page.html` L28-47, L83-85 (toggle bound to `compose.proactive_nudge_enabled`) | SRC |
| Offer writing help only gates the automatic pop-up; right-click item not gated by it | `chrome/browser/compose/compose_enabling.cc` L354-358 (pref checked in `ShouldTriggerNoStatePopup`), L393-447 (`ShouldTriggerContextMenu` doesn't check it) | SRC |
| Right-click label "Help me write" / Mac "Help Me Write" | `components/compose_strings.grdp` L4-14 | SRC |
| Help me write requires sign-in to Chrome | `compose_enabling.cc` L240-248 (`kSignedOut`) | SRC |
| Help me write = short-form writing assistant based on prompt and page | `GenAI/HelpMeWriteSettings.yaml` L4 | SRC |
| History search setting label **History search, powered by AI**; everyday-language description | `settings_strings.grdp` L3825-3829; `ai_page/history_search_page.html` L19, L57-60; policy desc `GenAI/HistorySearchSettings.yaml` L4 ("based on page contents and not just the page title and URL") | SRC |
| **On-device AI** toggle on the AI page (Chrome-branded builds), enabled by default | `ai_page/ai_page.html` (final `settings-section` with `onDeviceAiToggle`); `settings_ui.cc` L648-654; `chrome/browser/ui/webui/settings/on_device_ai_settings_handler.cc` L21-24 (`kShowOnDeviceAiSettings` ENABLED_BY_DEFAULT) | SRC |
| On-device AI sublabel quote ("To power features like scam detection…might not work.") | `settings_strings.grdp` L3982-3987 | SRC |
| **Settings > System** has an "On-device AI" row that navigates to the AI page | `system_page/system_page.html.ts` L141-151; `system_page/system_page.ts` L260-262 (`navigateTo(routes.AI)`); subtitle `settings_strings.grdp` L3988 | SRC |
| Toggle shows off and locked when the policy disables the model | `ai_page/ai_page.ts` L301-315; handler L89-104 | SRC |
| Tab Organizer sunset; policy supported only 121-136 | `GenAI/TabOrganizerSettings.yaml` L2-4, L43-45 | SRC |

## On-device model

| Claim | Source | Method |
| --- | --- | --- |
| Toggle off → model uninstalled and not downloaded; same when policy disallows; also auto-uninstall when device not capable or free disk too low | `components/optimization_guide/core/model_execution/manifest_broker/manifest_monitor.cc` L40-51, L109-135, L146-168; uninstall deletes files: `manifest_broker/manifest_asset_manager.cc` L493-515 ("Uninstall the component which will delete the model files"); toggle writes pref `optimization_guide.on_device_foundational_model_user_settings` (`model_execution_prefs.cc` L107-108, default true L139-140; handler L106-107) | SRC |
| Folder name `OptGuideOnDeviceModel` under the component user dir | `chrome/browser/component_updater/optimization_guide_on_device_model_installer.cc` L52-54, L189-195 (legacy model kept there; other assets in `OptGuideManifestModel/<key>`) | SRC |
| Component user dir = Chrome user data dir | `chrome/app/chrome_main_delegate.cc` L1496-1497; `components/component_updater/component_updater_paths.cc` L33-35 | SRC |
| Windows user data dir = `%LOCALAPPDATA%\Google\Chrome\User Data` | `chrome/common/chrome_paths_win.cc` L42-48; `chrome/common/chrome_constants.h` L145 ("User Data"); `chrome/install_static/install_util.cc` L511-522; `chrome/install_static/google_chrome_install_modes.h` L20, L24 (Google, Chrome), L82-83 (stable suffix "") | SRC |
| Mac user data dir = `~/Library/Application Support/Google/Chrome` | `chrome/common/chrome_paths_mac.mm` L26-41, L72-88; `base/base_paths_mac.mm` L29-31 (DIR_APP_DATA = Application Support) | SRC |
| Model file was named `weights.bin` through at least Chrome 150 | tag 147.0.7727.55 `components/optimization_guide/core/optimization_guide_constants.cc` L45-46; tag 150.0.7871.0 same file L41-42; file absent at 153.0.8010.55 and 154.0.8037.98 | SRC |
| In 155 the weights filename comes from the downloaded manifest | `manifest_broker/manifest.cc` L113-125 (`weights_file().asset_id()`), `manifest_solution_factory.cc` L355 (`ResolveFile(recipe.weights_file())`) | SRC |
| Re-download possible if folder deleted while toggle is on | Component-updater-managed on-demand assets: `components/optimization_guide/core/model_execution/on_device.md` L60-77 (UsageTracker triggers on-demand downloads; ManifestAssetManager registers/downloads via Component Updater); installer `RegisterOnDemandComponent` L295-332 | SRC (inference from architecture; worded as "can") |
| "Gemini Nano" = Chrome's built-in model | https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/ai.gemini-on-device (README L1-7: "Chrome's built-in Gemini Nano model") | OPEN (Google-owned repo, raw README) |
| Download is roughly 4 GB | 9to5Google 2026-05-06, Bitdefender, The Register 2026-05-09, Hongkiat, TechRadar (all search extracts; WebFetch DNS failed for these hosts) | EXTRACT, multiple outlets; post says "News reports in 2026 put the download at roughly 4 GB" |

## Policies

| Claim | Source | Method |
| --- | --- | --- |
| `GeminiSettings`: 1 = "Gemini integration will not be available for users"; Win/Mac since 137 | `GenAI/GeminiSettings.yaml` L5-9, L36-38 | SRC |
| `GeminiActOnWebSettings`: 1 = Gemini app not allowed to act on web pages; desktop since 143 | `GenAI/GeminiActOnWebSettings.yaml` L3-7, L36-39 | SRC |
| `AIModeSettings`: 1 = not available; needs Google as default search engine; since 138 | `GenAI/AIModeSettings.yaml` L4-10, L32-36 | SRC |
| `SearchContentSharingSettings`: 1 = can't share page/file content with AI Mode (and Lens per caption); since 144 | `GenAI/SearchContentSharingSettings.yaml` caption L1, desc L8-10, L41-45 | SRC |
| `HelpMeWriteSettings` 2 = off; since 121 | `GenAI/HelpMeWriteSettings.yaml` L10, L27-29, L41-43 | SRC |
| `HistorySearchSettings` 2 = off; since 128 | `GenAI/HistorySearchSettings.yaml` L10, L27-29, L41-43 | SRC |
| `TabCompareSettings` 2 = off; since 129 | `GenAI/TabCompareSettings.yaml` L10, L30-32, L42-44 | SRC |
| `CreateThemesSettings` 2 = off; since 121 | `GenAI/CreateThemesSettings.yaml` L10, L27-29, L41-43 | SRC |
| Three-value policies: 1 = allowed without model improvement (not off) | e.g. `GenAI/HelpMeWriteSettings.yaml` L6-8 | SRC |
| `GenAILocalFoundationalModelSettings`: 1 = not downloaded and existing model deleted; desktop since 124; machine-wide (per_profile false) | `GenAI/GenAILocalFoundationalModelSettings.yaml` L6-10, L14-16, L32-35 | SRC |
| `ComponentUpdatesEnabled` alternative (mentioned only in this sheet; not in post) | GenAILocalFoundationalModelSettings.yaml L10; `Miscellaneous/ComponentUpdatesEnabled.yaml` L5 | SRC |
| `BuiltInAIAPIsEnabled`: false = pages can't use built-in AI APIs; since 137; boolean | `policy_definitions/Miscellaneous/BuiltInAIAPIsEnabled.yaml` L3-14, L19-25 | SRC |
| Registry DWORD 0 accepted as boolean false | `components/policy/core/common/registry_dict.cc` L82-89 | SRC |
| `GenAiDefaultSettings` is cloud-only ("can only be set from Admin Console") | `GenAI/GenAiDefaultSettings.yaml` L19-20; `components/policy/resources/templates/messages.yaml` L74-77 | SRC |
| Cloud-only enforced on desktop: "Ignored because the policy is not set by a cloud source." | `components/policy/core/browser/configuration_policy_handler_list.cc` L166-175; `components/policy_strings.grdp` L228-229; generator `components/policy/tools/generate_policy_source.py` L1167-1168 | SRC |
| …and observed in a running browser | Chromium 141.0.7390.37 headless, `/etc/chromium/policies/managed/toolproof-genai-test.json`; chrome://policy dump: `GenAiDefaultSettings … Error … Ignored because the policy is not set by a cloud source.`; GeminiSettings, AIModeSettings, HelpMeWriteSettings, HistorySearchSettings, GenAILocalFoundationalModelSettings = OK (output in `policy_dump_141.json`; test file removed afterwards) | RUN |
| Sensitive policies are filtered on unmanaged Win/Mac; AI policies aren't sensitive | `components/policy/core/common/async_policy_loader.cc` L110-119; `policy_loader_common.cc` L145-163; `generate_policy_source.py` L98, L1438-1449 (`sensitive:` key); none of the GenAI YAMLs or BuiltInAIAPIsEnabled has `sensitive:` (grep) | SRC |
| Windows key `HKLM\SOFTWARE\Policies\Google\Chrome` (Chrome-branded) | `components/policy/tools/generate_policy_source.py` L29, L1208-1218; `chrome/browser/policy/chrome_browser_policy_connector.cc` L315-320; `docs/enterprise/add_new_policy.md` L142-145; HKLM = machine scope `policy_loader_win.cc` L321-322 | SRC |
| chrome://policy has **Reload policies** button | `components/policy_strings.grdp` L489-490 | SRC |
| chrome://policy status column shows **OK** for a valid policy value (2026-10-17) | `components/policy_strings.grdp` L385-387 (`IDS_POLICY_OK`, "Text displayed in the status column when a valid value is set for a policy"), re-opened at tag 155.0.8059.40 | SRC |
| Machine-level policies make the browser "managed" → app menu "Managed by your organization" | `chrome/browser/enterprise/browser_management/browser_management_status_provider.cc` L62-73; `chrome/browser/ui/managed_ui.cc` L108-123, L163; string `chrome/app/generated_resources.grd` L1875-1876 | SRC |

## Windows Registry Editor steps (added 2026-10-17)

Replaces the Command Prompt commands. Key, value names, type and values are copied from the old commands (`reg add "HKLM\SOFTWARE\Policies\Google\Chrome" /v {Name} /t REG_DWORD /d {N} /f`, example values GeminiSettings=1, GenAILocalFoundationalModelSettings=1, HelpMeWriteSettings=2) and the policy table above; nothing new. Steps were not run on a Windows PC (post says so in How we checked).

| Claim | Source | Method |
| --- | --- | --- |
| Key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome` (= old `HKLM\…`); HKLM abbreviation | Chrome side: "Windows key" row above (SRC). HKLM = HKEY_LOCAL_MACHINE: https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/windows-registry-advanced-users (predefined keys table) | SRC + MSDOC |
| REG_DWORD is shown as **DWORD (32-bit) Value** in Registry Editor's **Edit > New** menu | Same Learn page (types table: "DWORD Value / REG_DWORD"); https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc772023(v=ws.10) ("On the **Edit** menu, point to **New**, and then click … **DWORD (32-bit) Value**, **QWORD (64-bit) Value** …"; "Type a name for the new value and then press ENTER") | MSDOC (archived page, Windows Server 2008 / Vista) |
| Registry "warning" quote: "Serious problems might occur if you modify the registry incorrectly by using Registry Editor or by using another method. These problems might require that you reinstall the operating system." | Learn page above, "Use Registry Editor" > Warning (ms.date 2026-02-12) | MSDOC |
| Registry = database for system/app settings; navigation area shows keys as folders | Learn page above ("A central hierarchical database …"; "The navigation area of Registry Editor displays folders. Each folder represents a predefined key") | MSDOC |
| Open: Start, type **regedit**, press **Enter**; "If you are prompted for an administrator password or for confirmation, type the password or provide confirmation." | https://support.microsoft.com/en-us/topic/how-to-back-up-and-restore-the-registry-in-windows-855140ad-e318-2a13-2829-d428a2ab0692 (page says "regedit.exe") | MSDOC |
| Create key: select parent key, **Edit > New > Key**, type name, press ENTER | https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/cc731733(v=ws.11) ("Add a Registry Key", Windows 7 / Server 2008 R2: "Click **New** on the **Edit** menu and then click **Key**") | MSDOC (archived) |
| Set data: **Edit > Modify**, type in **Value data**, **OK**; DWORD has a base option (hexadecimal or decimal) | https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc771057(v=ws.10) ("Change a Value"); https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc737085(v=ws.10) ("the base (hexadecimal or decimal) for DWORD values", **Value data**) | MSDOC (archived) |
| 0, 1, 2 are the same in hexadecimal and decimal, so **Base** doesn't matter for these values | Arithmetic (single digits below 10) | — |
| Undo: select value, **Edit > Delete**, confirm; "There is no Undo command for deletions." | https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc782088(v=ws.10) ("On the **Edit** menu, click **Delete**"); https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-2000-server/cc976614(v=technet.10) (prompt "Registry Editor will delete the currently selected value. Do you want to continue the operation?" + no Undo) | MSDOC (archived). **Yes** button = general Windows UI for that yes/no prompt (not on the page) |
| UAC dialog wording, double-click to expand a key in the left pane | General Windows UI; post words step 2 after Microsoft's text ("asks for permission or an administrator password") | Not opened (general knowledge, low risk) |

No current (Windows 10/11) Microsoft page with the full step list was found; menu names come from the archived Microsoft pages above, and the current Learn page confirms Registry Editor can add, change and delete keys and values.

## AI Mode / AI Overviews scope

| Claim | Source | Method |
| --- | --- | --- |
| No user-facing Chrome settings switch for AI Mode in the address bar in 155 | Searched `settings_strings.grdp` / `generated_resources.grd` for "AI Mode": only side-panel position, "Google Search AI Mode and connected apps" link, and tab-sharing (smart tab sharing) options (`ai_page/ai_mode_search_page.html`); no on/off row | SRC (absence check; worded "Chrome 155's settings code has no switch for it") |
| No Chrome AI setting or policy mentions AI Overviews | grep "AI Overview" across all GenAI YAMLs and fetched string files: only `GenAISmartGroupingSettings` (ChromeOS "overview window grouping", unrelated) | SRC (absence check) |

## Dropped or softened

- Google Help Center pages (support.google.com), Chrome Enterprise policy list, developer.chrome.com, blog.google, chromium.org, news sites: WebFetch failed with DNS errors (ENOTFOUND) for every Google/news host in this session; only search extracts seen. Nothing in the post is attributed to Google help text.
- Exact model size: softened to "News reports in 2026 put the download at roughly 4 GB" (EXTRACT only).
- Country/language availability of Gemini in Chrome, Help me write, history search: dropped (only search extracts). Post says rows appear only for features available to your account, language, and country (SRC: visibility checks).
- "Suggestions, powered by AI" (`ChromeSuggestionsSettings`, kContextualCueingV2 disabled by default), "Select text to ask Gemini" (updates_only=true hides the row), Skills, Talk to type, Try on You: not covered in post (not visible by default or too new to verify UI).
- `ComponentUpdatesEnabled=false`: left out of the post (blocks other component updates too).
- Mac configuration-profile (.mobileconfig) steps: not given (Apple UI not verifiable).
- Mac policy section removed 2026-10-17 (Terminal `defaults write/delete` commands; no non-developer GUI method). Removed claims: domain `com.google.Chrome`, managed values = Mandatory / others = Recommended (`chrome/browser/policy/chrome_browser_policy_connector.cc` L323-342; `components/policy/core/common/policy_loader_mac.mm` L120-135, L178-189, SRC), recommended values "OK" in Chromium (`policy_dump_141_recommended.json`, RUN), `defaults` syntax (general knowledge). Post now says policies are covered on Windows only and points Mac readers to the Settings switches.
- Command Prompt `reg add`/`reg delete` syntax (MicrosoftDocs `reg-add.md` L17-30, `reg-delete.md` L17-28) and "Run as administrator": removed from the post 2026-10-17 with the commands.
- GeminiSettings is `future_on: chrome.linux` (not yet supported on Linux Chrome); Linux not covered in the post.

## Chrome 156 recheck (2026-10-21)

Reference build: Chromium tag `156.0.8078.48`. VersionHistory API (win·mac stable, `endtime=none`) listed 156.0.8078.48 with fraction 1, serving since 2026-10-20T19:56Z (155.0.8059.85/.86 still listed at partial fractions). All files fetched from raw.githubusercontent.com at both tags and compared (`cmp` + message-level diff of `.grd/.grdp`).

| Checked | Result | Method |
| --- | --- | --- |
| 10 policy YAMLs used in the post (`GeminiSettings`, `GeminiActOnWebSettings`, `AIModeSettings`, `SearchContentSharingSettings`, `HelpMeWriteSettings`, `HistorySearchSettings`, `TabCompareSettings`, `CreateThemesSettings`, `GenAILocalFoundationalModelSettings`, `GenAiDefaultSettings`) + `Miscellaneous/BuiltInAIAPIsEnabled.yaml` | Byte-identical 155 → 156 | SRC |
| `settings_strings.grdp`, `compose_strings.grdp` | No AI/Gemini/compose/history-search/on-device message changed | SRC |
| `glic_strings.grdp` | Only changes: Gemini Spark remote-browsing texts reworded (toggle now "Let other Gemini apps browse remotely from any device"), hotkey scope option strings replaced. Not used in the post | SRC |
| `google_chrome_strings.grd` | Only `IDS_SETTINGS_GLIC_HOTKEY_SCOPE_CHROME` removed (not used) | SRC |
| Settings pages | Migrated Polymer → Lit (`*.html` → `*.html.ts`). `ai_page.html.ts` still has `onDeviceAiToggle` with `onDeviceAiEnabledLabel`; `offer_writing_help_page.html.ts` still binds `compose.proactive_nudge_enabled`; `system_page.html.ts` still has the On-device AI link row; Gemini subpage i18n keys identical except hotkey scope keys | SRC |
| Page title | `kWebuiRefresh2026` and `kDesktopGlowUp` still disabled by default → "AI innovations" title unchanged | SRC |
| New in 156, not covered | `/ai/geminienterprise` subpage behind `showGeicSettings` (`kGeic` disabled by default) | SRC |
| On-device model | `kShowOnDeviceAiSettings` enabled by default; `manifest_monitor.cc` identical; installer still uses `OptGuideOnDeviceModel` folder | SRC |

Post change: description and intro now say Chrome 156; one recheck paragraph in the intro; "How we checked" notes the 156 comparison. Steps, labels and policies unchanged. `updatedAt` not changed (no change to instructions).

## Images (2026-10-21)

| Image | What it shows | Basis |
| --- | --- | --- |
| `chrome-ai-off-switches.webp` (thumbnail) | Quick reference as a graphic: Settings full/partial/no switch per feature + policy values | Same rows as the post's Quick reference table (SRC above) |
| `chrome-on-device-ai-removal.webp` | Switch off → uninstall + no re-download vs. deleting folder → can re-download | On-device model rows above (manifest_monitor.cc, manifest_asset_manager.cc, installer `RegisterOnDemandComponent`) |
| `chrome-policy-registry-location.webp` | Key tree `HKLM\SOFTWARE\Policies\Google\Chrome` + example REG_DWORD values | Policies rows above; key path as in the post |
| `chrome-policy-page-status-ok.webp` | **RUN**: Chromium 141.0.7390.37 (`/opt/pw-browsers/chromium-1194`) `chrome://policy` with `/etc/chromium/policies/managed/50-toolproof-ai-off.json` = `{"GeminiSettings": 1, "GenAILocalFoundationalModelSettings": 1, "HelpMeWriteSettings": 2}`; all three Status OK, Source Platform, Level Mandatory. Name filter "Settings" hides the container's own policies; file removed after capture. Accent boxes added on Reload policies and Status | `policy_screenshot.py`, then `charts.py` |

Generated with `charts.py <out> <policy PNG>` (`chart_style.py` light mode).
