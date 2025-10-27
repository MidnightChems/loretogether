/** ---------- STORY DATA ---------- */
export const testStory = {
  id: 'deadcase-trace-complete',
  title: 'Tutorial Story - Trace Complete',
  series: 'Dead Case Files',
  chapter: 1,
  pages: [
    {
      id: 'p1',
      text: `Welcome to LoreTogether! A community driven choose-your-own-adventure story. Authors can create their own stories with dynamic choices, and run end-of-story polls to let readers determine the fate of their story! Created for the Reddit and Kiro: Community Games Challenge.
      
Let's start with selecting a choice below. Authors can set a Choice ID when creating a choice, and use that ID later to display the reader's picked value, e.g. {{color}}`,
      personalChoice: {
        id: 'color',
        prompt: 'What color is your favorite?',
        options: [
          { id: 'blue', text: 'blue' },
          { id: 'green', text: 'green' },
          { id: 'red', text: 'red' },
        ],
      },
    },

    {
      id: 'p2',
      text: `The color you selected is {{color}}. Authors can use these values to let their stories feel personal and dynamic. I will now show you a small sample story that Kiro and I wrote. At the end of the story, you can vote to decide what happens next, or why not try creating your own story as well?`,
    },

    {
      id: 'p3',
      text: `You inhale. The slow drag fills your lungs, hot and heavy, like air from a blacksmith’s bellows. The cigarette tip glows in the dark room, a small breathing star.
It is so quiet you can hear the tobacco crackle, whispering to itself as it burns.
The office smells of smoke and old liquor. Empty bottles on the floor, cold takeout, the ghosts of better nights. Once there was laughter here. Voices. Now only silence.
A car passes outside, or maybe a train. You do not care enough to know. Its light cuts across the room and for a moment they are all here again. Your partner. Your secretary. Your wife. Their eyes are fixed on you, their silence pressing down until you cannot breathe.
(Ringing)
The phone breaks it. The sound claws through the stillness. You stand and go to answer.`,
      personalChoice: {
        id: 'call',
        prompt: 'How do you answer the call?',
        options: [
          { id: 'say_nothing', text: 'Say nothing.' },
          { id: 'hello', text: 'Hello?' },
          { id: 'detective_intro', text: 'Hello, this is Detective..' },
        ],
      },
    },

    {
      id: 'p4',
      text: `{{call}}... A woman's scream rips through the line, sharp enough to make you flinch. You pull the receiver away, the sound bleeding into the room. Three cracks follow. Pop, pop, pop. Then silence.
"Hello? Are you there?"
The line dies.
You know those sounds. Gunfire. Close range.
Your hand is already moving, dragging open a drawer. The Interface device lies inside, cold and waiting. You grab it and rush back to the phone. The pointed connector slides into the hidden slot beneath the receiver. A few button presses. Static hums. The machine begins to whisper back in short, rhythmic beeps.
You write it down. Numbers, letters, coordinates. The last mark on the page finishes the thought.
Trace complete.`,
    },

    {
      id: 'p5',
      text: `You pull up to the coordinates, an abandoned warehouse, half-eaten by rust and rain. The engine cuts off, and silence takes the wheel.
That feeling again. Familiar. Wrong.
Have I been here before?
Your chest tightens. Every instinct tells you to leave. Get back in the car. Drive until the city disappears in the mirror. Forget detective work. Forget all of it.
But you don’t. You never do.
You take one last drag, the cigarette burning to a trembling ember before you drop it and grind it out under your heel. A habit. A ritual. You pat your side, feel the cold shape of the gun beneath your arm.
The warehouse waits.
You breathe in smoke and steel and try to summon courage from the taste.`,
    },

    {
      id: 'p6',
      text: `You creep along the alley, close to the brick, using the night like a coat. The warehouse sits dark and patient. You cannot see inside. You cannot go farther without a light.
The Interface is warm in your hand when you pull it out. Fingers search the familiar teeth of its gears and buttons. The mechanism clicks and whines. A thin orange glow seeps from its tip, small and hesitant like an ember under wet paper. You hold the light in one hand and the sidearm in the other.
You breathe, shallow and steady. The door is old wood and rusted metal. Your shoulder finds the jamb. You push. The lock gives with a sigh. You step through and breach into the dark.`,
    },

    {
      id: 'p7',
      text: `The pale orange glow of the Interface spills across the floor, lighting the room in sickly hues. The sight freezes you where you stand.
Blood. Everywhere. Four bodies, crumpled in grotesque silence.
Your breath quickens. The gun comes up on instinct.
"I'm a licensed detective! I can and will shoot!"
Nothing. Just the hum of the city outside, and the drip of something wet nearby.
You scan the room, broken crates, old desks, the smell of rot. Logic claws through panic.
These bodies are days old. The killer's gone, but then who called?
You edge closer, weapon still raised. The light flickers across their faces, and the world drops out from under you.
Your gun slips. It hits the ground, fires once. The shot ricochets off metal, wild and meaningless.
You don't even flinch.
Because you see them.
Your partner. Your secretary. Your wife.
And the fourth body, the one that looks exactly like you.
Memory floods in. The job. The betrayal. The ambush.
You were here. You died here.
The thought comes slow, almost calm.
I've been brought back... to solve my own murder.`,
    },

    {
      id: 'p8',
      text: `You stand there, breathing through the stink of iron and rot, forcing yourself to remember.
Shouting. Fighting. Fear.
Three shots.
Pop. Pop. Pop.
Your hand moves on its own, unholstering the sidearm. The metal feels heavy, honest. You open the cylinder, three rounds are spent.
"I did the shooting." The words leave your mouth before you can stop them.
You lift your eyes to the far end of the room. There's another door, half-hanging from its frame. Splintered wood, twisted hinges. Someone forced their way through.
Maybe running. Maybe bleeding.
You stare at it for a long time, trying to feel whether the guilt in your chest is old or new.`,
    },
  ],

  poll: {
    id: 'end-poll',
    question: 'What do I do next?',
    options: [
      'Search the warehouse.',
      'Search the bodies of my staff, and myself.',
      'Search toward the broken door.',
    ],
  },
};
