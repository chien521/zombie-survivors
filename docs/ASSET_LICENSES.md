# 3D Model Asset License Manifest

Tracks the source and license status of every `.glb` file under `public/models/`.
The upstream repo (craig7351/zombie-survivors) only documents these as "third-party
low-poly asset packs" (README) with sourcing guidance in `GAME.md` §1, but no
per-file source/license record ships with the repo, and the original downloaded
packs (`download/`) are gitignored and were never present in this fork. This file
exists to close that gap incrementally rather than leave it silently unverified.

**Major finding (this pass):** almost every file below was confirmed, by
downloading the source pack and comparing vertex counts / bounding boxes /
internal node names with `gltf-transform inspect`, to be
[**Quaternius' "Post Apocalypse Pack"**](https://poly.pizza/bundle/Post-Apocolypse-Pack-jg0We8Clu0)
— this is almost certainly the actual upstream source pack (the current repo's
files match it down to internal glTF node names like `Container_Red`,
`Street_Straight_Crack1`, `Blood_2`, etc., with only the tiny numeric differences
you'd expect from a Draco re-compression pass). Most of that pack is **CC0**; a
handful of models are **CC-BY** (free to use, requires crediting Quaternius) — see
the Credits section added to `README.md`.

Status legend:
- **verified — CC0** — confirmed match against a CC0 model in the source pack.
  Kept as-is, source recorded, no attribution required.
- **verified — CC-BY** — confirmed (or reasonably inferred, see notes) match
  against a CC-BY model in the source pack. Kept as-is; attribution added to
  `README.md`'s Credits section.
- **replaced** — swapped for a different verified CC0 asset in this fork.
- **unverified** — no source/license record could be confirmed for it. Do not
  assume CC0. A candidate replacement is noted where one was found.

## Characters (`public/models/zombie/survivor_*.glb`, `char_*.glb`)

| File | Status | Source | License |
|---|---|---|---|
| `survivor_matt_armed.glb` | replaced | [Ultimate Modular Men Pack](https://quaternius.com/packs/ultimatemodularcharacters.html) by Quaternius — "Worker" model, via [poly.pizza](https://poly.pizza/bundle/Ultimate-Modular-Men-Pack-ZiH8muWqwQ) GLTF download | CC0 1.0 |
| `survivor_lis_armed.glb` | replaced | Ultimate Modular Men Pack — "Casual Character" model | CC0 1.0 |
| `survivor_sam_armed.glb` | replaced | Ultimate Modular Men Pack — "Punk" model | CC0 1.0 |
| `survivor_shaun_armed.glb` | replaced | Ultimate Modular Men Pack — "Adventurer" model | CC0 1.0 |
| `char_anne.glb` | replaced | Ultimate Modular Men Pack — "Swat" model | CC0 1.0 |
| `char_mako.glb` | replaced | Ultimate Modular Men Pack — "Business Man" model | CC0 1.0 |
| `char_shepherd.glb` | verified — CC-BY | Post Apocalypse Pack — "German Shepard" ([poly.pizza/m/...](https://poly.pizza/bundle/Post-Apocolypse-Pack-jg0We8Clu0)) by Quaternius — confirmed via `gltf-transform inspect` (14,694 vertices, matching bbox) | CC-BY 3.0 — credited in README |
| `char_pug.glb` | verified — CC-BY | Post Apocalypse Pack — "Characters Pug" by Quaternius — confirmed via `gltf-transform inspect` (10,809 vertices, matching bbox) | CC-BY 3.0 — credited in README |
| `survivor_matt.glb` | unused | — (unreferenced by any code; a non-`_armed` leftover from a prior reskin) | unknown |
| `survivor_lis.glb` | unused | — (same) | unknown |
| `survivor_sam.glb` | unused | — (same) | unknown |
| `survivor_shaun.glb` | unused | — (same) | unknown |

Note: the original Post Apocalypse Pack also included Matt/Sam/Shaun/Lis models
under those exact character names — this fork had already replaced those four
with the Ultimate Modular Men Pack (Phase 2) before this pack was identified as
the likely original source. No need to revert; both are verified CC0.

## Weapons (`public/models/zombie/weapon_*.glb`)

| File | Status | Source | License |
|---|---|---|---|
| `weapon_axe.glb` | replaced | [Melee Weapon Pack](https://drxwat.itch.io/melee-weapon-pack) by Frontend Pashtet | CC0 1.0 |
| `weapon_knife.glb` | replaced | Melee Weapon Pack by Frontend Pashtet | CC0 1.0 |
| `weapon_spear.glb` | replaced | Melee Weapon Pack by Frontend Pashtet | CC0 1.0 |

(The Post Apocalypse Pack also has CC0 Axe/Knife/Spear models under those exact
names — either source is fine; no need to re-swap.)

## Zombies (`public/models/zombie/zombie_*.glb`)

`src/game/zombie-horde.ts`'s `ZOMBIE_TYPES` array; also reused (scaled up) as the
first four boss models in `src/game/boss.ts`'s `BOSS_DEFS` (bosses #1–4).

| File | Status | Source | License |
|---|---|---|---|
| `zombie_basic.glb` | verified — CC0 | Post Apocalypse Pack — "Zombie" ([poly.pizza/m/VlXjG0N8Eg](https://poly.pizza/m/VlXjG0N8Eg)) — confirmed via `gltf-transform inspect` (23,466 vertices, exact bbox match) | CC0 1.0 |
| `zombie_ribcage.glb` | verified — CC-BY | Post Apocalypse Pack — "Zombie half" ([poly.pizza/m/Htcsn9OrXJ](https://poly.pizza/m/Htcsn9OrXJ)) — confirmed via `gltf-transform inspect` (14,322 vertices, exact bbox match) | CC-BY 3.0 — credited in README |
| `zombie_chubby.glb` | verified — Post Apocalypse Pack | Post Apocalypse Pack — "Zombie" (a second, differently-shaped "Zombie" entry in the same pack; confirmed via `gltf-transform inspect`, 18,522 vertices, exact bbox match) — pack lists two same-named "Zombie" models, one CC0 one CC-BY, and the specific poly.pizza model ID for *this* vertex-count variant could not be pinned down with certainty in this pass | CC0 **or** CC-BY (unconfirmed which) — credited in README to be safe |
| `zombie_arm.glb` | verified — Post Apocalypse Pack | Post Apocalypse Pack — "Big arm" — confirmed via `gltf-transform inspect` (17,010 vertices, exact bbox match); could not locate this specific model's individual poly.pizza page to confirm exact license text | CC0 **or** CC-BY (unconfirmed which) — credited in README to be safe |
| `zombie_skeleton.glb` | unverified | No match in Post Apocalypse Pack. Candidate: Quaternius "Skeleton" ([poly.pizza/m/DM4QScSmbS](https://poly.pizza/m/DM4QScSmbS), CC0) — not yet confirmed to have the walk/idle animations this game's loader requires (`ZombieType` loading in `zombie-horde.ts` needs `/walk\|run/i` and `/idle/i` clips) | unknown |
| `zombie_skeleton_headless.glb` | unverified | No match found; no candidate identified in this pass | unknown |
| `zombie_half.glb` | verified — CC-BY | Post Apocalypse Pack — "Animated Zombie" ([poly.pizza/m/jkrEvQZb8J](https://poly.pizza/m/jkrEvQZb8J)) by Quaternius — confirmed via `gltf-transform inspect` (6,347 vertices, 2,116 glPrimitives, own `Zombie|Zombie*` animation set incl. dedicated Crawl/Bite clips). **Note:** this file originally held a different download of Quaternius' "Zombie half" ([poly.pizza/m/Htcsn9OrXJ](https://poly.pizza/m/Htcsn9OrXJ)) — only after adding it was it noticed that `zombie_ribcage.glb` (row above, "肋骨怪") already uses that exact same model (confirmed matching vertex/primitive counts), which would have made the two enemy types share a mesh. Swapped to "Animated Zombie" instead, a genuinely distinct model from the same pack | CC-BY 3.0 — credited in README |
| `ghost.glb` | verified — CC0 | Quaternius "Ghost" ([poly.pizza/m/Iip30bDHmu](https://poly.pizza/m/Iip30bDHmu)) — same author/style as the Post Apocalypse Pack but a separate model; page explicitly lists Public Domain (CC0) | CC0 1.0 |

## Bosses (`public/models/zombie/boss_*.glb`)

Only these three are boss-specific assets (bosses #1–4 reuse the zombie models
above, scaled up — see `BOSS_DEFS` in `src/game/boss.ts:31,43,55,67`).

| File | Status | Source | License |
|---|---|---|---|
| `boss_captain.glb` | unverified | No confirmed free rigged/animated pirate-captain character found this pass. Kenney's "Pirate Kit" (CC0) was checked and ruled out — it's ships/environment only, no character models. | unknown |
| `boss_shark.glb` | unverified | No confirmed free match found. | unknown |
| `boss_tentacle.glb` | unverified | No confirmed free match found. | unknown |

Per `GAME.md` §3-8's precedent (a tiled street asset was abandoned in favor of a
procedural texture when nothing fit), these three may end up needing a
procedural/placeholder treatment rather than a found asset, or one-off custom
modeling — left as an explicit open item rather than forcing a bad fit.

## Props / environment (`public/models/zombie/*.glb`)

Two loading paths: most go through `scatterProps()` in `src/game/game.ts`
(auto-normalized by height via `loadModel()`); `street_*.glb` go through
`buildRoads()` in `src/game/ground-decals.ts` (raw native scale, no
normalization — a replacement here must already be sized correctly).

| File | Status | Source | License |
|---|---|---|---|
| `barrel.glb` | verified — CC0 | Post Apocalypse Pack — "Barrel" (2,646 vertices, exact bbox match) | CC0 1.0 |
| `cone.glb` | verified — CC0 | Post Apocalypse Pack — "Traffic Cone" (402 vertices, exact bbox match; internal node name `TrafficCone_1`) | CC0 1.0 |
| `container.glb` | verified — CC0 | Post Apocalypse Pack — same asset as `prop_container_red.glb` below (both files are byte-identical in content — internal node name `Container_Red` in both; this is a duplicate file under a legacy name, **not** the pack's separate "Container Green" model) | CC0 1.0 |
| `item_chest.glb` | verified — CC0 | Post Apocalypse Pack — "Chest" (9,570 vertices, exact bbox match) | CC0 1.0 |
| `prop_barrier.glb` | verified — CC0 | Post Apocalypse Pack — "Plastic Barrier" (2,556 vertices, exact bbox match; node name `PlasticBarrier`) | CC0 1.0 |
| `prop_cinderblock.glb` | verified — CC0 | Post Apocalypse Pack — "Cinder Block" (1,104 vertices, exact bbox match) | CC0 1.0 |
| `prop_container_red.glb` | verified — CC0 | Post Apocalypse Pack — "Container Red" (3,096 vertices, exact bbox match; node name `Container_Red`) | CC0 1.0 |
| `prop_couch.glb` | verified — CC0 | Post Apocalypse Pack — "Damaged Couch" (9,234 vertices, exact bbox match; node name `Couch`) | CC0 1.0 |
| `prop_hydrant.glb` | verified — CC0 | Post Apocalypse Pack — "Fire Hydrant" (2,928 vertices, exact bbox match) | CC0 1.0 |
| `prop_pallet.glb` | verified — CC0 | Post Apocalypse Pack — "Pallet" (720 vertices, exact bbox match; node name `Pallet`) | CC0 1.0 |
| `prop_trashbag.glb` | verified — CC0 | Post Apocalypse Pack — "Trash Bag" (3,132 vertices, exact bbox match; node name `TrashBag_1`) | CC0 1.0 |
| `prop_truck.glb` | unverified | No match in Post Apocalypse Pack. Candidate: Quaternius "Pickup Truck" ([poly.pizza/m/qn4grQgHm8](https://poly.pizza/m/qn4grQgHm8), confirmed CC0, static/non-animated so no rigging concern) — not yet downloaded/swapped in this pass (poly.pizza's per-model download UI didn't cooperate with the scripted download flow used for everything else here) | unknown |
| `prop_wheels.glb` | verified — CC0 | Post Apocalypse Pack — "Wheels Stack" (5,472 vertices, exact bbox match; node name `Wheels_Stack` — **not** the pack's separate single "Wheel" model) | CC0 1.0 |
| `street_crack1.glb` | verified — CC0 | Post Apocalypse Pack — "Street Straight Crack" (1,728 vertices, exact bbox match; node name `Street_Straight_Crack1`) | CC0 1.0 |
| `street_crack2.glb` | verified — CC0 | Post Apocalypse Pack — "Street Straight Crack" (2nd variant) (2,028 vertices, exact bbox match; node name `Street_Straight_Crack2`) | CC0 1.0 |
| `street_straight.glb` | verified — CC0 | Post Apocalypse Pack — "Street Straight" (684 vertices, exact bbox match; node name `Street_Straight`) | CC0 1.0 |
| `watertower.glb` | verified — CC0 | Post Apocalypse Pack — "Water Tower" (bbox exact match) | CC0 1.0 |

## Decals (`public/models/zombie/blood_*.glb`)

Loaded via `src/game/decals.ts`'s `BloodDecals` class — flat ground meshes,
width-normalized (not height), actively used (spawned on kills).

| File | Status | Source | License |
|---|---|---|---|
| `blood_1.glb` | verified — CC0 | Post Apocalypse Pack — "Blood Splat" (390 vertices, exact bbox match; node name `Blood_1`) | CC0 1.0 |
| `blood_2.glb` | verified — CC0 | Post Apocalypse Pack — "Blood Splat" (2nd variant) (222 vertices, exact bbox match; node name `Blood_2`) | CC0 1.0 |
| `blood_3.glb` | verified — CC0 | Post Apocalypse Pack — "Blood" (246 vertices, exact bbox match; node name `Blood_3`) | CC0 1.0 |

## Other (`public/models/*.glb`, repo root)

| File | Status | Notes |
|---|---|---|
| `chicken.glb`, `fox.glb`, `penguin.glb` | unused | Leftovers from a prior "動物大逃殺" (animal-survivors) reskin, per `GAME.md`'s evolution note. Not referenced by any current code path; safe to delete in a cleanup pass. |

## Remaining gaps (for a future pass)

- `boss_captain.glb`, `boss_shark.glb`, `boss_tentacle.glb` — no free match found.
- `zombie_skeleton.glb`, `zombie_skeleton_headless.glb` — no free match found;
  Quaternius "Skeleton" is a CC0 candidate but its animation support is
  unconfirmed.
- `prop_truck.glb` — candidate found and license-confirmed (Quaternius "Pickup
  Truck", CC0), just not yet downloaded/integrated.
