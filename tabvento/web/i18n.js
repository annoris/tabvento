'use strict';
(function (root) {
	const es = {
		// Solana contribution and live mode unlock
		'commercial.title': 'Contribución en Solana · Desde US$88 (sin límite máximo)',
		'commercial.terms': 'El modo Demo simulada es gratuito para explorar Tabvento. Desbloquea las misiones en navegador real contribuyendo un mínimo de $88 USD en SOL o USDC (sin límite máximo) a la cartera oficial de Solana.',
		'commercial.ai': 'La IA se paga aparte: conecta tu propia clave API y paga el consumo directamente a tu proveedor. No incluye créditos de IA. Con Ollama puedes usar un modelo local compatible sin una API externa de pago.',
		'commercial.status': 'Cartera oficial de Solana: 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm · Verifica tu firma directamente en Conexiones.',
		'solana.cardNumber': '03 / SOLANA · DESBLOQUEAR MODO REAL',
		'solana.cardTitle': 'Contribución en Solana · Modo real',
		'solana.cardBody': 'El modo Demo simulada es 100% gratuito. Para desbloquear las misiones en navegador real, realiza una contribución en la red Solana (mínimo $88 USD en SOL o USDC, sin límite máximo) y verifica la firma de tu transacción.',
		'solana.walletLabel': 'CARTERA OFICIAL DE SOLANA',
		'solana.minBadge': 'Mínimo: $88 USD · Sin límite máximo',
		'solana.copyWallet': 'Copiar cartera',
		'solana.payLink': 'Abrir en Solana Pay ↗',
		'solana.memoLabel': 'Código de referencia del equipo (Memo opcional):',
		'solana.signatureLabel': 'Firma de la transacción de Solana (Transaction Signature / Base58)',
		'solana.signaturePlaceholder': 'Pega la firma Base58 de tu transacción en Solana (mín. $88 USD)…',
		'solana.verifyButton': 'Verificar contribución en Solana',
		'solana.statusPending': 'Estado: Pendiente de verificación (Demo simulada disponible gratis).',
		'solana.statusVerified': '● Verificado en Solana ({amount} USD · {currency}) · Modo real desbloqueado.',
		'toast.walletCopied': 'Cartera de Solana copiada al portapapeles.',
		'toast.solanaVerified': 'Contribución verificada en Solana. Modo real desbloqueado.',

		// Document metadata
		'meta.title': 'Tabvento — Dale una misión a tu navegador',
		'meta.description':
			'Tabvento: una mesa de misiones para automatizar tu navegador con inteligencia artificial.',

		// Accessibility & skip link
		skipLink: 'Saltar al contenido',
		'skip.link': 'Saltar al contenido',
		'sidebar.ariaLabel': 'Navegación principal',
		'brand.ariaLabel': 'Tabvento inicio',
		'menu.open': 'Abrir menú',
		'menu.close': 'Cerrar menú',
		'motion.pause': 'Pausar animaciones',
		'motion.resume': 'Activar animaciones',
		'lang.toggleAria': 'Cambiar idioma a inglés',
		'lang.switchToEn': 'Cambiar idioma a inglés',
		'lang.switchToEs': 'Cambiar idioma a español',

		// Sidebar
		'sidebar.workspace': 'TU ESPACIO DE TRABAJO',
		'nav.overview': 'Vista general',
		'nav.inicio': 'Vista general',
		'nav.missions': 'Misiones',
		'nav.misiones': 'Misiones',
		'nav.connections': 'Conexiones',
		'nav.conexiones': 'Conexiones',
		'nav.guide': 'Guía de inicio',
		'nav.guia': 'Guía de inicio',
		'sidebar.noteTitle': 'Menos pestañas.<br />Más posibilidades.',
		'sidebar.noteSubtitle': 'Tu siguiente idea empieza aquí.',
		'sidebar.localTitle': 'Espacio local',
		'sidebar.localSubtitle': 'En tu equipo · v0.1',

		// Topbar
		'topbar.workspace': 'Workspace',
		'breadcrumb.inicio': 'Vista general',
		'breadcrumb.misiones': 'Misiones',
		'breadcrumb.conexiones': 'Conexiones',
		'breadcrumb.guia': 'Guía de inicio',
		'server.connecting': 'Conectando',
		'server.online': 'Servidor local',
		'server.offline': 'Sin conexión',
		'topbar.guide': 'Guía de Tabvento',

		// View: Inicio / Hero
		'hero.eyebrow': 'UN NUEVO AIRE PARA TU NAVEGADOR',
		'hero.edition': 'TABVENTO / WORKSPACE 001',
		'hero.kicker': 'Tú pones la idea. El agente, el recorrido.',
		'hero.title': 'La web se mueve.<br /><span>Ahora, a tu favor.</span>',
		'hero.subtitle':
			'Convierte una instrucción en un recorrido.<br />Investiga, compara y reúne lo que importa,<br />desde una sola mesa de misiones.',
		'hero.newMission': 'Crear una misión',
		'hero.demo': 'Verlo en acción',
		'hero.demoPrompt':
			'Comparar tres herramientas para organizar un proyecto creativo',
		'hero.footnote': 'Código abierto. Navegador local. Tú al mando.',

		// Hero Art
		'art.explore': 'explorar',
		'art.ideaInMotion': 'una idea, en movimiento',
		'art.search': 'Encuentra nuevas posibilidades',
		'art.goalFound': 'OBJETIVO ENCONTRADO',
		'art.tabsToAnswers': 'De pestañas a respuestas.',
		'art.chipTop': 'Sigue la corriente',
		'art.chipBottom': 'Una misión. Todo conectado.',
		'art.coordinate': '40° 43′ N \u00a0 / \u00a0 NUEVOS HORIZONTES',

		// Composer
		'composer.title': '¿Qué quieres poner en marcha?',
		'composer.badge': 'EMPIEZA CON UNA IDEA',
		'composer.taskLabel': 'Describe tu misión',
		'composer.placeholder':
			'Encuentra, compara, investiga… escribe tu próxima misión.',
		'composer.modeAria': 'Modo de ejecución',
		'composer.modeDemo': 'Demo simulada',
		'composer.modeLive': 'Navegador real',
		'composer.hintDemo': 'Explora el recorrido sin usar claves ni IA.',
		'composer.hintLive':
			'Usa tu modelo y un navegador local. Puede tener coste.',
		'composer.submitDemo': 'Iniciar demo',
		'composer.submitLive': 'Iniciar misión',

		// Suggestions
		'suggestions.label': 'O prueba con',
		'suggestions.idea': '↗ Investigar una idea',
		'suggestions.ideaPrompt':
			'Investigar opciones para un espacio de trabajo creativo',
		'suggestions.compare': '⇄ Comparar opciones',
		'suggestions.comparePrompt':
			'Comparar tres herramientas para organizar proyectos',
		'suggestions.resources': '⊞ Reunir recursos',
		'suggestions.resourcesPrompt':
			'Recopilar recursos para aprender una habilidad nueva',

		// Recent missions
		'recent.title': 'Tus últimos recorridos',
		'recent.viewAll': 'Ver todas las misiones',

		// Principles
		'principles.oneTitle': 'Una idea, un recorrido',
		'principles.oneBody':
			'Del objetivo al resultado, con cada paso a la vista.',
		'principles.twoTitle': 'Tu espacio, tus conexiones',
		'principles.twoBody': 'Historial local y claves en el entorno de tu equipo.',
		'principles.threeTitle': 'Abierto a lo que viene',
		'principles.threeBody':
			'Una interfaz propia sobre un motor de código abierto.',

		// View: Misiones (History)
		'missions.eyebrow': 'TU HISTORIAL LOCAL',
		'missions.title': 'Todos tus recorridos',
		'missions.titleHtml': 'Todos tus recorridos<span>.</span>',
		'missions.subtitle':
			'Una idea puede abrir muchas puertas. Aquí quedan sus pasos.',
		'missions.new': 'Nueva misión',
		'missions.searchPlaceholder': 'Buscar una misión…',
		'missions.searchAria': 'Buscar misiones',
		'missions.filterAria': 'Filtrar por estado',
		'missions.filterAll': 'Todos los estados',
		'missions.filterRunning': 'En marcha',
		'missions.filterCompleted': 'Completadas',
		'missions.filterFailed': 'Con errores',
		'missions.filterCancelled': 'Canceladas',

		// View: Conexiones (Settings)
		'connections.eyebrow': 'EL MOTOR DE TUS IDEAS',
		'connections.title': 'Conecta posibilidades',
		'connections.titleHtml': 'Conecta posibilidades<span>.</span>',
		'connections.subtitle':
			'Elige tu modelo. El navegador se ejecuta en este equipo.',
		'connections.card1Number': '01 / MODELO',
		'connections.card1Title': 'Tu inteligencia, a elección.',
		'connections.card1Body':
			'Elige tu proveedor y escribe el identificador exacto del modelo. La conexión se guarda en este servidor local.',
		'connections.providerLabel': 'Proveedor',
		'connections.loadingProviders': 'Cargando proveedores…',
		'connections.modelLabel': 'Identificador exacto del modelo',
		'connections.modelPlaceholder': 'El nombre de tu modelo, sin modificar',
		'connections.baseUrlLabel': 'Dirección del servicio',
		'connections.baseUrlHint':
			'URL del endpoint compatible. No incluyas claves, contraseñas ni tokens en la dirección.',
		'connections.providerHintDefault':
			'Las claves se configuran en .env o en el entorno del servidor; nunca en este formulario.',
		'connections.save': 'Guardar conexión',
		'connections.check': 'Comprobar configuración',
		'connections.noneSaved': 'Todavía no hay una conexión guardada.',
		'connections.savedPrefix': 'Guardada en este equipo: ',
		'connections.savedItem': 'Guardada en este equipo: {provider} · {model}',
		'connections.checking': 'Revisando la configuración guardada…',
		'connections.checkFootnote':
			'Revisión local de configuración. No verifica la autenticación, el saldo ni la disponibilidad del modelo en el proveedor.',
		'connections.card2Number': '02 / CONEXIONES',
		'connections.card2Title': 'Listo en tu equipo.',
		'connections.howToKeys': 'Cómo configurar las claves ↗',
		'connections.privacyTitle': 'Local desde el principio.',
		'connections.privacyBody':
			'Las claves no se guardan en el navegador. El historial se guarda en SQLite en tu equipo. En modo real, el contenido necesario se envía al proveedor del modelo. La telemetría del motor está desactivada por defecto al iniciar Tabvento.',
		'connections.engineName': 'Motor de automatización',
		'connections.engineReady': 'Disponible',
		'connections.engineMissing': 'Instala las dependencias',
		'connections.keyPresent': 'Clave detectada en el servidor',
		'connections.keyMissing': 'Sin clave en el servidor',
		'connections.keyOptional': 'Sin clave obligatoria',
		'provider.hintKey':
			'Configura {env} en .env o en el entorno y reinicia el servidor. No pegues claves aquí.',
		'provider.hintOllama':
			'Ollama utiliza tu servicio local. Asegúrate de que está iniciado y el modelo descargado.',
		'provider.hintCompatible':
			'La clave del endpoint, si la necesita, se configura en el entorno del servidor.',

		// View: Guía
		'guide.eyebrow': 'DE LA IDEA AL PRIMER RECORRIDO',
		'guide.title': 'Un poco de orientación',
		'guide.titleHtml': 'Un poco de orientación<span>.</span>',
		'guide.subtitle':
			'Todo lo que necesitas para empezar, sin perder el rumbo.',
		'guide.card1Number': '01 / EXPLORA',
		'guide.card1Title': 'Empieza sin configurar nada.',
		'guide.card1Body':
			'En Vista general, escribe una misión y elige <strong>Demo simulada</strong>. Verás un recorrido ilustrativo, sin visitar sitios ni llamar a un modelo. Se guarda en tu historial y puedes cancelarlo.',
		'guide.card1Link': 'Probar la demo ↗',
		'guide.card2Number': '02 / CONECTA',
		'guide.card2Title': 'Trae tu propio modelo.',
		'guide.card2Body':
			'Configura la clave de tu proveedor en <code>.env</code> y reinicia el servidor. Después elige el proveedor y guarda el identificador exacto del modelo en Conexiones. Para Ollama, configura la dirección de tu servicio local. “Comprobar configuración” revisa los requisitos locales; no autentica contra el proveedor.',
		'guide.card2Code':
			'OPENAI_API_KEY=tu_clave\n# o ANTHROPIC_API_KEY / GOOGLE_API_KEY',
		'guide.card2Link': 'Configurar modelo ↗',
		'guide.card3Number': '03 / EJECUTA',
		'guide.card3Title': 'Abre nuevas posibilidades.',
		'guide.card3Body1':
			'Selecciona <strong>Navegador real</strong> y describe un objetivo concreto. Necesitas Chrome, Chromium o Edge instalado. Las llamadas al proveedor pueden tener coste.',
		'guide.card3Body2':
			'El agente ejecuta Python con los permisos de tu usuario. Usa tareas de confianza y un entorno aislado para contenido no confiable.',
		'guide.card4Number': '04 / LICENCIA Y NORMAS DE GITHUB',
		'guide.card4Title': 'Licencia oficial de Tabvento.',
		'guide.card4Body':
			'Copyright © 2026 Tabvento. El modo Demo simulada es gratuito para explorar el panel localmente y el modo Navegador real se desbloquea con una contribución verificada en Solana (mínimo $88 USD, sin límite máximo) a 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm, cumpliendo las normas de seguridad de GitHub (LICENSE).',

		// Footer
		'footer.tag': 'UN POCO DE AIRE. MUCHAS POSIBILIDADES.',
		'footer.link': 'Tabvento 0.1.0 · Guía y créditos ↗',

		// Mission Detail Dialog
		'detail.modeDefault': 'MISIÓN',
		'detail.modeDemo': 'DEMO SIMULADA / SIN NAVEGACIÓN REAL',
		'detail.modeLive': 'MISIÓN / NAVEGADOR LOCAL',
		'detail.closeAria': 'Cerrar detalles',
		'detail.preparing': 'Preparando el recorrido…',
		'detail.copy': 'Copiar resultado',
		'detail.download': 'Descargar',
		'detail.cancel': 'Cancelar misión',
		'detail.delete': 'Eliminar del historial',
		'detail.confirmDelete': 'Confirmar eliminación',
		'detail.partialResult': 'Resultado parcial:',
		'detail.errorLabel': 'Error:',

		// Statuses & Modes
		'status.queued': 'En espera',
		'status.running': 'En marcha',
		'status.completed': 'Completada',
		'status.failed': 'Con errores',
		'status.cancelled': 'Cancelada',
		'mode.demo': 'Demo simulada',
		'mode.live': 'Navegador real',
		'mode.liveDownload': 'Misión real',

		// Empty states
		'empty.filteredTitle': 'Ninguna misión coincide.',
		'empty.filteredBody': 'Prueba otra búsqueda o cambia el filtro.',
		'empty.defaultTitle': 'Aquí empieza tu próximo recorrido.',
		'empty.defaultBody': 'Crea una misión y guarda tus ideas en movimiento.',
		'empty.defaultAction': 'Crear mi primera misión ↗',
		'empty.offlineTitle': 'El espacio local aún no está conectado.',
		'empty.offlineBody': 'Inicia Tabvento y recarga esta página.',

		// Toasts & Errors
		'toast.demoStarted': 'Demo iniciada. Este recorrido es simulado.',
		'toast.liveStarted': 'Misión iniciada en el navegador local.',
		'toast.cancelRequested':
			'Cancelación solicitada. Las acciones ya realizadas no se deshacen.',
		'toast.missionDeleted': 'Misión eliminada del historial.',
		'toast.resultCopied': 'Resultado copiado.',
		'toast.copyFailed':
			'No se pudo copiar. Puedes seleccionar el texto del resultado.',
		'toast.selectProviderModel': 'Elige un proveedor e introduce tu modelo.',
		'toast.connectionSaved': 'Conexión guardada en este servidor local.',
		'error.requestFailed': 'No se pudo completar la petición.',
		'error.timeout':
			'El servidor está tardando en responder. Inténtalo de nuevo.',
		'error.offline':
			'No hay conexión con el servidor local. Comprueba que Tabvento sigue abierto.',
		'error.modelRequired':
			'Guarda el identificador de tu modelo antes de iniciar una misión real.',
	};

	const en = {
		// Solana contribution and live mode unlock
		'commercial.title': 'Solana Contribution · From US$88 (no maximum limit)',
		'commercial.terms': 'Simulated demo mode is free to explore Tabvento. Unlock live browser missions by contributing a minimum of $88 USD in SOL or USDC (no maximum limit) to the official Solana wallet.',
		'commercial.ai': 'AI is billed separately: connect your own API key and pay your provider directly for usage. No AI credits are included. With Ollama, you can use a compatible local model without a paid external API.',
		'commercial.status': 'Official Solana wallet: 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm · Verify your signature directly in Connections.',
		'solana.cardNumber': '03 / SOLANA · UNLOCK LIVE MODE',
		'solana.cardTitle': 'Solana Contribution · Live Mode',
		'solana.cardBody': 'Simulated demo mode is 100% free. To unlock live browser missions, make a contribution on the Solana network (minimum $88 USD in SOL or USDC, no maximum limit) and verify your transaction signature.',
		'solana.walletLabel': 'OFFICIAL SOLANA WALLET',
		'solana.minBadge': 'Minimum: $88 USD · No maximum limit',
		'solana.copyWallet': 'Copy wallet',
		'solana.payLink': 'Open in Solana Pay ↗',
		'solana.memoLabel': 'Device reference code (optional Memo):',
		'solana.signatureLabel': 'Solana transaction signature (Base58)',
		'solana.signaturePlaceholder': 'Paste your Solana transaction Base58 signature (min. $88 USD)…',
		'solana.verifyButton': 'Verify Solana contribution',
		'solana.statusPending': 'Status: Pending verification (Simulated demo available for free).',
		'solana.statusVerified': '● Verified on Solana ({amount} USD · {currency}) · Live mode unlocked.',
		'toast.walletCopied': 'Solana wallet copied to clipboard.',
		'toast.solanaVerified': 'Contribution verified on Solana. Live mode unlocked.',

		// Document metadata
		'meta.title': 'Tabvento — Give your browser a mission',
		'meta.description':
			'Tabvento: a mission desk to automate your browser with artificial intelligence.',

		// Accessibility & skip link
		skipLink: 'Skip to content',
		'skip.link': 'Skip to content',
		'sidebar.ariaLabel': 'Main navigation',
		'brand.ariaLabel': 'Tabvento home',
		'menu.open': 'Open menu',
		'menu.close': 'Close menu',
		'motion.pause': 'Pause animations',
		'motion.resume': 'Resume animations',
		'lang.toggleAria': 'Switch language to Spanish',
		'lang.switchToEn': 'Switch language to English',
		'lang.switchToEs': 'Switch language to Spanish',

		// Sidebar
		'sidebar.workspace': 'YOUR WORKSPACE',
		'nav.overview': 'Overview',
		'nav.inicio': 'Overview',
		'nav.missions': 'Missions',
		'nav.misiones': 'Missions',
		'nav.connections': 'Connections',
		'nav.conexiones': 'Connections',
		'nav.guide': 'Getting started',
		'nav.guia': 'Getting started',
		'sidebar.noteTitle': 'Fewer tabs.<br />More possibilities.',
		'sidebar.noteSubtitle': 'Your next idea starts here.',
		'sidebar.localTitle': 'Local workspace',
		'sidebar.localSubtitle': 'On your machine · v0.1',

		// Topbar
		'topbar.workspace': 'Workspace',
		'breadcrumb.inicio': 'Overview',
		'breadcrumb.misiones': 'Missions',
		'breadcrumb.conexiones': 'Connections',
		'breadcrumb.guia': 'Getting started',
		'server.connecting': 'Connecting',
		'server.online': 'Local server',
		'server.offline': 'Offline',
		'topbar.guide': 'Tabvento Guide',

		// View: Inicio / Hero
		'hero.eyebrow': 'A FRESH BREEZE FOR YOUR BROWSER',
		'hero.edition': 'TABVENTO / WORKSPACE 001',
		'hero.kicker': 'You bring the idea. The agent runs the course.',
		'hero.title': 'The web moves.<br /><span>Now, in your favor.</span>',
		'hero.subtitle':
			'Turn an instruction into a journey.<br />Research, compare, and gather what matters,<br />from a single mission desk.',
		'hero.newMission': 'Create a mission',
		'hero.demo': 'See it in action',
		'hero.demoPrompt':
			'Compare three tools for organizing a creative project',
		'hero.footnote': 'Open source. Local browser. You in command.',

		// Hero Art
		'art.explore': 'explore',
		'art.ideaInMotion': 'an idea, in motion',
		'art.search': 'Find new possibilities',
		'art.goalFound': 'GOAL FOUND',
		'art.tabsToAnswers': 'From tabs to answers.',
		'art.chipTop': 'Follow the current',
		'art.chipBottom': 'One mission. All connected.',
		'art.coordinate': '40° 43′ N \u00a0 / \u00a0 NEW HORIZONS',

		// Composer
		'composer.title': 'What do you want to set in motion?',
		'composer.badge': 'START WITH AN IDEA',
		'composer.taskLabel': 'Describe your mission',
		'composer.placeholder':
			'Find, compare, research… write your next mission.',
		'composer.modeAria': 'Execution mode',
		'composer.modeDemo': 'Simulated demo',
		'composer.modeLive': 'Live browser',
		'composer.hintDemo': 'Explore the workflow without keys or AI.',
		'composer.hintLive':
			'Uses your model and a local browser. May incur costs.',
		'composer.submitDemo': 'Start demo',
		'composer.submitLive': 'Start mission',

		// Suggestions
		'suggestions.label': 'Or try',
		'suggestions.idea': '↗ Research an idea',
		'suggestions.ideaPrompt': 'Research options for a creative workspace',
		'suggestions.compare': '⇄ Compare options',
		'suggestions.comparePrompt': 'Compare three tools for organizing projects',
		'suggestions.resources': '⊞ Gather resources',
		'suggestions.resourcesPrompt': 'Gather resources to learn a new skill',

		// Recent missions
		'recent.title': 'Your recent journeys',
		'recent.viewAll': 'View all missions',

		// Principles
		'principles.oneTitle': 'One idea, one journey',
		'principles.oneBody': 'From goal to result, with every step in sight.',
		'principles.twoTitle': 'Your space, your connections',
		'principles.twoBody':
			"Local history and keys in your machine's environment.",
		'principles.threeTitle': 'Open to what comes next',
		'principles.threeBody':
			'A dedicated interface built on an open-source engine.',

		// View: Misiones (History)
		'missions.eyebrow': 'YOUR LOCAL HISTORY',
		'missions.title': 'All your journeys',
		'missions.titleHtml': 'All your journeys<span>.</span>',
		'missions.subtitle':
			'An idea can open many doors. Here are its steps.',
		'missions.new': 'New mission',
		'missions.searchPlaceholder': 'Search for a mission…',
		'missions.searchAria': 'Search missions',
		'missions.filterAria': 'Filter by status',
		'missions.filterAll': 'All statuses',
		'missions.filterRunning': 'Running',
		'missions.filterCompleted': 'Completed',
		'missions.filterFailed': 'Failed',
		'missions.filterCancelled': 'Cancelled',

		// View: Conexiones (Settings)
		'connections.eyebrow': 'THE ENGINE OF YOUR IDEAS',
		'connections.title': 'Connect possibilities',
		'connections.titleHtml': 'Connect possibilities<span>.</span>',
		'connections.subtitle':
			'Choose your model. The browser runs on this machine.',
		'connections.card1Number': '01 / MODEL',
		'connections.card1Title': 'Your intelligence, your choice.',
		'connections.card1Body':
			'Choose your provider and enter the exact model identifier. The connection is saved on this local server.',
		'connections.providerLabel': 'Provider',
		'connections.loadingProviders': 'Loading providers…',
		'connections.modelLabel': 'Exact model identifier',
		'connections.modelPlaceholder': 'Your model name, unmodified',
		'connections.baseUrlLabel': 'Service URL',
		'connections.baseUrlHint':
			'Compatible endpoint URL. Do not include keys, passwords, or tokens in the address.',
		'connections.providerHintDefault':
			'Keys are configured in .env or the server environment; never in this form.',
		'connections.save': 'Save connection',
		'connections.check': 'Check configuration',
		'connections.noneSaved': 'No connection saved yet.',
		'connections.savedPrefix': 'Saved on this machine: ',
		'connections.savedItem': 'Saved on this machine: {provider} · {model}',
		'connections.checking': 'Checking saved configuration…',
		'connections.checkFootnote':
			'Local configuration check. Does not verify authentication, balance, or model availability with the provider.',
		'connections.card2Number': '02 / CONNECTIONS',
		'connections.card2Title': 'Ready on your machine.',
		'connections.howToKeys': 'How to configure keys ↗',
		'connections.privacyTitle': 'Local from the start.',
		'connections.privacyBody':
			'Keys are never stored in the browser. History is stored in SQLite on your machine. In live mode, required content is sent to the model provider. Engine telemetry is disabled by default when starting Tabvento.',
		'connections.engineName': 'Automation engine',
		'connections.engineReady': 'Available',
		'connections.engineMissing': 'Install dependencies',
		'connections.keyPresent': 'Key detected on server',
		'connections.keyMissing': 'No key on server',
		'connections.keyOptional': 'No key required',
		'provider.hintKey':
			'Set {env} in .env or the environment and restart the server. Do not paste keys here.',
		'provider.hintOllama':
			'Ollama uses your local service. Make sure it is running and the model is downloaded.',
		'provider.hintCompatible':
			'The endpoint key, if required, is configured in the server environment.',

		// View: Guía
		'guide.eyebrow': 'FROM IDEA TO FIRST JOURNEY',
		'guide.title': 'A little guidance',
		'guide.titleHtml': 'A little guidance<span>.</span>',
		'guide.subtitle':
			'Everything you need to get started, without losing your way.',
		'guide.card1Number': '01 / EXPLORE',
		'guide.card1Title': 'Start with zero setup.',
		'guide.card1Body':
			'In Overview, write a mission and choose <strong>Simulated demo</strong>. You will see an illustrative journey without visiting sites or calling a model. It is saved in your history and can be cancelled.',
		'guide.card1Link': 'Try the demo ↗',
		'guide.card2Number': '02 / CONNECT',
		'guide.card2Title': 'Bring your own model.',
		'guide.card2Body':
			'Set your provider key in <code>.env</code> and restart the server. Then choose the provider and save the exact model identifier in Connections. For Ollama, set your local service URL. “Check configuration” verifies local requirements; it does not authenticate with the provider.',
		'guide.card2Code':
			'OPENAI_API_KEY=your_key\n# or ANTHROPIC_API_KEY / GOOGLE_API_KEY',
		'guide.card2Link': 'Configure model ↗',
		'guide.card3Number': '03 / EXECUTE',
		'guide.card3Title': 'Open new possibilities.',
		'guide.card3Body1':
			'Select <strong>Live browser</strong> and describe a specific goal. You need Chrome, Chromium, or Edge installed. Provider calls may incur costs.',
		'guide.card3Body2':
			'The agent runs Python with your user permissions. Use trusted tasks and an isolated environment for untrusted content.',
		'guide.card4Number': '04 / LICENSE & GITHUB COMPLIANCE',
		'guide.card4Title': 'Tabvento official license.',
		'guide.card4Body':
			'Copyright © 2026 Tabvento. Simulated Demo Mode is free to explore locally and Live Browser Mode is unlocked via a verified Solana contribution (minimum $88 USD, no maximum limit) to 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm, in compliance with GitHub security standards (LICENSE).',

		// Footer
		'footer.tag': 'A BREATH OF FRESH AIR. ENDLESS POSSIBILITIES.',
		'footer.link': 'Tabvento 0.1.0 · Guide & credits ↗',

		// Mission Detail Dialog
		'detail.modeDefault': 'MISSION',
		'detail.modeDemo': 'SIMULATED DEMO / NO LIVE BROWSING',
		'detail.modeLive': 'MISSION / LOCAL BROWSER',
		'detail.closeAria': 'Close details',
		'detail.preparing': 'Preparing the journey…',
		'detail.copy': 'Copy result',
		'detail.download': 'Download',
		'detail.cancel': 'Cancel mission',
		'detail.delete': 'Remove from history',
		'detail.confirmDelete': 'Confirm deletion',
		'detail.partialResult': 'Partial result:',
		'detail.errorLabel': 'Error:',

		// Statuses & Modes
		'status.queued': 'Queued',
		'status.running': 'Running',
		'status.completed': 'Completed',
		'status.failed': 'Failed',
		'status.cancelled': 'Cancelled',
		'mode.demo': 'Simulated demo',
		'mode.live': 'Live browser',
		'mode.liveDownload': 'Live mission',

		// Empty states
		'empty.filteredTitle': 'No matching missions.',
		'empty.filteredBody': 'Try another search or change the filter.',
		'empty.defaultTitle': 'Your next journey starts here.',
		'empty.defaultBody': 'Create a mission and keep your ideas in motion.',
		'empty.defaultAction': 'Create my first mission ↗',
		'empty.offlineTitle': 'The local workspace is not connected yet.',
		'empty.offlineBody': 'Start Tabvento and reload this page.',

		// Toasts & Errors
		'toast.demoStarted': 'Demo started. This journey is simulated.',
		'toast.liveStarted': 'Mission started in the local browser.',
		'toast.cancelRequested':
			'Cancellation requested. Actions already performed cannot be undone.',
		'toast.missionDeleted': 'Mission removed from history.',
		'toast.resultCopied': 'Result copied.',
		'toast.copyFailed':
			'Could not copy. You can select the result text manually.',
		'toast.selectProviderModel': 'Choose a provider and enter your model.',
		'toast.connectionSaved': 'Connection saved on this local server.',
		'error.requestFailed': 'Could not complete the request.',
		'error.timeout':
			'The server is taking too long to respond. Please try again.',
		'error.offline':
			'No connection to the local server. Make sure Tabvento is still running.',
		'error.modelRequired':
			'Save your model identifier before starting a live mission.',
	};

	// Backend, runner, connections, and extra UI phrase pairs [Spanish, English]
	const extraPairs = [
		// Runner step labels & messages
		['Demostración simulada iniciada.', 'Simulated demo started.'],
		['Iniciando motor y navegador local.', 'Starting engine and local browser.'],
		['Interpretando el objetivo de ejemplo.', 'Interpreting sample goal.'],
		[
			'Organizando tres pestañas de demostración.',
			'Organizing three demo tabs.',
		],
		[
			'Conectando los pasos en una ruta de trabajo.',
			'Connecting steps into a workflow.',
		],
		['Preparando el resultado simulado.', 'Preparing simulated result.'],
		['Demostración finalizada.', 'Demo completed.'],
		[
			'Cancelación solicitada; cerrando la ejecución local.',
			'Cancellation requested; closing local execution.',
		],
		['La misión no pudo completarse.', 'The mission could not be completed.'],
		[
			'Ejecutando la misión con el proveedor configurado; esperando su resultado.',
			'Running mission with the configured provider; awaiting result.',
		],
		[
			'El agente terminó sin completar el objetivo.',
			'The agent finished without completing the goal.',
		],
		[
			'Ejecución finalizada con un resultado incompleto.',
			'Execution finished with an incomplete result.',
		],
		['Resultado recibido del agente.', 'Result received from the agent.'],
		['[credencial oculta]', '[redacted credential]'],
		['El servidor se está cerrando.', 'The server is shutting down.'],
		[
			'Ya hay tres misiones en ejecución. Espera o cancela una.',
			'Three missions are already running. Wait or cancel one.',
		],
		[
			'El servidor se reinició antes de terminar esta misión.',
			'The server restarted before this mission finished.',
		],

		// Connections & providers
		['Ollama local', 'Local Ollama'],
		['API compatible con OpenAI', 'OpenAI-compatible API'],
		['Proveedor y modelo', 'Provider and model'],
		['Credencial en el entorno', 'Credential in environment'],
		[
			'No se necesita clave para este servidor local.',
			'No key required for this local server.',
		],
		[
			'Guarda una conexión antes de ejecutar una misión real.',
			'Save a connection before running a live mission.',
		],
		['Dependencias del motor', 'Engine dependencies'],
		[
			'Comprobación local de los módulos instalados.',
			'Local check of installed modules.',
		],
		['Navegador local', 'Local browser'],
		[
			'Detección de Chrome, Chromium o Edge en rutas habituales; no abre el navegador.',
			'Detection of Chrome, Chromium, or Edge in standard paths; does not open the browser.',
		],
		[
			'Solo se comprobó la configuración local. No se autenticó el proveedor ni se contactó con el servidor del modelo.',
			'Only local configuration was checked. The provider was not authenticated and the model server was not contacted.',
		],
		['Configuración local preparada.', 'Local configuration ready.'],
		['Modelo', 'Model'],
		['Guardado', 'Saved'],
		[
			'La conexión solo admite provider, model y base_url. Guarda las claves en variables de entorno.',
			'Connection only accepts provider, model, and base_url. Store keys in environment variables.',
		],
		[
			'Selecciona un proveedor directo de Tabvento.',
			'Select a direct Tabvento provider.',
		],
		[
			'Escribe el identificador exacto del modelo, de hasta 200 caracteres.',
			'Enter the exact model identifier, up to 200 characters.',
		],
		['La URL del servidor no es válida.', 'The server URL is invalid.'],
		[
			'Usa una URL HTTP(S) sin credenciales, consulta ni fragmentos; por ejemplo http://127.0.0.1:11434/v1.',
			'Use an HTTP(S) URL without credentials, query, or fragments; for example http://127.0.0.1:11434/v1.',
		],
		[
			'La conexión Ollama local requiere localhost o una dirección loopback. Para otro servidor usa API compatible.',
			'Local Ollama connection requires localhost or a loopback address. For another server, use OpenAI-compatible API.',
		],
		[
			'Tabvento usa conexiones directas; configura tu propio servidor compatible.',
			'Tabvento uses direct connections; configure your own compatible server.',
		],
		[
			'La URL personalizada corresponde al proveedor API compatible.',
			'Custom URL is only for the OpenAI-compatible API provider.',
		],
		[
			'Falta TABVENTO_COMPATIBLE_API_KEY para tu servidor remoto.',
			'Missing TABVENTO_COMPATIBLE_API_KEY for your remote server.',
		],

		// Server HTTP errors
		[
			'Solo se permiten conexiones locales.',
			'Only local connections are allowed.',
		],
		['Origen no permitido.', 'Origin not allowed.'],
		[
			'No se permiten solicitudes de otros sitios.',
			'Cross-site requests are not allowed.',
		],
		['Longitud de solicitud inválida.', 'Invalid request length.'],
		[
			'El cuerpo JSON debe ocupar entre 1 y 16384 bytes.',
			'JSON body must be between 1 and 16384 bytes.',
		],
		['Envía un cuerpo application/json.', 'Send an application/json body.'],
		[
			'El cuerpo debe ser un objeto JSON válido.',
			'Body must be a valid JSON object.',
		],
		['Misión no encontrada.', 'Mission not found.'],
		['Ruta no encontrada.', 'Route not found.'],
		['Archivo no encontrado.', 'File not found.'],
		[
			'Escribe un objetivo de entre 3 y 4000 caracteres.',
			'Enter a goal between 3 and 4000 characters.',
		],
		['Modo o modelo inválido.', 'Invalid mode or model.'],
		[
			'Configura una conexión propia y un modelo explícito para ejecutar una misión real.',
			'Configure your own connection and an explicit model to run a live mission.',
		],
		[
			'Cancela la misión antes de eliminarla.',
			'Cancel the mission before deleting it.',
		],
		[
			'Las misiones en navegador real requieren una contribución verificada en Solana (mínimo $88 USD en SOL o USDC, sin límite máximo) a 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm. El modo Demo simulada es gratuito.',
			'Live browser missions require a verified Solana contribution (minimum $88 USD in SOL or USDC, no maximum limit) to 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm. Simulated demo mode is free.',
		],
		[
			'Introduce una firma de transacción de Solana válida en Base58 (64–90 caracteres).',
			'Enter a valid Base58 Solana transaction signature (64–90 characters).',
		],
		[
			'La transacción no se encontró o aún no está confirmada en la red Solana.',
			'Transaction not found or not yet confirmed on the Solana network.',
		],
		[
			'La transacción de Solana falló en la red y no puede utilizarse.',
			'The Solana transaction failed on-chain and cannot be used.',
		],
		[
			'La transacción no transfiere fondos a la cartera oficial de Solana de Tabvento (3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm).',
			'Transaction does not transfer funds to the official Tabvento Solana wallet (3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm).',
		],

		// Plain-text & HTML variants
		['Todos tus recorridos.', 'All your journeys.'],
		['Conecta posibilidades.', 'Connect possibilities.'],
		['Un poco de orientación.', 'A little guidance.'],
		[
			'✳ UN NUEVO AIRE PARA TU NAVEGADOR',
			'✳ A FRESH BREEZE FOR YOUR BROWSER',
		],
		[
			'<span class="mini-star">✳</span> UN NUEVO AIRE PARA TU NAVEGADOR',
			'<span class="mini-star">✳</span> A FRESH BREEZE FOR YOUR BROWSER',
		],
		['▶ Verlo en acción', '▶ See it in action'],
		[
			'<span class="play-icon">▶</span> Verlo en acción',
			'<span class="play-icon">▶</span> See it in action',
		],
		[
			'↳ Código abierto. Navegador local. Tú al mando.',
			'↳ Open source. Local browser. You in command.',
		],
		[
			'<span class="mini-path">↳</span> Código abierto. Navegador local. Tú al mando.',
			'<span class="mini-path">↳</span> Open source. Local browser. You in command.',
		],
		[
			'<span></span> Tú pones la idea. El agente, el recorrido.',
			'<span></span> You bring the idea. The agent runs the course.',
		],
		[
			'⌕ Encuentra nuevas posibilidades ↵',
			'⌕ Find new possibilities ↵',
		],
		[
			'<span>⌕</span> Encuentra nuevas posibilidades <b>↵</b>',
			'<span>⌕</span> Find new possibilities <b>↵</b>',
		],
		['✳ Sigue la corriente', '✳ Follow the current'],
		[
			'<span>✳</span> Sigue la corriente',
			'<span>✳</span> Follow the current',
		],
		[
			'✓ Una misión. Todo conectado.',
			'✓ One mission. All connected.',
		],
		[
			'<span class="check-circle">✓</span> Una misión. Todo conectado.',
			'<span class="check-circle">✓</span> One mission. All connected.',
		],
		[
			'40° 43′ N   /   NUEVOS HORIZONTES',
			'40° 43′ N   /   NEW HORIZONS',
		],
		[
			'40° 43′ N &nbsp; / &nbsp; NUEVOS HORIZONTES',
			'40° 43′ N &nbsp; / &nbsp; NEW HORIZONS',
		],
		['Ver todas las misiones ↗', 'View all missions ↗'],
		[
			'Ver todas las misiones <span>↗</span>',
			'View all missions <span>↗</span>',
		],
		['Guía de inicio↗', 'Getting started↗'],
		['Guía de inicio ↗', 'Getting started ↗'],
		['Guía de Tabvento↗', 'Tabvento Guide↗'],
		['Guía de Tabvento ↗', 'Tabvento Guide ↗'],
		['Menos pestañas. Más posibilidades.', 'Fewer tabs. More possibilities.'],
		[
			'Menos pestañas.<br>Más posibilidades.',
			'Fewer tabs.<br>More possibilities.',
		],
		[
			'La web se mueve.<br><span>Ahora, a tu favor.</span>',
			'The web moves.<br><span>Now, in your favor.</span>',
		],
		[
			'Convierte una instrucción en un recorrido.<br>Investiga, compara y reúne lo que importa,<br>desde una sola mesa de misiones.',
			'Turn an instruction into a journey.<br>Research, compare, and gather what matters,<br>from a single mission desk.',
		],
	];

	function collapseWs(str) {
		return String(str).replace(/\s+/g, ' ').trim();
	}

	const phrases = { es: {}, en: {} };
	function registerPair(esVal, enVal) {
		if (!esVal || !enVal) return;
		phrases.en[esVal] = enVal;
		phrases.es[enVal] = esVal;
		const normEs = collapseWs(esVal);
		const normEn = collapseWs(enVal);
		if (!phrases.en[normEs]) phrases.en[normEs] = enVal;
		if (!phrases.es[normEn]) phrases.es[normEn] = esVal;
	}

	for (const key of Object.keys(es)) {
		registerPair(es[key], en[key]);
	}
	for (const [esVal, enVal] of extraPairs) {
		registerPair(esVal, enVal);
	}

	function interpolate(str, vars) {
		if (!vars || typeof str !== 'string') return str;
		return str.replace(/\{(\w+)\}/g, (match, k) =>
			vars[k] !== undefined ? String(vars[k]) : match,
		);
	}

	function translateDynamicPattern(text, targetLang) {
		if (typeof text !== 'string' || !text) return null;
		if (targetLang === 'en') {
			let m;
			if ((m = text.match(/^Variable requerida: (.+)\.$/))) {
				return `Required variable: ${m[1]}.`;
			}
			if (
				(m = text.match(
					/^Falta (.+)\. Configura la clave en el entorno o en \.env y reinicia Tabvento\.$/,
				))
			) {
				return `Missing ${m[1]}. Set the key in the environment or .env and restart Tabvento.`;
			}
			if (
				(m = text.match(
					/^Configura (.+) en \.env o en el entorno y reinicia el servidor\. No pegues claves aquí\.$/,
				))
			) {
				return `Set ${m[1]} in .env or the environment and restart the server. Do not paste keys here.`;
			}
			if ((m = text.match(/^Guardada en este equipo: (.+)$/))) {
				return `Saved on this machine: ${translateDynamicPattern(m[1], 'en') || phrases.en[m[1]] || m[1]}`;
			}
			if ((m = text.match(/^Ollama local · (.+)$/))) {
				return `Local Ollama · ${m[1]}`;
			}
			if ((m = text.match(/^API compatible con OpenAI · (.+)$/))) {
				return `OpenAI-compatible API · ${m[1]}`;
			}
			if (text.startsWith('DEMOSTRACIÓN SIMULADA —')) {
				return text
					.replace(
						'DEMOSTRACIÓN SIMULADA — no se han visitado páginas ni consultado una IA.',
						'SIMULATED DEMO — no pages were visited and no AI was queried.',
					)
					.replace('Objetivo recibido:', 'Goal received:')
					.replace('Ruta de trabajo de ejemplo:', 'Sample workflow:')
					.replace(
						'1. Identificar las fuentes necesarias para el objetivo.',
						'1. Identify the sources needed for the goal.',
					)
					.replace(
						'2. Abrir y revisar las páginas relevantes.',
						'2. Open and review the relevant pages.',
					)
					.replace(
						'3. Contrastar la información y organizar un resultado.',
						'3. Cross-check the information and organize a result.',
					)
					.replace(
						'Esta demo permite probar el historial, los estados y la cancelación sin credenciales ni costes. Para obtener datos reales, configura un proveedor y crea una misión en modo real.',
						'This demo lets you test history, statuses, and cancellation without credentials or costs. For real data, configure a provider and create a mission in live mode.',
					);
			}
			if (text.startsWith('Resultado parcial:\n')) {
				return text.replace(/^Resultado parcial:\n/, 'Partial result:\n');
			}
		} else {
			let m;
			if ((m = text.match(/^Required variable: (.+)\.$/))) {
				return `Variable requerida: ${m[1]}.`;
			}
			if (
				(m = text.match(
					/^Missing (.+)\. Set the key in the environment or \.env and restart Tabvento\.$/,
				))
			) {
				return `Falta ${m[1]}. Configura la clave en el entorno o en .env y reinicia Tabvento.`;
			}
			if (
				(m = text.match(
					/^Set (.+) in \.env or the environment and restart the server\. Do not paste keys here\.$/,
				))
			) {
				return `Configura ${m[1]} en .env o en el entorno y reinicia el servidor. No pegues claves aquí.`;
			}
			if ((m = text.match(/^Saved on this machine: (.+)$/))) {
				return `Guardada en este equipo: ${translateDynamicPattern(m[1], 'es') || phrases.es[m[1]] || m[1]}`;
			}
			if ((m = text.match(/^Local Ollama · (.+)$/))) {
				return `Ollama local · ${m[1]}`;
			}
			if ((m = text.match(/^OpenAI-compatible API · (.+)$/))) {
				return `API compatible con OpenAI · ${m[1]}`;
			}
			if (text.startsWith('SIMULATED DEMO —')) {
				return text
					.replace(
						'SIMULATED DEMO — no pages were visited and no AI was queried.',
						'DEMOSTRACIÓN SIMULADA — no se han visitado páginas ni consultado una IA.',
					)
					.replace('Goal received:', 'Objetivo recibido:')
					.replace('Sample workflow:', 'Ruta de trabajo de ejemplo:')
					.replace(
						'1. Identify the sources needed for the goal.',
						'1. Identificar las fuentes necesarias para el objetivo.',
					)
					.replace(
						'2. Open and review the relevant pages.',
						'2. Abrir y revisar las páginas relevantes.',
					)
					.replace(
						'3. Cross-check the information and organize a result.',
						'3. Contrastar la información y organizar un resultado.',
					)
					.replace(
						'This demo lets you test history, statuses, and cancellation without credentials or costs. For real data, configure a provider and create a mission in live mode.',
						'Esta demo permite probar el historial, los estados y la cancelación sin credenciales ni costes. Para obtener datos reales, configura un proveedor y crea una misión en modo real.',
					);
			}
			if (text.startsWith('Partial result:\n')) {
				return text.replace(/^Partial result:\n/, 'Resultado parcial:\n');
			}
		}
		return null;
	}

	function normalizeLang(lang) {
		return typeof lang === 'string' && lang.toLowerCase().startsWith('es')
			? 'es'
			: 'en';
	}

	function hasLookup(keyOrText, target) {
		const table = target === 'en' ? en : es;
		const raw = String(keyOrText);
		if (Object.prototype.hasOwnProperty.call(table, raw)) return true;
		if (Object.prototype.hasOwnProperty.call(phrases[target], raw)) return true;
		const norm = collapseWs(raw);
		if (Object.prototype.hasOwnProperty.call(phrases[target], norm)) return true;
		return translateDynamicPattern(raw, target) !== null;
	}

	function t(keyOrText, lang = 'en', vars = undefined) {
		if (keyOrText === null || keyOrText === undefined) return '';
		const target = normalizeLang(lang);
		const table = target === 'en' ? en : es;
		const raw = String(keyOrText);

		if (Object.prototype.hasOwnProperty.call(table, raw)) {
			return interpolate(table[raw], vars);
		}
		if (Object.prototype.hasOwnProperty.call(phrases[target], raw)) {
			return interpolate(phrases[target][raw], vars);
		}
		const norm = collapseWs(raw);
		if (Object.prototype.hasOwnProperty.call(phrases[target], norm)) {
			return interpolate(phrases[target][norm], vars);
		}
		const dynamic = translateDynamicPattern(raw, target);
		if (dynamic !== null) {
			return interpolate(dynamic, vars);
		}
		return interpolate(raw, vars);
	}

	function statusLabels(lang = 'en') {
		const target = normalizeLang(lang);
		return {
			queued: t('status.queued', target),
			running: t('status.running', target),
			completed: t('status.completed', target),
			failed: t('status.failed', target),
			cancelled: t('status.cancelled', target),
		};
	}

	function updateElementContent(el, val, forceHtml = false) {
		if (forceHtml || /<[a-z][\s\S]*>/i.test(val) || val.includes('&nbsp;')) {
			if (
				el._i18nOrigHtml &&
				el._i18nOrigHtml.endsWith('<span>.</span>') &&
				!val.endsWith('<span>.</span>')
			) {
				el.innerHTML = val.replace(/\.$/, '') + '<span>.</span>';
			} else {
				el.innerHTML = val;
			}
			return;
		}
		if (!el.children || el.children.length === 0) {
			el.textContent = val;
			return;
		}
		// Preserve child elements (such as SVG icons, badges, or trailing punctuation spans)
		const textNodes = [];
		for (const node of el.childNodes) {
			if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
				textNodes.push(node);
			}
		}
		if (textNodes.length > 0) {
			const targetNode = textNodes[0];
			const lead = /^\s+/.exec(targetNode.nodeValue)?.[0] || '';
			const trail = /\s+$/.exec(targetNode.nodeValue)?.[0] || '';
			const hasDotSpan =
				el.lastElementChild &&
				el.lastElementChild.tagName === 'SPAN' &&
				el.lastElementChild.textContent.trim() === '.';
			const cleanVal = hasDotSpan ? val.replace(/\.$/, '') : val;
			targetNode.nodeValue = lead + cleanVal + trail;
		} else {
			el.textContent = val;
		}
	}

	function applyDom(rootNode, lang = 'en') {
		const target = normalizeLang(lang);
		const doc =
			rootNode && rootNode.nodeType === 9
				? rootNode
				: rootNode?.ownerDocument ||
					(typeof document !== 'undefined' ? document : null);
		const scope = rootNode || doc;
		if (!scope) return;

		if (doc && doc.documentElement) {
			doc.documentElement.lang = target;
		}
		if (doc && typeof doc.title === 'string') {
			doc.title = t('meta.title', target);
		}
		if (doc) {
			const metaDesc = doc.querySelector('meta[name="description"]');
			if (metaDesc) {
				metaDesc.setAttribute('content', t('meta.description', target));
			}
		}

		scope.querySelectorAll('[data-i18n]').forEach((el) => {
			const key = el.getAttribute('data-i18n');
			if (!key) return;
			if (el._i18nOrigText === undefined) {
				const textNodes = [];
				for (const node of el.childNodes) {
					if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
						textNodes.push(node);
					}
				}
				el._i18nOrigText =
					el.children && el.children.length > 0 && textNodes.length > 0
						? textNodes[0].nodeValue.trim()
						: el.textContent;
				el._i18nOrigHtml = el.innerHTML;
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigText
					: t(el._i18nOrigText, target);
			updateElementContent(el, resolved, false);
		});

		scope.querySelectorAll('[data-i18n-html]').forEach((el) => {
			const key = el.getAttribute('data-i18n-html');
			if (!key) return;
			if (el._i18nOrigHtml === undefined) {
				el._i18nOrigHtml = el.innerHTML;
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigHtml
					: t(el._i18nOrigHtml, target);
			updateElementContent(el, resolved, true);
		});

		scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
			const key = el.getAttribute('data-i18n-placeholder');
			if (!key) return;
			if (el._i18nOrigPlaceholder === undefined) {
				el._i18nOrigPlaceholder = el.getAttribute('placeholder') || '';
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigPlaceholder
					: t(el._i18nOrigPlaceholder, target);
			el.setAttribute('placeholder', resolved);
		});

		scope.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
			const key = el.getAttribute('data-i18n-aria-label');
			if (!key) return;
			if (el._i18nOrigAria === undefined) {
				el._i18nOrigAria = el.getAttribute('aria-label') || '';
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigAria
					: t(el._i18nOrigAria, target);
			el.setAttribute('aria-label', resolved);
		});

		scope.querySelectorAll('[data-i18n-prompt]').forEach((el) => {
			const key = el.getAttribute('data-i18n-prompt');
			if (!key) return;
			if (el._i18nOrigPrompt === undefined) {
				el._i18nOrigPrompt = el.getAttribute('data-prompt') || '';
			}
			const resolved = hasLookup(key, target)
				? t(key, target)
				: target === 'es'
					? el._i18nOrigPrompt
					: t(el._i18nOrigPrompt, target);
			el.setAttribute('data-prompt', resolved);
		});

		const langToggle = scope.querySelector('#lang-toggle');
		if (langToggle) {
			langToggle.setAttribute('data-lang', target);
			langToggle.setAttribute(
				'aria-label',
				target === 'en' ? t('lang.switchToEs', 'en') : t('lang.switchToEn', 'es'),
			);
			langToggle.querySelectorAll('[data-lang-opt]').forEach((opt) => {
				opt.classList.toggle(
					'active',
					opt.getAttribute('data-lang-opt') === target,
				);
			});
		}
	}

	const api = {
		es,
		en,
		phrases,
		normalizeLang,
		t,
		statusLabels,
		translateStep: (label, lang = 'es') => t(label, lang),
		translateResult: (result, lang = 'es') => t(result, lang),
		applyDom,
	};

	if (root) {
		root.TABVENTO_I18N = api;
	}
	if (typeof window !== 'undefined') {
		window.TABVENTO_I18N = api;
	}
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = api;
	}
})(typeof globalThis !== 'undefined' ? globalThis : this);
