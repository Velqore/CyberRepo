import { FALLBACK_REPOSITORIES, FALLBACK_CATEGORIES } from '../src/lib/curatedData.js';

interface DuplicateInfo {
  type: string;
  key: string;
  indices: number[];
  repos: { id: string; full_name: string; url: string; category_id: string }[];
}

function findDuplicates() {
  const seenId = new Map<string, number[]>();
  const seenFullName = new Map<string, number[]>();
  const seenUrl = new Map<string, number[]>();
  const duplicates: DuplicateInfo[] = [];

  FALLBACK_REPOSITORIES.forEach((repo, idx) => {
    const idKey = repo.id.trim();
    const fullNameKey = repo.full_name.trim().toLowerCase();
    const urlKey = repo.url.trim().toLowerCase().replace(/\/+$/, '');

    if (!seenId.has(idKey)) seenId.set(idKey, []);
    seenId.get(idKey)!.push(idx);

    if (!seenFullName.has(fullNameKey)) seenFullName.set(fullNameKey, []);
    seenFullName.get(fullNameKey)!.push(idx);

    if (!seenUrl.has(urlKey)) seenUrl.set(urlKey, []);
    seenUrl.get(urlKey)!.push(idx);
  });

  for (const [key, indices] of seenId.entries()) {
    if (indices.length > 1) {
      duplicates.push({
        type: 'Duplicate ID',
        key,
        indices,
        repos: indices.map((i) => ({
          id: FALLBACK_REPOSITORIES[i].id,
          full_name: FALLBACK_REPOSITORIES[i].full_name,
          url: FALLBACK_REPOSITORIES[i].url,
          category_id: FALLBACK_REPOSITORIES[i].category_id,
        })),
      });
    }
  }

  for (const [key, indices] of seenFullName.entries()) {
    if (indices.length > 1) {
      duplicates.push({
        type: 'Duplicate Full Name',
        key,
        indices,
        repos: indices.map((i) => ({
          id: FALLBACK_REPOSITORIES[i].id,
          full_name: FALLBACK_REPOSITORIES[i].full_name,
          url: FALLBACK_REPOSITORIES[i].url,
          category_id: FALLBACK_REPOSITORIES[i].category_id,
        })),
      });
    }
  }

  for (const [key, indices] of seenUrl.entries()) {
    if (indices.length > 1) {
      duplicates.push({
        type: 'Duplicate URL',
        key,
        indices,
        repos: indices.map((i) => ({
          id: FALLBACK_REPOSITORIES[i].id,
          full_name: FALLBACK_REPOSITORIES[i].full_name,
          url: FALLBACK_REPOSITORIES[i].url,
          category_id: FALLBACK_REPOSITORIES[i].category_id,
        })),
      });
    }
  }

  return duplicates;
}

function checkCategories() {
  const validCategoryIds = new Set(FALLBACK_CATEGORIES.map((c) => c.id));
  const invalidCategoryRepos: { id: string; full_name: string; category_id: string }[] = [];

  FALLBACK_REPOSITORIES.forEach((repo) => {
    if (!validCategoryIds.has(repo.category_id)) {
      invalidCategoryRepos.push({
        id: repo.id,
        full_name: repo.full_name,
        category_id: repo.category_id,
      });
    }
  });

  return invalidCategoryRepos;
}

const dups = findDuplicates();
const catErrors = checkCategories();

console.log(`\n--- REPOSITORY DATA INTEGRITY REPORT ---`);
console.log(`Total Curated Repositories: ${FALLBACK_REPOSITORIES.length}`);
console.log(`Total Categories: ${FALLBACK_CATEGORIES.length}`);
console.log(`Duplicates Detected: ${dups.length}`);
console.log(`Invalid Category IDs: ${catErrors.length}`);

if (dups.length > 0) {
  console.log(`\n❌ DUPLICATES FOUND:`);
  console.log(JSON.stringify(dups, null, 2));
} else {
  console.log(`\n✅ ZERO DUPLICATES FOUND! All IDs, URLs, and repository names are completely unique.`);
}

if (catErrors.length > 0) {
  console.log(`\n❌ INVALID CATEGORIES FOUND:`);
  console.log(JSON.stringify(catErrors, null, 2));
} else {
  console.log(`✅ All category IDs match valid categories.`);
}
