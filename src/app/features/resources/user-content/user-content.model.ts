import { Item } from '../items/items.model';

/**
 * Variant id === item._id:color1._id[,color2._id]
 */
export type VariantId = string;

export interface UserContent {
  _id?: string;
  modified: number;
  closet: { id: VariantId, wantToSell?: boolean, _wrongVariantId?: boolean }[];
  wishlist: { id: VariantId, dreamDress?: boolean, _wrongVariantId?: boolean }[];
  coordinations: Coordination[];
  user?: string;
}

export interface CoordinationField {
  type: CoordinationFieldType;
  value: any;
  customText?: string;
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

export const coordinationTypeTranslateLabels: { [key in (CoordinationFieldType | any)]: string } = {};
coordinationTypeTranslateLabels[CoordinationFieldType.HEADDRESS] = 'COORDINATION.MODAL.TITLES.HEADDRESS';
coordinationTypeTranslateLabels[CoordinationFieldType.HAIRSTYLE] = 'COORDINATION.MODAL.TITLES.HAIRSTYLE';
coordinationTypeTranslateLabels[CoordinationFieldType.MAIN_PIECE] = 'COORDINATION.MODAL.TITLES.MAIN_PIECE';
coordinationTypeTranslateLabels[CoordinationFieldType.TOPWEAR] = 'COORDINATION.MODAL.TITLES.TOPWEAR';
coordinationTypeTranslateLabels[CoordinationFieldType.OUTERWEAR] = 'COORDINATION.MODAL.TITLES.OUTERWEAR';
coordinationTypeTranslateLabels[CoordinationFieldType.BAG] = 'COORDINATION.MODAL.TITLES.BAG';
coordinationTypeTranslateLabels[CoordinationFieldType.ACCESSORIES] = 'COORDINATION.MODAL.TITLES.ACCESSORIES';
coordinationTypeTranslateLabels[CoordinationFieldType.LEGWEAR] = 'COORDINATION.MODAL.TITLES.LEGWEAR';
coordinationTypeTranslateLabels[CoordinationFieldType.SHOES] = 'COORDINATION.MODAL.TITLES.SHOES';
coordinationTypeTranslateLabels[CoordinationFieldType.UNDERWEAR] = 'COORDINATION.MODAL.TITLES.UNDERWEAR';
coordinationTypeTranslateLabels[CoordinationFieldType.OTHERS] = 'COORDINATION.MODAL.TITLES.OTHERS';

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
  type: 'add' | 'remove' | 'update-coordinations' | 'silent';
  content: UserContent;
  item?: Item;
  id?: string;
}
