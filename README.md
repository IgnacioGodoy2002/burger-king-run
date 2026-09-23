# Burger King Run — prototipo independiente

Variante visual de Mostaza Run, conservado por separado. Es un juego de demostración: no representa una campaña oficial, y los códigos de prueba no son canjeables. Los logos pertenecen a sus titulares.

## Ejecutar

Abrí esta carpeta en Visual Studio Code. Requiere Node.js 20+ y pnpm (Corepack):

```bash
corepack pnpm install
corepack pnpm dev
```

Ingresá a `http://localhost:3000`. El juego usa Three.js, corre en navegador desktop y móvil, y su API de métricas usa Postgres (Neon) a través de `DATABASE_URL`. La base de esta variante es independiente de la versión Mostaza.

## Base de datos y despliegue en Vercel

El servidor de campaña (`app/api/campaign/route.ts`) guarda partidas, códigos
de demostración y canjes en Postgres vía
[`@neondatabase/serverless`](https://github.com/neondatabase/serverless), usando
la variable de entorno `DATABASE_URL`. La tabla `runs` se crea sola en el
primer request si no existe.

Para desplegar en Vercel: importá el repositorio en vercel.com (detecta
Next.js automáticamente), agregá una base Postgres desde Storage → Create
Database → Postgres (Neon) y conectala al proyecto — Vercel inyecta
`DATABASE_URL` solo. Luego desplegá normalmente.

## Mecánica

Elegí hamburguesa simple, doble o triple; corré por tres carriles, saltá, rodá y recogé cada ingrediente. Si omitís uno, vuelve a aparecer hasta recogerlo. Cada 100 botellas de salsa activa cinco segundos de escudo; el HUD muestra el tiempo restante. El juego finaliza con una presentación del combo y un código de prueba sin valor comercial.

Los ingredientes buscan una posición libre entre los carriles sin borrar obstáculos ya visibles. Esto evita que servilleteros, vasos o carritos desaparezcan cuando el jugador se acerca.

## Arte editable

El personaje tiene fuente en `tools/character/source-mesh.json` y se puede reconstruir con Blender mediante `tools/character/build.py`. El modelo GLB queda en `public/game/assets/models/burger-king-runner.glb`. El logotipo utilizado para las referencias visuales proviene del kit de prensa de Alsea: https://www.alsea.com.mx/brands/burger-king.

La ambientación usa una calle de asfalto liso con demarcaciones claras, veredas cálidas, palmeras, fachadas comerciales de techo plano y una terraza frente al restaurante. El vaso celeste con base naranja y el envase claro de papas del combo están modelados en Three.js para conservar el rendimiento en móviles; son una interpretación visual de la referencia, no imágenes oficiales del envase.

El uniforme 3D adapta las bandas rojas y verdes, el cuerpo gris y el pantalón oscuro de la foto aportada. Servilleteros, bandejas y carrito móvil usan acabado metálico gris; llevan el vaso celeste y el envase de papas del combo.

La avenida urbana incorpora edificios comerciales y residenciales de distintas alturas, torres en segunda fila, horizonte urbano, semáforos y refugios de transporte. La ciudad mantiene un único restaurante de destino y usa geometría instanciada para limitar el coste gráfico.
