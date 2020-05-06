# Notes

To optimize svgs and fix problems run:
```bash
cd src/assets/
svgo *.svg  --enable=inlineStyles  --config '{ "plugins": [ { "inlineStyles": { "onlyMatchedOnce": false } }] }'
svgo ./**/*.svg  --enable=inlineStyles  --config '{ "plugins": [ { "inlineStyles": { "onlyMatchedOnce": false } }] }'
```