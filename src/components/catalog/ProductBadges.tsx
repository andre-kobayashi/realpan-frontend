'use client';

type Props = {
  isNew?: boolean;
  discount?: number;
};

export function ProductBadges({ isNew, discount }: Props) {
  if (!isNew && !discount) return null;

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      {isNew && (
        <div className="bg-[#D85D3E] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-md">
          <span className="text-xs font-bold">New</span>
        </div>
      )}
      {discount && (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-dashed border-orange-400 px-3 py-1 rounded-full">
          <span className="text-orange-700 text-xs font-bold">
            {discount}% OFF
          </span>
        </div>
      )}
    </div>
  );
}
