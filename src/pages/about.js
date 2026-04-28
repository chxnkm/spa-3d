import * as THREE from 'three'

export class AboutScene {
  constructor(container) {
    this.container = container
  }

  init() {
    const container = document.createElement('div')
    container.className = 'page'
    this.container.appendChild(container)

    const content = document.createElement('div')
    content.className = 'page-content'
    content.innerHTML = `
      <h1>Particle Universe</h1>
      <p>A swirling galaxy of 6000 particles, each one dancing to the rhythm of the cosmos</p>
    `
    container.appendChild(content)

    const width = window.innerWidth
    const height = window.innerHeight

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x0a0a0f, 1)
    container.prepend(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.camera.position.z = 15

    const count = 6000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    this.phases = new Float32Array(count)
    this.radii = new Float32Array(count)
    this.speeds = new Float32Array(count)

    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const radius = 0.5 + Math.random() * 8
      const angle = Math.random() * Math.PI * 2
      const heightOffset = (Math.random() - 0.5) * 4

      const spiralFactor = radius * 0.3
      const x = Math.cos(angle + spiralFactor) * radius
      const z = Math.sin(angle + spiralFactor) * radius
      const y = heightOffset * (1 - radius / 10)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const hue = (radius / 10) * 0.8 + 0.5
      color.setHSL(hue % 1, 0.9, 0.5 + Math.random() * 0.3)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = 0.05 + Math.random() * 0.15
      this.phases[i] = Math.random() * Math.PI * 2
      this.radii[i] = radius
      this.speeds[i] = 0.002 + Math.random() * 0.005
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    })

    this.particles = new THREE.Points(geo, mat)
    this.scene.add(this.particles)

    this.originalPositions = positions.slice()

    this.time = 0
    this.animate()
    this.handleResize = this.onResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  animate() {
    this.raf = requestAnimationFrame(() => this.animate())
    this.time += 0.005

    const pos = this.particles.geometry.attributes.position.array
    const orig = this.originalPositions

    for (let i = 0; i < pos.length / 3; i++) {
      const i3 = i * 3
      const radius = this.radii[i]
      const phase = this.phases[i]
      const speed = this.speeds[i]

      const angle = this.time * speed * 20 + phase
      const wave = Math.sin(this.time * 2 + phase) * 0.3 * (radius / 8)
      const pulse = Math.sin(this.time * 1.5 + phase) * 0.5

      const origX = orig[i3]
      const origZ = orig[i3 + 2]
      const origAngle = Math.atan2(origZ, origX)

      const newAngle = origAngle + this.time * speed
      pos[i3] = Math.cos(newAngle) * radius + wave * Math.cos(origAngle)
      pos[i3 + 2] = Math.sin(newAngle) * radius + wave * Math.sin(origAngle)
      pos[i3 + 1] = orig[i3 + 1] + pulse * 0.3
    }

    this.particles.geometry.attributes.position.needsUpdate = true
    this.particles.rotation.y += 0.0005

    this.renderer.render(this.scene, this.camera)
  }

  onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.handleResize)
    this.renderer.dispose()
    this.container.innerHTML = ''
  }
}
