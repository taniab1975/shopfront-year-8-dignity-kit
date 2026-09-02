"use client";

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
        };
        setQuantities({ ...defaultQuantities, ...(parsed.quantities ?? {}) });
        setCustomItems(parsed.customItems ?? []);
        setSelectedStrategyId(parsed.selectedStrategyId ?? "balanced");
        setActiveLensId(parsed.activeLensId ?? "value");
        setNotes({ ...defaultNotes, ...(parsed.notes ?? {}) });
        setCheckedEvidence(parsed.checkedEvidence ?? {});
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
      }),
    );
  }, [activeLensId, checkedEvidence, customItems, notes, quantities, selectedStrategyId]);

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
      "Marking scale: 3 Secure, 2 Developing, 1 Emerging, 0 Not demonstrated across VALUE, CHOICE, EVIDENCE, VOICE and DIGNITY.",
    ].join("\n");
  }, [categoryTotals, notes, remaining, selectedItems, selectedStrategy, total]);

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
    setCopied(false);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  async function copySummary() {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="app-shell">
      <aside className="side-nav" aria-label="App sections">
        <a href="#builder">Builder</a>
        <a href="#evidence">Evidence</a>
        <a href="#curriculum">Curriculum</a>
        <a href="#assessment">Assessment</a>
        <a href="#summary">Summary</a>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Shopfront Year 8</p>
            <h1>$100 Human Dignity Kit Builder</h1>
            <p className="topbar-intro">
              The $100 Human Dignity Kit Challenge as a working staff proposal, student task model and
              assessment evidence map.
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

function statusClass(status: Status) {
  if (status === "Directly assessed") return "direct";
  if (status === "Applied or practised") return "practice";
  return "context";
}
