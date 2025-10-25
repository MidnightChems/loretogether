# Implementation Plan

- [x] 1. Extend story creation form with personal choice fields

  - Add personal choice form fields for each page (prompt, choice ID, and 3 option fields)
  - Implement conditional field display logic (show options only when prompt is provided)
  - Add form validation for personal choice data (require choice ID when prompt exists, minimum 2 options)
  - Update form field labels and help text to guide users on placeholder syntax usage
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 2. Update backend API to process personal choice data

  - Modify `/api/create-story` endpoint to handle personal choice form fields
  - Implement personal choice data validation (validate structure, choice ID format, option count)
  - Add personal choice option processing (convert individual option fields to structured arrays)
  - Implement JSON serialization for personal choice options before storage
  - Update postData structure to include personal choice fields for each page
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 2.1 Add backend validation tests for personal choice data processing

  - Write unit tests for personal choice data validation logic
  - Test JSON serialization and deserialization of option arrays
  - Test backward compatibility with existing story data structures
  - _Requirements: 4.1, 4.4, 4.5_

- [ ] 3. Enhance form data processing and submission logic

  - Update form submission logic in `createStoryForm.ts` to collect personal choice data
  - Implement client-side validation for personal choice fields before submission
  - Add error handling for personal choice data processing failures
  - Update payload construction to include personal choice data in correct format
  - _Requirements: 1.5, 2.4, 5.4_

- [ ] 3.1 Add form validation tests

  - Write tests for personal choice form field validation
  - Test conditional field display logic
  - Test form submission with various personal choice configurations
  - _Requirements: 1.5, 5.4_

- [ ] 4. Verify frontend rendering compatibility

  - Test that existing `getCurrentStory()` function correctly processes new personal choice data
  - Verify that personal choice rendering works with form-created stories
  - Test placeholder replacement functionality with form-generated personal choices
  - Ensure backward compatibility with stories that have no personal choices
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.3_

- [ ] 4.1 Add integration tests for personal choice rendering

  - Write tests for personal choice display and interaction
  - Test placeholder replacement with form-generated choices
  - Test user selection persistence and story text updates
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5. Add form field organization and user experience improvements
  - Group personal choice fields visually with their corresponding story page
  - Add helpful instructions and examples for using placeholder syntax
  - Implement progressive disclosure for personal choice fields (show/hide based on usage)
  - Add clear labeling to distinguish personal choice fields from story content fields
  - _Requirements: 5.1, 5.2, 5.3, 5.5_
