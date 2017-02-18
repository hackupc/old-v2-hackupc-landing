<br>
<p align="center">
  <img alt="HackUPC Fall 2016" src="src/images/hackupc-header-blue.png" width="620"/>
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

Use `npm run watch` to compile the dist directory in real time.

Use `npm run serve` to serve `/dist` at `http://localhost:8080`.


# Deploy

- Ask ssh access to server
- Add remote to your local git: `git remote add live ssh://deploy@hackupc.com/home/deploy/repo/w2017.git`
- Push new changes to server (only master branch) with: `git push live master`

Inspired by this [article](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps)

## Live

> - Desktop notifications
- Live reload
- Fancy schedule with time padding
- Normal tabular schedule
- Countdown

New versions of the schedule will be loaded only if 'version' is different.

# License

MIT © Hackers@UPC
