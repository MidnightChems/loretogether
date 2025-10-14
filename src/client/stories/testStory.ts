/** ---------- STORY DATA ---------- */
export const testStory = {
  id: "ep1",
  title: "Man and His Dog",
  series: "Alpha Run",
  chapter: 1,
  pages: [
    {
      id: "p1",
      text:
        "John kneeled beside his dog, Scout, before they left the house. Today was the day he’d finally buy a car — and Scout needed a new collar for the big day.",
      personalChoice: {
        id: "collar",
        prompt: "Which collar does John choose for Scout?",
        options: [
          { id: "blue", text: "Blue — calm and dependable." },
          { id: "red", text: "Red — bold and full of energy." },
          { id: "green", text: "Green — adventurous and fresh." },
        ],
      },
    },
    {
      id: "p2",
      text:
        "The sun was shining as John locked the door behind them. Scout trotted proudly in his new {{collar}} collar, tail wagging all the way to the curb.",
    },
    {
      id: "p3",
      text:
        "They turned into the dealership lot, rows of shiny vehicles sparkling under the morning sun. John couldn’t help but notice how the {{collar}} gleamed under the light — maybe it was a sign.",
    },
    {
      id: "p4",
      text:
        "The salesperson waved. “Looking for something sporty, rugged, or roomy?” John grinned, scratching Scout’s chin. “Let’s find out.”",
    },
  ],
  poll: {
    id: "ep1-final",
    question: "What should John test drive first?",
    options: ["Car", "SUV", "Truck"],
  },
};