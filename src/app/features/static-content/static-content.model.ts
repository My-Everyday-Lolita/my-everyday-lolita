export interface ContentList {
  ITEMS: string[];
}

export interface ContentDisclaimer {
  DISCLAIMER: string;
  CHILDREN: (string | ContentList)[];
}

export type Content = string | ContentDisclaimer | ContentList;
