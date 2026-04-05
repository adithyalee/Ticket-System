import { AGENTS, PRIORITIES, TEAMS } from './mockData';

export const PRIORITY_WEIGHT = { Low: 1, Medium: 2, High: 3, Urgent: 4 };

export function getAgentName(agentId, agents = AGENTS) {
  if (!agentId) return 'Unassigned';
  return agents.find((agent) => agent.id === agentId)?.name || agentId;
}

export function getTeamName(teamId, teams = TEAMS) {
  if (!teamId) return 'Unassigned';
  return teams.find((team) => team.id === teamId)?.name || teamId;
}

export function getPriorityCycle(priority) {
  const idx = PRIORITIES.findIndex((item) => item === priority);
  return PRIORITIES[(idx + 1 + PRIORITIES.length) % PRIORITIES.length] || PRIORITIES[0];
}

export function getSlaTone(slaStatus) {
  if (slaStatus === 'Breached') return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
  if (slaStatus === 'At Risk') return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
  return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
}

export function getPriorityTone(priority) {
  if (priority === 'Urgent') return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
  if (priority === 'High') return { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' };
  if (priority === 'Medium') return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
  return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
}

export function getVisibleMessages(ticket, includeInternal) {
  const raw = Array.isArray(ticket?.messages) ? ticket.messages : [];
  const publicMessages = raw.filter((m) => m && m.visibility !== 'internal');
  const notes = includeInternal && Array.isArray(ticket?.internalNotes) ? ticket.internalNotes : [];
  return [...publicMessages, ...notes].sort((a, b) => a.createdAt - b.createdAt);
}

export function buildTicketStats(tickets) {
  const stats = {
    total: tickets.length,
    open: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
    unassigned: 0,
    escalated: 0,
    awaitingCustomer: 0,
    breached: 0,
  };

  for (const ticket of tickets) {
    if (ticket.status === 'Open') stats.open += 1;
    if (ticket.status === 'In Progress') stats.inProgress += 1;
    if (ticket.status === 'Resolved') stats.resolved += 1;
    if (ticket.priority === 'Urgent') stats.urgent += 1;
    if (!ticket.assignedToAgentId) stats.unassigned += 1;
    if (ticket.isEscalated) stats.escalated += 1;
    if (ticket.waitingOn === 'Customer') stats.awaitingCustomer += 1;
    if (ticket.slaStatus === 'Breached') stats.breached += 1;
  }

  return stats;
}
