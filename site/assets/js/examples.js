/**
 * Tabvento 24 Production Mission Examples
 * Categorized, bilingual (EN / ES), fully searchable and runnable in Simulator
 */
window.TABVENTO_EXAMPLES = [
	{
		id: 1,
		code: 'example-01',
		category: 'automation',
		mode: 'demo',
		targetUrl: 'https://tabvento.local/demo-tour',
		tags: ['demo', 'tour', 'workflow', 'research', 'getting started'],
		title: {
			en: 'First demo mission: Workspace tour',
			es: 'Primera misión demo: Recorrido del espacio'
		},
		description: {
			en: 'Demo workspace tour and step-by-step workflow orchestration.',
			es: 'Recorrido inicial del espacio de trabajo y orquestación de flujo por pasos.'
		},
		prompt: {
			en: 'Identify three sources I could consult to learn about browser automation, and organize a research workflow.',
			es: 'Identifica tres fuentes que podría consultar para aprender sobre automatización del navegador y organiza un flujo de investigación.'
		},
		expected: {
			en: 'A SIMULATED DEMO result echoing the submitted goal and demonstrating the 4-phase deterministic pipeline.',
			es: 'Un resultado DEMO SIMULADA que refleja el objetivo enviado y demuestra la canalización determinista de 4 fases.'
		}
	},
	{
		id: 2,
		code: 'example-02',
		category: 'automation',
		mode: 'demo',
		targetUrl: 'https://tabvento.local/task-compare',
		tags: ['demo', 'task management', 'comparison', 'history'],
		title: {
			en: 'Compare mission briefs: Checklist vs Calendar',
			es: 'Comparar objetivos de misión: Lista vs Calendario'
		},
		description: {
			en: 'Task labeling, metadata verification, and mission history tracking.',
			es: 'Etiquetado de tareas, verificación de metadatos y seguimiento en el historial.'
		},
		prompt: {
			en: 'Compare two approaches to organizing a project: a checklist and a calendar. Return a short comparison.',
			es: 'Compara dos formas de organizar un proyecto: una lista de tareas y un calendario. Devuelve una comparación breve.'
		},
		expected: {
			en: 'Simulated comparative evaluation with persisted task labeling for later retrieval.',
			es: 'Evaluación comparativa simulada con etiquetado persistido para recuperación posterior.'
		}
	},
	{
		id: 3,
		code: 'example-03',
		category: 'research',
		mode: 'demo',
		targetUrl: 'https://tabvento.local/timeline-inspection',
		tags: ['demo', 'timeline', 'accessibility', 'analysis'],
		title: {
			en: 'Review a research brief: Accessibility inspection',
			es: 'Revisar un objetivo de investigación: Navegación accesible'
		},
		description: {
			en: 'Inspect multi-tab execution timelines and action event ordering.',
			es: 'Inspecciona líneas de tiempo multi-pestaña y ordenamiento de eventos de acción.'
		},
		prompt: {
			en: 'Read this research brief: investigate accessible website navigation. Organize the goal into research steps.',
			es: 'Lee este objetivo de investigación: investigar la navegación accesible en sitios web. Organiza el objetivo en pasos de investigación.'
		},
		expected: {
			en: 'Structured research decomposition showing chronological DOM action orchestration.',
			es: 'Descomposición estructurada de investigación mostrando la orquestación cronológica del DOM.'
		}
	},
	{
		id: 4,
		code: 'example-04',
		category: 'qa',
		mode: 'demo',
		targetUrl: 'https://tabvento.local/cancellation-drill',
		tags: ['demo', 'cancellation', 'circuit breaker', 'safety'],
		title: {
			en: 'Practice cancellation: Emergency stop drill',
			es: 'Practicar la cancelación: Parada de emergencia'
		},
		description: {
			en: 'Test instantaneous mission interruption, thread safety, and state cleanup.',
			es: 'Prueba la interrupción instantánea de misiones, seguridad de hilos y limpieza de estado.'
		},
		prompt: {
			en: 'Prepare a research workflow for a public documentation page. This is a disposable cancellation practice mission.',
			es: 'Prepara un flujo de investigación para una página de documentación pública. Esta misión desechable sirve para practicar la cancelación.'
		},
		expected: {
			en: 'Safe thread interruption within 250ms with clean SQLite status transitions.',
			es: 'Interrupción segura en menos de 250 ms con transiciones limpias de estado en SQLite.'
		}
	},
	{
		id: 5,
		code: 'example-05',
		category: 'extraction',
		mode: 'demo',
		targetUrl: 'https://tabvento.local/export-hub',
		tags: ['demo', 'export', 'json', 'markdown', 'download'],
		title: {
			en: 'Practice exporting a result: Multi-format download',
			es: 'Practicar la exportación: Descarga multiformato'
		},
		description: {
			en: 'Test output serializing to JSON, Markdown, and clipboard copying.',
			es: 'Prueba la serialización de resultados a JSON, Markdown y copia al portapapeles.'
		},
		prompt: {
			en: 'Prepare a sample workflow for collecting public reference links. Mark this mission EXPORT-PRACTICE.',
			es: 'Prepara un flujo de ejemplo para recopilar enlaces de referencia públicos. Marca esta misión como EXPORT-PRACTICE.'
		},
		expected: {
			en: 'Structured dataset ready for instant export to JSON or Markdown formats.',
			es: 'Conjunto de datos estructurado listo para exportar a formatos JSON o Markdown.'
		}
	},
	{
		id: 6,
		code: 'example-06',
		category: 'research',
		mode: 'demo',
		targetUrl: 'https://tabvento.local/history-search',
		tags: ['demo', 'history', 'search', 'sqlite', 'indexing'],
		title: {
			en: 'Practice history search: Querying past runs',
			es: 'Practicar búsqueda en historial: Consultar ejecuciones'
		},
		description: {
			en: 'Fast full-text lookup across persistent mission logs and outcomes.',
			es: 'Búsqueda de texto completo rápida en registros persistentes y resultados.'
		},
		prompt: {
			en: 'Prepare a sample workflow for a reading list. Mark this mission HISTORY-PRACTICE.',
			es: 'Prepara un flujo de ejemplo para una lista de lectura. Marca esta misión como HISTORY-PRACTICE.'
		},
		expected: {
			en: 'Indexed mission record discoverable via SQLite full-text search parameters.',
			es: 'Registro de misión indexado localmente y localizable mediante filtros de búsqueda.'
		}
	},
	{
		id: 7,
		code: 'example-07',
		category: 'qa',
		mode: 'live',
		targetUrl: 'https://example.com/',
		tags: ['live', 'read-only', 'dom extraction', 'verification'],
		title: {
			en: 'Read a simple public page: Example.com sanity check',
			es: 'Leer una página pública sencilla: Verificación de Example.com'
		},
		description: {
			en: 'Non-invasive read-only test verifying headings and canonical destination.',
			es: 'Prueba de solo lectura no invasiva que verifica encabezados y destino canónico.'
		},
		prompt: {
			en: 'Open https://example.com/ and read the page. Return its page title, main heading, and the destination of its visible information link. Do not follow other links.',
			es: 'Abre https://example.com/ y lee la página. Devuelve su título, encabezado principal y destino del enlace de información visible. No sigas otros enlaces.'
		},
		expected: {
			en: 'Observed title "Example Domain", H1 text, and RFC 2606 IANA documentation URL.',
			es: 'Título observado "Example Domain", texto H1 y URL de documentación IANA de RFC 2606.'
		}
	},
	{
		id: 8,
		code: 'example-08',
		category: 'qa',
		mode: 'live',
		targetUrl: 'https://docs.python.org/3/tutorial/',
		tags: ['live', 'documentation', 'python', 'scraping'],
		title: {
			en: 'Extract documentation sections: Python tutorial index',
			es: 'Extraer secciones de documentación: Índice tutorial de Python'
		},
		description: {
			en: 'Hierarchical navigation parsing to extract top 5 structured chapters.',
			es: 'Análisis de navegación jerárquica para extraer los primeros 5 capítulos estructurados.'
		},
		prompt: {
			en: 'Open https://docs.python.org/3/tutorial/ and list the first five numbered tutorial section names and their links. Read only; do not sign in or download files.',
			es: 'Abre https://docs.python.org/3/tutorial/ y enumera los nombres de las primeras cinco secciones numeradas del tutorial con sus enlaces. Solo lectura; no inicies sesión ni descargues archivos.'
		},
		expected: {
			en: 'Array of first 5 sections: Whetting Your Appetite, Using the Interpreter, An Informal Introduction, More Control Flow, Data Structures.',
			es: 'Lista de las primeras 5 secciones: Abriendo el apetito, Uso del intérprete, Introducción informal, Estructuras de control, Estructuras de datos.'
		}
	},
	{
		id: 9,
		code: 'example-09',
		category: 'research',
		mode: 'live',
		targetUrl: 'https://docs.python.org/3/tutorial/datastructures.html',
		tags: ['live', 'research', 'python', 'data structures', 'synthesis'],
		title: {
			en: 'Summarize documentation topic: Lists vs Tuples',
			es: 'Resumir un tema de documentación: Listas vs Tuplas'
		},
		description: {
			en: 'Targeted technical synthesis comparing mutable vs immutable structures.',
			es: 'Síntesis técnica comparando estructuras mutables vs inmutables en Python.'
		},
		prompt: {
			en: 'Open https://docs.python.org/3/tutorial/datastructures.html and summarize the difference between lists and tuples in at most five bullets. Cite the source URL. Do not run code or install anything.',
			es: 'Abre https://docs.python.org/3/tutorial/datastructures.html y resume la diferencia entre listas y tuplas en un máximo de cinco puntos. Cita la URL. No ejecutes código ni instales nada.'
		},
		expected: {
			en: '5 concise bullets covering mutability, heterogeneous vs homogeneous idioms, and performance semantics.',
			es: '5 puntos concisos cubriendo mutabilidad, convención homogénea/heterogénea y semántica de rendimiento.'
		}
	},
	{
		id: 10,
		code: 'example-10',
		category: 'extraction',
		mode: 'live',
		targetUrl: 'https://docs.python.org/3/library/json.html',
		tags: ['live', 'comparison', 'data formats', 'json', 'csv'],
		title: {
			en: 'Compare two doc pages: Python JSON vs CSV modules',
			es: 'Comparar dos páginas de documentación: JSON vs CSV'
		},
		description: {
			en: 'Dual-tab automated inspection generating structured plain-text matrix.',
			es: 'Inspección automatizada de dos pestañas generando matriz estructurada de texto.'
		},
		prompt: {
			en: 'Open https://docs.python.org/3/library/json.html and https://docs.python.org/3/library/csv.html. Compare what each module reads and writes in a two-row plain-text table. Include both source URLs. Do not run code or download files.',
			es: 'Abre https://docs.python.org/3/library/json.html y https://docs.python.org/3/library/csv.html. Compara qué lee y escribe cada módulo en una tabla de texto de dos filas. Incluye ambas URL. No ejecutes código ni descargues archivos.'
		},
		expected: {
			en: '2-row table contrasting JSON string/file serialization vs CSV tabular dialect parsing.',
			es: 'Tabla de dos filas contrastando serialización de cadenas/archivos JSON vs análisis de dialectos tabulares CSV.'
		}
	},
	{
		id: 11,
		code: 'example-11',
		category: 'extraction',
		mode: 'live',
		targetUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
		tags: ['live', 'mdn', 'html', 'reference', 'navigation'],
		title: {
			en: 'Extract HTML reference headings: MDN Web Docs',
			es: 'Extraer encabezados de referencia HTML: MDN Web Docs'
		},
		description: {
			en: 'Extracting key educational reference taxonomies from MDN standards.',
			es: 'Extracción de taxonomías de referencia educativa clave de los estándares MDN.'
		},
		prompt: {
			en: 'Open https://developer.mozilla.org/en-US/docs/Web/HTML and identify up to five visible learning or reference section headings. Include the source URL. Do not submit forms or sign in.',
			es: 'Abre https://developer.mozilla.org/en-US/docs/Web/HTML e identifica hasta cinco encabezados visibles de aprendizaje o referencia. Incluye la URL. No envíes formularios ni inicies sesión.'
		},
		expected: {
			en: 'Captured MDN headings including "Guides & Tutorials", "Reference", "HTML Elements", and "Global Attributes".',
			es: 'Encabezados capturados de MDN incluyendo "Guías y tutoriales", "Referencia", "Elementos HTML" y "Atributos globales".'
		}
	},
	{
		id: 12,
		code: 'example-12',
		category: 'research',
		mode: 'live',
		targetUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
		tags: ['live', 'mdn', 'css', 'definition', 'factual'],
		title: {
			en: 'Find a definition: CSS foundational architecture',
			es: 'Encontrar una definición: Arquitectura básica de CSS'
		},
		description: {
			en: 'Accurate single-page factual synthesis without hallucination.',
			es: 'Síntesis factual precisa de una sola página sin alucinaciones.'
		},
		prompt: {
			en: 'Open https://developer.mozilla.org/en-US/docs/Web/CSS and explain what CSS is in three sentences based only on this page. Include the source URL. Read only.',
			es: 'Abre https://developer.mozilla.org/en-US/docs/Web/CSS y explica qué es CSS en tres frases basadas únicamente en esa página. Incluye la URL. Solo lectura.'
		},
		expected: {
			en: '3 exact sentences defining stylesheet language, document presentation presentation, and styling rules.',
			es: '3 frases exactas definiendo el lenguaje de hojas de estilo, la presentación de documentos y las reglas de diseño.'
		}
	},
	{
		id: 13,
		code: 'example-13',
		category: 'leadgen',
		mode: 'live',
		targetUrl: 'https://docs.python.org/3/tutorial/',
		tags: ['live', 'curation', 'reading list', 'python', 'education'],
		title: {
			en: 'Build a short reading list: Starter study pack',
			es: 'Crear una lista breve de lectura: Paquete de estudio inicial'
		},
		description: {
			en: 'Filtering and extracting prioritized links with contextual rationale.',
			es: 'Filtrado y extracción de enlaces priorizados con justificación contextual.'
		},
		prompt: {
			en: 'Open https://docs.python.org/3/tutorial/ and collect three tutorial links suitable for a first reading session. Return each title and URL with one short reason. Stay on this site and do not download anything.',
			es: 'Abre https://docs.python.org/3/tutorial/ y recopila tres enlaces del tutorial para una primera sesión de lectura. Devuelve el título, la URL y una razón breve para cada uno. Permanece en ese sitio y no descargues nada.'
		},
		expected: {
			en: 'Curated 3-entry study syllabus with titles, deep links, and learning objectives.',
			es: 'Plan de estudio curado de 3 elementos con títulos, enlaces profundos y objetivos de aprendizaje.'
		}
	},
	{
		id: 14,
		code: 'example-14',
		category: 'research',
		mode: 'live',
		targetUrl: 'https://www.sqlite.org/',
		tags: ['live', 'sqlite', 'database', 'project overview', 'sme tech'],
		title: {
			en: 'Inspect a project landing page: SQLite engine overview',
			es: 'Explorar la página de un proyecto: SQLite motor embebido'
		},
		description: {
			en: 'Commercial architecture discovery and primary navigation mapping.',
			es: 'Descubrimiento de arquitectura técnica y mapeo de navegación principal.'
		},
		prompt: {
			en: 'Open https://www.sqlite.org/ and summarize the product description and up to three visible navigation destinations. Include their URLs. Do not download software or submit anything.',
			es: 'Abre https://www.sqlite.org/ y resume la descripción del producto y hasta tres destinos de navegación visibles. Incluye sus URL. No descargues software ni envíes nada.'
		},
		expected: {
			en: 'Self-contained, serverless zero-configuration overview with verified top navigation links.',
			es: 'Resumen del motor autónomo, sin servidor y sin configuración, con enlaces de navegación verificados.'
		}
	},
	{
		id: 15,
		code: 'example-15',
		category: 'qa',
		mode: 'live',
		targetUrl: 'https://docs.astral.sh/uv/getting-started/installation/',
		tags: ['live', 'astral', 'uv', 'devops', 'cli installation'],
		title: {
			en: 'Locate installation guidance: Astral uv package manager',
			es: 'Localizar instrucciones de instalación: Gestor uv de Astral'
		},
		description: {
			en: 'Cross-platform installation option cataloging for DevOps engineers.',
			es: 'Catalogación de opciones de instalación multiplataforma para ingeniería DevOps.'
		},
		prompt: {
			en: 'Open https://docs.astral.sh/uv/getting-started/installation/ and summarize the visible installation choices without executing commands or downloading anything. Include the source URL.',
			es: 'Abre https://docs.astral.sh/uv/getting-started/installation/ y resume las opciones de instalación visibles sin ejecutar comandos ni descargar nada. Incluye la URL.'
		},
		expected: {
			en: 'Summarized choices across standalone installer (curl/powershell), Homebrew, pipx, and Docker.',
			es: 'Resumen de opciones entre instalador autónomo (curl/powershell), Homebrew, pipx y Docker.'
		}
	},
	{
		id: 16,
		code: 'example-16',
		category: 'qa',
		mode: 'live',
		targetUrl: 'https://docs.astral.sh/uv/concepts/projects/sync/',
		tags: ['live', 'uv', 'package sync', 'lockfile', 'reproducibility'],
		title: {
			en: 'Read command documentation: uv lock vs sync concepts',
			es: 'Leer documentación de comandos: Conceptos lock vs sync de uv'
		},
		description: {
			en: 'Deep-dive into dependency locking vs virtual environment synchronization.',
			es: 'Análisis detallado entre bloqueo de dependencias y sincronización del entorno virtual.'
		},
		prompt: {
			en: 'Open https://docs.astral.sh/uv/concepts/projects/sync/ and summarize the documented distinction between locking and syncing. Include the source URL. Do not execute any commands.',
			es: 'Abre https://docs.astral.sh/uv/concepts/projects/sync/ y resume la distinción documentada entre bloquear dependencias y sincronizar. Incluye la URL. No ejecutes comandos.'
		},
		expected: {
			en: 'Clear distinction: uv.lock records universal resolution; uv sync reconciles the active environment.',
			es: 'Distinción clara: uv.lock registra la resolución universal; uv sync concilia el entorno virtual activo.'
		}
	},
	{
		id: 17,
		code: 'example-17',
		category: 'leadgen',
		mode: 'live',
		targetUrl: 'https://www.w3.org/WAI/fundamentals/accessibility-intro/',
		tags: ['live', 'w3c', 'wai', 'accessibility', 'standards'],
		title: {
			en: 'Collect public accessibility resources: W3C WAI directory',
			es: 'Recopilar recursos de accesibilidad: Directorio W3C WAI'
		},
		description: {
			en: 'Discover official educational portals and WCAG reference assets.',
			es: 'Descubre portales educativos oficiales y recursos de referencia de WCAG.'
		},
		prompt: {
			en: 'Open https://www.w3.org/WAI/fundamentals/accessibility-intro/ and return the page title and up to three visible links about learning accessibility. Include full URLs. Read only.',
			es: 'Abre https://www.w3.org/WAI/fundamentals/accessibility-intro/ y devuelve el título de la página y hasta tres enlaces visibles para aprender accesibilidad. Incluye las URL completas. Solo lectura.'
		},
		expected: {
			en: 'W3C Accessibility Intro title plus valid destination URLs for WCAG standards and tutorials.',
			es: 'Título de la introducción a accesibilidad W3C más URLs de destino válidas para estándares WCAG y tutoriales.'
		}
	},
	{
		id: 18,
		code: 'example-18',
		category: 'automation',
		mode: 'live',
		targetUrl: 'https://www.w3.org/WAI/tutorials/page-structure/',
		tags: ['live', 'w3c', 'checklist', 'page structure', 'audit'],
		title: {
			en: 'Create a source-based checklist: W3C Page Structure',
			es: 'Crear una lista basada en fuente: Estructura W3C'
		},
		description: {
			en: 'Synthesize standard documentation into an actionable 5-point verification audit.',
			es: 'Sintetiza la documentación estándar en una lista de verificación práctica de 5 puntos.'
		},
		prompt: {
			en: 'Open https://www.w3.org/WAI/tutorials/page-structure/ and create a five-item reading checklist based on visible page-structure topics. Include the source URL. Do not test or modify any website.',
			es: 'Abre https://www.w3.org/WAI/tutorials/page-structure/ y crea una lista de lectura de cinco puntos basada en los temas visibles de estructura de páginas. Incluye la URL. No pruebes ni modifiques ningún sitio web.'
		},
		expected: {
			en: '5 actionable structural checks covering Page Regions, Headings, Content Blocks, and Navigation.',
			es: '5 comprobaciones estructurales que cubren regiones de página, encabezados, bloques de contenido y navegación.'
		}
	},
	{
		id: 19,
		code: 'example-19',
		category: 'qa',
		mode: 'live',
		targetUrl: 'https://github.com/psf/requests',
		tags: ['live', 'github', 'requests', 'open source', 'due diligence'],
		title: {
			en: 'Inspect public repo overview: psf/requests metadata',
			es: 'Explorar repositorio público: Metadatos de psf/requests'
		},
		description: {
			en: 'Extracting package licensing, release state, and official docs without API tokens.',
			es: 'Extracción de licencia, estado de versión y docs oficiales sin requerir tokens de API.'
		},
		prompt: {
			en: 'Open https://github.com/psf/requests and report its visible project description, license label if shown, and documentation link if shown. Do not sign in, star, fork, clone, or create issues.',
			es: 'Abre https://github.com/psf/requests e informa de la descripción visible del proyecto, la etiqueta de licencia si aparece y el enlace de documentación si aparece. No inicies sesión, marques estrellas, crees forks, clones ni crees incidencias.'
		},
		expected: {
			en: 'Project description "A simple, yet elegant, HTTP library", Apache 2.0 license, and requests.readthedocs.io link.',
			es: 'Descripción del proyecto "A simple, yet elegant, HTTP library", licencia Apache 2.0 y enlace a requests.readthedocs.io.'
		}
	},
	{
		id: 20,
		code: 'example-20',
		category: 'qa',
		mode: 'live',
		targetUrl: 'https://choosealicense.com/licenses/mit/',
		tags: ['live', 'compliance', 'mit license', 'legal tech', 'fOSS'],
		title: {
			en: 'Read a license as plain text: MIT terms analysis',
			es: 'Leer una licencia como texto: Análisis de términos MIT'
		},
		description: {
			en: 'Factual plain-text extraction of software license permissions and notice clauses.',
			es: 'Extracción factual de permisos de licencia y cláusula obligatoria de aviso de copyright.'
		},
		prompt: {
			en: 'Open https://choosealicense.com/licenses/mit/ and summarize the permissions and notice condition displayed on the page. Include its URL. Provide a factual page summary, not legal advice. Read only.',
			es: 'Abre https://choosealicense.com/licenses/mit/ y resume los permisos y la condición sobre avisos que muestra la página. Incluye su URL. Ofrece un resumen factual de la página, no asesoría legal. Solo lectura.'
		},
		expected: {
			en: 'Permissions: commercial use, modification, distribution, private use. Mandatory condition: license & copyright notice inclusion.',
			es: 'Permisos: uso comercial, modificación, distribución y uso privado. Condición obligatoria: inclusión del aviso de licencia y copyright.'
		}
	},
	{
		id: 21,
		code: 'example-21',
		category: 'research',
		mode: 'live',
		targetUrl: 'https://en.wikipedia.org/wiki/Web_browser',
		tags: ['live', 'wikipedia', 'web history', 'encyclopedia', 'learning'],
		title: {
			en: 'Gather learning links from Wikipedia: Browser architecture',
			es: 'Recopilar enlaces de Wikipedia: Arquitectura del navegador'
		},
		description: {
			en: 'Extract primary definitions and high-level section taxonomies.',
			es: 'Extracción de definiciones primarias y taxonomías de sección de alto nivel.'
		},
		prompt: {
			en: 'Open https://en.wikipedia.org/wiki/Web_browser and report the opening definition plus up to three visible section names. Include the article URL. Do not edit the article or sign in.',
			es: 'Abre https://en.wikipedia.org/wiki/Web_browser e informa de la definición inicial y hasta tres nombres de secciones visibles. Incluye la URL. No edites el artículo ni inicies sesión.'
		},
		expected: {
			en: 'Lead sentence defining web browser software application and 3 section names (e.g., History, Security, Market share).',
			es: 'Definición inicial de aplicación de software para navegar la web y 3 secciones (p. ej., Historia, Seguridad, Cuota de mercado).'
		}
	},
	{
		id: 22,
		code: 'example-22',
		category: 'ecommerce',
		mode: 'live',
		targetUrl: 'https://www.mozilla.org/en-US/firefox/',
		tags: ['live', 'competitive analysis', 'firefox', 'chromium', 'benchmarking'],
		title: {
			en: 'Compare product descriptions: Firefox vs Chromium positioning',
			es: 'Comparar descripciones de productos: Firefox vs Chromium'
		},
		description: {
			en: 'Competitive brand positioning analysis across two major open-source web platforms.',
			es: 'Análisis de posicionamiento competitivo de marca entre dos plataformas web abiertas.'
		},
		prompt: {
			en: 'Open https://www.mozilla.org/en-US/firefox/ and https://www.chromium.org/Home/ and summarize how each page describes its browser project. Give one short paragraph per source with URL. Do not download or install anything.',
			es: 'Abre https://www.mozilla.org/en-US/firefox/ y https://www.chromium.org/Home/ y resume cómo describe cada página su proyecto de navegador. Incluye un párrafo breve por fuente con su URL. No descargues ni instales nada.'
		},
		expected: {
			en: 'Balanced two-paragraph briefing: Firefox privacy/user-first positioning vs Chromium open-source engine focus.',
			es: 'Informe equilibrado de dos párrafos: enfoque de privacidad/usuario de Firefox vs enfoque de motor abierto de Chromium.'
		}
	},
	{
		id: 23,
		code: 'example-23',
		category: 'extraction',
		mode: 'live',
		targetUrl: 'https://www.sqlite.org/faq.html',
		tags: ['live', 'sqlite', 'faq', 'data types', 'knowledge base'],
		title: {
			en: 'Find a public FAQ topic: SQLite typing engine',
			es: 'Encontrar tema en FAQ: Tipos de datos en SQLite'
		},
		description: {
			en: 'Automated retrieval from long-form technical FAQs and knowledge bases.',
			es: 'Recuperación automatizada en secciones extensas de preguntas frecuentes técnicas.'
		},
		prompt: {
			en: 'Open https://www.sqlite.org/faq.html and locate one question about supported data types. Summarize the visible answer briefly and include its link or source URL. Read only; do not execute SQL.',
			es: 'Abre https://www.sqlite.org/faq.html y localiza una pregunta sobre los tipos de datos admitidos. Resume brevemente la respuesta visible e incluye su enlace o la URL de la fuente. Solo lectura; no ejecutes SQL.'
		},
		expected: {
			en: 'Answer summary for Question #3 on SQLite typing: dynamic typing (storage classes NULL, INTEGER, REAL, TEXT, BLOB).',
			es: 'Resumen de la pregunta #3 sobre tipado en SQLite: tipado dinámico (clases de almacenamiento NULL, INTEGER, REAL, TEXT, BLOB).'
		}
	},
	{
		id: 24,
		code: 'example-24',
		category: 'automation',
		mode: 'live',
		targetUrl: 'https://docs.python.org/3/',
		tags: ['live', 'reporting', 'audit', 'python docs', 'executive summary'],
		title: {
			en: 'Prepare a bounded report: Python Docs landing audit',
			es: 'Preparar un informe acotado: Auditoría de Python Docs'
		},
		description: {
			en: 'Strict bounded intelligence gathering with known unknowns reporting.',
			es: 'Recopilación estricta y acotada con reporte explícito de información no verificada.'
		},
		prompt: {
			en: 'Open https://docs.python.org/3/ and return a three-section report: page purpose, three visible documentation links, and information you were not able to verify. Use only this page and download nothing.',
			es: 'Abre https://docs.python.org/3/ y devuelve un informe con tres secciones: propósito de la página, tres enlaces de documentación visibles e información que no pudiste verificar. Usa solo esta página y no descargues nada.'
		},
		expected: {
			en: 'Three-part executive dossier: (1) Official Python Documentation hub, (2) Links: Tutorial, Library, What\'s New, (3) Boundary acknowledgement of non-visited subpages.',
			es: 'Dossier ejecutivo de tres partes: (1) Hub de documentación oficial de Python, (2) Enlaces: Tutorial, Biblioteca, Novedades, (3) Reconocimiento de límite de páginas no visitadas.'
		}
	}
];
