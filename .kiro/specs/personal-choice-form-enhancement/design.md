# Design Document

## Overview

This design extends the existing story creation form to support personal choices (PC) that can be referenced later in story pages. The solution maintains backward compatibility with existing stories while adding new form fields and data structures to support interactive story elements.

The design leverages the existing Devvit form system and extends the current data flow from form submission through backend storage to frontend rendering. Personal choices will be stored as structured data alongside story content and rendered using the existing placeholder replacement system.

## Architecture

### Current Architecture
- **Frontend Form**: `createStoryForm.ts` uses Devvit's `showForm` API
- **Backend API**: `/api/create-story` processes form data and creates Reddit posts
- **Data Storage**: Story data stored in Reddit post's `postData` field
- **Frontend Rendering**: `App.tsx` reads `postData` and renders story with placeholder replacement

### Enhanced Architecture
The personal choice feature integrates into each layer:

1. **Form Layer**: Extended form fields for personal choice configuration
2. **Data Layer**: Enhanced data structures for personal choice storage
3. **API Layer**: Updated backend processing for personal choice data
4. **Rendering Layer**: Existing placeholder system already supports personal choices

## Components and Interfaces

### Form Enhancement

#### New Form Fields Structure
```typescript
// For each page (1-3), add optional personal choice fields
{
  type: 'string', 
  name: 'page_1_pc_prompt', 
  label: 'Page 1 Personal Choice Question (optional)'
},
{
  type: 'string', 
  name: 'page_1_pc_id', 
  label: 'Page 1 Choice ID (for {{placeholders}})'
},
{
  type: 'string', 
  name: 'page_1_pc_option_1', 
  label: 'Choice Option 1'
},
{
  type: 'string', 
  name: 'page_1_pc_option_2', 
  label: 'Choice Option 2'
},
{
  type: 'string', 
  name: 'page_1_pc_option_3', 
  label: 'Choice Option 3'
}
```

#### Form Field Organization
- Group personal choice fields after each page's story content
- Use conditional field display (show PC options only if prompt is provided)
- Provide clear labeling and help text for placeholder usage

### Data Models

#### Enhanced PostData Structure
```typescript
interface EnhancedPostData {
  // Existing fields
  story_name: string;
  series: string;
  chapter: number;
  page_1_story: string;
  page_2_story: string;
  page_3_story: string;
  poll_question?: string;
  poll_options?: string[];
  poll_id?: string;
  
  // New personal choice fields
  page_1_pc_id?: string;
  page_1_pc_prompt?: string;
  page_1_pc_options?: string; // JSON serialized PersonalOption[]
  page_2_pc_id?: string;
  page_2_pc_prompt?: string;
  page_2_pc_options?: string; // JSON serialized PersonalOption[]
  page_3_pc_id?: string;
  page_3_pc_prompt?: string;
  page_3_pc_options?: string; // JSON serialized PersonalOption[]
}
```

#### Personal Choice Data Structure
```typescript
interface PersonalOption {
  id: string;    // unique identifier for the option
  text: string;  // display text for the option
}

interface PersonalChoice {
  id: string;           // unique identifier for the choice (used in {{placeholders}})
  prompt: string;       // question/prompt text
  options: PersonalOption[];  // available options
}
```

### Backend Processing

#### Form Data Processing
1. **Validation**: Check that if PC prompt is provided, at least 2 options exist
2. **Option Processing**: Convert individual option fields into structured array
3. **Serialization**: Convert option arrays to JSON strings for storage
4. **ID Generation**: Generate unique option IDs if not provided

#### Data Transformation Flow
```
Form Input → Validation → Option Array Creation → JSON Serialization → PostData Storage
```

### Frontend Integration

#### Form Field Conditional Logic
- Show personal choice option fields only when prompt is filled
- Validate that choice ID is provided if prompt exists
- Ensure at least 2 options are provided for each personal choice

#### Rendering Integration
The existing `getCurrentStory()` function already supports personal choices:
- Parses `page_X_pc_*` fields from postData
- Constructs PersonalChoice objects
- Existing placeholder replacement system handles `{{variable}}` syntax

## Error Handling

### Form Validation
- **Empty Prompt with Options**: Show error if options provided without prompt
- **Missing Choice ID**: Require choice ID when prompt is provided
- **Insufficient Options**: Require at least 2 options for each personal choice
- **Invalid Choice ID**: Validate choice ID format (alphanumeric, no spaces)
- **Duplicate Choice IDs**: Ensure choice IDs are unique across all pages

### Backend Validation
- **JSON Parsing**: Handle malformed option data gracefully
- **Data Structure**: Validate personal choice data structure before storage
- **Backward Compatibility**: Handle stories without personal choice data

### Runtime Error Handling
- **Missing Placeholder Values**: Handle undefined placeholder references gracefully
- **Invalid JSON**: Fallback to empty options array if JSON parsing fails
- **Rendering Errors**: Continue story rendering even if personal choice data is corrupted

## Testing Strategy

### Form Testing
- **Field Visibility**: Test conditional display of personal choice fields
- **Validation Logic**: Test all validation scenarios (empty prompts, missing IDs, etc.)
- **Data Submission**: Verify correct form data structure is submitted

### Backend Testing
- **Data Processing**: Test personal choice data transformation and storage
- **Validation**: Test backend validation of personal choice data
- **Backward Compatibility**: Test that existing stories continue to work

### Integration Testing
- **End-to-End Flow**: Test complete flow from form submission to story rendering
- **Placeholder Resolution**: Test that personal choices are correctly referenced in story text
- **User Interaction**: Test personal choice selection and persistence

### Edge Case Testing
- **No Personal Choices**: Stories without personal choices should work normally
- **Partial Personal Choices**: Some pages with choices, others without
- **Invalid Placeholder References**: Handle `{{nonexistent}}` placeholders gracefully

## Implementation Considerations

### Form UX Design
- **Progressive Disclosure**: Show personal choice fields only when needed
- **Clear Instructions**: Provide help text explaining placeholder syntax
- **Field Grouping**: Visually group personal choice fields with their corresponding page
- **Validation Feedback**: Provide immediate feedback on validation errors

### Performance Considerations
- **Form Size**: Additional fields increase form complexity but remain manageable
- **Data Storage**: JSON serialization adds minimal storage overhead
- **Rendering Performance**: Existing placeholder replacement is already optimized

### Backward Compatibility
- **Existing Stories**: All existing stories continue to work without changes
- **Optional Fields**: All personal choice fields are optional
- **Data Migration**: No data migration required

### Future Extensibility
- **Dynamic Pages**: Design supports future expansion to variable page counts
- **Choice Types**: Structure allows for future choice type extensions
- **Advanced Placeholders**: Foundation for more complex placeholder features

## Design Decisions and Rationales

### Field Naming Convention
**Decision**: Use `page_X_pc_*` naming pattern
**Rationale**: Consistent with existing `page_X_story` pattern, clearly identifies personal choice fields

### JSON Serialization for Options
**Decision**: Store options as JSON strings in postData
**Rationale**: Reddit postData has limitations on nested objects; JSON strings provide flexibility while maintaining structure

### Choice ID as Separate Field
**Decision**: Require explicit choice ID input rather than auto-generating
**Rationale**: Gives story creators control over placeholder names, making them more meaningful and memorable

### Optional Personal Choices
**Decision**: All personal choice fields are optional
**Rationale**: Maintains backward compatibility and allows creators to add choices only where needed

### Reuse Existing Placeholder System
**Decision**: Leverage existing `{{variable}}` replacement logic
**Rationale**: Avoids code duplication and ensures consistent behavior with existing test story functionality