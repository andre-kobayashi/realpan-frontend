import { useLocale } from 'next-intl';

type Props = {
  name: { pt: string; ja: string };
  description?: { pt: string; ja: string };
};

export function ProductMeta({ name, description }: Props) {
  const locale = useLocale() as 'pt' | 'ja';

  return (
    <div className="space-y-1">
      <h3 className="text-base font-medium text-neutral-900">
        {name[locale]}
      </h3>

      {description && (
        <p className="text-sm text-neutral-500 leading-relaxed">
          {description[locale]}
        </p>
      )}
    </div>
  );
}