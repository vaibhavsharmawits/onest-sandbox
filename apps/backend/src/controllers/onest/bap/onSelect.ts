import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { responseBuilder } from "../../../lib/utils";

export const onSelectController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		return onSelectConsultationController(req, res, next);
	} catch (error) {
		return next(error);
	}
};

const onSelectConsultationController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			context,
			message: {
				order: { provider, items, quote },
			},
		} = req.body;

		delete provider?.descriptor

		const npFeesTag = quote?.breakup
			.filter((item: any) => item.title === "NP Fees")
			.map((npTag: any) => {
				const tags = npTag.tags;
				return tags.find((tag: any) => tag.descriptor.code === "NP_FEES");
			});
			console.log("in here")
			

		const responseMessage = {
			order: {
				provider: {
					...provider,
				},

				items: items,
				// fulfillments: [
				// 	{
				// 		id: "1",
				// 		customer: {
				// 			person: {
				// 				name: "Sanjay",
				// 				gender: "Male",
				// 				age: "35",
				// 				skills: [
				// 					{
				// 						code: "Android",
				// 						name: "Android",
				// 					},
				// 					{
				// 						code: "AWS",
				// 						name: "AWS",
				// 					},
				// 				],
				// 				languages: [
				// 					{
				// 						code: "en",
				// 						name: "english",
				// 					},
				// 					{
				// 						code: "ml",
				// 						name: "Malayalam",
				// 					},
				// 					{
				// 						code: "hi",
				// 						name: "Hindi",
				// 					},
				// 				],
				// 				tags: [
				// 					{
				// 						descriptor: {
				// 							code: "EMP_DETAILS",
				// 							name: "Employee Details",
				// 						},
				// 						list: [
				// 							{
				// 								descriptor: {
				// 									code: "EXPECTED_SALARY",
				// 								},
				// 								value: "1000000",
				// 							},
				// 							{
				// 								descriptor: {
				// 									code: "TOTAL_EXPERIENCE",
				// 									name: "Total Experience",
				// 								},
				// 								value: "P4Y",
				// 							},
				// 						],
				// 					},
				// 					{
				// 						descriptor: {
				// 							code: "documents",
				// 							name: "Documents",
				// 						},
				// 						list: [
				// 							{
				// 								descriptor: {
				// 									code: "DOC_TYPE",
				// 								},
				// 								value: "resume",
				// 							},
				// 							{
				// 								descriptor: {
				// 									code: "link",
				// 								},
				// 								value: "https://example.com/resume.pdf",
				// 							},
				// 							{
				// 								descriptor: {
				// 									code: "FILE_FORMAT",
				// 								},
				// 								value: "pdf",
				// 							},
				// 						],
				// 					},
				// 					...npFeesTag
				// 				],
				// 			},
				// 		},
				// 		contact: {
				// 			phone: "9999999999",
				// 			email: "abc@abc.bc",
				// 		},
				// 	},
				// ],
				"fulfillments": [
        {
          "id": "F3",
          "type": "lead & recruitment",
          "customer": {
            "person": {
              "name": "Sanjay",
              "gender": "Male",
              "age": "35",
              "skills": [
                {
                  "name": "Android"
                },
                {
                  "name": "AWS"
                }
              ],
              "languages": [
                {
                  "name": "en"
                },
                {
                  "name": "ml"
                },
                {
                  "name": "hi"
                }
              ],
              "creds": [
                {
                  "id": "D1",
                  "descriptor": {
                    "name": "PAN_CARD",
                    "short_desc": "PAN Card information",
                    "long_desc": "Permanent Account Number"
                  },
                  "url": "https://example.com/pan_card.jpeg",
                  "type": "jpeg"
                },
                {
                  "id": "D2",
                  "descriptor": {
                    "name": "AADHAAR_CARD",
                    "short_desc": "Aadhaar Card information",
                    "long_desc": "Unique Identification Number"
                  },
                  "url": "https://example.com/aadhaar_card.jpeg",
                  "type": "pdf"
                },
                {
                  "id": "D3",
                  "descriptor": {
                    "name": "VOTER_ID",
                    "short_desc": "Voter ID information",
                    "long_desc": "Election Commission ID"
                  },
                  "url": "https://example.com/voter_id.jpeg",
                  "type": "jpeg"
                },
                {
                  "id": "D4",
                  "descriptor": {
                    "name": "PASSPORT",
                    "short_desc": "Passport information",
                    "long_desc": "International Travel Document"
                  },
                  "url": "https://example.com/passport.jpeg",
                  "type": "jpeg"
                },
                {
                  "id": "D5",
                  "descriptor": {
                    "name": "DRIVING_LICENSE",
                    "short_desc": "Driving License information",
                    "long_desc": "License to Drive"
                  },
                  "url": "https://example.com/driving_license.jpeg",
                  "type": "jpeg"
                },
                {
                  "id": "D6",
                  "descriptor": {
                    "name": "RESUME",
                    "short_desc": "Summary of qualifications, work experience, and education.",
                    "long_desc": "A comprehensive document showcasing an individual's career achievements, skills, work history, education, certifications, and professional experience."
                  },
                  "url": "https://example.com/resume.pdf",
                  "type": "pdf"
                }
              ],
              "tags": [
                {
                  "descriptor": {
                    "code": "EMP_DETAILS"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "TOTAL_EXPERIENCE"
                      },
                      "value": "P4Y"
                    }
                  ]
                },
                {
                  "descriptor": {
                    "code": "DISABILITIES_AND_ACCOMMODATIONS"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "KNOWN_DISABILITIES"
                      },
                      "value": "Visual Impairment"
                    }
                  ]
                },
                {
                  "descriptor": {
                    "code": "ACADEMIC_QUALIFICATIONS"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "COURSE_NAME"
                      },
                      "value": "Bachelor of Science in Computer Science"
                    },
                    {
                      "descriptor": {
                        "code": "COLLEGE_NAME"
                      },
                      "value": "University of Technology"
                    },
                    {
                      "descriptor": {
                        "code": "YEAR_OF_COMPLETION"
                      },
                      "value": "2020"
                    }
                  ]
                },
                {
                  "descriptor": {
                    "code": "ONLINE_LEARNING_AND_SPECIALIZATIONS"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "CERTIFICATIONS"
                      },
                      "value": "Certified Cloud Practitioner"
                    }
                  ]
                },
                {
                  "descriptor": {
                    "code": "WORK_EXPERIENCE"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "TOTAL_EXPERIENCE"
                      },
                      "value": "P3Y"
                    }
                  ]
                },
                {
                  "descriptor": {
                    "code": "TECHNICAL_SKILLS"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "JOB_SPECIFIC_SKILLS"
                      },
                      "value": "Full Stack Development"
                    }
                  ]
                },
                {
                  "descriptor": {
                    "code": "SKILLS"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "COMMUNICATION"
                      },
                      "value": "Excellent Verbal and Written Skills"
                    },
                    {
                      "descriptor": {
                        "code": "LEADERSHIP"
                      },
                      "value": "Team Management and Decision Making"
                    }
                  ]
                },
                {
                  "descriptor": {
                    "code": "DIGITAL_FOOTPRINT"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "LINKEDIN_PROFILE"
                      },
                      "value": "https://linkedin.com/in/example-profile"
                    },
                    {
                      "descriptor": {
                        "code": "GITHUB_REPOSITORIES"
                      },
                      "value": "https://github.com/example-profile"
                    }
                  ]
                }
              ]
            },
            "contact": {
              "phone": "+91-1234567890",
              "email": "abc@abc.bc"
            }
          }
        }
      ],
				quote: quote,
			},
		};
		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bpp_uri}${
				req.body.context.bpp_uri.endsWith("/") ? "init" : "/init"
			}`,
			`init`,
			"onest"
		);
	} catch (error) {
		next(error);
	}
};
