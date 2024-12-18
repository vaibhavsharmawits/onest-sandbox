import { Descriptor } from "./Descriptor";
import { Stop } from "./Stop";
import { Tag } from "./Tag";

export interface Fulfillment {
  id: string;
  state: {
    descriptor: Descriptor;
  };
  type: string;
  tracking: boolean;
  stops: Stop[];
  rateable?: boolean;
  tags: Tag[];
}