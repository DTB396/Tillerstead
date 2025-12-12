#!/bin/bash
# Make build scripts executable

chmod +x /workspaces/Tillerstead/rebuild.sh
chmod +x /workspaces/Tillerstead/quick-build.sh
chmod +x /workspaces/Tillerstead/scripts/generate-png-logos.js

echo "✅ Scripts are now executable"
echo ""
echo "You can now run:"
echo "  ./rebuild.sh        - Full clean rebuild"
echo "  ./quick-build.sh    - Fast rebuild with status"
echo "  npm run build:logos - Generate PNG logos"
