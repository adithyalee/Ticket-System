import React from 'react';

export const StatusBadge = ({ status }) => {
  const colors = {
    'Open': { bg: '#e0f2fe', text: '#0284c7' },         // Blue
    'In Progress': { bg: '#fef08a', text: '#a16207' },  // Yellow
    'Resolved': { bg: '#dcfce7', text: '#15803d' },     // Green
  };

  const style = colors[status] || { bg: '#f3f4f6', text: '#374151' };

  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.text,
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    }}>
      {status}
    </span>
  );
};
