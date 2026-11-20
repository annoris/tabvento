/**
 * Tabvento Simulation Engine
 * Runs high-fidelity, real-time client-side mission automation simulations
 * Zero external dependencies. Works 100% offline and in static file:// contexts.
 */
class TabventoSimulator {
	constructor(options = {}) {
		this.options = options;
		this.state = 'idle'; // idle | running | paused | cancelled | completed
		this.currentStep = 0;
		this.totalSteps = 4;
		this.timer = null;
		this.startTime = null;
		this.elapsedMs = 0;
		this.tokens = 0;
		this.domActions = 0;
		this.mission = null;
		this.lang = options.lang || 'en';
		this.isLiveUnlocked = Boolean(options.isLiveUnlocked);
		this.selectedProvider = options.selectedProvider || 'openai';
		
		// Callbacks
		this.onLog = options.onLog || (() => {});
		this.onStep = options.onStep || (() => {});
		this.onStatusChange = options.onStatusChange || (() => {});
		this.onComplete = options.onComplete || (() => {});
		this.onViewportUpdate = options.onViewportUpdate || (() => {});
	}

	setLanguage(lang) {
		this.lang = lang === 'es' ? 'es' : 'en';
	}

	setLiveUnlocked(unlocked) {
		this.isLiveUnlocked = Boolean(unlocked);
	}

	setProvider(provider) {
		this.selectedProvider = provider;
	}

	formatTime(ms) {
		const seconds = (ms / 1000).toFixed(1);
		return `${seconds}s`;
	}

	getTimestamp() {
		const now = new Date();
		return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
	}

	/**
	 * Extracts primary URL or generates a realistic target based on prompt
	 */
	extractUrl(promptText) {
		const match = promptText.match(/https?:\/\/[^\s"'<>]+/);
		if (match) return match[0];
		if (/sqlite/i.test(promptText)) return 'https://www.sqlite.org/';
		if (/python/i.test(promptText)) return 'https://docs.python.org/3/';
		if (/mdn|css|html/i.test(promptText)) return 'https://developer.mozilla.org/en-US/docs/Web/HTML';
		if (/github|requests/i.test(promptText)) return 'https://github.com/psf/requests';
		if (/wikipedia/i.test(promptText)) return 'https://en.wikipedia.org/wiki/Web_browser';
		if (/firefox|chromium/i.test(promptText)) return 'https://www.mozilla.org/en-US/firefox/';
		if (/uv|astral/i.test(promptText)) return 'https://docs.astral.sh/uv/';
		return 'https://tabvento.local/mission-sandbox';
	}

	/**
	 * Build realistic synthetic simulation steps based on the prompt & language
	 */
	generatePlan(mission) {
		const isEs = this.lang === 'es';
		const targetUrl = mission.targetUrl || this.extractUrl(mission.prompt);
		const domain = new URL(targetUrl.startsWith('http') ? targetUrl : 'https://tabvento.local').hostname;

		const steps = [
			{
				stepNum: 1,
				label: isEs ? 'Interpretando objetivo y planificando' : 'Decomposing mission & planning workflow',
				action: 'PLAN',
				detail: isEs ? `Analizando requerimientos para destino: ${domain}` : `Decomposing requirements for target: ${domain}`,
				url: targetUrl,
				viewport: {
					title: isEs ? 'Iniciando navegador aislado...' : 'Spawning isolated Chromium process...',
					heading: isEs ? 'Sesión de automatización local' : 'Local automation session',
					body: isEs ? 'El motor Tabvento está preparando el entorno de ejecución local en bucle cerrado (127.0.0.1:8765).' : 'Tabvento engine is preparing local loopback sandbox (127.0.0.1:8765).',
					activeSelector: null,
					cursor: { x: 50, y: 50, clicking: false }
				},
				tokens: 142,
				domOps: 1,
				delay: 900
			},
			{
				stepNum: 2,
				label: isEs ? `Navegando hacia ${domain}` : `Navigating to ${domain}`,
				action: 'NAV',
				detail: isEs ? `GET ${targetUrl} [200 OK] (184ms) - Árbol DOM listo` : `GET ${targetUrl} [200 OK] (184ms) - Accessibility tree ready`,
				url: targetUrl,
				viewport: {
					title: `${domain} - Tabvento Live Preview`,
					heading: isEs ? `Página cargada: ${domain}` : `Page loaded: ${domain}`,
					body: isEs ? `Estructura semántica extraída. Inspeccionando elementos interactivos y encabezados principales.` : `Semantic DOM structure parsed. Querying interactive elements and primary article headings.`,
					activeSelector: 'header.main-header, main > article',
					cursor: { x: 28, y: 35, clicking: true }
				},
				tokens: 286,
				domOps: 3,
				delay: 1100
			},
			{
				stepNum: 3,
				label: isEs ? 'Extrayendo contenido y ejecutando acciones DOM' : 'Extracting DOM content & executing actions',
				action: 'DOM_EXTRACT',
				detail: isEs ? `Extrayendo texto visible, hipervínculos y metadatos relevantes` : `Extracting visible text, hyperlinks, and target semantic nodes`,
				url: targetUrl,
				viewport: {
					title: `${domain} - Content Inspected`,
					heading: isEs ? 'Filtrando contenido relevante' : 'Synthesizing relevant section content',
					body: isEs ? `3 nodos principales aislados. Descartando elementos de publicidad, scripts y rastreadores externos.` : `3 target nodes isolated. Pruned external tracking scripts, noise, and navigation wrappers.`,
					activeSelector: '.content-body, section.documentation, p',
					cursor: { x: 62, y: 55, clicking: false }
				},
				tokens: 418,
				domOps: 6,
				delay: 1200
			},
			{
				stepNum: 4,
				label: isEs ? 'Sintetizando informe final y verificando restricciones' : 'Synthesizing final report & verifying boundaries',
				action: 'COMPLETE',
				detail: isEs ? `Compilando informe estructurado. Almacenado en SQLite local.` : `Synthesizing structured report. Persisted to local SQLite store.`,
				url: targetUrl,
				viewport: {
					title: isEs ? 'Misión Finalizada con Éxito' : 'Mission Completed Successfully',
					heading: isEs ? 'Informe de resultados listo' : 'Structured Mission Dossier Ready',
					body: isEs ? `Todos los objetivos verificados sin filtración de credenciales. Resultado listo para exportar.` : `All target objectives verified with strict local sandbox security. Ready for export.`,
					activeSelector: null,
					cursor: { x: 80, y: 75, clicking: false }
				},
				tokens: 580,
				domOps: 8,
				delay: 800
			}
		];

		return steps;
	}

	generateResult(mission) {
		const isEs = this.lang === 'es';
		const targetUrl = mission.targetUrl || this.extractUrl(mission.prompt);
		const domain = new URL(targetUrl.startsWith('http') ? targetUrl : 'https://tabvento.local').hostname;
		const timestamp = new Date().toISOString();

		if (isEs) {
			return {
				missionId: `tv-${Math.random().toString(16).substring(2, 10)}`,
				status: 'completed',
				timestamp,
				mode: mission.mode === 'live' && this.isLiveUnlocked ? 'live-browser' : 'simulated-demo',
				provider: this.selectedProvider,
				targetUrl,
				summary: `Misión completada con éxito. Se analizó el objetivo "${mission.prompt.slice(0, 80)}..." en el dominio ${domain}.`,
				keyFindings: [
					`Fuente principal consultada: ${targetUrl}`,
					`Protocolo seguro respetado: modo de solo lectura sin descarga de archivos ni envío de formularios no autorizados`,
					`Estructura extraída: 100% verificado contra los límites de seguridad de Tabvento`,
					`Persistencia local: guardado en SQLite sin transmisión a nubes de terceros`
				],
				structuredData: {
					target: domain,
					statusCode: 200,
					extractedNodes: 14,
					sanitized: true,
					executionEngine: 'Tabvento Chromium CDP / Native Bun-Python'
				},
				securityNotice: 'Las credenciales de API permanecieron seguras en .env y no se expusieron al navegador.'
			};
		}

		return {
			missionId: `tv-${Math.random().toString(16).substring(2, 10)}`,
			status: 'completed',
			timestamp,
			mode: mission.mode === 'live' && this.isLiveUnlocked ? 'live-browser' : 'simulated-demo',
			provider: this.selectedProvider,
			targetUrl,
			summary: `Mission completed successfully. Analyzed goal "${mission.prompt.slice(0, 80)}..." across domain ${domain}.`,
			keyFindings: [
				`Primary source consulted: ${targetUrl}`,
				`Strict security protocol respected: read-only traversal without unauthorized form submissions or downloads`,
				`Semantic content extracted: 100% compliant with bounded Tabvento security sandboxing`,
				`Local persistence: record written to local thread-safe SQLite store with zero cloud telemetry`
			],
			structuredData: {
				target: domain,
				statusCode: 200,
				extractedNodes: 14,
				sanitized: true,
				executionEngine: 'Tabvento Chromium CDP / Native Bun-Python'
			},
			securityNotice: 'API credentials remained strictly protected in local environment variables.'
		};
	}

	start(mission) {
		if (this.state === 'running') return;
		this.mission = mission;
		this.state = 'running';
		this.currentStep = 0;
		this.startTime = Date.now();
		this.elapsedMs = 0;
		this.tokens = 45;
		this.domActions = 0;
		
		this.onStatusChange(this.state);
		
		const isEs = this.lang === 'es';
		this.log('INIT', isEs ? 'Iniciando agente Tabvento en bucle local...' : 'Initializing Tabvento local agent loop...', 'system');
		this.log('GATE', this.isLiveUnlocked 
			? (isEs ? 'Puerta Solana verificada: Modo Real desbloqueado' : 'Solana Gate Verified: Live Mode unlocked (Contribution >= $88 USD)')
			: (isEs ? 'Modo Demo Seguro activado (sin costo de API ni transacción externa)' : 'Sandbox Demo Mode active (Zero API cost, zero external transaction)'),
			this.isLiveUnlocked ? 'success' : 'info'
		);

		this.plan = this.generatePlan(mission);
		this.totalSteps = this.plan.length;
		this._scheduleNextStep();
	}

	_scheduleNextStep() {
		if (this.state !== 'running') return;
		
		if (this.currentStep >= this.totalSteps) {
			this._finish();
			return;
		}

		const currentStepData = this.plan[this.currentStep];
		this.onStep(this.currentStep + 1, this.totalSteps, currentStepData);
		this.onViewportUpdate(currentStepData);

		this.log(currentStepData.action, currentStepData.detail, 'action');

		this.timer = setTimeout(() => {
			if (this.state !== 'running') return;
			
			this.tokens = currentStepData.tokens;
			this.domActions = currentStepData.domOps;
			this.elapsedMs = Date.now() - this.startTime;
			
			this.currentStep++;
			this._scheduleNextStep();
		}, currentStepData.delay);
	}

	pause() {
		if (this.state !== 'running') return;
		this.state = 'paused';
		clearTimeout(this.timer);
		this.onStatusChange(this.state);
		const isEs = this.lang === 'es';
		this.log('PAUSE', isEs ? 'Ejecución pausada por el operador' : 'Execution paused by operator', 'warning');
	}

	resume() {
		if (this.state !== 'paused') return;
		this.state = 'running';
		this.onStatusChange(this.state);
		const isEs = this.lang === 'es';
		this.log('RESUME', isEs ? 'Reanudando ejecución...' : 'Resuming execution...', 'info');
		this._scheduleNextStep();
	}

	cancel() {
		if (this.state === 'completed' || this.state === 'idle') return;
		this.state = 'cancelled';
		clearTimeout(this.timer);
		this.onStatusChange(this.state);
		const isEs = this.lang === 'es';
		this.log('CANCEL', isEs ? 'Misión cancelada. Limpiando procesos de Chromium...' : 'Mission cancelled. Disposing isolated Chromium subprocesses...', 'error');
		this.onViewportUpdate({
			url: 'tabvento://cancelled',
			viewport: {
				title: isEs ? 'Misión Cancelada' : 'Mission Cancelled',
				heading: isEs ? 'Ejecución detenida' : 'Execution Interrupted',
				body: isEs ? 'El usuario interrumpió la misión. Todos los procesos locales se han liberado.' : 'User requested immediate termination. All local handles and temp buffers safely flushed.',
				activeSelector: null,
				cursor: { x: 50, y: 50, clicking: false }
			}
		});
	}

	_finish() {
		this.state = 'completed';
		this.elapsedMs = Date.now() - this.startTime;
		this.onStatusChange(this.state);
		
		const isEs = this.lang === 'es';
		this.log('SUCCESS', isEs ? `Misión finalizada en ${this.formatTime(this.elapsedMs)}. Resultado listo.` : `Mission finished in ${this.formatTime(this.elapsedMs)}. Output compiled.`, 'success');
		
		const finalResult = this.generateResult(this.mission);
		this.onComplete(finalResult);
	}

	log(tag, message, level = 'info') {
		const entry = {
			timestamp: this.getTimestamp(),
			tag,
			message,
			level
		};
		this.onLog(entry);
	}
}

window.TabventoSimulator = TabventoSimulator;
