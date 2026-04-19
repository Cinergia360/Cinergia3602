// =========================================================
// CINERGIA 360 · OFELIA — Configuración del modelo 3D
// Modelo: models/Ofelia.glb
// Capas:  O_Rostro · O_Ropa
// =========================================================
//
// AUDIO PLACEHOLDERS
// Convención: audio/[Modelo]_[Parte]_nombre.mp3  ← hover (debounced 300 ms)
//             audio/[Modelo]_[Parte]_desc.mp3    ← popup (botón del panel)
// Sustituir con los archivos reales cuando estén listos.
// =========================================================

import { initViewer } from "./modelo-viewer-core.js";

export const PARTES = {
  "O_Rostro": {
    title:       "Rostro",
    text:        "Tiene el cabello corto, lacio y partido al centro. Cae hacia los lados hasta la altura de la mandíbula y lleva un moño pequeño en la parte superior. Su rostro es pequeño y ovalado, con ojos grandes, nariz corta y boca pequeña. La expresión transmite atención, asombro y cautela.",
    audioNombre: "audio/Ofelia_Rostro_nombre.mp3",
    audioDesc:   "audio/Ofelia_Rostro_desc.mp3"
  },
  "O_Ropa": {
    title:       "Ropa",
    text:        "Lleva un vestido sencillo con cuello redondeado y mangas cortas con volumen. La ropa refuerza la imagen de una niña pequeña y contrasta con el entorno duro que la rodea.",
    audioNombre: "audio/Ofelia_Ropa_nombre.mp3",
    audioDesc:   "audio/Ofelia_Ropa_desc.mp3"
  }
};

export function init() {
  initViewer({
    modelPath: "models/Ofelia.glb",
    partes:    PARTES
  });
}
