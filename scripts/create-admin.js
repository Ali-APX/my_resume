import { mkdir, writeFile } from 'node:fs/promises';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scrypt = promisify(scryptCallback);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function readPassword() {
  const prompt = 'Choose an admin password (12+ characters): ';
  if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
    const rl = createInterface({ input: stdin, output: stdout });
    try { return await rl.question(prompt); } finally { rl.close(); }
  }
  stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let password = '';
    const finish = (error) => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
      error ? reject(error) : resolve(password);
    };
    const onData = (chunk) => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\u0003') return finish(new Error('Password setup cancelled.'));
        if (char === '\r' || char === '\n') return finish();
        if (char === '\u007f' || char === '\b') password = password.slice(0, -1);
        else password += char;
      }
    };
    stdin.on('data', onData);
  });
}
try {
  const password = await readPassword();
  if (password.length < 12) throw new Error('Password must be at least 12 characters.');
  const salt = randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt, 64)).toString('hex');
  await mkdir(path.join(root, 'data'), { recursive: true });
  await writeFile(path.join(root, 'data', 'admin.json'), JSON.stringify({ salt, hash }, null, 2), { mode: 0o600 });
  console.log('Admin credential saved in data/admin.json. Keep this file private and backed up.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
