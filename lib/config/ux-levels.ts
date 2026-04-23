// =============================================
// SISTEMA CENTRAL DE CONFIGURACIÓN POR NIVELES
// UX LAB – Sistema de Citas Médicas
// =============================================

export type UXFeatures = {
  validation: boolean;
  inlineErrors: boolean;
  feedback: boolean;
  loadingStates: boolean;
  navigationClarity: boolean;
  visualHierarchy: boolean;
  accessibility: boolean;
  keyboardNavigation: boolean;
  colorContrast: boolean;
  microinteractions: boolean;
  formSimplification: boolean;
  helpText: boolean;
  // WCAG 2.1 — Accesibilidad avanzada (Nivel 5)
  wcagContrast: boolean;      // Contraste visual AA/AAA y focus rings visibles
  cognitiveSupport: boolean;  // Etiquetas descriptivas, tracker de pasos, guía cognitiva
  motorSupport: boolean;      // Objetivos táctiles ≥44px, skip link, atajos de teclado
};

export type UIConfig = {
  // Clases Tailwind por token
  container: string;
  form: string;
  input: string;
  label: string;
  button: string;
  buttonDisabled: string;
  errorText: string;
  stepIndicator: string;
  card: string;
  heading: string;
  subheading: string;
  description: string;
  successBanner: string;
  transition: string;
};

export type UXLevel = {
  id: 1 | 2 | 3 | 4 | 5;
  name: string;
  tagline: string;
  color: string;        // color de badge
  features: UXFeatures;
  ui: UIConfig;
  pedagogicalNote: string;
};

// ──────────────────────────────────────────
// NIVEL 1 – "Experiencia horrible"
// ──────────────────────────────────────────
const level1: UXLevel = {
  id: 1,
  name: "Experiencia horrible",
  tagline: "Sin guía, sin validación, sin estructura",
  color: "bg-red-600",
  features: {
    validation: false,
    inlineErrors: false,
    feedback: false,
    loadingStates: false,
    navigationClarity: false,
    visualHierarchy: false,
    accessibility: false,
    keyboardNavigation: false,
    colorContrast: false,
    microinteractions: false,
    formSimplification: false,
    helpText: false,
    wcagContrast: false,
    cognitiveSupport: false,
    motorSupport: false,
  },
  ui: {
    container: "p-1 m-0",
    form: "flex flex-col items-start gap-0",
    input:
      "bg-red-300 text-red-400 text-xs p-1 border-0 outline-none w-full placeholder:text-red-300",
    label: "text-xs font-thin uppercase text-yellow-600",
    button:
      "bg-yellow-200 text-white text-xs p-1 cursor-pointer border border-red-300",
    buttonDisabled: "opacity-100",
    errorText: "text-xs text-red-300",
    stepIndicator: "hidden",
    card: "bg-red-100 p-1 m-0 border border-red-300",
    heading: "text-xs font-thin text-red-400 uppercase tracking-widest",
    subheading: "text-xs text-red-300",
    description: "text-xs text-red-200",
    successBanner: "bg-red-200 text-red-700 p-1 text-xs",
    transition: "",
  },
  pedagogicalNote:
    "Este nivel viola principios básicos de UX: bajo contraste (falla WCAG AA), sin labels accesibles, sin flujo guiado y colores que confunden en lugar de orientar.",
};

// ──────────────────────────────────────────
// NIVEL 2 – "Funciona, pero incomoda"
// ──────────────────────────────────────────
const level2: UXLevel = {
  id: 2,
  name: "Funciona, pero incomoda",
  tagline: "Usable… pero con mucha fricción",
  color: "bg-orange-500",
  features: {
    validation: true,
    inlineErrors: false,
    feedback: false,
    loadingStates: false,
    navigationClarity: false,
    visualHierarchy: false,
    accessibility: false,
    keyboardNavigation: false,
    colorContrast: false,
    microinteractions: false,
    formSimplification: false,
    helpText: false,
    wcagContrast: false,
    cognitiveSupport: false,
    motorSupport: false,
  },
  ui: {
    container: "p-2 m-1",
    form: "flex flex-col gap-1",
    input:
      "bg-gray-200 text-gray-500 text-sm p-2 border border-gray-400 w-full",
    label: "text-sm font-normal text-gray-600",
    button:
      "bg-gray-500 text-white text-sm px-3 py-1 cursor-pointer hover:bg-gray-600",
    buttonDisabled: "opacity-50",
    errorText: "text-sm text-orange-600 mt-0",
    stepIndicator: "text-xs text-gray-400 mb-1",
    card: "bg-gray-100 p-2 m-1 border border-gray-300",
    heading: "text-base font-normal text-gray-700",
    subheading: "text-sm text-gray-500",
    description: "text-sm text-gray-400",
    successBanner: "bg-gray-200 text-gray-700 p-2 text-sm",
    transition: "",
  },
  pedagogicalNote:
    "La validación existe solo al enviar el formulario. Sin feedback inline ni estados de carga, el usuario no sabe si sus acciones tuvieron efecto. Esto genera frustración.",
};

// ──────────────────────────────────────────
// NIVEL 3 – "Aceptable"
// ──────────────────────────────────────────
const level3: UXLevel = {
  id: 3,
  name: "Aceptable",
  tagline: "Cumple… pero no encanta",
  color: "bg-yellow-500",
  features: {
    validation: true,
    inlineErrors: true,
    feedback: true,
    loadingStates: true,
    navigationClarity: true,
    visualHierarchy: true,
    accessibility: false,
    keyboardNavigation: false,
    colorContrast: true,
    microinteractions: false,
    formSimplification: true,
    helpText: true,
    wcagContrast: false,
    cognitiveSupport: false,
    motorSupport: false,
  },
  ui: {
    container: "p-4 m-2 max-w-lg mx-auto",
    form: "flex flex-col gap-2",
    input:
      "bg-white text-gray-800 text-base p-3 border border-gray-300 w-full focus:outline-none focus:border-gray-500",
    label: "text-base font-medium text-gray-700 mb-1",
    button:
      "bg-gray-700 text-white text-base px-6 py-2 cursor-pointer hover:bg-gray-800 w-full",
    buttonDisabled: "opacity-40 cursor-not-allowed",
    errorText: "text-sm text-red-600 mt-1",
    stepIndicator: "text-sm text-gray-500 mb-2 font-medium",
    card: "bg-white p-4 m-2 border border-gray-200 rounded shadow-sm",
    heading: "text-xl font-semibold text-gray-800 mb-2",
    subheading: "text-base font-medium text-gray-600",
    description: "text-sm text-gray-500",
    successBanner:
      "bg-green-100 text-green-800 p-3 text-base border border-green-200 rounded",
    transition: "transition-opacity duration-150",
  },
  pedagogicalNote:
    "UX básica estándar: validación visible, labels claros y layout consistente. Funciona correctamente pero carece de accesibilidad completa y microinteracciones que guíen emocionalmente al usuario.",
};

// ──────────────────────────────────────────
// NIVEL 4 – "Buena UX"
// ──────────────────────────────────────────
const level4: UXLevel = {
  id: 4,
  name: "Buena UX",
  tagline: "Fácil, claro y usable",
  color: "bg-green-600",
  features: {
    validation: true,
    inlineErrors: true,
    feedback: true,
    loadingStates: true,
    navigationClarity: true,
    visualHierarchy: true,
    accessibility: true,
    keyboardNavigation: true,
    colorContrast: true,
    microinteractions: true,
    formSimplification: true,
    helpText: true,
    wcagContrast: false,
    cognitiveSupport: false,
    motorSupport: false,
  },
  ui: {
    container: "p-6 max-w-2xl mx-auto",
    form: "flex flex-col gap-4",
    input:
      "bg-white text-gray-900 text-base p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 transition-colors duration-200",
    label: "text-base font-semibold text-gray-800 mb-1",
    button:
      "bg-blue-600 text-white text-base px-8 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200 font-semibold w-full",
    buttonDisabled: "opacity-40 cursor-not-allowed hover:bg-blue-600",
    errorText: "text-sm text-red-500 mt-1 font-medium",
    stepIndicator:
      "text-sm text-blue-600 font-semibold mb-3 tracking-wide uppercase",
    card: "bg-white p-6 rounded-xl border border-gray-100 shadow-md",
    heading: "text-2xl font-bold text-gray-900 mb-1",
    subheading: "text-lg font-semibold text-gray-700",
    description: "text-base text-gray-500",
    successBanner:
      "bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 font-medium",
    transition: "transition-all duration-200",
  },
  pedagogicalNote:
    "Buena UX: validación en tiempo real, feedback inmediato, navegación por teclado y contraste WCAG AA. El usuario comete menos errores y siente que el sistema lo guía.",
};

// ──────────────────────────────────────────
// NIVEL 5 – "UX profesional"
// ──────────────────────────────────────────
const level5: UXLevel = {
  id: 5,
  name: "UX profesional + WCAG 2.1",
  tagline: "Accesible, inclusivo y profesional",
  color: "bg-blue-700",
  features: {
    validation: true,
    inlineErrors: true,
    feedback: true,
    loadingStates: true,
    navigationClarity: true,
    visualHierarchy: true,
    accessibility: true,
    keyboardNavigation: true,
    colorContrast: true,
    microinteractions: true,
    formSimplification: true,
    helpText: true,
    wcagContrast: true,
    cognitiveSupport: true,
    motorSupport: true,
  },
  ui: {
    container: "p-8 max-w-2xl mx-auto",
    form: "flex flex-col gap-6",
    input:
      "bg-white text-slate-900 text-lg p-4 border-2 border-slate-200 rounded-xl w-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300",
    label: "text-base font-bold text-slate-800 mb-2 tracking-tight",
    button:
      "bg-blue-700 text-white text-base px-8 py-3.5 rounded-xl cursor-pointer hover:bg-blue-800 active:bg-blue-900 transition-all duration-200 font-semibold w-full shadow-md hover:shadow-lg",
    buttonDisabled:
      "opacity-40 cursor-not-allowed hover:bg-blue-700 hover:shadow-md",
    errorText: "text-sm text-red-500 mt-2 font-semibold",
    stepIndicator:
      "text-sm text-blue-600 font-bold mb-4 tracking-widest uppercase",
    card: "bg-white p-8 rounded-2xl border border-slate-100 shadow-xl",
    heading: "text-3xl font-bold text-slate-900 mb-2 tracking-tight",
    subheading: "text-xl font-bold text-slate-700",
    description: "text-base text-slate-500 leading-relaxed",
    successBanner:
      "bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-200 font-semibold text-lg",
    transition: "transition-all duration-300 ease-in-out",
  },
  pedagogicalNote:
    "UX profesional con WCAG 2.1: contraste visual AA/AAA, soporte cognitivo (etiquetas descriptivas, tracker de pasos, guía contextual) y accesibilidad motriz (objetivos táctiles ≥44 px, skip link, atajos de teclado). Cada mejora es activable para demostrar su impacto en la inclusión digital.",
};

// ──────────────────────────────────────────
// MAPA CENTRAL – Único punto de verdad
// ──────────────────────────────────────────
export const UX_LEVELS: Record<1 | 2 | 3 | 4 | 5, UXLevel> = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
};

export type UXLevelId = keyof typeof UX_LEVELS;
