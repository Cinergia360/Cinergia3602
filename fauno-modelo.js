// =========================================================
// CINERGIA 360 · FAUNO — Configuración del modelo 3D
// Modelo: models/Fauno.glb
// Capas:  F_Cabeza · F_Cuernos · F_Torso
// =========================================================
//
// AUDIO PLACEHOLDERS
// Convención: audio/[Modelo]_[Parte]_nombre.mp3  ← hover (debounced 300 ms)
//             audio/[Modelo]_[Parte]_desc.mp3    ← popup (botón del panel)
// Sustituir con los archivos reales cuando estén listos.
// =========================================================

import { initViewer } from "./modelo-viewer-core.js";

export const PARTES = {
  "F_Cabeza": {
    title:       "Cabeza",
    text:        "La cabeza del Fauno es alargada y estrecha. El rostro mezcla rasgos humanos y de animal. Tiene pómulos marcados, nariz larga y una superficie llena de grietas, surcos y relieves. La textura recuerda a la madera: no es lisa, sino seca, marcada y desigual, como si el rostro estuviera formado por corteza.",
    audioNombre: "audio/Fauno_Cabeza_nombre.mp3",
    audioDesc:   "audio/Fauno_Cabeza_desc.mp3"
  },
  "F_Cuernos": {
    title:       "Cuernos",
    text:        "Los cuernos nacen en la parte superior de la cabeza. Se abren hacia los lados, luego se curvan y terminan en punta. Empiezan anchos en la base y su superficie tiene líneas y anillos profundos, parecidos a los de un cuerno de carnero.",
    audioNombre: "audio/Fauno_Cuernos_nombre.mp3",
    audioDesc:   "audio/Fauno_Cuernos_desc.mp3"
  },
  "F_Torso": {
    title:       "Torso",
    text:        "El torso está erguido y lleno de relieves. En el pecho hay curvas, espirales y líneas hundidas. No parece un cuerpo humano simétrico. La superficie también recuerda a la madera y a la corteza.",
    audioNombre: "audio/Fauno_Torso_nombre.mp3",
    audioDesc:   "audio/Fauno_Torso_desc.mp3"
  }
};

export function init() {
  initViewer({
    modelPath: "models/Fauno.glb",
    partes:    PARTES
  });
}
