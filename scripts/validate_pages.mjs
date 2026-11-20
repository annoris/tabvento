#!/usr/bin/env node
/**
 * Tabvento Authentic Web Application & GitHub Pages Validator
 * Zero external npm dependencies (Node ESM built-ins only)
 *
 * Verifies:
 * 1. site/.nojekyll exists
 * 2. site/index.html and core authentic Tabvento files exist and are well-formed
 * 3. Required sections present: hero, overview, missions composer, 24-mission examples, Solana gate, provider configuration, guide, footer
 * 4. All referenced CSS, JS, font, and SVG assets exist and are non-empty
 * 5. No localhost, 127.0.0.1, or file:// links exist in href/src
 * 6. All 24 mission examples are present in data / DOM
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const siteDir = path.resolve(rootDir, 'site');
const indexPath = path.resolve(siteDir, 'index.html');
const nojekyllPath = path.resolve(siteDir, '.nojekyll');

let errors = [];
let passedChecks = 0;

function pass(name, detail = '') {
	passedChecks++;
	console.log(`  ✔ [PASS] ${name}${detail ? ` (${detail})` : ''}`);
}

function fail(name, detail = '') {
	const message = `✖ [FAIL] ${name}${detail ? `: ${detail}` : ''}`;
	errors.push(message);
	console.error(`  ${message}`);
}

console.log('--- Tabvento GitHub Pages & Authentic Web Application Validator ---');
console.log(`Project root: ${rootDir}`);
console.log(`Site dir:     ${siteDir}\n`);

// 1. Verify site/.nojekyll exists
console.log('1. Checking GitHub Pages configuration...');
if (fs.existsSync(nojekyllPath)) {
	pass('.nojekyll exists to bypass Jekyll processing');
} else {
	fail('.nojekyll missing', `Expected at ${nojekyllPath}`);
}

// 2. Verify site/index.html and authentic Tabvento web files exist
console.log('\n2. Checking site/ authentic Tabvento files existence & integrity...');
const expectedFiles = [
	{ rel: 'index.html', label: 'HTML Entry Point' },
	{ rel: 'styles.css', label: 'Tabvento Main Stylesheet' },
	{ rel: 'fonts.css', label: 'Fonts Stylesheet' },
	{ rel: 'app.js', label: 'Client Application & Simulator' },
	{ rel: 'i18n.js', label: 'Bilingual i18n Translations' },
	{ rel: 'mark.svg', label: 'Tabvento Mark SVG' },
];

for (const f of expectedFiles) {
	const filePath = path.resolve(siteDir, f.rel);
	if (!fs.existsSync(filePath)) {
		fail(`Missing file: ${f.rel}`, `Expected at ${filePath}`);
	} else {
		const stat = fs.statSync(filePath);
		if (stat.size === 0) {
			fail(`Empty file: ${f.rel}`);
		} else {
			pass(`${f.label} (${f.rel}) exists and non-empty`, `${stat.size} bytes`);
		}
	}
}

if (!fs.existsSync(indexPath)) {
	console.error(`\nValidation aborted: index.html missing.`);
	process.exit(1);
}

const htmlContent = fs.readFileSync(indexPath, 'utf-8');

// 3. Verify required Tabvento sections and components
console.log('\n3. Verifying authentic Tabvento views & components...');
const requiredSections = [
	{
		id: 'hero',
		label: 'Hero section',
		test: (html) => /(?:class=["'][^"']*hero[^"']*["']|<section[^>]*hero|id=["']hero)/i.test(html),
	},
	{
		id: 'overview',
		label: 'Overview view (#inicio)',
		test: (html) => /(?:data-view=["']inicio["']|href=["']#inicio["'])/i.test(html),
	},
	{
		id: 'missions',
		label: 'Missions view & composer (#misiones)',
		test: (html) => /(?:data-view=["']misiones["']|id=["']mission-form["']|id=["']task-input["'])/i.test(html),
	},
	{
		id: 'examples',
		label: '24 Mission Examples library (#example-library)',
		test: (html) => /(?:id=["']example-library["']|id=["']example-grid["']|24 example missions|24 misiones de ejemplo)/i.test(html),
	},
	{
		id: 'solana-gate',
		label: 'Solana Gate ($88 USD minimum, 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm)',
		test: (html) => /(?:3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm|solana-wallet-address|solana-verify-button)/i.test(html),
	},
	{
		id: 'providers',
		label: 'Provider Configuration section (#provider-select)',
		test: (html) => /(?:id=["']provider-select["']|id=["']model-input["']|id=["']save-connection["'])/i.test(html),
	},
	{
		id: 'guide',
		label: 'Guide view (#guia)',
		test: (html) => /(?:data-view=["']guia["']|href=["']#guia["'])/i.test(html),
	},
	{
		id: 'footer',
		label: 'Footer section',
		test: (html) => /(?:<footer|id=["']footer["']|class=["'][^"']*footer[^"']*["'])/i.test(html),
	},
];

for (const section of requiredSections) {
	if (section.test(htmlContent)) {
		pass(`Section / Component: ${section.label}`);
	} else {
		fail(`Component missing: ${section.label}`, `Could not find marker for '${section.id}'`);
	}
}

// 4. Verify no localhost, 127.0.0.1, or broken file:// links exist in site/index.html
console.log('\n4. Checking for forbidden localhost / 127.0.0.1 / file:// links...');
const linkAttrRegex = /(?:href|src)=["']([^"']+)["']/gi;
let match;
let forbiddenLinks = [];

while ((match = linkAttrRegex.exec(htmlContent)) !== null) {
	const rawUrl = match[1].trim();
	if (/^(?:https?:)?\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i.test(rawUrl)) {
		forbiddenLinks.push(rawUrl);
	}
	if (/^file:\/\//i.test(rawUrl)) {
		forbiddenLinks.push(rawUrl);
	}
}

if (forbiddenLinks.length === 0) {
	pass('No localhost, 127.0.0.1, or file:// URLs found in HTML attributes');
} else {
	fail('Found forbidden localhost / file:// links', forbiddenLinks.join(', '));
}

// 5. Verify all referenced CSS, JS, fonts, and SVG assets exist and are non-empty
console.log('\n5. Verifying referenced assets and font integrity...');
const assetRegex = /(?:href|src)=["']([^"']+)["']/gi;
const referencedAssets = new Set();

while ((match = assetRegex.exec(htmlContent)) !== null) {
	const target = match[1].trim();
	// Skip external URLs, anchor hashes, mailto, tel, javascript, solana, data URIs
	if (/^(?:https?:\/\/|\/\/|mailto:|tel:|javascript:|solana:|#|data:)/i.test(target)) {
		continue;
	}
	referencedAssets.add(target);
}

let assetsChecked = 0;
for (const relAsset of referencedAssets) {
	const cleanRel = relAsset.split('?')[0].split('#')[0];
	if (!cleanRel) continue;

	let resolvedPath;
	if (cleanRel.startsWith('/')) {
		resolvedPath = path.join(siteDir, cleanRel.slice(1));
	} else {
		resolvedPath = path.resolve(siteDir, cleanRel);
	}

	if (!fs.existsSync(resolvedPath)) {
		fail(`Referenced HTML asset does not exist: ${relAsset}`, `Resolved to: ${resolvedPath}`);
	} else {
		const stat = fs.statSync(resolvedPath);
		if (stat.size === 0) {
			fail(`Referenced asset is empty (0 bytes): ${relAsset}`);
		} else {
			assetsChecked++;
		}
	}
}

if (assetsChecked > 0) {
	pass(`All ${assetsChecked} referenced local HTML assets exist and are non-empty`);
} else {
	fail('No local assets were found referenced in site/index.html');
}

// Scan all CSS files in siteDir for @import and url(...) references
function findCssFiles(dir) {
	let results = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results = results.concat(findCssFiles(full));
		} else if (entry.name.endsWith('.css')) {
			results.push(full);
		}
	}
	return results;
}

const cssFiles = findCssFiles(siteDir);
let cssAssetsChecked = 0;
for (const cssPath of cssFiles) {
	const cssContent = fs.readFileSync(cssPath, 'utf-8');
	const urlRegex = /(?:@import\s+)?url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
	let urlMatch;
	while ((urlMatch = urlRegex.exec(cssContent)) !== null) {
		const cssTarget = urlMatch[1].trim();
		if (/^(?:https?:\/\/|\/\/|data:)/i.test(cssTarget)) continue;
		const cleanTarget = cssTarget.split('?')[0].split('#')[0];
		let resolvedTarget;
		if (cleanTarget.startsWith('/')) {
			resolvedTarget = path.join(siteDir, cleanTarget.slice(1));
		} else {
			resolvedTarget = path.resolve(path.dirname(cssPath), cleanTarget);
		}

		if (!fs.existsSync(resolvedTarget)) {
			fail(`CSS url() reference not found: ${cssTarget} in ${path.relative(siteDir, cssPath)}`, resolvedTarget);
		} else {
			const stat = fs.statSync(resolvedTarget);
			if (stat.size === 0) {
				fail(`CSS url() referenced asset is 0 bytes: ${cssTarget} in ${path.relative(siteDir, cssPath)}`);
			} else {
				cssAssetsChecked++;
			}
		}
	}
}

if (cssAssetsChecked > 0) {
	pass(`All ${cssAssetsChecked} CSS url(...) and @import referenced assets exist and are non-empty`);
}

// Verify bundled font files
const fontsDir = path.resolve(siteDir, 'fonts');
const expectedFonts = [
	'dm-sans-400.ttf', 'dm-sans-500.ttf', 'dm-sans-600.ttf', 'dm-sans-700.ttf',
	'space-grotesk-400.ttf', 'space-grotesk-500.ttf', 'space-grotesk-600.ttf', 'space-grotesk-700.ttf'
];
let fontsFound = 0;
for (const font of expectedFonts) {
	const fp = path.join(fontsDir, font);
	if (fs.existsSync(fp) && fs.statSync(fp).size > 0) {
		fontsFound++;
	} else {
		fail(`Font missing or empty: fonts/${font}`);
	}
}
if (fontsFound === expectedFonts.length) {
	pass(`All ${expectedFonts.length} bundled DM Sans & Space Grotesk fonts verified`);
}

// 6. Verify all 24 mission examples are present in data / DOM
console.log('\n6. Verifying all 24 mission examples in data / translations...');
let combinedSources = htmlContent;
const jsRegex = /<script[^>]*src=["']([^"']+\.js)["']/gi;
let jsMatch;
while ((jsMatch = jsRegex.exec(htmlContent)) !== null) {
	const cleanScript = jsMatch[1].split('?')[0];
	const scriptPath = cleanScript.startsWith('/')
		? path.join(siteDir, cleanScript.slice(1))
		: path.resolve(siteDir, cleanScript);
	if (fs.existsSync(scriptPath)) {
		combinedSources += '\n' + fs.readFileSync(scriptPath, 'utf-8');
	}
}

let foundExamplesCount = 0;
let missingExampleIndices = [];

for (let i = 1; i <= 24; i++) {
	const padded = String(i).padStart(2, '0');
	const patterns = [
		new RegExp(`examples\\.${padded}`, 'i'),
		new RegExp(`example[-_]${padded}`, 'i'),
		new RegExp(`data-mission=["']?${padded}["']?`, 'i'),
		new RegExp(`data-example=["']?${i}["']?`, 'i'),
		new RegExp(`["']0?${i}["']\\s*:\\s*{[^}]*(?:prompt|title)`, 'i'),
		new RegExp(`id=["']example-0?${i}["']`, 'i'),
		new RegExp(`mission[-_]0?${i}`, 'i'),
	];

	const exists = patterns.some(pattern => pattern.test(combinedSources));
	if (exists) {
		foundExamplesCount++;
	} else {
		missingExampleIndices.push(padded);
	}
}

if (foundExamplesCount === 24) {
	pass(`All 24 mission examples confirmed present in data/DOM (01 through 24)`);
} else {
	fail(
		`Only ${foundExamplesCount}/24 numbered mission examples verified`,
		missingExampleIndices.length > 0 ? `Missing: ${missingExampleIndices.join(', ')}` : ''
	);
}

// 7. Overall Summary
console.log('\n=================================================');
if (errors.length === 0) {
	console.log(`✔ ALL CHECKS PASSED (${passedChecks} checks succeeded). Authentic Tabvento ready for GitHub Pages!`);
	console.log('=================================================\n');
	process.exit(0);
} else {
	console.error(`✖ VALIDATION FAILED with ${errors.length} error(s):`);
	for (const err of errors) {
		console.error(`  - ${err}`);
	}
	console.log('=================================================\n');
	process.exit(1);
}
