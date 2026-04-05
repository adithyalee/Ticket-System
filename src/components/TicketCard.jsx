import React from 'react';
import { Button, NoplinCard } from 'noplin-uis';
import { StatusBadge } from './StatusBadge';
import { getAgentName, getPriorityTone, getSlaTone } from '../services/ticketUtils';

function Pill({ label, tone }) {
  return (
    <span
      style={{
        backgroundColor: tone.bg,
        color: tone.text,
        border: `1px solid ${tone.border}`,
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 800,
      }}
    >
      {label}
    </span>
  );
}

export function TicketCard({
  ticket,
  canManage,
  /** 'admin' = triage + bulk-style controls; 'agent' = line-level advance only */
  cardActionsLevel = 'admin',
  selected,
  onToggleSelect,
  onOpen,
  onAssignNext,
  onCyclePriority,
  onAdvanceStatus,
}) {
  const priorityTone = getPriorityTone(ticket.priority);
  const slaTone = getSlaTone(ticket.slaStatus);

  return (
    <NoplinCard
      style={{
        padding: '1.5rem',
        border: selected ? '1px solid #111' : '1px solid #eaeaea',
        boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260, flex: 1 }}>
          <div style={{ color: '#888', fontWeight: 800, fontSize: '0.82rem' }}>{ticket.id} · {ticket.organizationName}</div>
          <h3 style={{ margin: '0.45rem 0 0', color: '#111' }}>{ticket.title}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
            <StatusBadge status={ticket.status} />
            <Pill label={ticket.priority} tone={priorityTone} />
            <Pill label={`SLA: ${ticket.slaStatus}`} tone={slaTone} />
            {ticket.isEscalated && <Pill label="Escalated" tone={{ bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' }} />}
          </div>
        </div>

        {canManage && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {cardActionsLevel === 'admin' && (
              <>
                <Button onClick={(e) => { e.preventDefault(); onToggleSelect?.(ticket.id); }} style={{ padding: '8px 14px' }}>
                  {selected ? 'Selected' : 'Select'}
                </Button>
                <Button onClick={(e) => { e.preventDefault(); onAssignNext?.(ticket.id); }} style={{ padding: '8px 14px' }}>
                  Assign Next
                </Button>
                <Button onClick={(e) => { e.preventDefault(); onCyclePriority?.(ticket.id); }} style={{ padding: '8px 14px' }}>
                  Cycle Priority
                </Button>
              </>
            )}
            <Button onClick={(e) => { e.preventDefault(); onAdvanceStatus?.(ticket.id); }} style={{ padding: '8px 14px' }}>
              Next Status
            </Button>
          </div>
        )}
      </div>

      <p style={{ color: '#4b5563', margin: '1rem 0 0', lineHeight: 1.6 }}>
        {ticket.description.length > 180 ? `${ticket.description.slice(0, 180)}...` : ticket.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: '#6b7280', fontSize: '0.88rem' }}>
          <span>Team: <strong style={{ color: '#111' }}>{ticket.teamName}</strong></span>
          <span>Assigned: <strong style={{ color: '#111' }}>{getAgentName(ticket.assignedToAgentId)}</strong></span>
          <span>Waiting on: <strong style={{ color: '#111' }}>{ticket.waitingOn}</strong></span>
          <span>Category: <strong style={{ color: '#111' }}>{ticket.category}</strong></span>
        </div>
        <Button onClick={(e) => { e.preventDefault(); onOpen?.(); }} style={{ padding: '8px 16px' }}>
          Open Ticket
        </Button>
      </div>
    </NoplinCard>
  );
}
