# LoreTogether

**LoreTogether** is an interactive storytelling platform built on Reddit's Devvit platform where stories come alive through your choices! This innovative app allows users to create and experience personalized, choice-driven narratives with dynamic page counts (1-10 pages). Every decision you make gets seamlessly woven into the story using smart placeholder replacement, creating a unique reading experience that's different for every person.

## What Makes LoreTogether Innovative

- **Magic of Choice Integration**: Watch your decisions automatically appear throughout the story using special `{{tags}}` - choose "fire" as your element and see it woven seamlessly into every page where `{{element}}` appears
- **Personalized Reading Experience**: Every reader gets a unique story based on their choices - your "fire" element creates a completely different narrative than someone who chose "water" or "earth"
- **Dynamic Story Creation**: Build stories with 1-10 pages using an intelligent two-step form that adapts to your chosen page count, with built-in validation for choice consistency
- **Interactive Tutorial System**: New users experience a hands-on tutorial that demonstrates how personal choices, dynamic text replacement, and community polls work together
- **Community-Driven Outcomes**: Stories end with polls where ALL readers vote together on what happens next, creating shared narrative experiences and community engagement
- **Session Memory**: Your personal choices persist throughout your reading session - go back and change decisions to see how they ripple through the entire story
- **Real-time Community Feedback**: See live voting results with percentages and vote counts as the community shapes future story directions
- **Creator-Friendly Interface**: No technical knowledge required - intuitive forms guide you through creating complex interactive narratives with choice validation and placeholder management
- **Reddit Native Integration**: Built specifically for Reddit, enabling seamless sharing, commenting, and community discussion around interactive stories

## Technology Stack

- **[Devvit](https://developers.reddit.com/)**: Reddit's developer platform for building immersive apps
- **[React](https://react.dev/)**: Frontend UI framework
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development
- **[Express](https://expressjs.com/)**: Backend API server
- **[Vite](https://vite.dev/)**: Build tool and development server
- **[Tailwind CSS](https://tailwindcss.com/)**: Styling framework
- **Redis**: Data persistence for votes and user choices

## Getting Started

> **Prerequisites**: Node.js 22+ is required

1. Clone this repository
2. Run `npm install` to install dependencies
3. Set up your Devvit development environment:
   - Create a Reddit account if you don't have one
   - Visit [Reddit Developers](https://developers.reddit.com/) to set up your developer account
   - Run `npm run login` to authenticate with Reddit
4. Start development with `npm run dev`

## How to Play/Use LoreTogether

### For Story Readers

1. **Launch the Experience**: Click on any LoreTogether post in a Reddit community and hit "Launch App" to open the interactive story interface

2. **Start with the Tutorial**: New users automatically experience the "Welcome to LoreTogether!" tutorial that demonstrates all features:
   - Learn how personal choices work by selecting your magical element
   - Watch the magic happen as your choice appears throughout the story using `{{element}}` tags
   - Experience how each decision creates a unique, personalized narrative

3. **Navigate Stories**: 
   - Use the left arrow (◀) and right arrow (▶) buttons to move between story pages
   - The header shows your progress: "Page X / Y" along with series name and chapter
   - Your position is always saved - you can leave and return anytime

4. **Make Personal Choices**: 
   - When you see a personal choice prompt, select from the available options
   - Chosen options are highlighted in orange to show your selection
   - Your choices are automatically saved to your browser session

5. **Experience the Magic**: 
   - Watch your previous choices get dynamically inserted into story text
   - Placeholders like `{{element}}` become your actual selections (e.g., "fire", "water", "earth")
   - Go back to change choices and see the entire story update in real-time

6. **Shape the Community Story**: 
   - At the final page, participate in community polls about story outcomes
   - Vote once per story and see live results with percentages and vote counts
   - Your vote helps determine future story directions alongside other readers

7. **Become a Creator**: Click "✏️ Create Your Own Story" to access the intuitive story creation tools

### For Story Creators

1. **Access the Creation Form**: 
   - Complete a story as a reader, then click "Create Your Own Story"
   - Or use the moderator menu if you have permissions

2. **Step 1 - Basic Information**:
   - **Story Name**: The title that will appear on Reddit
   - **Series**: Group related stories together  
   - **Chapter**: Number for story organization
   - **Number of Pages**: Choose how many pages your story will have (1-10 pages)

3. **Step 2 - Story Content** (dynamic form based on page count):
   - **Write Story Pages**: For each page you specified, write your story content
   - **Use Placeholder Syntax**: Reference future choices with `{{choice_id}}` (e.g., `{{color}}`, `{{name}}`)
   - **Add Personal Choices** (optional for each page):
     - **Personal Choice Question**: The prompt readers will see (e.g., "What color does Sarah choose?")
     - **Choice ID**: A unique identifier for placeholders (e.g., "color" for `{{color}}`)
     - **Choice Options**: Provide 2-3 options readers can select from
   - **Validation**: The form ensures choice IDs are unique and properly formatted (letters, numbers, underscores only)

4. **Add End Poll** (optional):
   - Create a community poll question about the story outcome
   - Provide 2-3 voting options for readers

5. **Submit**: Your story gets posted to the Reddit community as an interactive post

### Interactive Tutorial Experience

LoreTogether includes a built-in tutorial story that demonstrates all core features:

**Page 1**: "Welcome to LoreTogether, where stories come alive through your choices! This interactive tutorial will show you how our app works. You're about to experience a personalized story that changes based on YOUR decisions. Let's start with your first choice - this will demonstrate how personal choices shape your unique story experience."
- *Personal Choice*: "Choose your magical element to see how choices work:"
- *Options*: "Fire — Watch how this choice affects the story!", "Water — Your selection will appear in future pages!", "Earth — Each choice creates a personalized experience!"

**Page 2**: "Great choice! Notice how your selection of {{element}} now appears in this text? This is the magic of LoreTogether - the {{element}} you chose is automatically inserted using special {{tags}}. Every time you see {{element}} in the story, it's replaced with your personal choice. This creates a unique, personalized reading experience just for you!"

**Page 3**: "As you continue reading, you'll see {{element}} appear multiple times throughout the story. The app remembers your choice and weaves it seamlessly into the narrative. This {{element}} magic demonstrates how LoreTogether makes every reader's journey unique. Your {{element}} choice will influence how other readers see your story too!"

**Page 4**: "You've learned how personal choices and dynamic text work! Now comes the final feature - community polls. At the end of each story, you'll see a poll where ALL readers can vote together on what happens next. This is how the LoreTogether community shapes future story directions. Your vote matters and helps determine where the adventure goes!"

**Community Poll**: "Now try the community poll feature - what tutorial topic should we cover next?"
- Options: "Advanced Story Features", "Creating Your Own Stories", "Community Voting Tips"

When you select "Fire" on Page 1, every instance of {{element}} throughout the story becomes "fire", creating a personalized magical narrative that's unique to your choice.

## Development Commands

- `npm run dev`: Start development server with live Reddit integration
- `npm run build`: Build client and server for production
- `npm run deploy`: Upload new version to Reddit
- `npm run launch`: Publish app for community review
- `npm run login`: Authenticate with Reddit developers
- `npm run check`: Run type checking, linting, and formatting

## Development Setup

This project uses a pre-configured development environment. For the best experience:

1. [Download Cursor IDE](https://www.cursor.com/downloads) 
2. Enable the `devvit-mcp` integration when prompted
3. Use `npm run dev` to start the development server
4. Test your changes live on Reddit using the provided playtest URL
