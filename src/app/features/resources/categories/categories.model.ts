export interface Category {
  name: string;
  _id: string;
  children?: Category[];
}

export interface ExtendedCategory extends Category {
  disabled: boolean;
  _lvlClass: string;
  children?: ExtendedCategory[];
}

export interface ItemCategory {
  name: string;
  shortname?: string;
  parent?: ItemCategory;
}
