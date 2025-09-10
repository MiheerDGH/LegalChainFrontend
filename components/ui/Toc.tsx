import Link from "next/link";
import { TocItem } from "@/lib/api";

export default function Toc({ items }:{ items:TocItem[] }) {
  return (
    <nav className="sticky top-6 max-h-[80vh] overflow-auto pr-4">
      <h4 className="text-sm font-semibold mb-2 text-slate-500">Table of Contents</h4>
      <ul className="space-y-1 text-sm">
        {items.map(i => (
          <li key={i.id} className={`pl-${i.level*2}`}>
            <Link href={`#${i.id}`} className="text-slate-700 hover:text-violet-700">{i.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
