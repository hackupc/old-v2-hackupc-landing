if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    await navigator.serviceWorker.register('/service-worker.js')
  })
}

self.addEventListener('install', function () {
  self.skipWaiting()
})

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
})
