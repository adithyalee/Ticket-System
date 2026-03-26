import { useContext, useMemo } from 'react';
import { TicketContext } from '../context/TicketContext';
import { AGENTS, PRIORITIES, STATUSES } from '../services/mockData';

const ROLE_TO_USER = {
  User: { id: 'U-USER', name: 'Taylor User', role: 'User' },
  'Support Agent': { id: 'U-AGENT-ACTOR', name: 'Jordan Support Agent', role: 'Support Agent' },
  Admin: { id: 'U-ADMIN-ACTOR', name: 'Morgan Admin', role: 'Admin' },
};

function nextTicketId() {
  return `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function roleToAuthor({ role, currentUser }) {
  if (role === 'User') {
    return { authorType: 'user', authorId: currentUser.id, authorLabel: currentUser.name };
  }
  if (role === 'Admin') {
    return { authorType: 'admin', authorId: currentUser.id, authorLabel: currentUser.name };
  }
  return { authorType: 'agent', authorId: currentUser.id, authorLabel: currentUser.name };
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
    const id = nextTicketId();

    const authorMeta = roleToAuthor({ role: state.currentUser.role, currentUser: state.currentUser });

    const initialMessage = {
      id: `MSG-${id}-1`,
      authorType: authorMeta.authorType,
      authorId: authorMeta.authorId,
      authorLabel: authorMeta.authorLabel,
      body: description.trim(),
      createdAt,
    };

    const newTicket = {
      id,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'Open',
      createdAt,
      updatedAt: createdAt,
      createdBy: { id: state.currentUser.id, name: state.currentUser.name },
      assignedToAgentId: null,
      messages: [initialMessage],
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
    };

    const nextTicketPatch = {};

    // Light workflow logic to keep tickets moving naturally.
    if (authorMeta.authorType === 'user' && ticket.status === 'Resolved') {
      nextTicketPatch.status = 'In Progress';
    }
    if (authorMeta.authorType !== 'user' && ticket.status === 'Open') {
      nextTicketPatch.status = 'In Progress';
    }

    dispatch({ type: 'ADD_MESSAGE', payload: { ticketId, message, nextTicketPatch } });
  };

  const assignTicket = (ticketId, agentId) => {
    const ticket = getTicketById(ticketId);
    if (!ticket) return;

    dispatch({ type: 'ASSIGN_TICKET', payload: { ticketId, agentId } });

    // If a manager assigns while the ticket is still "Open", bump it to "In Progress".
    if (ticket.status === 'Open' && (state.currentUser.role === 'Support Agent' || state.currentUser.role === 'Admin')) {
      dispatch({ type: 'UPDATE_TICKET', payload: { ticketId, patch: { status: 'In Progress' } } });
    }
  };

  const updateTicket = (ticketId, patch) => {
    const allowedStatus = patch?.status ? STATUSES.includes(patch.status) : null;
    const allowedPriority = patch?.priority ? PRIORITIES.includes(patch.priority) : null;

    const safePatch = { ...patch };
    if (patch?.status && !allowedStatus) delete safePatch.status;
    if (patch?.priority && !allowedPriority) delete safePatch.priority;

    dispatch({ type: 'UPDATE_TICKET', payload: { ticketId, patch: safePatch } });
  };

  const switchRole = (role) => {
    const next = ROLE_TO_USER[role];
    if (!next) return;
    dispatch({ type: 'SWITCH_USER_ROLE', payload: next });
  };

  const canManage = state.currentUser.role === 'Support Agent' || state.currentUser.role === 'Admin';

  return {
    tickets,
    ticketsById: state.ticketsById,
    ticketOrder: state.ticketOrder,
    loading: state.loading,
    currentUser: state.currentUser,
    agents: AGENTS,
    createTicket,
    addMessage,
    assignTicket,
    updateTicket,
    switchRole,
    canManage,
  };
};
