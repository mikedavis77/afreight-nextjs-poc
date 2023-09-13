# Algolia NextsJS Demo (Non-Official)
## Installation
Use the recommended node version (`.nvmrc`). If you have `nvm` then run `nvm use` to load the corresponding node version automatically.

## Configuration
It is recommended to use the default configurations for testing the integration with your website first (see the **Installing the Algolia Prototype in your website section**). Once it's working, proceed with the corresponding configuration from the Algolia dashboard.

Once the Index configuration is ready, proceed to update the code as follows:
1. Update your Algolia credentials and indices configurations located within `lib/algoliaConfig.js`.
2. Update the Autocomplete `productItem` function to match your record's attributes (`components/algolia/ProductItem.jsx`.
3. Update the `hitComponent` function to match your record's attributes (`components/algolia/HitComponent.jsx`).
## Local Development
Run `npm run dev` to get the local server running. This server will refresh anytime your code is updated.


# Disclaimer
The code in this repository is provided as-is and is not production-ready. It is intended to be used as a reference only and may contain bugs or other issues. The repository owner is not responsible for any damages or losses that may occur from the use of this code. Use at your own risk.
