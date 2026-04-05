export const STATUSES = ['Open', 'In Progress', 'Resolved'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
export const CATEGORIES = ['Billing', 'Technical', 'Account', 'Security', 'Integrations', 'Other'];
export const WAITING_ON = ['Support', 'Customer'];
export const SLA_STATUSES = ['On Track', 'At Risk', 'Breached'];

export const TEAMS = [
  { id: 'TEAM-BILLING', name: 'Billing Ops', categories: ['Billing'] },
  { id: 'TEAM-PLATFORM', name: 'Platform Support', categories: ['Technical', 'Integrations'] },
  { id: 'TEAM-IDENTITY', name: 'Identity & Access', categories: ['Account', 'Security'] },
  { id: 'TEAM-GENERAL', name: 'General Support', categories: ['Other'] },
];

export const AGENTS = [
  { id: 'AG-1', name: 'Agent Smith', teamId: 'TEAM-BILLING' },
  { id: 'AG-2', name: 'Agent Lee', teamId: 'TEAM-PLATFORM' },
  { id: 'AG-3', name: 'Agent Patel', teamId: 'TEAM-IDENTITY' },
  { id: 'AG-4', name: 'Agent Garcia', teamId: 'TEAM-PLATFORM' },
  { id: 'AG-5', name: 'Agent Chen', teamId: 'TEAM-GENERAL' },
];

export const ORGANIZATIONS = [
  'Acme Logistics',
  'Northstar University',
  'BluePeak Retail',
  'Vertex Health',
  'Summit Finance',
];

const USER_NAMES = ['Ava', 'Noah', 'Sophia', 'Liam', 'Mia', 'Ethan', 'Isabella', 'Lucas', 'Amelia', 'Logan'];
const SUBJECTS = ['Login', 'Payment', 'Dashboard', 'Reports', 'Settings', 'API Access', 'Role Permissions', 'Notifications', 'CSV Upload'];

export function getTeamForCategory(category) {
  return TEAMS.find((team) => team.categories.includes(category)) || TEAMS[TEAMS.length - 1];
}

export function getTeamById(teamId) {
  return TEAMS.find((team) => team.id === teamId) || null;
}

export function getAgentById(agentId) {
  return AGENTS.find((agent) => agent.id === agentId) || null;
}

export function getAgentsForTeam(teamId) {
  return AGENTS.filter((agent) => agent.teamId === teamId);
}

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

function makeMessage({ i, j, authorType, authorId, authorLabel, body, createdAt, visibility = 'public' }) {
  return {
    id: `MSG-${i}-${j}-${Math.floor(authorId ? authorId.length : 0)}`,
    authorType,
    authorId: authorId || null,
    authorLabel,
    body,
    createdAt,
    visibility,
  };
}

function makeActivity({ id, at, actorLabel, text }) {
  return { id, at, actorLabel, text };
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
      { value: 'Low', weight: 0.22 },
      { value: 'Medium', weight: 0.39 },
      { value: 'High', weight: 0.28 },
      { value: 'Urgent', weight: 0.11 },
    ]);
    const category = pick(rng, CATEGORIES);
    const team = getTeamForCategory(category);
    const teamAgents = getAgentsForTeam(team.id);
    const assignedAgent = pick(rng, teamAgents.length ? teamAgents : AGENTS);
    const maybeAssignee = status === 'Resolved' ? assignedAgent : (rng() < 0.58 ? assignedAgent : null);

    const userName = pick(rng, USER_NAMES);
    const userId = `U-${userName.toUpperCase()}-${i}`;
    const subject = pick(rng, SUBJECTS);
    const organizationName = pick(rng, ORGANIZATIONS);

    const baseCreatedAt = Date.now() - Math.floor(rng() * 1000 * 60 * 60 * 24 * 60);
    const title = `${category} - ${subject} issue (${i})`;
    const description = [
      `We are seeing unexpected behavior in the ${subject} area.`,
      `Steps to reproduce: ${['load page', 'click submit', 'export report', 'update settings'][i % 4]}.`,
      'Expected result: normal operation.',
      'Actual result: inconsistent responses and intermittent failures.',
      'Please investigate and provide a resolution or workaround.',
    ].join(' ');

    const userMessageAt = baseCreatedAt + Math.floor(rng() * 1000 * 60 * 60);
    const messages = [
      makeMessage({
        i,
        j: 1,
        authorType: 'user',
        authorId: userId,
        authorLabel: `${userName} (Customer)`,
        body: description,
        createdAt: userMessageAt,
      }),
    ];
    const internalNotes = [];
    const activity = [
      makeActivity({
        id: `ACT-TKT-${1000 + i}-created`,
        at: userMessageAt,
        actorLabel: `${userName} (Customer)`,
        text: 'Ticket created',
      }),
    ];

    let supportCount = 0;
    if (status === 'Open') supportCount = rng() < 0.6 ? 0 : 1;
    if (status === 'In Progress') supportCount = 1 + Math.floor(rng() * 3);
    if (status === 'Resolved') supportCount = 2 + Math.floor(rng() * 3);

    const effectiveAssignee = maybeAssignee || (supportCount > 0 ? pick(rng, teamAgents.length ? teamAgents : AGENTS) : null);

    for (let k = 0; k < supportCount; k++) {
      const authorIsAdmin = rng() < 0.18;
      const authorType = authorIsAdmin ? 'admin' : 'agent';
      const author = authorIsAdmin ? { id: 'AD-1', name: 'Admin Ops' } : effectiveAssignee;
      const supportAt = userMessageAt + Math.floor((k + 1) * (1000 * 60 * (30 + rng() * 360)));
      const body = authorType === 'admin'
        ? `Thanks for reporting. We are escalating this ${subject} issue to the relevant team.`
        : `Received. Our team is investigating the ${subject} issue. We'll update you shortly with next steps.`;
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

      activity.push(
        makeActivity({
          id: `ACT-TKT-${1000 + i}-reply-${k + 1}`,
          at: supportAt,
          actorLabel: author.name,
          text: authorType === 'admin' ? 'Escalation update posted' : 'Support replied',
        })
      );
    }

    const firstAgentId = effectiveAssignee ? effectiveAssignee.id : null;
    const firstAgent = effectiveAssignee || null;
    const updatedAt = messages[messages.length - 1]?.createdAt || userMessageAt;
    const waitingOn = status === 'Resolved' ? 'Customer' : (supportCount > 0 ? 'Customer' : 'Support');
    const slaStatus = weightedPick(rng, [
      { value: 'On Track', weight: 0.63 },
      { value: 'At Risk', weight: 0.24 },
      { value: 'Breached', weight: 0.13 },
    ]);
    const isEscalated = priority === 'Urgent' || category === 'Security' || slaStatus === 'Breached';

    if (rng() < 0.45) {
      const noteAt = updatedAt - Math.floor(rng() * 1000 * 60 * 240);
      internalNotes.push(
        makeMessage({
          i,
          j: 99,
          authorType: 'agent',
          authorId: firstAgent?.id || assignedAgent.id,
          authorLabel: firstAgent?.name || assignedAgent.name,
          body: `Internal note: reviewing ${organizationName} impact and validating repro steps before next customer update.`,
          createdAt: noteAt,
          visibility: 'internal',
        })
      );
      activity.push(
        makeActivity({
          id: `ACT-TKT-${1000 + i}-note`,
          at: noteAt,
          actorLabel: firstAgent?.name || assignedAgent.name,
          text: 'Internal note added',
        })
      );
    }

    if (firstAgentId) {
      activity.push(
        makeActivity({
          id: `ACT-TKT-${1000 + i}-assigned`,
          at: userMessageAt + 1000 * 60 * 10,
          actorLabel: 'Routing Engine',
          text: `Assigned to ${firstAgentId}`,
        })
      );
    }

    tickets.push({
      id: `TKT-${1000 + i}`,
      title,
      description,
      category,
      priority,
      status,
      createdAt: userMessageAt,
      updatedAt,
      organizationName,
      organizationId: `ORG-${(i % ORGANIZATIONS.length) + 1}`,
      teamId: team.id,
      teamName: team.name,
      waitingOn,
      slaStatus,
      isEscalated,
      createdBy: { id: userId, name: `${userName} (Customer)` },
      assignedToAgentId: firstAgentId,
      assignedToAgentName: firstAgent?.name || null,
      messages,
      internalNotes,
      activity: activity.sort((a, b) => a.at - b.at),
    });
  }

  return tickets;
}
