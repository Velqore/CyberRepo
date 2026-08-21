import { FALLBACK_REPOSITORIES, FALLBACK_CATEGORIES } from '../src/lib/curatedData.js';

interface Result {
  fullName: string;
  url: string;
  status: number;
  ok: boolean;
}

// 1. Deduplication check
function checkDuplicates() {
  const seenId = new Set<string>();
  const seenFullName = new Set<string>();
  const seenUrl = new Set<string>();
  const dups: string[] = [];

  FALLBACK_REPOSITORIES.forEach((repo) => {
    const idKey = repo.id.trim();
    const fullNameKey = repo.full_name.trim().toLowerCase();
    const urlKey = repo.url.trim().toLowerCase().replace(/\/+$/, '');

    if (seenId.has(idKey)) dups.push(`Duplicate ID: ${idKey}`);
    seenId.add(idKey);

    if (seenFullName.has(fullNameKey)) dups.push(`Duplicate Full Name: ${fullNameKey}`);
    seenFullName.add(fullNameKey);

    if (seenUrl.has(urlKey)) dups.push(`Duplicate URL: ${urlKey}`);
    seenUrl.add(urlKey);
  });

  return dups;
}

async function checkUrl(url: string, retries = 2): Promise<number> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      let res = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
        redirect: 'follow',
      });
      clearTimeout(timer);

      // If HEAD returns 405/500/403 or anything unexpected, retry with GET
      if (res.status >= 400 && res.status !== 404) {
        const getController = new AbortController();
        const getTimer = setTimeout(() => getController.abort(), 7000);
        try {
          const getRes = await fetch(url, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml',
            },
            signal: getController.signal,
            redirect: 'follow',
          });
          clearTimeout(getTimer);
          res = getRes;
        } catch {
          clearTimeout(getTimer);
        }
      }

      if (res.status === 429 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      return res.status;
    } catch (err: any) {
      clearTimeout(timer);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      return err.name === 'AbortError' ? 408 : 500;
    }
  }
  return 500;
}

async function main() {
  console.log(`\n🔍 Checking repository integrity and uniqueness for ${FALLBACK_REPOSITORIES.length} repositories...`);

  // Duplication check
  const duplicateErrors = checkDuplicates();
  if (duplicateErrors.length > 0) {
    console.error(`\n❌ DUPLICATE REPOSITORIES DETECTED:`);
    duplicateErrors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  }
  console.log(`✅ Uniqueness Verified: 0 duplicates found across all ${FALLBACK_REPOSITORIES.length} repos.`);

  // Category ID check
  const validCategoryIds = new Set(FALLBACK_CATEGORIES.map((c) => c.id));
  const invalidCats = FALLBACK_REPOSITORIES.filter((r) => !validCategoryIds.has(r.category_id));
  if (invalidCats.length > 0) {
    console.error(`\n❌ INVALID CATEGORIES FOUND:`, invalidCats);
    process.exit(1);
  }
  console.log(`✅ Category Integrity Verified: All repos belong to valid categories.`);

  console.log(`\n🌐 Checking live status of all repositories...`);
  const dead: Result[] = [];
  const active: Result[] = [];

  const BATCH_SIZE = 8;
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
    console.log('\n❌ Dead / Unreachable Repositories:');
    dead.forEach((d) => console.log(`- ${d.fullName} (${d.url}) => Status: ${d.status}`));
    process.exit(1);
  } else {
    console.log(`\n✨ All ${FALLBACK_REPOSITORIES.length} repositories are 100% active, unique, and verified!`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
