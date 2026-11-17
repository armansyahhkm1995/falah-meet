"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[550px] flex flex-col items-center justify-center bg-slate-900 text-white text-xs gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-medium text-slate-300">Memuat Excalidraw Whiteboard...</span>
      </div>
    ),
  }
);

interface ExcalidrawWhiteboardProps {
  onClose?: () => void;
}

export function ExcalidrawWhiteboard({ onClose }: ExcalidrawWhiteboardProps) {
  return (
    <div className="w-full h-[75vh] min-h-[580px] rounded-b-xl overflow-hidden relative bg-white text-slate-900">
      <Excalidraw
        theme="light"
        langCode="id-ID"
        UIOptions={{
          canvasActions: {
            saveAsImage: true,
            export: false,
            loadScene: false,
            clearCanvas: true,
          },
        }}
      />
    </div>
  );
}
