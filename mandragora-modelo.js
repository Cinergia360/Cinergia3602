// =========================================================
// CINERGIA 360 · MANDRÁGORA — Configuración del modelo 3D
// Modelo: models/Mandragora.glb
// Capa:   Mandragora
// =========================================================
//
// AUDIO PLACEHOLDERS
// Convención: audio/[Modelo]_nombre.mp3  ← hover (debounced 300 ms)
//             audio/[Modelo]_desc.mp3   ← popup (botón del panel)
// Sustituir con los archivos reales cuando estén listos.
// =========================================================

import { initViewer } from "./modelo-viewer-core.js";

export const PARTES = {
  "Mandragora": {
    title:       "Mandrágora",
    text:        "Remite a un cuerpo pequeño, parecido al de un ser humano, pero está completamente deformada. No tiene bordes claros ni partes bien definidas. La cabeza, el torso, los brazos y las piernas apenas se distinguen entre los surcos y pliegues naturales de la raíz. La superficie es irregular, con curvas, hundimientos, bultos y salidas delgadas que parecen raíces más finas. En lugar de una figura limpia o simétrica, aparece un cuerpo retorcido, orgánico y confuso, que mantiene la apariencia propia de una mandrágora arrancada de la tierra.",
    audioNombre: "audio/Mandragora_nombre.mp3",
    audioDesc:   "audio/Mandragora_desc.mp3"
  }
};

export function init() {
  initViewer({
    modelPath: "models/Mandragora.glb",
    partes:    PARTES
  });
}
