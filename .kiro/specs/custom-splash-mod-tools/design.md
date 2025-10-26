# Design Document

## Overview

This design addresses the splash screen inconsistency by updating the mod tools post creation to use the same custom splash screen configuration as the story creation endpoint. The solution involves extracting the splash screen configuration into a reusable constant and updating the `createPost()` function to use the custom branding.

## Architecture

The current architecture has two separate splash screen configurations:

1. **Default Configuration** (in `post.ts`): Used by mod tools and app installation
2. **Custom Configuration** (in `/api/create-story`): Used by story creation interface

The proposed architecture consolidates these into a single, reusable splash screen configuration that maintains the custom branding across all post creation methods.

## Components and Interfaces

### Splash Screen Configuration

A centralized splash screen configuration object will be created to ensure consistency:

```typescript
interface SplashConfig {
  appDisplayName: string;
  backgroundUri: string;
  buttonLabel: string;
  description: string;
  heading: string;
  appIconUri: string;
  entryUri?: string;
}
```

### Updated Post Creation Function

The `createPost()` function will be updated to accept optional parameters while maintaining backward compatibility:

```typescript
export const createPost = async (customTitle?: string, customHeading?: string) => {
  // Implementation with custom splash screen
}
```

## Data Models

### Splash Screen Constants

```typescript
const CUSTOM_SPLASH_CONFIG: SplashConfig = {
  appDisplayName: 'LoreTogether',
  backgroundUri: 'lore-splash.png',
  buttonLabel: 'Lore Together',
  description: 'A Choose-your-own-story builder',
  heading: 'Welcome to LoreTogether!', // Default heading
  appIconUri: 'lore-icon.png',
  entryUri: 'index.html'
};
```

### Post Data Structure

The post data structure remains unchanged to maintain compatibility with existing functionality:

```typescript
interface PostData {
  gameState: string;
  score: number;
  [key: string]: any; // Allow additional properties for story posts
}
```

## Error Handling

### Asset Validation

- Verify that custom splash screen assets (`lore-splash.png`, `lore-icon.png`) exist in the assets directory
- Provide fallback to default assets if custom assets are missing
- Log warnings when fallback assets are used

### Configuration Validation

- Validate splash screen configuration parameters before post creation
- Handle missing or invalid configuration gracefully
- Maintain existing error handling for post creation failures

## Testing Strategy

### Manual Testing

1. **Mod Tools Testing**: Create posts via mod tools and verify custom splash screen appears
2. **Story Creation Testing**: Ensure story creation continues to work with custom splash screen
3. **App Installation Testing**: Verify app installation posts use custom splash screen
4. **Asset Loading Testing**: Confirm custom assets load correctly in Reddit interface

### Validation Points

- Splash screen displays correct branding elements
- Button label shows "Lore Together"
- Background uses `lore-splash.png`
- App icon uses `lore-icon.png`
- Description shows "A Choose-your-own-story builder"
- App display name shows "LoreTogether"

## Implementation Approach

### Phase 1: Extract Configuration

1. Create shared splash screen configuration constant
2. Update `createPost()` function to use custom configuration
3. Maintain backward compatibility for existing calls

### Phase 2: Update Endpoints

1. Update mod tools endpoint (`/internal/menu/post-create`) to use updated `createPost()`
2. Update app installation endpoint (`/internal/on-app-install`) to use updated `createPost()`
3. Verify story creation endpoint continues to work correctly

### Phase 3: Cleanup

1. Remove duplicate splash screen configuration from story creation endpoint
2. Use centralized configuration for consistency
3. Update any remaining hardcoded splash screen references

## Design Decisions

### Centralized Configuration

**Decision**: Create a single source of truth for splash screen configuration
**Rationale**: Reduces duplication, ensures consistency, simplifies maintenance

### Backward Compatibility

**Decision**: Maintain existing function signatures where possible
**Rationale**: Minimizes breaking changes and reduces testing overhead

### Asset Management

**Decision**: Keep existing asset files and naming convention
**Rationale**: Assets are already in place and working for story creation

### Default Heading Strategy

**Decision**: Use a generic default heading for mod tools posts, allow customization for story posts
**Rationale**: Mod tools posts don't have specific story names, so a generic heading is appropriate