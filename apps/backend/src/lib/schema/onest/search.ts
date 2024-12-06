import { DOMAIN, VERSION } from "./constants";

export const searchSchema = {
  $id: "searchSchema",
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          enum: DOMAIN,
        },
        action: {
          type: "string",
          const: "search",
        },
        version: {
          type: "string",
          const: VERSION,
        },
        bap_id: {
          type: "string",
        },
        bap_uri: {
          type: "string",
        },
        transaction_id: {
          type: "string",
        },
        message_id: {
          type: "string",
        },
        location: {
          type: "object",
          properties: {
            city: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                },
              },
              required: ["code"],
            },
            country: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                },
              },
              required: ["code"],
            },
          },
          required: ["city", "country"],
        },
        timestamp: {
          type: "string",
          format: "date-time",
        },
        ttl: {
          type: "string",
          const: "PT30S",
        },
      },
      required: [
        "domain",
        "location",
        "action",
        "version",
        "bap_id",
        "bap_uri",
        "transaction_id",
        "message_id",
        "timestamp",
        "ttl",
      ],
    },
    message: {
      type: "object",
      properties: {
        intent: {
          type: "object",
          properties: {
            payment: {
              type: "object",
              properties: {
                BUYER_FINDER_FEE_TYPE: {
                  type: "string",
                  enum: ["PERCENT", "AMOUNT"]
                },
                BUYER_FINDER_FEE_PERCENTAGE: {
                  type: "string",
                  pattern: "^\\d+$" // Only digits allowed
                },
                BUYER_FINDER_FEE_AMOUNT: {
                  type: "string",
                  pattern: "^\\d+(\\.\\d{1,2})?$" // Allows whole numbers or up to 2 decimal places
                }
              },
              required: ["BUYER_FINDER_FEE_TYPE"],
              allOf: [
                {
                  if: {
                    properties: {
                      BUYER_FINDER_FEE_TYPE: { const: "PERCENT" }
                    }
                  },
                  then: {
                    required: ["BUYER_FINDER_FEE_PERCENTAGE"],
                    not: { required: ["BUYER_FINDER_FEE_AMOUNT"] }
                  }
                },
                {
                  if: {
                    properties: {
                      BUYER_FINDER_FEE_TYPE: { const: "AMOUNT" }
                    }
                  },
                  then: {
                    required: ["BUYER_FINDER_FEE_AMOUNT"],
                    not: { required: ["BUYER_FINDER_FEE_PERCENTAGE"] }
                  }
                }
              ]
            },
            item: {
              type: "object",
              properties: {
                descriptor: {
                  type: "object",
                  properties: {
                    name: {},
                  },
                  required: ["name"],
                },
              },
              required: ["descriptor"],
            },
            tags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  descriptor: {
                    type: "object",
                    properties: {
                      code: { type: "string", enum: ["BAP_TERMS"] },
                    },
                    required: ["code"],
                  },
                  list: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              enum: [
                                "STATIC_TERMS",
                                "STATIC_TERMS_NEW",
                                "EFFECTIVE_DATE",
                              ],
                            },
                          },
                          required: ["code"],
                        },
                        value: { type: "string" },
                      },
                      required: ["descriptor", "value"],
                    },
                    minItems: 1,
                  },
                },
                required: ["descriptor", "list"],
              },
              minItems: 1,
            },
          },
          required: ["payment", "item"],
        },
      },
      required: ["intent"],
    },
  },
  required: ["context", "message"],
};
