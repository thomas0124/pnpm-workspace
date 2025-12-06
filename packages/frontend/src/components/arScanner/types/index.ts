// AR.js関連の型定義

export interface ARController {
  detectMarker(imageData: ImageData): void;
  addEventListener(
    event: "getMarker",
    callback: (event: ARMarkerEvent) => void,
  ): void;
  removeEventListener?(
    event: "getMarker",
    callback: (event: ARMarkerEvent) => void,
  ): void;
  dispose?(): void;
}

export interface ARMarkerEvent {
  data: {
    marker: {
      id: number;
    };
  };
}

declare global {
  interface Window {
    ARController: new (
      canvas: HTMLCanvasElement,
      cameraParamUrl: string,
    ) => ARController;
  }
}
