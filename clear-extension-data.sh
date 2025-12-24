#!/bin/bash

echo "🧹 Clearing ALL X Feed Blocker extension data from Safari..."
echo ""

# Kill Safari completely
echo "1. Closing Safari..."
killall Safari 2>/dev/null || true
sleep 3

# Get the bundle ID
BUNDLE_ID="com.thales.Twitter-Feed-Blocker.Extension"

echo "2. Clearing WebExtensions storage..."
# Clear all WebExtensions data
rm -rf ~/Library/Containers/com.apple.Safari/Data/Library/Safari/WebExtensions/* 2>/dev/null || true

echo "3. Clearing localStorage..."
# Clear all localStorage
rm -rf ~/Library/Containers/com.apple.Safari/Data/Library/Safari/LocalStorage/* 2>/dev/null || true

echo "4. Clearing IndexedDB..."
# Clear all IndexedDB
rm -rf ~/Library/Containers/com.apple.Safari/Data/Library/Safari/IndexedDB/* 2>/dev/null || true

echo "5. Clearing WebSQL..."
# Clear all WebSQL
rm -rf ~/Library/Containers/com.apple.Safari/Data/Library/Safari/WebSQL/* 2>/dev/null || true

echo "6. Clearing Safari caches..."
# Clear Safari caches
rm -rf ~/Library/Caches/com.apple.Safari/* 2>/dev/null || true

echo "7. Clearing Safari preferences for extensions..."
# Remove extension from Safari preferences
defaults delete com.apple.Safari 2>/dev/null || true

echo "8. Clearing extension files..."
# Remove extension files
rm -rf ~/Library/Safari/Extensions/* 2>/dev/null || true

echo ""
echo "✅ All extension data cleared!"
echo ""
echo "📝 IMPORTANT: Next steps:"
echo "   1. Open Safari"
echo "   2. Go to Safari > Settings > Extensions"
echo "   3. Remove 'X Feed Blocker' extension if it appears"
echo "   4. Rebuild and reinstall from Xcode"
echo ""
echo "💡 If data persists, try:"
echo "   - Safari > Develop > Empty Caches"
echo "   - Safari > Develop > Clear Storage"
echo "   - Restart Safari completely"
