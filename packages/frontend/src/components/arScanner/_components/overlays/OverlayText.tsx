"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export function OverlayText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // シーン・カメラ・レンダラー
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, 400);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // テキスト作成
    const loader = new FontLoader();
    let mesh: THREE.Mesh;

    loader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
      const geometry = new TextGeometry("IdeaxTech", {
        font: font,
        size: 40,
        depth: 10,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1,
        bevelSegments: 5,
      });
      geometry.center();

      const material = new THREE.MeshNormalMaterial(); // カラフルなマテリアル
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    });

    // アニメーション
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (mesh) {
        mesh.rotation.y += 0.01; // 回転
        mesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 flex h-80 w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center">
      <div
        ref={containerRef}
        className="h-full w-full duration-500 animate-in zoom-in"
      />
      <div className="mt-[-50px] rounded-xl bg-white/90 p-4 shadow-lg">
        <h3 className="text-center font-bold">ID: 1 Detected</h3>
        <p className="text-sm">3D Text Object</p>
      </div>
    </div>
  );
}
