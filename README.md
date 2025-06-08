# Succubus Corruption Game

A small idle browser game about gathering Essence and corrupting a summoned succubus. Everything is written in vanilla JavaScript and structured as ES modules that run directly in the browser without any build step.

## Running the Game

Because ES modules enforce CORS rules, open the project via a local web server. In this directory run:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000/index.html` in a modern browser.

## Saves

Game progress is stored in `localStorage` under the key `succubusCorruptionGameSave_v1.2`. The save loads automatically whenever the page is opened again from the same origin. Clearing your browser data or using private browsing will start a new game.

## Development Notes

- All `.js` files use ES module syntax.
- Tailwind CSS is included from a CDN.
- There is no build process.
- Run `npm run lint` to check the code with ESLint.

## Known Limitations

- Requires a modern browser with ES module support.
- Running the files directly with the `file://` scheme may fail; use a local server.
- Saves are kept only in the current browser; there is no cloud sync.

## License

This project is licensed under the [MIT License](LICENSE).

## Additional Resources

The character sheet for Lilith can be found in [Karta_postaci.md](Karta_postaci.md).

