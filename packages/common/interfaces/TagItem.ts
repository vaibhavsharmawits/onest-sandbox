import { Descriptor } from "./Descriptor";

export interface TagItem {
  descriptor: Descriptor;
  value: string; // Assuming value is always a string. Adjust the type if it can be different.
}