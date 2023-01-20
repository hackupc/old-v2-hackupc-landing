import '/src/styles/houdini.scss'

type WorkarroundCSS = typeof CSS & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paintWorklet?: any
}

const WorkarroundCSS: WorkarroundCSS = CSS

const asyncFunction = async () => {
  if (WorkarroundCSS['paintWorklet'] === undefined) {
    await import('css-paint-polyfill')
  }

  // TODO: Use the npm package `css-houdini-voronoi` instead
  WorkarroundCSS.paintWorklet.addModule(
    'https://unpkg.com/css-houdini-voronoi/dist/worklet.js'
  )
}

asyncFunction()
