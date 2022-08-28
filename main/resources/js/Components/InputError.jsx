import React from 'react';

export default function InputError({ messages = [], message, className = '' }) {
  if (message) { messages.push(message); }
  return messages?.length ? (
    <div>
      {messages.map((message) => <p key={message} className={`text-sm text-red-600 ${className}`}>{message}</p>)}
    </div>
  ) : null;
}
