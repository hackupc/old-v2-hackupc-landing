> IF YOU WANNA TEST THE NEW LIVE ENSURE `testing` VARIABLE IS SET TO  `true` .

Install
-------

First off, you need the `sass` ruby gem. You can install it with `sudo
gem install sass`. Make sure to have `gulp` and `bower` installed
globally. Then run:

	npm install
	bower install
	gulp


Develop
-------

Use `gulp watch` to compile the dist directory in real time.

Remember to save all new dependencies with `--dev`.


Deploy
------

Statically serve the `dist/` directory.



## Live

For testing purposes `live.js` has a `testing` variable that mocks events in the near future so that there's no need to keep changing `events.json`. It also reduces the polling rate to 1 second.

New features:

- Desktop notifications
- Live reload
- Options panel to filter by type of notifications
  - 4 types of notifications (provisional): essential, food, events, talks
  - essential notifications are always sent
  - food, events and talks can be filtered out depending on your preferences.
- Options panel also includes a checkbox to switch off background animation.
- Progress bars!