import { Tag } from "./Tag";
import { Time } from "./Time";

export interface Stop {
  id?: string;
  authorization?: {
    type: string;
    token: string;
    valid_from: string;
    valid_to: string;
    status: string;
  };
  type: string;
  instructions?: {
    name: string;
    short_desc: string;
    long_desc?: string;
    additional_desc?: {
      url: string;
      content_type: string;
    };
  };
  location?: {
    id?: string;
    descriptor?: { name: string,images?:string[] };
    gps: string;
    address: string;
    city: {
      name: string;
    };
    country: {
      code: string;
    };
    area_code: string;
    state: {
      name: string;
    };
  };
  contact?: {
    phone?: string;
    email: string;
  };
  time?: Time;
  customer?: {
    person: {
      name: string;
    };
  };
  person: {
    name: string;
  };
  tags?: Tag;
}