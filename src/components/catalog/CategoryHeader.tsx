type Props = {
  title: string;
};

export function CategoryHeader({ title }: Props) {
  return (
    <div className="mb-10 border-b border-neutral-200 pb-4">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h1>
    </div>
  );
}