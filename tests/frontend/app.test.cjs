const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '../../tabvento/web');
const providers = [
	{
		id: 'openai',
		label: 'OpenAI',
		key_env: 'OPENAI_API_KEY',
		requires_key: true,
		credential_present: false,
	},
	{ id: 'ollama', label: 'Ollama', requires_key: false },
];
const mission = {
	id: 'a'.repeat(32),
	task: 'Test <img src=x onerror=alert(1)>',
	status: 'failed',
	mode: 'demo',
	steps: [],
	result: 'A partial finding',
	error: 'Provider stopped',
};
const tick = () => new Promise((r) => setImmediate(r));
function setup(t, { blockedStorage = false, mobile = false } = {}) {
	const dom = new JSDOM(
		fs.readFileSync(path.join(root, 'index.html'), 'utf8'),
		{
			url: 'http://localhost/',
			runScripts: 'outside-only',
			pretendToBeVisual: true,
		},
	);
	t.after(() => dom.window.close());
	const w = dom.window;
	w.scrollTo = () => {};
	const mediaListeners = [];
	w.matchMedia = (query) => ({
		matches: mobile && query.includes("640px"),
		addEventListener: (_event, listener) => mediaListeners.push(listener),
	});
	w.HTMLElement.prototype.scrollIntoView = () => {};
	w.HTMLDialogElement.prototype.showModal = function () {
		this.open = true;
	};
	w.HTMLDialogElement.prototype.close = function () {
		this.open = false;
		this.dispatchEvent(new w.Event('close'));
	};
	if (blockedStorage)
		Object.defineProperty(w, 'localStorage', {
			get() {
				throw new w.DOMException('Blocked', 'SecurityError');
			},
		});
	const pending = [];
	w.fetch = (url, opts) =>
		new Promise((resolve) => pending.push({ url, opts, resolve }));
	const reply = (p, data) => {
		assert.ok(p, 'expected HTTP request');
		p.resolve({ ok: true, json: async () => data });
	};
	w.eval(fs.readFileSync(path.join(root, 'i18n.js'), 'utf8'));
	w.eval(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
	const initialize = async (connection = null, missions = []) => {
		reply(
			pending.find((p) => p.url === '/api/status'),
			{ engine_available: true },
		);
		reply(
			pending.find((p) => p.url === '/api/connections'),
			{ providers, connection },
		);
		reply(
			pending.find((p) => p.url === '/api/missions'),
			{ missions },
		);
		await tick();
	};
	return {
		w,
		pending,
		reply,
		initialize,
		$: (s) => w.document.querySelector(s),
	};
}
test('stale polling cannot erase a newly created mission; task text is escaped', async (t) => {
	const { w, pending, reply, initialize, $ } = setup(t);
	$('#hero-demo').click();
	reply(
		pending.find((p) => p.opts.method === 'POST'),
		{ mission },
	);
	await tick();
	await initialize();
	assert.equal(w.document.querySelectorAll('[data-mission]').length, 2);
	assert.equal($('#recent-missions img'), null);
	assert.match($('#detail-result').textContent, /A partial finding/);
	assert.match($('#detail-result').textContent, /Provider stopped/);
	const del = $('#delete-mission');
	del.click();
	del.click();
	assert.equal(del.disabled, true);
	reply(
		pending.find((p) => p.opts.method === 'DELETE'),
		{},
	);
	await tick();
	assert.equal(w.document.querySelectorAll('[data-mission]').length, 0);
});
test('provider configuration saves to server, checks local requirements, and live missions omit model overrides', async (t) => {
	const { w, pending, reply, initialize, $ } = setup(t);
	await initialize();
	$('#provider-select').value = 'ollama';
	$('#provider-select').dispatchEvent(new w.Event('change'));
	assert.equal($('#base-url-field').hidden, false);
	$('#model-input').value = 'my-exact-model';
	$('#base-url-input').value = 'http://localhost:11434/v1';
	$('#settings-form').dispatchEvent(
		new w.Event('submit', { cancelable: true }),
	);
	const save = pending.find(
		(p) => p.url === '/api/connections' && p.opts.method === 'POST',
	);
	const connection = JSON.parse(save.opts.body);
	assert.deepEqual(connection, {
		provider: 'ollama',
		model: 'my-exact-model',
		base_url: 'http://localhost:11434/v1',
	});
	reply(save, { connection });
	await tick();
	assert.match($('#saved-connection').textContent, /my-exact-model/);
	$('#check-connection').click();
	reply(
		pending.find((p) => p.url === '/api/connections/check'),
		{
			ok: true,
			scope: 'configuration',
			authentication_verified: false,
			checks: [{ id: 'model', label: 'Modelo', ok: true, detail: 'Guardado' }],
			message: 'Configuración local preparada.',
		},
	);
	await tick();
	assert.match(
		$('#connection-check').textContent,
		/Does not verify authentication/,
	);
	$('#mode-select').value = 'live';
	$('#task-input').value = 'My task';
	$('#mission-form').dispatchEvent(new w.Event('submit', { cancelable: true }));
	const start = pending.find(
		(p) => p.url === '/api/missions' && p.opts.method === 'POST',
	);
	assert.deepEqual(JSON.parse(start.opts.body), {
		task: 'My task',
		mode: 'live',
	});
	reply(start, { mission });
	await tick();
});
test('blocked localStorage does not prevent startup; skip link focuses main', async (t) => {
	const { w, initialize, $ } = setup(t, { blockedStorage: true });
	await initialize();
	$('#motion-toggle').click();
	assert.equal(w.document.body.classList.contains('motion-paused'), true);
	w.location.hash = 'main';
	w.dispatchEvent(new w.HashChangeEvent('hashchange'));
	assert.equal(w.document.activeElement, $('#main'));
});
test('language toggle switches static DOM, dynamic views, mission statuses, connection labels, and Accept-Language header between es and en', async (t) => {
	const { w, pending, reply, initialize, $ } = setup(t);
	const sampleMissions = [
		{
			id: 'b'.repeat(32),
			task: 'Compare creative tools',
			status: 'running',
			mode: 'demo',
			created_at: '2026-04-01T10:30:00Z',
			steps: [
				{
					label: 'Interpretando el objetivo de ejemplo.',
					at: '2026-04-01T10:30:01Z',
				},
			],
			result: null,
			error: null,
		},
		{
			id: 'c'.repeat(32),
			task: 'Audit workspace',
			status: 'completed',
			mode: 'live',
			created_at: '2026-04-01T11:00:00Z',
			steps: [],
			result: 'Done',
			error: null,
		},
	];
	await initialize(
		{ provider: 'openai', model: 'gpt-5' },
		sampleMissions,
	);

	// Initial English state (default)
	assert.equal(w.document.documentElement.lang, 'en');
	assert.equal($('#lang-toggle').getAttribute('data-lang'), 'en');
	assert.match(w.document.title, /Give your browser a mission/);
	assert.match($('#hero-title').textContent, /The web moves/);
	assert.match($('#composer-title').textContent, /What do you want to set in motion/);
	assert.match($('[data-view="inicio"]').textContent, /Overview/);
	assert.match($('[data-view="misiones"]').textContent, /Missions/);
	assert.match($('[data-view="conexiones"]').textContent, /Connections/);
	assert.match($('[data-view="guia"]').textContent, /Getting started/);
	assert.equal($('#breadcrumb-title').textContent, 'Overview');
	assert.match($('#server-badge').textContent, /Local server/);
	assert.match($('#task-input').getAttribute('placeholder'), /Find, compare, research/);
	assert.match($('#history-search').getAttribute('placeholder'), /Search for a mission/);
	assert.match($('#model-input').getAttribute('placeholder'), /Your model name, unmodified/);
	assert.match($('#mode-hint').textContent, /Explore the workflow without keys or AI/);
	assert.match($('#submit-mission').textContent, /Start demo/);
	assert.match($('#recent-missions').textContent, /Running/);
	assert.match($('#recent-missions').textContent, /Completed/);
	assert.match($('#recent-missions').textContent, /Simulated demo/);
	assert.match($('#recent-missions').textContent, /Live browser/);
	assert.match($('#connection-list').textContent, /Automation engine/);
	assert.match($('#connection-list').textContent, /Available/);
	assert.match($('#connection-list').textContent, /No key on server/);
	assert.match($('#connection-list').textContent, /No key required/);
	assert.match($('#saved-connection').textContent, /Saved on this machine: OpenAI · gpt-5/);

	// Open mission detail in English and verify step translation
	w.document.querySelector('[data-mission="' + 'b'.repeat(32) + '"]').click();
	assert.equal(
		$('#detail-mode').textContent,
		'SIMULATED DEMO / NO LIVE BROWSING',
	);
	assert.match($('#detail-steps').textContent, /Interpreting sample goal\./);

	// Check connection in English sends Accept-Language: en
	$('#check-connection').click();
	const checkReq = pending.find(
		(p) => p.url === '/api/connections/check' && p.opts.method === 'POST',
	);
	assert.equal(checkReq.opts.headers['Accept-Language'], 'en');
	reply(checkReq, {
		ok: true,
		scope: 'configuration',
		authentication_verified: false,
		checks: [{ id: 'model', label: 'Modelo', ok: true, detail: 'Guardado' }],
		message: 'Configuración local preparada.',
	});
	await tick();
	assert.match($('#connection-check').textContent, /Local configuration ready\./);
	assert.match($('#connection-check').textContent, /Does not verify authentication/);

	// Toggle to Spanish and verify everything translates cleanly
	$('#lang-toggle').click();
	assert.equal(w.document.documentElement.lang, 'es');
	assert.equal($('#lang-toggle').getAttribute('data-lang'), 'es');
	assert.equal(w.localStorage.getItem('tabvento.lang'), 'es');
	assert.match($('#hero-title').textContent, /La web se mueve/);
	assert.match($('[data-view="inicio"]').textContent, /Vista general/);
	assert.equal($('#breadcrumb-title').textContent, 'Vista general');
	assert.match($('#recent-missions').textContent, /En marcha/);
	assert.match($('#recent-missions').textContent, /Completada/);
	assert.match($('#connection-list').textContent, /Motor de automatización/);
	assert.match($('#saved-connection').textContent, /Guardada en este equipo: OpenAI · gpt-5/);
	assert.equal(
		$('#detail-mode').textContent,
		'DEMO SIMULADA / SIN NAVEGACIÓN REAL',
	);
	assert.match($('#detail-steps').textContent, /Interpretando el objetivo de ejemplo\./);
	assert.match($('#connection-check').textContent, /No verifica la autenticación/);

	// Toggle back to English
	$('#lang-toggle').click();
	assert.equal(w.document.documentElement.lang, 'en');
	assert.equal($('#lang-toggle').getAttribute('data-lang'), 'en');
	assert.equal(w.localStorage.getItem('tabvento.lang'), 'en');
});

test('connection checks serialize saves and stay disabled across language rendering', async (t) => {
	const { pending, reply, initialize, $ } = setup(t);
	await initialize({ provider: 'openai', model: 'old-model' });
	$('#check-connection').click();
	$('#model-input').value = 'new-model';
	$('#lang-toggle').click();
	assert.equal($('#save-connection').disabled, true);
	assert.equal($('#check-connection').disabled, true);
	$('#save-connection').click();
	assert.equal(pending.filter((p) => p.url === '/api/connections' && p.opts.method === 'POST').length, 0);
	reply(pending.find((p) => p.url === '/api/connections/check'), {
		ready: true, message: 'Old configuration ready', checks: [],
	});
	await tick();
	assert.equal($('#save-connection').disabled, false);
	$('#save-connection').click();
	const save = pending.find((p) => p.url === '/api/connections' && p.opts.method === 'POST');
	reply(save, { connection: { provider: 'openai', model: 'new-model' } });
	await tick();
	assert.equal($('#connection-check').textContent, '');
});

test('closed mobile navigation is inert and Escape returns keyboard focus', async (t) => {
	const { w, $, initialize } = setup(t, { mobile: true });
	await initialize();
	assert.equal($('.sidebar').hasAttribute('inert'), true);
	assert.equal($('.sidebar').getAttribute('aria-hidden'), 'true');
	$('#menu-toggle').click();
	assert.equal($('.sidebar').hasAttribute('inert'), false);
	$('.sidebar a').focus();
	w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	assert.equal($('.sidebar').hasAttribute('inert'), true);
	assert.equal(w.document.activeElement, $('#menu-toggle'));
	assert.equal($('#menu-toggle').getAttribute('aria-expanded'), 'false');
});

test('Solana contribution card displays official wallet, $88 minimum with no maximum in EN/ES, and verifies signature', async (t) => {
	const { w, pending, reply, initialize, $ } = setup(t);
	await initialize();
	assert.equal(
		$('#solana-wallet-address').textContent,
		'3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm',
	);
	assert.match($('#solana-min-badge').textContent, /Minimum: \$88 USD · No maximum limit/);
	$('#lang-toggle').click();
	assert.match($('#solana-min-badge').textContent, /Mínimo: \$88 USD · Sin límite máximo/);
	$('#lang-toggle').click();
	assert.match($('#solana-min-badge').textContent, /Minimum: \$88 USD · No maximum limit/);
	const sig = '5'.repeat(88);
	$('#solana-signature-input').value = sig;
	$('#solana-verify-form').dispatchEvent(
		new w.Event('submit', { cancelable: true }),
	);
	const verifyReq = pending.find(
		(p) => p.url === '/api/contribution/verify' && p.opts.method === 'POST',
	);
	assert.deepEqual(JSON.parse(verifyReq.opts.body), { signature: sig });
	reply(verifyReq, {
		verified: true,
		contribution: {
			wallet: '3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm',
			min_contribution_usd: 88,
			max_contribution_usd: null,
			device_code: 'TV-123456789ABC',
			solana_pay_url: 'solana:3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm?label=Tabvento&memo=TV-123456789ABC',
			verified: true,
			tx_signature: sig,
			amount_usd: 88,
			currency: 'SOL',
		},
	});
	await tick();
	assert.match($('#solana-verify-status').textContent, /Verified on Solana \(88 USD · SOL\)/);
});
