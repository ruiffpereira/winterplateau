#!/usr/bin/env node
/**
 * Gera `cms/migracao.zip` — o zip de «Migrar site» (Backoffice → Páginas → Definições do site, sessão de suporte).
 * Layout que a API aceita (`API-FullStack/src/pageBuilder/importZip.ts`): `manifest.json` · `content.json` · `media/<nome>`.
 *
 *   node cms/build-zip.mjs          # depois de `node cms/build-import.mjs`
 *
 * - `manifest.json` = `cms/manifest.json`; `content.json` = `cms/import.json` com `@media:favicon.svg` → `@media:logo.png`
 *   (a API recusa SVG; o `logo.png` é o favicon em PNG 512).
 * - Os ficheiros (PDFs do WordPress antigo, `og-image.png`, `logo.png`) NÃO estão no repo: vêm de `cms/media/` se existir;
 *   senão reaproveitam-se do `cms/migracao.zip` anterior (por isso o zip não se apaga entre execuções). Falta algum
 *   `@media:<nome>` do conteúdo → erro com o nome.
 * Sem dependências: leitor/escritor de zip mínimos (deflate), só o que este layout precisa.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateRawSync, inflateRawSync } from 'node:zlib';

const CMS = dirname(fileURLToPath(import.meta.url));
const OUT = join(CMS, 'migracao.zip');

/** Lê um zip pelo directório central: `Map<nome, Buffer>` das entradas `media/…`. */
function readMedia(zip) {
  const eocd = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error('zip anterior ilegível');
  const count = zip.readUInt16LE(eocd + 10);
  let p = zip.readUInt32LE(eocd + 16);
  const out = new Map();
  for (let i = 0; i < count; i++) {
    const method = zip.readUInt16LE(p + 10);
    const csize = zip.readUInt32LE(p + 20);
    const nameLen = zip.readUInt16LE(p + 28);
    const extraLen = zip.readUInt16LE(p + 30);
    const commentLen = zip.readUInt16LE(p + 32);
    const local = zip.readUInt32LE(p + 42);
    const name = zip.toString('utf8', p + 46, p + 46 + nameLen);
    p += 46 + nameLen + extraLen + commentLen;
    if (!name.startsWith('media/') || name.endsWith('/')) continue;
    const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    const raw = zip.subarray(start, start + csize);
    out.set(name.slice('media/'.length), method === 0 ? Buffer.from(raw) : inflateRawSync(raw));
  }
  return out;
}

/** Escreve um zip (deflate; PDFs/PNGs já comprimidos ficam `stored` se não encolherem). */
function writeZip(files) {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const [name, data] of files) {
    const nameBuf = Buffer.from(name, 'utf8');
    const def = deflateRawSync(data);
    const stored = def.length >= data.length;
    const body = stored ? data : def;
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // nomes em UTF-8
    local.writeUInt16LE(stored ? 0 : 8, 8);
    local.writeUInt32LE(crc >>> 0, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    parts.push(local, nameBuf, body);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(stored ? 0 : 8, 10);
    cd.writeUInt32LE(crc >>> 0, 16);
    cd.writeUInt32LE(body.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);
    offset += local.length + nameBuf.length + body.length;
  }
  const cdBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cdBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cdBuf, end]);
}

const manifest = readFileSync(join(CMS, 'manifest.json'));
const content = readFileSync(join(CMS, 'import.json'), 'utf8').replaceAll('@media:favicon.svg', '@media:logo.png');
const wanted = [...new Set([...content.matchAll(/@media:([A-Za-z0-9._-]+)/g)].map((m) => m[1]))].sort();

const media = new Map();
const dir = join(CMS, 'media');
if (existsSync(dir)) for (const f of readdirSync(dir)) media.set(f, readFileSync(join(dir, f)));
if (existsSync(OUT)) for (const [k, v] of readMedia(readFileSync(OUT))) if (!media.has(k)) media.set(k, v);
const missing = wanted.filter((n) => !media.has(n));
if (missing.length) throw new Error(`Faltam ficheiros em cms/media/ (ou no zip anterior): ${missing.join(', ')}`);

const files = [['manifest.json', manifest], ['content.json', Buffer.from(content)], ...wanted.map((n) => [`media/${n}`, media.get(n)])];
writeFileSync(OUT, writeZip(files));
const pages = JSON.parse(content).pages?.upsert?.length;
console.log(`cms/migracao.zip: ${files.length} entradas (manifest, conteúdo, ${wanted.length} ficheiros)${pages ? `, ${pages} páginas` : ''}`);
