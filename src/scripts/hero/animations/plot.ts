type Point = { x: number; y: number }

const plotLinesSteps = 5
const plotWidth = 200
const plotHeight = 100

const plotLines = [
  document.querySelector<SVGPathElement>('.plot__plot-line--1'),
  document.querySelector<SVGPathElement>('.plot__plot-line--2'),
  document.querySelector<SVGPathElement>('.plot__plot-line--3'),
  document.querySelector<SVGPathElement>('.plot__plot-line--4'),
] as const
const barContents = [
  document.querySelector<HTMLDivElement>('.plot__bar-content--1'),
  document.querySelector<HTMLDivElement>('.plot__bar-content--2'),
  document.querySelector<HTMLDivElement>('.plot__bar-content--3'),
  document.querySelector<HTMLDivElement>('.plot__bar-content--4'),
] as const

for (let i = 0; i < plotLines.length; i++) {
  animatePlotLine(i)
}

function animatePlotLine(i: number): void {
  const plotLine = plotLines[i]
  const barContent = barContents[i]

  if (!plotLine || !barContent) return

  plotLine.setAttribute('d', makePath(randomPoints()))
  barContent.style.transform = `scaleY(${Math.random()})`

  setTimeout(() => {
    animatePlotLine(i)
  }, Math.random() * 5000 + 5500)
}

function randomPoints(): Point[] {
  return Array.from({ length: plotLinesSteps + 1 }, (value, i) => {
    return {
      x: (i * plotWidth) / plotLinesSteps,
      y: Math.floor(Math.random() * (plotHeight + 1)),
    }
  })
}

// This function is copied from this article:
// https://advancedweb.hu/plotting-charts-with-svg/
function catmullRom2bezier(points: Point[]): [Point, Point, Point][] {
  const result = []
  for (let i = 0; i < points.length - 1; i++) {
    const p = [
      {
        x: points[Math.max(i - 1, 0)].x,
        y: points[Math.max(i - 1, 0)].y,
      },
      {
        x: points[i].x,
        y: points[i].y,
      },
      {
        x: points[i + 1].x,
        y: points[i + 1].y,
      },
      {
        x: points[Math.min(i + 2, points.length - 1)].x,
        y: points[Math.min(i + 2, points.length - 1)].y,
      },
    ] as [Point, Point, Point, Point]

    // Catmull-Rom to Cubic Bezier conversion matrix
    //    0       1       0       0
    //  -1/6      1      1/6      0
    //    0      1/6      1     -1/6
    //    0       0       1       0

    result.push([
      {
        x: (-p[0].x + 6 * p[1].x + p[2].x) / 6,
        y: (-p[0].y + 6 * p[1].y + p[2].y) / 6,
      },
      {
        x: (p[1].x + 6 * p[2].x - p[3].x) / 6,
        y: (p[1].y + 6 * p[2].y - p[3].y) / 6,
      },
      {
        x: p[2].x,
        y: p[2].y,
      },
    ] as [Point, Point, Point])
  }

  return result
}

function makePath(points: Point[]): string {
  let result = 'M' + points[0].x + ',' + points[0].y + ' '
  const catmulls = catmullRom2bezier(points)

  for (const catmull of catmulls) {
    result +=
      'C' +
      catmull[0].x +
      ',' +
      catmull[0].y +
      ' ' +
      catmull[1].x +
      ',' +
      catmull[1].y +
      ' ' +
      catmull[2].x +
      ',' +
      catmull[2].y +
      ' '
  }
  return result
}
