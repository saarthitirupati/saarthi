const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');
content = content.replace('import { XCircle, AlertTriangle, CheckCircle2, CloudLightning,', 'import {');
content = content.replace("} from 'lucide-react';", ", XCircle, AlertTriangle, CheckCircle2, CloudLightning } from 'lucide-react';");
fs.writeFileSync('src/app/page.tsx', content);
