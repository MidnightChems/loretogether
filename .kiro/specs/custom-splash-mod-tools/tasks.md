# Implementation Plan

- [x] 1. Create centralized splash screen configuration

  - Extract splash screen configuration into a shared constant in `src/server/core/post.ts`
  - Define TypeScript interface for splash screen configuration
  - Create `CUSTOM_SPLASH_CONFIG` constant with LoreTogether branding
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1_

- [x] 2. Update post creation function with custom splash screen

  - Modify `createPost()` function to use the custom splash screen configuration
  - Replace default splash screen assets with custom lore-splash.png and lore-icon.png
  - Update app display name to "LoreTogether" and button label to "Lore Together"
  - Set description to "A Choose-your-own-story builder"
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.2_

- [x] 3. Verify asset availability and update configuration

  - Confirm lore-splash.png and lore-icon.png exist in assets directory
  - Update splash screen configuration to reference correct asset files
  - Ensure entryUri points to correct entry point (index.html)
  - _Requirements: 1.1, 1.2, 2.1_

- [x] 4. Test mod tools post creation functionality







  - Manually test post creation via mod tools to verify custom splash screen appears
  - Verify all splash screen elements display correctly (background, icon, labels, description)
  - Confirm post creation still works without errors
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]\* 5. Test app installation post creation
  - Verify app installation trigger still creates posts with custom splash screen
  - Confirm backward compatibility with existing functionality
  - Test that post data structure remains unchanged
  - _Requirements: 2.2, 2.4_
