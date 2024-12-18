import { Measure } from "./Measure";
import { QuantityDetail } from "./QuantityDetails";

export type Quantity= {
  unitized: {measure:Measure};
  available: QuantityDetail;
  maximum: QuantityDetail;
  minimum: QuantityDetail;
}