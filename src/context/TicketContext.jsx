/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useReducer } from 'react';
import { maxTicketNumericId, storageService } from '../services/storageService';

export const TicketContext = createContext(null);

const defaultCurrentUser = {
  id: 'U-USER',
  name: 'Taylor User',
  role: 'User',
};

const initialState = {
  ticketsById: {},
  ticketOrder: [],
  ticketIdSeq: 1000,
  loading: false,
  currentUser: defaultCurrentUser,
};

function buildActivityEntry({ ticketId, idSuffix, at, actorLabel, text }) {
  return {
    id: `ACT-${ticketId}-${idSuffix}`,
    at,
    actorLabel: actorLabel || 'Unknown',
    text,
  };
}

function ticketReducer(state, action) {
  switch (action.type) {
    case 'INIT_STATE': {
      const { ticketsById, ticketOrder, currentUser, ticketIdSeq } = action.payload || {};
      const byId = ticketsById || {};
      const nextSeq = Number.isFinite(ticketIdSeq)
        ? ticketIdSeq
        : Math.max(maxTicketNumericId(byId) + 1, 1000);
      return {
        ...state,
        ticketsById: byId,
        ticketOrder: ticketOrder || [],
        ticketIdSeq: nextSeq,
        currentUser: currentUser || state.currentUser,
        loading: false,
      };
    }

    case 'SWITCH_USER_ROLE': {
      return { ...state, currentUser: action.payload };
    }

    case 'CREATE_TICKET': {
      const ticket = action.payload;
      if (!ticket || !ticket.id || state.ticketsById[ticket.id]) return state;

      const createdActivity = buildActivityEntry({
        ticketId: ticket.id,
        idSuffix: 'created',
        at: ticket.createdAt,
        actorLabel: ticket.createdBy?.name || 'Unknown',
        text: 'Ticket created',
      });

      return {
        ...state,
        ticketsById: {
          ...state.ticketsById,
          [ticket.id]: {
            ...ticket,
            messages: Array.isArray(ticket.messages) ? ticket.messages : [],
            internalNotes: Array.isArray(ticket.internalNotes) ? ticket.internalNotes : [],
            activity: Array.isArray(ticket.activity) && ticket.activity.length ? ticket.activity : [createdActivity],
          },
        },
        ticketOrder: [ticket.id, ...state.ticketOrder],
        ticketIdSeq: state.ticketIdSeq + 1,
      };
    }

    case 'ADD_MESSAGE': {
      const { ticketId, message, nextTicketPatch, meta } = action.payload || {};
      const ticket = state.ticketsById[ticketId];
      if (!ticket || !message) return state;

      const activityEntry = buildActivityEntry({
        ticketId,
        idSuffix: message.id,
        at: message.createdAt,
        actorLabel: meta?.actorLabel || message.authorLabel,
        text: message.authorType === 'user' ? 'Customer replied' : 'Support replied',
      });

      return {
        ...state,
        ticketsById: {
          ...state.ticketsById,
          [ticketId]: {
            ...ticket,
            messages: [...(Array.isArray(ticket.messages) ? ticket.messages : []), message],
            updatedAt: message.createdAt,
            ...(nextTicketPatch || {}),
            activity: [...(Array.isArray(ticket.activity) ? ticket.activity : []), activityEntry],
          },
        },
      };
    }

    case 'ADD_INTERNAL_NOTE': {
      const { ticketId, note, meta } = action.payload || {};
      const ticket = state.ticketsById[ticketId];
      if (!ticket || !note) return state;

      const activityEntry = buildActivityEntry({
        ticketId,
        idSuffix: note.id,
        at: note.createdAt,
        actorLabel: meta?.actorLabel || note.authorLabel,
        text: 'Internal note added',
      });

      return {
        ...state,
        ticketsById: {
          ...state.ticketsById,
          [ticketId]: {
            ...ticket,
            internalNotes: [...(Array.isArray(ticket.internalNotes) ? ticket.internalNotes : []), note],
            updatedAt: note.createdAt,
            activity: [...(Array.isArray(ticket.activity) ? ticket.activity : []), activityEntry],
          },
        },
      };
    }

    case 'ASSIGN_TICKET': {
      const { ticketId, agentId, agentName, teamId, teamName, meta } = action.payload || {};
      const ticket = state.ticketsById[ticketId];
      if (!ticket) return state;
      const now = Date.now();
      const text = agentId ? `Assigned to ${agentName || agentId}` : 'Unassigned';

      return {
        ...state,
        ticketsById: {
          ...state.ticketsById,
          [ticketId]: {
            ...ticket,
            assignedToAgentId: agentId || null,
            assignedToAgentName: agentName || null,
            teamId: teamId || ticket.teamId,
            teamName: teamName || ticket.teamName,
            updatedAt: now,
            activity: [
              ...(Array.isArray(ticket.activity) ? ticket.activity : []),
              buildActivityEntry({
                ticketId,
                idSuffix: `assign-${now}`,
                at: now,
                actorLabel: meta?.actorLabel,
                text,
              }),
            ],
          },
        },
      };
    }

    case 'UPDATE_TICKET': {
      const { ticketId, patch, meta } = action.payload || {};
      const ticket = state.ticketsById[ticketId];
      if (!ticket) return state;

      const now = Date.now();
      const activityBits = [];
      if (patch?.status && patch.status !== ticket.status) activityBits.push(`Status -> ${patch.status}`);
      if (patch?.priority && patch.priority !== ticket.priority) activityBits.push(`Priority -> ${patch.priority}`);
      if (patch?.category && patch.category !== ticket.category) activityBits.push(`Category -> ${patch.category}`);
      if (patch?.teamName && patch.teamName !== ticket.teamName) activityBits.push(`Team -> ${patch.teamName}`);
      if (patch?.waitingOn && patch.waitingOn !== ticket.waitingOn) activityBits.push(`Waiting on ${patch.waitingOn}`);
      if (patch?.slaStatus && patch.slaStatus !== ticket.slaStatus) activityBits.push(`SLA -> ${patch.slaStatus}`);

      const nextActivity = activityBits.length
        ? [
            ...(Array.isArray(ticket.activity) ? ticket.activity : []),
            buildActivityEntry({
              ticketId,
              idSuffix: `update-${now}`,
              at: now,
              actorLabel: meta?.actorLabel,
              text: activityBits.join(' · '),
            }),
          ]
        : (Array.isArray(ticket.activity) ? ticket.activity : []);

      return {
        ...state,
        ticketsById: {
          ...state.ticketsById,
          [ticketId]: {
            ...ticket,
            ...(patch || {}),
            updatedAt: now,
            activity: nextActivity,
          },
        },
      };
    }

    case 'DELETE_TICKET': {
      const { ticketId } = action.payload || {};
      if (!ticketId || !state.ticketsById[ticketId]) return state;
      const nextById = { ...state.ticketsById };
      delete nextById[ticketId];
      return {
        ...state,
        ticketsById: nextById,
        ticketOrder: state.ticketOrder.filter((id) => id !== ticketId),
      };
    }

    default:
      return state;
  }
}

export const TicketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState, (base) => {
    const loaded = storageService.loadState();
    const byId = loaded?.ticketsById || {};
    const order = loaded?.ticketOrder || [];
    const maxId = maxTicketNumericId(byId);
    const savedSeq = loaded?.ticketIdSeq;
    const ticketIdSeq = Math.max(
      Number.isFinite(savedSeq) && savedSeq > 0 ? savedSeq : 0,
      maxId + 1,
      1000,
    );
    return {
      ...base,
      ticketsById: byId,
      ticketOrder: order,
      ticketIdSeq,
      currentUser: loaded?.currentUser || base.currentUser,
      loading: false,
    };
  });

  useEffect(() => {
    if (state.loading) return;
    const handle = setTimeout(() => {
      storageService.saveState({
        ticketsById: state.ticketsById,
        ticketOrder: state.ticketOrder,
        currentUser: state.currentUser,
        ticketIdSeq: state.ticketIdSeq,
      });
    }, 250);
    return () => clearTimeout(handle);
  }, [state.loading, state.ticketsById, state.ticketOrder, state.currentUser, state.ticketIdSeq]);

  return (
    <TicketContext.Provider value={{ state, dispatch }}>
      {children}
    </TicketContext.Provider>
  );
};
