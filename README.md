# HackUPC 2019 landing page

[![Netlify Status](https://api.netlify.com/api/v1/badges/bb959f3f-1a5f-479e-80ec-d1f0c2ace501/deploy-status)](https://app.netlify.com/sites/hackupc/deploys) [![Build Status](https://travis-ci.com/hackupc/hackupc-landing.svg?branch=master)](https://travis-ci.com/hackupc/hackupc-landing)

![HackUPC 2019 landing preview](src/images/ogimage.png)

Hi! This is the code of the HackUPC 2019 landing page.

## Setup

Install the latest version Node.js (at least v12.6.0). [Find how here](https://nodejs.org/en/download/package-manager/).

```sh
sudo npm cache clean -f
sudo npm install -g n
sudo n latest
```

```sh
git clone git@github.com:hackupc/frontend.git
cd frontend
npm install
```

## Develop

Use `npm run watch` to compile and serve the dist directory in real time. Then view the website at [https://localhost:8080](https://localhost:8080)

**Install linters** extensions in your favorite editor. In VS Code install: `HTMLHint`, `TSLint`, `markdownlint`, `StandardJS`, `stylelint` and `npm`. In other editors they may have similar names.
Or use `npm run lint` to run linters manually from the console to check errors.

We use linters to ensure code quality, please fix all the errors.

Because of cahe busting you may have to clean the cache when you reload to see changes. In Chrome you can do `Ctrl` + `F5`.

**TLDR;**

Run this:

```sh
npm run watch
```

View the website at [https://localhost:8080](https://localhost:8080)

## General info

Every file was updated in the 2019 version. So they follow the same style and logic.

## Deploy

### Deploy to localhost

Use `npm run dist` to compile all dist directory.
The files from `/src/` will be compiled to `/dist/`. Notice that the routes change, so when referencing files check where they are in [/dist/](/dist/]).

Use `npm run serve` to just serve `/dist` at [https://localhost:8080](https://localhost:8080).

**TLDR;**

Run this:

```sh
npm run dist
npm run serve
```

View the website at [https://localhost:8080](https://localhost:8080).

### Deploy to production

**Push to master**. [Netlify](https://app.netlify.com/sites/hackupc) will build and deploy automatically.

If you push something that doesn't build, don't worry, it won't be published.

## Edit content

### Update legal documents

1. Just edit the Markdown files from [src/legal](src/legal)

### Add new logos

1. Checking the company brand use guidelines before editing the image.
1. Use .svg over .png.
1. The size should be greater than 600 x 300 px. They are scaled down automatically.
1. Remove the background if any.
1. Name the file in [snake_case](https://medium.com/swlh/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841).
1. Place the file in [/src/images/logos/](/src/images/logos/).
1. If you plan to customize the logo, save the original in [/src/images/logos/originals/](/src/images/logos/originals/).

### Change theme

> TODO: fill this part

## Support

If you need help understanding something of this repo you can ask the previous developers. The ones that made the 2019 edition are:

- Maurici Abad Gutierrez: Slack `@mauriciabad` [mauriciabad.com](https://mauriciabad.com/)

## License

MIT © Hackers@UPC
