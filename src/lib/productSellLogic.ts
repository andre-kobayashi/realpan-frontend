type SellMode = 'box' | 'unit';
type CustomerType = 'PJ' | 'PF';

type ProductSell = {
  allowed: SellMode[];
  box?: { availableFor: CustomerType[] };
  unit?: { availableFor: CustomerType[] };
};

export function getAvailableSellModes(
  product: { sell: ProductSell },
  customerType: CustomerType
): SellMode[] {
  return product.sell.allowed.filter((mode) =>
    product.sell[mode]?.availableFor.includes(customerType)
  );
}