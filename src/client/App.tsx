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

/** ---------- MOCK DATA (data-driven story) ---------- */
const EPISODE: Episode = {
  id: "ep1",
  title: "Man and His Dog",
  series: "Alpha Run",
  chapter: 1,
  pages: [
    {
      id: "p1",
      text:
        "John walked down the street with his dog, Scout. The sun was shining, and today was the day he’d finally buy a car.",
    },
    {
      id: "p2",
      text:
        "They turned into the dealership lot, rows of shiny vehicles sparkling under the morning sun.",
      personalChoice: {
        id: "pc1",
        prompt: "How does John hype up Scout?",
        options: [
          { id: "A", text: "“Buddy, we’re getting the FAST one.”" },
          { id: "B", text: "“Let’s find something comfy, pal.”" },
          { id: "C", text: "“Adventure wagon time!”" },
        ],
      },
    },
    {
      id: "p3",
      text:
        "The salesperson waved. “Looking for something sporty, rugged, or roomy?” Scout’s tail thumped.",
    },
    {
      id: "p4",
      text:
        "John glanced at Scout and smiled. (Your earlier vibe sticks with him here.)",
    },
  ],
  poll: {
    id: "ep1-final",
    question: "What should John test drive first?",
    options: ["Car", "SUV", "Truck"],
  },
};

/** ---------- Styles (no external deps) ---------- */
const theme = {
  bg: "#0f0f0f",
  card: "#1a1a1b",
  subtle: "#aaaaaa",
  text: "#f5f5f5",
  border: "#2c2c2c",
  accent: "#ff4500", // Reddit orange
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

/** ---------- Mock API hooks (default to 0 when backend absent) ---------- */
async function fetchVotes(pollId: string): Promise<Record<string, number> | null> {
  // TODO: replace with Devvit KV / backend call. Return null to default to zeroed counts.
  void pollId;
  return null;
}

async function submitVote(pollId: string, option: string): Promise<void> {
  // TODO: replace with Devvit backend call (rate-limit + user gating).
  console.log("submitVote", pollId, option);
}

/** ---------- App ---------- */
export default function App() {
  const [pageIdx, setPageIdx] = useState(0);

  // personal choices: choiceId -> optionId
  const [personal, setPersonal] = useState<Record<string, string>>({});

  // poll state
  const [hasVoted, setHasVoted] = useState(false);
  const [pollSel, setPollSel] = useState<string | null>(null);
  const [pollCounts, setPollCounts] = useState<Record<string, number>>({});

  const atEnd = pageIdx === EPISODE.pages.length - 1;

  // Initialize poll counts (default 0s) and then try to hydrate from backend
  useEffect(() => {
    const zeros: Record<string, number> = {};
    EPISODE.poll.options.forEach((opt) => (zeros[opt] = 0));
    setPollCounts(zeros);

    let mounted = true;
    (async () => {
      const res = await fetchVotes(EPISODE.poll.id);
      if (!mounted) return;
      if (res) {
        // Ensure all options exist
        const merged: Record<string, number> = { ...zeros, ...res };
        setPollCounts(merged);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const totalVotes = useMemo(
    () => Object.values(pollCounts).reduce((a, b) => a + b, 0),
    [pollCounts]
  );

  const currentPage = EPISODE.pages[pageIdx];
  if (!currentPage) {
  return <div>Loading story...</div>;
}

  // Replace inline reference with the player's earlier personal choice text (if any)
  const resolvedText = useMemo(() => {
    if (!currentPage.text.includes("(Your earlier vibe sticks with him here.)")) {
      return currentPage.text;
    }
    const picked = personal["pc1"];
    if (!picked) return currentPage.text;
    const map: Record<string, string> = {
      A: "John’s eyes sparkle — *fast* sounds right today.",
      B: "John rubs Scout’s ears — comfort first.",
      C: "John grins — the open road is calling.",
    };
    const flavor = map[picked] ?? "";
    return currentPage.text.replace(
      "(Your earlier vibe sticks with him here.)",
      flavor
    );
  }, [currentPage.text, personal]);

  function onPickPersonal(choiceId: string, optionId: string) {
    setPersonal((prev) => ({ ...prev, [choiceId]: optionId }));
  }

  async function onPollVote(option: string) {
    if (hasVoted) return;
    // optimistic update
    setHasVoted(true);
    setPollSel(option);
    setPollCounts((prev) => ({ ...prev, [option]: (prev[option] ?? 0) + 1 }));
    try {
      await submitVote(EPISODE.poll.id, option);
    } catch (e) {
      console.error(e);
      // rollback on failure
      setHasVoted(false);
      setPollSel(null);
      setPollCounts((prev) => ({ ...prev, [option]: Math.max(0, (prev[option] ?? 1) - 1) }));
    }
  }

  return (
    <div style={wrap}>
      <div style={card}>
        {/* Header */}
        <div style={hdr}>
          <div style={{ fontSize: 12, color: theme.subtle }}>{EPISODE.series}</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{EPISODE.title}</div>
          <div style={{ fontSize: 12, color: theme.subtle }}>
            Chapter {EPISODE.chapter} · Page {pageIdx + 1} / {EPISODE.pages.length}
          </div>
        </div>

        {/* Story text */}
        <div style={storyText}>{resolvedText}</div>

        {/* Personal choice (contextual, mid-story) */}
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
            {personal[currentPage.personalChoice.id] && (
              <div style={{ marginTop: 8, fontSize: 13, color: theme.subtle }}>
                You chose:{" "}
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  {
                    currentPage.personalChoice.options.find(
                      (o) => o.id === personal[currentPage.personalChoice!.id]
                    )?.text
                  }
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={navRow}>
          <button
            style={circleBtn(pageIdx === 0)}
            disabled={pageIdx === 0}
            onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
            aria-label="Previous page"
            title="Previous"
          >
            ◀
          </button>

          {/* End-of-episode poll */}
          {atEnd ? (
            <div style={{ flex: 1, margin: "0 12px" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                {EPISODE.poll.question}
              </div>
              {EPISODE.poll.options.map((opt) => {
                const count = pollCounts[opt] ?? 0;
                const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                const showResults = hasVoted; // only show after vote (per your rule)
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
                    {showResults && (
                      <div style={{ marginTop: 6, fontSize: 12, color: theme.subtle }}>
                        {pct}% ({count} vote{count === 1 ? "" : "s"})
                        <div
                          style={{
                            marginTop: 6,
                            height: 8,
                            background: "#262626",
                            borderRadius: 999,
                            overflow: "hidden",
                            border: `1px solid ${theme.border}`,
                          }}
                          aria-hidden
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background: theme.accent,
                              transition: "width 200ms ease",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {hasVoted && (
                <div style={{ marginTop: 10, fontSize: 12, color: theme.subtle }}>
                  Thanks for voting! Your choice helps steer the next chapter.
                </div>
              )}
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
            aria-label="Next page"
            title="Next"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
