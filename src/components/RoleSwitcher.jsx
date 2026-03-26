import React, { useMemo } from 'react';
import { NoplinCard, Button } from 'noplin-uis';
import { useTickets } from '../hooks/useTickets';

const ROLES = ['User', 'Support Agent', 'Admin'];

function roleButtonStyle({ selected }) {
  return {
    padding: '10px 14px',
    borderRadius: '9999px',
    border: selected ? '1px solid #111' : '1px solid #eaeaea',
    background: selected ? '#111' : '#fff',
    color: selected ? '#fff' : '#111',
    fontSize: '0.88rem',
    fontWeight: 700,
  };
}

export function RoleSwitcher() {
  const { currentUser, switchRole } = useTickets();
  const activeRole = currentUser?.role || 'User';

  const subtitle = useMemo(() => {
    if (activeRole === 'User') return 'Customer view';
    if (activeRole === 'Support Agent') return 'Support workflow view';
    return 'Admin workflow view';
  }, [activeRole]);

  return (
    <NoplinCard
      style={{
        padding: '1rem',
        border: '1px solid #eee',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
        <div>
          <strong style={{ color: '#111', fontSize: '1rem' }}>Role</strong>
          <div style={{ color: '#666', fontSize: '0.82rem', marginTop: '0.25rem' }}>{subtitle}</div>
        </div>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>
          Acting as: <strong style={{ color: '#111' }}>{currentUser.name}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        {ROLES.map((role) => (
          <Button key={role} onClick={() => switchRole(role)} style={roleButtonStyle({ selected: activeRole === role })}>
            {role}
          </Button>
        ))}
      </div>
    </NoplinCard>
  );
}

