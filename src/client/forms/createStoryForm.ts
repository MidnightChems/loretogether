import { showForm, showToast } from '@devvit/web/client';

export async function createStoryForm() {
  try {
    // Step 1: Get basic story info and number of pages
    const basicInfoResult = await showForm({
      title: 'Create a Story - Basic Information',
      fields: [
        {
          type: 'string',
          name: 'story_name',
          label: 'Story Name',
          helpText: 'Required - Give your story a title',
        },
        {
          type: 'string',
          name: 'series',
          label: 'Series',
          helpText: 'Required - What series does this story belong to?',
        },
        {
          type: 'number',
          name: 'chapter',
          label: 'Chapter #',
          helpText: 'Required - Chapter number (must be 1 or greater)',
        },
        {
          type: 'number',
          name: 'page_count',
          label: 'Number of Pages',
          helpText: 'Required - How many pages will your story have? (1-10)',
        },
      ],
    });

    if (basicInfoResult.action === 'CANCELED') {
      console.log('User cancelled the basic info form');
      return;
    }

    // Validate required fields
    if (!basicInfoResult.values.story_name || !basicInfoResult.values.story_name.trim()) {
      showToast('Please enter a story name');
      return;
    }

    if (!basicInfoResult.values.series || !basicInfoResult.values.series.trim()) {
      showToast('Please enter a series name');
      return;
    }

    const pageCount = Number(basicInfoResult.values.page_count);
    const chapterNumber = Number(basicInfoResult.values.chapter);

    // Validate chapter number
    if (!chapterNumber || chapterNumber < 1) {
      showToast('Please enter a valid chapter number (must be 1 or greater)');
      return;
    }

    // Validate page count
    if (!pageCount || pageCount < 1 || pageCount > 10) {
      showToast('Please enter a valid number of pages (1-10)');
      return;
    }

    // Step 2: Generate dynamic form fields based on page count
    const dynamicFields: any[] = [];

    // Add page content and personal choice fields for each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      // Page story content
      dynamicFields.push({
        type: 'paragraph',
        name: `page_${pageNum}_story`,
        label: `Page ${pageNum} Story Content`,
        helpText: 'Required - Write the story content for this page',
      });

      // Personal choice fields for this page
      dynamicFields.push({
        type: 'string',
        name: `page_${pageNum}_pc_prompt`,
        label: `Page ${pageNum} Personal Choice Question (optional)`,
        helpText:
          'Add an interactive choice for readers. Use {{choice_id}} in later pages to reference their selection.',
      });

      dynamicFields.push({
        type: 'string',
        name: `page_${pageNum}_pc_id`,
        label: `Page ${pageNum} Choice ID`,
        helpText:
          'Unique identifier for {{placeholders}} (e.g., "color", "name"). Required if prompt is provided.',
      });

      dynamicFields.push({
        type: 'string',
        name: `page_${pageNum}_pc_option_1`,
        label: 'Choice Option 1',
        helpText: 'First choice option for readers',
      });

      dynamicFields.push({
        type: 'string',
        name: `page_${pageNum}_pc_option_2`,
        label: 'Choice Option 2',
        helpText: 'Second choice option for readers',
      });

      dynamicFields.push({
        type: 'string',
        name: `page_${pageNum}_pc_option_3`,
        label: 'Choice Option 3 (optional)',
        helpText: 'Third choice option for readers',
      });
    }

    // Add poll fields at the end
    dynamicFields.push(
      { type: 'string', name: 'poll_question', label: 'End of Story Poll (optional)' },
      { type: 'string', name: 'poll_option_1', label: 'Poll Option 1' },
      { type: 'string', name: 'poll_option_2', label: 'Poll Option 2' },
      { type: 'string', name: 'poll_option_3', label: 'Poll Option 3' }
    );

    // Show the dynamic form
    const result = await showForm({
      title: `Create Story: ${basicInfoResult.values.story_name} (${pageCount} pages)`,
      fields: dynamicFields,
    });

    if (result.action === 'CANCELED') {
      console.log('User cancelled the story content form');
      return;
    }

    // Validate page content is provided for all pages
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const pageContent = result.values[`page_${pageNum}_story`];
      if (!pageContent || !pageContent.trim()) {
        showToast(`Please enter content for Page ${pageNum}`);
        return;
      }
    }

    // Validate personal choice data
    const validationErrors: string[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const prompt = result.values[`page_${pageNum}_pc_prompt`];
      const choiceId = result.values[`page_${pageNum}_pc_id`];
      const option1 = result.values[`page_${pageNum}_pc_option_1`];
      const option2 = result.values[`page_${pageNum}_pc_option_2`];
      const option3 = result.values[`page_${pageNum}_pc_option_3`];

      // If prompt is provided, validate requirements
      if (prompt && prompt.trim()) {
        // Require choice ID when prompt exists
        if (!choiceId || !choiceId.trim()) {
          validationErrors.push(
            `Page ${pageNum}: Choice ID is required when a personal choice prompt is provided.`
          );
        } else {
          // Validate choice ID format (alphanumeric, no spaces)
          if (!/^[a-zA-Z0-9_]+$/.test(choiceId.trim())) {
            validationErrors.push(
              `Page ${pageNum}: Choice ID must contain only letters, numbers, and underscores (no spaces).`
            );
          }
        }

        // Require at least 2 options
        const validOptions = [option1, option2, option3].filter((opt) => opt && opt.trim());
        if (validOptions.length < 2) {
          validationErrors.push(
            `Page ${pageNum}: At least 2 choice options are required when a personal choice prompt is provided.`
          );
        }
      }

      // If choice ID is provided without prompt, show error
      if (choiceId && choiceId.trim() && (!prompt || !prompt.trim())) {
        validationErrors.push(
          `Page ${pageNum}: Personal choice prompt is required when Choice ID is provided.`
        );
      }

      // If options are provided without prompt, show error
      const hasOptions = [option1, option2, option3].some((opt) => opt && opt.trim());
      if (hasOptions && (!prompt || !prompt.trim())) {
        validationErrors.push(
          `Page ${pageNum}: Personal choice prompt is required when choice options are provided.`
        );
      }
    }

    // Check for duplicate choice IDs
    const choiceIds: string[] = [];
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const choiceId = result.values[`page_${pageNum}_pc_id`];
      if (choiceId && choiceId.trim()) {
        const trimmedId = choiceId.trim();
        if (choiceIds.includes(trimmedId)) {
          validationErrors.push(
            `Choice ID "${trimmedId}" is used multiple times. Each choice ID must be unique.`
          );
        } else {
          choiceIds.push(trimmedId);
        }
      }
    }

    // If validation errors exist, show them and return
    if (validationErrors.length > 0) {
      console.error('Form validation errors:', validationErrors);
      // Show the first validation error as a toast
      showToast(`Validation Error: ${validationErrors[0]}`);
      return;
    }

    // Construct poll options array (filter out blanks)
    const poll_options = [
      result.values.poll_option_1,
      result.values.poll_option_2,
      result.values.poll_option_3,
    ].filter(Boolean);

    // Process personal choice data for each page
    const personalChoiceData: any = {};

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const prompt = result.values[`page_${pageNum}_pc_prompt`];
      const choiceId = result.values[`page_${pageNum}_pc_id`];
      const option1 = result.values[`page_${pageNum}_pc_option_1`];
      const option2 = result.values[`page_${pageNum}_pc_option_2`];
      const option3 = result.values[`page_${pageNum}_pc_option_3`];

      if (prompt && prompt.trim() && choiceId && choiceId.trim()) {
        // Create options array with unique IDs
        const options = [option1, option2, option3]
          .filter((opt) => opt && opt.trim())
          .map((text, index) => ({
            id: `${choiceId.trim()}_option_${index + 1}`,
            text: text.trim(),
          }));

        personalChoiceData[`page_${pageNum}_pc_id`] = choiceId.trim();
        personalChoiceData[`page_${pageNum}_pc_prompt`] = prompt.trim();
        personalChoiceData[`page_${pageNum}_pc_options`] = JSON.stringify(options);
      }
    }

    // Build the payload matching what backend expects
    const storyPageData: any = {};

    // Add all page story content dynamically
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      storyPageData[`page_${pageNum}_story`] = result.values[`page_${pageNum}_story`];
    }

    const payload = {
      values: {
        story_name: basicInfoResult.values.story_name,
        series: basicInfoResult.values.series,
        chapter: basicInfoResult.values.chapter,
        page_count: pageCount,
        poll_question: result.values.poll_question || null,
        poll_options,
        ...storyPageData,
        ...personalChoiceData,
      },
    };

    console.log('Submitting story to backend:', payload);

    const res = await fetch('/api/create-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log('Backend response:', data);

    // Handle response
    if (res.ok && data.status === 'success') {
      showToast('✅ Story created successfully!');
    } else {
      // Show error message from backend or generic error
      const errorMessage =
        data.message || data.errors?.[0] || 'Failed to create story. Please try again.';
      showToast(`❌ Error: ${errorMessage}`);
    }
  } catch (err) {
    console.error('Error showing form:', err);
    showToast('❌ An unexpected error occurred. Please try again.');
  }
}
