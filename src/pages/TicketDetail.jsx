import React, { useMemo, useState } from 'react';
import { Button, NoplinCard } from 'noplin-uis';
import { useTickets } from '../hooks/useTickets';
import { MessageThread } from '../components/MessageThread';
import { StatusBadge } from '../components/StatusBadge';
import { TicketForm } from '../components/TicketForm';
import { AGENTS, PRIORITIES, STATUSES } from '../services/mockData';

function priorityStyle(priority) {
  if (priority === 'High') return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
  if (priority === 'Medium') return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
  return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
}

export default function TicketDetail({ ticketId, onNavigate }) {
  const { ticketsById, addMessage, updateTicket, assignTicket, currentUser, canManage, agents } = useTickets();

  const ticket = ticketsById[ticketId] || null;

  const [localNavTick] = useState(0);
  void localNavTick;

  const assignedAgentName = useMemo(() => {
    if (!ticket?.assignedToAgentId) return null;
    return (agents || AGENTS).find((a) => a.id === ticket.assignedToAgentId)?.name || null;
  }, [ticket?.assignedToAgentId, agents]);

  if (!ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ marginTop: 0 }}>Ticket Not Found</h2>
        <Button
          onClick={() => onNavigate('dashboard')}
          style={{ padding: '12px 22px', fontWeight: 800, borderRadius: '9999px' }}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const canReply = true;

  const pri = priorityStyle(ticket.priority);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.25rem', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            onClick={() => onNavigate('dashboard')}
            style={{
              padding: '10px 14px',
              borderRadius: '9999px',
              border: '1px solid #eaeaea',
              background: '#fff',
              fontWeight: 800,
              color: '#111',
            }}
          >
            &larr; Back
          </Button>
        </div>

        <NoplinCard
          style={{
            padding: '2.25rem',
            borderRadius: '12px',
            border: '1px solid #eaeaea',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 240 }}>
              <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                {ticket.id}
              </span>
              <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#111' }}>{ticket.title}</h1>
              <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <StatusBadge status={ticket.status} />
                <span
                  style={{
                    backgroundColor: pri.bg,
                    color: pri.text,
                    border: `1px solid ${pri.border}`,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  {ticket.priority}
                </span>
                <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: 700 }}>
                  Category: <span style={{ color: '#111' }}>{ticket.category}</span>
                </span>
              </div>
            </div>
            <div style={{ minWidth: 240 }}>
              <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 700 }}>
                Assigned to: <span style={{ color: '#111' }}>{assignedAgentName || 'Unassigned'}</span>
              </div>
              <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid #eee' }}>
            <p style={{ color: '#333', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
          </div>
        </NoplinCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: '#222', fontSize: '1.25rem' }}>Conversation Thread</h3>
          <MessageThread messages={ticket.messages} />
        </div>

        {canReply && (
          <NoplinCard style={{ padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea' }}>
            <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Add a Reply</h4>
            <TicketForm
              mode="reply"
              onSubmit={(body) => addMessage(ticket.id, body)}
              onCancel={null}
              initialValues={{ body: '' }}
            />
          </NoplinCard>
        )}
      </div>

      <NoplinCard
        style={{
          padding: '1.75rem',
          position: 'sticky',
          top: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #eaeaea',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '1.25rem', color: '#111', fontSize: '1.1rem' }}>Ticket Management</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.35rem' }}>Created By</div>
            <div style={{ color: '#111', fontWeight: 700 }}>
              {ticket.createdBy?.name || 'Unknown'}
            </div>
            <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Last updated: {new Date(ticket.updatedAt || ticket.createdAt).toLocaleString()}
            </div>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.9rem' }}>Assign</div>

            {!canManage ? (
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Switch role to Support Agent or Admin to manage.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                <Button
                  onClick={() => assignTicket(ticket.id, null)}
                  disabled={!ticket.assignedToAgentId}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '9999px',
                    background: !ticket.assignedToAgentId ? '#e5e7eb' : '#fff',
                    border: '1px solid #eaeaea',
                    color: '#111',
                    fontWeight: 800,
                    opacity: !ticket.assignedToAgentId ? 0.7 : 1,
                  }}
                >
                  Unassign
                </Button>

                {(agents || AGENTS).map((a) => {
                  const selected = ticket.assignedToAgentId === a.id;
                  return (
                    <Button
                      key={a.id}
                      onClick={() => assignTicket(ticket.id, a.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '9999px',
                        background: selected ? '#111' : '#fff',
                        color: selected ? '#fff' : '#111',
                        border: selected ? '1px solid #111' : '1px solid #eaeaea',
                        fontWeight: 900,
                      }}
                    >
                      {a.name}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>Status</div>
            {!canManage ? (
              <div style={{ color: '#888', fontSize: '0.9rem' }}>{ticket.status}</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {STATUSES.map((s) => {
                  const selected = ticket.status === s;
                  return (
                    <Button
                      key={s}
                      onClick={() => updateTicket(ticket.id, { status: s })}
                      disabled={selected}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '9999px',
                        background: selected ? '#e5e7eb' : '#fff',
                        border: '1px solid #eaeaea',
                        color: '#111',
                        fontWeight: 900,
                        opacity: selected ? 0.8 : 1,
                      }}
                    >
                      {s}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>Priority</div>
            {!canManage ? (
              <div style={{ color: '#888', fontSize: '0.9rem' }}>{ticket.priority}</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {PRIORITIES.map((p) => {
                  const selected = ticket.priority === p;
                  return (
                    <Button
                      key={p}
                      onClick={() => updateTicket(ticket.id, { priority: p })}
                      disabled={selected}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '9999px',
                        background: selected ? '#e5e7eb' : '#fff',
                        border: '1px solid #eaeaea',
                        color: '#111',
                        fontWeight: 900,
                        opacity: selected ? 0.8 : 1,
                      }}
                    >
                      {p}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.45 }}>
            <strong style={{ color: '#111' }}>Acting as:</strong> {currentUser.role} — {currentUser.name}
          </div>
        </div>
      </NoplinCard>
    </div>
  );
}
