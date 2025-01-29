import { DOMAIN, JOBS_TYPE, VERSION } from "./constants";

export const onConfirmSchema = {
  $id: "onConfirmSchema",
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          enum: DOMAIN,
        },
        version: {
          type: "string",
          const: VERSION,
        },
        action: {
          type: "string",
          const: "on_confirm",
        },
        bap_id: {
          type: "string",
        },
        bap_uri: {
          type: "string",
        },
        bpp_id: {
          type: "string",
        },
        bpp_uri: {
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
            },
            country: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                },
              },
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
        },
      },
      required: [
        "domain",
        "version",
        "action",
        "bap_id",
        "bap_uri",
        "bpp_id",
        "bpp_uri",
        "transaction_id",
        "message_id",
        "location",
        "timestamp",
        "ttl",
      ],
    },
    message: {
      type: "object",
      properties: {
        order: {
          type: "object",
          properties: {
            status: {
              type: "string",
              const: "Created",
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
              required: ["id"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  fulfillment_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                            },
                            name: {
                              type: "string",
                            },
                          },
                          required: ["code"],
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                              },
                              value: {
                                type: "string",
                              },
                            },
                            required: ["code", "value"],
                          },
                        },
                      },
                      required: ["descriptor", "list"],
                    },
                  },
                },
                required: ["id", "fulfillment_ids"],
              },
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  state: {
                    type: "object",
                    properties: {
                      descriptor: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            enum: ["APPLICATION-SUBMITTED", "APPLICATION_ACCEPTED"], // Replace with valid codes
                          },
                        },
                        required: ["code"],
                      },
                      updated_at: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                    required: ["descriptor", "updated_at"],
                  },
                  id: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                    enum: JOBS_TYPE,
                  },
                  customer: {
                    type: "object",
                    properties: {
                      person: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                          gender: {
                            type: "string",
                          },
                          age: {
                            type: "string",
                          },
                          skills: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                code: {
                                  type: "string",
                                },
                                name: {
                                  type: "string",
                                },
                              },
                              required: ["code", "name"],
                            },
                          },
                          languages: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                code: {
                                  type: "string",
                                },
                                name: {
                                  type: "string",
                                },
                              },
                              required: ["code", "name"],
                            },
                          },
                          tags: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                descriptor: {
                                  type: "object",
                                  properties: {
                                    code: {
                                      type: "string",
                                    },
                                    name: {
                                      type: "string",
                                    },
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
                                          },
                                          name: {
                                            type: "string",
                                          },
                                        },
                                        required: ["code"],
                                      },
                                      value: {
                                        type: "string",
                                      },
                                    },
                                    required: ["descriptor", "value"],
                                  },
                                },
                              },
                              required: ["descriptor", "list"],
                            },
                          },
                        },
                        required: [
                          "name",
                          "gender",
                          "age",
                          "skills",
                          "languages",
                          "tags",
                        ],
                      },
                      contact: {
                        type: "object",
                        properties: {
                          phone: {
                            type: "string",
                          },
                          email: {
                            type: "string",
                          },
                        },
                        required: ["phone", "email"],
                      },
                    },
                    required: ["person", "contact"],
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                            },
                            name: {
                              type: "string",
                            },
                          },
                          required: ["code", "name"],
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
                                  },
                                  name: {
                                    type: "string",
                                  },
                                },
                                required: ["code", "name"],
                              },
                              value: {
                                type: "string",
                              },
                            },
                            required: ["descriptor", "value"],
                          },
                        },
                      },
                      required: ["descriptor", "list"],
                    },
                  },
                },
                required: ["id", "type", "customer", "tags", "state"],
              },
            },
            quote: {
              type: "object",
              properties: {
                price: {
                  type: "object",
                  properties: {
                    currency: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                  },
                  required: ["currency", "value"],
                },
                breakup: {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "item": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string"
                          },
                          "price": {
                            "type": "object",
                            "properties": {
                              "currency": {
                                "type": "string"
                              },
                              "value": {
                                "type": "string"
                              }
                            },
                            "required": ["currency", "value"]
                          },
                          "title": {
                            "type": "string"
                          }
                        },
                        "required": ["id", "price", "title"]
                      }
                    },
                    "required": ["item"]
                  }
                },
                ttl: {
                  type: "string",
                },
              },
              required: ["price", "breakup", "ttl"],
            },
            payments: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                },
                params: {
                  type: "object",
                  properties: {
                    currency: {
                      type: "string",
                    },
                    transaction_id: {
                      type: "string",
                    },
                    amount: {
                      type: "string",
                    },
                  },
                  required: ["currency", "transaction_id", "amount"],
                },
                status: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                collected_by: {
                  type: "string",
                },
                tags: {
                  type: "object",
                  properties: {
                    descriptor: {
                      type: "object",
                      properties: {
                        code: {
                          type: "string",
                        },
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
                              },
                            },
                            required: ["code"],
                          },
                          value: {
                            type: "string",
                          },
                        },
                        required: ["descriptor", "value"],
                      },
                    },
                  },
                  required: ["descriptor", "list"],
                },
              },
              required: [
                "url",
                "params",
                "status",
                "type",
                "collected_by",
                "tags",
              ],
            },
          },
          required: [
            "status",
            "provider",
            "items",
            "fulfillments",
            "quote",
            "payments",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
