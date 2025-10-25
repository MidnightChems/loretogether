import React, { useEffect, useMemo, useState } from 'react';
import { showToast, context } from '@devvit/web/client';
import { createStoryForm } from './forms/createStoryForm';

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
  poll: Poll | null;
};

import { theme, wrap, card, hdr, storyText, navRow, circleBtn, choiceBtn } from './styles/theme';

import { testStory } from './stories/testStory';

const EPISODE = getCurrentStory(context) || testStory;

function getCurrentStory(context: any) {
  if (context?.postData) {
    const data = context.postData;

    if (!data.story_name && !data[`page_1_story`]) {
      return null; // No valid story data, will fall back to testStory
    }

    const pages: any[] = [];

    // Handle dynamic pages (page_1_story, page_2_story, ...)
    let pageIndex = 1;
    console.log('postData keys:', Object.keys(data));

    while (data[`page_${pageIndex}_story`]) {
      const page: any = {
        id: `p${pageIndex}`,
        text: data[`page_${pageIndex}_story`],
      };

      // Optional personal choice data for each page
      if (data[`page_${pageIndex}_pc_id`]) {
        page.personalChoice = {
          id: data[`page_${pageIndex}_pc_id`],
          prompt: data[`page_${pageIndex}_pc_prompt`] || '',
          options: JSON.parse(data[`page_${pageIndex}_pc_options`] || '[]'),
        };
      }

      pages.push(page);
      pageIndex++;
    }

    const poll = data.poll_question
      ? {
          id: data.poll_id,
          question: data.poll_question,
          options: Array.isArray(data.poll_options)
            ? data.poll_options
            : JSON.parse(data.poll_options || '[]'),
        }
      : null;

    return {
      id: data.id,
      title: data.story_name,
      series: data.series,
      chapter: data.chapter,
      pages,
      poll,
    };
  }

  return testStory;
}

/** ---------- API hooks ---------- */
async function fetchVotes(pollId: string): Promise<Record<string, number>> {
  console.log('fetchVotes -> pollId:', pollId);
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
  console.log("Submitting vote for poll ID:", pollId, "option:", option);
  return fetch(`/api/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    const stored = sessionStorage.getItem('personalChoices');
    if (stored) setPersonal(JSON.parse(stored));
  }, []);

  // Save on update
  useEffect(() => {
    sessionStorage.setItem('personalChoices', JSON.stringify(personal));
  }, [personal]);

  // Poll setup
  // Poll setup: load from Redis
  useEffect(() => {
    async function initPoll() {
      if (!EPISODE.poll) {
        return;
      }

      const zeros: Record<string, number> = {};
      EPISODE.poll.options.forEach((opt: string) => (zeros[opt] = 0));
      setPollCounts(zeros);

      try {
        const counts = await fetchVotes(EPISODE.poll.id);
        setPollCounts((prev) => ({ ...prev, ...counts }));
      } catch (err) {
        console.error('Error fetching votes:', err);
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

    matches.forEach((token: string) => {
      const key = token.replace(/[{}]/g, ''); // remove curly braces
      const val = personal[key];
      if (val) {
        text = text.replace(new RegExp(token, 'g'), val);
      }
    });

    return text;
  }, [currentPage.text, personal]);

  function onPickPersonal(choiceId: string, optionText: string) {
    setPersonal((prev) => ({ ...prev, [choiceId]: optionText }));
  }

  async function onPollVote(option: string) {
    if (hasVoted) return;
    if (!EPISODE.poll) return;

    console.log('Client Poll ID', EPISODE.poll.id);
    setHasVoted(true);
    setPollSel(option);

    try {
      const res = await submitVote(EPISODE.poll.id, option);

      if (res.status === 403) {
        showToast("You've already voted on this story post.");
        setHasVoted(true); // lock out revoting
        return;
      }

      if (!res.ok) {
        throw new Error(`Vote failed: ${res.status}`);
      }

      setPollCounts((prev) => ({
        ...prev,
        [option]: (prev[option] ?? 0) + 1,
      }));

    } catch (e) {
      console.error(e);
      setHasVoted(false); 
      showToast("Vote failed. Please try again.");
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
            {currentPage.personalChoice.options.map((opt: PersonalOption) => {
              const active = personal[currentPage.personalChoice!.id] === opt.text;
              return (
                <button
                  key={opt.id}
                  onClick={() => onPickPersonal(currentPage.personalChoice!.id, opt.text)}
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
            <div style={{ flex: 1, margin: '0 12px' }}>
              {EPISODE.poll ? (
                <>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{EPISODE.poll?.question}</div>
                  {EPISODE.poll?.options.map((opt: string) => {
                    const count = pollCounts[opt] ?? 0;
                    const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                    const selected = pollSel === opt;
                    return (
                      <div key={opt} style={{ marginTop: 8 }}>
                        <button
                          onClick={() => onPollVote(opt)}
                          disabled={hasVoted}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: `1px solid ${selected ? theme.accent : theme.border}`,
                            background: selected ? 'rgba(255,69,0,0.15)' : '#1c1c1e',
                            color: theme.text,
                            cursor: hasVoted ? 'default' : 'pointer',
                          }}
                        >
                          {opt}
                        </button>
                        {hasVoted && (
                          <div style={{ marginTop: 6, fontSize: 12, color: theme.subtle }}>
                            {pct}% ({count} vote{count === 1 ? '' : 's'})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div style={{ fontSize: 14, color: theme.subtle }}>No poll for this story</div>
              )}

              {atEnd && (
                <button
                  style={{
                    marginTop: 16,
                    backgroundColor: theme.accent,
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    width: '100%',
                  }}
                  onClick={async () => {
                    try {
                      await createStoryForm();
                    } catch (err) {
                      console.error('Error creating story:', err);
                      showToast('Error creating story. Please try again.');
                    }
                  }}
                >
                  ✏️ Create Your Own Story
                </button>
              )}
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          <button
            style={circleBtn(pageIdx === EPISODE.pages.length - 1)}
            disabled={pageIdx === EPISODE.pages.length - 1}
            onClick={() => setPageIdx((p) => Math.min(EPISODE.pages.length - 1, p + 1))}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
