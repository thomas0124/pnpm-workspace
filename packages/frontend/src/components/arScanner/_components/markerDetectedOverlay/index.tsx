"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

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
export function MarkerDetectedOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let line: THREE.Line;
    let uniforms: any;
    let animationId: number;

    const init = () => {
      const width = containerRef.current!.clientWidth;
      const height = containerRef.current!.clientHeight;

      camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
      camera.position.z = 400;

      scene = new THREE.Scene();
      uniforms = {
        amplitude: { value: 5.0 },
        opacity: { value: 0.3 },
        color: { value: new THREE.Color(0xffffff) },
      };

      // マテリアル設定
      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      });

      const loader = new FontLoader();
      loader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
        // publicフォルダからのパス
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

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 背景透明化のためalpha: true
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      containerRef.current!.appendChild(renderer.domElement);

      animate();
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      if (!line) return;

      const time = Date.now() * 0.001;

      line.rotation.y = 0.25 * time;

      uniforms.amplitude.value = Math.sin(0.5 * time);
      uniforms.color.value.offsetHSL(0.0005, 0, 0);

      const attributes = line.geometry.attributes as any;
      const array = attributes.displacement.array;

      for (let i = 0, l = array.length; i < l; i += 3) {
        array[i] += 0.3 * (0.5 - Math.random());
        array[i + 1] += 0.3 * (0.5 - Math.random());
        array[i + 2] += 0.3 * (0.5 - Math.random());
      }

      attributes.displacement.needsUpdate = true;

      renderer.render(scene, camera);
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      if (line) {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      }
    };
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center">
      {/* 描画エリア: サイズ調整が必要な場合はclassNameを変更してください */}
      <div
        ref={containerRef}
        className="h-96 w-full duration-300 animate-in fade-in zoom-in"
      />

      {/* 情報表示部分（元のコンポーネントから維持） */}
      <div className="mt-4 rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-sm">
        <h2 className="mb-2 text-center text-lg font-bold text-gray-900">
          AR MARKER DETECTED
        </h2>
        <p className="text-center text-sm text-gray-500">
          Custom Shader Object
        </p>
      </div>
    </div>
  );
}
