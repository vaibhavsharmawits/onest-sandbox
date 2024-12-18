import { Descriptor } from "./Descriptor";
import { TagItem } from "./TagItem";

export interface Tag {
  descriptor: Descriptor;
  list: TagItem[];
}