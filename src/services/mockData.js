export const STATUSES = ['Open', 'In Progress', 'Resolved'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const CATEGORIES = ['Billing', 'Technical', 'Account', 'Other'];

export const AGENTS = [
  { id: 'AG-1', name: 'Agent Smith' },
  { id: 'AG-2', name: 'Agent Lee' },
  { id: 'AG-3', name: 'Agent Patel' },
  { id: 'AG-4', name: 'Agent Garcia' },
  { id: 'AG-5', name: 'Agent Chen' },
];

const USER_NAMES = ['Ava', 'Noah', 'Sophia', 'Liam', 'Mia', 'Ethan', 'Isabella', 'Lucas', 'Amelia', 'Logan'];
const SUBJECTS = ['Login', 'Payment', 'Dashboard', 'Reports', 'Settings', 'API Access', 'Role Permissions', 'Notifications', 'CSV Upload'];

function mulberry32(seed) {
  let t = seed;
  return function () {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function weightedPick(rng, items) {
  const total = items.reduce((sum, x) => sum + x.weight, 0);
  let roll = rng() * total;
  for (const item of items) {
    if (roll < item.weight) return item.value;
    roll -= item.weight;
  }
  return items[items.length - 1].value;
}

function makeMessage({ i, j, authorType, authorId, authorLabel, body, createdAt }) {
  return {
    id: `MSG-${i}-${j}-${Math.floor(authorId ? authorId.length : 0)}`,
    authorType, // 'user' | 'agent' | 'admin'
    authorId: authorId || null,
    authorLabel,
    body,
    createdAt,
  };
}

export function generateMockTickets(count = 120, seed = 1337) {
  const rng = mulberry32(seed);
  const tickets = [];

  const statusWeights = [
    { value: 'Open', weight: 0.42 },
    { value: 'In Progress', weight: 0.34 },
    { value: 'Resolved', weight: 0.24 },
  ];

  for (let i = 1; i <= count; i++) {
    const status = weightedPick(rng, statusWeights);
    const priority = weightedPick(rng, [
      { value: 'Low', weight: 0.34 },
      { value: 'Medium', weight: 0.43 },
      { value: 'High', weight: 0.23 },
    ]);
    const category = pick(rng, CATEGORIES);
    const assignedAgent = pick(rng, AGENTS);
    const maybeAssignee = status === 'Resolved' ? assignedAgent : (rng() < 0.6 ? assignedAgent : null);

    const userName = pick(rng, USER_NAMES);
    const userId = `U-${userName.toUpperCase()}-${i}`;
    const subject = pick(rng, SUBJECTS);

    const baseCreatedAt = Date.now() - Math.floor(rng() * 1000 * 60 * 60 * 24 * 60); // last ~60 days
    const title = `${category} - ${subject} issue (${i})`;

    const description = [
      `We are seeing unexpected behavior in the ${subject} area.`,
      `Steps to reproduce: ${['load page', 'click submit', 'export report', 'update settings'][i % 4]}.`,
      `Expected result: normal operation.`,
      `Actual result: inconsistent responses and intermittent failures.`,
      `Please investigate and provide a resolution or workaround.`,
    ].join(' ');

    const userMessageAt = baseCreatedAt + Math.floor(rng() * 1000 * 60 * 60);
    const messages = [];

    messages.push(
      makeMessage({
        i,
        j: 1,
        authorType: 'user',
        authorId: userId,
        authorLabel: `${userName} (Customer)`,
        body: description,
        createdAt: userMessageAt,
      })
    );

    let supportCount = 0;
    if (status === 'Open') supportCount = rng() < 0.6 ? 0 : 1;
    if (status === 'In Progress') supportCount = 1 + Math.floor(rng() * 3); // 1-3
    if (status === 'Resolved') supportCount = 2 + Math.floor(rng() * 3); // 2-4

    const effectiveAssignee = maybeAssignee || (supportCount > 0 ? pick(rng, AGENTS) : null);

    for (let k = 0; k < supportCount; k++) {
      const authorIsAdmin = rng() < 0.18;
      const authorType = authorIsAdmin ? 'admin' : 'agent';
      const author = authorIsAdmin ? { id: 'AD-1', name: 'Admin Ops' } : effectiveAssignee;

      const supportAt =
        userMessageAt + Math.floor((k + 1) * (1000 * 60 * (30 + rng() * 360))); // spaced within days/weeks

      const body = authorType === 'admin'
        ? `Thanks for reporting. We are escalating this ${subject} issue to the relevant team.`
        : `Received. Our team is investigating the ${subject} issue. We'll update you shortly with next steps.`;

      // If resolved, make the last support/admin message sound like a close.
      const isLast = k === supportCount - 1;
      const resolvedSuffix = status === 'Resolved' && isLast
        ? ' Resolution: Identified root cause and applied a fix. Please retest and confirm.'
        : '';

      messages.push(
        makeMessage({
          i,
          j: k + 2,
          authorType,
          authorId: author.id,
          authorLabel: `${author.name}`,
          body: body + resolvedSuffix,
          createdAt: supportAt,
        })
      );
    }

    const firstAgentId = effectiveAssignee ? effectiveAssignee.id : null;
    const updatedAt = messages[messages.length - 1]?.createdAt || userMessageAt;

    tickets.push({
      id: `TKT-${1000 + i}`,
      title,
      description,
      category,
      priority,
      status,
      createdAt: userMessageAt,
      updatedAt,
      createdBy: { id: userId, name: `${userName} (Customer)` },
      assignedToAgentId: firstAgentId,
      messages,
    });
  }

  return tickets;
}
