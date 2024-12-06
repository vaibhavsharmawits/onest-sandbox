import { Quantity } from "./Quantity";
import { Select } from "./Select";
import { Tag } from "./Tag";
import { TimeObject } from "./TimeObject";

export interface Item {
  id: string;
  location_ids: string[];
  fulfillment_ids: string[];
  quantity: Select|Quantity;
  add_ons?: AddOn[]; // Optional because not all items have add_ons
  parent_item_id?: string; // Optional because not all items have a parent_item_id
  category_ids?: string[]; // Optional because not all items have category_ids
  tags?: Tag[]; // Optional because not all items have tags
  descriptor?: ItemDescriptor;
  time?: TimeObject;
}

interface ItemDescriptor {
  name: string;
  code: string;
  short_desc: string;
  long_desc: string;
  images: Image[];
  media: Media[];
}

interface AddOn {
  id: string;
}

interface Image {
  url: string;
}

interface Media {
  mimetype: string;
  url: string;
}