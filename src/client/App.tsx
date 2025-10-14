import React, { useEffect, useMemo, useState } from "react";

/** ---------- Types ---------- */
type PersonalOption = { id: string; text: string };
type PersonalChoice = { id: string; prompt: string; options: PersonalOption[] };
type Page = { id: string; text: string; personalChoice?: PersonalChoice };
type Poll = { id: string; question: string; options: string[] };
type Episode = {
  id: string;
  title: string;
  series: string;
  chapter: number;
  pages: Page[];
  poll: Poll;
};

import { testStory } from "./stories/testStory";
const EPISODE: Episode = testStory;

/** ---------- Styles ---------- */
const theme = {
  bg: "#0f0f0f",
  card: "#1a1a1b",
  subtle: "#aaaaaa",
  text: "#f5f5f5",
  border: "#2c2c2c",
  accent: "#ff4500",
  accentHover: "#ff6326",
};

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  background: theme.bg,
  color: theme.text,
  display: "flex",
  justifyContent: "center",
  padding: "24px",
  fontFamily: "Inter, system-ui, Arial, sans-serif",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 720,
  background: theme.card,
  border: `1px solid ${theme.border}`,
  borderRadius: 12,
  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
  padding: 20,
};

const hdr: React.CSSProperties = {
  textAlign: "center",
  paddingBottom: 12,
  marginBottom: 16,
  borderBottom: `1px solid ${theme.border}`,
};

const storyText: React.CSSProperties = {
  lineHeight: 1.65,
  fontSize: "1.125rem",
  minHeight: 120,
  marginBottom: 16,
};

const navRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 24,
};

const circleBtn = (disabled?: boolean): React.CSSProperties => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: `1px solid ${theme.border}`,
  background: disabled ? "#2a2a2a" : theme.accent,
  color: disabled ? "#666" : "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: 18,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 120ms ease",
});

const choiceBtn = (active: boolean): React.CSSProperties => ({
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  borderRadius: 8,
  border: `1px solid ${active ? theme.accent : theme.border}`,
  background: active ? "rgba(255,69,0,0.15)" : "#1c1c1e",
  color: theme.text,
  cursor: "pointer",
  marginTop: 8,
});

/** ---------- Mock API hooks ---------- */
async function fetchVotes(pollId: string): Promise<Record<string, number> | null> {
  void pollId;
  return null;
}
async function submitVote(pollId: string, option: string): Promise<void> {
  console.log("submitVote", pollId, option);
}

/** ---------- App ---------- */
export default function App() {
  const [pageIdx, setPageIdx] = useState(0);
  const [personal, setPersonal] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [pollSel, setPollSel] = useState<string | null>(null);
  const [pollCounts, setPollCounts] = useState<Record<string, number>>({});
  const atEnd = pageIdx === EPISODE.pages.length - 1;

  // Load personal choices from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("personalChoices");
    if (stored) setPersonal(JSON.parse(stored));
  }, []);

  // Save on update
  useEffect(() => {
    sessionStorage.setItem("personalChoices", JSON.stringify(personal));
  }, [personal]);

  // Poll setup
  useEffect(() => {
    const zeros: Record<string, number> = {};
    EPISODE.poll.options.forEach((opt) => (zeros[opt] = 0));
    setPollCounts(zeros);
  }, []);

  const totalVotes = useMemo(
    () => Object.values(pollCounts).reduce((a, b) => a + b, 0),
    [pollCounts]
  );

  const currentPage = EPISODE.pages[pageIdx];
  if (!currentPage) return <div>Loading story...</div>;

  // Dynamically replace {{placeholder}} values from player's choices
  const resolvedText = useMemo(() => {
    let text = currentPage.text;

    // Match {{variable}} patterns
    const matches = text.match(/{{(.*?)}}/g);
    if (!matches) return text;

    matches.forEach((token) => {
      const key = token.replace(/[{}]/g, ""); // remove curly braces
      const val = personal[key];
      if (val) {
        text = text.replace(new RegExp(token, "g"), val);
      }
    });

    return text;
  }, [currentPage.text, personal]);


  function onPickPersonal(choiceId: string, optionId: string) {
    setPersonal((prev) => ({ ...prev, [choiceId]: optionId }));
  }

  async function onPollVote(option: string) {
    if (hasVoted) return;
    setHasVoted(true);
    setPollSel(option);
    setPollCounts((prev) => ({ ...prev, [option]: (prev[option] ?? 0) + 1 }));
    try {
      await submitVote(EPISODE.poll.id, option);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={hdr}>
          <div style={{ fontSize: 12, color: theme.subtle }}>{EPISODE.series}</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{EPISODE.title}</div>
          <div style={{ fontSize: 12, color: theme.subtle }}>
            Chapter {EPISODE.chapter} · Page {pageIdx + 1} / {EPISODE.pages.length}
          </div>
        </div>

        <div style={storyText}>{resolvedText}</div>

        {/* Personal choice */}
        {currentPage.personalChoice && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 14, color: theme.subtle, marginBottom: 6 }}>
              {currentPage.personalChoice.prompt}
            </div>
            {currentPage.personalChoice.options.map((opt) => {
              const active = personal[currentPage.personalChoice!.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() =>
                    onPickPersonal(currentPage.personalChoice!.id, opt.id)
                  }
                  style={choiceBtn(active)}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div style={navRow}>
          <button
            style={circleBtn(pageIdx === 0)}
            disabled={pageIdx === 0}
            onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
          >
            ◀
          </button>

          {atEnd ? (
            <div style={{ flex: 1, margin: "0 12px" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                {EPISODE.poll.question}
              </div>
              {EPISODE.poll.options.map((opt) => {
                const count = pollCounts[opt] ?? 0;
                const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                const selected = pollSel === opt;
                return (
                  <div key={opt} style={{ marginTop: 8 }}>
                    <button
                      onClick={() => onPollVote(opt)}
                      disabled={hasVoted}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: `1px solid ${selected ? theme.accent : theme.border}`,
                        background: selected ? "rgba(255,69,0,0.15)" : "#1c1c1e",
                        color: theme.text,
                        cursor: hasVoted ? "default" : "pointer",
                      }}
                    >
                      {opt}
                    </button>
                    {hasVoted && (
                      <div style={{ marginTop: 6, fontSize: 12, color: theme.subtle }}>
                        {pct}% ({count} vote{count === 1 ? "" : "s"})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          <button
            style={circleBtn(pageIdx === EPISODE.pages.length - 1)}
            disabled={pageIdx === EPISODE.pages.length - 1}
            onClick={() =>
              setPageIdx((p) => Math.min(EPISODE.pages.length - 1, p + 1))
            }
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
