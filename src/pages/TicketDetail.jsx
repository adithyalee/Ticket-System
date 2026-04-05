import React, { useEffect, useMemo, useState } from 'react';
import { Button, GeneralSuccessNotification, NoplinCard } from 'noplin-uis';
import { MessageThread } from '../components/MessageThread';
import { StatusBadge } from '../components/StatusBadge';
import { TicketForm } from '../components/TicketForm';
import { useTickets } from '../hooks/useTickets';
import { PRIORITIES, STATUSES } from '../services/mockData';
import { getPriorityTone, getSlaTone, getVisibleMessages } from '../services/ticketUtils';

function Pill({ label, tone }) {
  return (
    <span
      style={{
        backgroundColor: tone.bg,
        color: tone.text,
        border: `1px solid ${tone.border}`,
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.78rem',
        fontWeight: 800,
      }}
    >
      {label}
    </span>
  );
}

function ReadOnlyChoiceStrip({ options, current }) {
  return (
    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {options.map((opt) => (
        <span
          key={opt}
          style={{
            padding: '8px 12px',
            borderRadius: '9999px',
            border: `1px solid ${current === opt ? '#111' : '#e5e7eb'}`,
            background: current === opt ? '#f3f4f6' : '#fafafa',
            color: '#374151',
            fontWeight: current === opt ? 800 : 500,
            fontSize: '0.82rem',
          }}
        >
          {opt}
        </span>
      ))}
    </div>
  );
}

export default function TicketDetail({ ticketId, onNavigate }) {
  const {
    ticketsById,
    addMessage,
    addInternalNote,
    updateTicket,
    assignTeam,
    assignTicket,
    deleteTicket,
    currentUser,
    canManage,
    agents,
    teams,
    getAgentsForTeam,
  } = useTickets();

  const ticket = ticketsById[ticketId] || null;
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [threadMode, setThreadMode] = useState('Conversation');

  useEffect(() => {
    if (!deleteConfirmOpen) return;
    const onKey = (event) => {
      if (event.key === 'Escape') setDeleteConfirmOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [deleteConfirmOpen]);

  const visibleMessages = useMemo(() => {
    if (!ticket) return [];
    // Conversation = customer-visible thread only (never merge internal notes).
    return threadMode === 'Conversation'
      ? getVisibleMessages(ticket, false)
      : (Array.isArray(ticket.internalNotes) ? [...ticket.internalNotes].sort((a, b) => a.createdAt - b.createdAt) : []);
  }, [ticket, threadMode]);

  const teamAgents = useMemo(() => {
    if (!ticket) return [];
    return getAgentsForTeam(ticket.teamId);
  }, [ticket, getAgentsForTeam]);

  if (!ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ marginTop: 0 }}>Ticket Not Found</h2>
        <Button onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>Back to Dashboard</Button>
      </div>
    );
  }

  const priorityTone = getPriorityTone(ticket.priority);
  const slaTone = getSlaTone(ticket.slaStatus);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '1.75rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <Button onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} style={{ padding: '10px 14px' }}>
              Back to Dashboard
            </Button>
          </div>

          {successMessage && <GeneralSuccessNotification message={successMessage} onClose={() => setSuccessMessage('')} />}

          <NoplinCard style={{ padding: '1.75rem', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem' }}>{ticket.id} ù {ticket.organizationName}</div>
                <h1 style={{ margin: '0.45rem 0 0', color: '#111' }}>{ticket.title}</h1>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                  <StatusBadge status={ticket.status} />
                  <Pill label={ticket.priority} tone={priorityTone} />
                  <Pill label={`SLA: ${ticket.slaStatus}`} tone={slaTone} />
                  <Pill label={`Waiting on ${ticket.waitingOn}`} tone={{ bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' }} />
                </div>
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.88rem', minWidth: 220 }}>
                <div>Created: <strong style={{ color: '#111' }}>{new Date(ticket.createdAt).toLocaleString()}</strong></div>
                <div style={{ marginTop: '0.4rem' }}>Updated: <strong style={{ color: '#111' }}>{new Date(ticket.updatedAt).toLocaleString()}</strong></div>
                <div style={{ marginTop: '0.4rem' }}>Team: <strong style={{ color: '#111' }}>{ticket.teamName}</strong></div>
                <div style={{ marginTop: '0.4rem' }}>Assigned: <strong style={{ color: '#111' }}>{ticket.assignedToAgentName || 'Unassigned'}</strong></div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
              <p style={{ margin: 0, lineHeight: 1.7, color: '#374151', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
            </div>
          </NoplinCard>

          <NoplinCard style={{ padding: '1.25rem', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#111' }}>Ticket Communication</h3>
              {canManage && (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <Button onClick={(e) => { e.preventDefault(); setThreadMode('Conversation'); }} style={{ padding: '8px 14px', background: threadMode === 'Conversation' ? '#111' : '#fff', color: threadMode === 'Conversation' ? '#fff' : '#111' }}>
                    Conversation
                  </Button>
                  <Button onClick={(e) => { e.preventDefault(); setThreadMode('Internal Notes'); }} style={{ padding: '8px 14px', background: threadMode === 'Internal Notes' ? '#111' : '#fff', color: threadMode === 'Internal Notes' ? '#fff' : '#111' }}>
                    Internal Notes
                  </Button>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <MessageThread
                messages={visibleMessages}
                emptyLabel={threadMode === 'Conversation' ? 'No conversation messages yet.' : 'No internal notes yet.'}
              />
            </div>
          </NoplinCard>

          <NoplinCard style={{ padding: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#111' }}>Post a Public Reply</h4>
            <TicketForm
              mode="reply"
              onSubmit={(body) => {
                addMessage(ticket.id, body);
                setSuccessMessage('Public reply sent successfully');
              }}
              onCancel={null}
              initialValues={{ body: '' }}
            />
          </NoplinCard>

          {canManage && (
            <NoplinCard style={{ padding: '1.5rem', border: '1px solid #e5e7eb' }}>
              <h4 style={{ margin: '0 0 1rem', color: '#111' }}>Add Internal Note</h4>
              <TicketForm
                mode="reply"
                onSubmit={(body) => {
                  addInternalNote(ticket.id, body);
                  setSuccessMessage('Internal note added');
                }}
                onCancel={null}
                initialValues={{ body: '' }}
              />
            </NoplinCard>
          )}
        </div>

        <NoplinCard style={{ padding: '1.5rem', border: '1px solid #e5e7eb', position: 'sticky', top: '1.25rem' }}>
          <h3 style={{ marginTop: 0, color: '#111' }}>Management Panel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem' }}>Customer</div>
              <div style={{ color: '#111', fontWeight: 700, marginTop: '0.25rem' }}>{ticket.createdBy?.name || 'Unknown'}</div>
              <div style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '0.35rem' }}>{ticket.category} ù {ticket.organizationName}</div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.75rem' }}>Assign Team</div>
              {canManage ? (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {teams.map((team) => (
                    <Button
                      key={team.id}
                      onClick={(e) => {
                        e.preventDefault();
                        assignTeam(ticket.id, team.id);
                        setSuccessMessage(`Moved to ${team.name}`);
                      }}
                      style={{
                        padding: '8px 12px',
                        background: ticket.teamId === team.id ? '#111' : '#fff',
                        color: ticket.teamId === team.id ? '#fff' : '#111',
                      }}
                    >
                      {team.name}
                    </Button>
                  ))}
                </div>
              ) : <div style={{ color: '#6b7280' }}>{ticket.teamName}</div>}
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.75rem' }}>Assign Agent</div>
              {canManage ? (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <Button onClick={(e) => { e.preventDefault(); assignTicket(ticket.id, null); setSuccessMessage('Ticket unassigned'); }} style={{ padding: '8px 12px' }}>
                    Unassign
                  </Button>
                  {(teamAgents.length ? teamAgents : agents).map((agent) => (
                    <Button
                      key={agent.id}
                      onClick={(e) => {
                        e.preventDefault();
                        assignTicket(ticket.id, agent.id);
                        setSuccessMessage(`Assigned to ${agent.name}`);
                      }}
                      style={{
                        padding: '8px 12px',
                        background: ticket.assignedToAgentId === agent.id ? '#111' : '#fff',
                        color: ticket.assignedToAgentId === agent.id ? '#fff' : '#111',
                      }}
                    >
                      {agent.name}
                    </Button>
                  ))}
                </div>
              ) : <div style={{ color: '#6b7280' }}>{ticket.assignedToAgentName || 'Unassigned'}</div>}
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.75rem' }}>Status</div>
              {canManage ? (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {STATUSES.map((status) => (
                    <Button key={status} onClick={(e) => { e.preventDefault(); updateTicket(ticket.id, { status }); setSuccessMessage(`Status updated to ${status}`); }} style={{ padding: '8px 12px', background: ticket.status === status ? '#111' : '#fff', color: ticket.status === status ? '#fff' : '#111' }}>
                      {status}
                    </Button>
                  ))}
                </div>
              ) : (
                <ReadOnlyChoiceStrip options={STATUSES} current={ticket.status} />
              )}
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.75rem' }}>Priority</div>
              {canManage ? (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {PRIORITIES.map((priority) => (
                    <Button key={priority} onClick={(e) => { e.preventDefault(); updateTicket(ticket.id, { priority, isEscalated: priority === 'Urgent' || ticket.category === 'Security' }); setSuccessMessage(`Priority updated to ${priority}`); }} style={{ padding: '8px 12px', background: ticket.priority === priority ? '#111' : '#fff', color: ticket.priority === priority ? '#fff' : '#111' }}>
                      {priority}
                    </Button>
                  ))}
                </div>
              ) : (
                <ReadOnlyChoiceStrip options={PRIORITIES} current={ticket.priority} />
              )}
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.75rem' }}>Workflow</div>
              {canManage ? (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <Button
                    onClick={(e) => { e.preventDefault(); updateTicket(ticket.id, { waitingOn: 'Support', hasUnreadCustomerReply: true }); setSuccessMessage('Ticket marked as waiting on support'); }}
                    style={{
                      padding: '8px 12px',
                      background: ticket.waitingOn === 'Support' ? '#111' : '#fff',
                      color: ticket.waitingOn === 'Support' ? '#fff' : '#111',
                      border: ticket.waitingOn === 'Support' ? '1px solid #111' : '1px solid #e5e7eb',
                    }}
                  >
                    Waiting On Support
                  </Button>
                  <Button
                    onClick={(e) => { e.preventDefault(); updateTicket(ticket.id, { waitingOn: 'Customer', hasUnreadCustomerReply: false }); setSuccessMessage('Ticket marked as waiting on customer'); }}
                    style={{
                      padding: '8px 12px',
                      background: ticket.waitingOn === 'Customer' ? '#111' : '#fff',
                      color: ticket.waitingOn === 'Customer' ? '#fff' : '#111',
                      border: ticket.waitingOn === 'Customer' ? '1px solid #111' : '1px solid #e5e7eb',
                    }}
                  >
                    Waiting On Customer
                  </Button>
                  <Button
                    onClick={(e) => { e.preventDefault(); updateTicket(ticket.id, { slaStatus: 'At Risk', isEscalated: true }); setSuccessMessage('SLA flagged as at risk'); }}
                    style={{
                      padding: '8px 12px',
                      background: (ticket.slaStatus === 'At Risk' || ticket.slaStatus === 'Breached') ? '#111' : '#fff',
                      color: (ticket.slaStatus === 'At Risk' || ticket.slaStatus === 'Breached') ? '#fff' : '#111',
                      border: (ticket.slaStatus === 'At Risk' || ticket.slaStatus === 'Breached') ? '1px solid #111' : '1px solid #e5e7eb',
                    }}
                    aria-pressed={ticket.slaStatus === 'At Risk' || ticket.slaStatus === 'Breached'}
                  >
                    Flag SLA Risk
                  </Button>
                </div>
              ) : (
                <div style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  <div><strong style={{ color: '#111' }}>Waiting on:</strong> {ticket.waitingOn}</div>
                  <div style={{ marginTop: '0.35rem' }}><strong style={{ color: '#111' }}>SLA:</strong> {ticket.slaStatus}</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>Support staff manage routing and SLA flags.</div>
                </div>
              )}
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ color: '#6b7280', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.75rem' }}>Recent Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {(ticket.activity || []).slice(-7).reverse().map((entry) => (
                  <div key={entry.id}>
                    <div style={{ color: '#111', fontWeight: 800 }}>{entry.text}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>{entry.actorLabel} ù {new Date(entry.at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {currentUser.role === 'Admin' && (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <Button onClick={(e) => { e.preventDefault(); setDeleteConfirmOpen(true); }} style={{ background: '#b91c1c', color: '#fff', border: '1px solid #991b1b' }}>
                  Delete Ticket
                </Button>
              </div>
            )}
          </div>
        </NoplinCard>
      </div>

      {deleteConfirmOpen && (
        <div role="presentation" onClick={() => setDeleteConfirmOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
          <NoplinCard role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, width: '100%', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: 0, color: '#111' }}>Delete this ticket?</h3>
            <p style={{ color: '#4b5563', lineHeight: 1.6 }}>This permanently removes <strong>{ticket.id}</strong> and its full history.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button onClick={(e) => { e.preventDefault(); setDeleteConfirmOpen(false); }}>Cancel</Button>
              <Button onClick={(e) => { e.preventDefault(); deleteTicket(ticket.id); setDeleteConfirmOpen(false); onNavigate('dashboard'); }} style={{ background: '#b91c1c', color: '#fff', border: '1px solid #991b1b' }}>
                Delete
              </Button>
            </div>
          </NoplinCard>
        </div>
      )}
    </>
  );
}
