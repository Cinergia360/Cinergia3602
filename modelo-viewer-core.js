// =========================================================
// CINERGIA 360 · MOTOR COMPARTIDO DEL VISUALIZADOR 3D
//
// Exporta:
//   initViewer({ modelPath, partes }) — inicializa el viewer
//   disposeViewer()                   — limpia estado anterior
//
// Cada archivo de modelo llama initViewer() con su propia
// configuración. disposeViewer() se llama automáticamente al
// inicio de cada initViewer() para evitar listeners duplicados.
// =========================================================

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

// ─── Estado del viewer activo ───
let _renderer      = null;
let _controls      = null;
let _animFrame     = null;
let _hoverMaterial = null;
let _hoverAudioEl  = null;
let _hoverTimer    = null;
let _startFn       = null;
let _endFn         = null;

// Registro de todos los listeners DOM para limpieza completa
const _domListeners = []; // { el, event, fn }

function _addListener(el, event, fn) {
  if (!el) return;
  el.addEventListener(event, fn);
  _domListeners.push({ el, event, fn });
}

// ─── disposeViewer ───
// Cancela el loop, elimina listeners y libera recursos Three.js.
export function disposeViewer() {
  if (_animFrame !== null) { cancelAnimationFrame(_animFrame); _animFrame = null; }

  if (_hoverAudioEl) {
    _hoverAudioEl.pause();
    _hoverAudioEl.src = "";
  }
  clearTimeout(_hoverTimer);
  _hoverTimer = null;

  _domListeners.forEach(({ el, event, fn }) => el.removeEventListener(event, fn));
  _domListeners.length = 0;

  if (_controls && _startFn) _controls.removeEventListener("start", _startFn);
  if (_controls && _endFn)   _controls.removeEventListener("end",   _endFn);
  _startFn = null;
  _endFn   = null;

  if (_hoverMaterial) { _hoverMaterial.dispose(); _hoverMaterial = null; }
  if (_controls)      { _controls.dispose();       _controls      = null; }
  if (_renderer)      { _renderer.dispose();       _renderer      = null; }

  _hoverAudioEl = null;
}

// ─── initViewer ───
// Inicializa el viewer Three.js con la configuración del modelo.
// Parámetros:
//   modelPath  — ruta relativa al archivo .glb
//   partes     — mapa de capas: { "NombreMesh": { title, text, audioNombre, audioDesc } }
export function initViewer({ modelPath, partes }) {
  disposeViewer();

  const debugEl       = document.getElementById("modeloDebug");
  const canvas        = document.getElementById("viewerCanvas");
  const popup         = document.getElementById("modeloPopup");
  const popupAudioEl  = document.getElementById("popupAudio");
  const popupAudioBtn = document.getElementById("popupAudioBtn");
  const popupTitle    = document.getElementById("popupTitle");
  const popupText     = document.getElementById("popupText");
  const popupClose    = document.getElementById("popupClose");

  const setDebug = (m) => { if (debugEl) debugEl.textContent = m; };
  setDebug("Cargando modelo…");

  // Cerrar popup anterior si quedó abierto
  if (popup) popup.classList.add("hidden");

  // ─── Renderer / Scene / Camera ───
  _renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  _renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10000);

  _controls = new OrbitControls(camera, _renderer.domElement);
  _controls.enableDamping = true;
  _controls.zoomSpeed     = 3.5;
  _controls.panSpeed      = 1.5;
  _controls.rotateSpeed   = 1.2;

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(2, 3, 2);
  scene.add(dirLight);

  const loader    = new GLTFLoader();
  let   model     = null;
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2();

  // ─── Hover Highlight ───
  let hoveredMesh             = null;
  let hoveredOriginalMaterial = null;

  _hoverMaterial = new THREE.MeshStandardMaterial({
    color:     0xffffff,
    emissive:  0x444444,
    metalness: 0.05,
    roughness: 0.35
  });

  function setHovered(mesh) {
    if (hoveredMesh && hoveredMesh !== mesh) {
      hoveredMesh.material    = hoveredOriginalMaterial;
      hoveredMesh             = null;
      hoveredOriginalMaterial = null;
    }
    if (!mesh) { canvas.style.cursor = "default"; return; }
    if (hoveredMesh === mesh) return;
    hoveredMesh             = mesh;
    hoveredOriginalMaterial = mesh.material;
    mesh.material           = _hoverMaterial;
    canvas.style.cursor     = "pointer";
  }

  // ─── Hover Audio ───
  _hoverAudioEl = new Audio();
  let currentHoverName = null;

  _hoverAudioEl.addEventListener("ended", () => {
    window.C360Audio.onEnded(_hoverAudioEl);
  });

  function triggerHoverAudio(meshName) {
    if (currentHoverName === meshName) return;
    currentHoverName = meshName;
    clearTimeout(_hoverTimer);
    if (popup && !popup.classList.contains("hidden")) return;
    const parte = partes[meshName];
    if (!parte?.audioNombre) return;
    _hoverTimer = setTimeout(() => {
      window.C360Audio.play(_hoverAudioEl, parte.audioNombre, null);
    }, 300);
  }

  function stopHoverAudio() {
    currentHoverName = null;
    clearTimeout(_hoverTimer);
    _hoverTimer = null;
    window.C360Audio.stopIfEl(_hoverAudioEl);
  }

  // ─── Pointermove (hover + raycasting) ───
  _addListener(canvas, "pointermove", (e) => {
    if (!model) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x    =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y    = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(model.children, true);
    if (hits.length > 0 && hits[0].object.isMesh) {
      const hit = hits[0].object;
      setHovered(hit);
      triggerHoverAudio(hit.name);
    } else {
      setHovered(null);
      stopHoverAudio();
    }
  });

  _addListener(canvas, "mouseleave", () => {
    setHovered(null);
    stopHoverAudio();
  });

  // ─── Click → Popup (distinguir clic de drag) ───
  let isDragging = false;
  _startFn = () => (isDragging = true);
  _endFn   = () => setTimeout(() => (isDragging = false), 0);
  _controls.addEventListener("start", _startFn);
  _controls.addEventListener("end",   _endFn);

  _addListener(canvas, "pointerdown", () => (isDragging = false));
  _addListener(canvas, "pointerup", (e) => {
    if (isDragging || !model) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x    =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y    = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(model.children, true);
    if (hits.length > 0) openPopup(hits[0].object.name);
  });

  // ─── Cargar modelo ───
  loader.load(
    modelPath,
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      const box    = new THREE.Box3().setFromObject(model);
      const size   = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      camera.near = size / 1000;
      camera.far  = size * 1000;
      camera.updateProjectionMatrix();
      camera.position.set(0, size * 0.2, size * 0.9);
      _controls.target.set(0, 0, 0);
      _controls.update();
      setDebug("Modelo cargado. Pasa el cursor para escuchar; clic para ver información.");
    },
    undefined,
    () => { setDebug("No se pudo cargar el modelo."); }
  );

  // ─── Resize ───
  function resize() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    _renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  _addListener(window, "resize", resize);
  resize();

  // ─── Render loop ───
  (function animate() {
    _controls.update();
    _renderer.render(scene, camera);
    _animFrame = requestAnimationFrame(animate);
  })();

  // ─── Popup ───
  let currentPopupMesh = null;

  if (popupAudioEl) {
    _addListener(popupAudioEl, "ended", () => {
      window.C360Audio.onEnded(popupAudioEl);
    });
  }

  function resetPopupBtn() {
    if (!popupAudioBtn) return;
    popupAudioBtn.classList.remove("is-playing");
    popupAudioBtn.setAttribute("aria-pressed", "false");
    popupAudioBtn.innerHTML = '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>';
  }

  if (popupAudioBtn) {
    popupAudioBtn.setAttribute("aria-pressed", "false");
    _addListener(popupAudioBtn, "click", () => {
      const parte = partes[currentPopupMesh];
      const src   = parte?.audioDesc;
      if (!src) return;
      if (window.C360Audio.isPlaying(popupAudioEl)) {
        window.C360Audio.stop();
        return;
      }
      window.C360Audio.play(popupAudioEl, src, resetPopupBtn);
      popupAudioBtn.classList.add("is-playing");
      popupAudioBtn.setAttribute("aria-pressed", "true");
      popupAudioBtn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
    });
  }

  if (popupClose) {
    _addListener(popupClose, "click", closePopup);
  }

  if (popup) {
    _addListener(popup, "click", (e) => {
      if (e.target === popup) closePopup();
    });
  }

  _addListener(document, "keydown", (e) => {
    if (e.key === "Escape" && popup && !popup.classList.contains("hidden")) {
      closePopup();
    }
  });

  function openPopup(meshName) {
    const parte = partes[meshName];
    const title = parte?.title ?? "Parte";
    const text  = parte?.text  ?? "Descripción no disponible.";
    if (popupTitle) popupTitle.textContent = title;
    if (popupText)  popupText.textContent  = text;
    stopHoverAudio();
    window.C360Audio.stop();
    resetPopupBtn();
    currentPopupMesh = meshName;
    if (popup) {
      popup.classList.remove("hidden");
      if (popupClose) setTimeout(() => popupClose.focus(), 50);
    }
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.add("hidden");
    window.C360Audio.stopIfEl(popupAudioEl);
    resetPopupBtn();
    currentPopupMesh = null;
  }
}
