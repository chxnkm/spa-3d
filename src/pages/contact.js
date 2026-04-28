import * as THREE from 'three'

export class ContactScene {
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
      <h1>Get in Touch</h1>
      <p>Like what you see? Reach out and let's create something amazing together.</p>
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
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    this.camera.position.set(0, 8, 14)
    this.camera.lookAt(0, 0, 0)

    const ambient = new THREE.AmbientLight(0x222244)
    this.scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(5, 10, 7)
    this.scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0x4facfe, 0.5)
    fillLight.position.set(-5, 0, 5)
    this.scene.add(fillLight)

    const segments = 64
    const geo = new THREE.BufferGeometry()
    const vertices = []
    const indices = []
    const normals = []
    const colors = []

    const size = 8

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments - 0.5) * size
      for (let j = 0; j <= segments; j++) {
        const z = (j / segments - 0.5) * size
        vertices.push(x, 0, z)
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j
        const b = i * (segments + 1) + j + 1
        const c = (i + 1) * (segments + 1) + j
        const d = (i + 1) * (segments + 1) + j + 1
        indices.push(a, b, c)
        indices.push(b, d, c)
      }
    }

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const nx = (i / segments) * 2 - 1
        const nz = (j / segments) * 2 - 1
        normals.push(0, 1, 0)
        const hue = (i / segments) * 0.6 + 0.55
        const col = new THREE.Color().setHSL(hue % 1, 0.8, 0.5)
        colors.push(col.r, col.g, col.b)
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.setIndex(indices)

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      wireframe: false,
      metalness: 0.2,
      roughness: 0.6,
      flatShading: false,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(geo, mat)
    this.scene.add(this.mesh)

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4facfe,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    })
    this.wireframe = new THREE.Mesh(geo.clone(), wireMat)
    this.scene.add(this.wireframe)

    this.time = 0
    this.animate()
    this.handleResize = this.onResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  animate() {
    this.raf = requestAnimationFrame(() => this.animate())
    this.time += 0.01

    const positions = this.mesh.geometry.attributes.position.array
    const wirePositions = this.wireframe.geometry.attributes.position.array

    const segments = 64
    const size = 8

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const idx = (i * (segments + 1) + j) * 3
        const x = (i / segments - 0.5) * size
        const z = (j / segments - 0.5) * size

        const dist = Math.sqrt(x * x + z * z)
        const y = Math.sin(dist * 1.5 - this.time * 2) * 0.8
               + Math.sin(x * 1.2 + this.time * 1.3) * 0.3
               + Math.cos(z * 1.1 + this.time * 1.7) * 0.3

        positions[idx + 1] = y
        wirePositions[idx + 1] = y
      }
    }

    this.mesh.geometry.attributes.position.needsUpdate = true
    this.wireframe.geometry.attributes.position.needsUpdate = true
    this.mesh.geometry.computeVertexNormals()

    this.mesh.rotation.y += 0.002
    this.wireframe.rotation.y += 0.002

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
