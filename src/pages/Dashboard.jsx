import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, GeneralSuccessNotification, NoplinCard, TextField } from 'noplin-uis';
import { TicketCard } from '../components/TicketCard';
import { useTickets } from '../hooks/useTickets';
import { CATEGORIES, PRIORITIES, STATUSES } from '../services/mockData';
import { filterTicketsForDashboard, sortTicketsForDashboard } from '../services/ticketSelectors';
import { buildTicketStats, getPriorityCycle } from '../services/ticketUtils';

function filterPillStyle(selected) {
  return {
    padding: '10px 14px',
    borderRadius: '9999px',
    border: selected ? '1px solid #111' : '1px solid #e5e7eb',
    background: selected ? '#111' : '#fff',
    color: selected ? '#fff' : '#111',
    fontWeight: 800,
  };
}

function MetricCard({
  label,
  value,
  helper,
  onActivate,
  isActive,
  ariaLabel,
}) {
  const interactive = typeof onActivate === 'function';
  return (
    <NoplinCard
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? (ariaLabel || `${label}: ${value}. ${helper || ''}`) : undefined}
      aria-pressed={interactive ? Boolean(isActive) : undefined}
      onClick={interactive ? (e) => { e.preventDefault(); onActivate(); } : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      } : undefined}
      style={{
        padding: '1.25rem',
        border: `1px solid ${isActive ? '#111' : '#e5e7eb'}`,
        cursor: interactive ? 'pointer' : 'default',
        outline: 'none',
        boxShadow: isActive ? '0 0 0 2px rgba(17, 17, 17, 0.12)' : undefined,
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
      }}
    >
      <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem' }}>{label}</div>
      <div style={{ color: '#111', fontSize: '1.75rem', fontWeight: 900, marginTop: '0.35rem' }}>{value}</div>
      <div style={{ color: '#6b7280', marginTop: '0.35rem', fontSize: '0.88rem' }}>{helper}</div>
    </NoplinCard>
  );
}

export default function Dashboard({ onNavigate, initialState, onStateChange }) {
  const {
    tickets,
    ticketsById,
    loading,
    canManage,
    isAdmin,
    currentUser,
    currentTeamId,
    agents,
    teams,
    assignTicket,
    bulkAssignAgent,
    bulkUpdateTickets,
    updateTicket,
  } = useTickets();

  /** Hydrate once from parent when this screen mounts (e.g. returning from ticket detail). Avoid useEffect([initialState]) — parent gets a new object every sync and would re-apply state every tick ("dancing"). */
  const [searchTerm, setSearchTerm] = useState(() => initialState?.searchTerm ?? '');
  const [statusFilter, setStatusFilter] = useState(() => initialState?.statusFilter ?? 'All');
  const [priorityFilter, setPriorityFilter] = useState(() => initialState?.priorityFilter ?? 'All');
  const [categoryFilter, setCategoryFilter] = useState(() => initialState?.categoryFilter ?? 'All');
  const [teamFilter, setTeamFilter] = useState(() => initialState?.teamFilter ?? 'All');
  const [queueView, setQueueView] = useState(() => initialState?.queueView ?? 'All');
  const [slaStatusFilter, setSlaStatusFilter] = useState(() => initialState?.slaStatusFilter ?? 'All');
  const [sortBy, setSortBy] = useState(() => initialState?.sortBy ?? 'Newest');
  const [pageSize, setPageSize] = useState(() => initialState?.pageSize ?? 10);
  const [page, setPage] = useState(() => initialState?.page ?? 1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  /** Scroll target only when user clicks Prev/Next — not on every re-render (role switch, Strict Mode, etc.). */
  const ticketListAnchorRef = useRef(null);
  const prevRoleRef = useRef(currentUser.role);
  /** Avoid setPage(1) on mount / Strict Mode double-invoke; only when filter key actually changes. */
  const filterKeyForPageResetRef = useRef(null);

  useEffect(() => {
    onStateChange?.({
      searchTerm,
      statusFilter,
      priorityFilter,
      categoryFilter,
      teamFilter,
      queueView,
      slaStatusFilter,
      sortBy,
      pageSize,
      page,
    });
  }, [onStateChange, searchTerm, statusFilter, priorityFilter, categoryFilter, teamFilter, queueView, slaStatusFilter, sortBy, pageSize, page]);

  /** Reset to page 1 when filters change — not when re-entering dashboard with saved filters (same key as before). */
  useEffect(() => {
    const key = [searchTerm, statusFilter, priorityFilter, categoryFilter, teamFilter, queueView, slaStatusFilter, sortBy, pageSize].join('\0');
    if (filterKeyForPageResetRef.current === null) {
      filterKeyForPageResetRef.current = key;
      return;
    }
    if (filterKeyForPageResetRef.current === key) return;
    filterKeyForPageResetRef.current = key;
    setPage(1);
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter, teamFilter, queueView, slaStatusFilter, sortBy, pageSize]);

  /** Customer role has no agent/team context — "Mine" / "My Team" would show an empty list and huge layout jumps. */
  useEffect(() => {
    const prev = prevRoleRef.current;
    prevRoleRef.current = currentUser.role;
    if (prev !== currentUser.role && currentUser.role === 'User') {
      if (queueView === 'Mine' || queueView === 'My Team') {
        setQueueView('All');
      }
    }
  }, [currentUser.role, queueView]);

  /** Avoid bulk bar / selection flash when demoting from Admin. */
  useEffect(() => {
    if (!isAdmin) setSelectedIds([]);
  }, [isAdmin]);

  const scrollTicketListIntoView = () => {
    requestAnimationFrame(() => {
      ticketListAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const stats = useMemo(() => buildTicketStats(tickets), [tickets]);

  const filtered = useMemo(
    () =>
      filterTicketsForDashboard(tickets, {
        searchTerm,
        statusFilter,
        priorityFilter,
        categoryFilter,
        teamFilter,
        queueView,
        slaStatusFilter,
        currentUser,
        currentTeamId,
      }),
    [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter, teamFilter, queueView, slaStatusFilter, currentUser, currentTeamId],
  );

  const sorted = useMemo(() => sortTicketsForDashboard(filtered, sortBy), [filtered, sortBy]);

  /** Keep page in range when the filtered list shrinks (role/queue/filters) without triggering window scroll elsewhere. */
  useEffect(() => {
    const tp = Math.max(1, Math.ceil(sorted.length / pageSize));
    setPage((p) => Math.min(Math.max(1, p), tp));
  }, [sorted.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pageTickets = useMemo(() => sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize), [sorted, currentPage, pageSize]);

  const selectedTickets = selectedIds.map((id) => ticketsById[id]).filter(Boolean);
  const activeFilterText = [
    queueView !== 'All' ? `Queue: ${queueView}` : null,
    statusFilter !== 'All' ? `Status: ${statusFilter}` : null,
    priorityFilter !== 'All' ? `Priority: ${priorityFilter}` : null,
    categoryFilter !== 'All' ? `Category: ${categoryFilter}` : null,
    teamFilter !== 'All' ? `Team: ${teams.find((team) => team.id === teamFilter)?.name || teamFilter}` : null,
    slaStatusFilter !== 'All' ? `SLA: ${slaStatusFilter}` : null,
    searchTerm.trim() ? `Search: "${searchTerm.trim()}"` : null,
  ].filter(Boolean).join(' · ');

  const cycleAgent = (ticket) => {
    const pool = agents.filter((agent) => agent.teamId === ticket.teamId);
    const list = pool.length ? pool : agents;
    const idx = list.findIndex((agent) => agent.id === ticket.assignedToAgentId);
    return list[(idx + 1 + list.length) % list.length];
  };

  const advanceStatus = (ticket) => {
    const idx = STATUSES.findIndex((status) => status === ticket.status);
    if (idx < 0) return 'Open';
    return STATUSES[Math.min(idx + 1, STATUSES.length - 1)];
  };

  const toggleSelected = (ticketId) => {
    setSelectedIds((current) => current.includes(ticketId) ? current.filter((id) => id !== ticketId) : [...current, ticketId]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setTeamFilter('All');
    setQueueView('All');
    setSlaStatusFilter('All');
  };

  const filtersAreDefault = !searchTerm.trim()
    && statusFilter === 'All'
    && priorityFilter === 'All'
    && categoryFilter === 'All'
    && teamFilter === 'All'
    && queueView === 'All'
    && slaStatusFilter === 'All';

  if (loading) {
    return <div style={{ padding: '2rem', color: '#666' }}>Loading tickets...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#111', fontSize: '2rem' }}>Enterprise Support Dashboard</h1>
          <div style={{ marginTop: '0.45rem', color: '#6b7280' }}>{sorted.length} tickets in view · role: {currentUser.role}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField placeholder="Search tickets, orgs, IDs, teams" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button onClick={(e) => { e.preventDefault(); onNavigate('new'); }} style={{ padding: '12px 18px', background: '#111', color: '#fff', border: '1px solid #111' }}>
            + New Ticket
          </Button>
        </div>
      </div>

      {successMessage && (
        <div style={{ marginBottom: '1rem' }}>
          <GeneralSuccessNotification message={successMessage} onClose={() => setSuccessMessage('')} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <MetricCard
          label="Backlog"
          value={stats.total}
          helper="All active and historical tickets"
          isActive={filtersAreDefault}
          onActivate={() => { clearFilters(); }}
          ariaLabel="Show full backlog, clear dashboard filters"
        />
        <MetricCard
          label="Urgent"
          value={stats.urgent}
          helper="Needs fast routing"
          isActive={priorityFilter === 'Urgent' && slaStatusFilter === 'All'}
          onActivate={() => {
            setQueueView('All');
            setSlaStatusFilter('All');
            setPriorityFilter('Urgent');
          }}
          ariaLabel="Filter to urgent priority tickets"
        />
        <MetricCard
          label="Unassigned"
          value={stats.unassigned}
          helper="Triage queue pressure"
          isActive={queueView === 'Unassigned' && slaStatusFilter === 'All'}
          onActivate={() => {
            setSlaStatusFilter('All');
            setQueueView('Unassigned');
          }}
          ariaLabel="Filter to unassigned tickets"
        />
        <MetricCard
          label="Awaiting Customer"
          value={stats.awaitingCustomer}
          helper="Support has responded"
          isActive={queueView === 'Awaiting Customer' && slaStatusFilter === 'All'}
          onActivate={() => {
            setSlaStatusFilter('All');
            setQueueView('Awaiting Customer');
          }}
          ariaLabel="Filter to tickets awaiting customer response"
        />
        <MetricCard
          label="SLA Breached"
          value={stats.breached}
          helper="Operational risk tickets"
          isActive={slaStatusFilter === 'Breached'}
          onActivate={() => {
            setSlaStatusFilter('Breached');
          }}
          ariaLabel="Filter to SLA breached tickets"
        />
      </div>

      <NoplinCard style={{ padding: '1.25rem', border: '1px solid #e5e7eb', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {(canManage
              ? ['All', 'Mine', 'My Team', 'Unassigned', 'Escalated', 'Awaiting Customer']
              : ['All', 'Unassigned', 'Escalated', 'Awaiting Customer']
            ).map((queue) => (
              <Button key={queue} onClick={(e) => { e.preventDefault(); setQueueView(queue); }} style={filterPillStyle(queueView === queue)}>
                {queue}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {['All', ...STATUSES].map((status) => (
              <Button key={status} onClick={(e) => { e.preventDefault(); setStatusFilter(status); }} style={filterPillStyle(statusFilter === status)}>
                {status}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {['All', ...PRIORITIES].map((priority) => (
              <Button key={priority} onClick={(e) => { e.preventDefault(); setPriorityFilter(priority); }} style={filterPillStyle(priorityFilter === priority)}>
                {priority}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {['All', ...CATEGORIES].map((category) => (
              <Button key={category} onClick={(e) => { e.preventDefault(); setCategoryFilter(category); }} style={filterPillStyle(categoryFilter === category)}>
                {category}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Button onClick={(e) => { e.preventDefault(); setTeamFilter('All'); }} style={filterPillStyle(teamFilter === 'All')}>
              All Teams
            </Button>
            {teams.map((team) => (
              <Button key={team.id} onClick={(e) => { e.preventDefault(); setTeamFilter(team.id); }} style={filterPillStyle(teamFilter === team.id)}>
                {team.name}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {['Newest', 'Priority', 'SLA'].map((sort) => (
                <Button key={sort} onClick={(e) => { e.preventDefault(); setSortBy(sort); }} style={filterPillStyle(sortBy === sort)}>
                  Sort: {sort}
                </Button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {[10, 20, 50].map((size) => (
                <Button key={size} onClick={(e) => { e.preventDefault(); setPageSize(size); }} style={filterPillStyle(pageSize === size)}>
                  {size}/page
                </Button>
              ))}
              <Button onClick={(e) => { e.preventDefault(); clearFilters(); }} style={{ padding: '10px 14px' }}>
                Clear Filters
              </Button>
            </div>
          </div>

          {activeFilterText && <div style={{ color: '#6b7280', fontWeight: 700 }}>Filtered: <span style={{ color: '#111' }}>{activeFilterText}</span></div>}
        </div>
      </NoplinCard>

      {canManage && isAdmin && selectedTickets.length > 0 && (
        <NoplinCard style={{ padding: '1.25rem', border: '1px solid #e5e7eb', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ color: '#111', fontWeight: 800 }}>{selectedTickets.length} ticket(s) selected for bulk actions</div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Button onClick={(e) => { e.preventDefault(); bulkUpdateTickets(selectedIds, { status: 'In Progress' }); setSuccessMessage('Bulk status updated to In Progress'); setSelectedIds([]); }}>
                Start Work
              </Button>
              <Button onClick={(e) => { e.preventDefault(); bulkUpdateTickets(selectedIds, { priority: 'High' }); setSuccessMessage('Bulk priority updated to High'); setSelectedIds([]); }}>
                Mark High
              </Button>
              <Button onClick={(e) => { e.preventDefault(); bulkAssignAgent(selectedIds, agents[0]?.id); setSuccessMessage(`Assigned selected tickets to ${agents[0]?.name}`); setSelectedIds([]); }}>
                Assign First Agent
              </Button>
              <Button onClick={(e) => { e.preventDefault(); setSelectedIds([]); }}>
                Clear Selection
              </Button>
            </div>
          </div>
        </NoplinCard>
      )}

      <div ref={ticketListAnchorRef} style={{ scrollMarginTop: '100px' }} aria-hidden />
      {pageTickets.length === 0 ? (
        <NoplinCard style={{ padding: '3rem', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0, color: '#111' }}>No tickets found</h3>
          <p style={{ color: '#6b7280', marginBottom: 0 }}>Adjust filters or create a new ticket.</p>
        </NoplinCard>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {pageTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              canManage={canManage}
              cardActionsLevel={isAdmin ? 'admin' : 'agent'}
              selected={selectedIds.includes(ticket.id)}
              onToggleSelect={toggleSelected}
              onOpen={() => onNavigate('detail', ticket.id)}
              onAssignNext={(ticketId) => {
                const nextAgent = cycleAgent(ticketsById[ticketId]);
                if (!nextAgent) return;
                assignTicket(ticketId, nextAgent.id);
                setSuccessMessage(`Assigned to ${nextAgent.name}`);
              }}
              onCyclePriority={(ticketId) => {
                const ticketRef = ticketsById[ticketId];
                updateTicket(ticketId, { priority: getPriorityCycle(ticketRef.priority) });
                setSuccessMessage('Priority updated');
              }}
              onAdvanceStatus={(ticketId) => {
                const ticketRef = ticketsById[ticketId];
                updateTicket(ticketId, { status: advanceStatus(ticketRef) });
                setSuccessMessage('Status advanced');
              }}
            />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <div style={{ color: '#6b7280', fontWeight: 800 }}>Page {currentPage} of {totalPages}</div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {(() => {
            const isFirst = currentPage <= 1;
            const isLast = currentPage >= totalPages;
            const disabledWrap = (disabled) => ({
              display: 'inline-block',
              opacity: disabled ? 0.45 : 1,
              pointerEvents: disabled ? 'none' : 'auto',
              cursor: disabled ? 'not-allowed' : 'pointer',
            });
            return (
              <>
                <div style={disabledWrap(isFirst)}>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isFirst) {
                        setPage((value) => Math.max(1, value - 1));
                        scrollTicketListIntoView();
                      }
                    }}
                    disabled={isFirst}
                    aria-disabled={isFirst}
                    style={{ fontWeight: 800 }}
                  >
                    Prev
                  </Button>
                </div>
                <div style={disabledWrap(isLast)}>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isLast) {
                        setPage((value) => Math.min(totalPages, value + 1));
                        scrollTicketListIntoView();
                      }
                    }}
                    disabled={isLast}
                    aria-disabled={isLast}
                    style={{ fontWeight: 800 }}
                  >
                    Next
                  </Button>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
