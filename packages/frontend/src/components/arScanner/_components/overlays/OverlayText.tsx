"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// シェーダー定義（変更なし）
const vertexShader = `
  uniform float amplitude;
  attribute vec3 displacement;
  attribute vec3 customColor;

  varying vec3 vColor;

  void main() {
    vec3 newPosition = position + amplitude * displacement;
    vColor = customColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
  }
`;

const fragmentShader = `
  uniform vec3 color;
  uniform float opacity;

  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4( vColor * color, opacity );
  }
`;

// onClick プロパティを追加
interface OverlayTextProps {
  onClick?: () => void;
}

export function OverlayText({ onClick }: OverlayTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // --- 1. シーン・カメラ・レンダラー ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. 必要な変数 ---
    let line: THREE.Line;
    let uniforms: any;

    // --- 3. フォント読み込みとオブジェクト作成 ---
    const loader = new FontLoader();

    loader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
      uniforms = {
        amplitude: { value: 5.0 },
        opacity: { value: 0.3 },
        color: { value: new THREE.Color(0xffffff) },
      };

      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      });

      const geometry = new TextGeometry("IdeaxTech", {
        font: font,
        size: 50,
        depth: 15,
        curveSegments: 10,
        bevelThickness: 5,
        bevelSize: 1.5,
        bevelEnabled: true,
        bevelSegments: 10,
      });

      geometry.center();

      const count = geometry.attributes.position.count;
      const displacement = new THREE.Float32BufferAttribute(count * 3, 3);
      geometry.setAttribute("displacement", displacement);

      const customColor = new THREE.Float32BufferAttribute(count * 3, 3);
      geometry.setAttribute("customColor", customColor);

      const color = new THREE.Color(0xffffff);

      for (let i = 0, l = customColor.count; i < l; i++) {
        color.setHSL(i / l, 0.5, 0.5);
        color.toArray(customColor.array, i * customColor.itemSize);
      }

      line = new THREE.Line(geometry, shaderMaterial);
      line.rotation.x = 0.2;
      scene.add(line);
    });

    // --- 4. アニメーション ---
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      if (line && uniforms) {
        line.rotation.y = 0.25 * time;
        uniforms.amplitude.value = Math.sin(0.5 * time);
        uniforms.color.value.offsetHSL(0.0005, 0, 0);

        const attributes = line.geometry.attributes;
        const array = attributes.displacement.array as Float32Array;

        for (let i = 0, l = array.length; i < l; i += 3) {
          array[i] += 0.3 * (0.5 - Math.random());
          array[i + 1] += 0.3 * (0.5 - Math.random());
          array[i + 2] += 0.3 * (0.5 - Math.random());
        }
        attributes.displacement.needsUpdate = true;
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
    <div
      // ここにonClickを追加し、ユーザーがオブジェクト（の領域）をタップできるようにする
      onClick={onClick}
      className="absolute left-1/2 top-1/2 flex h-80 w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
    >
      <div
        ref={containerRef}
        className="h-full w-full duration-500 animate-in zoom-in"
      />

      <div className="pointer-events-none mt-[-50px] rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur">
        <h3 className="text-center font-bold">ID: 1 Detected</h3>
        <p className="text-sm">Tap to view details</p>
      </div>
    </div>
  );
}
