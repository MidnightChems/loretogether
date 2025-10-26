# Requirements Document

## Introduction

This feature addresses the inconsistency in splash screen configuration between different post creation methods in the Devvit application. Currently, when moderators create posts via mod tools, they see a default splash screen instead of the custom branded splash screen that appears when creating story posts through the application interface.

## Glossary

- **Mod Tools**: Reddit moderator interface that provides administrative actions for subreddit management
- **Splash Screen**: The visual interface displayed to users before they launch the full application, containing app branding, description, and launch button
- **Custom Post**: A Reddit post created through Devvit's submitCustomPost API with custom splash screen configuration
- **Post Creation Endpoint**: Server-side API endpoint that handles the creation of new posts when triggered by mod tools or app installation
- **Story Creation Endpoint**: Server-side API endpoint specifically for creating story posts with custom splash screen branding

## Requirements

### Requirement 1

**User Story:** As a moderator, I want to see the custom branded splash screen when I create posts via mod tools, so that the user experience is consistent across all post creation methods.

#### Acceptance Criteria

1. WHEN a moderator creates a post via mod tools, THE Post Creation Endpoint SHALL use the custom splash screen configuration with lore-splash.png background
2. WHEN a moderator creates a post via mod tools, THE Post Creation Endpoint SHALL use the custom app icon with lore-icon.png
3. WHEN a moderator creates a post via mod tools, THE Post Creation Endpoint SHALL display "LoreTogether" as the app display name
4. WHEN a moderator creates a post via mod tools, THE Post Creation Endpoint SHALL use "Lore Together" as the button label
5. WHEN a moderator creates a post via mod tools, THE Post Creation Endpoint SHALL display "A Choose-your-own-story builder" as the description

### Requirement 2

**User Story:** As a developer, I want consistent splash screen configuration across all post creation methods, so that maintenance is simplified and branding is unified.

#### Acceptance Criteria

1. THE Post Creation Endpoint SHALL use the same splash screen assets as the Story Creation Endpoint
2. THE Post Creation Endpoint SHALL maintain consistent branding elements across all creation methods
3. WHEN splash screen configuration changes, THE system SHALL require updates in only one location
4. THE Post Creation Endpoint SHALL preserve existing functionality while updating splash screen configuration