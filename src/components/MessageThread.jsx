import React from 'react';
import { NoplinCard } from 'noplin-uis';

function formatAuthor(message) {
  if (message.authorType === 'user') return { label: message.authorLabel, tag: 'Customer', tagColor: '#0284c7' };
  if (message.visibility === 'internal') return { label: message.authorLabel, tag: 'Internal Note', tagColor: '#7c3aed' };
  if (message.authorType === 'admin') return { label: message.authorLabel, tag: 'Admin', tagColor: '#6d28d9' };
  return { label: message.authorLabel, tag: 'Support', tagColor: '#2563eb' };
}

export function MessageThread({ messages, emptyLabel = 'No messages yet.' }) {
  const safeMessages = Array.isArray(messages) ? messages : [];

  if (safeMessages.length === 0) {
    return (
      <NoplinCard style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #d1d5db' }}>
        <p style={{ margin: 0, color: '#6b7280' }}>{emptyLabel}</p>
      </NoplinCard>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {safeMessages.map((message) => {
        const author = formatAuthor(message);
        const isSupportSide = message.authorType === 'agent' || message.authorType === 'admin' || message.visibility === 'internal';
        const bg = message.visibility === 'internal' ? '#faf5ff' : (isSupportSide ? '#eff6ff' : '#fff');
        const border = message.visibility === 'internal' ? '#ddd6fe' : (isSupportSide ? '#bfdbfe' : '#e5e7eb');

        return (
          <NoplinCard
            key={message.id}
            style={{
              padding: '1.25rem',
              border: `1px solid ${border}`,
              background: bg,
              marginLeft: isSupportSide ? '2rem' : 0,
              marginRight: isSupportSide ? 0 : '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#111', fontWeight: 800 }}>{author.label}</div>
                <div style={{ color: author.tagColor, fontSize: '0.82rem', fontWeight: 700 }}>{author.tag}</div>
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>{new Date(message.createdAt).toLocaleString()}</div>
            </div>
            <p style={{ margin: '0.85rem 0 0', lineHeight: 1.6, color: '#374151', whiteSpace: 'pre-wrap' }}>{message.body}</p>
          </NoplinCard>
        );
      })}
    </div>
  );
}
