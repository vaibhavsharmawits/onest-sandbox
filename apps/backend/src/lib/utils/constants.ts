export const HOUR24 = 24 * 60 * 60 * 1000;
const MOCK_API_BASE_URL = process.env?.MOCK_API_BASE_URL
	? process.env.MOCK_API_BASE_URL
	: "http://localhost:3000/";

export const REGISTRY_URL = "https://staging.registry.ondc.org/lookup";

export const STAGING_REGISTRY_URL = "https://staging.registry.ondc.org/lookup";

export const PREPOD_REGISTRY_URL =
	"https://preprod.registry.ondc.org/ondc/lookup";

export const SERVICES_EXAMPLES_PATH =
	"./domain-repos/@services/draft-services/api/components/Examples/Services_home_service_yaml";

export const AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH =
	"./domain-repos/@services/draft-agri_equipment/api/components/Examples/Agri_Equipment_Hiring_yaml";

export const ONEST_EXAMPLES_PATH =
	process.env.ENVIRONMENT === "staging"
		? "/app/apps/backend/domain-repos/@onest/draft-ONEST10-2.0.0/api/components/Examples/Services_Work_Opportunities_yaml"
		: "./domain-repos/@onest/draft-ONEST10-2.0.0/api/components/Examples/Services_Work_Opportunities_yaml";

export const MOCKSERVER_ID = "mock.ondc.org/api";

export const VERSION = {
	b2bexports: "b2b-exp",
	b2b: "b2b",
	b2c: "b2c",
};

export const SERVICES_BPP_MOCKSERVER_URL = `${MOCK_API_BASE_URL}services/bpp`;
export const SERVICES_BAP_MOCKSERVER_URL = `${MOCK_API_BASE_URL}services/bap`;

export const ONEST_BPP_MOCKSERVER_URL = `${MOCK_API_BASE_URL}onest/bpp`;
export const ONEST_BAP_MOCKSERVER_URL = `${MOCK_API_BASE_URL}onest/bap`;

export const initCustomer = {
	person: {
		name: "Sanjay",
		gender: "Male",
		age: "35",
		skills: [
			{
				name: "Android",
			},
			{
				name: "AWS",
			},
		],
		languages: [
			{
				name: "en",
			},
			{
				name: "ml",
			},
			{
				name: "hi",
			},
		],
		creds: [
			{
				id: "D1",
				descriptor: {
					name: "PAN_CARD",
					short_desc: "PAN Card information",
					long_desc: "Permanent Account Number",
				},
				url: "https://example.com/pan_card.jpeg",
				type: "jpeg",
			},
			{
				id: "D2",
				descriptor: {
					name: "AADHAAR_CARD",
					short_desc: "Aadhaar Card information",
					long_desc: "Unique Identification Number",
				},
				url: "https://example.com/aadhaar_card.jpeg",
				type: "pdf",
			},
			{
				id: "D3",
				descriptor: {
					name: "VOTER_ID",
					short_desc: "Voter ID information",
					long_desc: "Election Commission ID",
				},
				url: "https://example.com/voter_id.jpeg",
				type: "jpeg",
			},
			{
				id: "D4",
				descriptor: {
					name: "PASSPORT",
					short_desc: "Passport information",
					long_desc: "International Travel Document",
				},
				url: "https://example.com/passport.jpeg",
				type: "jpeg",
			},
			{
				id: "D5",
				descriptor: {
					name: "DRIVING_LICENSE",
					short_desc: "Driving License information",
					long_desc: "License to Drive",
				},
				url: "https://example.com/driving_license.jpeg",
				type: "jpeg",
			},
			{
				id: "D6",
				descriptor: {
					name: "RESUME",
					short_desc:
						"Summary of qualifications, work experience, and education.",
					long_desc:
						"A comprehensive document showcasing an individual's career achievements, skills, work history, education, certifications, and professional experience.",
				},
				url: "https://example.com/resume.pdf",
				type: "pdf",
			},
		],
		tags: [
			{
				descriptor: {
					code: "EMP_DETAILS",
				},
				list: [
					{
						descriptor: {
							code: "TOTAL_EXPERIENCE",
						},
						value: "P4Y",
					},
				],
			},
			{
				descriptor: {
					code: "DISABILITIES_AND_ACCOMMODATIONS",
				},
				list: [
					{
						descriptor: {
							code: "KNOWN_DISABILITIES",
						},
						value: "Visual Impairment",
					},
				],
			},
			{
				descriptor: {
					code: "ACADEMIC_QUALIFICATIONS",
				},
				list: [
					{
						descriptor: {
							code: "COURSE_NAME",
						},
						value: "Bachelor of Science in Computer Science",
					},
					{
						descriptor: {
							code: "COLLEGE_NAME",
						},
						value: "University of Technology",
					},
					{
						descriptor: {
							code: "YEAR_OF_COMPLETION",
						},
						value: "2020",
					},
				],
			},
			{
				descriptor: {
					code: "ONLINE_LEARNING_AND_SPECIALIZATIONS",
				},
				list: [
					{
						descriptor: {
							code: "CERTIFICATIONS",
						},
						value: "Certified Cloud Practitioner",
					},
				],
			},
			{
				descriptor: {
					code: "WORK_EXPERIENCE",
				},
				list: [
					{
						descriptor: {
							code: "TOTAL_EXPERIENCE",
						},
						value: "P3Y",
					},
				],
			},
			{
				descriptor: {
					code: "TECHNICAL_SKILLS",
				},
				list: [
					{
						descriptor: {
							code: "JOB_SPECIFIC_SKILLS",
						},
						value: "Full Stack Development",
					},
				],
			},
			{
				descriptor: {
					code: "SKILLS",
				},
				list: [
					{
						descriptor: {
							code: "COMMUNICATION",
						},
						value: "Excellent Verbal and Written Skills",
					},
					{
						descriptor: {
							code: "LEADERSHIP",
						},
						value: "Team Management and Decision Making",
					},
				],
			},
			{
				descriptor: {
					code: "DIGITAL_FOOTPRINT",
				},
				list: [
					{
						descriptor: {
							code: "LINKEDIN_PROFILE",
						},
						value: "https://linkedin.com/in/example-profile",
					},
					{
						descriptor: {
							code: "GITHUB_REPOSITORIES",
						},
						value: "https://github.com/example-profile",
					},
				],
			},
		],
	},
	contact: {
		phone: "+91-1234567890",
		email: "abc@abc.bc",
	},
};

export const initXinput = {
	form: {
		mime_type: "text/html",
		resubmit: false,
		url: "https://6vs8xnx5i7.jobhub.co.in/loans-kyc/xinput/formid/a23f2fdfbbb8ac402bfd54f-1",
	},
	head: {
		descriptor: {
			name: "Application Form",
		},
		headings: ["Candidate Details"],
		index: {
			cur: 1,
			max: 2,
			min: 1,
		},
	},
	required: true,
};

export const confirmItemTags = [
	{
		descriptor: {
			code: "ACADEMIC_QUALIFICATIONS",
		},
		list: [
			{
				descriptor: {
					code: "COURSE_NAME",
				},
				value: "Class-X",
			},
			{
				descriptor: {
					code: "MIN_PERCENTAGE",
				},
				value: "60",
			},
			{
				descriptor: {
					code: "MANDATORY_ELIGIBILITY",
				},
				value: "true",
			},
		],
	},
	{
		descriptor: {
			code: "ACADEMIC_QUALIFICATIONS",
		},
		list: [
			{
				descriptor: {
					code: "COURSE_NAME",
				},
				value: "Class-XII",
			},
			{
				descriptor: {
					code: "MIN_PERCENTAGE",
				},
				value: "60",
			},
			{
				descriptor: {
					code: "MANDATORY_ELIGIBILITY",
				},
				value: "true",
			},
		],
	},
	{
		descriptor: {
			code: "ACADEMIC_QUALIFICATIONS",
		},
		list: [
			{
				descriptor: {
					code: "COURSE_LEVEL",
				},
				value: "Under Graduate",
			},
			{
				descriptor: {
					code: "MIN_PERCENTAGE",
				},
				value: "60",
			},
			{
				descriptor: {
					code: "MANDATORY_ELIGIBILITY",
				},
				value: "true",
			},
		],
	},
	{
		descriptor: {
			code: "ACADEMIC_QUALIFICATIONS",
		},
		list: [
			{
				descriptor: {
					code: "COURSE_LEVEL",
				},
				value: "Graduate",
			},
			{
				descriptor: {
					code: "MANDATORY_ELIGIBILITY",
				},
				value: "false",
			},
		],
	},
	{
		descriptor: {
			code: "JOB_REQUIREMENTS",
		},
		list: [
			{
				descriptor: {
					code: "REQ_EXPERIENCE",
				},
				value: "P2Y6M",
			},
			{
				descriptor: {
					code: "ADD_PROF_SKILL",
				},
				value: "android-development",
			},
			{
				descriptor: {
					code: "ADD_PROF_SKILL",
				},
				value: "dev-ops",
			},
		],
	},
	{
		descriptor: {
			code: "JOB_RESPONSIBILITIES",
		},
		list: [
			{
				descriptor: {
					code: "RESPONSIBILITY",
				},
				value:
					"Build frontend experiences for our tools (Web, PWA and React Native)",
			},
			{
				descriptor: {
					code: "RESPONSIBILITY",
				},
				value:
					"Articulate a long term technical direction and vision for building, maintaining, and scaling our web and mobile platforms",
			},
			{
				descriptor: {
					code: "RESPONSIBILITY",
				},
				value:
					"Create trustworthy user experiences by building interfaces that are simple, easy to comprehend, performant and reliable using modern tools like React, React Native, Typescript, Node.js, Jest and Webpack.",
			},
			{
				descriptor: {
					code: "RESPONSIBILITY",
				},
				value:
					"Mentor and train other team members on design techniques and coding standards.",
			},
		],
	},
	{
		descriptor: {
			code: "JOB_DETAILS",
		},
		list: [
			{
				descriptor: {
					code: "CTC",
				},
				value: "2000000",
			},
			{
				descriptor: {
					code: "POST_START_LOCATION",
				},
				value: "Pune",
			},
			{
				descriptor: {
					code: "WORKING_LOCATION",
				},
				value: "Hybrid",
			},
			{
				descriptor: {
					code: "WORKING_TIME",
				},
				value: "Full-Time",
			},
		],
	},
];

export const onSelectFulfillments = [
	{
		id: "F3",
		type: "lead & recruitment",
		customer: {
			person: {
				name: "Sanjay",
				gender: "Male",
				age: "35",
				skills: [
					{
						name: "Android",
					},
					{
						name: "AWS",
					},
				],
				languages: [
					{
						name: "en",
					},
					{
						name: "ml",
					},
					{
						name: "hi",
					},
				],
				creds: [
					{
						id: "D1",
						descriptor: {
							name: "PAN_CARD",
							short_desc: "PAN Card information",
							long_desc: "Permanent Account Number",
						},
						url: "https://example.com/pan_card.jpeg",
						type: "jpeg",
					},
					{
						id: "D2",
						descriptor: {
							name: "AADHAAR_CARD",
							short_desc: "Aadhaar Card information",
							long_desc: "Unique Identification Number",
						},
						url: "https://example.com/aadhaar_card.jpeg",
						type: "pdf",
					},
					{
						id: "D3",
						descriptor: {
							name: "VOTER_ID",
							short_desc: "Voter ID information",
							long_desc: "Election Commission ID",
						},
						url: "https://example.com/voter_id.jpeg",
						type: "jpeg",
					},
					{
						id: "D4",
						descriptor: {
							name: "PASSPORT",
							short_desc: "Passport information",
							long_desc: "International Travel Document",
						},
						url: "https://example.com/passport.jpeg",
						type: "jpeg",
					},
					{
						id: "D5",
						descriptor: {
							name: "DRIVING_LICENSE",
							short_desc: "Driving License information",
							long_desc: "License to Drive",
						},
						url: "https://example.com/driving_license.jpeg",
						type: "jpeg",
					},
					{
						id: "D6",
						descriptor: {
							name: "RESUME",
							short_desc:
								"Summary of qualifications, work experience, and education.",
							long_desc:
								"A comprehensive document showcasing an individual's career achievements, skills, work history, education, certifications, and professional experience.",
						},
						url: "https://example.com/resume.pdf",
						type: "pdf",
					},
				],
				tags: [
					{
						descriptor: {
							code: "EMP_DETAILS",
						},
						list: [
							{
								descriptor: {
									code: "TOTAL_EXPERIENCE",
								},
								value: "P4Y",
							},
						],
					},
					{
						descriptor: {
							code: "DISABILITIES_AND_ACCOMMODATIONS",
						},
						list: [
							{
								descriptor: {
									code: "KNOWN_DISABILITIES",
								},
								value: "Visual Impairment",
							},
						],
					},
					{
						descriptor: {
							code: "ACADEMIC_QUALIFICATIONS",
						},
						list: [
							{
								descriptor: {
									code: "COURSE_NAME",
								},
								value: "Bachelor of Science in Computer Science",
							},
							{
								descriptor: {
									code: "COLLEGE_NAME",
								},
								value: "University of Technology",
							},
							{
								descriptor: {
									code: "YEAR_OF_COMPLETION",
								},
								value: "2020",
							},
						],
					},
					{
						descriptor: {
							code: "ONLINE_LEARNING_AND_SPECIALIZATIONS",
						},
						list: [
							{
								descriptor: {
									code: "CERTIFICATIONS",
								},
								value: "Certified Cloud Practitioner",
							},
						],
					},
					{
						descriptor: {
							code: "WORK_EXPERIENCE",
						},
						list: [
							{
								descriptor: {
									code: "TOTAL_EXPERIENCE",
								},
								value: "P3Y",
							},
						],
					},
					{
						descriptor: {
							code: "TECHNICAL_SKILLS",
						},
						list: [
							{
								descriptor: {
									code: "JOB_SPECIFIC_SKILLS",
								},
								value: "Full Stack Development",
							},
						],
					},
					{
						descriptor: {
							code: "SKILLS",
						},
						list: [
							{
								descriptor: {
									code: "COMMUNICATION",
								},
								value: "Excellent Verbal and Written Skills",
							},
							{
								descriptor: {
									code: "LEADERSHIP",
								},
								value: "Team Management and Decision Making",
							},
						],
					},
					{
						descriptor: {
							code: "DIGITAL_FOOTPRINT",
						},
						list: [
							{
								descriptor: {
									code: "LINKEDIN_PROFILE",
								},
								value: "https://linkedin.com/in/example-profile",
							},
							{
								descriptor: {
									code: "GITHUB_REPOSITORIES",
								},
								value: "https://github.com/example-profile",
							},
						],
					},
				],
			},
			contact: {
				phone: "+91-1234567890",
				email: "abc@abc.bc",
			},
		},
	},
];

export const onInitDistributorTags = [
	{
		descriptor: {
			code: "DISTRIBUTOR_DETAILS",
			name: "Distributor Details",
		},
		list: [
			{
				descriptor: {
					code: "DISTRIBUTOR_ID",
					name: "Distributor Id",
				},
				value: "PNB",
			},
			{
				descriptor: {
					code: "DISTRIBUTOR_NAME",
					name: "Distributor Name",
				},
				value: "Pay Near By",
			},
			{
				descriptor: {
					code: "DISTRIBUTOR_PHONE",
					name: "Distributor Phone",
				},
				value: "9123456789",
			},
			{
				descriptor: {
					code: "DISTRIBUTOR_EMAIL",
					name: "Distributor Email",
				},
				value: "support@pnb.com",
			},
			{
				descriptor: {
					code: "AGENT_ID",
					name: "Agent Id",
				},
				value: "agent-123",
			},
			{
				descriptor: {
					code: "AGENT_VERIFIED",
					name: "Agent Verified",
				},
				value: "true",
			},
		],
	},
];
