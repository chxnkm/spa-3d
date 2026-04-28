import './style.css'
import { HomeScene } from './pages/home.js'
import { AboutScene } from './pages/about.js'
import { ContactScene } from './pages/contact.js'

const app = document.getElementById('app')
const navLinks = document.querySelectorAll('#nav a')

let currentScene = null

function disposeScene(scene) {
  if (scene) {
    scene.dispose()
  }
}

function getHash() {
  return window.location.hash.replace('#', '') || '/'
}

function navigate() {
  const route = getHash()

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.route === route)
  })

  disposeScene(currentScene)
  app.innerHTML = ''

  switch (route) {
    case '/':
      currentScene = new HomeScene(app)
      break
    case '/about':
      currentScene = new AboutScene(app)
      break
    case '/contact':
      currentScene = new ContactScene(app)
      break
    default:
      currentScene = new HomeScene(app)
  }

  currentScene.init()
}

window.addEventListener('hashchange', navigate)
window.addEventListener('load', navigate)
