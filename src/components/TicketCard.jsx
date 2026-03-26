import React, { useMemo } from 'react';
import { NoplinCard, Button } from 'noplin-uis';
import { StatusBadge } from './StatusBadge';
import { AGENTS } from '../services/mockData';

function PriorityBadge({ priority }) {
  const style = useMemo(() => {
    if (priority === 'High') return { bg: '#fee2e2', text: '#b91c1c' };
    if (priority === 'Medium') return { bg: '#fef3c7', text: '#92400e' };
    return { bg: '#f3f4f6', text: '#374151' };
  }, [priority]);

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
      }}
    >
      {priority}
    </span>
  );
}

export function TicketCard({
  ticket,
  onOpen,
  canManage,
  onAssignNext,
  onCyclePriority,
  onAdvanceStatus,
}) {
  const agentName = useMemo(() => {
    if (!ticket.assignedToAgentId) return null;
    return AGENTS.find((a) => a.id === ticket.assignedToAgentId)?.name || null;
  }, [ticket.assignedToAgentId]);

  const descriptionSnippet = useMemo(() => {
    const raw = ticket.description || '';
    return raw.length > 120 ? `${raw.slice(0, 120)}...` : raw;
  }, [ticket.description]);

  return (
    <NoplinCard
      onClick={onOpen}
      style={{
        cursor: 'pointer',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        border: '1px solid #eaeaea',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: 0 }}>
          <span style={{ fontWeight: 700, color: '#888', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {ticket.id}
          </span>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ticket.title}
            </h3>
            <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>
      </div>

      <p style={{ color: '#555', margin: 0, lineHeight: 1.45 }}>
        {descriptionSnippet}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#777', flexWrap: 'wrap' }}>
          <span>
            Category: <strong style={{ color: '#333' }}>{ticket.category}</strong>
          </span>
          <span>
            Assigned:{' '}
            <strong style={{ color: '#333' }}>{agentName ? agentName : 'Unassigned'}</strong>
          </span>
        </div>

        {canManage && (
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAssignNext?.(ticket.id);
              }}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              Assign Next
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onCyclePriority?.(ticket.id);
              }}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              Cycle Priority
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAdvanceStatus?.(ticket.id);
              }}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              disabled={ticket.status === 'Resolved'}
            >
              Next Status
            </Button>
          </div>
        )}
      </div>
    </NoplinCard>
  );
}

