<br>
<p align="center">
  <img alt="HackUPC Fall 2016" src="src/images/hackupc-logo@2x.png" width="620"/>
</p>
<br>


# Setup

We recommend having Node v6 installed on your computer.

```sh
git clone git@github.com:hackupc/hackupc.git &&
cd hackupc &&
npm install
```


# Develop

Use `npm run dev` to compile and serve.

## Live

*To be revisited*
> For testing purposes `live.js` has a `testing` variable that mocks events in the near future so that there's no need to keep changing `events.json`. It also reduces the polling rate to 1 second.

> New features:

> - Desktop notifications
- Live reload
- Options panel to filter by type of notifications
  - 4 types of notifications (provisional): essential, food, events, talks
  - essential notifications are always sent
  - food, events and talks can be filtered out depending on your preferences.
- Options panel also includes a checkbox to switch off background animation.
- Progress bars!


# License

MIT © Hackers@UPC
