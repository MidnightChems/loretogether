# LoreTogether

**LoreTogether** is an interactive storytelling platform built on Reddit's Devvit platform that allows users to create and experience personalized, choice-driven stories with dynamic page counts (1-10 pages). Readers make decisions throughout the story that get seamlessly woven into the narrative using smart placeholder replacement, creating a unique and personalized experience for each person.

## What Makes LoreTogether Unique

- **Dynamic Story Length**: Create stories with 1-10 pages using an intelligent two-step form that adapts to your chosen page count
- **Personal Choice System**: Stories include interactive decision points where readers select options (like choosing a character's name, color preferences, or story paths) that get dynamically inserted into later story pages
- **Smart Placeholder Replacement**: Uses `{{variable}}` syntax to reference reader choices throughout the story, making each reading experience personalized and unique
- **Advanced Form Validation**: Built-in validation ensures choice IDs are unique, properly formatted, and logically consistent across all story pages
- **Community Polling**: Stories end with community polls where readers vote on story outcomes, creating engagement and discussion
- **Reddit Integration**: Built natively on Reddit, allowing for seamless sharing, commenting, and community interaction around stories
- **Creator-Friendly Interface**: Intuitive two-step story creation process that doesn't require technical knowledge to build complex interactive narratives
- **Session Persistence**: Your personal choices are saved throughout your reading session, allowing you to go back and change decisions
- **Real-time Poll Results**: See live voting results and percentages as the community participates in story polls

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

1. **Open a Story**: Click on any LoreTogether post in a Reddit community
2. **Click "Launch App"**: This opens the interactive story interface in a webview
3. **Navigate the Story**: 
   - Use the left arrow (◀) and right arrow (▶) buttons to move between story pages
   - The header shows your current progress: "Page X / Y" along with the series name and chapter
4. **Make Personal Choices**: 
   - When you encounter a personal choice prompt, you'll see a question with multiple options
   - Click on any option button to make your selection - selected choices are highlighted in orange
   - Your choices are automatically saved to your browser session
5. **Experience Dynamic Storytelling**: 
   - As you progress, watch your previous choices get inserted into the story text
   - Placeholders like "{{collar}}" will be replaced with your actual selections (e.g., "blue collar")
   - You can go back to previous pages to change your choices - the story will update accordingly
6. **Participate in Community Polls**: 
   - At the final page, vote in the community poll about story outcomes
   - Once you vote, you'll see real-time results showing percentages and vote counts
   - Each Reddit user can only vote once per story
7. **Create Your Own**: Click the "✏️ Create Your Own Story" button to access the story creation form

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

### Personal Choice System Example

Here's how the interactive storytelling works using the included test story:

**Page 1**: "John kneeled beside his dog, Scout, before they left the house. Today was the day he'd finally buy a car — and Scout needed a new collar for the big day."
- *Personal Choice*: "Which collar does John choose for Scout?"
- *Options*: "Blue — calm and dependable", "Red — bold and full of energy", "Green — adventurous and fresh"

**Page 2**: "The sun was shining as John locked the door behind them. Scout trotted proudly in his new {{collar}} collar, tail wagging all the way to the curb."

**Page 3**: "They turned into the dealership lot, rows of shiny vehicles sparkling under the morning sun. John couldn't help but notice how the {{collar}} gleamed under the light — maybe it was a sign."

When a reader selects "Blue — calm and dependable" on Page 1, Pages 2 and 3 will display "blue" wherever {{collar}} appears, creating a personalized narrative that reflects their choice.

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
