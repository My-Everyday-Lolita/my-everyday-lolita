export interface Category {
  name: string;
  _id: string;
  children?: Category[];
}
