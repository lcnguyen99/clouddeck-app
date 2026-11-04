#!/usr/bin/env node
// Checks src/data/aws-services.json for structural mistakes. Run: npm run validate-data
const data = require('../src/data/aws-services.json');

const errors = [];
const err = (msg) => errors.push(msg);

const levels = new Set(data.levels);
const certIds = new Set(data.certifications.map((c) => c.id));
const catIds = new Set(data.categories.map((c) => c.id));
const seenIds = new Set();
const seenShort = new Set();

for (const c of data.categories) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(c.color)) err(`category ${c.id}: color must be #RRGGBB`);
  if (!c.abbr || c.abbr.length > 4) err(`category ${c.id}: abbr must be 1-4 chars`);
}

for (const s of data.services) {
  const where = `service ${s.id ?? '(missing id)'}`;
  for (const f of ['id', 'name', 'shortName', 'category', 'level', 'definition']) {
    if (typeof s[f] !== 'string' || !s[f].trim()) err(`${where}: missing ${f}`);
  }
  if (seenIds.has(s.id)) err(`${where}: duplicate id`);
  seenIds.add(s.id);
  if (seenShort.has(s.shortName)) err(`${where}: duplicate shortName ${s.shortName}`);
  seenShort.add(s.shortName);
  if (s.shortName && s.shortName.length > 4) err(`${where}: shortName longer than 4 chars`);
  if (!catIds.has(s.category)) err(`${where}: unknown category ${s.category}`);
  if (!levels.has(s.level)) err(`${where}: unknown level ${s.level}`);
  if (!Array.isArray(s.usedFor) || s.usedFor.length === 0)
    err(`${where}: usedFor must be a non-empty array`);
  if (!s.scenario?.company || !s.scenario?.story) err(`${where}: scenario needs company and story`);
  if (!Array.isArray(s.certifications)) err(`${where}: certifications must be an array`);
  else for (const c of s.certifications) if (!certIds.has(c)) err(`${where}: unknown certification ${c}`);
}

for (const c of catIds) {
  if (!data.services.some((s) => s.category === c)) err(`category ${c} has no services`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(
  `OK: ${data.services.length} services, ${data.categories.length} categories, ${data.certifications.length} certifications.`,
);
