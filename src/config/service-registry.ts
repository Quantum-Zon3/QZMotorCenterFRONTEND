import { env } from "./env";

export type ServiceKey =
  | "auth"
  | "cars"
  | "motorcycles"
  | "electrobikes"
  | "scooters"
  | "reports"
  | "ai"
  | "serverless";

export interface ServiceDefinition {
  key: ServiceKey;
  label: string;
  category: "identidad" | "inventario" | "analitica" | "asistencia" | "automatizacion";
  audience: "public" | "private" | "hybrid";
  description: string;
  baseUrl: string;
  routeBase: string;
  healthPath?: string;
  tab: string;
  stack: string;
}

export const serviceRegistry: Record<ServiceKey, ServiceDefinition> = {
  auth: {
    key: "auth",
    label: "Auth",
    category: "identidad",
    audience: "private",
    description:
      "Gestión de autenticación, sesión, login, refresh token y consulta de usuarios.",
    baseUrl: env.apiGatewayUrl,
    routeBase: "/qzMotorCenter/auth",
    tab: "Usuarios",
    stack: "Spring Boot + JWT + MySQL",
  },
  cars: {
    key: "cars",
    label: "Cars",
    category: "inventario",
    audience: "hybrid",
    description:
      "Inventario de carros con imágenes, precio, placa, modelo y trazabilidad por empleado.",
    baseUrl: env.apiGatewayUrl,
    routeBase: "/api/cars",
    tab: "Autos",
    stack: "Node + Express + TypeScript + PostgreSQL",
  },
  motorcycles: {
    key: "motorcycles",
    label: "Motorcycles",
    category: "inventario",
    audience: "hybrid",
    description:
      "CRUD de motocicletas con placa como identificador y enfoque simple orientado a catálogo.",
    baseUrl: env.apiGatewayUrl,
    routeBase: "/api/motorcycles",
    tab: "Motos",
    stack: "Flask + SQLAlchemy + MySQL",
  },
  electrobikes: {
    key: "electrobikes",
    label: "ElectroBike",
    category: "inventario",
    audience: "hybrid",
    description:
      "Catálogo eléctrico con marcas, filtros, stock, autonomía y endpoint de resumen.",
    baseUrl: env.apiGatewayUrl,
    routeBase: "/api/electrobikes",
    healthPath: "/health/electrobikes",
    tab: "Electrobikes",
    stack: "Node + Express + TypeScript + Sequelize",
  },
  scooters: {
    key: "scooters",
    label: "Scooter",
    category: "inventario",
    audience: "hybrid",
    description:
      "Microservicio de scooters eléctricas con datos de autonomía, voltaje y precio.",
    baseUrl: env.apiGatewayUrl,
    routeBase: "/api/scooters",
    tab: "Scooters",
    stack: "Node + Express + TypeScript + MySQL",
  },
  reports: {
    key: "reports",
    label: "Reports",
    category: "analitica",
    audience: "private",
    description:
      "Servicio de reportes de ventas por producto, cliente y periodos sobre MongoDB.",
    baseUrl: env.apiGatewayUrl,
    routeBase: "/api/reports",
    healthPath: "/health/reports",
    tab: "Reportes",
    stack: "Node + Express + MongoDB",
  },
  ai: {
    key: "ai",
    label: "IA",
    category: "asistencia",
    audience: "private",
    description:
      "Agente conversacional con persistencia de conversaciones y proveedor LLM configurable.",
    baseUrl: env.apiGatewayUrl,
    routeBase: "/api/v1",
    healthPath: "/health/ai",
    tab: "IA",
    stack: "FastAPI + PostgreSQL + SQLAlchemy",
  },
  serverless: {
    key: "serverless",
    label: "Serverless",
    category: "automatizacion",
    audience: "private",
    description:
      "Funciones de automatización, hoy enfocadas en envío de correos transaccionales.",
    baseUrl: env.apiGatewayUrl,
    routeBase: "/api/enviarCorreo",
    tab: "Automatizaciones",
    stack: "Node + SendGrid + MongoDB helpers",
  },
};

export const serviceList = Object.values(serviceRegistry);

export const productTabs = [
  { label: "Autos", path: "/catalogo/autos", service: serviceRegistry.cars },
  { label: "Motos", path: "/catalogo/motos", service: serviceRegistry.motorcycles },
  {
    label: "Electrobikes",
    path: "/catalogo/electrobikes",
    service: serviceRegistry.electrobikes,
  },
  {
    label: "Scooters",
    path: "/catalogo/scooters",
    service: serviceRegistry.scooters,
  },
];

export const buildPhases = [
  {
    title: "Fase 1. Foundation",
    description:
      "Diseño base, rutas, identidad visual, clientes HTTP, contenedor Docker y documentación inicial.",
  },
  {
    title: "Fase 2. Auth y backoffice",
    description:
      "Login real con el microservicio Auth, sesión persistente y módulo de usuarios con permisos.",
  },
  {
    title: "Fase 3. Inventario conectado",
    description:
      "CRUD y filtros para carros, motos, electrobikes y scooters con formularios y carga de imágenes.",
  },
  {
    title: "Fase 4. Inteligencia y reportes",
    description:
      "Vistas de analítica, panel de reportes, IA conversacional y automatizaciones de correo.",
  },
  {
    title: "Fase 5. Publicación",
    description:
      "Hardening visual, QA funcional, variables por ambiente, Docker final y despliegue continuo.",
  },
];

export const appSections = [
  {
    title: "Inicio público",
    detail: "Presentación del proyecto, valor de la marca y acceso a catálogos.",
  },
  {
    title: "Catálogo",
    detail: "Autos, motos, electrobikes y scooters con datos normalizados desde microservicios.",
  },
  {
    title: "Dashboard",
    detail: "Resumen operativo, conteos iniciales y lectura del estado de servicios.",
  },
  {
    title: "Usuarios",
    detail: "Operación del microservicio Auth para login, perfiles y futura gestión de permisos.",
  },
  {
    title: "Reportes e IA",
    detail: "Espacios dedicados a analítica de negocio y asistencia conversacional.",
  },
  {
    title: "Configuración",
    detail: "Mapa de entornos, URLs por servicio y checklist de despliegue.",
  },
];
