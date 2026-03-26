import React, { useMemo, useState } from 'react';
import { Button, TextAreaField, TextField } from 'noplin-uis';
import { CATEGORIES, PRIORITIES } from '../services/mockData';

function pillButtonStyle({ selected }) {
  return {
    padding: '10px 14px',
    fontSize: '0.88rem',
    borderRadius: '9999px',
    border: selected ? '1px solid #111' : '1px solid #eaeaea',
    background: selected ? '#111' : '#fff',
    color: selected ? '#fff' : '#111',
    transition: 'background 120ms ease, color 120ms ease',
  };
}

export function TicketForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
}) {
  const isCreate = mode === 'create';
  const isReply = mode === 'reply';

  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState(initialValues?.category || CATEGORIES[0]);
  const [priority, setPriority] = useState(initialValues?.priority || 'Medium');
  const [replyBody, setReplyBody] = useState(initialValues?.body || '');

  const canSubmit = useMemo(() => {
    if (isCreate) return title.trim().length > 0 && description.trim().length > 0;
    if (isReply) return replyBody.trim().length > 0;
    return false;
  }, [isCreate, isReply, title, description, replyBody]);

  return (
    <div style={{ width: '100%', maxWidth: 820, margin: '0 auto' }}>
      {isCreate && (
        <>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.55rem', color: '#333', fontWeight: 700 }}>
              Issue Title
            </label>
            <TextField
              placeholder="Briefly summarize the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.55rem', color: '#333', fontWeight: 700 }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {CATEGORIES.map((c) => (
                <Button key={c} onClick={() => setCategory(c)} style={pillButtonStyle({ selected: category === c })}>
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.55rem', color: '#333', fontWeight: 700 }}>
              Priority
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {PRIORITIES.map((p) => (
                <Button key={p} onClick={() => setPriority(p)} style={pillButtonStyle({ selected: priority === p })}>
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.55rem', color: '#333', fontWeight: 700 }}>
              Detailed Description
            </label>
            <TextAreaField
              placeholder="Provide as much detail as possible so we can investigate quickly..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              resize="vertical"
              style={{ minHeight: 170 }}
            />
          </div>
        </>
      )}

      {isReply && (
        <>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.55rem', color: '#333', fontWeight: 700 }}>
              Add a Reply
            </label>
            <TextAreaField
              placeholder="Type your message..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              resize="vertical"
              style={{ minHeight: 140 }}
            />
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {onCancel && (
          <Button
            onClick={() => onCancel()}
            style={{
              padding: '12px 20px',
              border: '1px solid #eaeaea',
              background: '#fff',
              color: '#111',
            }}
          >
            Cancel
          </Button>
        )}

        <Button
          onClick={() => {
            if (!canSubmit) return;
            if (isCreate) {
              onSubmit?.({
                title,
                description,
                category,
                priority,
              });
              return;
            }
            if (isReply) {
              onSubmit?.(replyBody);
              return;
            }
          }}
          disabled={!canSubmit}
          style={{
            padding: '12px 28px',
            background: canSubmit ? '#111' : '#e5e5e5',
            color: canSubmit ? '#fff' : '#777',
            border: '1px solid #111',
          }}
        >
          {isCreate ? 'Submit Ticket' : 'Send Reply'}
        </Button>
      </div>
    </div>
  );
}

