// =========================================================
// CINERGIA 360 · CAPITÁN VIDAL — Configuración del modelo 3D
// Modelo: models/CapitanVidal.glb
// Capas:  CV_Gorra · CV_Rostro · CV_Ropa
// =========================================================
//
// AUDIO PLACEHOLDERS
// Convención: audio/[Modelo]_[Parte]_nombre.mp3  ← hover (debounced 300 ms)
//             audio/[Modelo]_[Parte]_desc.mp3    ← popup (botón del panel)
// Sustituir con los archivos reales cuando estén listos.
// =========================================================

import { initViewer } from "./modelo-viewer-core.js";

export const PARTES = {
  "CV_Gorra": {
    title:       "Gorra",
    text:        "En la parte superior de la cabeza lleva una gorra representativa de un uniforme de mando ligado al franquismo. Es amplia, rígida y tiene una visera recta al frente. En la banda frontal aparecen estrellas, y en la parte superior hay un emblema.",
    audioNombre: "audio/CV_GORRA.mp3",
    audioDesc:   "audio/CV_GORRA DESC.mp3"
  },
  "CV_Rostro": {
    title:       "Cabeza",
    text:        "El rostro es ancho y firme. La mandíbula está marcada. Las cejas son gruesas y tensas. La boca suele mantenerse recta o apenas abierta. La expresión transmite dureza, vigilancia y control.",
    audioNombre: "audio/CV_CABEZA.mp3",
    audioDesc:   "audio/CV_CABEZA DESC.mp3"
  },
  "CV_Ropa": {
    title:       "Uniforme",
    text:        "Debajo aparece un uniforme de mando ligado al franquismo. El cuello está cerrado hasta arriba. Los hombros son rectos y marcados, con hombreras visibles y con insignias. En el cuello también hay insignias y en el centro un botón.",
    audioNombre: "audio/CV_ROPA.mp3",
    audioDesc:   "audio/CV_ROPA DESC.mp3"
  }
};

export function init() {
  initViewer({
    modelPath: "models/CapitanVidal.glb",
    partes:    PARTES
  });
}
