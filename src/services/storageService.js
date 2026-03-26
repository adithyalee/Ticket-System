import { generateMockTickets } from './mockData';

const STORAGE_KEY = 'meeedly_ticketflow_state_v1';
const STORAGE_VERSION = 1;

function normalizeTickets(tickets) {
  const ticketsById = {};
  const ticketOrder = [];

  for (const ticket of tickets || []) {
    if (!ticket || !ticket.id) continue;
    ticketsById[ticket.id] = ticket;
    ticketOrder.push(ticket.id);
  }

  return { ticketsById, ticketOrder };
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export const storageService = {
  loadState: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const mockTickets = generateMockTickets(120);
        const normalized = normalizeTickets(mockTickets);
        return { ...normalized, currentUser: null };
      }

      const parsed = safeParse(raw, null);
      if (!isPlainObject(parsed)) {
        localStorage.removeItem(STORAGE_KEY);
        const mockTickets = generateMockTickets(120);
        const normalized = normalizeTickets(mockTickets);
        return { ...normalized, currentUser: null };
      }

      if (parsed.version !== STORAGE_VERSION) {
        // Version mismatch: reseed with fresh mock data.
        const mockTickets = generateMockTickets(120);
        const normalized = normalizeTickets(mockTickets);
        return { ...normalized, currentUser: parsed.currentUser || null };
      }

      const ticketsById = isPlainObject(parsed.ticketsById) ? parsed.ticketsById : {};
      const ticketOrder = Array.isArray(parsed.ticketOrder) ? parsed.ticketOrder : [];
      const currentUser = parsed.currentUser || null;

      return { ticketsById, ticketOrder, currentUser };
    } catch {
      // If localStorage is not available, fall back to mock data in-memory.
      const mockTickets = generateMockTickets(120);
      const normalized = normalizeTickets(mockTickets);
      return { ...normalized, currentUser: null };
    }
  },

  saveState: (state) => {
    try {
      const payload = {
        version: STORAGE_VERSION,
        ticketsById: state?.ticketsById || {},
        ticketOrder: state?.ticketOrder || [],
        currentUser: state?.currentUser || null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore persistence errors (e.g., quota exceeded).
    }
  },
};
