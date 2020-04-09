# HackUPC 2020 landing page

[![Netlify Status](https://api.netlify.com/api/v1/badges/bb959f3f-1a5f-479e-80ec-d1f0c2ace501/deploy-status)](https://app.netlify.com/sites/hackupc/deploys) [![Build Status](https://travis-ci.com/hackupc/hackupc-landing.svg?branch=master)](https://travis-ci.com/hackupc/hackupc-landing)

![HackUPC 2020 landing preview](src/assets/ogimage.png)

Hi! This is the code of the HackUPC 2020 landing page.

## Develop

Clone the repo and run `npm install` the first time:

```sh
git clone git@github.com:hackupc/hackupc-landing.git
cd hackupc-landing
npm install
```

Use `npm run start` to compile and serve the build directory in real time. It reloads everytime there's a change. Then view the website at [https://localhost:3000](https://localhost:3000)

```sh
npm run start
```

## Deploy

**Push to master**. [Netlify](https://app.netlify.com/sites/hackupc) will build and deploy automatically.

If you push something that doesn't build, don't worry, it won't be published.

## Edit content

### Add new logos

1. Checking the company brand use guidelines before editing the image.
1. Use `.svg` over `.png`.
1. Use the right resolution: not too big neither too small.
1. Remove the background if any.
1. Name the file in [snake_case](https://medium.com/swlh/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841).
1. Place the file in [/src/assets/logos/](/src/assets/logos/).
1. If you plan to customize the logo, save the original with `_original` at the end of the file name.

## Support

If you need help understanding something of this repo you can ask the previous developers. The ones that made the 2020 edition are:

- Maurici Abad Gutierrez: Slack `@mauri` [mauriciabad.com](https://mauriciabad.com/)

## License

MIT © Hackers@UPC
