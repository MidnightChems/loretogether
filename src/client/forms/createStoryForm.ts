import { showForm } from '@devvit/web/client';

export async function createStoryForm() {
  try {
    const result = await showForm({
      title: 'Create a Story',
      fields: [
        { type: 'string', name: 'story_name', label: 'Story Name' },
        { type: 'string', name: 'series', label: 'Series' },
        { type: 'number', name: 'chapter', label: 'Chapter #' },
        
        // Page 1 fields
        { type: 'paragraph', name: 'page_1_story', label: 'Page 1 Story Content' },
        { type: 'string', name: 'page_1_pc_prompt', label: 'Page 1 Personal Choice Question (optional)', helpText: 'Add an interactive choice for readers. Use {{choice_id}} in later pages to reference their selection.' },
        { type: 'string', name: 'page_1_pc_id', label: 'Page 1 Choice ID', helpText: 'Unique identifier for {{placeholders}} (e.g., "color", "name"). Required if prompt is provided.' },
        { type: 'string', name: 'page_1_pc_option_1', label: 'Choice Option 1', helpText: 'First choice option for readers' },
        { type: 'string', name: 'page_1_pc_option_2', label: 'Choice Option 2', helpText: 'Second choice option for readers' },
        { type: 'string', name: 'page_1_pc_option_3', label: 'Choice Option 3 (optional)', helpText: 'Third choice option for readers' },
        
        // Page 2 fields
        { type: 'paragraph', name: 'page_2_story', label: 'Page 2 Story Content' },
        { type: 'string', name: 'page_2_pc_prompt', label: 'Page 2 Personal Choice Question (optional)', helpText: 'Add an interactive choice for readers. Use {{choice_id}} in later pages to reference their selection.' },
        { type: 'string', name: 'page_2_pc_id', label: 'Page 2 Choice ID', helpText: 'Unique identifier for {{placeholders}} (e.g., "weapon", "path"). Required if prompt is provided.' },
        { type: 'string', name: 'page_2_pc_option_1', label: 'Choice Option 1', helpText: 'First choice option for readers' },
        { type: 'string', name: 'page_2_pc_option_2', label: 'Choice Option 2', helpText: 'Second choice option for readers' },
        { type: 'string', name: 'page_2_pc_option_3', label: 'Choice Option 3 (optional)', helpText: 'Third choice option for readers' },
        
        // Page 3 fields
        { type: 'paragraph', name: 'page_3_story', label: 'Page 3 Story Content' },
        { type: 'string', name: 'page_3_pc_prompt', label: 'Page 3 Personal Choice Question (optional)', helpText: 'Add an interactive choice for readers. Use {{choice_id}} in later pages to reference their selection.' },
        { type: 'string', name: 'page_3_pc_id', label: 'Page 3 Choice ID', helpText: 'Unique identifier for {{placeholders}} (e.g., "ending", "decision"). Required if prompt is provided.' },
        { type: 'string', name: 'page_3_pc_option_1', label: 'Choice Option 1', helpText: 'First choice option for readers' },
        { type: 'string', name: 'page_3_pc_option_2', label: 'Choice Option 2', helpText: 'Second choice option for readers' },
        { type: 'string', name: 'page_3_pc_option_3', label: 'Choice Option 3 (optional)', helpText: 'Third choice option for readers' },
        
        // Poll fields
        { type: 'string', name: 'poll_question', label: 'End of Story Poll (optional)' },
        { type: 'string', name: 'poll_option_1', label: 'Poll Option 1' },
        { type: 'string', name: 'poll_option_2', label: 'Poll Option 2' },
        { type: 'string', name: 'poll_option_3', label: 'Poll Option 3' },
      ],
    });

    if (result.action === 'CANCELED') {
      console.log('User cancelled the form');
      return;
    }

    // Validate personal choice data
    const validationErrors: string[] = [];
    
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      const prompt = result.values[`page_${pageNum}_pc_prompt`];
      const choiceId = result.values[`page_${pageNum}_pc_id`];
      const option1 = result.values[`page_${pageNum}_pc_option_1`];
      const option2 = result.values[`page_${pageNum}_pc_option_2`];
      const option3 = result.values[`page_${pageNum}_pc_option_3`];
      
      // If prompt is provided, validate requirements
      if (prompt && prompt.trim()) {
        // Require choice ID when prompt exists
        if (!choiceId || !choiceId.trim()) {
          validationErrors.push(`Page ${pageNum}: Choice ID is required when a personal choice prompt is provided.`);
        } else {
          // Validate choice ID format (alphanumeric, no spaces)
          if (!/^[a-zA-Z0-9_]+$/.test(choiceId.trim())) {
            validationErrors.push(`Page ${pageNum}: Choice ID must contain only letters, numbers, and underscores (no spaces).`);
          }
        }
        
        // Require at least 2 options
        const validOptions = [option1, option2, option3].filter(opt => opt && opt.trim());
        if (validOptions.length < 2) {
          validationErrors.push(`Page ${pageNum}: At least 2 choice options are required when a personal choice prompt is provided.`);
        }
      }
      
      // If choice ID is provided without prompt, show error
      if (choiceId && choiceId.trim() && (!prompt || !prompt.trim())) {
        validationErrors.push(`Page ${pageNum}: Personal choice prompt is required when Choice ID is provided.`);
      }
      
      // If options are provided without prompt, show error
      const hasOptions = [option1, option2, option3].some(opt => opt && opt.trim());
      if (hasOptions && (!prompt || !prompt.trim())) {
        validationErrors.push(`Page ${pageNum}: Personal choice prompt is required when choice options are provided.`);
      }
    }
    
    // Check for duplicate choice IDs
    const choiceIds: string[] = [];
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      const choiceId = result.values[`page_${pageNum}_pc_id`];
      if (choiceId && choiceId.trim()) {
        const trimmedId = choiceId.trim();
        if (choiceIds.includes(trimmedId)) {
          validationErrors.push(`Choice ID "${trimmedId}" is used multiple times. Each choice ID must be unique.`);
        } else {
          choiceIds.push(trimmedId);
        }
      }
    }
    
    // If validation errors exist, show them and return
    if (validationErrors.length > 0) {
      console.error('Form validation errors:', validationErrors);
      // Note: In a real implementation, you'd want to show these errors to the user
      // For now, we'll log them and potentially show a toast
      alert('Validation errors:\n' + validationErrors.join('\n'));
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
    
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      const prompt = result.values[`page_${pageNum}_pc_prompt`];
      const choiceId = result.values[`page_${pageNum}_pc_id`];
      const option1 = result.values[`page_${pageNum}_pc_option_1`];
      const option2 = result.values[`page_${pageNum}_pc_option_2`];
      const option3 = result.values[`page_${pageNum}_pc_option_3`];
      
      if (prompt && prompt.trim() && choiceId && choiceId.trim()) {
        // Create options array with unique IDs
        const options = [option1, option2, option3]
          .filter(opt => opt && opt.trim())
          .map((text, index) => ({
            id: `${choiceId.trim()}_option_${index + 1}`,
            text: text.trim()
          }));
        
        personalChoiceData[`page_${pageNum}_pc_id`] = choiceId.trim();
        personalChoiceData[`page_${pageNum}_pc_prompt`] = prompt.trim();
        personalChoiceData[`page_${pageNum}_pc_options`] = JSON.stringify(options);
      }
    }

    // Build the payload matching what backend expects
    const payload = {
      values: {
        story_name: result.values.story_name,
        series: result.values.series,
        chapter: result.values.chapter,
        page_1_story: result.values.page_1_story,
        page_2_story: result.values.page_2_story,
        page_3_story: result.values.page_3_story,
        poll_question: result.values.poll_question || null,
        poll_options,
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
  } catch (err) {
    console.error('Error showing form:', err);
  }
}
