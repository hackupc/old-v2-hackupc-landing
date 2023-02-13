# HackUPC landing page

[![Netlify Status](https://api.netlify.com/api/v1/badges/bb959f3f-1a5f-479e-80ec-d1f0c2ace501/deploy-status)](https://app.netlify.com/sites/hackupc/deploys)
[![CI](https://github.com/hackupc/hackupc-landing/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/hackupc/hackupc-landing/actions/workflows/ci.yml)

![HackUPC landing preview](src/assets/ogimage.png)

Hi! This is the code of the HackUPC landing page.

## Develop

Clone the repo, install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating), install [Node.js](https://nodejs.org/en/download/) with nvm, and install the dependencies with npm the **first time**:

```sh
git clone git@github.com:hackupc/hackupc-landing.git
cd hackupc-landing

# Install nvm 
# Copy the command from here: https://github.com/nvm-sh/nvm#installing-and-updating

nvm install
nvm use

npm install
```

Use `npm run start` to compile and serve the build directory in real-time. It reloads every time there's a change. Then view the website at [https://localhost:3000](https://localhost:3000)

```sh
npm run start
```

Whenever you want, fix auto-fixable lint errors and format files:

```sh
  npm run lint:eslint
  npm run lint:stylelint
  npm run lint:prettier
```

### Tips

- **Use `VS code`**, there's the `.vscode` folder with a good workspace configuration. It will be applied automatically.
- Install `ESlint` and `Prettier` extensions.

> If you're unfamiliar with modern vanilla websites, check [this video from CodelyTV](https://youtu.be/ZMBh6n3KWhY) (in Spanish) to understand the reasoning and benefits of this kind of architectures.

## Deploy

**Push to master**. [Netlify](https://app.netlify.com/sites/hackupc) will build and deploy automatically.

If you push something that doesn't build, don't worry, it won't be published.

## Support

If you need help understanding something about this repo you can ask the previous developers. The ones that made the 2021 edition are:

- Maurici Abad Gutierrez: Slack `@mauri` [mauriciabad.com](https://mauriciabad.com/)

## License

MIT © Hackers@UPC
