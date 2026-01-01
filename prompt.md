Here is a robust "Master Prompt" strategy for your SaaS.

Instead of writing a different prompt for every category, you should use a Modular Template. This allows your app to dynamically swap keywords (like "Cinematic" or "Newsroom") while keeping the high-quality instruction structure that Gemini 3 Pro needs to render text correctly.

The Master Prompt Template
This is the hidden text your backend sends to Gemini. The parts in [BRACKETS] are what your code replaces based on user input.

Role: You are an expert YouTube Thumbnail Designer known for high-CTR (Click-Through Rate) images.

Task: Generate a hyper-realistic, 8k resolution thumbnail image with the following specifications:

1. Core Subject & Vibe:

Topic: [USER_TOPIC] (e.g., "Review of the movie Dune 2" OR "Election Analysis 2025")

Aesthetic: [STYLE_KEYWORD] (e.g., "Cinematic, dramatic lighting, color graded" OR "News broadcast style, serious, high contrast, red and blue themes")

Composition: Central focus on the subject. Background should be detailed but slightly blurred (bokeh) to make the text pop.

2. Text Rendering (CRITICAL):

Render the exact text: "[TEXT_OVERLAY]"

Font Style: [FONT_STYLE] (e.g., "Bold, distressed, movie-poster font" OR "Clean, Sans-Serif, Breaking News typography")

Text Placement: Position the text prominently in the center or slightly to the right. Ensure high contrast against the background. No spelling errors.

3. Technical Details:

Lighting: Studio quality, rim lighting to separate subject from background.

Quality: Photorealistic, 8k, Unreal Engine 5 render style.

Scenario 1: Film Critic (How it fills the template)
If a user is reviewing a movie, your app fills the blanks like this:

User Input: "Reviewing the new Batman movie. Title: 'Total Failure?'"

App Logic: Detects category is "Film".

Resulting Prompt sent to Gemini:

"Topic: A dramatic review of The Batman movie, dark and gritty atmosphere. Aesthetic: Cinematic, neon noir lighting, rain-slicked streets, moody shadows. Render the exact text: 'TOTAL FAILURE?'. Font Style: Big, bold, yellow grunge font with a drop shadow."

Scenario 2: Political/News View (How it fills the template)
If a user is posting about a new policy or election:

User Input: "Discussing the new Tax Law. Title: 'Taxes Going UP!'"

App Logic: Detects category is "News/Politics".

Resulting Prompt sent to Gemini:

"Topic: A serious political analysis about finance and government, debating figures in suits. Aesthetic: Breaking News broadcast style, TV studio lighting, blue and red background elements. Render the exact text: 'TAXES GOING UP!'. Font Style: Clean, thick, white Sans-Serif font on a red background box (lower third style)."

Why this approach makes money
Text Accuracy: By explicitly telling Gemini 3 Pro "Render the exact text" in a dedicated section, you utilize its reasoning engine to prevent spelling mistakes.

Visual Separation: By swapping the Aesthetic keywords, you ensure the Film thumbnail looks "artsy" while the Political thumbnail looks "trustworthy/urgent."

Scalability: You don't need to rewrite the prompt for Cooking, Tech, or Vlogging. You just add a new set of keywords for those categories in your database.