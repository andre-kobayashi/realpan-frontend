type Props = {
  title: string;
  count?: number;
};

export function CategoryHeader({ title, count }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-primary-900 tracking-tight">
        {title}
        {count !== undefined && (
          <span className="ml-3 text-base font-normal text-neutral-400">
            ({count})
          </span>
        )}
      </h1>
    </div>
  );
}
