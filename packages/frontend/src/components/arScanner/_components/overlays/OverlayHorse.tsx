"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export function OverlayHorse() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000)
    camera.position.set(0, 100, 400)

    // ライティング
    const ambientLight = new THREE.AmbientLight(0xffffff, 2)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 3)
    dirLight.position.set(100, 100, 100)
    scene.add(dirLight)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    containerRef.current.appendChild(renderer.domElement)

    // モデル読み込み
    const clock = new THREE.Clock()
    let mixer: THREE.AnimationMixer

    const loader = new GLTFLoader()
    loader.load("/models/Horse.glb", (gltf) => {
      const mesh = gltf.scene.children[0]
      mesh.scale.set(1.2, 1.2, 1.2)
      scene.add(mesh)

      mixer = new THREE.AnimationMixer(mesh)
      if (gltf.animations.length > 0) {
        mixer.clipAction(gltf.animations[0]).play()
      }
    })

    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (mixer) mixer.update(clock.getDelta())
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
        renderer.dispose()
      }
    }
  }, [])

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-80 flex flex-col items-center">
      <div ref={containerRef} className="w-full h-full animate-in zoom-in duration-500" />
      <div className="bg-white/90 p-4 rounded-xl shadow-lg mt-[-50px]">
        <h3 className="font-bold text-center">ID: 2 Detected</h3>
        <p className="text-sm">Running Horse</p>
      </div>
    </div>
  )
}