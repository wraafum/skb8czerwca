# Succubus Corruption Game

A small idle browser game about gathering Essence and corrupting a summoned succubus. Everything is written in vanilla JavaScript and structured as ES modules that run directly in the browser without any build step.

## Running the Game

Because ES modules enforce CORS rules, open the project via a local web server. In this directory run:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000/index.html` in a modern browser.

## Saves

Game progress is stored in `localStorage` under the key `succubusCorruptionGameSave_v1.3`. The save file now includes a version number for future migrations.

## Development Notes

- All `.js` files use ES module syntax.
- Tailwind CSS is included from a CDN.
- There is no build process.

## Known Limitations

- Requires a modern browser with ES module support.
- Running the files directly with the `file://` scheme may fail; use a local server.
- Saves are kept only in the current browser; there is no cloud sync.

## License

This project is distributed under the terms of the MIT License. See [LICENSE](LICENSE) for details.

## Additional Files

A short character sheet is provided in [Karta_postaci.md](Karta_postaci.md) instead of the previous binary document.
All in-game graphics are tiny placeholder images embedded as base64 strings so the repository contains no binary assets.
