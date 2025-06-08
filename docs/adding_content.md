# Adding Dialogues and Upgrades

This short guide explains how to add new dialogue scenes and player upgrades in the project.

## Dialogues
1. Open `data/dialogues.js`. Each dialogue is an object with an `id`, `stageRequired`, optional `cost`, text and `options`.
2. Provide a unique `id` for the new dialogue. Use a descriptive string.
3. Set `stageRequired` to the minimum Lilith stage needed.
4. The `text` field contains the narrative shown to the player.
5. `options` is an array of choices. Each choice has:
   - `id` – unique within the dialogue
   - `text` – label for the button
   - `rewards` – resource gains (if any)
   - `nextDialogueId` – optional follow‑up
   - `setFlag` – optional flag added on selection
6. If a dialogue should unlock content only after buying an upgrade or completing another scene, check those flags in the `available()` function for that dialogue.

After editing `dialogues.js` run `npm test` to ensure data validation passes.

## Upgrades
1. Add a new entry to `gameConfig.js` inside `UPGRADE_COSTS` to define the essence and dark‑essence price.
2. If the upgrade modifies a numeric value (e.g. click power), add a constant inside `UPGRADE_VALUES` as well.
3. Open `data/upgrades.js` and append a new upgrade object. Required fields:
   - `id`: unique string matching the cost key
   - `name` and `description`: displayed in the UI
   - `cost` and `darkEssenceCost`: reference the values from `gameConfig.js`
   - `type`: determines how the purchase affects the game (see existing upgrades for examples)
   - `requiredStage`: Lilith stage needed before it appears
   - Optional `onPurchase` callback for custom logic
4. Newly added upgrades automatically initialize in `playerState.js` when starting a fresh game.

Run `npm test` and `npm run lint` after changes to confirm the data is valid and code style is preserved.

## Idle Events
Idle events are short scenes that trigger automatically at regular intervals.
They are defined in `data/idleEvents.js` as objects with these fields:

- `id` – unique identifier
- `stageRequired` – minimum Lilith stage
- `text` – message displayed to the player
- `rewards` – optional resource gains
- `requiresUpgradeId` – optional upgrade that must be purchased

The game randomly selects from available events while avoiding the most recently
shown ones. The number of recent events remembered is configured by
`BALANCE_MODIFIERS.idleEvents.maxRecentEvents` in `gameConfig.js`.

After adding new events, run the tests to verify that any referenced upgrades
exist.
