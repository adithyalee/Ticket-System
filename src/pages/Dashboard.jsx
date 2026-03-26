import React, { useEffect, useMemo, useState } from 'react';
import { Button, TextField } from 'noplin-uis';
import { useTickets } from '../hooks/useTickets';
import { AGENTS, CATEGORIES, PRIORITIES, STATUSES } from '../services/mockData';
import { TicketCard } from '../components/TicketCard';

const PRIORITY_WEIGHT = { Low: 1, Medium: 2, High: 3 };

function filterPillStyle({ selected }) {
  return {
    padding: '10px 14px',
    borderRadius: '9999px',
    border: selected ? '1px solid #111' : '1px solid #eaeaea',
    background: selected ? '#111' : '#fff',
    color: selected ? '#fff' : '#111',
    fontSize: '0.88rem',
    fontWeight: 900,
    opacity: selected ? 1 : 0.95,
  };
}

export default function Dashboard({ onNavigate }) {
  const {
    tickets,
    ticketsById,
    loading,
    canManage,
    agents,
    assignTicket,
    updateTicket,
  } = useTickets();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest'); // 'Newest' | 'Priority'
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter, sortBy, pageSize]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return tickets.filter((t) => {
      if (!t) return false;

      const matchesSearch =
        !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.id || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'Newest') {
      arr.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
      return arr;
    }

    // Priority sort: High first, then Medium, then Low; break ties by recency.
    arr.sort((a, b) => {
      const w = (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
      if (w !== 0) return w;
      return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
    });
    return arr;
  }, [filtered, sortBy]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const cycleAgent = (ticket) => {
    const list = agents?.length ? agents : AGENTS;
    if (!ticket) return list[0];
    const current = ticket.assignedToAgentId;
    const idx = list.findIndex((a) => a.id === current);
    const next = list[(idx + 1 + list.length) % list.length];
    return next;
  };

  const cyclePriority = (ticket) => {
    const order = PRIORITIES;
    const idx = order.findIndex((p) => p === ticket.priority);
    return order[(idx + 1 + order.length) % order.length];
  };

  const advanceStatus = (ticket) => {
    const order = STATUSES;
    const idx = order.findIndex((s) => s === ticket.status);
    if (idx < 0) return 'Open';
    if (order[idx] === 'Resolved') return 'Resolved';
    return order[idx + 1] || 'Resolved';
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: '#666' }}>Loading tickets...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0, color: '#111' }}>Ticket Dashboard</h1>
          <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.95rem' }}>
            {total} ticket{total === 1 ? '' : 's'} in view
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <TextField
            placeholder="Search by title, ID, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            onClick={() => onNavigate('new')}
            style={{
              padding: '12px 18px',
              background: '#111',
              color: '#fff',
              borderRadius: '9999px',
              fontWeight: 900,
              border: '1px solid #111',
            }}
          >
            + New Ticket
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
          <span style={{ color: '#666', fontWeight: 900, fontSize: '0.9rem' }}>Status:</span>
          {['All', ...STATUSES].map((s) => (
            <Button key={s} onClick={() => setStatusFilter(s)} style={filterPillStyle({ selected: statusFilter === s })}>
              {s}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
          <span style={{ color: '#666', fontWeight: 900, fontSize: '0.9rem' }}>Priority:</span>
          {['All', ...PRIORITIES].map((p) => (
            <Button key={p} onClick={() => setPriorityFilter(p)} style={filterPillStyle({ selected: priorityFilter === p })}>
              {p}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
          <span style={{ color: '#666', fontWeight: 900, fontSize: '0.9rem' }}>Category:</span>
          {['All', ...CATEGORIES].map((c) => (
            <Button key={c} onClick={() => setCategoryFilter(c)} style={filterPillStyle({ selected: categoryFilter === c })}>
              {c}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
            <span style={{ color: '#666', fontWeight: 900, fontSize: '0.9rem' }}>Sort:</span>
            {['Newest', 'Priority'].map((s) => (
              <Button key={s} onClick={() => setSortBy(s)} style={filterPillStyle({ selected: sortBy === s })}>
                {s}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
            <span style={{ color: '#666', fontWeight: 900, fontSize: '0.9rem' }}>Page size:</span>
            {[10, 20, 50].map((n) => (
              <Button key={n} onClick={() => setPageSize(n)} style={filterPillStyle({ selected: pageSize === n })}>
                {n}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666', background: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>No tickets found</h3>
          <p style={{ margin: 0 }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {pageTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                canManage={canManage}
                onOpen={() => onNavigate('detail', ticket.id)}
                onAssignNext={(ticketId) => {
                  const t = ticketsById[ticketId];
                  const nextAgent = cycleAgent(t);
                  if (nextAgent) assignTicket(ticketId, nextAgent.id);
                }}
                onCyclePriority={(ticketId) => {
                  const t = ticketsById[ticketId];
                  if (!t) return;
                  const nextPriority = cyclePriority(t);
                  updateTicket(ticketId, { priority: nextPriority });
                }}
                onAdvanceStatus={(ticketId) => {
                  const t = ticketsById[ticketId];
                  if (!t) return;
                  const nextStatus = advanceStatus(t);
                  updateTicket(ticketId, { status: nextStatus });
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ color: '#666', fontWeight: 800 }}>
              Page {currentPage} of {totalPages}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ padding: '10px 14px', borderRadius: '9999px', border: '1px solid #eaeaea', background: '#fff', fontWeight: 900 }}
                disabled={currentPage <= 1}
              >
                Prev
              </Button>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{ padding: '10px 14px', borderRadius: '9999px', border: '1px solid #eaeaea', background: '#fff', fontWeight: 900 }}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
