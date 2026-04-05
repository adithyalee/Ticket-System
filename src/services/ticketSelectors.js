import { PRIORITY_WEIGHT } from './ticketUtils';

export const SLA_SORT_WEIGHT = { Breached: 3, 'At Risk': 2, 'On Track': 1 };

/**
 * Queue views for high-volume triage (dashboard).
 */
export function queueMatches(ticket, queueView, currentUser, currentTeamId) {
  switch (queueView) {
    case 'Mine':
      return Boolean(currentUser?.agentId && ticket.assignedToAgentId === currentUser.agentId);
    case 'My Team':
      return Boolean(currentTeamId && ticket.teamId === currentTeamId);
    case 'Unassigned':
      return !ticket.assignedToAgentId;
    case 'Escalated':
      return ticket.isEscalated;
    case 'Awaiting Customer':
      return ticket.waitingOn === 'Customer';
    default:
      return true;
  }
}

/**
 * Filter tickets for the management dashboard.
 */
export function filterTicketsForDashboard(tickets, {
  searchTerm,
  statusFilter,
  priorityFilter,
  categoryFilter,
  teamFilter,
  queueView,
  slaStatusFilter,
  currentUser,
  currentTeamId,
}) {
  const q = (searchTerm || '').trim().toLowerCase();
  return tickets.filter((ticket) => {
    const title = (ticket.title || '').toLowerCase();
    const id = (ticket.id || '').toLowerCase();
    const org = (ticket.organizationName || '').toLowerCase();
    const teamName = (ticket.teamName || '').toLowerCase();

    const matchesSearch = !q || title.includes(q) || id.includes(q) || org.includes(q) || teamName.includes(q);
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || ticket.category === categoryFilter;
    const matchesTeam = teamFilter === 'All' || ticket.teamId === teamFilter;
    const matchesSla = slaStatusFilter === 'All' || ticket.slaStatus === slaStatusFilter;

    return matchesSearch
      && matchesStatus
      && matchesPriority
      && matchesCategory
      && matchesTeam
      && matchesSla
      && queueMatches(ticket, queueView, currentUser, currentTeamId);
  });
}

/**
 * Sort tickets for dashboard list (newest, priority, or SLA risk).
 */
export function sortTicketsForDashboard(tickets, sortBy) {
  const arr = [...tickets];
  arr.sort((a, b) => {
    if (sortBy === 'Priority') {
      const weight = (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
      if (weight !== 0) return weight;
    }
    if (sortBy === 'SLA') {
      const diff = (SLA_SORT_WEIGHT[b.slaStatus] || 0) - (SLA_SORT_WEIGHT[a.slaStatus] || 0);
      if (diff !== 0) return diff;
    }
    return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
  });
  return arr;
}
