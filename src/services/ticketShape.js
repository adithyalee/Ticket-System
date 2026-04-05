import { getAgentById, getTeamForCategory, ORGANIZATIONS } from './mockData';

function deriveOrganizationFields(ticket) {
  const rawName = typeof ticket.organizationName === 'string' ? ticket.organizationName.trim() : '';
  const name = /^unknown organization$/i.test(rawName) ? '' : rawName;
  if (name) {
    const id = ticket.organizationId && String(ticket.organizationId).trim();
    return {
      organizationName: name,
      organizationId: id || 'ORG-CUSTOM',
    };
  }
  const idMatch = /^ORG-(\d+)$/i.exec(ticket.organizationId || '');
  if (idMatch) {
    const idx = Number.parseInt(idMatch[1], 10) - 1;
    const safe = Number.isFinite(idx) ? ((idx % ORGANIZATIONS.length) + ORGANIZATIONS.length) % ORGANIZATIONS.length : 0;
    return { organizationName: ORGANIZATIONS[safe], organizationId: ticket.organizationId };
  }
  const tkt = /^TKT-(\d+)$/i.exec(ticket.id || '');
  if (tkt) {
    const n = Number.parseInt(tkt[1], 10);
    const safe = Number.isFinite(n) ? n % ORGANIZATIONS.length : 0;
    return {
      organizationName: ORGANIZATIONS[safe],
      organizationId: `ORG-${safe + 1}`,
    };
  }
  return { organizationName: ORGANIZATIONS[0], organizationId: 'ORG-1' };
}

/**
 * Ensures tickets loaded from older localStorage payloads have enterprise fields
 * required by the dashboard and detail views (team, SLA, org, internal notes).
 */
export function ensureTicketShape(ticket) {
  if (!ticket || !ticket.id) return ticket;
  const category = ticket.category || 'Other';
  const team = getTeamForCategory(category);
  const agentName = ticket.assignedToAgentId
    ? (getAgentById(ticket.assignedToAgentId)?.name ?? null)
    : null;
  const org = deriveOrganizationFields(ticket);

  return {
    ...ticket,
    organizationName: org.organizationName,
    organizationId: org.organizationId,
    teamId: ticket.teamId ?? team.id,
    teamName: ticket.teamName ?? team.name,
    waitingOn: ticket.waitingOn ?? 'Support',
    slaStatus: ticket.slaStatus ?? 'On Track',
    isEscalated: Boolean(
      ticket.isEscalated
      || ticket.priority === 'Urgent'
      || category === 'Security'
      || ticket.slaStatus === 'Breached',
    ),
    messages: Array.isArray(ticket.messages) ? ticket.messages : [],
    internalNotes: Array.isArray(ticket.internalNotes) ? ticket.internalNotes : [],
    activity: Array.isArray(ticket.activity) ? ticket.activity : [],
    assignedToAgentName: ticket.assignedToAgentName ?? agentName,
    hasUnreadCustomerReply: ticket.hasUnreadCustomerReply ?? false,
  };
}

export function enrichTicketsById(ticketsById) {
  const next = {};
  for (const id of Object.keys(ticketsById || {})) {
    next[id] = ensureTicketShape(ticketsById[id]);
  }
  return next;
}
