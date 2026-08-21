import { FALLBACK_REPOSITORIES } from '../src/lib/curatedData.js';

interface Result {
  fullName: string;
  url: string;
  status: number;
  ok: boolean;
}

async function checkUrl(url: string): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timer);
    return res.status;
  } catch (err: any) {
    clearTimeout(timer);
    return err.name === 'AbortError' ? 408 : 500;
  }
}

async function main() {
  console.log(`Verifying ${FALLBACK_REPOSITORIES.length} repositories from curatedData.ts...\n`);
  const dead: Result[] = [];
  const active: Result[] = [];

  const BATCH_SIZE = 5;
  for (let i = 0; i < FALLBACK_REPOSITORIES.length; i += BATCH_SIZE) {
    const batch = FALLBACK_REPOSITORIES.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (repo) => {
        const status = await checkUrl(repo.url);
        const isOk = status >= 200 && status < 400;
        if (!isOk) {
          console.log(`❌ [${status}] ${repo.full_name} (${repo.url})`);
          dead.push({ fullName: repo.full_name, url: repo.url, status, ok: false });
        } else {
          console.log(`✅ [${status}] ${repo.full_name}`);
          active.push({ fullName: repo.full_name, url: repo.url, status, ok: true });
        }
      })
    );
  }

  console.log('\n=======================================');
  console.log(`TOTAL: ${FALLBACK_REPOSITORIES.length}`);
  console.log(`ACTIVE (200-399): ${active.length}`);
  console.log(`DEAD/404/ERR: ${dead.length}`);
  console.log('=======================================');

  if (dead.length > 0) {
    console.log('\nDead Repositories list:');
    dead.forEach((d) => console.log(`- ${d.fullName} (${d.url}) => Status: ${d.status}`));
  }
}

main().catch(console.error);
