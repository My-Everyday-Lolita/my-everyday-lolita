export interface Brand {
  id: string;
  name: string;
}

export enum Color {
  blue = 'blue',
  pink = 'pink',
}

export interface Photo {
  id: string;
  title: string;
}

export interface Variant {
  color: Color;
  photos: Photo[];
}

export interface Item {
  id: string;
  name: string;
  brand: Brand;
  type: string;
  variants: Variant[];
}
