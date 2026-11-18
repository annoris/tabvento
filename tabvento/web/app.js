'use strict';
const paths = {
	grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
	layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
	sliders: 'M4 7h16M4 17h16M9 4v6M15 14v6',
	book: 'M12 5v16M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Z',
	menu: 'M4 6h16M4 12h16M4 18h16',
	sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
	github:
		'M9 19c-4 1-4-2-6-2m12 5v-4c0-1-.2-2-1-2 4-.5 6-2 6-6 0-1.5-.5-3-1.5-4 0-1 .2-2-.5-3-2 0-3 1-3 1a12 12 0 0 0-6 0S7 3 5 3c-.7 1-.5 2-.5 3C3.5 7 3 8.5 3 10c0 4 2 5.5 6 6-.8.5-1 1-1 2v4',
	arrow: 'M5 12h14m-6-6 6 6-6 6',
	orbit: 'M21 12a9 9 0 1 1-9-9M12 8v4l3 3M17 3h4v4',
	shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
	code: 'm8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16',
	plus: 'M12 5v14M5 12h14',
	search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
	check: 'm5 12 4 4L19 6',
	close: 'm6 6 12 12M6 18 18 6',
};
const $ = (s) => document.querySelector(s);
function icon(name) {
	return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.orbit}"/></svg>`;
}
function replaceIcons(root = document) {
	root.querySelectorAll('[data-icon]').forEach((el) => {
		el.outerHTML = icon(el.dataset.icon);
	});
}
replaceIcons();
function langPreference(value) {
	try {
		if (value !== undefined) localStorage.setItem('tabvento.lang', value);
		return localStorage.getItem('tabvento.lang');
	} catch {
		return null;
	}
}
const state = {
	lang: langPreference() === 'es' ? 'es' : 'en',
	missions: [],
	selected: null,
	status: null,
	busy: false,
	polling: false,
	mutations: 0,
	revision: 0,
	connection: null,
	providers: [],
	connectionsLoaded: false,
	connectionBusy: false,
	serverState: 'connecting',
	lastCheckResult: null,
	lastToast: '',
};
const fallbackStatusLabels = {
	es: {
		queued: 'En espera',
		running: 'En marcha',
		completed: 'Completada',
		failed: 'Con errores',
		cancelled: 'Cancelada',
	},
	en: {
		queued: 'Queued',
		running: 'Running',
		completed: 'Completed',
		failed: 'Failed',
		cancelled: 'Cancelled',
	},
};
function interpolate(str, vars) {
	if (!vars || typeof str !== 'string') return str;
	return str.replace(/\{(\w+)\}/g, (m, k) =>
		vars[k] !== undefined ? String(vars[k]) : m,
	);
}
function tr(key, esFallback, enFallback, vars) {
	if (window.TABVENTO_I18N?.t) {
		const res = window.TABVENTO_I18N.t(key, state.lang, vars);
		if (res && res !== key) return res;
	}
	const base =
		state.lang === 'en'
			? (enFallback ?? esFallback ?? key)
			: (esFallback ?? key);
	return interpolate(base, vars);
}
function trPhrase(text) {
	if (text === null || text === undefined) return '';
	const raw = String(text);
	if (window.TABVENTO_I18N?.t) {
		return window.TABVENTO_I18N.t(raw, state.lang);
	}
	return raw;
}
function statusLabel(status) {
	if (window.TABVENTO_I18N?.statusLabels) {
		const map = window.TABVENTO_I18N.statusLabels(state.lang);
		if (map && map[status]) return map[status];
	}
	return (fallbackStatusLabels[state.lang] || fallbackStatusLabels.es)[status] || status;
}
function esc(value) {
	const el = document.createElement('span');
	el.textContent = String(value ?? '');
	return el.innerHTML.replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function date(value) {
	if (!value) return '';
	const d = new Date(value);
	return Number.isNaN(d.getTime())
		? ''
		: new Intl.DateTimeFormat(state.lang === 'en' ? 'en-US' : 'es', {
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit',
			}).format(d);
}
let toastTimer;
function toast(message) {
	state.lastToast = message;
	$('#toast').textContent = trPhrase(message);
	$('#toast').classList.add('visible');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4200);
}
async function api(path, options = {}) {
	const mutating = !!options.method && options.method !== 'GET';
	if (mutating) {
		state.mutations++;
		state.revision++;
	}
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);
	try {
		const response = await fetch('/api' + path, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': state.lang,
				...options.headers,
			},
			signal: controller.signal,
		});
		const data = await response.json();
		if (!response.ok)
			throw new Error(
				(data.error ? trPhrase(data.error) : '') ||
					tr(
						'error.requestFailed',
						'No se pudo completar la petición.',
						'Could not complete the request.',
					),
			);
		return data;
	} catch (error) {
		if (error.name === 'AbortError')
			throw new Error(
				tr(
					'error.timeout',
					'El servidor está tardando en responder. Inténtalo de nuevo.',
					'The server is taking too long to respond. Please try again.',
				),
			);
		if (error instanceof TypeError)
			throw new Error(
				tr(
					'error.offline',
					'No hay conexión con el servidor local. Comprueba que Tabvento sigue abierto.',
					'No connection to the local server. Make sure Tabvento is still running.',
				),
			);
		throw error;
	} finally {
		clearTimeout(timeout);
		if (mutating) {
			state.mutations--;
			state.revision++;
		}
	}
}
function currentView() {
	const view = location.hash.slice(1) || 'inicio';
	return ['inicio', 'misiones', 'conexiones', 'guia'].includes(view)
		? view
		: 'inicio';
}
function updateBreadcrumb(selected = currentView()) {
	const titleEl = $('#breadcrumb-title');
	if (!titleEl) return;
	titleEl.setAttribute('data-i18n', 'breadcrumb.' + selected);
	const titles = {
		inicio: tr('breadcrumb.inicio', 'Vista general', 'Overview'),
		misiones: tr('breadcrumb.misiones', 'Misiones', 'Missions'),
		conexiones: tr('breadcrumb.conexiones', 'Conexiones', 'Connections'),
		guia: tr('breadcrumb.guia', 'Guía de inicio', 'Getting started'),
	};
	titleEl.textContent = titles[selected];
}
const mobileNavigation = window.matchMedia('(max-width: 640px)');
function syncNavigation() {
	const sidebar = $('.sidebar');
	const open = sidebar.classList.contains('open');
	const hidden = mobileNavigation.matches && !open;
	if (hidden && sidebar.contains(document.activeElement)) $('#menu-toggle').focus();
	sidebar.toggleAttribute('inert', hidden);
	if (hidden) sidebar.setAttribute('aria-hidden', 'true');
	else sidebar.removeAttribute('aria-hidden');
	$('#menu-toggle').setAttribute('aria-expanded', String(open));
}
mobileNavigation.addEventListener('change', syncNavigation);
function closeNavigation() {
	$('.sidebar').classList.remove('open');
	syncNavigation();
}
function route() {
	const view = location.hash.slice(1) || 'inicio';
	if (view === 'main') {
		$('#main').focus();
		return;
	}
	const selected = currentView();
	document.querySelectorAll('.view').forEach((el) => {
		el.hidden = el.id !== 'view-' + selected;
	});
	document.querySelectorAll('[data-view]').forEach((el) => {
		el.classList.toggle('active', el.dataset.view === selected);
		if (el.dataset.view === selected) el.setAttribute('aria-current', 'page');
		else el.removeAttribute('aria-current');
	});
	updateBreadcrumb(selected);
	closeNavigation();
	if (selected === 'misiones') renderHistory();
	window.scrollTo({ top: 0, behavior: 'instant' });
}
window.addEventListener('hashchange', route);
route();
$('#menu-toggle').addEventListener('click', () => {
	$('.sidebar').classList.toggle('open');
	syncNavigation();
});
document.addEventListener('click', (e) => {
	if (
		$('.sidebar').classList.contains('open') &&
		!e.target.closest('.sidebar') &&
		!e.target.closest('#menu-toggle')
	) {
		closeNavigation();
	}
});
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && $('.sidebar').classList.contains('open')) closeNavigation();
});
function motionPreference(value) {
	try {
		if (value !== undefined) localStorage.setItem('tabvento.motion', value);
		return localStorage.getItem('tabvento.motion');
	} catch {
		return null;
	}
}
const motionOff = motionPreference() === 'off';
function setMotion(paused) {
	document.body.classList.toggle('motion-paused', paused);
	$('#motion-toggle').setAttribute('aria-pressed', String(paused));
	$('#motion-toggle').setAttribute(
		'aria-label',
		paused
			? tr('motion.resume', 'Activar animaciones', 'Resume animations')
			: tr('motion.pause', 'Pausar animaciones', 'Pause animations'),
	);
	motionPreference(paused ? 'off' : 'on');
}
setMotion(motionOff);
$('#motion-toggle').addEventListener('click', () =>
	setMotion(!document.body.classList.contains('motion-paused')),
);
function focusComposer() {
	if (location.hash !== '#inicio') location.hash = 'inicio';
	requestAnimationFrame(() => {
		$('#task-input').focus();
		$('#mission-form').scrollIntoView({
			behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'instant'
				: 'smooth',
			block: 'center',
		});
	});
}
$('#hero-new').addEventListener('click', focusComposer);
document.querySelectorAll('[data-prompt]').forEach((button) =>
	button.addEventListener('click', () => {
		$('#task-input').value = button.dataset.prompt;
		focusComposer();
	}),
);
function updateMode() {
	const live = $('#mode-select').value === 'live';
	$('#mode-hint').setAttribute(
		'data-i18n',
		live ? 'composer.hintLive' : 'composer.hintDemo',
	);
	$('#mode-hint').textContent = live
		? tr(
				'composer.hintLive',
				'Usa tu modelo y un navegador local. Puede tener coste.',
				'Uses your model and a local browser. May incur costs.',
			)
		: tr(
				'composer.hintDemo',
				'Explora el recorrido sin usar claves ni IA.',
				'Explore the workflow without keys or AI.',
			);
	$('#submit-mission').setAttribute(
		'data-i18n',
		live ? 'composer.submitLive' : 'composer.submitDemo',
	);
	const submitLabel = live
		? tr('composer.submitLive', 'Iniciar misión', 'Start mission')
		: tr('composer.submitDemo', 'Iniciar demo', 'Start demo');
	$('#submit-mission').innerHTML = esc(submitLabel) + ' ' + icon('arrow');
}
$('#mode-select').addEventListener('change', updateMode);
async function startMission(task, mode) {
	if (state.busy) return;
	state.busy = true;
	$('#submit-mission').disabled = true;
	$('#hero-demo').disabled = true;
	try {
		if (mode === 'live' && !state.connection?.model) {
			location.hash = 'conexiones';
			route();
			requestAnimationFrame(() => $('#model-input').focus());
			throw new Error(
				tr(
					'error.modelRequired',
					'Guarda el identificador de tu modelo antes de iniciar una misión real.',
					'Save your model identifier before starting a live mission.',
				),
			);
		}
		const { mission } = await api('/missions', {
			method: 'POST',
			body: JSON.stringify({ task, mode }),
		});
		state.missions.unshift(mission);
		renderMissions();
		openDetail(mission.id);
		toast(
			mode === 'demo'
				? tr(
						'toast.demoStarted',
						'Demo iniciada. Este recorrido es simulado.',
						'Demo started. This journey is simulated.',
					)
				: tr(
						'toast.liveStarted',
						'Misión iniciada en el navegador local.',
						'Mission started in the local browser.',
					),
		);
	} catch (error) {
		if (
			mode === 'live' &&
			typeof error?.message === 'string' &&
			error.message.includes('3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm')
		) {
			location.hash = 'conexiones';
			route();
			requestAnimationFrame(() => {
				$('#solana-signature-input')?.focus();
				$('#solana-contribution-card')?.scrollIntoView({
					behavior: 'instant',
					block: 'center',
				});
			});
		}
		toast(error.message);
	} finally {
		state.busy = false;
		$('#submit-mission').disabled = false;
		$('#hero-demo').disabled = false;
	}
}
$('#mission-form').addEventListener('submit', (e) => {
	e.preventDefault();
	const task = $('#task-input').value.trim();
	if (!task) {
		$('#task-input').focus();
		return;
	}
	startMission(task, $('#mode-select').value);
});
$('#hero-demo').addEventListener('click', () =>
	startMission(
		tr(
			'hero.demoPrompt',
			'Comparar tres herramientas para organizar un proyecto creativo',
			'Compare three tools for organizing a creative project',
		),
		'demo',
	),
);
function emptyMarkup(filtered = false) {
	const title = filtered
		? tr(
				'empty.filteredTitle',
				'Ninguna misión coincide.',
				'No matching missions.',
			)
		: tr(
				'empty.defaultTitle',
				'Aquí empieza tu próximo recorrido.',
				'Your next journey starts here.',
			);
	const body = filtered
		? tr(
				'empty.filteredBody',
				'Prueba otra búsqueda o cambia el filtro.',
				'Try another search or change the filter.',
			)
		: tr(
				'empty.defaultBody',
				'Crea una misión y guarda tus ideas en movimiento.',
				'Create a mission and keep your ideas in motion.',
			);
	const action = filtered
		? ''
		: `<a href="#inicio" class="inline-link" data-new-mission>${esc(tr('empty.defaultAction', 'Crear mi primera misión ↗', 'Create my first mission ↗'))}</a>`;
	return `<div class="empty-state"><div class="empty-symbol">${icon('layers')}</div><div><strong>${esc(title)}</strong><p>${esc(body)}</p></div>${action}</div>`;
}
function rowsMarkup(missions) {
	const demoText = tr('mode.demo', 'Demo simulada', 'Simulated demo');
	const liveText = tr('mode.live', 'Navegador real', 'Live browser');
	return (
		'<div class="mission-list">' +
		missions
			.map(
				(m) =>
					`<button class="mission-row" data-mission="${esc(m.id)}"><span class="mission-symbol">${icon(m.status === 'completed' ? 'check' : 'orbit')}</span><span class="mission-info"><strong>${esc(m.task)}</strong><small>${esc(m.mode === 'demo' ? demoText : liveText)} · ${esc(date(m.created_at))}</small></span><span class="status-pill ${esc(m.status)}">${esc(statusLabel(m.status))}</span><span class="row-arrow">↗</span></button>`,
			)
			.join('') +
		'</div>'
	);
}
function renderMissions() {
	$('#mission-count').textContent = state.missions.length;
	$('#recent-missions').innerHTML = state.missions.length
		? rowsMarkup(state.missions.slice(0, 3))
		: emptyMarkup();
	renderHistory();
}
function renderHistory() {
	const query = $('#history-search').value.trim().toLowerCase();
	const filter = $('#history-filter').value;
	const missions = state.missions.filter(
		(m) =>
			m.task.toLowerCase().includes(query) &&
			(filter === 'all' ||
				(filter === 'running'
					? ['running', 'queued'].includes(m.status)
					: m.status === filter)),
	);
	$('#all-missions').innerHTML = missions.length
		? rowsMarkup(missions)
		: emptyMarkup(!!query || filter !== 'all');
}
$('#history-search').addEventListener('input', renderHistory);
$('#history-filter').addEventListener('change', renderHistory);
document.addEventListener('click', (e) => {
	const row = e.target.closest('[data-mission]');
	if (row) openDetail(row.dataset.mission);
	if (e.target.closest('[data-new-mission]')) focusComposer();
});
let deleteArmed = false;
function openDetail(id) {
	if (state.selected !== id) {
		deleteArmed = false;
		$('#delete-mission').textContent = tr(
			'detail.delete',
			'Eliminar del historial',
			'Remove from history',
		);
	}
	state.selected = id;
	renderDetail();
	if (!$('#mission-dialog').open) $('#mission-dialog').showModal();
}
function selectedMission() {
	return state.missions.find((m) => m.id === state.selected);
}
function renderDetail() {
	const m = selectedMission();
	if (!m) return;
	$('#detail-mode').textContent =
		m.mode === 'demo'
			? tr(
					'detail.modeDemo',
					'DEMO SIMULADA / SIN NAVEGACIÓN REAL',
					'SIMULATED DEMO / NO LIVE BROWSING',
				)
			: tr(
					'detail.modeLive',
					'MISIÓN / NAVEGADOR LOCAL',
					'MISSION / LOCAL BROWSER',
				);
	$('#detail-title').textContent = m.task;
	$('#detail-meta').className = 'detail-meta';
	$('#detail-meta').innerHTML =
		`<span class="status-pill ${esc(m.status)}">${esc(statusLabel(m.status))}</span><span>${esc(date(m.created_at))}</span>`;
	const steps = m.steps || [];
	$('#detail-steps').innerHTML = steps.length
		? steps
				.map(
					(s, i) =>
						`<div class="timeline-step"><span class="timeline-dot">${i + 1}</span><div><strong>${esc(trPhrase(s.label))}</strong><small>${esc(date(s.at))}</small></div></div>`,
				)
				.join('')
		: `<p class="field-hint">${esc(tr('detail.preparing', 'Preparando el recorrido…', 'Preparing the journey…'))}</p>`;
	const result = resultText(m);
	$('#detail-result').hidden = !result;
	$('#detail-result').classList.toggle('error', !!m.error);
	$('#detail-result').textContent =
		typeof result === 'object' ? JSON.stringify(result, null, 2) : result || '';
	const active = ['running', 'queued'].includes(m.status);
	$('#cancel-mission').hidden = !active;
	$('#delete-mission').hidden = active;
	$('#delete-mission').textContent = deleteArmed
		? tr('detail.confirmDelete', 'Confirmar eliminación', 'Confirm deletion')
		: tr('detail.delete', 'Eliminar del historial', 'Remove from history');
	$('#copy-result').hidden = !result;
	$('#download-result').hidden = !result;
}
$('#close-detail').addEventListener('click', () =>
	$('#mission-dialog').close(),
);
$('#mission-dialog').addEventListener('click', (e) => {
	if (e.target === $('#mission-dialog')) {
		const r = e.target.getBoundingClientRect();
		if (
			e.clientX < r.left ||
			e.clientX > r.right ||
			e.clientY < r.top ||
			e.clientY > r.bottom
		)
			e.target.close();
	}
});
$('#cancel-mission').addEventListener('click', async () => {
	const m = selectedMission();
	if (!m) return;
	$('#cancel-mission').disabled = true;
	try {
		const { mission } = await api(
			'/missions/' + encodeURIComponent(m.id) + '/cancel',
			{ method: 'POST', body: '{}' },
		);
		state.missions = state.missions.map((x) => (x.id === m.id ? mission : x));
		renderMissions();
		renderDetail();
		toast(
			tr(
				'toast.cancelRequested',
				'Cancelación solicitada. Las acciones ya realizadas no se deshacen.',
				'Cancellation requested. Actions already performed cannot be undone.',
			),
		);
	} catch (e) {
		toast(e.message);
	} finally {
		$('#cancel-mission').disabled = false;
	}
});
$('#mission-dialog').addEventListener('close', () => {
	state.selected = null;
	deleteArmed = false;
	$('#delete-mission').textContent = tr(
		'detail.delete',
		'Eliminar del historial',
		'Remove from history',
	);
});
$('#delete-mission').addEventListener('click', async () => {
	if (!deleteArmed) {
		deleteArmed = true;
		$('#delete-mission').textContent = tr(
			'detail.confirmDelete',
			'Confirmar eliminación',
			'Confirm deletion',
		);
		return;
	}
	const m = selectedMission();
	if (!m) return;
	$('#delete-mission').disabled = true;
	try {
		await api('/missions/' + encodeURIComponent(m.id), { method: 'DELETE' });
		state.missions = state.missions.filter((x) => x.id !== m.id);
		if (state.selected === m.id) $('#mission-dialog').close();
		renderMissions();
		toast(
			tr(
				'toast.missionDeleted',
				'Misión eliminada del historial.',
				'Mission removed from history.',
			),
		);
	} catch (e) {
		toast(e.message);
	} finally {
		$('#delete-mission').disabled = false;
	}
});
function resultText(m = selectedMission()) {
	const result = m?.result;
	const rawText =
		typeof result === 'object' && result !== null
			? JSON.stringify(result, null, 2)
			: String(result ?? '');
	const text = rawText ? trPhrase(rawText) : '';
	const err = m?.error ? trPhrase(m.error) : '';
	return err
		? text
			? tr('detail.partialResult', 'Resultado parcial:', 'Partial result:') +
				'\n' +
				text +
				'\n\n' +
				tr('detail.errorLabel', 'Error:', 'Error:') +
				'\n' +
				err
			: err
		: text;
}
$('#copy-result').addEventListener('click', async () => {
	try {
		await navigator.clipboard.writeText(resultText());
		toast(tr('toast.resultCopied', 'Resultado copiado.', 'Result copied.'));
	} catch {
		toast(
			tr(
				'toast.copyFailed',
				'No se pudo copiar. Puedes seleccionar el texto del resultado.',
				'Could not copy. You can select the result text manually.',
			),
		);
	}
});
$('#download-result').addEventListener('click', () => {
	const m = selectedMission();
	if (!m) return;
	const modeLabel =
		m.mode === 'demo'
			? tr('mode.demo', 'Demo simulada', 'Simulated demo')
			: tr('mode.liveDownload', 'Misión real', 'Live mission');
	const blob = new Blob(
		[`Tabvento · ${modeLabel}\n${m.task}\n\n${resultText()}`],
		{ type: 'text/plain;charset=utf-8' },
	);
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'tabvento-' + m.id + '.txt';
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
});
function providerLabel(p) {
	if (!p) return '';
	if (p.id === 'ollama' && p.label === 'Ollama local')
		return trPhrase('Ollama local');
	if (p.id === 'compatible' && p.label === 'API compatible con OpenAI')
		return trPhrase('API compatible con OpenAI');
	return trPhrase(p.label);
}
function updateProvider() {
	const id = $('#provider-select').value;
	const provider = state.providers.find((p) => p.id === id);
	const endpoint = ['ollama', 'compatible'].includes(id);
	$('#base-url-field').hidden = !endpoint;
	$('#base-url-input').required = endpoint;
	if (!id && !state.providers.length) {
		$('#provider-hint').textContent = tr(
			'connections.providerHintDefault',
			'Las claves se configuran en .env o en el entorno del servidor; nunca en este formulario.',
			'Keys are configured in .env or the server environment; never in this form.',
		);
		return;
	}
	$('#provider-hint').textContent = provider?.requires_key
		? tr(
				'provider.hintKey',
				'Configura {env} en .env o en el entorno y reinicia el servidor. No pegues claves aquí.',
				'Set {env} in .env or the environment and restart the server. Do not paste keys here.',
				{ env: provider.key_env },
			)
		: id === 'ollama'
			? tr(
					'provider.hintOllama',
					'Ollama utiliza tu servicio local. Asegúrate de que está iniciado y el modelo descargado.',
					'Ollama uses your local service. Make sure it is running and the model is downloaded.',
				)
			: tr(
					'provider.hintCompatible',
					'La clave del endpoint, si la necesita, se configura en el entorno del servidor.',
					'The endpoint key, if required, is configured in the server environment.',
				);
}
$('#provider-select').addEventListener('change', updateProvider);
function renderProviderOptions(selectedId) {
	if (!state.providers.length) return;
	const current =
		selectedId !== undefined
			? selectedId
			: $('#provider-select').value ||
				state.connection?.provider ||
				state.providers[0]?.id ||
				'';
	$('#provider-select').innerHTML = state.providers
		.map(
			(p) =>
				'<option value="' +
				esc(p.id) +
				'">' +
				esc(providerLabel(p)) +
				'</option>',
		)
		.join('');
	$('#provider-select').disabled = false;
	$('#provider-select').value = current;
}
function fillConnectionForm() {
	const selected = state.connection?.provider || state.providers[0]?.id || '';
	if (state.providers.length) {
		renderProviderOptions(selected);
	} else {
		$('#provider-select').disabled = true;
	}
	$('#model-input').value = state.connection?.model || '';
	$('#base-url-input').value = state.connection?.base_url || '';
	updateProvider();
}
function renderConnectionCheck() {
	const result = state.lastCheckResult;
	if (!result) return;
	const footnote = tr(
		'connections.checkFootnote',
		'Revisión local de configuración. No verifica la autenticación, el saldo ni la disponibilidad del modelo en el proveedor.',
		'Local configuration check. Does not verify authentication, balance, or model availability with the provider.',
	);
	$('#connection-check').innerHTML =
		'<p class="field-hint">' +
		esc(trPhrase(result.message)) +
		'</p>' +
		result.checks
			.map(
				(check) =>
					'<div class="connection-row"><span>' +
					esc(trPhrase(check.label)) +
					'</span><small class="' +
					(check.ok ? 'ready' : '') +
					'">' +
					esc(trPhrase(check.detail)) +
					'</small></div>',
			)
			.join('') +
		'<p class="field-hint">' +
		esc(footnote) +
		'</p>';
}
function renderConnections() {
	const engine = state.status?.engine_available;
	const rows = [
		[
			tr(
				'connections.engineName',
				'Motor de automatización',
				'Automation engine',
			),
			engine
				? tr('connections.engineReady', 'Disponible', 'Available')
				: tr(
						'connections.engineMissing',
						'Instala las dependencias',
						'Install dependencies',
					),
			engine,
		],
		...state.providers.map((p) => [
			providerLabel(p),
			p.requires_key
				? p.credential_present
					? tr(
							'connections.keyPresent',
							'Clave detectada en el servidor',
							'Key detected on server',
						)
					: tr(
							'connections.keyMissing',
							'Sin clave en el servidor',
							'No key on server',
						)
				: tr(
						'connections.keyOptional',
						'Sin clave obligatoria',
						'No key required',
					),
			!p.requires_key || p.credential_present,
		]),
	];
	$('#connection-list').innerHTML = rows
		.map(
			([name, detail, ready]) =>
				'<div class="connection-row"><span>' +
				esc(name) +
				'</span><small class="' +
				(ready ? 'ready' : '') +
				'">' +
				(ready ? '●' : '○') +
				' ' +
				esc(detail) +
				'</small></div>',
		)
		.join('');
	if (state.connection) {
		const pObj = state.providers.find(
			(p) => p.id === state.connection.provider,
		);
		const pName = pObj
			? providerLabel(pObj)
			: trPhrase(state.connection.provider);
		$('#saved-connection').textContent = tr(
			'connections.savedItem',
			'Guardada en este equipo: {provider} · {model}',
			'Saved on this machine: {provider} · {model}',
			{ provider: pName, model: state.connection.model },
		);
	} else {
		$('#saved-connection').textContent = tr(
			'connections.noneSaved',
			'Todavía no hay una conexión guardada.',
			'No connection saved yet.',
		);
	}
	updateConnectionButtons();
}
function updateConnectionButtons() {
	$('#save-connection').disabled = state.connectionBusy;
	$('#check-connection').disabled = state.connectionBusy || !state.connection;
}
$('#settings-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	if (state.connectionBusy) return;
	const provider = $('#provider-select').value;
	const model = $('#model-input').value.trim();
	const base_url = $('#base-url-input').value.trim();
	if (!provider || !model) {
		toast(
			tr(
				'toast.selectProviderModel',
				'Elige un proveedor e introduce tu modelo.',
				'Choose a provider and enter your model.',
			),
		);
		return;
	}
	state.connectionBusy = true;
	updateConnectionButtons();
	try {
		const data = await api('/connections', {
			method: 'POST',
			body: JSON.stringify({
				provider,
				model,
				...(['ollama', 'compatible'].includes(provider) ? { base_url } : {}),
			}),
		});
		state.connection = data.connection;
		state.lastCheckResult = null;
		$('#connection-check').replaceChildren();
		renderConnections();
		toast(
			tr(
				'toast.connectionSaved',
				'Conexión guardada en este servidor local.',
				'Connection saved on this local server.',
			),
		);
	} catch (error) {
		toast(error.message);
	} finally {
		state.connectionBusy = false;
		updateConnectionButtons();
	}
});
$('#check-connection').addEventListener('click', async () => {
	if (state.connectionBusy || !state.connection) return;
	state.connectionBusy = true;
	updateConnectionButtons();
	state.lastCheckResult = null;
	$('#connection-check').textContent = tr(
		'connections.checking',
		'Revisando la configuración guardada…',
		'Checking saved configuration…',
	);
	try {
		const result = await api('/connections/check', {
			method: 'POST',
			body: '{}',
		});
		state.lastCheckResult = result;
		renderConnectionCheck();
	} catch (error) {
		$('#connection-check').textContent = error.message;
	} finally {
		state.connectionBusy = false;
		updateConnectionButtons();
	}
});
function renderContribution() {
	const contrib = state.status?.contribution;
	const walletEl = $('#solana-wallet-address');
	const payLinkEl = $('#solana-pay-link');
	const memoEl = $('#solana-device-code');
	const statusEl = $('#solana-verify-status');
	const inputEl = $('#solana-signature-input');
	const wallet =
		contrib?.wallet || '3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm';
	if (walletEl) walletEl.textContent = wallet;
	if (payLinkEl && contrib?.solana_pay_url) {
		payLinkEl.setAttribute('href', contrib.solana_pay_url);
	}
	if (memoEl && contrib?.device_code) {
		memoEl.textContent = contrib.device_code;
	}
	if (statusEl) {
		if (contrib?.verified) {
			statusEl.classList.add('ready');
			statusEl.textContent = tr(
				'solana.statusVerified',
				'● Verificado en Solana ({amount} USD · {currency}) · Modo real desbloqueado.',
				'● Verified on Solana ({amount} USD · {currency}) · Live mode unlocked.',
				{
					amount: contrib.amount_usd ?? 88,
					currency: contrib.currency || 'SOL',
				},
			);
			if (inputEl && !inputEl.value && contrib.tx_signature) {
				inputEl.value = contrib.tx_signature;
			}
		} else {
			statusEl.classList.remove('ready');
			statusEl.textContent = tr(
				'solana.statusPending',
				'Estado: Pendiente de verificación (Demo simulada disponible gratis).',
				'Status: Pending verification (Simulated demo available for free).',
			);
		}
	}
}
if ($('#copy-solana-wallet')) {
	$('#copy-solana-wallet').addEventListener('click', async () => {
		const wallet =
			$('#solana-wallet-address')?.textContent ||
			'3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm';
		try {
			await navigator.clipboard.writeText(wallet);
			toast(
				tr(
					'toast.walletCopied',
					'Cartera de Solana copiada al portapapeles.',
					'Solana wallet copied to clipboard.',
				),
			);
		} catch {
			toast(wallet);
		}
	});
}
if ($('#solana-verify-form')) {
	$('#solana-verify-form').addEventListener('submit', async (e) => {
		e.preventDefault();
		const inputEl = $('#solana-signature-input');
		const btnEl = $('#verify-solana-btn');
		const signature = inputEl?.value?.trim() || '';
		if (!signature) {
			inputEl?.focus();
			return;
		}
		if (btnEl) btnEl.disabled = true;
		try {
			const data = await api('/contribution/verify', {
				method: 'POST',
				body: JSON.stringify({ signature }),
			});
			if (!state.status) state.status = {};
			state.status.contribution = data.contribution;
			renderContribution();
			toast(
				tr(
					'toast.solanaVerified',
					'Contribución verificada en Solana. Modo real desbloqueado.',
					'Contribution verified on Solana. Live mode unlocked.',
				),
			);
		} catch (error) {
			toast(error.message);
		} finally {
			if (btnEl) btnEl.disabled = false;
		}
	});
}
function renderServerBadge() {
	const badge = $('#server-badge');
	if (!badge) return;
	badge.classList.toggle('online', state.serverState === 'online');
	const key =
		state.serverState === 'online'
			? 'server.online'
			: state.serverState === 'offline'
				? 'server.offline'
				: 'server.connecting';
	const text =
		state.serverState === 'online'
			? tr('server.online', 'Servidor local', 'Local server')
			: state.serverState === 'offline'
				? tr('server.offline', 'Sin conexión', 'Offline')
				: tr('server.connecting', 'Conectando', 'Connecting');
	badge.setAttribute('data-i18n', key);
	badge.innerHTML = '<i></i>' + esc(text);
}
function renderOfflineEmpty() {
	const title = esc(
		tr(
			'empty.offlineTitle',
			'El espacio local aún no está conectado.',
			'The local workspace is not connected yet.',
		),
	);
	const body = esc(
		tr(
			'empty.offlineBody',
			'Inicia Tabvento y recarga esta página.',
			'Start Tabvento and reload this page.',
		),
	);
	$('#recent-missions').innerHTML =
		`<div class="empty-state"><div><strong>${title}</strong><p>${body}</p></div></div>`;
	$('#all-missions').innerHTML = $('#recent-missions').innerHTML;
}
function setLanguage(lang) {
	const next = lang === 'es' ? 'es' : 'en';
	state.lang = next;
	langPreference(next);
	document.documentElement.lang = next;
	if (window.TABVENTO_I18N?.applyDom) {
		window.TABVENTO_I18N.applyDom(document, next);
		replaceIcons();
	}
	const langToggle = $('#lang-toggle');
	if (langToggle) {
		langToggle.setAttribute('data-lang', next);
		langToggle.setAttribute(
			'aria-label',
			next === 'en'
				? tr(
						'lang.switchToEs',
						'Cambiar idioma a español',
						'Switch language to Spanish',
					)
				: tr(
						'lang.switchToEn',
						'Cambiar idioma a inglés',
						'Switch language to English',
					),
		);
		langToggle.querySelectorAll('[data-lang-opt]').forEach((opt) => {
			opt.classList.toggle('active', opt.dataset.langOpt === next);
		});
	}
	setMotion(document.body.classList.contains('motion-paused'));
	updateBreadcrumb();
	updateMode();
	renderServerBadge();
	if (!state.status && state.serverState === 'offline') {
		renderOfflineEmpty();
	} else {
		renderMissions();
	}
	renderProviderOptions();
	updateProvider();
	if (state.connectionsLoaded || state.status || state.connection) {
		renderConnections();
	}
	renderContribution();
	if (state.lastCheckResult) {
		renderConnectionCheck();
	}
	if (state.selected) {
		renderDetail();
	} else {
		$('#delete-mission').textContent = deleteArmed
			? tr('detail.confirmDelete', 'Confirmar eliminación', 'Confirm deletion')
			: tr('detail.delete', 'Eliminar del historial', 'Remove from history');
	}
	if ($('#toast').classList.contains('visible') && state.lastToast) {
		$('#toast').textContent = trPhrase(state.lastToast);
	}
}
if ($('#lang-toggle')) {
	$('#lang-toggle').addEventListener('click', () => {
		setLanguage(state.lang === 'en' ? 'es' : 'en');
	});
}
async function refresh() {
	if (state.polling || state.mutations || document.hidden) return;
	state.polling = true;
	const revision = state.revision;
	try {
		const [status, history, connections] = await Promise.all([
			api('/status'),
			api('/missions'),
			api('/connections'),
		]);
		if (revision !== state.revision || state.mutations) return;
		state.status = status;
		state.missions = history.missions;
		state.connection = connections.connection;
		state.providers = connections.providers;
		if (!state.connectionsLoaded) {
			fillConnectionForm();
			state.connectionsLoaded = true;
		} else {
			renderProviderOptions();
		}
		state.serverState = 'online';
		renderServerBadge();
		renderMissions();
		renderConnections();
		renderContribution();
		if (state.selected) renderDetail();
	} catch (e) {
		if (revision !== state.revision || state.mutations) return;
		state.serverState = 'offline';
		renderServerBadge();
		if (!state.status) {
			renderOfflineEmpty();
		}
	} finally {
		state.polling = false;
	}
}
setLanguage(state.lang);
refresh();
setInterval(refresh, 1400);
document.addEventListener('visibilitychange', () => {
	if (!document.hidden) refresh();
});
