const DOMAIN = ["ONDC:ONEST10", "ONDC:ONEST11", "ONDC:ONEST12", "ONDC:ONEST13"];
const VERSION = "2.0.0";
const FULFILLMENT_STATES = {
	on_update: ["OFFER_ACCEPTED", "OFFER_REJECTED", "OFFER_EXTENDED"],
	on_init: ["APPLICATION_IN_PROGRESS", "APPLICATION_FILLED"],
};
const PAYMENTS = {
	status: ["NOT-PAID", "PAID"],
	collected_by: ["BAP", "BPP"],
  order_status: ["ON-ORDER", "ON-FULFILLMENT"]
};
const JOBS_TYPE = ["lead", "recruitment", "lead & recruitment"];

export { DOMAIN, VERSION, FULFILLMENT_STATES, PAYMENTS, JOBS_TYPE };
