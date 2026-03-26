import React, { useState } from 'react';
import { Button, GeneralSuccessNotification, NoplinCard } from 'noplin-uis';
import { TicketForm } from '../components/TicketForm';
import { useTickets } from '../hooks/useTickets';

export default function CreateTicket({ onNavigate }) {
  const { createTicket } = useTickets();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (payload) => {
    const newTicketId = createTicket(payload);
    setShowSuccess(true);
    setTimeout(() => {
      onNavigate('detail', newTicketId);
    }, 900);
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <Button
          onClick={() => onNavigate('dashboard')}
          style={{
            padding: '8px 12px',
            borderRadius: '9999px',
            border: '1px solid #eaeaea',
            background: '#fff',
            color: '#111',
            fontWeight: 800,
          }}
        >
          &larr; Back
        </Button>
        <h1 style={{ fontSize: '2rem', margin: 0, color: '#111' }}>Submit a Support Ticket</h1>
      </div>

      {showSuccess && (
        <div style={{ marginBottom: '1.25rem' }}>
          <GeneralSuccessNotification
            message="Ticket submitted successfully!"
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}

      <NoplinCard
        style={{
          padding: '2.25rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #eaeaea',
        }}
      >
        <TicketForm mode="create" onSubmit={handleSubmit} onCancel={() => onNavigate('dashboard')} />
      </NoplinCard>
    </div>
  );
}
