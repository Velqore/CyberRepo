import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FALLBACK_REPOSITORIES, FALLBACK_CATEGORIES, TECH_COMMUNITIES } from '../src/lib/curatedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_DIR = path.resolve(__dirname, '../public/api/v1');

// Ensure directory exists
if (!fs.existsSync(API_DIR)) {
  fs.mkdirSync(API_DIR, { recursive: true });
}

const exportData = (filename: string, data: any) => {
  const filePath = path.join(API_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Generated API endpoint: /api/v1/${filename}`);
};

async function generateApi() {
  console.log('Generating CyberRepo API endpoints...');
  
  // Clean up existing / format data if necessary
  const reposResponse = {
    metadata: {
      generatedAt: new Date().toISOString(),
      count: FALLBACK_REPOSITORIES.length,
      version: '1.0'
    },
    data: FALLBACK_REPOSITORIES
  };

  const categoriesResponse = {
    metadata: {
      generatedAt: new Date().toISOString(),
      count: FALLBACK_CATEGORIES.length,
      version: '1.0'
    },
    data: FALLBACK_CATEGORIES
  };

  const communitiesResponse = {
    metadata: {
      generatedAt: new Date().toISOString(),
      count: TECH_COMMUNITIES.length,
      version: '1.0'
    },
    data: TECH_COMMUNITIES
  };

  exportData('repos.json', reposResponse);
  exportData('categories.json', categoriesResponse);
  exportData('communities.json', communitiesResponse);

  console.log('✨ API generation complete!');
}

generateApi().catch(console.error);
