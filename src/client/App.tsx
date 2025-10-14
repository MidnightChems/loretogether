import React, { useState } from "react";

type VoteOption = "Car" | "SUV" | "Truck";

const storyPages: string[] = [
  "John walked down the street with his dog, Scout. The sun was shining, and today was the day he’d finally buy a car.",
  "They turned into the dealership lot, rows of shiny vehicles sparkling under the morning sun.",
  "Scout barked excitedly — he loved car rides, no matter what they were in."
];

export default function App() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<VoteOption | null>(null);
  const [votes, setVotes] = useState<Record<VoteOption, number>>({
    Car: 5,
    SUV: 3,
    Truck: 2
  });
  const [showResults, setShowResults] = useState(false);

  const handleVote = (option: VoteOption) => {
    if (selected) return;
    setSelected(option);
    setVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1
    }));
    setShowResults(true);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f6f7f8",
      minHeight: "100vh",
      padding: "32px",
      display: "flex",
      justifyContent: "center",
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "24px",
        maxWidth: "700px",
        width: "100%"
      }}>
        <h1 style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          textAlign: "center"
        }}>Choose Our Lore, together.</h1>

        <p style={{
          textAlign: "center",
          color: "#787c7e",
          marginBottom: "24px"
        }}>Navigate through the story and decide what happens on the next episode!</p>

        <div style={{
          border: "1px solid #edeff1",
          borderRadius: "8px",
          padding: "20px",
          background: "#fff",
        }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>The Test Drive</h2>
          <p style={{ color: "#787c7e", marginBottom: "1rem" }}>
            Page {page + 1} of {storyPages.length}
          </p>

          <p style={{ lineHeight: 1.5, marginBottom: "1.5rem" }}>{storyPages[page]}</p>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {page > 0 && (
              <button
                onClick={() => setPage(p => p - 1)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#000000ff",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                ← Back
              </button>
            )}
            {page < storyPages.length - 1 ? (
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  backgroundColor: "#000000ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Forward →
              </button>
            ) : null}
          </div>
        </div>

        {page === storyPages.length - 1 && (
          <div style={{ marginTop: "32px" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>What should John test drive first?</h3>
            {!showResults ? (
              <div>
                {(["Car", "SUV", "Truck"] as VoteOption[]).map(option => (
                  <button
                    key={option}
                    onClick={() => handleVote(option)}
                    style={{
                      display: "block",
                      width: "100%",
                      background: selected === option ? "#0079d3" : "#f6f7f8",
                      color: selected === option ? "#fff" : "#1a1a1b",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      padding: "10px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {(["Car", "SUV", "Truck"] as VoteOption[]).map(option => {
                  const percent = ((votes[option] / totalVotes) * 100).toFixed(1);
                  return (
                    <div key={option} style={{
                      marginBottom: "8px",
                      background: "#f6f7f8",
                      borderRadius: "6px",
                      padding: "10px"
                    }}>
                      {option}: {percent}% ({votes[option]} votes)
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
