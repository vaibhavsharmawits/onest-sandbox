import { SettlementDetails } from "./SettlementDetails";
import { Tag } from "./Tag";

export interface Payment {
  id: string;
  collected_by: string;
  params: Params;
  status: string;
  type: string;
  tags: Tag[];
  tl_method?:string;
  uri?:string;
  "@ondc/org/settlement_details"?: SettlementDetails[];
  "@ondc/org/settlement_basis"?:string;
  "@ondc/org/settlement_window"?:string;
  "@ondc/org/withholding_amount"?:string;

}

interface Params {
  amount: string;
  currency: string;
  transaction_id: string;
  bank_account_number: string;
  virtual_payment_address: string;
}