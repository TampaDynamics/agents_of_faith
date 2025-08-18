import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🧪 Testing Agents of Faith Setup...\n');

// Test 1: Check if seed data files exist
console.log('📁 Checking seed data files...');
const seedFiles = ['verses.jsonl', 'words.jsonl', 'misinterp.jsonl'];
let allFilesExist = true;

seedFiles.forEach(filename => {
  try {
    const filePath = join(process.cwd(), 'data/seed', filename);
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    console.log(`✅ ${filename}: ${lines.length} entries`);
  } catch (error) {
    console.log(`❌ ${filename}: File not found or unreadable`);
    allFilesExist = false;
  }
});

// Test 2: Check if lib files exist
console.log('\n📚 Checking library files...');
const libFiles = [
  'systemPrompt.ts',
  'embeddings.ts',
  'llm.ts',
  'retriever.ts',
  'postProcess.ts',
  'store/types.ts',
  'store/local.ts',
  'store/memory.ts',
  'store/opensearch.ts'
];

libFiles.forEach(filepath => {
  try {
    const fullPath = join(process.cwd(), 'lib', filepath);
    const content = readFileSync(fullPath, 'utf-8');
    console.log(`✅ ${filepath}: ${content.length} characters`);
  } catch (error) {
    console.log(`❌ ${filepath}: File not found or unreadable`);
  }
});

// Test 3: Check if app files exist
console.log('\n🌐 Checking app files...');
const appFiles = [
  'layout.tsx',
  'page.tsx',
  'ask/page.tsx',
  'api/ask/route.ts',
  'api/passage/route.ts',
  'api/word/route.ts',
  'api/admin/reindex/route.ts'
];

appFiles.forEach(filepath => {
  try {
    const fullPath = join(process.cwd(), 'app', filepath);
    const content = readFileSync(fullPath, 'utf-8');
    console.log(`✅ ${filepath}: ${content.length} characters`);
  } catch (error) {
    console.log(`❌ ${filepath}: File not found or unreadable`);
  }
});

// Test 4: Check configuration files
console.log('\n⚙️  Checking configuration files...');
const configFiles = ['package.json', 'tsconfig.json', 'next.config.js', '.eslintrc.json', '.prettierrc'];
configFiles.forEach(filename => {
  try {
    const filePath = join(process.cwd(), filename);
    const content = readFileSync(filePath, 'utf-8');
    console.log(`✅ ${filename}: ${content.length} characters`);
  } catch (error) {
    console.log(`❌ ${filename}: File not found or unreadable`);
  }
});

console.log('\n🎯 Setup Test Complete!');
console.log('\nNext steps:');
console.log('1. Copy env.example to .env.local and add your OpenAI API key');
console.log('2. Run: npm install');
console.log('3. Run: npm run seed (if using LanceDB)');
console.log('4. Run: npm run dev');

if (!allFilesExist) {
  console.log('\n⚠️  Some files are missing. Please check the file structure.');
  process.exit(1);
} else {
  console.log('\n✨ All files are present! Your setup looks good.');
}
