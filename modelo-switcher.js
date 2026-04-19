// =========================================================
// CINERGIA 360 · MODELO SWITCHER
//
// Carga Fauno por defecto al abrir la página y gestiona el
// cambio de modelo desde los botones del catálogo.
//
// Responsabilidades:
//   - Cargar dinámicamente el módulo JS de cada modelo
//   - Actualizar el encabezado del viewer y la barra de detalle
//   - Actualizar el estado visual del catálogo (is-active)
//   - Regenerar la lista accesible de partes (#partes-lista)
// =========================================================

// Registro del catálogo: orden y metadatos de cada modelo
const CATALOG = [
  {
    key:   "fauno",
    label: "Fauno",
    src:   "./fauno-modelo.js"
  },
  {
    key:   "ofelia",
    label: "Ofelia",
    src:   "./ofeliamodelo.js"
  },
  {
    key:   "hombrepálido",
    label: "Hombre Pálido",
    src:   "./hombre-palido-modelo.js"
  },
  {
    key:   "capitanvidal",
    label: "Capitán Vidal",
    src:   "./capitan-vidal-modelo.js"
  },
  {
    key:   "mandragora",
    label: "Mandrágora",
    src:   "./mandragora-modelo.js"
  }
];

let _activeKey = null;

// ─── Actualiza el encabezado del viewer y la barra inferior ───
function updateViewerHeader(entry) {
  const titulo  = document.getElementById("modeloSeleccionadoTitulo");
  const barName = document.querySelector(".model-file-bar__content strong");
  const barSub  = document.querySelector(".model-file-bar__content span");
  const canvas  = document.getElementById("viewerCanvas");

  if (titulo)  titulo.textContent = entry.label;
  if (barName) barName.textContent = entry.label;
  if (barSub)  barSub.textContent  = ".glb · Modelo 3D · Visualización interactiva";
  if (canvas) {
    canvas.setAttribute(
      "aria-label",
      `Visualizador 3D de ${entry.label}. Usa el ratón para rotar, hacer zoom y hacer clic en las partes.`
    );
  }
}

// ─── Actualiza el estado visual del catálogo ───
function updateCatalogState(activeKey) {
  const items = document.querySelectorAll(".model-catalog-item[data-model-key]");
  items.forEach((btn) => {
    const isActive = btn.dataset.modelKey === activeKey;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-current", isActive ? "true" : "false");

    const label = btn.querySelector(".model-catalog-item__content strong");
    const entry = CATALOG.find((c) => c.key === btn.dataset.modelKey);
    if (btn.hasAttribute("aria-label") && entry) {
      btn.setAttribute(
        "aria-label",
        isActive
          ? `${entry.label} — Disponible. Actualmente seleccionado.`
          : `${entry.label} — Disponible`
      );
    }
  });
}

// ─── Regenera la lista accesible de partes ───
// Genera el HTML de cada parte a partir del mapa PARTES del módulo.
function buildFallbackList(partes, modelLabel) {
  const sectionTitle = document.getElementById("partes-title");
  if (sectionTitle) {
    sectionTitle.textContent = `Partes de ${modelLabel} — descripción por lista`;
  }

  const list = document.querySelector(".partes-list");
  if (!list) return;

  list.setAttribute(
    "aria-label",
    `Lista de partes del modelo ${modelLabel} con descripción y audio`
  );

  list.innerHTML = Object.entries(partes).map(([key, parte]) => {
    const safeId   = key.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const audioSrc = parte.audioDesc || "";
    return `
      <li class="parte-item" id="parte-${safeId}">
        <div class="parte-item__info">
          <div class="parte-item__marker" aria-hidden="true">
            <i class="fa-solid fa-circle-dot"></i>
          </div>
          <div class="parte-item__content">
            <h4 class="parte-item__nombre">${parte.title}</h4>
            <p class="parte-item__desc">${parte.text}</p>
          </div>
        </div>
        <div class="parte-item__audio">
          <button
            type="button"
            class="parte-audio-btn"
            data-audio="${audioSrc}"
            aria-label="Escuchar descripción de audio: ${parte.title}"
            aria-pressed="false"
          >
            <i class="fa-solid fa-volume-high" aria-hidden="true"></i>
            <span>Escuchar descripción</span>
          </button>
        </div>
      </li>`;
  }).join("");
}

// ─── Cambio de modelo ───
async function switchModel(key) {
  if (key === _activeKey) return;
  _activeKey = key;

  const entry = CATALOG.find((c) => c.key === key);
  if (!entry) return;

  updateViewerHeader(entry);
  updateCatalogState(key);

  const module = await import(entry.src);
  buildFallbackList(module.PARTES, entry.label);
  module.init();
}

// ─── Bind botones del catálogo ───
function bindCatalogButtons() {
  const items = document.querySelectorAll(".model-catalog-item[data-model-key]");
  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.modelKey;
      if (key) switchModel(key);
    });
  });
}

// ─── Arranque ───
bindCatalogButtons();
switchModel("fauno");
