
/**
 * Variant id === item._id:color1._id[,color2._id]
 */
export type VariantId = string;

export interface UserContent {
  modified: number;
  closet: { id: VariantId, wantToSell?: boolean }[];
  wishlist: { id: VariantId, wantToSell?: boolean }[];
  coordinations: Coordination[];
  user: string;
}

export interface CoordinationField {
  type: string;
  value: { id: VariantId };
}

export interface Coordination {
  event: string;
  theme: string;
  date: string;
  fields: CoordinationField[];
}
