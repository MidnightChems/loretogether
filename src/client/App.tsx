import React, { useState } from "react";

type Screen = "story" | "poll" | "personal";
type VoteOption = "Choice 1" | "Choice 2" | "Choice 3";
type PersonalOption = "Option A" | "Option B" | "Option C";

const storyPages = [
  "John walked down the street with his dog, Scout. The sun was shining, and today was the day he’d finally buy a car.",
  "They turned into the dealership lot, rows of shiny vehicles sparkling under the morning sun.",
  "Scout barked excitedly — he loved car rides, no matter what they were in."
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("story");
  const [page, setPage] = useState(0);

  // --- POLL STATE ---
  const [pollSelected, setPollSelected] = useState<VoteOption | null>(null);
  const [pollVotes, setPollVotes] = useState<Record<VoteOption, number>>({
    "Choice 1": 5,
    "Choice 2": 9,
    "Choice 3": 5
  });
  const [hasVotedPoll, setHasVotedPoll] = useState(false);

  // --- PERSONAL CHOICE STATE ---
  const [personalChoice, setPersonalChoice] = useState<PersonalOption | null>(null);

  const totalPollVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);

  const handlePollVote = (option: VoteOption) => {
    if (hasVotedPoll) return;
    setPollSelected(option);
    setPollVotes(prev => ({ ...prev, [option]: prev[option] + 1 }));
    setHasVotedPoll(true);
  };

  const handlePersonalSelect = (option: PersonalOption) => {
    setPersonalChoice(option);
  };

  const renderHeader = () => (
    <div style={{
      borderBottom: "1px solid #ccc",
      paddingBottom: "8px",
      marginBottom: "12px",
      textAlign: "center"
    }}>
      <h3>LoreTogether</h3>
      <div>Story Name — Chapter {page + 1}</div>
      <div>Series #1</div>
    </div>
  );

  const renderStoryScreen = () => (
    <div>
      {renderHeader()}
      <p style={{ minHeight: "100px" }}>{storyPages[page]}</p>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "40px"
      }}>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{ fontSize: "20px", padding: "8px 16px" }}
        >
          ◀
        </button>
        <button
          onClick={() => setPage(p => Math.min(storyPages.length - 1, p + 1))}
          disabled={page === storyPages.length - 1}
          style={{ fontSize: "20px", padding: "8px 16px" }}
        >
          ▶
        </button>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => setScreen("poll")}>Go to Poll</button>
        <button onClick={() => setScreen("personal")} style={{ marginLeft: "10px" }}>
          Personal Choice
        </button>
      </div>
    </div>
  );

  const renderPollScreen = () => (
    <div>
      {renderHeader()}
      <h4>What should happen next?</h4>
      {(["Choice 1", "Choice 2", "Choice 3"] as VoteOption[]).map(option => {
        const percent = ((pollVotes[option] / totalPollVotes) * 100).toFixed(1);
        return (
          <div
            key={option}
            onClick={() => handlePollVote(option)}
            style={{
              margin: "10px 0",
              padding: "10px",
              border: pollSelected === option ? "2px solid black" : "1px solid #ccc",
              borderRadius: "6px",
              cursor: hasVotedPoll ? "default" : "pointer"
            }}
          >
            {option}
            {hasVotedPoll && (
              <span style={{ marginLeft: "10px", fontSize: "0.9em", color: "#444" }}>
                {percent}% ({pollVotes[option]} votes)
              </span>
            )}
          </div>
        );
      })}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setScreen("story")}>Back to Story</button>
      </div>
    </div>
  );

  const renderPersonalScreen = () => (
    <div>
      {renderHeader()}
      <h4>What should John say to Scout?</h4>
      {(["Option A", "Option B", "Option C"] as PersonalOption[]).map(option => (
        <div
          key={option}
          onClick={() => handlePersonalSelect(option)}
          style={{
            margin: "10px 0",
            padding: "10px",
            border: personalChoice === option ? "2px solid black" : "1px solid #ccc",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          {option}
        </div>
      ))}
      {personalChoice && (
        <div style={{ marginTop: "20px", fontStyle: "italic" }}>
          You chose: <b>{personalChoice}</b>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setScreen("story")}>Back to Story</button>
      </div>
    </div>
  );

  if (screen === "story") return renderStoryScreen();
  if (screen === "poll") return renderPollScreen();
  if (screen === "personal") return renderPersonalScreen();
  return null;
}
