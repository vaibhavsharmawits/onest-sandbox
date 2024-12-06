import { Price } from "./Price";

export interface Breakup {
  "@ondc/org/item_id"?: string;
  "@ondc/org/item_quantity"?: {
    count: number;
  };
  title: string;
  "@ondc/org/title_type"?: string;
  price: Price;
  item?: {
    price: Price;
  };
}