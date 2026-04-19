// =========================================================
// CINERGIA 360 · HOMBRE PÁLIDO — Configuración del modelo 3D
// Modelo: models/HombrePalido.glb
// Capas:  HP_Rostro · HP_Mano
// =========================================================
//
// AUDIO PLACEHOLDERS
// Convención: audio/[Modelo]_[Parte]_nombre.mp3  ← hover (debounced 300 ms)
//             audio/[Modelo]_[Parte]_desc.mp3    ← popup (botón del panel)
// Sustituir con los archivos reales cuando estén listos.
// =========================================================

import { initViewer } from "./modelo-viewer-core.js";

export const PARTES = {
  "HP_Rostro": {
    title:       "Cabeza",
    text:        "Tiene una forma alargada y cae hacia abajo como si la piel estuviera escurriendo o colgando. En el rostro no hay ojos. Solo se distinguen dos aberturas pequeñas en la parte alta, donde va la nariz. Más abajo aparece una boca abierta con dientes pequeños y separados. Se siente extraño e inquietante.",
    audioNombre: "audio/HP_CABEZA.mp3",
    audioDesc:   "audio/HP_CABEZA DESC.mp3"
  },
  "HP_Mano": {
    title:       "Mano",
    text:        "Junto a la cabeza aparece una mano grande, con dedos muy largos, delgados y estirados. En el centro de la palma hay un ojo abierto y muy marcado. Esta parte ayuda a entender que el personaje no mira con el rostro, sino con las manos.",
    audioNombre: "audio/HP_MANO.mp3",
    audioDesc:   "audio/HP_MANO DESC.mp3"
  }
};

export function init() {
  initViewer({
    modelPath: "models/HombrePalido.glb",
    partes:    PARTES
  });
}
