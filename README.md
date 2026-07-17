# Consulta CNPJ

A modern, thin, **ad-free** web front-end for looking up Brazilian company data (CNPJ) — powered by the free public [cnpj.pw](https://cnpj.pw) API.

Built as a clean alternative to ad-heavy consultation sites. Zero backend, zero build step, zero tracking: just three static files you can host anywhere, including **GitHub Pages for free**.

## Features

- **Consultar CNPJ** — paste any CNPJ and get the full registration card: company data, economic activity (CNAE), address (with a "Ver no mapa" link), contacts, tax status (Simples/MEI), and full list of partners (sócios).
- **Buscar por nome** — search companies by razão social with cursor-based pagination ("Carregar mais").
- **Client-side CNPJ validation** (mod-11 check digits) — invalid numbers are caught instantly, without wasting an API request.
- **Shareable deep-links** — a successful lookup updates the URL to `?cnpj=00000000000191`, so results are bookmarkable and shareable.
- **Light & dark theme** — respects your system preference and remembers your manual choice.
- **Fully responsive** and keyboard-accessible.
- **No dependencies, no build** — plain HTML/CSS/JS. The only external request (besides the API) is the Inter web font, which degrades gracefully to system fonts.

## Run locally

Because the app calls a cross-origin API, open it through a static server (not `file://`):

```bash
# any static server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages (free)

1. Push this folder to a GitHub repository.
2. In the repo: **Settings → Pages → Build and deployment**.
3. **Source:** *Deploy from a branch*. **Branch:** `main` / `/ (root)`. Save.
4. Your site goes live at `https://<user>.github.io/<repo>/`.

Everything uses relative paths (`assets/...`) and `window.location.pathname`, so it works correctly under the `/<repo>/` sub-path. The included `.nojekyll` file disables Jekyll processing.

## Data source & credits

All data comes from the free, open-source public API at **[cnpj.pw](https://cnpj.pw)** ([API docs](https://api.cnpj.pw/docs) · [repository](https://github.com/cnpjpw/cnpjpw)), whose primary source is the [Receita Federal](https://arquivos.receitafederal.gov.br) public CNPJ dataset.

Please be a good citizen: the public API is rate-limited to **10 requests/IP/second** (it returns HTTP 503 beyond that). This front-end makes at most a couple of requests per action, so normal use stays well within the limit.

## Disclaimer

This is an **independent** front-end with no official affiliation with cnpj.pw or the Receita Federal. It only reads publicly available data. No data is stored, and there are no ads or analytics.

## License

[MIT](LICENSE).
