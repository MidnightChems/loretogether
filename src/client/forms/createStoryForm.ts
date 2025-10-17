import { showForm } from '@devvit/web/client';

export async function createStoryForm() {
  try {
    const result = await showForm({
      title: 'Create a Story',
      fields: [
        {
            type: 'string',
            name: 'story_name',
            label: 'Story Name'
        },
        {
          type: 'paragraph',
          name: 'page_1_story',
          label: 'Page 1 Story Content',
        },
      ],
    });

    if (result.action === 'CANCELED') {
      console.log('User cancelled the form');
      return;
    }

    console.log('User entered story:', result);

   //submit formdata to API
    
  } catch (err) {
    console.error('Error showing form:', err);
  }

  
}
