import { Item } from "../items/items.model";

/**
 * Variant id === item._id:color1._id[,color2._id]
 */
export type VariantId = string;

export interface UserContent {
  modified: number;
  closet: { id: VariantId, wantToSell?: boolean }[];
  wishlist: { id: VariantId }[];
  coordinations: Coordination[];
  user: string;
}

export interface CoordinationField {
  type: CoordinationFieldType;
  value: any;
}

export interface Coordination {
  id: string;
  title: string;
  event: string;
  place: string;
  theme?: string;
  date: string;
  fields: CoordinationField[];
  memo: string;
}

export enum CoordinationFieldType {
  HEADDRESS = 'headdress',
  HAIRSTYLE = 'hairstyle',
  MAIN_PIECE = 'main_piece',
  TOPWEAR = 'topwear',
  OUTERWEAR = 'outerwear',
  BAG = 'bag',
  ACCESSORIES = 'accessories',
  LEGWEAR = 'legwear',
  SHOES = 'shoes',
  UNDERWEAR = 'underwear',
  OTHERS = 'others'
}

export const coordinationTypeMap: { [key in CoordinationFieldType]?: string[] } = {};
coordinationTypeMap[CoordinationFieldType.HEADDRESS] = ['Headdress'];
coordinationTypeMap[CoordinationFieldType.HAIRSTYLE] = ['Wigs'];
coordinationTypeMap[CoordinationFieldType.MAIN_PIECE] = ['Dresses', 'Bottomwear'];
coordinationTypeMap[CoordinationFieldType.TOPWEAR] = ['Topwear'];
coordinationTypeMap[CoordinationFieldType.OUTERWEAR] = ['Outerwear'];
coordinationTypeMap[CoordinationFieldType.BAG] = ['Bags'];
coordinationTypeMap[CoordinationFieldType.ACCESSORIES] = ['Accessories'];
coordinationTypeMap[CoordinationFieldType.LEGWEAR] = ['Legwear'];
coordinationTypeMap[CoordinationFieldType.SHOES] = ['Shoes'];
coordinationTypeMap[CoordinationFieldType.UNDERWEAR] = ['Underwear'];
coordinationTypeMap[CoordinationFieldType.OTHERS] = ['Other'];

export interface UserContentEvent {
  type: 'add' | 'remove' | 'toggle-want-to-sell' | 'update-coordinations';
  content: UserContent;
  item?: Item;
  id?: string;
}
