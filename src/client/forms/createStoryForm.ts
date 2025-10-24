import { showForm } from '@devvit/web/client';

export async function createStoryForm() {
  try {
    const result = await showForm({
      title: 'Create a Story',
      fields: [
        { type: 'string', name: 'story_name', label: 'Story Name' },
        { type: 'string', name: 'series', label: 'Series' },
        { type: 'number', name: 'chapter', label: 'Chapter #' },
        { type: 'paragraph', name: 'page_1_story', label: 'Page 1 Story Content' },
        { type: 'paragraph', name: 'page_2_story', label: 'Page 2 Story Content' },
        { type: 'paragraph', name: 'page_3_story', label: 'Page 3 Story Content' },
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

    // Construct poll options array (filter out blanks)
    const poll_options = [
      result.values.poll_option_1,
      result.values.poll_option_2,
      result.values.poll_option_3,
    ].filter(Boolean);

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
