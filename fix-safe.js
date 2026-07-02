const fs = require('fs');

const fixes = [
  {
    file: 'src/app/api/admin/places/[id]/route.ts',
    replacements: [
      { find: 'const fs = require("fs");', replace: 'import fs from "fs";' },
      { find: 'const path = require("path");', replace: 'import path from "path";' }
    ]
  },
  {
    file: 'src/lib/adminDb.ts',
    replacements: [
      { find: 'const fs = require("fs");', replace: 'import fs from "fs";' }
    ]
  },
  {
    file: 'src/app/admin/places/new/page.tsx',
    replacements: [
      { find: 'BUDGET_LEVELS,', replace: '' },
      { find: 'BUDGET_LEVELS', replace: '' } 
    ]
  },
  {
    file: 'src/app/explore/page.tsx',
    replacements: [
      { find: 'const [loading, setLoading]', replace: 'const [, setLoading]' },
      { find: 'const [error, setError]', replace: 'const [, setError]' }
    ]
  },
  {
    file: 'src/app/page.tsx',
    replacements: [
      { find: 'const [loading, setLoading]', replace: 'const [, setLoading]' },
      { find: 'const [error, setError]', replace: 'const [, setError]' }
    ]
  },
  {
    file: 'src/app/generating/page.tsx',
    replacements: [
      { find: 'catch (e) {', replace: 'catch { // eslint-disable-line @typescript-eslint/no-unused-vars' }, 
      { find: 'catch (_e) {', replace: 'catch {' }
    ]
  },
  {
    file: 'src/app/place/[id]/page.tsx',
    replacements: [
      { find: 'catch (e) {', replace: 'catch {' },
      { find: 'catch (_e) {', replace: 'catch {' }
    ]
  },
  {
    file: 'src/store/useTripStore.ts',
    replacements: [
      { find: 'catch (_e) {', replace: 'catch {' },
      { find: 'catch (e) {', replace: 'catch {' }
    ]
  },
  {
    file: 'src/components/LiveStatus/LiveStatus.tsx',
    replacements: [
      { find: 'import { TirumalaStatus } from "@/types/place";', replace: '' },
      { find: 'import { TirumalaStatus,', replace: 'import {' },
      { find: 'const [loading, setLoading]', replace: 'const [, setLoading]' },
      { find: 'const roomMeta = roomData?.meta;', replace: '' },
      { find: 'const ladduMeta = ladduData?.meta;', replace: '' },
      { find: 'const flowMeta = flowData?.meta;', replace: '' }
    ]
  },
  {
    file: 'src/components/Navbar/Navbar.tsx',
    replacements: [
      { find: 'onProfileToggle?: () => void;', replace: '' },
      { find: 'onProfileToggle,', replace: '' }
    ]
  },
  {
    file: 'src/components/dashboard/SpotlightCard.tsx',
    replacements: [
      { find: 'const url = place.slug ?', replace: '/* const url = place.slug ? */' }
    ]
  },
  {
    file: 'src/components/planner/InterestSelector.tsx',
    replacements: [
      { find: 'const _unselectedPreviews = INTEREST_OPTIONS', replace: '/* const _unselectedPreviews = INTEREST_OPTIONS' },
      { find: '.map(opt => opt.label);', replace: '.map(opt => opt.label); */' }
    ]
  },
  {
    file: 'src/utils/plannerEngine.ts',
    replacements: [
      { find: 'const _poolBest = ', replace: '// const poolBest = ' }
    ]
  }
];

fixes.forEach(({ file, replacements }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    replacements.forEach(({ find, replace }) => {
      content = content.split(find).join(replace);
    });
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
