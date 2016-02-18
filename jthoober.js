module.exports = [
  {
    pattern: /hackupc/,
    branchPattern: /master/,
    event: 'push',
    script: 'git pull && npm i && gulp'
  }
]
