export const onStatusSchema = {
	$id: "onStatusSchema",
	type: "object",
	properties: {
		context: {
			type: "object",
			properties: {
				domain: {
					type: "string",
				},
				action: {
					type: "string",
				},
				version: {
					type: "string",
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
				},
			},
			required: [
				"domain",
				"action",
				"version",
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
						id: { type: "string" },
						provider: {
							type: "object",
							properties: {
								id: {
									type: "string",
								},
								name: {
									type: "string",
								},
							},
							required: ["id", "name"],
						},
						items: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: {
										type: "string",
									},
									quantity: {
										type: "object",
										properties: {
											count: {
												type: "integer",
											},
										},
										required: ["count"],
									},
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
								},
								required: ["id", "quantity", "price"],
							},
						},
						billing: {
							type: "object",
							properties: {
								name: {
									type: "string",
								},
								address: {
									type: "string",
								},
								email: {
									type: "string",
									format: "email",
								},
								phone: {
									type: "string",
								},
							},
							required: ["name", "address", "email", "phone"],
						},
						fulfillments: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: {
										type: "string",
									},
									type: {
										type: "string",
									},
									state: {
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
										},
										required: ["descriptor"],
									},
								},
								required: ["id", "type", "state"],
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
									type: "array",
									items: {
										type: "object",
										properties: {
											title: {
												type: "string",
											},
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
										},
										required: ["title", "price"],
									},
								},
							},
							required: ["price", "breakup"],
						},
						payment: {
							type: "object",
							properties: {
								status: {
									type: "string",
								},
								uri: {
									type: "string",
									format: "uri",
								},
								settlement: {
									type: "array",
									items: {
										type: "object",
										properties: {
											settlement_type: {
												type: "string",
											},
											settlement_status: {
												type: "string",
											},
											amount: {
												type: "string",
											},
											beneficiary: {
												type: "object",
												properties: {
													name: {
														type: "string",
													},
													account: {
														type: "string",
													},
													ifsc: {
														type: "string",
													},
												},
												required: ["name", "account", "ifsc"],
											},
										},
										required: [
											"settlement_type",
											"settlement_status",
											"amount",
											"beneficiary",
										],
									},
								},
							},
							required: ["status", "uri", "settlement"],
						},
					},
					required: [
						"id",
						"provider",
						"items",
						"billing",
						"fulfillments",
						"quote",
						"payment",
					],
				},
			},
			required: ["order"],
		},
	},
	required: ["context", "message"],
};
