#!/usr/bin/env node
/**
 * Tabvento Showcase & GitHub Pages Validator
 * Zero external npm dependencies (Node ESM built-ins only)
 *
 * Verifies:
 * 1. site/.nojekyll exists
 * 2. site/index.html exists and is well-formed
 * 3. Required sections present: hero, simulator, 24-mission examples, Solana gate, provider configuration, architecture, footer
 * 4. All referenced CSS, JS, font, and image assets exist and are non-empty
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

console.log('--- Tabvento GitHub Pages & Repository Validator ---');
console.log(`Project root: ${rootDir}`);
console.log(`Showcase dir: ${siteDir}\n`);

// 1. Verify site/.nojekyll exists
console.log('1. Checking GitHub Pages configuration...');
if (fs.existsSync(nojekyllPath)) {
	pass('.nojekyll exists to bypass Jekyll processing');
} else {
	fail('.nojekyll missing', `Expected at ${nojekyllPath}`);
}

// 2. Verify site/index.html exists and read contents
console.log('\n2. Checking site/index.html existence & structure...');
if (!fs.existsSync(indexPath)) {
	fail('site/index.html missing', `File not found at ${indexPath}`);
	console.error(`\nValidation aborted: ${errors.length} fatal error(s).`);
	process.exit(1);
}

const htmlContent = fs.readFileSync(indexPath, 'utf-8');
if (htmlContent.trim().length === 0) {
	fail('site/index.html is empty');
	process.exit(1);
} else {
	pass('site/index.html exists and is non-empty', `${htmlContent.length} bytes`);
}

// 3. Verify required sections
console.log('\n3. Verifying required showcase sections...');
const requiredSections = [
	{
		id: 'hero',
		label: 'Hero section',
		test: (html) => /(?:id=["']hero["']|class=["'][^"']*hero[^"']*["']|<section[^>]*hero)/i.test(html),
	},
	{
		id: 'simulator',
		label: 'Interactive Simulator section',
		test: (html) => /(?:id=["']simulator["']|class=["'][^"']*simulator[^"']*["']|interactive simulator|browser simulation)/i.test(html),
	},
	{
		id: 'examples',
		label: '24 Mission Examples section',
		test: (html) => /(?:id=["']examples["']|class=["'][^"']*example[^"']*["']|24 (?:example|misiones|misión|mission))/i.test(html),
	},
	{
		id: 'solana-gate',
		label: 'Solana Gate section ($88 USD minimum, 3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm)',
		test: (html) => /(?:3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm|solana-gate|solana-card|id=["']solana)/i.test(html),
	},
	{
		id: 'providers',
		label: 'Provider Configuration section',
		test: (html) => /(?:id=["']providers["']|provider-config|settings-card|provider configuration|configuración de proveedores)/i.test(html),
	},
	{
		id: 'architecture',
		label: 'Architecture section',
		test: (html) => /(?:id=["']architecture["']|class=["'][^"']*architecture[^"']*["']|<h[1-6][^>]*>[^<]*Architecture|Arquitectura)/i.test(html),
	},
	{
		id: 'footer',
		label: 'Footer section',
		test: (html) => /(?:<footer|id=["']footer["']|class=["'][^"']*footer[^"']*["'])/i.test(html),
	},
];

for (const section of requiredSections) {
	if (section.test(htmlContent)) {
		pass(`Section: ${section.label}`);
	} else {
		fail(`Section missing: ${section.label}`, `Could not find section marker for '${section.id}'`);
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

// 5. Verify all referenced CSS, JS, fonts, and image assets exist and are non-empty
console.log('\n5. Verifying referenced assets exist and are non-empty...');
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
	// Strip query parameters or hashes
	const cleanRel = relAsset.split('?')[0].split('#')[0];
	if (!cleanRel) continue;

	// Resolve against siteDir
	let resolvedPath;
	if (cleanRel.startsWith('/')) {
		resolvedPath = path.join(siteDir, cleanRel.slice(1));
	} else {
		resolvedPath = path.resolve(siteDir, cleanRel);
	}

	if (!fs.existsSync(resolvedPath)) {
		fail(`Referenced asset does not exist: ${relAsset}`, `Resolved to: ${resolvedPath}`);
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

// Also scan all CSS files in site/assets/css for url(...) references
const cssDir = path.resolve(siteDir, 'assets', 'css');
if (fs.existsSync(cssDir)) {
	const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
	let cssAssetsChecked = 0;
	for (const cssFile of cssFiles) {
		const cssPath = path.join(cssDir, cssFile);
		const cssContent = fs.readFileSync(cssPath, 'utf-8');
		const urlRegex = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
		let urlMatch;
		while ((urlMatch = urlRegex.exec(cssContent)) !== null) {
			const cssTarget = urlMatch[1].trim();
			if (/^(?:https?:\/\/|\/\/|data:)/i.test(cssTarget)) continue;
			const cleanTarget = cssTarget.split('?')[0].split('#')[0];
			const resolvedTarget = path.resolve(path.dirname(cssPath), cleanTarget);
			if (!fs.existsSync(resolvedTarget)) {
				fail(`CSS url() reference not found: ${cssTarget} in ${cssFile}`, resolvedTarget);
			} else {
				const stat = fs.statSync(resolvedTarget);
				if (stat.size === 0) {
					fail(`CSS url() referenced asset is 0 bytes: ${cssTarget} in ${cssFile}`);
				} else {
					cssAssetsChecked++;
				}
			}
		}
	}
	if (cssAssetsChecked > 0) {
		pass(`All ${cssAssetsChecked} CSS url(...) referenced assets exist and are non-empty`);
	}
}

// 6. Verify all 24 mission examples are present in data
console.log('\n6. Verifying all 24 mission examples in data...');

// Check whether 24 examples are represented
// Examples could be represented by numbered keys (e.g. 01..24, examples.01..24), data attributes, or an embedded JSON array.
// Look in index.html and any referenced JS files
let combinedSources = htmlContent;
const jsRegex = /<script[^>]*src=["']([^"']+\.js)["']/gi;
let jsMatch;
while ((jsMatch = jsRegex.exec(htmlContent)) !== null) {
	const scriptPath = path.resolve(siteDir, jsMatch[1].split('?')[0]);
	if (fs.existsSync(scriptPath)) {
		combinedSources += '\n' + fs.readFileSync(scriptPath, 'utf-8');
	}
}

let foundExamplesCount = 0;
let missingExampleIndices = [];

for (let i = 1; i <= 24; i++) {
	const padded = String(i).padStart(2, '0');
	// Check for various patterns: "examples.01", "example-01", "examples-01", id="example-1", data-example="1", "id": 1 or "id": "01"
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
	// Alternatively check if there is an array or list of at least 24 mission items
	const missionMatches = combinedSources.match(/class=["'][^"']*example-card[^"']*["']/g) ||
	                       combinedSources.match(/data-example-id/g) ||
	                       combinedSources.match(/"id"\s*:\s*\d+/g);
	if (missionMatches && missionMatches.length >= 24) {
		pass(`Confirmed ${missionMatches.length} mission example elements in data/DOM`);
	} else {
		fail(
			`Only ${foundExamplesCount}/24 numbered mission examples verified`,
			missingExampleIndices.length > 0 ? `Missing: ${missingExampleIndices.join(', ')}` : ''
		);
	}
}

// 7. Overall Summary
console.log('\n=================================================');
if (errors.length === 0) {
	console.log(`✔ ALL CHECKS PASSED (${passedChecks} checks succeeded). Repository & Showcase ready for GitHub Pages!`);
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
