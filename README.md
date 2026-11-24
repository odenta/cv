# Andrei Nazarov — CV

English and Russian CVs built with [Lucid CV](https://github.com/xGoldy/lucidcv), LuaLaTeX, and `just`. Lucid CV and its fonts are vendored here; no separate template installation is needed.

## Prerequisites

- Git
- `just`
- [Bun](https://bun.sh) (runs the TypeScript scripts)
- LuaLaTeX and `latexmk` from TeX Live 2026 or newer
- The LaTeX packages checked by `just check`
- `tar` for template updates

### Fedora 45

Install everything required to build:

```bash
sudo dnf install \
  git \
  just \
  bun \
  tar \
  texlive-scheme-basic \
  texlive-luatex \
  latexmk \
  texlive-extsizes \
  texlive-fontawesome5 \
  texlive-paracol \
  texlive-dashrule \
  texlive-accsupp \
  texlive-tagpdf \
  texlive-tikzfill \
  texlive-enumitem \
  texlive-ragged2e \
  texlive-framed
```

For optional PDF inspection commands, also install:

```bash
sudo dnf install poppler-utils
```

## Build

```bash
just check  # Verify the engine, build tool, and packages
just tex    # Generate contents-*.tex from contents-*.md
just pdf    # Generate .tex and build both CVs
```

Outputs:

- `build/main-eng.pdf` — English CV
- `build/main-rus.pdf` — Russian CV

The gitignored `build/` directory contains PDFs and LaTeX auxiliary files.

### Just commands

| Command | Action |
| --- | --- |
| `just` | Build both PDFs (default) |
| `just check` | Check all build prerequisites |
| `just tex` | Generate `contents-*.tex` from the Markdown sources |
| `just pdf` | Generate `.tex` and build both PDFs |
| `just build` | Alias for `just pdf` |
| `just update-template VERSION` | Install a tagged Lucid CV release and rebuild |
| `just update-template latest` | Install the latest Lucid CV release and rebuild |
| `just clean` | Remove LaTeX auxiliary files |

`latexmk` is configured for LuaLaTeX in `latexmkrc`. To build without `just`, run `latexmk main-eng.tex main-rus.tex`.

## Update Lucid CV

```bash
just update-template latest
just update-template 1.1.0  # A specific release; the leading v is optional
```

The updater downloads tagged releases from GitHub and replaces only `lucidcv.cls`, `fonts/`, and `LICENSE.lucidcv`. It preserves your CV sources, assets, and `latexmkrc`, then rebuilds both PDFs. Review the changes and rendered output after an upgrade.

## Edit the CVs

| File | Contents |
| --- | --- |
| `contents-eng.md` | English summary, experience, skills, and education (source) |
| `contents-rus.md` | Russian content (source) |
| `contents-*.tex` | Generated from the `.md` files by `scripts/md2tex.ts` — do not edit |
| `main-eng.tex` | English metadata, header, and layout |
| `main-rus.tex` | Russian metadata, header, and layout |
| `contact.tex` | Shared email, phone, and location |
| `assets/profile.jpg` | Shared header photo |
| `lucidcv.cls`, `fonts/` | Vendored Lucid CV implementation and fonts |

Both variants use a compressed, single-column A4 layout for predictable ATS text extraction. Edit shared contact details in `contact.tex`; keep shared header and layout settings synchronized between the entry points.

## Validate

After editing, rebuild and inspect both PDFs:

```bash
just pdf
pdfinfo build/main-eng.pdf
pdfinfo build/main-rus.pdf
pdftotext -layout build/main-eng.pdf -
pdftotext -layout build/main-rus.pdf -
```

Each CV should remain one A4 page. Check that extracted text has intact words, Cyrillic text where expected, and a sensible reading order.

## Fedora PDF/UA compatibility

Fedora 45 currently combines a TeX Live 2026 engine with a 2025-11 LaTeX kernel. Its PDF/UA packages fail with `tagpdf: The PDF version has changed ... from 2.0 to 1.7`, even in a minimal document without Lucid CV.

Accordingly, this project currently enables **tagged PDF/A-2b with PDF 1.7**, but not PDF/UA-1. Fedora also warns that Lucid CV requests the newer 2026-06-01 LaTeX format.

With a fully updated upstream TeX Live 2026 installation, PDF/UA-1 can be restored in `main-eng.tex` and `main-rus.tex`:

```latex
\DocumentMetadata{pdfstandard={A-2b,UA-1},tagging=on,lang=en-US}
```

Use `lang=ru-RU` in `main-rus.tex`, remove `pdfversion=1.7` when using the upstream configuration, and rebuild both documents.

## Licenses

The vendored Lucid CV class is under the license in `LICENSE.lucidcv`. Bundled fonts retain their SIL Open Font License files under `fonts/`.
