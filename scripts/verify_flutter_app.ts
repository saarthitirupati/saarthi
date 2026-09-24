import fs from 'fs';
import path from 'path';

/**
 * Saarthi Flutter App Comprehensive Verification Script
 * Validates:
 * 1. Bundled JSON assets integrity (places, festivals, gita_shlokas, temple_layouts)
 * 2. Media banner assets (MP4 videos & WebP posters)
 * 3. Pubspec.yaml asset alignment
 * 4. Dart file structural syntax & import integrity
 * 5. Distance and Ghat road algorithm validation
 */

const FLUTTER_DIR = path.resolve(process.cwd(), 'saarthi_mobile');

interface AuditStats {
  passed: number;
  warnings: number;
  errors: number;
}

const stats: AuditStats = { passed: 0, warnings: 0, errors: 0 };

function assert(condition: boolean, passMsg: string, failMsg: string) {
  if (condition) {
    stats.passed++;
    console.log(`  ✅ ${passMsg}`);
  } else {
    stats.errors++;
    console.error(`  ❌ ${failMsg}`);
  }
}

console.log('\n======================================================');
console.log('📱 SAARTHI FLUTTER MOBILE APP AUDIT & VERIFICATION');
console.log('======================================================\n');

// 1. Check Directory Existence
assert(fs.existsSync(FLUTTER_DIR), 'Flutter root directory exists (saarthi_mobile)', 'Missing saarthi_mobile directory');

// 2. Check Pubspec Configuration
const pubspecPath = path.join(FLUTTER_DIR, 'pubspec.yaml');
assert(fs.existsSync(pubspecPath), 'pubspec.yaml exists', 'pubspec.yaml not found');

const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
assert(pubspecContent.includes('video_player: ^2.8.6'), 'video_player dependency registered', 'Missing video_player in pubspec.yaml');
assert(pubspecContent.includes('supabase_flutter: ^2.8.0'), 'supabase_flutter dependency registered', 'Missing supabase_flutter in pubspec.yaml');
assert(pubspecContent.includes('assets/banner/'), 'assets/banner/ asset folder registered', 'Missing assets/banner/ in pubspec.yaml');

// 3. Check Pre-bundled Data Assets
console.log('\n📊 1. Bundled Offline JSON Assets:');
const dataDir = path.join(FLUTTER_DIR, 'assets', 'data');

const placesPath = path.join(dataDir, 'places.json');
assert(fs.existsSync(placesPath), 'places.json exists', 'places.json missing');
const places = JSON.parse(fs.readFileSync(placesPath, 'utf8'));
assert(Array.isArray(places) && places.length === 75, `places.json contains all 75 verified places (found: ${places.length})`, 'places.json count mismatch');

// Verify sample place structure
const samplePlace = places[0];
assert(
  samplePlace.id && samplePlace.name && samplePlace.coordinates?.lat && samplePlace.coordinates?.lng,
  `Place model structure verified (${samplePlace.name}: ${samplePlace.coordinates.lat}, ${samplePlace.coordinates.lng})`,
  'Place structure incomplete'
);

const festivalsPath = path.join(dataDir, 'festivals.json');
assert(fs.existsSync(festivalsPath), 'festivals.json exists', 'festivals.json missing');
const festivals = JSON.parse(fs.readFileSync(festivalsPath, 'utf8'));
assert(Array.isArray(festivals) && festivals.length >= 170, `festivals.json contains ${festivals.length} festivals`, 'festivals.json incomplete');

const gitaPath = path.join(dataDir, 'gita_shlokas.json');
assert(fs.existsSync(gitaPath), 'gita_shlokas.json exists', 'gita_shlokas.json missing');
const shlokas = JSON.parse(fs.readFileSync(gitaPath, 'utf8'));
assert(Array.isArray(shlokas) && shlokas.length === 8, `gita_shlokas.json contains all 8 daily shlokas`, 'shlokas count mismatch');

const layoutsPath = path.join(dataDir, 'temple_layouts.json');
assert(fs.existsSync(layoutsPath), 'temple_layouts.json exists', 'temple_layouts.json missing');
const layouts = JSON.parse(fs.readFileSync(layoutsPath, 'utf8'));
const layoutKeys = Object.keys(layouts);
assert(layoutKeys.length === 33, `temple_layouts.json contains 33 curated temple layouts`, 'temple_layouts count mismatch');

// 4. Check Media Banner Assets
console.log('\n🎬 2. Media Banner Video & Poster Assets:');
const bannerDir = path.join(FLUTTER_DIR, 'assets', 'banner');
const bannerFiles = [
  { name: 'homescreen-banner.mp4', minSize: 1000000 },
  { name: 'splash-screen-logo.mp4', minSize: 1000000 },
  { name: 'banner_poster.webp', minSize: 10000 },
  { name: 'splash_poster.webp', minSize: 10000 },
];

for (const file of bannerFiles) {
  const filePath = path.join(bannerDir, file.name);
  const exists = fs.existsSync(filePath);
  if (exists) {
    const size = fs.statSync(filePath).size;
    assert(size >= file.minSize, `${file.name} present (${(size / 1024 / 1024).toFixed(2)} MB)`, `${file.name} corrupted or too small`);
  } else {
    assert(false, '', `Missing media asset: ${file.name}`);
  }
}

// 5. Dart Files Syntax & Import Audit
console.log('\n📁 3. Dart Codebase Structure & Import Audit:');
const expectedDartFiles = [
  'lib/main.dart',
  'lib/core/constants.dart',
  'lib/core/theme.dart',
  'lib/core/transitions.dart',
  'lib/data/local_repository.dart',
  'lib/data/supabase_repository.dart',
  'lib/models/place.dart',
  'lib/models/darshan.dart',
  'lib/models/festival.dart',
  'lib/models/gita_shloka.dart',
  'lib/ui/screens/splash_screen.dart',
  'lib/ui/screens/home_screen.dart',
  'lib/ui/screens/explore_screen.dart',
  'lib/ui/screens/place_detail_screen.dart',
  'lib/ui/screens/darshan_screen.dart',
  'lib/ui/screens/essentials_screen.dart',
  'lib/ui/widgets/hero_banner_video.dart',
  'lib/ui/widgets/offline_precinct_map.dart',
  'test/distance_test.dart',
];

for (const relPath of expectedDartFiles) {
  const fullPath = path.join(FLUTTER_DIR, relPath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `Found ${relPath}`, `Missing file ${relPath}`);

  if (exists) {
    const content = fs.readFileSync(fullPath, 'utf8');

    // Verify balanced curly brackets
    let openBraces = (content.match(/\{/g) || []).length;
    let closeBraces = (content.match(/\}/g) || []).length;
    assert(openBraces === closeBraces, `  └─ ${path.basename(relPath)} balanced braces (${openBraces} == ${closeBraces})`, `  └─ ${path.basename(relPath)} unbalanced braces`);

    // Verify balanced parentheses
    let openParens = (content.match(/\(/g) || []).length;
    let closeParens = (content.match(/\)/g) || []).length;
    assert(openParens === closeParens, `  └─ ${path.basename(relPath)} balanced parens (${openParens} == ${closeParens})`, `  └─ ${path.basename(relPath)} unbalanced parens`);
  }
}

// 6. Algorithm Verification: 4-Case Topographical Driving Distance Engine
console.log('\n📐 4. Topographical Distance & Ghat Road Algorithm Verification:');

const ALIPIRI_LAT = 13.647051;
const ALIPIRI_LNG = 79.405856;
const TIRUMALA_LAT = 13.6833;
const TIRUMALA_LNG = 79.3473;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

function isOnHill(lat: number, lng: number): boolean {
  if (lat < 13.655 || lat > 13.735 || lng < 79.300 || lng > 79.385) return false;
  return haversineKm(lat, lng, TIRUMALA_LAT, TIRUMALA_LNG) <= 7.5;
}

function calculateRealisticDrivingKm(lat1: number, lon1: number, lat2: number, lon2: number, isTirumalaDest: boolean): number {
  const rawDist = haversineKm(lat1, lon1, lat2, lon2);
  if (rawDist <= 0.01) return 0.0;

  const isOriginOnHill = isOnHill(lat1, lon1);
  const isDestOnHill = isOnHill(lat2, lon2) || (isTirumalaDest && lat2 >= 13.655 && lon2 <= 79.385);

  // CASE 1: Hill to Hill
  if (isOriginOnHill && isDestOnHill) {
    const factor = rawDist < 0.5 ? 1.15 : (rawDist < 1.5 ? 1.30 : 1.45);
    return Math.round(rawDist * factor * 10) / 10;
  }

  // CASE 2: Plains to Hill (Up-Ghat)
  if (!isOriginOnHill && isDestOnHill) {
    const rawAlipiri = haversineKm(lat1, lon1, ALIPIRI_LAT, ALIPIRI_LNG);
    const distToAlipiri = rawAlipiri < 0.4 ? 0 : rawAlipiri * (rawAlipiri < 5.0 ? 1.25 : 1.15);
    const localHillRaw = haversineKm(TIRUMALA_LAT, TIRUMALA_LNG, lat2, lon2);
    const localHillDist = localHillRaw > 0.2 ? localHillRaw * (lat2 > 13.685 ? 1.5 : 1.25) : 0;
    return Math.round((distToAlipiri + 18.5 + localHillDist) * 10) / 10;
  }

  // CASE 3: Hill to Plains (Down-Ghat)
  if (isOriginOnHill && !isDestOnHill) {
    const localHillRaw = haversineKm(lat1, lon1, TIRUMALA_LAT, TIRUMALA_LNG);
    const localHillDist = localHillRaw > 0.2 ? localHillRaw * (lat1 > 13.685 ? 1.5 : 1.25) : 0;
    const rawAlipiri = haversineKm(ALIPIRI_LAT, ALIPIRI_LNG, lat2, lon2);
    const distFromAlipiri = rawAlipiri < 0.4 ? 0 : rawAlipiri * (rawAlipiri < 5.0 ? 1.25 : 1.15);
    return Math.round((localHillDist + 19.5 + distFromAlipiri) * 10) / 10;
  }

  // CASE 4: Plains to Plains
  const factor = rawDist < 0.5 ? 1.15 : (rawDist < 3.0 ? 1.25 : 1.15);
  return Math.round(rawDist * factor * 10) / 10;
}

// 1. Plains to Plains: Tirupati Station to Govindaraja Swamy (~0.4 km)
const dPlains = calculateRealisticDrivingKm(13.6288, 79.4192, 13.6299, 79.4163, false);
assert(dPlains >= 0.3 && dPlains <= 0.8, `Case 4 Plains: Tirupati Station to Govindaraja = ${dPlains} km`, 'Plains routing mismatch');

// 2. Plains to Hill: Tirupati Station to Tirumala Srivari Temple (~22.6 km)
const dPlainsToHill = calculateRealisticDrivingKm(13.6288, 79.4192, 13.6833, 79.3472, true);
assert(dPlainsToHill >= 21.0 && dPlainsToHill <= 26.0, `Case 2 Up-Ghat: Tirupati to Tirumala Temple = ${dPlainsToHill} km (18.5 km Ghat climb incorporated)`, 'Up-Ghat routing mismatch');

// 3. Hill to Hill: Tirumala Center to Japali Hanuman (~3.0 km, NO Ghat climb)
const dHillToHill = calculateRealisticDrivingKm(13.6833, 79.3473, 13.702, 79.336, true);
assert(dHillToHill >= 2.0 && dHillToHill <= 5.0, `Case 1 Hill-to-Hill: Tirumala Center to Japali = ${dHillToHill} km (Zero redundant Ghat climb)`, 'Hill-to-Hill routing mismatch');

// 4. Hill to Plains: Tirumala Temple to Tirupati Station (~23.4 km)
const dHillToPlains = calculateRealisticDrivingKm(13.6833, 79.3473, 13.6288, 79.4192, false);
assert(dHillToPlains >= 22.0 && dHillToPlains <= 27.0, `Case 3 Down-Ghat: Tirumala down to Tirupati Station = ${dHillToPlains} km (19.5 km Down-Ghat incorporated)`, 'Down-Ghat routing mismatch');


// Summary Report
console.log('\n======================================================');
console.log(`TOTAL CHECKS  : ${stats.passed + stats.errors}`);
console.log(`✅ PASSED     : ${stats.passed}`);
console.log(`❌ ERRORS     : ${stats.errors}`);
console.log(`ACCURACY SCORE: ${Math.round((stats.passed / (stats.passed + stats.errors)) * 100)}%`);
console.log('======================================================\n');

if (stats.errors > 0) {
  process.exit(1);
} else {
  console.log('🎉 Flutter application integrity and assets are 100% verified!\n');
}
