<p align="center">
  <img alt="HackUPC Fall 2016" src="src/images/hackupc-ogimage@2x.png" width="100%"/>
</p>

# Setup

We recommend having Node v6 installed on your computer.

```sh
git clone git@github.com:hackupc/frontend.git &&
cd frontend &&
npm install
```

# Develop

Use `npm run watch` to compile and serve the dist directory in real time.

## Add new logo images for sponsors and partners

- Edit image remove background, add whitespace. Consider checking first sponsor brand use guidelines before editing the image.
- Resize the image to `600 x 300 px`

# Deploy

Use `npm run dist` to compile all dist directory.

Use `npm run serve` to serve `/dist` at `http://localhost:8080`.

Use `npm run nocache` to enable cache burst on `index.html` and `live.html`.

Use `npm run -s lint` to run linters manually.

## HackUPC server

- Ask ssh access to server
- Add remote to your local git: `git remote add live ssh://deploy@hackupc.com/home/deploy/repo/w2017.git`
- Push new changes to server (only master branch) with: `git push live master`

Inspired by this [article](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps)

## HackUPC Server auto-deployment

In order to make development easier, we configured the server do auto-deployment from master. This is done using: `crontab`, `git` hooks and the `npm run dist` combined.

- Add `*/15 * * * * cd /home/user/hackupc/frontend/ && git pull origin master > /home/user/hackupc/frontend/changes.log 2> /home/user/hackupc/frontend/install.log` to `crontab -e`
- `vim .git/hooks/post-merge`
- Write the following into the file:
```
#!/bin/sh
cd /home/user/hackupc/frontend/
npm update
echo "cleaning..."
npm run clean
echo "cleaning...done"
echo "compiling..."
npm run dist
echo "compiling...done"
echo "Deploy completed. The game is on!"
```
- `chmod +x .git/hooks/post-merge`

This makes crontab pull from the repo every 15 minutes. If changes happen, then the post-merge git hook is executed, effectively updating dependencies and compiling a new version of the site.

# Live

Features included

- Optional subscription to events - 5 minutes before notifications
- Schedule live reload
- Fancy schedule with time padding
- Normal tabular schedule
- Countdown
- Full-screen mode by pressing `p`

## Config
Some parameters (offsets, timeouts, defaults) can be changed in config.live.js. Keep in mind that some values are just constants and should not be changed.  
Style can be customized in params.scss (note that some parameters should match some variables in config.live.js).  


## Schedule file
- `id` can be whatever you want, but all ids should be different  
- When writing hours, prepend zeroes: Nice: 01:00; Not-so-nice: 1:00.  
- Events should be ordered by starting hour  
- `baseTimeOffset` should be the same output as executing (new Date()).getTimezoneOffset() in a machine with local time. (UTC - localtime in minutes)  
- `dates` are DD/MM/YYYY format  

## Non-ranged events

If an event doesn't have endHour, then will show only startHour and it will finish at the same time as it starts.  
Useful to specify events that don't have concept of length or that span through more than one day ("Event start", "Event end")

## Updating schedule

Clients will poll constantly the schedule.json file. To update the schedule just change the file and deploy.  
New versions of the schedule will be loaded only if 'version' is different.

# License

MIT © Hackers@UPC
