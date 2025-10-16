import React, { useEffect, useMemo, useState } from "react";
import { showToast } from '@devvit/web/client';

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

import {
  theme,
  wrap,
  card,
  hdr,
  storyText,
  navRow,
  circleBtn,
  choiceBtn,
} from "./styles/theme";

import { testStory } from "./stories/testStory";
const EPISODE: Episode = testStory;


/** ---------- API hooks ---------- */
async function fetchVotes(pollId: string): Promise<Record<string, number>> {
  const res = await fetch(`/api/votes/${pollId}`);
  const data = await res.json();
  const counts = data.counts || {};
  
  // Normalize all values to numbers
  const numericCounts: Record<string, number> = {};
  Object.entries(counts).forEach(([key, val]) => {
    numericCounts[key] = Number(val) || 0;
  });

  return numericCounts;
}

async function submitVote(pollId: string, option: string): Promise<Response> {
  return fetch(`/api/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pollId, option }),
  });
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
  // Poll setup: load from Redis
  useEffect(() => {
    async function initPoll() {
      const zeros: Record<string, number> = {};
      EPISODE.poll.options.forEach((opt) => (zeros[opt] = 0));
      setPollCounts(zeros);

      try {
        const counts = await fetchVotes(EPISODE.poll.id);
        setPollCounts((prev) => ({ ...prev, ...counts }));
      } catch (err) {
        console.error("Error fetching votes:", err);
      }
    }

    initPoll();
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
      const res = await submitVote(EPISODE.poll.id, option);

      if (res.status === 403) {
        showToast("You've already voted on this story post.");
        setHasVoted(false);
      }

    } catch (e) {
      setHasVoted(false);
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
