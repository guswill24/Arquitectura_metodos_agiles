# Prompt: Sitio Interactivo de Aprendizaje — Arquitectura de Software y Scrum

## Objetivo

Adaptar el sitio actual para que permita a estudiantes universitarios comprender la importancia de Scrum para el desarrollo de proyectos de software, con énfasis en cómo se integra la arquitectura de software dentro de este método ágil.

El estilo de referencia es: este mismo sitio, el cual se ajustara con la nueva informacion — una herramienta interactiva educativa con navegación por secciones, actividades prácticas, quizzes, simulaciones y progreso visible del estudiante.

---

## Contenido Académico el documento presente en el directorio spec (archivo: Cap7_Arquitectura_y_Metodos_Agiles_Scrum.docx) — se debe respetar la información tal como se presenta, sin omitir ni agregar contenido académico. El sitio debe organizar esta información de forma clara, didáctica e interactiva.

El sitio debe cubrir las siguientes secciones, en este orden:

### Sección 1: Bienvenida / Introducción
- Pantalla de inicio con título llamativo: **"Scrum Lab: Arquitectura y Métodos Ágiles"**
- Breve descripción: "Explora cómo Scrum organiza el desarrollo de software y cómo se integra la arquitectura en un contexto ágil."
- Campo para que el estudiante ingrese su nombre (se usa para personalizar la experiencia)
- Botón "Comenzar el recorrido"

### Sección 2: Métodos Ágiles — Fundamentos
Contenido a presentar de forma interactiva:
- **Definición**: Los métodos ágiles son métodos de desarrollo iterativo e incremental con equipos multifuncionales, auto-organizados e iteraciones cortas que producen partes operables del producto.
- **Manifiesto Ágil (2001)** — los 4 valores:
  1. Individuos e interacciones > procesos y herramientas
  2. Software funcionando > documentación extensiva
  3. Colaboración con el cliente > negociación contractual
  4. Respuesta ante el cambio > seguir un plan
- **12 principios** del Manifiesto Ágil (listarlos todos):
  1. Entrega temprana y continua de software funcional
  2. Bienvenidos los requisitos cambiantes
  3. Entregas frecuentes (semanas, no meses)
  4. Trabajo conjunto clientes-desarrolladores
  5. Individuos motivados con confianza y respaldo
  6. Comunicación cara a cara
  7. Software funcional como medida de avance
  8. Desarrollo sostenido
  9. Excelencia técnica y buen diseño
  10. Simplicidad (maximizar trabajo no hecho)
  11. Equipos auto-organizados
  12. Adaptación regular a cambios
- **Actividad interactiva**: Drag-and-drop donde el estudiante clasifique frases en "Valor Ágil" vs. "Enfoque Tradicional"

### Sección 3: Scrum — Descripción General
- Scrum es el método ágil más popular(ajustar informacion actualizada)
- Permite desarrollo iterativo e incremental
- Equipo multifuncional y auto-organizado
- Iteraciones cortas para inspeccionar y adaptar
- **Los 3 roles de Scrum** (presentar como cards interactivas que se expanden al click):
  - **Product Owner**: maximiza valor, prioriza requerimientos, revisa y aprueba trabajo
  - **Equipo de Desarrollo (Team)**: 5-9 personas, multifuncional, auto-organizado, sin sub-roles
  - **Scrum Master**: facilitador, asegura adopción de Scrum, elimina dificultades (NO es líder de proyecto)

### Sección 4: El Proceso de Scrum
Presentar como un **flujo visual interactivo / timeline** con las 12 ceremonias:

**Pre-Sprint:**
1. Especificación de historias de usuario
2. Priorización de historias de usuario
3. Especificación de tareas → resultado: **Backlog del proyecto**
4. Estimación de esfuerzo (puntos de historia)
5. Planeación de entregas (cantidad de sprints, duración, costo)

**Durante cada Sprint (patrón: planeación → desarrollo → demostración → retrospectiva):**
6. Planeación del sprint → resultado: **Backlog del sprint**
7. Refinamiento de historias de usuario (criterios de aceptación)
8. Desarrollo del producto
9. Junta diaria del sprint
10. Revisión del sprint (demostración)
11. Retrospectiva del sprint
12. Refinamiento del backlog

- **Conceptos clave a destacar**:
  - Sprint: iteración de 1-4 semanas, duración fija
  - Velocidad: puntos de historia completados por sprint (se estabiliza después del 3er sprint)
  - Backlog del proyecto vs. Backlog del sprint
- **Actividad interactiva**: Simulador de sprint donde el estudiante ordena las ceremonias en la secuencia correcta

### Sección 5: Arquitectura de Software en Scrum
- **Problema**: Scrum no tiene rol de arquitecto ni ceremonia explícita de diseño de arquitectura
- **Diseño emergente vs. Diseño planeado incremental**:
  - Diseño emergente: el diseño "emerge" de la implementación — no siempre adecuado
  - Diseño planeado incremental: deliberado antes de implementar, gradual sprint a sprint
- **Dos ceremonias propuestas** (presentar como cards expandibles):
  
  **Ceremonia 4 — Definición de la arquitectura base** (obligatoria, una sola vez, antes del primer sprint):
  1. Seleccionar patrón/estilo arquitectónico (ej: capas para sistemas web)
  2. Seleccionar estrategia de implantación (ej: cliente ligero + servidor de aplicaciones + servidor de datos)
  3. Selección inicial de tecnologías (ej: Hibernate para persistencia)
  4. Documentar la arquitectura (aspectos lógicos y físicos)
  5. Verificar el diseño: ¿soporta historias de mayor valor? ¿atiende restricciones? ¿modularidad, cohesión, acoplamiento bajo? ¿desarrollo paralelo?

  **Ceremonia 9 — Refinamiento de la arquitectura** (opcional, sprints 1 a n):
  1. Seleccionar conceptos de diseño para criterios de aceptación complejos
  2. Actualizar documentación y selección tecnológica si hay elementos nuevos
  3. Verificar que las nuevas decisiones no afecten negativamente el diseño existente

- **Atributos de calidad y restricciones**: documentar en historias de usuario, usar tablero Kanban con columna de restricciones
- **Vistas de arquitectura**: documentación simple, notaciones informales, visible para el equipo
- **El arquitecto en Scrum**: responsabilidades compartidas; si es una persona, actúa como facilitador; debe también codificar
- **Actividad interactiva**: Escenario de decisión donde el estudiante actúa como arquitecto y elige qué ceremonia aplicar ante distintos retos técnicos

### Sección 6: Deuda Técnica
- **Definición**: metáfora de la "deuda" que se adquiere al omitir diseño para acelerar entregas
- **Consecuencias**: costos altos en tiempo y salarios para cambios futuros
- **Causas**: requerimientos cambiantes, equipos sin experiencia, presión de fechas
- **Mensaje clave**: minimizar la deuda técnica debe evaluarse en todo proyecto, ágil o no
- **Actividad interactiva**: Simulador visual de "deuda técnica" — el estudiante toma decisiones (entregar rápido sin diseño vs. dedicar tiempo al diseño) y ve cómo la deuda se acumula o se controla a lo largo de sprints

### Sección 7: Evaluación Final (Quiz)
Quiz de 8-10 preguntas de opción múltiple con retroalimentación inmediata. Preguntas sugeridas:

1. ¿Duración habitual de un sprint? → **1 a 4 semanas**
2. ¿Quién maximiza el valor del producto? → **Product Owner**
3. ¿Qué enfoque se propone para la arquitectura? → **Diseño planeado incremental**
4. ¿Cuántas personas en el equipo de desarrollo? → **5 a 9**
5. ¿Qué es la deuda técnica? → **Omisiones en diseño para acelerar entregas**
6. ¿Cuándo se define la arquitectura base? → **Una sola vez, antes del primer sprint**
7. ¿Qué mide la velocidad del equipo? → **Puntos de historia completados por sprint**
8. ¿Qué rol cumple el Scrum Master? → **Facilita el proceso y elimina dificultades**
9. ¿Cuántos valores tiene el Manifiesto Ágil? → **4**
10. ¿Qué artefacto resulta de las ceremonias 1-3? → **Backlog del proyecto**

Al finalizar: mostrar puntuación con porcentaje, mensaje personalizado con el nombre del estudiante, y opción de reintentar.

---

## Requisitos de Diseño y UX

### Estilo Visual
- **Tema**: Dark mode elegante con acentos de color vibrantes (ej: azul eléctrico, cyan, gradientes sutiles)
- **Tipografía**: Usar fuentes de Google Fonts que sean modernas y legibles. Sugerencias: "Space Grotesk" o "Outfit" para títulos, "DM Sans" o "Source Sans 3" para cuerpo. NO usar Arial, Inter ni Roboto.
- **Layout**: Navegación lateral fija (sidebar) con las secciones y progreso del estudiante. Contenido principal ocupa el resto del ancho.
- **Animaciones**: Transiciones suaves entre secciones, elementos que aparecen con fade-in al hacer scroll, micro-interacciones en botones y cards.
- **Iconografía**: Usar emojis o iconos de lucide-react para cada sección.

### Navegación y Progreso
- Sidebar con lista de secciones, indicando completadas (✓), actual (resaltada) y pendientes
- Barra de progreso general (porcentaje de secciones completadas)
- Navegación libre: el estudiante puede ir a cualquier sección, pero se recomienda el orden lineal
- Botones "Anterior" y "Siguiente" al final de cada sección

### Componentes Interactivos a Implementar
1. **Cards expandibles**: para roles, ceremonias y conceptos clave — click para expandir detalles
2. **Drag-and-drop**: para clasificar elementos (valores ágiles vs. tradicionales)
3. **Timeline/flujo visual**: para el proceso de Scrum con las 12 ceremonias
4. **Simulador de sprint**: ordenar ceremonias en la secuencia correcta
5. **Simulador de deuda técnica**: tomar decisiones y ver consecuencias visuales
6. **Quiz con retroalimentación**: preguntas de opción múltiple con explicación al responder
7. **Indicadores de progreso**: checkmarks, barras, porcentajes

### Responsividad
- Diseñar para desktop principalmente (1024px+)
- Sidebar se colapsa en móvil a un menú hamburguesa o barra inferior

---

## Requisitos Técnicos

- **Formato**: el manejado en este proyecto.
- **Estado**: El menejado en este proyecto
- **Fuentes**: El menejado en este proyecto
- **Colores**: El menejado en este proyecto

---

## Notas Importantes

- Todo el contenido académico proviene del Capítulo 7 del archivo: Cap7_Arquitectura_y_Metodos_Agiles_Scrum.docx. Respetar la información tal como se presenta.
- El tono debe ser educativo pero amigable — usar "tú" para dirigirse al estudiante.
- Cada sección debe tener un objetivo de aprendizaje claro al inicio.
- Las actividades interactivas deben dar retroalimentación inmediata (correcto/incorrecto con explicación).
- El diseño debe sentirse como una herramienta profesional de e-learning, no como una presentación estática.