import React, { useEffect, useState } from 'react';
import debugStore from '../lib/devDebugStore';

export default function DevDebugPanel() {
  const [last, setLast] = useState(debugStore.getLast());

  useEffect(() => {
    const unsub = debugStore.subscribe(() => setLast(debugStore.getLast()));
    return () => unsub();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  if (!last) return (
    <div style={{ position: 'fixed', right: 10, bottom: 10, zIndex: 9999 }}>
      <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs text-yellow-900">Dev Debug: no records yet</div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', right: 10, bottom: 10, zIndex: 9999, width: 380 }}>
      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded shadow text-xs text-yellow-900">
        <div className="font-semibold mb-1">Dev API Debug</div>
        <div className="text-[11px] mb-1">{new Date(last.timestamp).toLocaleTimeString()} • {last.method} • {last.url}</div>
        <div className="mb-2">
          <div className="font-medium">Request</div>
          <pre className="whitespace-pre-wrap bg-white p-2 rounded max-h-28 overflow-auto">{JSON.stringify(last.request || {}, null, 2)}</pre>
        </div>
        <div>
          <div className="font-medium">Response (truncated)</div>
          <pre className="whitespace-pre-wrap bg-white p-2 rounded max-h-28 overflow-auto">{String(last.raw || '').slice(0, 2000)}</pre>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => navigator.clipboard?.writeText(JSON.stringify(last.request || {}, null, 2))}
            className="bg-yellow-200 px-2 py-1 rounded text-xs"
          >Copy Req</button>
          <button
            onClick={() => navigator.clipboard?.writeText(String(last.raw || ''))}
            className="bg-yellow-200 px-2 py-1 rounded text-xs"
          >Copy Resp</button>
        </div>
      </div>
    </div>
  );
}
