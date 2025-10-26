/** ---------- STORY DATA ---------- */
export const testStory = {
  id: 'loretogether-tutorial',
  title: 'Welcome to LoreTogether!',
  series: 'App Tutorial',
  chapter: 1,
  pages: [
    {
      id: 'p1',
      text: "Welcome to LoreTogether, where stories come alive through your choices! This interactive tutorial will show you how our app works. You're about to experience a personalized story that changes based on YOUR decisions. Let's start with your first choice - this will demonstrate how personal choices shape your unique story experience.",
      personalChoice: {
        id: 'element',
        prompt: 'Choose your magical element to see how choices work:',
        options: [
          { id: 'fire', text: 'Fire' },
          { id: 'water', text: 'Water' },
          { id: 'earth', text: 'Earth' },
        ],
      },
    },
    {
      id: 'p2',
      text: "Great choice! Notice how your selection of {{element}} now appears in this text? This is the magic of LoreTogether - the element you chose is automatically inserted using special {{tags}}. Every time you see {{element}} in the story, it's replaced with your personal choice. This creates a unique, personalized reading experience just for you!",
    },
    {
      id: 'p3',
      text: "When creating your story, you'll set a Page Choice ID. Use that ID to display the user's selection. For example, if your Choice ID is color, you can use {{color}} to insert the user's choice.",
    },
    {
      id: 'p4',
      text: "You've learned how personal choices and dynamic text work! Now comes the final feature - community polls. At the end of each story, you'll see a poll where ALL readers can vote together on what happens next. This is how the LoreTogether community shapes future story directions. Your vote matters and helps determine where the adventure goes! - You’ve completed the tutorial! Now it’s your turn—create your own story below!",
    },
  ],
  poll: {
    id: 'tutorial-poll',
    question: 'Now try the community poll feature - what tutorial topic should we cover next?',
    options: ['Advanced Story Features', 'Creating Your Own Stories', 'Community Voting Tips'],
  },
};
