type DebugRecord = {
  timestamp: number;
  method: string;
  url: string;
  request?: any;
  status?: number;
  response?: any;
  raw?: string;
};

let last: DebugRecord | null = null;
const listeners: Array<() => void> = [];

export function setLast(record: DebugRecord | null) {
  last = record;
  listeners.forEach((l) => l());
}

export function getLast(): DebugRecord | null {
  return last;
}

export function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export default { setLast, getLast, subscribe };
