if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    await navigator.serviceWorker.register('/service-worker.js')
  })
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
})
