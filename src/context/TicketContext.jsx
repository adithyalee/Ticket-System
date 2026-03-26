/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useReducer } from 'react';
import { storageService } from '../services/storageService';

export const TicketContext = createContext(null);

const defaultCurrentUser = {
  id: 'U-USER',
  name: 'Taylor User',
  role: 'User', // 'User' | 'Support Agent' | 'Admin'
};

const initialState = {
  ticketsById: {},
  ticketOrder: [],
  // Render the UI immediately; if localStorage init fails, the app still works.
  loading: false,
  currentUser: defaultCurrentUser,
};

function ticketReducer(state, action) {
  switch (action.type) {
    case 'INIT_STATE': {
      const { ticketsById, ticketOrder, currentUser } = action.payload || {};
      return {
        ...state,
        ticketsById: ticketsById || {},
        ticketOrder: ticketOrder || [],
        currentUser: currentUser || state.currentUser,
        loading: false,
      };
    }

    case 'SWITCH_USER_ROLE': {
      return { ...state, currentUser: action.payload };
    }

    case 'CREATE_TICKET': {
      const ticket = action.payload;
      if (!ticket || !ticket.id) return state;
      if (state.ticketsById[ticket.id]) return state;

      return {
        ...state,
        ticketsById: { ...state.ticketsById, [ticket.id]: ticket },
        ticketOrder: [ticket.id, ...state.ticketOrder],
      };
    }

    case 'ADD_MESSAGE': {
      const { ticketId, message, nextTicketPatch } = action.payload || {};
      const ticket = state.ticketsById[ticketId];
      if (!ticket || !message) return state;

      const updatedTicket = {
        ...ticket,
        messages: [...ticket.messages, message],
        updatedAt: message.createdAt,
        ...(nextTicketPatch || {}),
      };

      return {
        ...state,
        ticketsById: { ...state.ticketsById, [ticketId]: updatedTicket },
      };
    }

    case 'ASSIGN_TICKET': {
      const { ticketId, agentId } = action.payload || {};
      const ticket = state.ticketsById[ticketId];
      if (!ticket) return state;

      return {
        ...state,
        ticketsById: {
          ...state.ticketsById,
          [ticketId]: {
            ...ticket,
            assignedToAgentId: agentId || null,
            updatedAt: Date.now(),
          },
        },
      };
    }

    case 'UPDATE_TICKET': {
      const { ticketId, patch } = action.payload || {};
      const ticket = state.ticketsById[ticketId];
      if (!ticket) return state;

      return {
        ...state,
        ticketsById: {
          ...state.ticketsById,
          [ticketId]: {
            ...ticket,
            ...(patch || {}),
            updatedAt: Date.now(),
          },
        },
      };
    }

    default:
      return state;
  }
}

export const TicketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState, (base) => {
    // Load synchronously so the UI never gets stuck on `loading=true`
    // (and so the dashboard has data on first render).
    const loaded = storageService.loadState();
    return {
      ...base,
      ticketsById: loaded?.ticketsById || {},
      ticketOrder: loaded?.ticketOrder || [],
      currentUser: loaded?.currentUser || base.currentUser,
      loading: false,
    };
  });

  useEffect(() => {
    if (state.loading) return;

    // Debounced writes to avoid excessive localStorage churn.
    const handle = setTimeout(() => {
      storageService.saveState({
        ticketsById: state.ticketsById,
        ticketOrder: state.ticketOrder,
        currentUser: state.currentUser,
      });
    }, 250);

    return () => clearTimeout(handle);
  }, [state.loading, state.ticketsById, state.ticketOrder, state.currentUser]);

  return (
    <TicketContext.Provider value={{ state, dispatch }}>
      {children}
    </TicketContext.Provider>
  );
};
