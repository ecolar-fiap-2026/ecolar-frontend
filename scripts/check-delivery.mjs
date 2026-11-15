import fs from 'node:fs';
const delivery = JSON.parse(fs.readFileSync('entrega.json', 'utf8'));
const errors = [];
for (const key of ['github', 'vercel', 'apiJava', 'youtubeFront']) {
  try { const url = new URL(delivery[key]); if (url.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname)) throw Error(); }
  catch { errors.push(`${key}: informe uma URL HTTPS pública real.`); }
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.contato)) errors.push('Informe o contato real do grupo.');
if (!(delivery.duracaoVideoSegundos > 0 && delivery.duracaoVideoSegundos <= 180)) errors.push('O vídeo de Front deve ter duração entre 1 e 180 segundos.');
for (const [name, count] of Object.entries(delivery.commits)) if (!Number.isInteger(count) || count < 5) errors.push(`${name}: conferir ao menos 5 commits reais.`);
if (Object.values(delivery.commits).reduce((a, b) => a + b, 0) < 15) errors.push('Conferir ao menos 15 commits no total.');
for (const [key, confirmed] of Object.entries(delivery.evidencias)) if (confirmed !== true) errors.push(`Evidência pendente: ${key}.`);
if (fs.readFileSync('README.md', 'utf8').includes('PENDENTE:')) errors.push('Substituir as URLs e contato pendentes no README.');
if (errors.length) { console.error('ENTREGA AINDA NÃO LIBERADA\n' + errors.map((error) => `- ${error}`).join('\n')); process.exitCode = 1; }
else console.log('Campos de entrega completos. Esta conferência não acessa URLs nem comprova evidências: valide-as de fato antes do Portal.');
