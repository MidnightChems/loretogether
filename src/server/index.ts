import express from 'express';
import { InitResponse, IncrementResponse, DecrementResponse } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import crypto from 'crypto';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', 1),
      postId,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId,
      type: 'decrement',
    });
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// --- Poll endpoints ---

router.get('/api/votes/:pollId', async (req, res): Promise<void> => {
  const pollId = req.params.pollId;
  try {
    const key = `poll:${pollId}:votes`;
    const counts = await redis.hGetAll(key);
    res.json({ pollId, counts });
  } catch (err) {
    console.error('Error fetching votes:', err);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

router.post('/api/vote', async (req, res) => {
  const { pollId, option } = req.body;
  console.log("Server Poll ID:", pollId);
  if (!pollId || !option) {
    res.status(400).json({ error: 'pollId, option are required' });
    return;
  }

  try {
    const username = reddit.getCurrentUsername();
    if (!username) return res.status(401).json({ error: 'Auth required' });

    const usernameKey = `poll:${pollId}:voter:${username}`;
    const voteKey = `poll:${pollId}:votes`;

    const alreadyVoted = await redis.exists(usernameKey);
    if (alreadyVoted) {
      return res.status(403).json({ error: 'User already voted' });
    }

    await redis.hIncrBy(voteKey, option, 1);
    await redis.set(usernameKey, '1');

    res.json({ success: true });
  } catch (err) {
    console.error('vote error', err);
    res.status(500).json({ error: 'server error' });
  }
});

router.post('/api/create-story', async (req, res) => {
  const { subredditName } = context;
  if (!subredditName) {
    res.status(400).json({ status: 'error', message: 'subredditName is required' });
    return;
  }

  const { 
    story_name,
    series, 
    chapter,
    page_count,
    poll_question,
    poll_options,
  } = req.body.values;

  // Validate required fields
  if (!story_name || !story_name.trim()) {
    res.status(400).json({ 
      status: 'error', 
      message: 'Story name is required' 
    });
    return;
  }

  if (!series || !series.trim()) {
    res.status(400).json({ 
      status: 'error', 
      message: 'Series name is required' 
    });
    return;
  }

  const pageCount = Number(page_count) || 3; // Default to 3 if not provided for backward compatibility
  const chapterNumber = Number(chapter);
  
  // Validate chapter number
  if (!chapterNumber || chapterNumber < 1) {
    res.status(400).json({ 
      status: 'error', 
      message: 'Chapter number must be 1 or greater' 
    });
    return;
  }
  
  // Validate page count
  if (pageCount < 1 || pageCount > 10) {
    res.status(400).json({ 
      status: 'error', 
      message: 'Page count must be between 1 and 10' 
    });
    return;
  }

  // Validate personal choice data structure
  const validationErrors: string[] = [];
  
  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const pcId = req.body.values[`page_${pageNum}_pc_id`];
    const pcPrompt = req.body.values[`page_${pageNum}_pc_prompt`];
    const pcOptions = req.body.values[`page_${pageNum}_pc_options`];
    
    if (pcId || pcPrompt || pcOptions) {
      // Validate choice ID format
      if (pcId && !/^[a-zA-Z0-9_]+$/.test(pcId)) {
        validationErrors.push(`Page ${pageNum}: Invalid choice ID format`);
      }
      
      // Validate JSON structure for options
      if (pcOptions) {
        try {
          const options = JSON.parse(pcOptions);
          if (!Array.isArray(options) || options.length < 2) {
            validationErrors.push(`Page ${pageNum}: Personal choice must have at least 2 options`);
          }
          
          // Validate option structure
          for (const option of options) {
            if (!option.id || !option.text) {
              validationErrors.push(`Page ${pageNum}: Invalid option structure`);
              break;
            }
          }
        } catch (e) {
          validationErrors.push(`Page ${pageNum}: Invalid personal choice options JSON`);
        }
      }
    }
  }
  
  if (validationErrors.length > 0) {
    res.status(400).json({ 
      status: 'error', 
      message: 'Personal choice validation failed',
      errors: validationErrors 
    });
    return;
  }

  const poll_id = `poll-${crypto.randomUUID()}`;

  // Build postData with dynamic page fields
  const postData: any = {
    story_name: story_name,
    series: series,
    chapter: chapter,
    page_count: pageCount,
    poll_question: poll_question,
    poll_options: poll_options,
    poll_id: poll_id,
  };
  
  // Add page story content and personal choice data dynamically
  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const pageStory = req.body.values[`page_${pageNum}_story`];
    const pcId = req.body.values[`page_${pageNum}_pc_id`];
    const pcPrompt = req.body.values[`page_${pageNum}_pc_prompt`];
    const pcOptions = req.body.values[`page_${pageNum}_pc_options`];
    
    // Add page story content
    if (pageStory) {
      postData[`page_${pageNum}_story`] = pageStory;
    }
    
    // Add personal choice data if present
    if (pcId) {
      postData[`page_${pageNum}_pc_id`] = pcId;
      postData[`page_${pageNum}_pc_prompt`] = pcPrompt;
      postData[`page_${pageNum}_pc_options`] = pcOptions;
    }
  }

  await reddit.submitCustomPost({
    runAs: 'USER',
    subredditName: subredditName,
    title: story_name,
    splash: {
      appDisplayName: 'LoreTogether ' + story_name,
    },
    postData,
    userGeneratedContent: {
      text: "",
  },
  });

  res.json({ status: 'success', message: `Story post created in subreddit ${subredditName}` });
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
