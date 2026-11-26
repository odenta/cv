# Agent Instructions

## Workflow

1. Edit English content in `contents-eng.md` and Russian content in `contents-rus.md`; the matching `contents-*.tex` files are generated artifacts (see `scripts/md2tex.ts` header for the MD convention). Set `tagline` (line under the name and PDF Subject) and `keywords` (PDF Keywords) in the corresponding Markdown front matter. Edit shared contact details in `contact.tex` and header layout in `main-eng.tex` and `main-rus.tex`.
2. Treat `lucidcv.cls` and `fonts/` as vendored upstream files. Keep CV content and styling changes in the document files; use `just update-template VERSION` or `just update-template latest` for upgrades.
3. Run `just check` and `just pdf` after changes. Completion requires `build/main-eng.pdf` and `build/main-rus.pdf` to build successfully as one-page A4 documents.
4. For content changes, inspect both PDFs with `pdftotext -layout <file> -`. For metadata changes, check Subject and Keywords with `pdfinfo` and confirm the extracted tagline appears under the name. For layout changes, also render and visually inspect every page.

## Content

- Connect work to concrete, confirmed results in experience bullets. Suggest examples outside the CV until the author confirms them.

## Project Constraints

- Write all scripts in TypeScript and run them with Bun (exception: only when a very specific library requires otherwise).
- Keep common contact details in `contact.tex` and shared layout settings synchronized between the entry points.
- Preserve the single-column, tagged layout unless a different ATS trade-off is requested.
- Read the Fedora PDF/UA compatibility section in `README.md` before changing `\DocumentMetadata`.
- Keep generated files in the gitignored `build/` directory; `just clean` removes auxiliary files.
