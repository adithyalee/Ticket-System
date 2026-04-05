import { useContext, useMemo } from 'react';
import { TicketContext } from '../context/TicketContext';
import { AGENTS, PRIORITIES, STATUSES, getAgentById, getAgentsForTeam, getTeamById, getTeamForCategory, TEAMS } from '../services/mockData';

const ROLE_TO_USER = {
  User: { id: 'U-USER', name: 'Taylor User', role: 'User' },
  'Support Agent': { id: 'U-AGENT-ACTOR', name: 'Jordan Support Agent', role: 'Support Agent', agentId: 'AG-2', teamId: 'TEAM-PLATFORM' },
  Admin: { id: 'U-ADMIN-ACTOR', name: 'Morgan Admin', role: 'Admin', teamId: 'TEAM-PLATFORM' },
};

function roleToAuthor({ role, currentUser }) {
  if (role === 'User') {
    return { authorType: 'user', authorId: currentUser.id, authorLabel: currentUser.name };
  }
  if (role === 'Admin') {
    return { authorType: 'admin', authorId: currentUser.id, authorLabel: currentUser.name };
  }
  return { authorType: 'agent', authorId: currentUser.id, authorLabel: currentUser.name };
}

function deriveWorkflowPatch(ticket, authorType) {
  const nextPatch = {};

  if (authorType === 'user') {
    nextPatch.waitingOn = 'Support';
    nextPatch.hasUnreadCustomerReply = true;
    if (ticket.status === 'Resolved') nextPatch.status = 'In Progress';
  } else {
    nextPatch.waitingOn = 'Customer';
    nextPatch.hasUnreadCustomerReply = false;
    if (ticket.status === 'Open') nextPatch.status = 'In Progress';
  }

  return nextPatch;
}

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error('useTickets must be used within a TicketProvider');

  const { state, dispatch } = context;

  const tickets = useMemo(() => {
    return state.ticketOrder.map((id) => state.ticketsById[id]).filter(Boolean);
  }, [state.ticketOrder, state.ticketsById]);

  const getTicketById = (ticketId) => state.ticketsById[ticketId] || null;

  const createTicket = ({ title, description, category, priority }) => {
    const createdAt = Date.now();
    const id = `TKT-${state.ticketIdSeq}`;
    const authorMeta = roleToAuthor({ role: state.currentUser.role, currentUser: state.currentUser });
    const team = getTeamForCategory(category);
    const safeTitle = (title || '').trim().slice(0, 150);

    const initialMessage = {
      id: `MSG-${id}-1`,
      authorType: authorMeta.authorType,
      authorId: authorMeta.authorId,
      authorLabel: authorMeta.authorLabel,
      body: description.trim(),
      createdAt,
      visibility: 'public',
    };

    const newTicket = {
      id,
      title: safeTitle,
      description: description.trim(),
      category,
      priority,
      status: 'Open',
      createdAt,
      updatedAt: createdAt,
      organizationId: 'ORG-SELF-SERVE',
      organizationName: 'Meeedly Demo Workspace',
      teamId: team.id,
      teamName: team.name,
      waitingOn: 'Support',
      slaStatus: priority === 'Urgent' ? 'At Risk' : 'On Track',
      isEscalated: priority === 'Urgent' || category === 'Security',
      hasUnreadCustomerReply: true,
      createdBy: { id: state.currentUser.id, name: state.currentUser.name },
      assignedToAgentId: null,
      assignedToAgentName: null,
      messages: [initialMessage],
      internalNotes: [],
      activity: [],
    };

    dispatch({ type: 'CREATE_TICKET', payload: newTicket });
    return id;
  };

  const addMessage = (ticketId, body) => {
    const ticket = getTicketById(ticketId);
    if (!ticket) return;
    const trimmed = (body || '').trim();
    if (!trimmed) return;

    const now = Date.now();
    const authorMeta = roleToAuthor({ role: state.currentUser.role, currentUser: state.currentUser });
    const message = {
      id: `MSG-${ticketId}-${now}`,
      authorType: authorMeta.authorType,
      authorId: authorMeta.authorId,
      authorLabel: authorMeta.authorLabel,
      body: trimmed,
      createdAt: now,
      visibility: 'public',
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        ticketId,
        message,
        nextTicketPatch: deriveWorkflowPatch(ticket, authorMeta.authorType),
        meta: { actorLabel: state.currentUser.name },
      },
    });
  };

  const addInternalNote = (ticketId, body) => {
    if (state.currentUser.role === 'User') return;
    const ticket = getTicketById(ticketId);
    if (!ticket) return;
    const trimmed = (body || '').trim();
    if (!trimmed) return;

    const now = Date.now();
    const authorMeta = roleToAuthor({ role: state.currentUser.role, currentUser: state.currentUser });
    dispatch({
      type: 'ADD_INTERNAL_NOTE',
      payload: {
        ticketId,
        note: {
          id: `NOTE-${ticketId}-${now}`,
          authorType: authorMeta.authorType,
          authorId: authorMeta.authorId,
          authorLabel: authorMeta.authorLabel,
          body: trimmed,
          createdAt: now,
          visibility: 'internal',
        },
        meta: { actorLabel: state.currentUser.name },
      },
    });
  };

  const assignTeam = (ticketId, teamId) => {
    if (state.currentUser.role === 'User') return;
    const team = getTeamById(teamId);
    if (!team) return;

    dispatch({
      type: 'UPDATE_TICKET',
      payload: {
        ticketId,
        patch: {
          teamId: team.id,
          teamName: team.name,
          assignedToAgentId: null,
          assignedToAgentName: null,
        },
        meta: { actorLabel: state.currentUser.name },
      },
    });
  };

  const assignTicket = (ticketId, agentId) => {
    if (state.currentUser.role === 'User') return;
    const ticket = getTicketById(ticketId);
    if (!ticket) return;

    const agent = agentId ? getAgentById(agentId) : null;

    dispatch({
      type: 'ASSIGN_TICKET',
      payload: {
        ticketId,
        agentId,
        agentName: agent?.name || null,
        teamId: agent?.teamId || ticket.teamId,
        teamName: agent?.teamId ? getTeamById(agent.teamId)?.name : ticket.teamName,
        meta: { actorLabel: state.currentUser.name },
      },
    });

    if (ticket.status === 'Open' && (state.currentUser.role === 'Support Agent' || state.currentUser.role === 'Admin')) {
      dispatch({
        type: 'UPDATE_TICKET',
        payload: {
          ticketId,
          patch: { status: 'In Progress', waitingOn: 'Customer', hasUnreadCustomerReply: false },
          meta: { actorLabel: state.currentUser.name },
        },
      });
    }
  };

  const bulkUpdateTickets = (ticketIds, patch) => {
    if (state.currentUser.role === 'User') return;
    (ticketIds || []).forEach((ticketId) => {
      updateTicket(ticketId, patch);
    });
  };

  const bulkAssignAgent = (ticketIds, agentId) => {
    if (state.currentUser.role === 'User') return;
    (ticketIds || []).forEach((ticketId) => {
      assignTicket(ticketId, agentId);
    });
  };

  const updateTicket = (ticketId, patch) => {
    if (state.currentUser.role === 'User') return;
    const allowedStatus = patch?.status ? STATUSES.includes(patch.status) : null;
    const allowedPriority = patch?.priority ? PRIORITIES.includes(patch.priority) : null;

    const safePatch = { ...patch };
    if (patch?.status && !allowedStatus) delete safePatch.status;
    if (patch?.priority && !allowedPriority) delete safePatch.priority;

    dispatch({
      type: 'UPDATE_TICKET',
      payload: { ticketId, patch: safePatch, meta: { actorLabel: state.currentUser.name } },
    });
  };

  const switchRole = (role) => {
    const next = ROLE_TO_USER[role];
    if (!next) return;
    dispatch({ type: 'SWITCH_USER_ROLE', payload: next });
  };

  const canManage = state.currentUser.role === 'Support Agent' || state.currentUser.role === 'Admin';
  const isAdmin = state.currentUser.role === 'Admin';
  const currentTeamId = state.currentUser.teamId || (state.currentUser.agentId ? getAgentById(state.currentUser.agentId)?.teamId : null);

  return {
    tickets,
    ticketsById: state.ticketsById,
    ticketOrder: state.ticketOrder,
    loading: state.loading,
    currentUser: state.currentUser,
    currentTeamId,
    agents: AGENTS,
    teams: TEAMS,
    getAgentsForTeam,
    createTicket,
    addMessage,
    addInternalNote,
    assignTeam,
    assignTicket,
    updateTicket,
    bulkUpdateTickets,
    bulkAssignAgent,
    deleteTicket: (ticketId) => dispatch({ type: 'DELETE_TICKET', payload: { ticketId } }),
    switchRole,
    canManage,
    isAdmin,
  };
};
