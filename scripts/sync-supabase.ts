import { createClient } from '@supabase/supabase-js';
import { FALLBACK_CATEGORIES, FALLBACK_REPOSITORIES } from '../src/lib/curatedData.js';

const supabaseUrl = 'https://debpapifbkxxvatbhyqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYnBhcGlmYmt4eHZhdGJoeXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NjQyOTMsImV4cCI6MjEwMjM0MDI5M30.4xpuo2bDm00-wLYjhx8_pvSmhntnPi6EBI91urpJ4s0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function sync() {
  console.log('🔄 Starting complete Supabase database cleanup and synchronization...');

  // 1. Delete all existing repositories
  console.log('🗑️ Deleting all legacy/fabricated repositories from Supabase...');
  const { error: delRepoErr } = await supabase.from('repositories').delete().neq('name', '___NEVER_MATCH___');
  if (delRepoErr) {
    console.error('❌ Error clearing repositories table:', delRepoErr);
  } else {
    console.log('✅ Cleared all repositories.');
  }

  // 2. Delete all existing categories
  console.log('🗑️ Deleting all legacy categories from Supabase...');
  const { error: delCatErr } = await supabase.from('categories').delete().neq('name', '___NEVER_MATCH___');
  if (delCatErr) {
    console.error('❌ Error clearing categories table:', delCatErr);
  } else {
    console.log('✅ Cleared all categories.');
  }

  // 3. Insert fresh curated categories
  console.log(`📦 Inserting ${FALLBACK_CATEGORIES.length} verified categories...`);
  const categoriesToInsert = FALLBACK_CATEGORIES.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    color: cat.color,
    sort_order: cat.sort_order,
  }));

  const { data: insertedCategories, error: insertCatErr } = await supabase
    .from('categories')
    .insert(categoriesToInsert)
    .select('*');

  if (insertCatErr || !insertedCategories) {
    console.error('❌ Error inserting categories:', insertCatErr);
    process.exit(1);
  }
  console.log(`✅ Successfully inserted ${insertedCategories.length} categories!`);

  // Map category slug / id to the new Supabase Postgres UUID
  const catSlugToUuid = new Map<string, string>();
  const catIdToSlug = new Map<string, string>();
  FALLBACK_CATEGORIES.forEach((cat) => {
    catIdToSlug.set(cat.id, cat.slug);
  });

  insertedCategories.forEach((cat) => {
    catSlugToUuid.set(cat.slug, cat.id);
  });

  // 4. Prepare repositories to insert with proper category_id foreign keys
  console.log(`📦 Preparing ${FALLBACK_REPOSITORIES.length} verified repositories...`);
  const reposToInsert = FALLBACK_REPOSITORIES.map((repo) => {
    const slug = catIdToSlug.get(repo.category_id) || repo.category_id;
    const categoryUuid = catSlugToUuid.get(slug);

    if (!categoryUuid) {
      console.warn(`⚠️ Warning: Category UUID not found for repo ${repo.full_name} with category_id ${repo.category_id}`);
    }

    return {
      category_id: categoryUuid,
      name: repo.name,
      owner: repo.owner,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.url,
      stars: repo.stars,
      language: repo.language,
      topics: repo.topics || [],
      sort_order: repo.sort_order,
      created_at: repo.created_at || new Date().toISOString(),
    };
  });

  // Batch insert in chunks of 50
  const BATCH_SIZE = 50;
  let insertedCount = 0;
  for (let i = 0; i < reposToInsert.length; i += BATCH_SIZE) {
    const chunk = reposToInsert.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.from('repositories').insert(chunk).select('id');
    if (error) {
      console.error(`❌ Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
    } else {
      insertedCount += data?.length || 0;
      console.log(`  Inserted batch ${i / BATCH_SIZE + 1} (${insertedCount}/${reposToInsert.length})`);
    }
  }

  console.log(`\n🎉 Synchronization Complete!`);
  console.log(`Categories in Supabase: ${insertedCategories.length}`);
  console.log(`Repositories in Supabase: ${insertedCount}`);
}

sync()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
