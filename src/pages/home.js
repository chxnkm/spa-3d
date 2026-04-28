import * as THREE from 'three'

export class HomeScene {
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
      <h1>Welcome to 3D Space</h1>
      <p>Explore the beauty of three-dimensional worlds built with WebGL and Three.js</p>
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
    this.camera.position.z = 8

    const ambient = new THREE.AmbientLight(0x404060)
    this.scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 2)
    dirLight.position.set(5, 10, 7)
    this.scene.add(dirLight)

    const pointLight = new THREE.PointLight(0x4facfe, 2, 20)
    pointLight.position.set(-4, 3, 4)
    this.scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0xf5576c, 2, 20)
    pointLight2.position.set(4, -3, 4)
    this.scene.add(pointLight2)

    const geo1 = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32)
    const mat1 = new THREE.MeshStandardMaterial({
      color: 0x4facfe,
      metalness: 0.3,
      roughness: 0.4,
      emissive: 0x4facfe,
      emissiveIntensity: 0.1,
    })
    this.torusKnot = new THREE.Mesh(geo1, mat1)
    this.torusKnot.position.y = 0.5
    this.scene.add(this.torusKnot)

    const geo2 = new THREE.IcosahedronGeometry(0.8, 0)
    const mat2 = new THREE.MeshStandardMaterial({
      color: 0xf5576c,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0xf5576c,
      emissiveIntensity: 0.1,
      wireframe: false,
    })
    this.icosahedron = new THREE.Mesh(geo2, mat2)
    this.icosahedron.position.set(-2.5, -1, -1)
    this.scene.add(this.icosahedron)

    const geo3 = new THREE.OctahedronGeometry(0.7)
    const mat3 = new THREE.MeshStandardMaterial({
      color: 0xf093fb,
      metalness: 0.4,
      roughness: 0.2,
      emissive: 0xf093fb,
      emissiveIntensity: 0.1,
    })
    this.octahedron = new THREE.Mesh(geo3, mat3)
    this.octahedron.position.set(2.5, -0.5, -1)
    this.scene.add(this.octahedron)

    const ringGeo = new THREE.TorusGeometry(0.6, 0.12, 24, 48)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0xffd700,
      emissiveIntensity: 0.05,
    })
    this.ring = new THREE.Mesh(ringGeo, ringMat)
    this.ring.position.set(0, -1.8, 0.5)
    this.scene.add(this.ring)

    const starGeo = new THREE.BufferGeometry()
    const starCount = 2000
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })
    this.stars = new THREE.Points(starGeo, starMat)
    this.scene.add(this.stars)

    this.time = 0
    this.animate()
    this.handleResize = this.onResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  animate() {
    this.raf = requestAnimationFrame(() => this.animate())
    this.time += 0.01

    this.torusKnot.rotation.x += 0.01
    this.torusKnot.rotation.y += 0.015

    this.icosahedron.rotation.x += 0.008
    this.icosahedron.rotation.y += 0.012
    this.icosahedron.position.y = -1 + Math.sin(this.time * 0.8) * 0.4

    this.octahedron.rotation.x -= 0.01
    this.octahedron.rotation.y += 0.009
    this.octahedron.position.y = -0.5 + Math.sin(this.time * 0.6 + 1) * 0.4

    this.ring.rotation.x += 0.02
    this.ring.rotation.z += 0.01
    this.ring.scale.setScalar(1 + Math.sin(this.time * 0.5) * 0.05)

    this.stars.rotation.y += 0.0002

    this.camera.position.x = Math.sin(this.time * 0.05) * 1.5
    this.camera.lookAt(0, 0, 0)

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
