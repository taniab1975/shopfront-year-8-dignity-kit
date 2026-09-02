"use client";

import type { ClipboardEvent, DragEvent, FormEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Category = "Hygiene" | "Health" | "Comfort" | "Food" | "Connection";
type Status = "Directly assessed" | "Applied or practised" | "Context only";

type KitItem = {
  id: string;
  name: string;
  category: Category;
  price: number;
  defaultQty: number;
  purpose: string;
  evidenceCue: string;
};

type Notes = {
  need: string;
  science: string;
  dignity: string;
  pitch: string;
};

type Lens = {
  id: string;
  subject: string;
  token: string;
  prompt: string;
  explicitTeaching: string[];
  studentEvidence: string[];
  codes: string[];
};

type CurriculumRow = {
  subject: string;
  code: string;
  area: string;
  teach: string;
  trigger: string;
  evidence: string;
  status: Status;
};

type AssessmentCriterion = {
  token: string;
  subject: string;
  focus: string;
  secure: string;
  developing: string;
  emerging: string;
  missing: string;
};

type TemplateSection = "Group" | "Individual";

type TemplateField = {
  id: string;
  section: TemplateSection;
  label: string;
  guide: string;
  minWords: number;
};

type AuthenticMetrics = {
  blockedPastes: number;
  blockedDrops: number;
  rejectedBursts: number;
  keystrokes: number;
  startedAt: number | null;
  integrityConfirmed: boolean;
};

type ReportingLevel = "Excellent" | "Good" | "Satisfactory" | "Needs attention";

type ReportingAttribute = {
  id: string;
  title: string;
  shortName: string;
  description: string;
  descriptors: Record<ReportingLevel, string[]>;
};

type TeamTaskStatus = "Not started" | "In progress" | "Evidence ready" | "Complete";

type TeamTask = {
  id: string;
  label: string;
  evidence: string;
};

type DecisionCriterion = {
  id: string;
  label: string;
  prompt: string;
};

type TimelinePhase = {
  id: string;
  checkpoint: string;
  title: string;
  teacherMove: string;
  studentTool: string;
  artifact: string;
};

type DecisionEvidenceLevel = "Not yet" | "Needs checking" | "Some evidence" | "Strong evidence";
type EngagementSignal = "Not yet" | "Needs support" | "On track" | "Strong ownership";

const STORAGE_KEY = "shopfront-dignity-kit-builder-v1";
const BUDGET = 100;

const categories: Category[] = ["Hygiene", "Health", "Comfort", "Food", "Connection"];

const starterItems: KitItem[] = [
  {
    id: "tooth-care",
    name: "Toothbrush and toothpaste",
    category: "Hygiene",
    price: 4.8,
    defaultQty: 1,
    purpose: "Daily self-care and confidence.",
    evidenceCue: "Check unit price and product suitability.",
  },
  {
    id: "soap",
    name: "Soap or body wash",
    category: "Hygiene",
    price: 5.5,
    defaultQty: 1,
    purpose: "Basic washing and personal care.",
    evidenceCue: "Compare price, size and skin sensitivity.",
  },
  {
    id: "deodorant",
    name: "Deodorant",
    category: "Hygiene",
    price: 4.5,
    defaultQty: 1,
    purpose: "Privacy, comfort and daily dignity.",
    evidenceCue: "Compare size, cost and claims.",
  },
  {
    id: "period-care",
    name: "Period care pack",
    category: "Health",
    price: 8.9,
    defaultQty: 1,
    purpose: "Health need that should not be treated as optional.",
    evidenceCue: "Consider dignity, access and consumer need.",
  },
  {
    id: "socks",
    name: "Warm socks",
    category: "Comfort",
    price: 9.5,
    defaultQty: 1,
    purpose: "Warmth, comfort and foot care.",
    evidenceCue: "Test durability or compare fibres.",
  },
  {
    id: "washcloth",
    name: "Quick-dry washcloth",
    category: "Hygiene",
    price: 3.2,
    defaultQty: 1,
    purpose: "Reusable hygiene item with low storage burden.",
    evidenceCue: "Test absorbency or drying time.",
  },
  {
    id: "water-bottle",
    name: "Reusable water bottle",
    category: "Health",
    price: 7,
    defaultQty: 1,
    purpose: "Hydration and reusability.",
    evidenceCue: "Compare durability and leak resistance.",
  },
  {
    id: "sunscreen",
    name: "Travel sunscreen",
    category: "Health",
    price: 6.5,
    defaultQty: 1,
    purpose: "Protection during long periods outdoors.",
    evidenceCue: "Check SPF, size and consumer information.",
  },
  {
    id: "snack-bars",
    name: "Muesli or protein bars",
    category: "Food",
    price: 6.7,
    defaultQty: 1,
    purpose: "Portable food support.",
    evidenceCue: "Compare nutrition, quantity and shelf life.",
  },
  {
    id: "sanitiser",
    name: "Hand sanitiser",
    category: "Health",
    price: 3.5,
    defaultQty: 1,
    purpose: "Hygiene when facilities are limited.",
    evidenceCue: "Check claim, size and safety information.",
  },
  {
    id: "notebook",
    name: "Notebook and pen",
    category: "Connection",
    price: 4.2,
    defaultQty: 1,
    purpose: "Agency, appointments and communication.",
    evidenceCue: "Explain why dignity includes voice and agency.",
  },
  {
    id: "poncho",
    name: "Rain poncho",
    category: "Comfort",
    price: 5.8,
    defaultQty: 1,
    purpose: "Weather protection without bulky storage.",
    evidenceCue: "Compare durability, size and practical value.",
  },
  {
    id: "comb",
    name: "Comb",
    category: "Hygiene",
    price: 2.5,
    defaultQty: 1,
    purpose: "Simple personal care.",
    evidenceCue: "Explain value beyond price.",
  },
  {
    id: "shampoo",
    name: "Travel shampoo",
    category: "Hygiene",
    price: 5.3,
    defaultQty: 1,
    purpose: "Washing support with small carrying size.",
    evidenceCue: "Compare volume, unit price and suitability.",
  },
];

const lenses: Lens[] = [
  {
    id: "value",
    subject: "Mathematics",
    token: "VALUE",
    prompt: "Can students prove the $100 works?",
    explicitTeaching: [
      "Percentages of quantities and one quantity as a percentage of another.",
      "Positive decimal operations in money contexts.",
      "Estimation, rounding and reasonableness checks.",
      "Mathematical modelling with a real constraint.",
    ],
    studentEvidence: [
      "Accurate itemised budget.",
      "Category percentages.",
      "Scaling calculation for ten kits.",
      "Explanation of assumptions and constraints.",
    ],
    codes: ["MA-CN-001", "MA-CN-004", "MA-CN-005", "MA-MNA-001"],
  },
  {
    id: "choice",
    subject: "HASS Economics",
    token: "CHOICE",
    prompt: "What will students choose and give up?",
    explicitTeaching: [
      "Scarcity, allocation and opportunity cost.",
      "Consumers, producers, goods and services.",
      "Consumer and financial decision factors.",
      "Budgeting to achieve a short-term goal.",
    ],
    studentEvidence: [
      "Three-option decision matrix.",
      "Opportunity-cost explanation.",
      "Consumer decision justification.",
      "Cost-benefit recommendation.",
    ],
    codes: ["HS-EB-001", "HS-EB-006", "HS-EB-007", "HS-EV-001"],
  },
  {
    id: "evidence",
    subject: "Science Inquiry",
    token: "EVIDENCE",
    prompt: "How do students know a product claim is trustworthy?",
    explicitTeaching: [
      "Investigable questions and predictions.",
      "Independent, dependent and controlled variables.",
      "Reproducible methods, risk and ethical conduct.",
      "Tables, graphs, patterns, anomalies and conclusions.",
    ],
    studentEvidence: [
      "Product test question and prediction.",
      "Variables and method.",
      "Results table and graph.",
      "Evidence-based purchase recommendation.",
    ],
    codes: ["SC-QP-001", "SC-PC-001", "SC-PMA-001", "SC-PMA-002", "SC-EV-002"],
  },
  {
    id: "voice",
    subject: "English",
    token: "VOICE",
    prompt: "Can students persuade Shopfront with evidence?",
    explicitTeaching: [
      "Audience, purpose, claim and recommendation.",
      "Persuasive structure and paragraph cohesion.",
      "Evidence, examples and substantiation.",
      "Respectful language that preserves dignity.",
    ],
    studentEvidence: [
      "One-page written proposal.",
      "Evidence-based paragraphs.",
      "Respectful language choices.",
      "Optional two-minute pitch.",
    ],
    codes: ["EN-CT-001", "EN-TSO-002", "EN-LFI-001"],
  },
  {
    id: "dignity",
    subject: "Religion",
    token: "DIGNITY",
    prompt: "Is the decision worthy of the person receiving it?",
    explicitTeaching: [
      "People are made in the image and likeness of God.",
      "Human dignity is inherent.",
      "Catholic Social Teaching: Common Good and Stewardship.",
      "Religious inquiry using source purpose, viewpoints and evidence.",
    ],
    studentEvidence: [
      "Dignity rationale using Imago Dei.",
      "Stewardship or Common Good explanation.",
      "Sourced evidence about need.",
      "Ethical conclusion.",
    ],
    codes: ["Year 8 RE: Imago Dei", "Stewardship", "Common Good"],
  },
];

const curriculumRows: CurriculumRow[] = [
  {
    subject: "Mathematics",
    code: "MA-CN-001",
    area: "Calculating with number",
    teach: "Percentages of quantities and budget allocation.",
    trigger: "Work out what percentage of the $100 each kit category uses.",
    evidence: "Category percentages in the live budget.",
    status: "Directly assessed",
  },
  {
    subject: "Mathematics",
    code: "MA-CN-004",
    area: "Calculating with number",
    teach: "Money calculations using positive decimals.",
    trigger: "Calculate quantity times unit price for each item.",
    evidence: "Accurate item totals.",
    status: "Directly assessed",
  },
  {
    subject: "Mathematics",
    code: "MA-CN-005",
    area: "Calculating with number",
    teach: "Rounding, estimation and reasonableness.",
    trigger: "Check whether the final cost makes sense before recommending it.",
    evidence: "Reasonableness check in the proposal summary.",
    status: "Directly assessed",
  },
  {
    subject: "Mathematics",
    code: "MA-MNA-001",
    area: "Modelling",
    teach: "Represent real constraints mathematically.",
    trigger: "Build a complete kit under a fixed $100 constraint.",
    evidence: "Budget model, assumptions and interpreted result.",
    status: "Directly assessed",
  },
  {
    subject: "HASS Economics",
    code: "HS-EB-001",
    area: "Allocation of resources",
    teach: "Scarcity, resources, allocation and opportunity cost.",
    trigger: "The kit cannot include everything; students must prioritise.",
    evidence: "Allocation decision and opportunity-cost explanation.",
    status: "Directly assessed",
  },
  {
    subject: "HASS Economics",
    code: "HS-EB-006",
    area: "Consumer decisions",
    teach: "Price, quality, need, durability, access and value.",
    trigger: "Cheapest is not always the highest-value choice.",
    evidence: "Decision matrix and final consumer choice.",
    status: "Directly assessed",
  },
  {
    subject: "HASS Economics",
    code: "HS-EB-007",
    area: "Budgeting",
    teach: "Planning and budgeting to meet a short-term goal.",
    trigger: "Stay within $100 while meeting an identified need.",
    evidence: "Budget balance and spending plan.",
    status: "Directly assessed",
  },
  {
    subject: "HASS Economics",
    code: "HS-EV-001",
    area: "Evaluating",
    teach: "Generate alternatives, compare options, evaluate costs and benefits.",
    trigger: "Compare at least three possible kit strategies.",
    evidence: "Chosen strategy and justification.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    code: "SC-QP-001",
    area: "Questioning and predicting",
    teach: "Investigable questions and predictions.",
    trigger: "Two products make competing claims.",
    evidence: "Product test question and prediction.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    code: "SC-PC-001",
    area: "Planning and conducting",
    teach: "Variables, reproducibility, risk and ethical conduct.",
    trigger: "Design a fair product test before spending.",
    evidence: "Variables, method and risk notes.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    code: "SC-PMA-001",
    area: "Processing and analysing",
    teach: "Tables and graphs to organise data.",
    trigger: "Represent results for the product recommendation.",
    evidence: "Results table and graph.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    code: "SC-PMA-002",
    area: "Processing and analysing",
    teach: "Patterns, anomalies and evidence-based conclusions.",
    trigger: "Decide whether the data justifies the item.",
    evidence: "Conclusion linked to data.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    code: "SC-EV-002",
    area: "Evaluating",
    teach: "Construct evidence-based arguments to evaluate claims.",
    trigger: "Shopfront cannot rely on advertising claims alone.",
    evidence: "Scientific recommendation in the final proposal.",
    status: "Directly assessed",
  },
  {
    subject: "English",
    code: "EN-CT-001",
    area: "Creating texts",
    teach: "Plan, create, edit and publish for purpose and audience.",
    trigger: "Convince Shopfront that the kit is the best use of funds.",
    evidence: "One-page proposal.",
    status: "Directly assessed",
  },
  {
    subject: "English",
    code: "EN-TSO-002",
    area: "Cohesion",
    teach: "Use evidence, examples and substantiation of claims.",
    trigger: "Every recommendation must be backed by evidence.",
    evidence: "Substantiated proposal paragraphs.",
    status: "Directly assessed",
  },
  {
    subject: "English",
    code: "EN-LFI-001",
    area: "Language for interacting with others",
    teach: "How language shapes relationships, roles and dignity.",
    trigger: "Choose precise language such as people experiencing homelessness.",
    evidence: "Language choices in the proposal and dignity rationale.",
    status: "Directly assessed",
  },
  {
    subject: "Religion",
    code: "Year 8 RE",
    area: "Belief, Teaching, Texts",
    teach: "Imago Dei and inherent human worth.",
    trigger: "What makes this a dignity kit rather than a cheap kit?",
    evidence: "Dignity statement using the concept correctly.",
    status: "Directly assessed",
  },
  {
    subject: "Religion",
    code: "Year 8 RE",
    area: "People, Values, Society",
    teach: "Common Good and Stewardship.",
    trigger: "Use the $100 responsibly and ethically.",
    evidence: "Ethical explanation in final recommendation.",
    status: "Directly assessed",
  },
  {
    subject: "Religion",
    code: "Year 8 RE",
    area: "Religious Inquiry Skills",
    teach: "Source purpose, point of view, usefulness and conclusion.",
    trigger: "Use evidence about need and dignity to justify decisions.",
    evidence: "Sourced dignity rationale.",
    status: "Directly assessed",
  },
  {
    subject: "Science Understanding",
    code: "Not claimed",
    area: "Content descriptors",
    teach: "Add only if a Science teacher designs a content-specific link.",
    trigger: "Keep the pitch defensible.",
    evidence: "No automatic claim.",
    status: "Context only",
  },
  {
    subject: "History, Geography and Civics",
    code: "Not claimed",
    area: "Optional extension",
    teach: "Use as context only unless deliberately redesigned.",
    trigger: "Avoid forced curriculum claims.",
    evidence: "No formal assessment claim.",
    status: "Context only",
  },
];

const strategies = [
  {
    id: "balanced",
    name: "Balanced dignity kit",
    cost: 89.9,
    benefit: "Covers hygiene, health, food, comfort and agency without exhausting the whole budget.",
    tradeoff: "Does not maximise any single category.",
  },
  {
    id: "hygiene-first",
    name: "Hygiene-first kit",
    cost: 82.4,
    benefit: "Prioritises personal care, privacy and repeat-use hygiene products.",
    tradeoff: "Less money remains for food or weather protection.",
  },
  {
    id: "comfort-ready",
    name: "Comfort-ready kit",
    cost: 97.6,
    benefit: "Adds warmth, weather protection and more durable items.",
    tradeoff: "Leaves little flexibility for individual needs.",
  },
];

const checklist = [
  {
    id: "budget",
    label: "Budget table includes quantity, unit price, total and category percentages.",
  },
  {
    id: "decision",
    label: "Students compare at least three kit options before recommending one.",
  },
  {
    id: "science",
    label: "One product claim is tested with variables, data, graph and conclusion.",
  },
  {
    id: "dignity",
    label: "Dignity rationale uses Imago Dei plus Common Good or Stewardship.",
  },
  {
    id: "proposal",
    label: "Final proposal uses persuasive structure, evidence and respectful language.",
  },
];

const assessmentDeliverables = [
  "Itemised kit and $100 budget with quantity, unit price, item total, remaining balance and category percentages.",
  "Decision matrix comparing at least three kit options, including benefit, cost and opportunity cost.",
  "Product test with question, prediction, variables, method, risk, results table, graph and conclusion.",
  "Approximately 200-word dignity statement using Imago Dei plus Common Good or Stewardship.",
  "Final one-page Shopfront proposal or short pitch that recommends a kit and justifies it with evidence.",
];

const assessmentCriteria: AssessmentCriterion[] = [
  {
    token: "VALUE",
    subject: "Mathematics",
    focus: "Accuracy of budget calculations and mathematical modelling.",
    secure: "All money, percentage, estimation and constraint calculations are accurate and clearly interpreted.",
    developing: "Most calculations are correct, with minor errors or limited explanation of assumptions.",
    emerging: "Some calculations are attempted, but errors weaken the budget recommendation.",
    missing: "Budget evidence is missing, inaccurate or not connected to the $100 constraint.",
  },
  {
    token: "CHOICE",
    subject: "HASS Economics",
    focus: "Consumer choice, scarcity, budgeting and opportunity cost.",
    secure: "Compares realistic options and explains trade-offs, opportunity cost and value for the recipient.",
    developing: "Compares options with some explanation of cost, benefit or trade-off.",
    emerging: "Lists choices but gives limited economic reasoning.",
    missing: "No clear comparison or economic justification is provided.",
  },
  {
    token: "EVIDENCE",
    subject: "Science Inquiry",
    focus: "Testing a product claim before recommending an item.",
    secure: "Investigation is fair, reproducible and uses data to justify a purchase recommendation.",
    developing: "Investigation has a useful question and data, but controls, risk or conclusion need strengthening.",
    emerging: "Investigation is attempted but the evidence is incomplete or weakly linked to the decision.",
    missing: "No product test or evidence-based scientific recommendation is provided.",
  },
  {
    token: "VOICE",
    subject: "English",
    focus: "Persuasive proposal for a real Shopfront audience.",
    secure: "Proposal is well structured, respectful, audience-aware and substantiates claims with evidence.",
    developing: "Proposal is clear and mostly persuasive, with some evidence or cohesion still uneven.",
    emerging: "Proposal communicates an idea but lacks structure, audience control or evidence.",
    missing: "No coherent proposal or persuasive justification is provided.",
  },
  {
    token: "DIGNITY",
    subject: "Religion",
    focus: "Human dignity, Imago Dei, Common Good and Stewardship.",
    secure: "Explains how the kit honours inherent dignity and uses Catholic concepts accurately.",
    developing: "Connects the kit to dignity and Catholic concepts, but explanation is general.",
    emerging: "Mentions dignity or faith concepts without clear application to the kit decision.",
    missing: "No meaningful dignity or Religious Education connection is provided.",
  },
];

const clueLevels = [
  {
    name: "Clue 1",
    purpose: "Metacognitive prompt",
    example: "What evidence would convince Shopfront that this item belongs in the kit?",
  },
  {
    name: "Clue 2",
    purpose: "Curriculum memory",
    example: "Which lens is this: VALUE, CHOICE, EVIDENCE, VOICE or DIGNITY?",
  },
  {
    name: "Clue 3",
    purpose: "Scaffold",
    example: "Use this sentence starter, calculation template or decision-matrix row.",
  },
];

const templateFields: TemplateField[] = [
  {
    id: "group-team",
    section: "Group",
    label: "Team members and roles",
    guide: "Name each student and the role they actually took: budget lead, evidence lead, dignity lead, proposal lead or another clear role.",
    minWords: 20,
  },
  {
    id: "group-need",
    section: "Group",
    label: "Need and design priorities",
    guide: "Describe the person or situation your kit is designed for, then name the three needs your team chose to prioritise.",
    minWords: 45,
  },
  {
    id: "group-budget",
    section: "Group",
    label: "Budget evidence",
    guide: "Explain your total cost, remaining balance, one category percentage and one reasonableness check that proves the numbers work.",
    minWords: 55,
  },
  {
    id: "group-choice",
    section: "Group",
    label: "Decision matrix summary",
    guide: "Compare three possible kit options. Include one benefit, one cost and one opportunity cost for each option before naming your chosen kit.",
    minWords: 70,
  },
  {
    id: "group-science",
    section: "Group",
    label: "Product test record",
    guide: "Record the product claim you tested, your question, prediction, variables, method, results pattern and evidence-based conclusion.",
    minWords: 80,
  },
  {
    id: "group-proposal",
    section: "Group",
    label: "Final Shopfront recommendation",
    guide: "Write the group's final recommendation to Shopfront. It must use evidence from the budget, choices, product test and dignity rationale.",
    minWords: 95,
  },
  {
    id: "individual-name",
    section: "Individual",
    label: "Student name and personal role",
    guide: "Write your name and explain what you personally contributed to the group work. Name at least one specific task you completed.",
    minWords: 35,
  },
  {
    id: "individual-evidence",
    section: "Individual",
    label: "Evidence I can defend",
    guide: "Choose one piece of evidence from your project and explain why it is trustworthy enough to use in the final recommendation.",
    minWords: 60,
  },
  {
    id: "individual-tradeoff",
    section: "Individual",
    label: "Choice and trade-off reflection",
    guide: "Explain one item or option you supported, rejected or changed your mind about. Use opportunity cost or value in your explanation.",
    minWords: 60,
  },
  {
    id: "individual-dignity",
    section: "Individual",
    label: "Human dignity reflection",
    guide: "Explain how the final kit honours human dignity. Use Imago Dei and either Common Good or Stewardship accurately.",
    minWords: 75,
  },
  {
    id: "individual-learning",
    section: "Individual",
    label: "What changed in my thinking",
    guide: "Describe what you understand differently now about budgeting, homelessness, evidence, persuasion or dignity.",
    minWords: 45,
  },
];

const reportingLevels: ReportingLevel[] = ["Excellent", "Good", "Satisfactory", "Needs attention"];

const reportingAttributes: ReportingAttribute[] = [
  {
    id: "collaboration",
    title: "Collaboration",
    shortName: "Works with others",
    description: "How the student shares responsibility, supports peers and helps the team complete the task.",
    descriptors: {
      Excellent: [
        "Consistently works positively and effectively with others.",
        "Actively supports and encourages peers.",
        "Shares responsibilities fairly and takes initiative.",
        "Communicates clearly and respectfully.",
      ],
      Good: [
        "Works well with others most of the time.",
        "Contributes to group tasks and shares responsibilities.",
        "Communicates appropriately with peers.",
        "Supports a positive team environment.",
      ],
      Satisfactory: [
        "Participates in group work when prompted.",
        "Shares tasks but may rely on others at times.",
        "Communicates adequately with peers.",
        "Shows some awareness of teamwork expectations.",
      ],
      "Needs attention": [
        "Struggles to work cooperatively with others.",
        "Rarely contributes to group tasks.",
        "Communication may be unclear or disrespectful.",
        "Does not yet support a positive group environment.",
      ],
    },
  },
  {
    id: "engagement",
    title: "Engagement",
    shortName: "Stays focused",
    description: "How the student uses time, stays on task, seeks help and keeps moving toward the goal.",
    descriptors: {
      Excellent: [
        "Consistently focused and on task.",
        "Completes all work to a high standard.",
        "Uses time effectively and independently.",
        "Actively seeks help and sets learning goals.",
      ],
      Good: [
        "Usually stays on task and completes work.",
        "Uses time well with minimal reminders.",
        "Attempts tasks to a good standard.",
        "Seeks help when needed.",
      ],
      Satisfactory: [
        "Sometimes on task but needs reminders.",
        "Completes some work to an acceptable standard.",
        "Uses time inconsistently.",
        "Occasionally seeks help.",
      ],
      "Needs attention": [
        "Frequently off task or disengaged.",
        "Produces incomplete or minimal work.",
        "Uses class time poorly.",
        "Rarely seeks help or shows initiative.",
      ],
    },
  },
  {
    id: "flexibility",
    title: "Flexibility",
    shortName: "Adapts and persists",
    description: "How the student responds to feedback, challenge, new ideas and changes to the plan.",
    descriptors: {
      Excellent: [
        "Embraces new ideas and challenges confidently.",
        "Responds positively to feedback and change.",
        "Shows strong perseverance in difficult tasks.",
        "Demonstrates resilience and a growth mindset.",
      ],
      Good: [
        "Accepts feedback and tries to improve.",
        "Responds positively to most challenges.",
        "Persists with some support.",
        "Adjusts to change with a positive attitude.",
      ],
      Satisfactory: [
        "Sometimes accepts feedback.",
        "Attempts challenges but may give up easily.",
        "Needs encouragement to persist.",
        "Adjusts to change with support.",
      ],
      "Needs attention": [
        "Resists feedback or change.",
        "Avoids challenges.",
        "Gives up easily when work is difficult.",
        "Struggles to adapt to new situations.",
      ],
    },
  },
  {
    id: "critical-thinking",
    title: "Critical Thinking",
    shortName: "Questions and analyses",
    description: "How the student asks questions, connects ideas, uses evidence and reflects on decisions.",
    descriptors: {
      Excellent: [
        "Asks insightful and thoughtful questions.",
        "Makes strong connections in learning.",
        "Applies knowledge creatively to solve problems.",
        "Reflects deeply to improve understanding.",
      ],
      Good: [
        "Asks relevant questions.",
        "Makes connections with some support.",
        "Applies learning to solve problems.",
        "Reflects on learning when prompted.",
      ],
      Satisfactory: [
        "Occasionally asks questions.",
        "Makes simple connections.",
        "Attempts problem-solving with guidance.",
        "Gives limited reflection on learning.",
      ],
      "Needs attention": [
        "Rarely asks questions or engages deeply.",
        "Struggles to make connections.",
        "Has difficulty applying knowledge.",
        "Does not yet reflect on learning.",
      ],
    },
  },
  {
    id: "respect-responsibility",
    title: "Respect & Responsibility",
    shortName: "Acts with integrity",
    description: "How the student shows respect, reliability, honesty and responsibility for their actions.",
    descriptors: {
      Excellent: [
        "Consistently respectful, kind and fair.",
        "Takes full responsibility for actions.",
        "Follows rules and expectations.",
        "Acts with honesty and integrity.",
      ],
      Good: [
        "Usually respectful and considerate.",
        "Accepts responsibility for actions.",
        "Follows rules most of the time.",
        "Demonstrates honesty and reliability.",
      ],
      Satisfactory: [
        "Generally respectful but inconsistent.",
        "Sometimes takes responsibility.",
        "Follows rules with reminders.",
        "Shows a developing sense of responsibility.",
      ],
      "Needs attention": [
        "Displays disrespectful behaviour.",
        "Avoids responsibility for actions.",
        "Does not follow rules or expectations.",
        "Lacks honesty or reliability.",
      ],
    },
  },
];

const teamTasks: TeamTask[] = [
  {
    id: "budget",
    label: "Budget and item sourcing",
    evidence: "Itemised costs, category percentages and reasonableness check.",
  },
  {
    id: "decision",
    label: "Decision matrix",
    evidence: "Three options, criteria evidence, trade-offs and final recommendation.",
  },
  {
    id: "science",
    label: "Product test",
    evidence: "Question, variables, method, results, graph and conclusion.",
  },
  {
    id: "dignity",
    label: "Dignity rationale",
    evidence: "Imago Dei, Common Good or Stewardship linked to the kit.",
  },
  {
    id: "pitch",
    label: "Proposal and presentation",
    evidence: "Persuasive proposal, respectful language and final Shopfront pitch.",
  },
];

const taskStatusOptions: TeamTaskStatus[] = ["Not started", "In progress", "Evidence ready", "Complete"];

const decisionCriteria: DecisionCriterion[] = [
  { id: "need", label: "Need", prompt: "How well does this meet a real recipient need?" },
  { id: "dignity", label: "Dignity", prompt: "How strongly does this protect human dignity?" },
  { id: "evidence", label: "Evidence", prompt: "How strong is the product or research evidence?" },
  { id: "cost", label: "Value", prompt: "How well does this use the $100 budget?" },
  { id: "feasible", label: "Feasible", prompt: "How realistic is this for Shopfront to source and use?" },
];

const decisionEvidenceLevels: DecisionEvidenceLevel[] = ["Not yet", "Needs checking", "Some evidence", "Strong evidence"];

const engagementSignals: EngagementSignal[] = ["Not yet", "Needs support", "On track", "Strong ownership"];

const engagementTrackers = [
  {
    id: "group-focus",
    label: "Group focus",
    prompt: "What shows the group was focused, distracted, or able to reset today?",
  },
  {
    id: "group-progress",
    label: "Group progress",
    prompt: "What moved forward, what stalled, and what evidence proves it?",
  },
  {
    id: "student-effort",
    label: "My contribution",
    prompt: "What did I personally do that helped the project move?",
  },
  {
    id: "student-help",
    label: "Help-seeking",
    prompt: "What help did I ask for, offer, or need to use better next time?",
  },
];

const projectTimeline: TimelinePhase[] = [
  {
    id: "launch",
    checkpoint: "Start when your team is ready to begin",
    title: "Team charter and first target",
    teacherMove: "Guide teams to name how they will collaborate, then let them choose a realistic first target.",
    studentTool: "Group list, shared target, team norms and task allocation.",
    artifact: "Team charter and first action list.",
  },
  {
    id: "research",
    checkpoint: "Use before locking in favourites",
    title: "Needs research and item sourcing",
    teacherMove: "Prompt students to check dignity, health, comfort, feasibility and budget before they commit.",
    studentTool: "Item research, need statement and evidence notes.",
    artifact: "Sourced item list with reasons.",
  },
  {
    id: "decide",
    checkpoint: "Use when good options compete",
    title: "Decision meeting and opportunity cost",
    teacherMove: "Pause teams for a decision meeting so choices are argued with criteria and evidence.",
    studentTool: "Critical-thinking record, qualitative evidence judgements and trade-off notes.",
    artifact: "Recommendation draft with reasons.",
  },
  {
    id: "test",
    checkpoint: "Use before final evidence claims",
    title: "Product test and evidence check",
    teacherMove: "Require a fair-test plan before practical work, then a data-based conclusion before spending is finalised.",
    studentTool: "Science question, variables, method, results pattern and conclusion.",
    artifact: "Product test record and graph.",
  },
  {
    id: "draft",
    checkpoint: "Use when the recommendation is forming",
    title: "Dignity rationale and proposal draft",
    teacherMove: "Conference with teams on respectful language, Imago Dei, Common Good or Stewardship, and evidence quality.",
    studentTool: "Dignity paragraph, persuasive claim and proposal outline.",
    artifact: "Draft proposal with teacher feedback.",
  },
  {
    id: "pitch",
    checkpoint: "Use before handing in",
    title: "Pitch, reflection and portfolio",
    teacherMove: "Collect final proposals, individual accountability reflections and reporting-attribute evidence.",
    studentTool: "Final pitch, individual reflection, engagement tracker and capability brag-book entries.",
    artifact: "Final proposal and capability portfolio.",
  },
];

const checkInPrompts = [
  {
    id: "standup-1",
    title: "Start check-in",
    prompt: "What is our goal for this work session, who owns each task, and what will be finished by the end?",
  },
  {
    id: "standup-2",
    title: "Progress check-in",
    prompt: "Who has done what they said, who is stuck, and what evidence do we have so far?",
  },
  {
    id: "standup-3",
    title: "Adjust-the-plan check-in",
    prompt: "What changed, what decision do we need to make now, and how will we adjust roles or timing?",
  },
];

const criticalThinkingPrompts = [
  {
    id: "know",
    label: "What do we know?",
    prompt: "Facts, prices, test results, observations or source evidence we can point to.",
  },
  {
    id: "missing",
    label: "What is missing?",
    prompt: "Information we still need before we can make a responsible recommendation.",
  },
  {
    id: "tradeoff",
    label: "What trade-off matters most?",
    prompt: "The opportunity cost or dignity/value tension that affects our decision.",
  },
  {
    id: "changed",
    label: "What changed our thinking?",
    prompt: "Evidence, feedback or a failed assumption that made us revise the plan.",
  },
];

const defaultQuantities = starterItems.reduce<Record<string, number>>((acc, item) => {
  acc[item.id] = item.defaultQty;
  return acc;
}, {});

const defaultNotes: Notes = {
  need: "A one-person kit that protects hygiene, comfort, health and agency while staying realistic for Shopfront to source.",
  science:
    "Does a quick-dry washcloth absorb enough water and dry faster than a cheaper cloth to justify its place in the kit?",
  dignity:
    "The kit should recognise the person as more than a need to be solved. It should protect privacy, health, agency and comfort.",
  pitch:
    "Shopfront should adopt this kit because it uses a small budget carefully while still treating the recipient as a person with inherent dignity.",
};

const defaultAuthenticMetrics: AuthenticMetrics = {
  blockedPastes: 0,
  blockedDrops: 0,
  rejectedBursts: 0,
  keystrokes: 0,
  startedAt: null,
  integrityConfirmed: false,
};

const defaultAttributeLevels = reportingAttributes.reduce<Record<string, ReportingLevel>>((acc, attribute) => {
  acc[attribute.id] = "Good";
  return acc;
}, {});

const defaultTaskOwners = teamTasks.reduce<Record<string, string>>((acc, task) => {
  acc[task.id] = "";
  return acc;
}, {});

const defaultTaskStatuses = teamTasks.reduce<Record<string, TeamTaskStatus>>((acc, task) => {
  acc[task.id] = "Not started";
  return acc;
}, {});

const defaultDecisionOptions = {
  "option-a": "Balanced dignity kit",
  "option-b": "Hygiene-first kit",
  "option-c": "Comfort-ready kit",
};

const decisionOptionIds = Object.keys(defaultDecisionOptions);

const defaultDecisionEvidence = decisionOptionIds.reduce<Record<string, DecisionEvidenceLevel>>((acc, optionId) => {
  decisionCriteria.forEach((criterion) => {
    acc[`${optionId}-${criterion.id}`] = "Not yet";
  });
  return acc;
}, {});

const defaultEngagementSignals = engagementTrackers.reduce<Record<string, EngagementSignal>>((acc, tracker) => {
  acc[tracker.id] = "Not yet";
  return acc;
}, {});

export default function Home() {
  const [quantities, setQuantities] = useState<Record<string, number>>(defaultQuantities);
  const [customItems, setCustomItems] = useState<KitItem[]>([]);
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState<Category>("Hygiene");
  const [customPrice, setCustomPrice] = useState("");
  const [activeLensId, setActiveLensId] = useState("value");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("Directly assessed");
  const [selectedStrategyId, setSelectedStrategyId] = useState("balanced");
  const [notes, setNotes] = useState<Notes>(defaultNotes);
  const [checkedEvidence, setCheckedEvidence] = useState<Record<string, boolean>>({});
  const [templateResponses, setTemplateResponses] = useState<Record<string, string>>({});
  const [authenticMetrics, setAuthenticMetrics] = useState<AuthenticMetrics>(defaultAuthenticMetrics);
  const [trackerResponses, setTrackerResponses] = useState<Record<string, string>>({});
  const [attributeLevels, setAttributeLevels] = useState<Record<string, ReportingLevel>>(defaultAttributeLevels);
  const [descriptorChecks, setDescriptorChecks] = useState<Record<string, boolean>>({});
  const [taskOwners, setTaskOwners] = useState<Record<string, string>>(defaultTaskOwners);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TeamTaskStatus>>(defaultTaskStatuses);
  const [decisionOptions, setDecisionOptions] = useState<Record<string, string>>(defaultDecisionOptions);
  const [decisionEvidence, setDecisionEvidence] =
    useState<Record<string, DecisionEvidenceLevel>>(defaultDecisionEvidence);
  const [engagementSignalsState, setEngagementSignalsState] =
    useState<Record<string, EngagementSignal>>(defaultEngagementSignals);
  const [timelineChecks, setTimelineChecks] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const storageReady = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          quantities?: Record<string, number>;
          customItems?: KitItem[];
          selectedStrategyId?: string;
          activeLensId?: string;
          notes?: Notes;
          checkedEvidence?: Record<string, boolean>;
          templateResponses?: Record<string, string>;
          authenticMetrics?: AuthenticMetrics;
          trackerResponses?: Record<string, string>;
          attributeLevels?: Record<string, ReportingLevel>;
          descriptorChecks?: Record<string, boolean>;
          taskOwners?: Record<string, string>;
          taskStatuses?: Record<string, TeamTaskStatus>;
          decisionOptions?: Record<string, string>;
          decisionEvidence?: Record<string, DecisionEvidenceLevel>;
          engagementSignalsState?: Record<string, EngagementSignal>;
          timelineChecks?: Record<string, boolean>;
        };
        setQuantities({ ...defaultQuantities, ...(parsed.quantities ?? {}) });
        setCustomItems(parsed.customItems ?? []);
        setSelectedStrategyId(parsed.selectedStrategyId ?? "balanced");
        setActiveLensId(parsed.activeLensId ?? "value");
        setNotes({ ...defaultNotes, ...(parsed.notes ?? {}) });
        setCheckedEvidence(parsed.checkedEvidence ?? {});
        setTemplateResponses(parsed.templateResponses ?? {});
        setAuthenticMetrics({ ...defaultAuthenticMetrics, ...(parsed.authenticMetrics ?? {}) });
        setTrackerResponses(parsed.trackerResponses ?? {});
        setAttributeLevels({ ...defaultAttributeLevels, ...(parsed.attributeLevels ?? {}) });
        setDescriptorChecks(parsed.descriptorChecks ?? {});
        setTaskOwners({ ...defaultTaskOwners, ...(parsed.taskOwners ?? {}) });
        setTaskStatuses({ ...defaultTaskStatuses, ...(parsed.taskStatuses ?? {}) });
        setDecisionOptions({ ...defaultDecisionOptions, ...(parsed.decisionOptions ?? {}) });
        setDecisionEvidence({ ...defaultDecisionEvidence, ...(parsed.decisionEvidence ?? {}) });
        setEngagementSignalsState({ ...defaultEngagementSignals, ...(parsed.engagementSignalsState ?? {}) });
        setTimelineChecks(parsed.timelineChecks ?? {});
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    storageReady.current = true;
  }, []);

  useEffect(() => {
    if (!storageReady.current) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        quantities,
        customItems,
        selectedStrategyId,
        activeLensId,
        notes,
        checkedEvidence,
        templateResponses,
        authenticMetrics,
        trackerResponses,
        attributeLevels,
        descriptorChecks,
        taskOwners,
        taskStatuses,
        decisionOptions,
        decisionEvidence,
        engagementSignalsState,
        timelineChecks,
      }),
    );
  }, [
    activeLensId,
    attributeLevels,
    authenticMetrics,
    checkedEvidence,
    customItems,
    descriptorChecks,
    decisionEvidence,
    decisionOptions,
    engagementSignalsState,
    notes,
    quantities,
    selectedStrategyId,
    taskOwners,
    taskStatuses,
    templateResponses,
    timelineChecks,
    trackerResponses,
  ]);

  const allItems = useMemo(() => [...starterItems, ...customItems], [customItems]);
  const selectedLens = lenses.find((lens) => lens.id === activeLensId) ?? lenses[0];
  const selectedStrategy = strategies.find((strategy) => strategy.id === selectedStrategyId) ?? strategies[0];

  const selectedItems = useMemo(() => {
    return allItems
      .map((item) => ({
        ...item,
        quantity: quantities[item.id] ?? 0,
        total: (quantities[item.id] ?? 0) * item.price,
      }))
      .filter((item) => item.quantity > 0);
  }, [allItems, quantities]);

  const total = selectedItems.reduce((sum, item) => sum + item.total, 0);
  const remaining = BUDGET - total;
  const percentUsed = Math.min(100, Math.round((total / BUDGET) * 100));
  const checkedCount = checklist.filter((item) => checkedEvidence[item.id]).length;
  const readinessScore = Math.round(
    ((remaining >= 0 ? 1 : 0) + (selectedItems.length >= 8 ? 1 : 0) + checkedCount / checklist.length) /
      3 *
      100,
  );
  const completedTemplateFields = templateFields.filter(
    (field) => wordCount(templateResponses[field.id] ?? "") >= field.minWords,
  );
  const groupTemplateFields = templateFields.filter((field) => field.section === "Group");
  const individualTemplateFields = templateFields.filter((field) => field.section === "Individual");
  const completedGroupFields = groupTemplateFields.filter(
    (field) => wordCount(templateResponses[field.id] ?? "") >= field.minWords,
  );
  const completedIndividualFields = individualTemplateFields.filter(
    (field) => wordCount(templateResponses[field.id] ?? "") >= field.minWords,
  );
  const integrityFlags =
    authenticMetrics.blockedPastes + authenticMetrics.blockedDrops + authenticMetrics.rejectedBursts;
  const writingMinutes = authenticMetrics.startedAt
    ? Math.max(1, Math.round((Date.now() - authenticMetrics.startedAt) / 60000))
    : 0;
  const attributeEvidence = reportingAttributes.map((attribute) => {
    const level = attributeLevels[attribute.id] ?? "Good";
    const descriptors = attribute.descriptors[level];
    const checkedDescriptors = descriptors.filter((_, index) => descriptorChecks[`${attribute.id}-${level}-${index}`]);
    return { attribute, level, descriptors, checkedCount: checkedDescriptors.length };
  });
  const reportingReadyCount = attributeEvidence.filter((row) => row.checkedCount >= 3).length;
  const teamTasksReady = teamTasks.filter((task) => ["Evidence ready", "Complete"].includes(taskStatuses[task.id])).length;
  const timelineReadyCount = projectTimeline.filter((phase) => timelineChecks[phase.id]).length;
  const decisionHasEvidence = decisionOptionIds.some((optionId) =>
    decisionCriteria.some((criterion) => {
      const level = decisionEvidence[`${optionId}-${criterion.id}`] ?? "Not yet";
      return level === "Some evidence" || level === "Strong evidence";
    }),
  );
  const engagementHasReflection = engagementTrackers.some(
    (tracker) =>
      (engagementSignalsState[tracker.id] ?? "Not yet") !== "Not yet" ||
      wordCount(trackerResponses[`engagement-${tracker.id}`] ?? "") >= 8,
  );
  const portfolioCompleteCount = reportingAttributes.filter((attribute) => {
    return (
      wordCount(trackerResponses[`portfolio-${attribute.id}-can`] ?? "") >= 8 &&
      wordCount(trackerResponses[`portfolio-${attribute.id}-evidence`] ?? "") >= 10 &&
      wordCount(trackerResponses[`portfolio-${attribute.id}-next`] ?? "") >= 6
    );
  }).length;

  const categoryTotals = categories.map((category) => {
    const amount = selectedItems
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.total, 0);
    return {
      category,
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    };
  });

  const filteredCurriculumRows = curriculumRows.filter((row) => {
    const subjectMatches = subjectFilter === "All" || row.subject === subjectFilter;
    const statusMatches = statusFilter === "All" || row.status === statusFilter;
    return subjectMatches && statusMatches;
  });

  const subjectOptions = ["All", ...Array.from(new Set(curriculumRows.map((row) => row.subject)))];

  const summaryText = useMemo(() => {
    const itemList =
      selectedItems.length > 0
        ? selectedItems.map((item) => `${item.quantity} x ${item.name} (${money(item.total)})`).join(", ")
        : "No items selected";

    const categoriesText = categoryTotals
      .filter((category) => category.amount > 0)
      .map((category) => `${category.category}: ${money(category.amount)} (${category.percent}%)`)
      .join("; ");

    return [
      "$100 Human Dignity Kit Builder",
      "",
      `Total cost: ${money(total)}. Remaining budget: ${money(remaining)}.`,
      `Selected items: ${itemList}.`,
      `Category allocation: ${categoriesText || "No allocation yet"}.`,
      `Recommended strategy: ${selectedStrategy.name}. ${selectedStrategy.benefit}`,
      "",
      `Need statement: ${notes.need}`,
      `Science evidence question: ${notes.science}`,
      `Dignity rationale: ${notes.dignity}`,
      `Pitch claim: ${notes.pitch}`,
      "",
      "Assessment task: Teams recommend a dignity kit for Shopfront using a $100 budget constraint.",
      `Required submissions: ${assessmentDeliverables.join(" ")}`,
      `Online template: group component ${completedGroupFields.length}/${groupTemplateFields.length} checkpoints complete; individual component ${completedIndividualFields.length}/${individualTemplateFields.length} checkpoints complete.`,
      `Authentic entry log: ${authenticMetrics.keystrokes} typed keystrokes, ${integrityFlags} paste/drop or large-insert flags, ${writingMinutes} minute writing window.`,
      "Capability process: flexible checkpoints help students set their own pace, targets and accountabilities without over-prescribing the project.",
      `Teamwork tracker: ${teamTasksReady > 0 ? "owners, target dates and progress evidence are being recorded." : "ready for teams to allocate roles, dates and check-in evidence."}`,
      `Critical-thinking tool: ${decisionHasEvidence ? "students have started qualitative evidence judgements for their options." : "ready for students to compare options using evidence, dignity, value and feasibility."}`,
      `Engagement tracker: ${engagementHasReflection ? "group and individual reflection evidence has started." : "ready for students to record focus, contribution, support and next targets."}`,
      `Reporting attributes: ${reportingReadyCount > 0 ? "descriptor evidence is being collected for teacher judgement." : "qualitative descriptors are ready for evidence-based teacher judgement."}`,
      `Capability portfolio: ${portfolioCompleteCount > 0 ? "students are building brag-book reflections about growth, evidence and next steps." : "each student can build a brag-book portfolio from project evidence."}`,
      "Marking scale: 3 Secure, 2 Developing, 1 Emerging, 0 Not demonstrated across VALUE, CHOICE, EVIDENCE, VOICE and DIGNITY.",
    ].join("\n");
  }, [
    authenticMetrics.keystrokes,
    categoryTotals,
    completedGroupFields.length,
    completedIndividualFields.length,
    groupTemplateFields.length,
    individualTemplateFields.length,
    integrityFlags,
    decisionHasEvidence,
    engagementHasReflection,
    notes,
    portfolioCompleteCount,
    remaining,
    reportingReadyCount,
    selectedItems,
    selectedStrategy,
    teamTasksReady,
    total,
    writingMinutes,
  ]);

  function changeQuantity(id: string, delta: number) {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] ?? 0) + delta),
    }));
  }

  function addCustomItem() {
    const price = Number(customPrice);
    if (!customName.trim() || !Number.isFinite(price) || price <= 0) return;

    const id = `custom-${Date.now()}`;
    setCustomItems((current) => [
      ...current,
      {
        id,
        name: customName.trim(),
        category: customCategory,
        price,
        defaultQty: 0,
        purpose: "Teacher-added local item.",
        evidenceCue: "Students justify whether this belongs in the kit.",
      },
    ]);
    setQuantities((current) => ({ ...current, [id]: 1 }));
    setCustomName("");
    setCustomPrice("");
  }

  function resetWorkspace() {
    setQuantities(defaultQuantities);
    setCustomItems([]);
    setSelectedStrategyId("balanced");
    setActiveLensId("value");
    setNotes(defaultNotes);
    setCheckedEvidence({});
    setTemplateResponses({});
    setAuthenticMetrics(defaultAuthenticMetrics);
    setTrackerResponses({});
    setAttributeLevels(defaultAttributeLevels);
    setDescriptorChecks({});
    setTaskOwners(defaultTaskOwners);
    setTaskStatuses(defaultTaskStatuses);
    setDecisionOptions(defaultDecisionOptions);
    setDecisionEvidence(defaultDecisionEvidence);
    setEngagementSignalsState(defaultEngagementSignals);
    setTimelineChecks({});
    setCopied(false);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  async function copySummary() {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function startAuthenticLog() {
    setAuthenticMetrics((current) => (current.startedAt ? current : { ...current, startedAt: Date.now() }));
  }

  function noteAuthenticMetric(metric: "blockedPastes" | "blockedDrops" | "rejectedBursts" | "keystrokes") {
    setAuthenticMetrics((current) => ({
      ...current,
      startedAt: current.startedAt ?? Date.now(),
      [metric]: current[metric] + 1,
    }));
  }

  function changeTemplateResponse(id: string, nextValue: string) {
    const previousValue = templateResponses[id] ?? "";
    const insertedCharacters = nextValue.length - previousValue.length;

    startAuthenticLog();

    if (insertedCharacters > 18) {
      noteAuthenticMetric("rejectedBursts");
      return;
    }

    setTemplateResponses((current) => ({ ...current, [id]: nextValue }));
  }

  function changeTrackerResponse(id: string, nextValue: string) {
    const previousValue = trackerResponses[id] ?? "";
    const insertedCharacters = nextValue.length - previousValue.length;

    startAuthenticLog();

    if (insertedCharacters > 18) {
      noteAuthenticMetric("rejectedBursts");
      return;
    }

    setTrackerResponses((current) => ({ ...current, [id]: nextValue }));
  }

  function blockTemplatePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    noteAuthenticMetric("blockedPastes");
  }

  function blockTemplateDrop(event: DragEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    noteAuthenticMetric("blockedDrops");
  }

  function checkBeforeInput(event: FormEvent<HTMLTextAreaElement>) {
    const nativeEvent = event.nativeEvent as InputEvent;
    if (nativeEvent.inputType === "insertFromPaste" || nativeEvent.inputType === "insertFromDrop") {
      event.preventDefault();
      if (nativeEvent.inputType === "insertFromPaste") noteAuthenticMetric("blockedPastes");
      if (nativeEvent.inputType === "insertFromDrop") noteAuthenticMetric("blockedDrops");
    }
  }

  function countTemplateKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete" || event.key === "Enter") {
      noteAuthenticMetric("keystrokes");
    }
  }

  function clearStudentTemplate() {
    setTemplateResponses({});
    setTrackerResponses({});
    setDescriptorChecks({});
    setTaskOwners(defaultTaskOwners);
    setTaskStatuses(defaultTaskStatuses);
    setDecisionOptions(defaultDecisionOptions);
    setDecisionEvidence(defaultDecisionEvidence);
    setEngagementSignalsState(defaultEngagementSignals);
    setTimelineChecks({});
    setAuthenticMetrics(defaultAuthenticMetrics);
  }

  function renderTrackedTextarea(id: string, placeholder: string, rows = 4) {
    return (
      <textarea
        autoComplete="off"
        onBeforeInput={checkBeforeInput}
        onChange={(event) => changeTrackerResponse(id, event.target.value)}
        onDrop={blockTemplateDrop}
        onKeyDown={countTemplateKey}
        onPaste={blockTemplatePaste}
        placeholder={placeholder}
        rows={rows}
        spellCheck={true}
        value={trackerResponses[id] ?? ""}
      />
    );
  }

  return (
    <main className="app-shell">
      <aside className="side-nav" aria-label="App sections">
        <a href="#builder">Builder</a>
        <a href="#process">Process</a>
        <a href="#evidence">Evidence</a>
        <a href="#curriculum">Curriculum</a>
        <a href="#assessment">Assessment</a>
        <a href="#template">Template</a>
        <a href="#summary">Summary</a>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Shopfront Year 8</p>
            <h1>$100 Human Dignity Kit Builder</h1>
            <p className="topbar-intro">
              The $100 Human Dignity Kit Challenge as a timeline-guided student project, assessment evidence
              map and capability portfolio.
            </p>
          </div>
          <div className="topbar-actions">
            <button type="button" onClick={() => window.print()}>
              Print
            </button>
            <button type="button" onClick={resetWorkspace}>
              Reset
            </button>
          </div>
        </header>

        <section className="builder-layout" id="builder">
          <div className="catalog-panel">
            <div className="section-title">
              <div>
                <p className="eyebrow">Build the kit</p>
                <h2>Choose items under the $100 constraint</h2>
              </div>
              <span className={remaining >= 0 ? "health-chip good" : "health-chip alert"}>
                {remaining >= 0 ? `${money(remaining)} left` : `${money(Math.abs(remaining))} over`}
              </span>
            </div>

            <div className="item-grid">
              {allItems.map((item) => {
                const quantity = quantities[item.id] ?? 0;
                return (
                  <article className={quantity > 0 ? "item-row selected" : "item-row"} key={item.id}>
                    <div>
                      <span>{item.category}</span>
                      <h3>{item.name}</h3>
                      <p>{item.purpose}</p>
                      <small>{item.evidenceCue}</small>
                    </div>
                    <div className="item-controls">
                      <strong>{money(item.price)}</strong>
                      <div className="stepper" aria-label={`${item.name} quantity`}>
                        <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove ${item.name}`}>
                          -
                        </button>
                        <output>{quantity}</output>
                        <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add ${item.name}`}>
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="custom-item-panel">
              <label>
                Local item
                <input
                  type="text"
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="e.g. laundry voucher"
                />
              </label>
              <label>
                Category
                <select value={customCategory} onChange={(event) => setCustomCategory(event.target.value as Category)}>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Unit price
                <input
                  type="number"
                  min="0"
                  step="0.05"
                  value={customPrice}
                  onChange={(event) => setCustomPrice(event.target.value)}
                  placeholder="0.00"
                />
              </label>
              <button type="button" onClick={addCustomItem}>
                Add item
              </button>
            </div>
          </div>

          <aside className="budget-panel" aria-label="Budget summary">
            <p className="eyebrow">Live budget</p>
            <div className="budget-total">
              <span>{money(total)}</span>
              <strong>of $100 used</strong>
            </div>
            <div className="budget-bar" aria-label={`${percentUsed} percent of budget used`}>
              <span style={{ width: `${percentUsed}%` }} />
            </div>
            <div className="budget-stats">
              <div>
                <span>{selectedItems.length}</span>
                <p>items selected</p>
              </div>
              <div>
                <span>{checkedCount}/5</span>
                <p>evidence pieces</p>
              </div>
              <div>
                <span>{readinessScore}%</span>
                <p>pitch readiness</p>
              </div>
            </div>
            <div className="allocation-list">
              {categoryTotals.map((row) => (
                <div key={row.category}>
                  <span>{row.category}</span>
                  <strong>{money(row.amount)}</strong>
                  <div className="allocation-bar" aria-label={`${row.category} ${row.percent} percent`}>
                    <span style={{ width: `${row.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="process-section" id="process">
          <div className="section-title">
            <div>
              <p className="eyebrow">Capability process tools</p>
              <h2>Self-paced targets, accountability and learning artifacts</h2>
            </div>
            <span className="health-chip">{timelineReadyCount > 0 ? "Evidence trail started" : "Student-paced guide"}</span>
          </div>

          <div className="process-principle">
            <article>
              <p className="eyebrow">Student pace</p>
              <h3>Teams choose the next checkpoint when they are ready.</h3>
              <p>Teachers can prompt quality and accountability without turning the project into a fixed lesson sequence.</p>
            </article>
            <article>
              <p className="eyebrow">Visible process</p>
              <h3>Students leave artifacts as they work.</h3>
              <p>Goals, check-ins, adjustments and reflections become evidence for collaboration, engagement and growth.</p>
            </article>
            <article>
              <p className="eyebrow">Qualitative judgement</p>
              <h3>Capabilities are described, not scored.</h3>
              <p>Students select descriptors only when they can point to behaviour, evidence or a reflection that backs it up.</p>
            </article>
          </div>

          <div className="milestone-grid" aria-label="Flexible project checkpoints">
            {projectTimeline.map((phase) => (
              <label className={timelineChecks[phase.id] ? "milestone-card complete" : "milestone-card"} key={phase.id}>
                <input
                  type="checkbox"
                  checked={Boolean(timelineChecks[phase.id])}
                  onChange={(event) =>
                    setTimelineChecks((current) => ({
                      ...current,
                      [phase.id]: event.target.checked,
                    }))
                  }
                />
                <span>{phase.checkpoint}</span>
                <h3>{phase.title}</h3>
                <p>{phase.teacherMove}</p>
                <strong>{phase.studentTool}</strong>
                <small>{phase.artifact}</small>
              </label>
            ))}
          </div>

          <article className="tool-panel" aria-label="Team working document">
            <div className="tool-heading">
              <div>
                <p className="eyebrow">Collaboration tool</p>
                <h3>Team working document</h3>
              </div>
              <span className="soft-chip">Goals, roles, check-ins, adjustments</span>
            </div>
            <div className="reflection-grid">
              <label className="reflection-field">
                Who is in our group?
                {renderTrackedTextarea("team-members", "Type each group member's name and what strength they bring.", 3)}
              </label>
              <label className="reflection-field">
                What is our next target?
                {renderTrackedTextarea("team-target", "What will we try to finish next, and what will count as done?", 3)}
              </label>
              <label className="reflection-field">
                What behaviours will help us work well?
                {renderTrackedTextarea("team-norms", "Name the collaboration habits your team agrees to use.", 3)}
              </label>
              <label className="reflection-field">
                What might get in the way?
                {renderTrackedTextarea("team-risk", "Name a likely blocker and how your team will respond.", 3)}
              </label>
            </div>

            <div className="team-task-list">
              {teamTasks.map((task) => (
                <div className="team-task-row" key={task.id}>
                  <div>
                    <h4>{task.label}</h4>
                    <p>{task.evidence}</p>
                  </div>
                  <label>
                    Owner
                    <input
                      type="text"
                      value={taskOwners[task.id] ?? ""}
                      onChange={(event) =>
                        setTaskOwners((current) => ({
                          ...current,
                          [task.id]: event.target.value,
                        }))
                      }
                      placeholder="Name"
                    />
                  </label>
                  <label>
                    By when
                    <input
                      type="text"
                      value={trackerResponses[`task-${task.id}-due`] ?? ""}
                      onChange={(event) => changeTrackerResponse(`task-${task.id}-due`, event.target.value)}
                      placeholder="Date or checkpoint"
                    />
                  </label>
                  <label>
                    Progress
                    <select
                      value={taskStatuses[task.id] ?? "Not started"}
                      onChange={(event) =>
                        setTaskStatuses((current) => ({
                          ...current,
                          [task.id]: event.target.value as TeamTaskStatus,
                        }))
                      }
                    >
                      {taskStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  <label className="task-evidence">
                    Evidence note
                    {renderTrackedTextarea(`task-${task.id}-evidence`, "What proves this has moved forward?", 3)}
                  </label>
                </div>
              ))}
            </div>
          </article>

          <article className="tool-panel" aria-label="Critical thinking record">
            <div className="tool-heading">
              <div>
                <p className="eyebrow">Critical thinking tool</p>
                <h3>Decision making and analysis record</h3>
              </div>
              <span className="soft-chip">Evidence, trade-offs, changed thinking</span>
            </div>
            <div className="option-grid">
              {decisionOptionIds.map((optionId, index) => (
                <label key={optionId}>
                  Option {String.fromCharCode(65 + index)}
                  <input
                    type="text"
                    value={decisionOptions[optionId] ?? ""}
                    onChange={(event) =>
                      setDecisionOptions((current) => ({
                        ...current,
                        [optionId]: event.target.value,
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <div className="decision-table" role="region" aria-label="Qualitative decision matrix" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th>Criterion</th>
                    {decisionOptionIds.map((optionId, index) => (
                      <th key={optionId}>{decisionOptions[optionId] || `Option ${String.fromCharCode(65 + index)}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {decisionCriteria.map((criterion) => (
                    <tr key={criterion.id}>
                      <td>
                        <strong>{criterion.label}</strong>
                        <span>{criterion.prompt}</span>
                      </td>
                      {decisionOptionIds.map((optionId) => (
                        <td key={`${optionId}-${criterion.id}`}>
                          <select
                            className="qualitative-select"
                            value={decisionEvidence[`${optionId}-${criterion.id}`] ?? "Not yet"}
                            onChange={(event) =>
                              setDecisionEvidence((current) => ({
                                ...current,
                                [`${optionId}-${criterion.id}`]: event.target.value as DecisionEvidenceLevel,
                              }))
                            }
                          >
                            {decisionEvidenceLevels.map((level) => (
                              <option key={level}>{level}</option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="reflection-grid">
              {criticalThinkingPrompts.map((prompt) => (
                <label className="reflection-field" key={prompt.id}>
                  {prompt.label}
                  {renderTrackedTextarea(`thinking-${prompt.id}`, prompt.prompt, 3)}
                </label>
              ))}
              <label className="reflection-field wide">
                Current recommendation
                {renderTrackedTextarea(
                  "decision-current-choice",
                  "Which option is strongest right now, and what evidence or value judgement makes you think that?",
                  3,
                )}
              </label>
            </div>
          </article>

          <div className="process-tools-grid">
            <article className="tool-panel" aria-label="Progress check-in record">
              <div className="tool-heading">
                <div>
                  <p className="eyebrow">Progress tool</p>
                  <h3>Check-in meetings</h3>
                </div>
                <span className="soft-chip">Accountability without micromanaging</span>
              </div>
              <div className="reflection-grid single">
                {checkInPrompts.map((prompt) => (
                  <label className="reflection-field" key={prompt.id}>
                    {prompt.title}
                    {renderTrackedTextarea(`checkin-${prompt.id}`, prompt.prompt, 4)}
                  </label>
                ))}
              </div>
            </article>

            <article className="tool-panel" aria-label="Engagement check-in">
              <div className="tool-heading">
                <div>
                  <p className="eyebrow">Engagement tool</p>
                  <h3>Group and individual check-in</h3>
                </div>
                <span className="soft-chip">Focus, effort, support, next target</span>
              </div>
              <div className="engagement-grid">
                {engagementTrackers.map((tracker) => (
                  <div className="engagement-row" key={tracker.id}>
                    <label>
                      {tracker.label}
                      <select
                        value={engagementSignalsState[tracker.id] ?? "Not yet"}
                        onChange={(event) =>
                          setEngagementSignalsState((current) => ({
                            ...current,
                            [tracker.id]: event.target.value as EngagementSignal,
                          }))
                        }
                      >
                        {engagementSignals.map((signal) => (
                          <option key={signal}>{signal}</option>
                        ))}
                      </select>
                    </label>
                    <label className="reflection-field">
                      Evidence
                      {renderTrackedTextarea(`engagement-${tracker.id}`, tracker.prompt, 3)}
                    </label>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="tool-panel" aria-label="Reporting attributes evidence">
            <div className="tool-heading">
              <div>
                <p className="eyebrow">Reporting attributes</p>
                <h3>Qualitative evidence for teacher judgement</h3>
              </div>
              <span className="soft-chip">At least 3 descriptors need evidence for a rating</span>
            </div>
            <div className="reporting-attribute-grid">
              {attributeEvidence.map(({ attribute, level, descriptors, checkedCount }) => (
                <article className="attribute-card" key={attribute.id}>
                  <div className="attribute-card-header">
                    <span>{attribute.shortName}</span>
                    <select
                      value={level}
                      onChange={(event) =>
                        setAttributeLevels((current) => ({
                          ...current,
                          [attribute.id]: event.target.value as ReportingLevel,
                        }))
                      }
                    >
                      {reportingLevels.map((reportingLevel) => (
                        <option key={reportingLevel}>{reportingLevel}</option>
                      ))}
                    </select>
                  </div>
                  <h3>{attribute.title}</h3>
                  <p>{attribute.description}</p>
                  <ul className="descriptor-list">
                    {descriptors.map((descriptor, index) => {
                      const descriptorId = `${attribute.id}-${level}-${index}`;
                      return (
                        <li key={descriptorId}>
                          <label>
                            <input
                              type="checkbox"
                              checked={Boolean(descriptorChecks[descriptorId])}
                              onChange={(event) =>
                                setDescriptorChecks((current) => ({
                                  ...current,
                                  [descriptorId]: event.target.checked,
                                }))
                              }
                            />
                            <span>{descriptor}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <p className={checkedCount >= 3 ? "descriptor-status ready" : "descriptor-status"}>
                    {checkedCount >= 3
                      ? "Descriptor evidence is ready for teacher review."
                      : "Select descriptors only when there is visible evidence."}
                  </p>
                  <label className="reflection-field">
                    Evidence note
                    {renderTrackedTextarea(
                      `attribute-${attribute.id}-evidence`,
                      "Describe the behaviour, decision or reflection that supports this descriptor choice.",
                      3,
                    )}
                  </label>
                </article>
              ))}
            </div>
          </article>

          <article className="tool-panel" aria-label="Capability brag book portfolio">
            <div className="tool-heading">
              <div>
                <p className="eyebrow">Individual portfolio</p>
                <h3>Capability brag book</h3>
              </div>
              <span className="soft-chip">I can, evidence, next stretch</span>
            </div>
            <div className="portfolio-grid">
              {reportingAttributes.map((attribute) => (
                <article className="portfolio-card" key={attribute.id}>
                  <span>{attribute.shortName}</span>
                  <h3>{attribute.title}</h3>
                  <label className="reflection-field">
                    I can now...
                    {renderTrackedTextarea(
                      `portfolio-${attribute.id}-can`,
                      "Name a capability you can now show more confidently.",
                      3,
                    )}
                  </label>
                  <label className="reflection-field">
                    Evidence from this project
                    {renderTrackedTextarea(
                      `portfolio-${attribute.id}-evidence`,
                      "Point to a task, decision, check-in, peer moment or piece of work that proves it.",
                      3,
                    )}
                  </label>
                  <label className="reflection-field">
                    My next stretch
                    {renderTrackedTextarea(
                      `portfolio-${attribute.id}-next`,
                      "What would you work on next to keep developing this capability?",
                      3,
                    )}
                  </label>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="evidence-layout" id="evidence">
          <div className="section-title">
            <div>
              <p className="eyebrow">Decision evidence</p>
              <h2>Compare options before recommending one</h2>
            </div>
          </div>

          <div className="strategy-grid">
            {strategies.map((strategy) => (
              <button
                className={selectedStrategy.id === strategy.id ? "strategy-card selected" : "strategy-card"}
                key={strategy.id}
                onClick={() => setSelectedStrategyId(strategy.id)}
                type="button"
              >
                <span>{money(strategy.cost)}</span>
                <h3>{strategy.name}</h3>
                <p>{strategy.benefit}</p>
                <small>{strategy.tradeoff}</small>
              </button>
            ))}
          </div>

          <div className="notes-grid">
            <label>
              Identified need
              <textarea value={notes.need} onChange={(event) => setNotes({ ...notes, need: event.target.value })} />
            </label>
            <label>
              Product test question
              <textarea
                value={notes.science}
                onChange={(event) => setNotes({ ...notes, science: event.target.value })}
              />
            </label>
            <label>
              Human dignity rationale
              <textarea
                value={notes.dignity}
                onChange={(event) => setNotes({ ...notes, dignity: event.target.value })}
              />
            </label>
            <label>
              Shopfront pitch claim
              <textarea value={notes.pitch} onChange={(event) => setNotes({ ...notes, pitch: event.target.value })} />
            </label>
          </div>
        </section>

        <section className="curriculum-section" id="curriculum">
          <div className="section-title">
            <div>
              <p className="eyebrow">Curriculum engine</p>
              <h2>Show teachers exactly where the project earns its place</h2>
            </div>
          </div>

          <div className="lens-workspace">
            <div className="lens-tabs" role="tablist" aria-label="Curriculum lenses">
              {lenses.map((lens) => (
                <button
                  aria-selected={selectedLens.id === lens.id}
                  className={selectedLens.id === lens.id ? "active" : ""}
                  key={lens.id}
                  onClick={() => setActiveLensId(lens.id)}
                  role="tab"
                  type="button"
                >
                  <span>{lens.token}</span>
                  {lens.subject}
                </button>
              ))}
            </div>

            <article className="lens-card">
              <p className="eyebrow">{selectedLens.token}</p>
              <h3>{selectedLens.prompt}</h3>
              <div className="lens-columns">
                <div>
                  <h4>Explicit teaching</h4>
                  <ul>
                    {selectedLens.explicitTeaching.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Student evidence</h4>
                  <ul>
                    {selectedLens.studentEvidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="code-strip">
                {selectedLens.codes.map((code) => (
                  <code key={code}>{code}</code>
                ))}
              </div>
            </article>
          </div>

          <div className="filters">
            <label>
              Subject
              <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
                {subjectOptions.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </label>
            <label>
              Claim
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | Status)}>
                <option>All</option>
                <option>Directly assessed</option>
                <option>Applied or practised</option>
                <option>Context only</option>
              </select>
            </label>
          </div>

          <div className="matrix-table" role="region" aria-label="Curriculum mapping table" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Teach first</th>
                  <th>Project trigger</th>
                  <th>Evidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCurriculumRows.map((row) => (
                  <tr key={`${row.subject}-${row.code}-${row.area}`}>
                    <td>
                      <strong>{row.subject}</strong>
                      <span>{row.area}</span>
                    </td>
                    <td>
                      <code>{row.code}</code>
                    </td>
                    <td>{row.teach}</td>
                    <td>{row.trigger}</td>
                    <td>{row.evidence}</td>
                    <td>
                      <span className={`status ${statusClass(row.status)}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="assessment-section" id="assessment">
          <div className="section-title">
            <div>
              <p className="eyebrow">Actual assessment</p>
              <h2>Student task, required evidence and marking criteria</h2>
            </div>
            <span className="health-chip">{checkedCount} complete</span>
          </div>

          <div className="assessment-brief">
            <article>
              <p className="eyebrow">Student scenario</p>
              <h3>Shopfront has $100 to create one dignity kit.</h3>
              <p>
                Your team must decide what should go in the kit, stay within budget, justify your choices
                with evidence and explain how the solution supports the dignity of a person experiencing
                homelessness or hardship.
              </p>
            </article>
            <article>
              <p className="eyebrow">Final recommendation</p>
              <h3>Recommend one kit for Shopfront to adopt.</h3>
              <p>
                Your proposal must show the numbers, the choices you rejected, one tested product claim,
                respectful persuasive writing and a clear dignity rationale.
              </p>
            </article>
          </div>

          <div className="deliverables-panel">
            <div>
              <p className="eyebrow">Required submissions</p>
              <h3>What students hand in</h3>
            </div>
            <ol className="deliverables-list">
              {assessmentDeliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ol>
          </div>

          <div className="checklist-grid">
            {checklist.map((item) => (
              <label className="check-row" key={item.id}>
                <input
                  type="checkbox"
                  checked={Boolean(checkedEvidence[item.id])}
                  onChange={(event) =>
                    setCheckedEvidence((current) => ({
                      ...current,
                      [item.id]: event.target.checked,
                    }))
                  }
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>

          <div className="assessment-table" role="region" aria-label="Assessment rubric" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th>Lens</th>
                  <th>Criteria</th>
                  <th>3 - Secure</th>
                  <th>2 - Developing</th>
                  <th>1 - Emerging</th>
                  <th>0 - Not demonstrated</th>
                </tr>
              </thead>
              <tbody>
                {assessmentCriteria.map((criterion) => (
                  <tr key={criterion.token}>
                    <td>
                      <strong>{criterion.token}</strong>
                      <span>{criterion.subject}</span>
                    </td>
                    <td>{criterion.focus}</td>
                    <td>{criterion.secure}</td>
                    <td>{criterion.developing}</td>
                    <td>{criterion.emerging}</td>
                    <td>{criterion.missing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="clue-grid" aria-label="Classroom clue system">
            {clueLevels.map((clue) => (
              <article key={clue.name}>
                <span>{clue.name}</span>
                <h3>{clue.purpose}</h3>
                <p>{clue.example}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="template-section" id="template">
          <div className="section-title">
            <div>
              <p className="eyebrow">Online guided template</p>
              <h2>Student workspace with group and individual evidence</h2>
            </div>
            <span className={integrityFlags === 0 ? "health-chip good" : "health-chip alert"}>
              {completedTemplateFields.length}/{templateFields.length} checkpoints
            </span>
          </div>

          <div className="template-mode-grid">
            <article>
              <p className="eyebrow">Group component</p>
              <h3>Shared project evidence</h3>
              <p>
                One team submission records the kit design, budget proof, decision matrix, product test
                and final Shopfront recommendation.
              </p>
              <strong>
                {completedGroupFields.length}/{groupTemplateFields.length} group checkpoints complete
              </strong>
            </article>
            <article>
              <p className="eyebrow">Individual component</p>
              <h3>Personal accountability</h3>
              <p>
                Each student completes their own reflection so the teacher can see personal contribution,
                evidence understanding and dignity reasoning.
              </p>
              <strong>
                {completedIndividualFields.length}/{individualTemplateFields.length} individual checkpoints complete
              </strong>
            </article>
          </div>

          <div className="integrity-panel">
            <div>
              <p className="eyebrow">AI copy-paste guard</p>
              <h3>Typed-only response fields</h3>
              <p>
                Student writing boxes block paste, block drag-drop text and reject sudden large text
                insertions. This creates process evidence for teacher review; it is not a perfect AI detector.
              </p>
            </div>
            <div className="integrity-metrics" aria-label="Authentic entry log">
              <div>
                <span>{authenticMetrics.keystrokes}</span>
                <p>typed keys</p>
              </div>
              <div>
                <span>{authenticMetrics.blockedPastes}</span>
                <p>pastes blocked</p>
              </div>
              <div>
                <span>{authenticMetrics.blockedDrops + authenticMetrics.rejectedBursts}</span>
                <p>insert flags</p>
              </div>
              <div>
                <span>{writingMinutes}</span>
                <p>minutes</p>
              </div>
            </div>
          </div>

          <div className="template-actions">
            <label className="declaration-row">
              <input
                type="checkbox"
                checked={authenticMetrics.integrityConfirmed}
                onChange={(event) =>
                  setAuthenticMetrics((current) => ({
                    ...current,
                    integrityConfirmed: event.target.checked,
                    startedAt: current.startedAt ?? Date.now(),
                  }))
                }
              />
              <span>
                I confirm these responses were typed by me in this workspace and I can explain them to my
                teacher.
              </span>
            </label>
            <div>
              <button type="button" onClick={() => window.print()}>
                Print student template
              </button>
              <button type="button" onClick={clearStudentTemplate}>
                Clear template
              </button>
            </div>
          </div>

          {(["Group", "Individual"] as TemplateSection[]).map((section) => {
            const fields = templateFields.filter((field) => field.section === section);
            return (
              <div className="template-panel" key={section}>
                <div className="template-panel-heading">
                  <p className="eyebrow">{section} component</p>
                  <h3>{section === "Group" ? "Team evidence" : "Personal evidence"}</h3>
                </div>
                <div className="template-field-grid">
                  {fields.map((field) => {
                    const value = templateResponses[field.id] ?? "";
                    const words = wordCount(value);
                    const ready = words >= field.minWords;
                    return (
                      <label className={ready ? "template-field ready" : "template-field"} key={field.id}>
                        <span>
                          <strong>{field.label}</strong>
                          <em>
                            {words}/{field.minWords} words
                          </em>
                        </span>
                        <p>{field.guide}</p>
                        <textarea
                          autoComplete="off"
                          onBeforeInput={checkBeforeInput}
                          onChange={(event) => changeTemplateResponse(field.id, event.target.value)}
                          onDrop={blockTemplateDrop}
                          onKeyDown={countTemplateKey}
                          onPaste={blockTemplatePaste}
                          placeholder="Type your response here. Paste and drag-drop are blocked."
                          spellCheck={true}
                          value={value}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        <section className="summary-section" id="summary">
          <div className="section-title">
            <div>
              <p className="eyebrow">Generated proposal</p>
              <h2>Staff-ready summary</h2>
            </div>
            <button type="button" onClick={copySummary}>
              {copied ? "Copied" : "Copy summary"}
            </button>
          </div>
          <pre>{summaryText}</pre>
        </section>
      </div>
    </main>
  );
}

function money(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function statusClass(status: Status) {
  if (status === "Directly assessed") return "direct";
  if (status === "Applied or practised") return "practice";
  return "context";
}
