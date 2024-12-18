import { Descriptor } from "./Descriptor";
import { Tag } from "./Tag";

export interface Category {
  id: string;
  descriptor: Descriptor;
  tags?: Tag[];
  parent_category_id?: string; // Optional because not all categories have a parent_category_id
}