import React from 'react';
import { Button } from 'noplin-uis';

export function Navbar({ currentPage, onNavigate }) {
  return (
    <nav
      style={{
        padding: '1.25rem 2rem',
        background: '#fff',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <strong style={{ fontSize: '1.25rem', color: '#111' }}>Meeedly Support</strong>
        <span style={{ fontSize: '0.78rem', color: '#666' }}>Powered by Meeedly UI components</span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
        <Button
          onClick={() => onNavigate('dashboard')}
          style={{
            padding: '10px 16px',
            background: currentPage === 'dashboard' ? '#111' : '#fff',
            color: currentPage === 'dashboard' ? '#fff' : '#111',
            border: currentPage === 'dashboard' ? '1px solid #111' : '1px solid #eaeaea',
          }}
        >
          Dashboard
        </Button>
        <Button
          onClick={() => onNavigate('new')}
          style={{
            padding: '10px 16px',
            background: currentPage === 'new' ? '#111' : '#fff',
            color: currentPage === 'new' ? '#fff' : '#111',
            border: currentPage === 'new' ? '1px solid #111' : '1px solid #eaeaea',
          }}
        >
          Create Ticket
        </Button>
      </div>
    </nav>
  );
}

