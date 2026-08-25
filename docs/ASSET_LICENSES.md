# 3D Model Asset License Manifest

Tracks the source and license status of every `.glb` file under `public/models/`.
The upstream repo (craig7351/zombie-survivors) only documents these as "third-party
low-poly asset packs" (README) with sourcing guidance in `GAME.md` §1, but no
per-file source/license record ships with the repo, and the original downloaded
packs (`download/`) are gitignored and were never present in this fork. This file
exists to close that gap incrementally rather than leave it silently unverified.

Status legend:
- **replaced** — swapped for a verified CC0 asset in this fork, source recorded below.
- **unverified** — still the original upstream file; no source/license record exists
  for it anywhere in this repo or its history. Not yet reviewed. Do not assume CC0.
- **unused** — not referenced by any code path; safe to delete in a cleanup pass.

## Characters (`public/models/zombie/survivor_*.glb`, `char_*.glb`)

| File | Status | Source | License |
|---|---|---|---|
| `survivor_matt_armed.glb` | replaced | [Ultimate Modular Men Pack](https://quaternius.com/packs/ultimatemodularcharacters.html) by Quaternius — "Worker" model, via [poly.pizza](https://poly.pizza/bundle/Ultimate-Modular-Men-Pack-ZiH8muWqwQ) GLTF download | CC0 1.0 |
| `survivor_lis_armed.glb` | replaced | Ultimate Modular Men Pack — "Casual Character" model | CC0 1.0 |
| `survivor_sam_armed.glb` | replaced | Ultimate Modular Men Pack — "Punk" model | CC0 1.0 |
| `survivor_shaun_armed.glb` | replaced | Ultimate Modular Men Pack — "Adventurer" model | CC0 1.0 |
| `char_anne.glb` | replaced | Ultimate Modular Men Pack — "Swat" model | CC0 1.0 |
| `char_mako.glb` | replaced | Ultimate Modular Men Pack — "Business Man" model | CC0 1.0 |
| `char_shepherd.glb` | unverified | — (dog model; Ultimate Modular Men Pack has no animal models, needs a separate CC0 animal pack) | unknown |
| `char_pug.glb` | unverified | — (dog model; same gap as above) | unknown |
| `survivor_matt.glb` | unused | — (unreferenced by any code; a non-`_armed` leftover from a prior reskin) | unknown |
| `survivor_lis.glb` | unused | — (same) | unknown |
| `survivor_sam.glb` | unused | — (same) | unknown |
| `survivor_shaun.glb` | unused | — (same) | unknown |

## Weapons (`public/models/zombie/weapon_*.glb`)

| File | Status | Source | License |
|---|---|---|---|
| `weapon_axe.glb` | replaced | [Melee Weapon Pack](https://drxwat.itch.io/melee-weapon-pack) by Frontend Pashtet | CC0 1.0 |
| `weapon_knife.glb` | replaced | Melee Weapon Pack by Frontend Pashtet | CC0 1.0 |
| `weapon_spear.glb` | replaced | Melee Weapon Pack by Frontend Pashtet | CC0 1.0 |

## Zombies (`public/models/zombie/zombie_*.glb`) — deferred to a follow-up pass

| File | Status | Source | License |
|---|---|---|---|
| `zombie_basic.glb` | unverified | — | unknown |
| `zombie_ribcage.glb` | unverified | — | unknown |
| `zombie_chubby.glb` | unverified | — | unknown |
| `zombie_arm.glb` | unverified | — | unknown |
| `zombie_skeleton.glb` | unverified | — | unknown |
| `zombie_skeleton_headless.glb` | unverified | — | unknown |

Candidate for the follow-up pass: Quaternius' "Animated Zombie Pack" (CC0,
quaternius.com) — not evaluated in this pass.

## Bosses (`public/models/zombie/boss_*.glb`) — deferred to a follow-up pass

| File | Status | Source | License |
|---|---|---|---|
| `boss_captain.glb` | unverified | — | unknown |
| `boss_shark.glb` | unverified | — | unknown |
| `boss_tentacle.glb` | unverified | — | unknown |

No obvious free/CC0 match found for these three during this pass (pirate captain,
shark, tentacle monster are uncommon subjects in generic CC0 packs) — will likely
need one-off sourcing per boss, or a procedural fallback per `GAME.md` §3-8.

## Props / environment (`public/models/zombie/*.glb`) — deferred to a follow-up pass

| File | Status |
|---|---|
| `barrel.glb`, `cone.glb`, `container.glb`, `item_chest.glb`, `prop_barrier.glb`, `prop_cinderblock.glb`, `prop_container_red.glb`, `prop_couch.glb`, `prop_hydrant.glb`, `prop_pallet.glb`, `prop_trashbag.glb`, `prop_truck.glb`, `prop_wheels.glb`, `street_crack1.glb`, `street_crack2.glb`, `street_straight.glb`, `watertower.glb` | unverified |

Candidate for the follow-up pass: Quaternius' CC0 "Survival Pack" (confirmed CC0,
FBX+GLB) covers some of these categories but wasn't cross-matched file-by-file
in this pass.

## Decals (`public/models/zombie/blood_*.glb`)

| File | Status |
|---|---|
| `blood_1.glb`, `blood_2.glb`, `blood_3.glb` | unverified |

## Other (`public/models/*.glb`, repo root)

| File | Status | Notes |
|---|---|---|
| `chicken.glb`, `fox.glb`, `penguin.glb` | unused | Leftovers from a prior "動物大逃殺" (animal-survivors) reskin, per `GAME.md`'s evolution note. Not referenced by any current code path; safe to delete in a cleanup pass. |
