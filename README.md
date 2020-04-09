# HackUPC 2020 landing page

[![Netlify Status](https://api.netlify.com/api/v1/badges/bb959f3f-1a5f-479e-80ec-d1f0c2ace501/deploy-status)](https://app.netlify.com/sites/hackupc/deploys) [![Build Status](https://travis-ci.com/hackupc/hackupc-landing.svg?branch=master)](https://travis-ci.com/hackupc/hackupc-landing)

![HackUPC 2020 landing preview](src/assets/ogimage.png)

Hi! This is the code of the HackUPC 2020 landing page.

## Setup

```sh
git clone git@github.com:hackupc/hackupc-landing.git
cd hackupc-landing
npm install
```

## Develop

Use `npm run start` to compile and serve the build directory in real time. It reloads everytime there's a change. Then view the website at [https://localhost:3000](https://localhost:3000)

**TLDR;**

Run this:

```sh
npm run start
```

View the website at [https://localhost:3000](https://localhost:3000)

## Deploy

### Deploy to localhost

Use `npm run dist` to compile all build directory.
The files from `/src/` will be compiled to `/dist/`. Notice that the routes change, so when referencing files check where they are in [/dist/](/dist/]).

Use `npm run serve` to just serve `/dist` at [https://localhost:3000](https://localhost:3000).

**TLDR;**

Run this:

```sh
npm run dist
npm run serve
```

View the website at [https://localhost:3000](https://localhost:3000).

### Deploy to production

**Push to master**. [Netlify](https://app.netlify.com/sites/hackupc) will build and deploy automatically.

If you push something that doesn't build, don't worry, it won't be published.

## Edit content

### Add new logos

1. Checking the company brand use guidelines before editing the image.
1. Use .svg over .png.
1. The size should be greater than 600 x 300 px. They are scaled down automatically.
1. Remove the background if any.
1. Name the file in [snake_case](https://medium.com/swlh/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841).
1. Place the file in [/src/images/logos/](/src/images/logos/).
1. If you plan to customize the logo, save the original in [/src/images/logos/originals/](/src/images/logos/originals/).

## Support

If you need help understanding something of this repo you can ask the previous developers. The ones that made the 2020 edition are:

- Maurici Abad Gutierrez: Slack `@mauriciabad` [mauriciabad.com](https://mauriciabad.com/)

## License

MIT © Hackers@UPC
