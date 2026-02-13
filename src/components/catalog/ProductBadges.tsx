type Props = {
  storage?: 'ambient' | 'chilled' | 'frozen';
  sell?: { allowed?: string[] };
};

export function ProductBadges({ storage, sell }: Props) {
  const storageLabel: Record<string, string> = { ambient: '常温', chilled: '冷蔵', frozen: '冷凍' };
  const allowed = sell?.allowed ?? [];
  if (!storage && allowed.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {storage && (
        <span className="rounded border px-2 py-1 text-neutral-600">{storageLabel[storage]}</span>
      )}
    </div>
  );
}
