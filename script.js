// Smooth navigation with fixed header offset for polished section jumps.
document.querySelectorAll('.top-nav a, .hero-actions a').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    const navOffset = 86;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

// Subtle fade-up motion language across key sections and cards.
const animatedElements = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

animatedElements.forEach((element) => fadeObserver.observe(element));

const angleForm = document.getElementById('angleForm');
const topicInput = document.getElementById('topicInput');
const nicheInput = document.getElementById('nicheInput');
const angleResults = document.getElementById('angleResults');
const angleError = document.getElementById('angleError');

const pillarForm = document.getElementById('pillarForm');
const nicheQ = document.getElementById('nicheQ');
const strengthsQ = document.getElementById('strengthsQ');
const goalsQ = document.getElementById('goalsQ');
const perspectiveQ = document.getElementById('perspectiveQ');
const pillarResults = document.getElementById('pillarResults');
const pillarError = document.getElementById('pillarError');

// Adds a compact 3-line preview with a toggle for long generated card content.
function addSeeMoreToggle(card) {
  const details = card.querySelector('.card-details');
  if (!details) return;

  details.classList.add('clamp-3');

  requestAnimationFrame(() => {
    if (details.scrollHeight <= details.clientHeight + 1) {
      details.classList.remove('clamp-3');
      return;
    }

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'see-more-btn';
    toggle.textContent = 'See more';
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      details.classList.toggle('clamp-3', expanded);
      toggle.textContent = expanded ? 'See more' : 'See less';
    });

    card.appendChild(toggle);
  });
}

// Template-driven angle generator logic using static structures (no external AI calls).
const angleTemplates = [
  {
    title: 'Contrarian Take',
    hook: (topic, audience) => `Most ${audience} are overcomplicating ${topic} — here’s why simpler wins.`,
    points: (topic) => [
      `Identify one common misconception around ${topic}.`,
      'Show why that approach causes friction or inconsistent output.',
      'Share a cleaner process your audience can apply immediately.'
    ],
    cta: (audience) => `Ask your ${audience} audience: "Which step do you tend to overthink?"`
  },
  {
    title: 'Step-by-Step Framework',
    hook: (topic) => `Use this 3-step framework to make ${topic} practical today.`,
    points: (topic) => [
      `Step 1: Set one clear outcome for ${topic}.`,
      'Step 2: Add one constraint to force simplicity.',
      'Step 3: Test one small action and capture what worked.'
    ],
    cta: () => 'CTA: "Comment FRAMEWORK and I’ll send the checklist format."'
  },
  {
    title: 'Story Angle',
    hook: (topic) => `What changed when I rethought ${topic} from first principles.`,
    points: (topic) => [
      `Share your previous approach to ${topic}.`,
      'Describe the turning point that changed your process.',
      'Close with one lesson your audience can replicate this week.'
    ],
    cta: () => 'CTA: "Save this if you’re rebuilding your process this month."'
  },
  {
    title: 'Common Mistakes Breakdown',
    hook: (topic, audience) => `3 mistakes ${audience} make with ${topic} and what to do instead.`,
    points: (topic) => [
      `Mistake #1: Jumping into ${topic} without a clear outcome.`,
      'Mistake #2: Copying tactics without adapting to context.',
      'Mistake #3: Not reviewing outcomes to refine the next post.'
    ],
    cta: () => 'CTA: "Which mistake is costing you the most right now?"'
  },
  {
    title: 'Future-Paced Vision',
    hook: (topic) => `Imagine 90 days of consistent execution around ${topic}.`,
    points: () => [
      'Paint the before/after transformation with one measurable shift.',
      'Break progress into realistic weekly milestones.',
      'Recommend one lightweight system to protect consistency.'
    ],
    cta: () => 'CTA: "Share this with someone building consistency this quarter."'
  }
];

angleForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const topic = topicInput.value.trim();
  const niche = nicheInput.value.trim() || 'creators';

  if (!topic) {
    angleError.textContent = 'Please enter a topic before generating angles.';
    angleResults.innerHTML = '';
    return;
  }

  angleError.textContent = '';
  angleResults.innerHTML = '';

  const fragment = document.createDocumentFragment();

  angleTemplates.forEach((template) => {
    const card = document.createElement('article');
    card.className = 'card glass-panel fade-up';

    const pointsMarkup = template
      .points(topic, niche)
      .map((point) => `<li>${point}</li>`)
      .join('');

    card.innerHTML = `
      <h3>${template.title}</h3>
      <div class="card-details">
        <p><strong>Hook:</strong> ${template.hook(topic, niche)}</p>
        <p><strong>Key points:</strong></p>
        <ul>${pointsMarkup}</ul>
        <p><strong>CTA suggestion:</strong> ${template.cta(topic, niche)}</p>
      </div>
    `;

    addSeeMoreToggle(card);
    fragment.appendChild(card);
    fadeObserver.observe(card);

    requestAnimationFrame(() => {
      card.classList.add('visible');
    });
  });

  angleResults.appendChild(fragment);
});

// Content pillar logic: turns responses into reusable strategic pillar themes.
pillarForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const niche = nicheQ.value.trim();
  const strengths = strengthsQ.value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const goals = goalsQ.value.trim();
  const perspective = perspectiveQ.value.trim();

  if (!niche || strengths.length === 0 || !goals || !perspective) {
    pillarError.textContent = 'Please answer all four questions to generate your pillars.';
    pillarResults.innerHTML = '';
    return;
  }

  pillarError.textContent = '';
  pillarResults.innerHTML = '';

  const primaryStrength = strengths[0] || 'clarity';
  const secondaryStrength = strengths[1] || primaryStrength;
  const tertiaryStrength = strengths[2] || secondaryStrength;

  const pillarData = [
    {
      title: `Pillar 1: ${niche} Essentials`,
      ideas: [
        `"Beginner roadmap for ${niche} in 30 days"`,
        `"Top mistakes beginners make in ${niche}"`,
        `"A simple framework to execute ${niche} weekly"`
      ],
      focus: 'Weekly Focus: Monday foundational education post.'
    },
    {
      title: `Pillar 2: Leverage ${primaryStrength}`,
      ideas: [
        `"How ${primaryStrength} solves audience bottlenecks"`,
        `"Case study: practical results using ${primaryStrength}"`,
        `"Mini tutorial: use ${primaryStrength} this week"`
      ],
      focus: 'Weekly Focus: Tuesday tactical tutorial.'
    },
    {
      title: `Pillar 3: Progress Toward ${goals}`,
      ideas: [
        `"3 habits that move people toward ${goals}"`,
        `"Milestone tracker for ${goals}"`,
        `"What blocks momentum toward ${goals}"`
      ],
      focus: 'Weekly Focus: Thursday progress + transformation post.'
    },
    {
      title: 'Pillar 4: Perspective-Led Authority',
      ideas: [
        `"My perspective: ${perspective}"`,
        `"Why ${secondaryStrength} + ${tertiaryStrength} outperforms random tactics"`,
        '"What creators should stop doing right now"'
      ],
      focus: 'Weekly Focus: Friday opinion post to drive discussion.'
    }
  ];

  pillarData.forEach((pillar) => {
    const card = document.createElement('article');
    card.className = 'card glass-panel fade-up';

    card.innerHTML = `
      <h3>${pillar.title}</h3>
      <div class="card-details">
        <p><strong>Example post ideas:</strong></p>
        <ul>
          ${pillar.ideas.map((idea) => `<li>${idea}</li>`).join('')}
        </ul>
        <p><strong>${pillar.focus}</strong></p>
      </div>
    `;

    addSeeMoreToggle(card);
    pillarResults.appendChild(card);
    fadeObserver.observe(card);

    requestAnimationFrame(() => {
      card.classList.add('visible');
    });
  });
});
