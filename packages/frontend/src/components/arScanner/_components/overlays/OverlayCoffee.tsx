"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// onClick プロパティを追加
interface OverlayCoffeeProps {
  onClick?: () => void;
}

export function OverlayCoffee({ onClick }: OverlayCoffeeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;

    const init = () => {
      const width = containerRef.current!.clientWidth;
      const height = containerRef.current!.clientHeight;

      // 1. レンダラーの設定
      // alpha: true で背景を透明にし、カメラ映像が見えるようにする
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      containerRef.current!.appendChild(renderer.domElement);

      // 2. カメラの設定
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
      camera.position.set(0, 100, 0);

      // 3. 環境とシーンの設定
      const environment = new RoomEnvironment();
      const pmremGenerator = new THREE.PMREMGenerator(renderer);

      scene = new THREE.Scene();
      // 元コードの背景色は削除し、環境マップのみ適用
      // scene.background = new THREE.Color(0xbbbbbb)
      scene.environment = pmremGenerator.fromScene(environment).texture;
      environment.dispose();

      // 4. グリッドの追加
      const grid = new THREE.GridHelper(500, 10, 0xffffff, 0xffffff);
      grid.material.opacity = 0.5;
      grid.material.depthWrite = false;
      grid.material.transparent = true;
      scene.add(grid);

      // 5. ローダーの設定 (KTX2 & Meshopt)
      const ktx2Loader = new KTX2Loader()
        .setTranscoderPath("/jsm/libs/basis/") // publicフォルダのパスを指定
        .detectSupport(renderer);

      const loader = new GLTFLoader();
      loader.setPath("/models/gltf/"); // publicフォルダのパス
      loader.setKTX2Loader(ktx2Loader);
      loader.setMeshoptDecoder(MeshoptDecoder);

      // モデルのロード
      loader.load("coffeemat.glb", (gltf) => {
        // coffeemat.glb was produced from the source scene using gltfpack
        gltf.scene.position.y = 8;
        scene.add(gltf.scene);

        render();
      });

      // 6. コントロールの設定
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener("change", render); // アニメーションループではなく変更時のみレンダリング
      controls.minDistance = 400;
      controls.maxDistance = 1000;
      controls.target.set(10, 90, -16);
      controls.update();

      window.addEventListener("resize", onWindowResize);
    };

    const onWindowResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    init();

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      if (controls) controls.dispose();
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className="absolute left-1/2 top-1/2 flex h-80 w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
    >
      {/* Three.js描画エリア */}
      <div
        ref={containerRef}
        className="h-full w-full duration-500 animate-in zoom-in"
      />

      <div className="pointer-events-none mt-[-50px] rounded-xl bg-white/90 p-4 shadow-lg">
        <h3 className="text-center font-bold">ID: 3 Detected</h3>
        <p className="text-sm">Tap to view details</p>
      </div>
    </div>
  );
}
