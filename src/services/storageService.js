import { generateMockTickets } from './mockData';
import { enrichTicketsById } from './ticketShape';

/** Persistence key; swap implementation here when wiring a real API. */
const STORAGE_KEY = 'meeedly_ticketflow_state_v1';
const STORAGE_VERSION = 2;

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

export function maxTicketNumericId(ticketsById) {
  let max = 0;
  for (const id of Object.keys(ticketsById || {})) {
    const m = /^TKT-(\d+)$/.exec(id);
    if (!m) continue;
    const n = Number.parseInt(m[1], 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max;
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
        return {
          ticketsById: enrichTicketsById(normalized.ticketsById),
          ticketOrder: normalized.ticketOrder,
          currentUser: null,
        };
      }

      const parsed = safeParse(raw, null);
      if (!isPlainObject(parsed)) {
        localStorage.removeItem(STORAGE_KEY);
        const mockTickets = generateMockTickets(120);
        const normalized = normalizeTickets(mockTickets);
        return {
          ticketsById: enrichTicketsById(normalized.ticketsById),
          ticketOrder: normalized.ticketOrder,
          currentUser: null,
        };
      }

      const rawById = isPlainObject(parsed.ticketsById) ? parsed.ticketsById : {};
      let ticketOrder = Array.isArray(parsed.ticketOrder) ? parsed.ticketOrder : [];
      const currentUser = parsed.currentUser || null;
      const ticketIdSeq = Number.isFinite(parsed.ticketIdSeq) ? parsed.ticketIdSeq : null;

      // Migrate older payloads: enrich shape instead of wiping user data.
      const ticketsById = enrichTicketsById(rawById);
      if (ticketOrder.length === 0 && Object.keys(ticketsById).length > 0) {
        ticketOrder = Object.keys(ticketsById);
      }
      ticketOrder = [...new Set(ticketOrder.filter((id) => ticketsById[id]))];

      if (parsed.version !== STORAGE_VERSION && Object.keys(ticketsById).length === 0) {
        const mockTickets = generateMockTickets(120);
        const normalized = normalizeTickets(mockTickets);
        return {
          ...normalized,
          ticketsById: enrichTicketsById(normalized.ticketsById),
          currentUser: parsed.currentUser || null,
        };
      }

      return { ticketsById, ticketOrder, currentUser, ticketIdSeq };
    } catch {
      // If localStorage is not available, fall back to mock data in-memory.
      const mockTickets = generateMockTickets(120);
      const normalized = normalizeTickets(mockTickets);
      return {
        ticketsById: enrichTicketsById(normalized.ticketsById),
        ticketOrder: normalized.ticketOrder,
        currentUser: null,
      };
    }
  },

  saveState: (state) => {
    try {
      const payload = {
        version: STORAGE_VERSION,
        ticketsById: state?.ticketsById || {},
        ticketOrder: state?.ticketOrder || [],
        currentUser: state?.currentUser || null,
        ticketIdSeq: state?.ticketIdSeq ?? null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore persistence errors (e.g., quota exceeded).
    }
  },
};
