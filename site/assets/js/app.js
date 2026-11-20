/**
 * Tabvento Showcase Application
 * Zero-dependency interactive controller for GitHub Pages & Local View
 */
'use strict';

(function () {
	// Internationalization Dictionary
	const I18N = {
		en: {
			'nav.missionRunner': 'Mission Runner',
			'nav.library': '24 Presets',
			'nav.solanaGate': 'Solana Gate',
			'nav.providers': 'AI Providers',
			'nav.architecture': 'Architecture',
			'nav.github': 'GitHub',
			'nav.tryDemo': 'Launch Simulator',

			'hero.badge': 'Local-First AI Browser Automation',
			'hero.titlePre': 'Autonomous AI Browser Automation for ',
			'hero.titleHighlight': 'Modern Business',
			'hero.subtitle': 'Run real local Chrome automation or zero-cost simulated sandbox missions. Designed for SMEs, agile agencies, and enterprise automation with zero cloud locks and strict data privacy.',
			'hero.ctaDemo': 'Run Interactive Simulator',
			'hero.ctaLibrary': 'Explore 24 Presets',
			'hero.ctaGithub': 'View on GitHub',
			'hero.copyCli': 'Copy CLI command',

			'kpi.presets': '24 Mission Presets',
			'kpi.presetsSub': 'Research, E-Com, QA, Leads',
			'kpi.privacy': 'Zero Cloud Leaks',
			'kpi.privacySub': 'Loopback SQLite & Local Chrome',
			'kpi.gate': 'Solana Web3 Gate',
			'kpi.gateSub': '>= $88 USD on-chain unlock',
			'kpi.models': '5+ Model Providers',
			'kpi.modelsSub': 'OpenAI, Claude, Gemini, Ollama',

			'sim.title': 'Interactive Mission Simulator',
			'sim.desc': 'Experience how Tabvento orchestrates browser automation step-by-step in simulated sandbox mode without external API keys or server costs.',
			'sim.composerTitle': 'Compose Mission Draft',
			'sim.goalLabel': 'Mission Objective / Prompt',
			'sim.presetLabel': 'Or select from library:',
			'sim.presetDefault': '-- Choose an existing example --',
			'sim.modeLabel': 'Execution Mode',
			'sim.modeDemo': 'Simulated Demo (Sandbox)',
			'sim.modeLive': 'Live Browser (Web3 Gate)',
			'sim.btnRun': 'Start Mission (Simulated)',
			'sim.btnPause': 'Pause',
			'sim.btnResume': 'Resume',
			'sim.btnCancel': 'Cancel',
			'sim.btnReset': 'Reset Simulator',
			'sim.liveLockedTip': 'Live mode requires verified Solana contribution (>= $88 USD). Test unlock below!',
			'sim.liveUnlocked': 'Live mode verified! Full browser actions unlocked.',

			'hud.idle': 'Simulator Ready',
			'hud.running': 'Running Mission...',
			'hud.paused': 'Paused',
			'hud.cancelled': 'Cancelled',
			'hud.completed': 'Completed',
			'hud.step': 'Step',
			'hud.time': 'Elapsed',
			'hud.tokens': 'Tokens',
			'hud.ops': 'DOM Ops',

			'result.title': 'Mission Dossier & Results',
			'result.tabSummary': 'Summary',
			'result.tabJson': 'JSON',
			'result.tabMd': 'Markdown',
			'result.btnCopy': 'Copy Result',
			'result.btnDownloadMd': 'Download Markdown',
			'result.btnDownloadJson': 'Download JSON',

			'lib.tag': 'Curated Library',
			'lib.title': '24 Production Mission Presets',
			'lib.desc': 'Hand-crafted automation briefs spanning strategy, e-commerce competitor analysis, developer QA, lead generation, and form automation.',
			'lib.searchPlaceholder': 'Search 24 missions by keyword, URL, or tag...',
			'lib.catAll': 'All Presets (24)',
			'lib.catResearch': 'Market Research',
			'lib.catEcommerce': 'E-Commerce',
			'lib.catQa': 'Developer QA',
			'lib.catLeadgen': 'Lead Gen',
			'lib.catExtraction': 'Data Extraction',
			'lib.catAutomation': 'Automation',
			'lib.fillComposer': 'Fill Composer',

			'gate.tag': 'Decentralized Activation',
			'gate.title': 'Solana Web3 Contribution Gate',
			'gate.desc': 'Tabvento is local-first software. Live Browser Mode is unlocked on-chain via a verified contribution of $88+ USD in SOL or USDC to the Tabvento development wallet, with zero maximum limit.',
			'gate.walletLabel': 'Official Tabvento Solana Wallet',
			'gate.copyWallet': 'Copy Wallet',
			'gate.openSolanaPay': 'Open Solana Pay URI',
			'gate.verifierTitle': 'Simulated Transaction Verifier',
			'gate.verifierDesc': 'Test the on-chain verification workflow in your browser right now.',
			'gate.sigLabel': 'Transaction Signature (Base58)',
			'gate.btnUseDemoSig': 'Use Demo Signature',
			'gate.btnVerify': 'Verify Signature (Simulated RPC)',
			'gate.btnRelock': 'Lock Live Mode',
			'gate.statusVerified': 'VERIFIED: Live Browser Mode Unlocked!',
			'gate.statusUnverified': 'LOCKED: Send >= $88 USD on Solana to activate Live Mode.',

			'providers.tag': 'Model Connectivity',
			'providers.title': 'AI Model Provider Studio',
			'providers.desc': 'Tabvento connects directly from your local loopback machine to top LLM providers. Your private API keys reside solely in your local .env and are never sent to third-party dashboards.',
			'providers.securityNote': 'Security Guarantee: Tabvento loopback (127.0.0.1:8765) interacts with your local Chromium instance directly. Zero analytics, zero telemetric leakages.',

			'arch.tag': 'System Internals',
			'arch.title': 'Tabvento Architecture & Data Flow',
			'arch.desc': 'Click on any architectural component below to inspect its responsibilities, safety boundaries, and offline characteristics.',

			'footer.company': 'JAP INTERNATIONAL · AI AUTOMATION PLATFORM',
			'footer.desc': 'Tabvento is a production-grade local AI browser automation platform designed for modern businesses, SMEs, and automated agencies. Copyright © 2026 Tabvento.',
			'footer.github': 'GitHub Repository',
			'footer.docs': 'Documentation',
			'footer.license': 'Commercial Licensing'
		},
		es: {
			'nav.missionRunner': 'Ejecutor de Misiones',
			'nav.library': '24 Plantillas',
			'nav.solanaGate': 'Puerta Solana',
			'nav.providers': 'Proveedores IA',
			'nav.architecture': 'Arquitectura',
			'nav.github': 'GitHub',
			'nav.tryDemo': 'Iniciar Simulador',

			'hero.badge': 'Automatización Web con IA Local y Segura',
			'hero.titlePre': 'Automatización Web Autónoma para ',
			'hero.titleHighlight': 'Negocios Modernos',
			'hero.subtitle': 'Ejecuta automatización real con Chrome local o misiones simuladas sin costo en sandbox. Diseñado para pymes, agencias y automatización empresarial sin bloqueos en la nube y con estricta privacidad.',
			'hero.ctaDemo': 'Abrir Simulador Interactivo',
			'hero.ctaLibrary': 'Explorar 24 Plantillas',
			'hero.ctaGithub': 'Ver en GitHub',
			'hero.copyCli': 'Copiar comando CLI',

			'kpi.presets': '24 Misiones de Ejemplo',
			'kpi.presetsSub': 'E-Commerce, QA, Leads, Research',
			'kpi.privacy': 'Sin Fugas a la Nube',
			'kpi.privacySub': 'SQLite en bucle local y Chrome',
			'kpi.gate': 'Puerta Web3 Solana',
			'kpi.gateSub': '>= $88 USD desbloqueo on-chain',
			'kpi.models': '5+ Proveedores IA',
			'kpi.modelsSub': 'OpenAI, Claude, Gemini, Ollama',

			'sim.title': 'Simulador Interactivo de Misiones',
			'sim.desc': 'Experimenta cómo Tabvento orquesta la navegación paso a paso en modo sandbox sin claves API externas ni costos de servidor.',
			'sim.composerTitle': 'Componer Borrador de Misión',
			'sim.goalLabel': 'Objetivo de la Misión / Prompt',
			'sim.presetLabel': 'O selecciona de la biblioteca:',
			'sim.presetDefault': '-- Selecciona un ejemplo --',
			'sim.modeLabel': 'Modo de Ejecución',
			'sim.modeDemo': 'Demostración Simulada (Sandbox)',
			'sim.modeLive': 'Navegador Real (Puerta Web3)',
			'sim.btnRun': 'Iniciar Misión (Simulación)',
			'sim.btnPause': 'Pausar',
			'sim.btnResume': 'Reanudar',
			'sim.btnCancel': 'Cancelar',
			'sim.btnReset': 'Reiniciar Simulador',
			'sim.liveLockedTip': 'El modo real requiere activación en Solana (>= $88 USD). ¡Prueba la verificación abajo!',
			'sim.liveUnlocked': '¡Modo real verificado! Acciones de navegador desbloqueadas.',

			'hud.idle': 'Simulador Listo',
			'hud.running': 'Ejecutando Misión...',
			'hud.paused': 'Pausado',
			'hud.cancelled': 'Cancelado',
			'hud.completed': 'Completado',
			'hud.step': 'Paso',
			'hud.time': 'Tiempo',
			'hud.tokens': 'Tokens',
			'hud.ops': 'Acciones DOM',

			'result.title': 'Dossier de Resultados de la Misión',
			'result.tabSummary': 'Resumen',
			'result.tabJson': 'JSON',
			'result.tabMd': 'Markdown',
			'result.btnCopy': 'Copiar Resultado',
			'result.btnDownloadMd': 'Descargar Markdown',
			'result.btnDownloadJson': 'Descargar JSON',

			'lib.tag': 'Biblioteca Curada',
			'lib.title': '24 Misiones de Ejemplo Listas para Usar',
			'lib.desc': 'Instrucciones seleccionadas para investigación de mercado, comparativas e-commerce, pruebas QA, captación de prospectos y formularios.',
			'lib.searchPlaceholder': 'Buscar entre las 24 misiones por palabra clave, URL o etiqueta...',
			'lib.catAll': 'Todas las Misiones (24)',
			'lib.catResearch': 'Investigación',
			'lib.catEcommerce': 'Comercio Electrónico',
			'lib.catQa': 'Control de Calidad QA',
			'lib.catLeadgen': 'Generación de Leads',
			'lib.catExtraction': 'Extracción de Datos',
			'lib.catAutomation': 'Automatización',
			'lib.fillComposer': 'Cargar al Editor',

			'gate.tag': 'Activación Descentralizada',
			'gate.title': 'Puerta de Activación en Solana Web3',
			'gate.desc': 'Tabvento es software local. El Modo Real se desbloquea on-chain mediante una contribución verificada de $88+ USD en SOL o USDC a la cartera oficial de Tabvento, sin límite máximo.',
			'gate.walletLabel': 'Cartera Oficial de Solana Tabvento',
			'gate.copyWallet': 'Copiar Cartera',
			'gate.openSolanaPay': 'Abrir Enlace Solana Pay',
			'gate.verifierTitle': 'Verificador de Transacciones Simulado',
			'gate.verifierDesc': 'Prueba el flujo de verificación on-chain directamente en tu navegador.',
			'gate.sigLabel': 'Firma de Transacción (Base58)',
			'gate.btnUseDemoSig': 'Usar Firma Demo',
			'gate.btnVerify': 'Verificar Firma (RPC Simulado)',
			'gate.btnRelock': 'Bloquear Modo Real',
			'gate.statusVerified': '¡VERIFICADO: Modo Navegador Real Desbloqueado!',
			'gate.statusUnverified': 'BLOQUEADO: Envía >= $88 USD en Solana para desbloquear Modo Real.',

			'providers.tag': 'Conectividad IA',
			'providers.title': 'Estudio de Proveedores de Modelos',
			'providers.desc': 'Tabvento se conecta de forma directa desde tu máquina local a los principales proveedores LLM. Tus claves API se guardan exclusivamente en tu archivo .env local y nunca se envían a paneles de terceros.',
			'providers.securityNote': 'Garantía de Seguridad: El bucle local de Tabvento (127.0.0.1:8765) interactúa de forma privada con Chromium. Cero analíticas externas.',

			'arch.tag': 'Arquitectura Interna',
			'arch.title': 'Arquitectura y Flujo de Datos de Tabvento',
			'arch.desc': 'Haz clic en cualquier componente del sistema para ver sus responsabilidades, límites de seguridad y características fuera de línea.',

			'footer.company': 'JAP INTERNATIONAL · PLATAFORMA DE AUTOMATIZACIÓN IA',
			'footer.desc': 'Tabvento es una plataforma de automatización de navegador con IA local diseñada para pymes y empresas modernas. Copyright © 2026 Tabvento.',
			'footer.github': 'Repositorio GitHub',
			'footer.docs': 'Documentación',
			'footer.license': 'Licenciamiento Comercial'
		}
	};

	// State
	let currentLang = 'en';
	let isLiveUnlocked = false;
	let currentMode = 'demo'; // 'demo' | 'live'
	let activeCategory = 'all';
	let searchQuery = '';
	let currentResult = null;
	let simulator = null;
	let activeArchNode = 'loopback';

	const SOLANA_WALLET = '3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm';
	const DEMO_DEVICE_CODE = 'TV-A84F2B9C1E03';

	// Translations helper
	function t(key) {
		const dict = I18N[currentLang] || I18N.en;
		return dict[key] || I18N.en[key] || key;
	}

	function applyTranslations() {
		document.querySelectorAll('[data-i18n]').forEach(el => {
			const key = el.getAttribute('data-i18n');
			if (key && t(key)) {
				el.textContent = t(key);
			}
		});

		document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
			const key = el.getAttribute('data-i18n-placeholder');
			if (key && t(key)) {
				el.placeholder = t(key);
			}
		});

		// Update language toggle buttons
		document.querySelectorAll('.lang-btn').forEach(btn => {
			const lang = btn.getAttribute('data-lang');
			btn.classList.toggle('active', lang === currentLang);
		});

		// Inform simulator
		if (simulator) {
			simulator.setLanguage(currentLang);
		}

		// Re-render example library cards with updated language
		renderLibraryCards();
		updatePresetDropdown();
		renderArchInspector();
	}

	function setLanguage(lang) {
		currentLang = lang === 'es' ? 'es' : 'en';
		try {
			localStorage.setItem('tabvento_lang', currentLang);
		} catch (e) {}
		applyTranslations();
	}

	// Toast helper
	function showToast(message, type = 'info') {
		const container = document.getElementById('toast-container');
		if (!container) return;
		const toast = document.createElement('div');
		toast.className = `toast toast-${type}`;
		toast.innerHTML = `
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				${type === 'success' 
					? '<polyline points="20 6 9 17 4 12"></polyline>' 
					: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'}
			</svg>
			<span>${message}</span>
		`;
		container.appendChild(toast);
		setTimeout(() => {
			toast.style.opacity = '0';
			toast.style.transform = 'translateY(8px)';
			setTimeout(() => toast.remove(), 250);
		}, 3000);
	}

	// Copy to clipboard helper
	function copyText(text, successMsg) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(text).then(() => {
				showToast(successMsg || 'Copied to clipboard!', 'success');
			}).catch(() => fallbackCopy(text, successMsg));
		} else {
			fallbackCopy(text, successMsg);
		}
	}

	function fallbackCopy(text, successMsg) {
		const ta = document.createElement('textarea');
		ta.value = text;
		document.body.appendChild(ta);
		ta.select();
		document.execCommand('copy');
		ta.remove();
		showToast(successMsg || 'Copied to clipboard!', 'success');
	}

	// Initialize Simulator
	function initSimulator() {
		const logView = document.getElementById('terminal-log-view');
		const hudStatus = document.getElementById('hud-status-pill');
		const hudStatusText = document.getElementById('hud-status-text');
		const hudStepVal = document.getElementById('hud-step-val');
		const hudTimeVal = document.getElementById('hud-time-val');
		const hudTokensVal = document.getElementById('hud-tokens-val');
		const hudOpsVal = document.getElementById('hud-ops-val');

		const browserUrl = document.getElementById('browser-url-text');
		const viewportTitle = document.getElementById('viewport-title');
		const viewportBody = document.getElementById('viewport-body');
		const viewportSelector = document.getElementById('viewport-selector');
		const viewportBox = document.getElementById('viewport-content-box');
		const virtualCursor = document.getElementById('virtual-cursor');

		const btnRun = document.getElementById('btn-run-mission');
		const btnPause = document.getElementById('btn-pause-mission');
		const btnResume = document.getElementById('btn-resume-mission');
		const btnCancel = document.getElementById('btn-cancel-mission');
		const btnReset = document.getElementById('btn-reset-mission');
		const resultInspector = document.getElementById('result-inspector');

		let timerInterval = null;

		simulator = new window.TabventoSimulator({
			lang: currentLang,
			isLiveUnlocked: isLiveUnlocked,
			selectedProvider: 'openai',
			onLog: (entry) => {
				const line = document.createElement('div');
				line.className = 'terminal-line';
				line.innerHTML = `
					<span class="terminal-time">${entry.timestamp}</span>
					<span class="terminal-tag tag-${entry.tag}">${entry.tag}</span>
					<span class="terminal-msg">${entry.message}</span>
				`;
				logView.appendChild(line);
				logView.scrollTop = logView.scrollHeight;
			},
			onStep: (step, total, stepData) => {
				hudStepVal.textContent = `${step}/${total}`;
				hudOpsVal.textContent = stepData.domOps;
				hudTokensVal.textContent = stepData.tokens;
			},
			onViewportUpdate: (stepData) => {
				if (stepData.url) {
					browserUrl.textContent = stepData.url;
				}
				if (stepData.viewport) {
					viewportTitle.textContent = stepData.viewport.heading || stepData.viewport.title;
					viewportBody.textContent = stepData.viewport.body;
					if (stepData.viewport.activeSelector) {
						viewportSelector.style.display = 'inline-flex';
						viewportSelector.textContent = stepData.viewport.activeSelector;
						viewportBox.classList.add('highlight-dom');
					} else {
						viewportSelector.style.display = 'none';
						viewportBox.classList.remove('highlight-dom');
					}
					if (stepData.viewport.cursor && virtualCursor) {
						virtualCursor.style.left = `${stepData.viewport.cursor.x}%`;
						virtualCursor.style.top = `${stepData.viewport.cursor.y}%`;
						if (stepData.viewport.cursor.clicking) {
							virtualCursor.classList.add('clicking');
							setTimeout(() => virtualCursor.classList.remove('clicking'), 400);
						}
					}
				}
			},
			onStatusChange: (state) => {
				hudStatus.className = `hud-status-pill ${state}`;
				if (state === 'running') {
					hudStatusText.textContent = t('hud.running');
					btnRun.style.display = 'none';
					btnPause.style.display = 'inline-flex';
					btnResume.style.display = 'none';
					btnCancel.style.display = 'inline-flex';
					btnReset.style.display = 'none';
					resultInspector.style.display = 'none';

					// Start HUD timer ticker
					clearInterval(timerInterval);
					const startTime = Date.now();
					timerInterval = setInterval(() => {
						hudTimeVal.textContent = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
					}, 100);
				} else if (state === 'paused') {
					hudStatusText.textContent = t('hud.paused');
					btnPause.style.display = 'none';
					btnResume.style.display = 'inline-flex';
					clearInterval(timerInterval);
				} else if (state === 'cancelled') {
					hudStatusText.textContent = t('hud.cancelled');
					btnPause.style.display = 'none';
					btnResume.style.display = 'none';
					btnCancel.style.display = 'none';
					btnReset.style.display = 'inline-flex';
					clearInterval(timerInterval);
				} else if (state === 'completed') {
					hudStatusText.textContent = t('hud.completed');
					btnPause.style.display = 'none';
					btnResume.style.display = 'none';
					btnCancel.style.display = 'none';
					btnReset.style.display = 'inline-flex';
					clearInterval(timerInterval);
				} else if (state === 'idle') {
					hudStatusText.textContent = t('hud.idle');
					btnRun.style.display = 'inline-flex';
					btnPause.style.display = 'none';
					btnResume.style.display = 'none';
					btnCancel.style.display = 'none';
					btnReset.style.display = 'none';
					clearInterval(timerInterval);
				}
			},
			onComplete: (result) => {
				currentResult = result;
				renderResultDossier(result);
				resultInspector.style.display = 'block';
			}
		});

		// Button listeners
		btnRun.addEventListener('click', () => {
			const promptText = document.getElementById('mission-prompt-input').value.trim();
			if (!promptText) {
				showToast(currentLang === 'es' ? 'Por favor escribe un objetivo de misión.' : 'Please enter a mission objective.', 'warning');
				return;
			}
			logView.innerHTML = '';
			simulator.start({
				prompt: promptText,
				mode: currentMode
			});
		});

		btnPause.addEventListener('click', () => simulator.pause());
		btnResume.addEventListener('click', () => simulator.resume());
		btnCancel.addEventListener('click', () => simulator.cancel());
		btnReset.addEventListener('click', () => {
			simulator.state = 'idle';
			simulator.onStatusChange('idle');
			hudStepVal.textContent = '0/4';
			hudTimeVal.textContent = '0.0s';
			hudTokensVal.textContent = '0';
			hudOpsVal.textContent = '0';
			logView.innerHTML = `
				<div class="terminal-line">
					<span class="terminal-time">00:00:00</span>
					<span class="terminal-tag tag-INIT">READY</span>
					<span class="terminal-msg">${currentLang === 'es' ? 'Simulador en espera. Haz clic en "Iniciar Misión".' : 'Simulator ready. Click "Start Mission" to run.'}</span>
				</div>
			`;
			resultInspector.style.display = 'none';
			browserUrl.textContent = 'https://tabvento.local/mission-sandbox';
			viewportTitle.textContent = currentLang === 'es' ? 'Sesión de automatización local' : 'Local automation session';
			viewportBody.textContent = currentLang === 'es' ? 'El motor Tabvento está listo para ejecutar misiones en bucle cerrado.' : 'Tabvento engine ready for isolated local browser automation.';
			viewportSelector.style.display = 'none';
		});
	}

	// Mode switch handling
	function initModeTabs() {
		const btnDemo = document.getElementById('mode-tab-demo');
		const btnLive = document.getElementById('mode-tab-live');
		const modeTip = document.getElementById('mode-meta-tip');

		btnDemo.addEventListener('click', () => {
			currentMode = 'demo';
			btnDemo.classList.add('active');
			btnLive.classList.remove('active', 'live-active');
			modeTip.textContent = t('sim.desc');
		});

		btnLive.addEventListener('click', () => {
			if (!isLiveUnlocked) {
				showToast(t('sim.liveLockedTip'), 'info');
				// Scroll gently to solana gate section
				const gateEl = document.getElementById('solana-gate-section');
				if (gateEl) {
					gateEl.scrollIntoView({ behavior: 'smooth' });
				}
				return;
			}
			currentMode = 'live';
			btnLive.classList.add('active', 'live-active');
			btnDemo.classList.remove('active');
			modeTip.textContent = t('sim.liveUnlocked');
		});
	}

	// Result Dossier Rendering
	function renderResultDossier(result) {
		const summaryBox = document.getElementById('result-tab-summary-content');
		const jsonBox = document.getElementById('result-tab-json-content');
		const mdBox = document.getElementById('result-tab-md-content');

		// Summary HTML
		summaryBox.innerHTML = `
			<div style="display:flex; flex-direction:column; gap:12px;">
				<div style="font-weight:700; color:var(--lime); font-size:14px;">${result.summary}</div>
				<ul style="padding-left:18px; display:flex; flex-direction:column; gap:6px; color:var(--text-muted); font-size:13px;">
					${result.keyFindings.map(f => `<li>${f}</li>`).join('')}
				</ul>
				<div style="font-size:11px; color:var(--text-dim); margin-top:8px;">
					<strong>Security Boundary:</strong> ${result.securityNotice}
				</div>
			</div>
		`;

		// JSON Text
		jsonBox.textContent = JSON.stringify(result, null, 2);

		// Markdown Text
		const mdText = `# Tabvento Mission Dossier: ${result.missionId}
- **Timestamp:** ${result.timestamp}
- **Mode:** ${result.mode}
- **Target URL:** ${result.targetUrl}
- **Provider:** ${result.provider}

## Executive Summary
${result.summary}

## Key Verification Findings
${result.keyFindings.map(f => `- ${f}`).join('\n')}

## Extracted Metadata
\`\`\`json
${JSON.stringify(result.structuredData, null, 2)}
\`\`\`

> ${result.securityNotice}
`;
		mdBox.textContent = mdText;
	}

	// Result Inspector Tab Switching
	function initResultTabs() {
		const tabs = document.querySelectorAll('.result-tab-btn');
		const panels = {
			summary: document.getElementById('result-tab-summary-content'),
			json: document.getElementById('result-tab-json-content'),
			md: document.getElementById('result-tab-md-content')
		};

		tabs.forEach(tab => {
			tab.addEventListener('click', () => {
				tabs.forEach(t => t.classList.remove('active'));
				tab.classList.add('active');
				const view = tab.getAttribute('data-tab');
				Object.keys(panels).forEach(k => {
					if (panels[k]) {
						panels[k].style.display = k === view ? 'block' : 'none';
					}
				});
			});
		});

		// Copy result button
		document.getElementById('btn-copy-result').addEventListener('click', () => {
			if (!currentResult) return;
			copyText(JSON.stringify(currentResult, null, 2), currentLang === 'es' ? '¡Resultado copiado!' : 'Result JSON copied!');
		});

		// Download MD
		document.getElementById('btn-download-md').addEventListener('click', () => {
			if (!currentResult) return;
			const mdContent = document.getElementById('result-tab-md-content').textContent;
			const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `tabvento-mission-${currentResult.missionId}.md`;
			link.click();
			URL.revokeObjectURL(url);
			showToast(currentLang === 'es' ? 'Descargando Markdown...' : 'Downloading Markdown...', 'success');
		});

		// Download JSON
		document.getElementById('btn-download-json').addEventListener('click', () => {
			if (!currentResult) return;
			const blob = new Blob([JSON.stringify(currentResult, null, 2)], { type: 'application/json;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `tabvento-mission-${currentResult.missionId}.json`;
			link.click();
			URL.revokeObjectURL(url);
			showToast(currentLang === 'es' ? 'Descargando JSON...' : 'Downloading JSON...', 'success');
		});
	}

	// 24-Mission Library
	function renderLibraryCards() {
		const container = document.getElementById('examples-grid-container');
		if (!container || !window.TABVENTO_EXAMPLES) return;

		const q = searchQuery.toLowerCase().trim();
		const filtered = window.TABVENTO_EXAMPLES.filter(ex => {
			const matchesCategory = activeCategory === 'all' || ex.category === activeCategory;
			if (!matchesCategory) return false;
			if (!q) return true;

			const title = (ex.title[currentLang] || ex.title.en).toLowerCase();
			const desc = (ex.description[currentLang] || ex.description.en).toLowerCase();
			const prompt = (ex.prompt[currentLang] || ex.prompt.en).toLowerCase();
			const tags = ex.tags.join(' ').toLowerCase();
			const url = (ex.targetUrl || '').toLowerCase();

			return title.includes(q) || desc.includes(q) || prompt.includes(q) || tags.includes(q) || url.includes(q);
		});

		container.innerHTML = '';

		if (filtered.length === 0) {
			container.innerHTML = `
				<div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--text-muted); background: var(--panel); border: 1px dashed var(--border); border-radius: var(--radius-lg);">
					<p>${currentLang === 'es' ? 'No se encontraron misiones que coincidan con la búsqueda.' : 'No missions match your current search query.'}</p>
				</div>
			`;
			return;
		}

		filtered.forEach(ex => {
			const card = document.createElement('div');
			card.className = 'example-card';
			
			const title = ex.title[currentLang] || ex.title.en;
			const desc = ex.description[currentLang] || ex.description.en;
			const prompt = ex.prompt[currentLang] || ex.prompt.en;
			const modeLabel = ex.mode === 'live' 
				? (currentLang === 'es' ? 'Idea Modo Real' : 'Live Idea') 
				: (currentLang === 'es' ? 'Ejercicio Demo' : 'Demo Exercise');

			card.innerHTML = `
				<div class="example-card-top">
					<div class="example-meta-row">
						<span class="example-num-badge">#${String(ex.id).padStart(2, '0')}</span>
						<span class="mode-badge ${ex.mode}">${modeLabel}</span>
					</div>
					<h3 class="example-title">${title}</h3>
					<p class="example-desc">${desc}</p>
					<div class="example-prompt-quote">"${prompt}"</div>
				</div>
				<div class="example-card-bottom">
					<span class="example-category-tag">${ex.category}</span>
					<button class="btn btn-sm btn-secondary btn-fill-composer" data-id="${ex.id}">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="9 11 12 14 22 4"></polyline>
							<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
						</svg>
						<span>${t('lib.fillComposer')}</span>
					</button>
				</div>
			`;

			// Attach fill click
			card.querySelector('.btn-fill-composer').addEventListener('click', () => {
				populateComposerWithExample(ex);
			});

			container.appendChild(card);
		});
	}

	function populateComposerWithExample(ex) {
		const promptInput = document.getElementById('mission-prompt-input');
		const prompt = ex.prompt[currentLang] || ex.prompt.en;
		promptInput.value = prompt;

		// Select in preset dropdown as well
		const select = document.getElementById('preset-selector');
		if (select) {
			select.value = String(ex.id);
		}

		// Scroll to simulator smoothly
		const simSection = document.getElementById('mission-runner-section');
		if (simSection) {
			simSection.scrollIntoView({ behavior: 'smooth' });
			// Pulse composer card
			const composerCard = document.querySelector('.composer-card');
			if (composerCard) {
				composerCard.style.outline = '2px solid var(--lime)';
				composerCard.style.boxShadow = '0 0 30px var(--lime-glow)';
				setTimeout(() => {
					composerCard.style.outline = 'none';
					composerCard.style.boxShadow = 'none';
				}, 1200);
			}
		}

		showToast(currentLang === 'es' ? `Misión #${ex.id} cargada al editor.` : `Mission #${ex.id} loaded into composer.`, 'info');
	}

	function updatePresetDropdown() {
		const select = document.getElementById('preset-selector');
		if (!select || !window.TABVENTO_EXAMPLES) return;
		const currentVal = select.value;

		select.innerHTML = `<option value="">${t('sim.presetDefault')}</option>`;
		window.TABVENTO_EXAMPLES.forEach(ex => {
			const opt = document.createElement('option');
			opt.value = String(ex.id);
			opt.textContent = `#${ex.id}: ${ex.title[currentLang] || ex.title.en}`;
			select.appendChild(opt);
		});

		if (currentVal) {
			select.value = currentVal;
		}
	}

	function initLibraryControls() {
		// Category pills
		const pills = document.querySelectorAll('.category-pill');
		pills.forEach(pill => {
			pill.addEventListener('click', () => {
				pills.forEach(p => p.classList.remove('active'));
				pill.classList.add('active');
				activeCategory = pill.getAttribute('data-cat');
				renderLibraryCards();
			});
		});

		// Search input
		const searchInput = document.getElementById('library-search-input');
		if (searchInput) {
			searchInput.addEventListener('input', (e) => {
				searchQuery = e.target.value;
				renderLibraryCards();
			});
		}

		// Preset dropdown change
		const select = document.getElementById('preset-selector');
		if (select) {
			select.addEventListener('change', (e) => {
				const id = Number(e.target.value);
				if (!id) return;
				const found = window.TABVENTO_EXAMPLES.find(item => item.id === id);
				if (found) {
					populateComposerWithExample(found);
				}
			});
		}
	}

	// Solana Gate Simulator
	function initSolanaGate() {
		const walletAddrText = document.getElementById('solana-wallet-address');
		const btnCopyWallet = document.getElementById('btn-copy-solana-wallet');
		const btnSolanaPay = document.getElementById('btn-open-solana-pay');
		const sigInput = document.getElementById('solana-sig-input');
		const btnDemoSig = document.getElementById('btn-use-demo-sig');
		const btnVerify = document.getElementById('btn-verify-sig');
		const btnRelock = document.getElementById('btn-relock-gate');
		const gateStatusBox = document.getElementById('gate-verifier-status-box');
		const navGateBadge = document.getElementById('nav-gate-badge');

		if (walletAddrText) {
			walletAddrText.textContent = SOLANA_WALLET;
		}

		if (btnCopyWallet) {
			btnCopyWallet.addEventListener('click', () => {
				copyText(SOLANA_WALLET, currentLang === 'es' ? '¡Cartera Solana copiada!' : 'Solana wallet copied!');
			});
		}

		if (btnSolanaPay) {
			btnSolanaPay.addEventListener('click', () => {
				const uri = `solana:${SOLANA_WALLET}?label=Tabvento&memo=${DEMO_DEVICE_CODE}`;
				copyText(uri, currentLang === 'es' ? '¡Enlace Solana Pay copiado!' : 'Solana Pay URI copied!');
			});
		}

		if (btnDemoSig) {
			btnDemoSig.addEventListener('click', () => {
				sigInput.value = '5KjPzQe17q8T9aVw2Lm3XyZ4bN6rF7hJ8kC9uD1sE3wR4tY5uI6oP7aS8dF9gH0j';
			});
		}

		if (btnVerify) {
			btnVerify.addEventListener('click', () => {
				const sig = sigInput.value.trim();
				if (!sig || sig.length < 32) {
					showToast(currentLang === 'es' ? 'Introduce una firma de transacción válida.' : 'Enter a valid transaction signature.', 'warning');
					return;
				}

				btnVerify.disabled = true;
				gateStatusBox.innerHTML = `
					<div style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted); display:flex; flex-direction:column; gap:4px;">
						<div>[1/3] Connecting to Solana RPC (mainnet-beta)...</div>
					</div>
				`;

				setTimeout(() => {
					gateStatusBox.innerHTML += `
						<div style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">
							<div>[2/3] Querying getTransaction(${sig.slice(0, 16)}...)...</div>
							<div>[2/3] Checking recipient: ${SOLANA_WALLET.slice(0, 8)}... Match!</div>
						</div>
					`;
				}, 600);

				setTimeout(() => {
					isLiveUnlocked = true;
					if (simulator) simulator.setLiveUnlocked(true);

					gateStatusBox.innerHTML = `
						<div style="background:rgba(20, 241, 149, 0.1); border:1px solid var(--solana-mint); border-radius:var(--radius-sm); padding:12px; display:flex; flex-direction:column; gap:4px;">
							<div style="color:var(--solana-mint); font-weight:700; font-size:13px; display:flex; align-items:center; gap:6px;">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
								<span>${t('gate.statusVerified')}</span>
							</div>
							<div style="font-size:12px; font-family:var(--font-mono); color:#dbe4d2;">
								Transfer: 0.65 SOL ($114.40 USD >= $88 USD min) • Memo: ${DEMO_DEVICE_CODE} • Confirmed.
							</div>
						</div>
					`;

					btnVerify.disabled = false;
					btnRelock.style.display = 'inline-flex';
					if (navGateBadge) {
						navGateBadge.style.display = 'inline-flex';
					}

					// Enable live mode tab in composer
					const liveTab = document.getElementById('mode-tab-live');
					if (liveTab) {
						liveTab.title = 'Live Browser Mode Unlocked!';
					}

					showToast(currentLang === 'es' ? '¡Puerta Solana activada! Modo Navegador Real desbloqueado.' : 'Solana Gate Verified! Live Browser Mode unlocked.', 'success');
				}, 1400);
			});
		}

		if (btnRelock) {
			btnRelock.addEventListener('click', () => {
				isLiveUnlocked = false;
				if (simulator) simulator.setLiveUnlocked(false);
				currentMode = 'demo';
				document.getElementById('mode-tab-demo').classList.add('active');
				document.getElementById('mode-tab-live').classList.remove('active', 'live-active');
				btnRelock.style.display = 'none';
				if (navGateBadge) navGateBadge.style.display = 'none';

				gateStatusBox.innerHTML = `
					<div style="color:var(--text-dim); font-size:12px;">
						${t('gate.statusUnverified')}
					</div>
				`;
				showToast(currentLang === 'es' ? 'Modo real bloqueado nuevamente.' : 'Live mode re-locked.', 'info');
			});
		}
	}

	// Architecture Tour Inspector
	const ARCH_SPECS = {
		dashboard: {
			title: { en: 'User Dashboard (Web UI)', es: 'Panel de Usuario (Web UI)' },
			detail: {
				en: 'Runs locally on loopback (127.0.0.1). Zero external assets or trackers. Coordinates mission composer, multi-tab timelines, logs, and token performance HUD.',
				es: 'Se ejecuta localmente en bucle cerrado (127.0.0.1). Cero dependencias externas o rastreadores. Coordina el editor de misiones, línea de tiempo multi-pestaña y consola.'
			},
			security: {
				en: 'Never transmits user prompts, passwords, or cookies to remote cloud proxies.',
				es: 'Nunca transmite prompts, contraseñas ni cookies a proxys remotos.'
			},
			codeRef: 'tabvento/web/index.html & app.js'
		},
		loopback: {
			title: { en: 'Loopback Server (Port 8765)', es: 'Servidor en Bucle Local (Puerto 8765)' },
			detail: {
				en: 'Lightweight native HTTP server with REST endpoints. Manages concurrency limits (maximum 3 parallel missions), admission control, and clean thread cancellation.',
				es: 'Servidor HTTP nativo y ligero con endpoints REST. Gestiona el límite de concurrencia (máximo 3 misiones simultáneas) y cancelación limpia de hilos.'
			},
			security: {
				en: 'Binds strictly to 127.0.0.1. Rejects external network interfaces for zero attack surface.',
				es: 'Enlaza estrictamente a 127.0.0.1. Rechaza interfaces de red externas para cero superficie de ataque.'
			},
			codeRef: 'tabvento/server.py'
		},
		sqlite: {
			title: { en: 'Thread-Safe SQLite Store', es: 'Almacén SQLite Aislado por Hilos' },
			detail: {
				en: 'Persists mission briefs, timestamps, token usage, logs, and outputs in a single local database file. Zero external database servers required.',
				es: 'Persiste objetivos de misiones, marcas de tiempo, tokens y resultados en un archivo de base de datos local único. Cero servidores externos requeridos.'
			},
			security: {
				en: 'Local file persistence. Secrets and API keys are strictly redacted prior to persistence.',
				es: 'Persistencia local en archivo. Los secretos y claves API se filtran y ocultan antes de guardarse.'
			},
			codeRef: 'tabvento/store.py'
		},
		solana: {
			title: { en: 'Solana Gate Keeper', es: 'Guardián de Puerta Solana' },
			detail: {
				en: 'Verifies on-chain contribution (minimum $88 USD in SOL/USDC to wallet 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm) to unlock Live Browser Mode.',
				es: 'Verifica la contribución on-chain (mínimo $88 USD en SOL/USDC a cartera 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm) para desbloquear el Modo Real.'
			},
			security: {
				en: 'Cryptographic transaction signature verification against official Solana RPC.',
				es: 'Verificación criptográfica de firma de transacción contra RPC oficial de Solana.'
			},
			codeRef: 'tabvento/solana_gate.py'
		},
		engine: {
			title: { en: 'Browser Automation Engine', es: 'Motor de Automatización de Navegador' },
			detail: {
				en: 'Orchestrates multi-step agent loops, DOM tree parsing, element bounding box calculation, and direct LLM vision integration.',
				es: 'Orquesta el bucle de agente de múltiples pasos, análisis del árbol DOM, cálculo de coordenadas de elementos e integración de visión LLM.'
			},
			security: {
				en: 'Deterministic circuit breaker halts runaway loops. Safe read-only defaults prevent destructive form actions.',
				es: 'Interruptor automático detiene bucles infinitos. Modos seguros de solo lectura impiden acciones destructivas.'
			},
			codeRef: 'browser_use/agent/service.py'
		},
		chromium: {
			title: { en: 'Local Chromium Instance', es: 'Instancia Local de Chromium' },
			detail: {
				en: 'Communicates via Chrome DevTools Protocol (CDP). Runs headless or visible in the user\'s local desktop environment.',
				es: 'Se comunica mediante Chrome DevTools Protocol (CDP). Se ejecuta en modo headless o visible en el escritorio local del usuario.'
			},
			security: {
				en: 'Runs with the local user permissions. Temporary browser profiles are wiped upon mission completion.',
				es: 'Se ejecuta con los permisos del usuario local. Los perfiles temporales se limpian al finalizar la misión.'
			},
			codeRef: 'tabvento/runner.py'
		}
	};

	function renderArchInspector() {
		const box = document.getElementById('arch-inspector-box');
		if (!box) return;

		const spec = ARCH_SPECS[activeArchNode] || ARCH_SPECS.loopback;
		box.innerHTML = `
			<div style="display:flex; flex-direction:column; gap:8px;">
				<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
					<h4 style="font-size:16px; color:var(--lime);">${spec.title[currentLang] || spec.title.en}</h4>
					<span style="font-family:var(--font-mono); font-size:11px; color:var(--text-dim); background:var(--raised); padding:2px 8px; border-radius:4px;">${spec.codeRef}</span>
				</div>
				<p style="font-size:13px; color:var(--text); line-height:1.5;">${spec.detail[currentLang] || spec.detail.en}</p>
				<div style="font-size:12px; color:var(--solana-mint); background:rgba(20,241,149,0.06); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid rgba(20,241,149,0.2);">
					<strong>${currentLang === 'es' ? 'Límite de Seguridad:' : 'Security Boundary:'}</strong> ${spec.security[currentLang] || spec.security.en}
				</div>
			</div>
		`;
	}

	function initArchDiagram() {
		const nodes = document.querySelectorAll('.arch-node');
		nodes.forEach(node => {
			node.addEventListener('click', () => {
				nodes.forEach(n => n.classList.remove('active'));
				node.classList.add('active');
				activeArchNode = node.getAttribute('data-node');
				renderArchInspector();
			});
		});
		renderArchInspector();
	}

	// Model Providers Switcher
	function initModelProviders() {
		const cards = document.querySelectorAll('.provider-card');
		cards.forEach(card => {
			card.addEventListener('click', () => {
				cards.forEach(c => c.classList.remove('active'));
				card.classList.add('active');
				const provider = card.getAttribute('data-provider');
				if (simulator) {
					simulator.setProvider(provider);
				}
				showToast(currentLang === 'es' ? `Proveedor seleccionado: ${provider}` : `Selected provider: ${provider}`, 'info');
			});
		});
	}

	// CLI Copy Buttons
	function initCliBoxes() {
		document.querySelectorAll('.cli-copy-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				const cmd = btn.getAttribute('data-cmd') || 'uv run tabvento';
				copyText(cmd, currentLang === 'es' ? '¡Comando CLI copiado!' : 'CLI command copied!');
			});
		});
	}

	// Language Toggle Listeners
	function initLanguageToggle() {
		document.querySelectorAll('.lang-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				const lang = btn.getAttribute('data-lang');
				setLanguage(lang);
			});
		});

		// Check saved lang or default to en
		try {
			const saved = localStorage.getItem('tabvento_lang');
			if (saved === 'es' || saved === 'en') {
				currentLang = saved;
			}
		} catch (e) {}
	}

	// Master DOM Ready Init
	document.addEventListener('DOMContentLoaded', () => {
		initLanguageToggle();
		initSimulator();
		initModeTabs();
		initResultTabs();
		initLibraryControls();
		initSolanaGate();
		initArchDiagram();
		initModelProviders();
		initCliBoxes();

		// Apply initial language & data
		applyTranslations();

		// Set initial prompt from Example 1
		if (window.TABVENTO_EXAMPLES && window.TABVENTO_EXAMPLES.length > 0) {
			const ex1 = window.TABVENTO_EXAMPLES[0];
			const input = document.getElementById('mission-prompt-input');
			if (input && !input.value) {
				input.value = ex1.prompt[currentLang] || ex1.prompt.en;
			}
		}
	});

})();
