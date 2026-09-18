# Stock assets used in the Chereda demo

The demo uses a small, local image pool so routes keep working without a network connection. The files live in `public/media/stock` and are referenced by `data/seed.ts` for project media, profile covers and avatars.

## Source and license

All raster images were downloaded from Unsplash's public image CDN using the fixed photo IDs listed below. Unsplash's [license](https://unsplash.com/license) allows free commercial and non-commercial use without mandatory attribution. Attribution is still appreciated, so the source family is recorded here.

## Image groups

- `project-01.webp` … `project-16.webp` — event, wedding, stage and workspace imagery used across project galleries.
- `cover-01.webp` … `cover-12.webp` — venue, interior and atmosphere imagery used on profile cards and profile pages.
- `avatar-01.webp` … `avatar-08.webp` — portrait imagery used for demo profile avatars.

The pool is intentionally reused deterministically across the larger demo catalog. Each visible card still keeps its own linked project/profile data and is marked as demo content in the seed model.

WebP delivery variants are used in the UI to reduce transfer size on mobile. The downloaded JPEG masters remain alongside them for source inspection and future responsive variant generation.

## Photo IDs

The files correspond to these Unsplash photo IDs, in filename order:

### Projects

`1519225421980-715cb0215aed`, `1519741497674-611481863552`, `1527529482837-4698179dc6ce`, `1519167758481-83f550bb49b3`, `1511578314322-379afb476865`, `1492684223066-81342ee5ff30`, `1506157786151-b8491531f063`, `1517457373958-b7bdd4587205`, `1556761175-b413da4baf72`, `1497366811353-6870744d04b2`, `1540575467063-178a50c2df87`, `1505236858219-8359eb29e329`, `1464366400600-7168b8af9bc3`, `1507504031003-b417219a0fde`, `1531058020387-3be344556be6`, `1515169067868-5387ec356754`.

### Covers

`1500530855697-b586d89ba3ee`, `1497366754035-f200968a6e72`, `1511818966892-d7d671e672a2`, `1497366216548-37526070297c`, `1519710164239-da123dc03ef4`, `1515169067868-5387ec356754`, `1531058020387-3be344556be6`, `1506157786151-b8491531f063`, `1517457373958-b7bdd4587205`, `1492684223066-81342ee5ff30`, `1519167758481-83f550bb49b3`, `1507504031003-b417219a0fde`.

### Avatars

`1494790108377-be9c29b29330`, `1500648767791-00dcc994a43e`, `1534528741775-53994a69daeb`, `1507003211169-0a1dd7228f2d`, `1544005313-94ddf0286df2`, `1506794778202-cad84cf45f1d`, `1544725176-7c40e5a71c5e`, `1551836022-d5d88e9218df`.
