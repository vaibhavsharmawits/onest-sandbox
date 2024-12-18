
export interface SettlementDetails {
  settlement_counterparty: string;
  settlement_phase: string;
  beneficiary_name: string;
  settlement_reference?: string;
  settlement_status?: string;
  settlement_timestamp?: string;
  settlement_type?: string;
  upi_address?: string;
  settlement_bank_account_no?: string;
  settlement_ifsc_code?: string;
  bank_name?: string;
  branch_name?: string;
}