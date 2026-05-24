# QZ Motor Center Frontend

Frontend base de `QZ Motor Center` construido con `React`, `Vite` y `TypeScript`, pensado para crecer por fases alrededor de 8 microservicios.

## Qué contiene esta primera base

- Arquitectura inicial para sitio público y backoffice.
- Mapa centralizado de microservicios y variables `VITE_*`.
- Login conectado al contrato actual del microservicio `Auth`.
- Módulos iniciales para `Usuarios`, `Autos`, `Motos`, `Electrobikes`, `Scooters`, `Reportes`, `IA` y `Configuración`.
- `Dockerfile`, `nginx.conf` y `render.yaml` como base de despliegue.

## Stack

- `React 19`
- `React Router`
- `TypeScript`
- `Axios`
- `Vite`

## Diseño funcional propuesto

### Capa pública

- `/`
  Página de presentación del proyecto, fases y mapa general.
- `/catalogo/autos`
  Catálogo público conectado al microservicio de carros.
- `/catalogo/motos`
  Catálogo público conectado al microservicio de motocicletas.
- `/catalogo/electrobikes`
  Catálogo público conectado al microservicio de movilidad eléctrica.
- `/catalogo/scooters`
  Catálogo público conectado al microservicio de scooters.
- `/login`
  Entrada al backoffice con sesión persistente.

### Capa privada

- `/app/dashboard`
  Resumen de métricas y estado inicial de servicios.
- `/app/usuarios`
  Base del módulo de identidad y consulta de usuarios.
- `/app/inventario/autos`
- `/app/inventario/motos`
- `/app/inventario/electrobikes`
- `/app/inventario/scooters`
  Bases administrativas para los cuatro dominios de inventario.
- `/app/reportes`
  Contenedor visual para analítica de negocio.
- `/app/ia`
  Base del asistente conversacional.
- `/app/arquitectura`
  Documento vivo de fases y conexiones.
- `/app/configuracion`
  Variables, checklist de despliegue y mapa de entornos.

## API Gateway

El frontend consume una sola base URL:

| Variable | Valor por defecto |
|---|---|
| `VITE_API_GATEWAY_URL` | `https://qz-gateway.onrender.com` |

Las URLs de Auth, motos, electrobikes, reports y demas microservicios se configuran solo en el API Gateway.

## Variables de entorno

Toma `.env.example` como base:

```bash
cp .env.example .env
```

Ajusta puertos y URLs según cómo expongas realmente cada microservicio.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Docker

Construcción local:

```bash
docker build -t qz-motor-center-frontend .
docker run -p 10000:10000 qz-motor-center-frontend
```

La aplicación queda servida por `nginx` con fallback para rutas SPA.

## Render

El repositorio incluye un `render.yaml` mínimo para desplegarlo como `Web Service` usando `Docker`.

Referencias oficiales consultadas:

- [Render Blueprints](https://render.com/docs/blueprint-spec)
- [Docker on Render](https://render.com/docs/docker)
- [Render Web Services](https://render.com/docs/web-services/)

## Orden recomendado de construcción

1. Confirmar y fijar los puertos/hosts reales de cada microservicio.
2. Conectar `Auth` de punta a punta y decidir permisos.
3. Completar CRUD por dominio de inventario.
4. Diseñar reportes, IA y automatizaciones.
5. Endurecer despliegue, QA y publicación.
