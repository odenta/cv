default: pdf

check:
    @for cmd in bun lualatex latexmk kpsewhich; do \
        command -v $cmd >/dev/null || { echo "Missing command: $cmd" >&2; exit 1; }; \
    done
    @for file in extarticle.cls iftex.sty fontawesome5.sty etoolbox.sty keyval.sty xcolor.sty fontspec.sty pgf.sty tikzlibraryfill.image.code.tex enumitem.sty graphicx.sty dashrule.sty paracol.sty ragged2e.sty framed.sty geometry.sty hyperref.sty accsupp.sty tagpdf.sty; do \
        kpsewhich $file >/dev/null || { echo "Missing LaTeX package: $file" >&2; exit 1; }; \
    done
    @echo "Toolchain OK"

tex: check
    bun scripts/md2tex.ts

pdf: tex
    latexmk main-eng.tex main-rus.tex

build: pdf

update-template version:
    bun scripts/update-template.ts {{version}}
    just pdf

clean:
    latexmk -c main-eng.tex main-rus.tex
