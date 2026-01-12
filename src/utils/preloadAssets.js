// Utility to preload critical assets
export const preloadAssets = () => {
  return new Promise((resolve) => {
    const criticalAssets = [
      '/profile.png', // Hero section image
      '/models/about_bg.svg', // About section background
      '/models/Demo2.glb', // Brain model (optional, can load in background)
    ];

    let loadedCount = 0;
    const totalAssets = criticalAssets.length;
    const loadedAssets = new Set();

    const checkComplete = () => {
      if (loadedCount === totalAssets) {
        resolve(loadedAssets);
      }
    };

    criticalAssets.forEach((asset) => {
      if (asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.jpeg') || asset.endsWith('.svg')) {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          loadedAssets.add(asset);
          checkComplete();
        };
        img.onerror = () => {
          // Even if image fails, continue
          loadedCount++;
          checkComplete();
        };
        img.src = asset;
      } else {
        // For other assets, just mark as loaded (they'll load async)
        loadedCount++;
        loadedAssets.add(asset);
        checkComplete();
      }
    });

    // Fallback timeout - don't wait forever
    setTimeout(() => {
      if (loadedCount < totalAssets) {
        resolve(loadedAssets);
      }
    }, 5000);
  });
};

