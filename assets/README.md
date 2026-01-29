# Assets Directory

This directory should contain the following files for the app to work properly:

## Required Assets

### `icon.png` - App Icon
- **Dimensions**: 1024×1024 px (square, PNG)
- **Usage**: Used for iOS and Android app icons
- **Notes**: Expo will automatically scale this for different device sizes

### `splash.png` - Splash Screen
- **Dimensions**: 1242×2436 px (portrait, PNG) or 2048×2732 px for higher quality
- **Usage**: Displayed when the app is launching
- **Notes**: Should match your app's orientation (portrait in this case)

### `adaptive-icon.png` - Android Adaptive Icon
- **Dimensions**: 1024×1024 px (square, PNG)
- **Usage**: Foreground image for Android adaptive icons
- **Notes**: Keep important content within the center 432×432 px safe zone to ensure it displays correctly on all Android devices

### `favicon.png` - Web Favicon
- **Dimensions**: 48×48 px or 32×32 px (square, PNG)
- **Usage**: Browser tab icon for web version
- **Notes**: Can also use 16×16 px, 64×64 px, or 128×128 px

## Optional Assets

- `metronome-click.mp3` - Metronome click sound file. If you add this file, uncomment the sound loading code in `src/components/Metronome.js` to enable audio clicks.

## Creating Placeholder Assets

For development, you can create simple placeholder images or use online tools to generate app icons and splash screens. The Expo documentation provides guidance on asset requirements.

