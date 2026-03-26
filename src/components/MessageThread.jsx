import React, { useMemo } from 'react';
import { NoplinCard } from 'noplin-uis';

function formatAuthor(message) {
  const { authorType, authorLabel } = message;
  if (authorType === 'user') return { label: authorLabel, tag: 'Customer', tagColor: '#0284c7' };
  if (authorType === 'admin') return { label: authorLabel, tag: 'Admin', tagColor: '#7c3aed' };
  return { label: authorLabel, tag: 'Support', tagColor: '#3b82f6' };
}

export function MessageThread({ messages }) {
  const safeMessages = useMemo(() => Array.isArray(messages) ? messages : [], [messages]);

  if (safeMessages.length === 0) {
    return (
      <NoplinCard style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #ccc', background: '#fff' }}>
        <p style={{ margin: 0, color: '#888', fontStyle: 'italic' }}>No messages yet.</p>
      </NoplinCard>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {safeMessages.map((m) => {
        const { label, tag, tagColor } = formatAuthor(m);
        const isSupport = m.authorType === 'agent' || m.authorType === 'admin';

        return (
          <NoplinCard
            key={m.id}
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              border: isSupport ? '1px solid #dbeafe' : '1px solid #eaeaea',
              background: isSupport ? '#f0f7ff' : '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              marginLeft: isSupport ? '3rem' : '0',
              marginRight: isSupport ? '0' : '3rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: tagColor,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {label?.charAt(0) || '?'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'baseline' }}>
                  <strong style={{ color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>
                    {label}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: tagColor, fontWeight: 700 }}>
                    ({tag})
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#888', whiteSpace: 'nowrap' }}>
                {new Date(m.createdAt).toLocaleString()}
              </span>
            </div>

            <p style={{ margin: '0.75rem 0 0 0', whiteSpace: 'pre-wrap', color: '#333', lineHeight: 1.6 }}>
              {m.body}
            </p>
          </NoplinCard>
        );
      })}
    </div>
  );
}

