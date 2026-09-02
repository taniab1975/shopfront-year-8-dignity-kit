"use client";

import { useMemo, useState } from "react";

type Status = "Directly assessed" | "Applied or practised" | "Context only";

type Lens = {
  id: string;
  subject: string;
  token: string;
  signal: string;
  question: string;
  claim: string;
  explicitTeaching: string[];
  transferPrompts: string[];
  evidence: string;
  assessed: string[];
  practised: string[];
};

type CurriculumRow = {
  subject: string;
  area: string;
  code: string;
  descriptor: string;
  teach: string;
  trigger: string;
  evidence: string;
  status: Status;
};

const lenses: Lens[] = [
  {
    id: "maths",
    subject: "Mathematics",
    token: "VALUE",
    signal: "$100",
    question: "Can you prove the numbers work?",
    claim:
      "Mathematics is the proof layer. Students turn a compassionate idea into a costed, reasoned, scalable solution.",
    explicitTeaching: [
      "Percentage of a quantity and one quantity as a percentage of another.",
      "Money calculations using positive decimals, unit price, totals and comparisons.",
      "Estimation, rounding and reasonableness checks before accepting a calculator answer.",
      "Mathematical modelling: constraints, representation, solution and interpretation.",
    ],
    transferPrompts: [
      "You have spent money in several categories. What percentage of the $100 does each category use?",
      "If this kit worked, what would ten equivalent kits cost?",
      "Estimate the total before calculating. Does your answer make sense?",
    ],
    evidence:
      "Itemised budget, category percentages, estimation notes, scaling calculation and written mathematical justification.",
    assessed: ["MA-CN-001", "MA-CN-004", "MA-CN-005", "MA-MNA-001"],
    practised: ["MA-UN-001", "MA-UN-005"],
  },
  {
    id: "hass",
    subject: "HASS Economics",
    token: "CHOICE",
    signal: "Basket",
    question: "What will you choose and give up?",
    claim:
      "Economics is the decision layer. Students face scarcity, compare alternatives and justify how scarce resources should be allocated.",
    explicitTeaching: [
      "Scarcity, resources, allocation and opportunity cost.",
      "Consumers, producers, goods, services and types of suppliers.",
      "Factors influencing consumer decisions: price, quality, need, access and value.",
      "Budgeting for a short-term financial goal.",
    ],
    transferPrompts: [
      "You cannot buy everything. Which need has priority and why?",
      "The cheapest option leaves money unspent, but is it the best value?",
      "Which consumer responsibility matters when you choose products for someone else?",
    ],
    evidence:
      "Three-option decision matrix, final allocation rationale, budget justification and cost-benefit evaluation.",
    assessed: ["HS-EB-001", "HS-EB-006", "HS-EB-007", "HS-EV-001"],
    practised: ["HS-EB-002", "HS-EB-008", "HS-AN-001", "HS-AN-005"],
  },
  {
    id: "science",
    subject: "Science Inquiry",
    token: "EVIDENCE",
    signal: "Test",
    question: "How do you know the product does what it claims?",
    claim:
      "Science is the evidence layer. Students do not claim Science Understanding coverage unless the teacher designs it, but Science Inquiry is authentic and assessable.",
    explicitTeaching: [
      "Investigable questions, predictions and fair-test design.",
      "Independent, dependent and controlled variables.",
      "Reproducible method, safe conduct and ethical consideration.",
      "Tables, graphs, anomalies, patterns and evidence-based conclusions.",
    ],
    transferPrompts: [
      "Two products make competing claims. Which one should Shopfront trust?",
      "What would make this test fair enough to inform a real purchase?",
      "Does your data support spending part of the $100 on this item?",
    ],
    evidence:
      "Product test plan, risk notes, results table, graph, conclusion and purchase recommendation.",
    assessed: ["SC-QP-001", "SC-PC-001", "SC-PMA-001", "SC-PMA-002", "SC-EV-002"],
    practised: ["Science Understanding is not claimed unless a teacher deliberately adds it."],
  },
  {
    id: "english",
    subject: "English",
    token: "VOICE",
    signal: "Pitch",
    question: "Can you persuade a real audience using evidence?",
    claim:
      "English is the audience layer. The final communication has purpose, consequence and a real audience: Shopfront and the teaching team.",
    explicitTeaching: [
      "Audience, purpose, persuasive structure, claim and recommendation.",
      "Using evidence, examples and substantiation to strengthen paragraphs.",
      "Language choices that preserve dignity and shape relationships.",
      "Editing and publishing written or multimodal texts for a specific audience.",
    ],
    transferPrompts: [
      "Shopfront can only choose one proposal. How will you convince them?",
      "Where is your evidence, and how does each piece support your claim?",
      "Does your language describe people respectfully and precisely?",
    ],
    evidence:
      "One-page proposal, dignity statement, optional two-minute pitch and evidence-based persuasive paragraphs.",
    assessed: ["EN-CT-001", "EN-TSO-002", "EN-LFI-001"],
    practised: ["EN-CT-002", "EN-TSO-001", "EN-EWA-002"],
  },
  {
    id: "religion",
    subject: "Religion",
    token: "DIGNITY",
    signal: "Person",
    question: "Is this decision worthy of the person receiving it?",
    claim:
      "Religion is the moral spine. Students explain why the kit is about dignity, not simply cheap products.",
    explicitTeaching: [
      "People are made in the image and likeness of God.",
      "Human dignity does not depend on wealth, work or housing status.",
      "Catholic Social Teaching: Common Good and Stewardship.",
      "Religious inquiry skills: source purpose, point of view, evidence and conclusion.",
    ],
    transferPrompts: [
      "What is the difference between a cheap kit and a dignity kit?",
      "How does this choice serve the Common Good?",
      "Are you using the $100 as a steward of resources and of human dignity?",
    ],
    evidence:
      "Dignity rationale using Imago Dei, Stewardship or Common Good, with sourced evidence and a clear conclusion.",
    assessed: [
      "Image and likeness of God",
      "Stewardship",
      "Common Good",
      "Religious Inquiry Skills",
    ],
    practised: ["Using religious concepts to make an ethical decision."],
  },
];

const curriculumRows: CurriculumRow[] = [
  {
    subject: "Mathematics",
    area: "Number and Algebra: Calculating with number",
    code: "MA-CN-001",
    descriptor:
      "Determine percentages of quantities and express one quantity as a percentage of another.",
    teach: "Percentages of amounts, conversions and percentage allocation.",
    trigger: "Prove how much of the $100 is spent on each need category.",
    evidence: "Category percentages in the final budget.",
    status: "Directly assessed",
  },
  {
    subject: "Mathematics",
    area: "Number and Algebra: Calculating with number",
    code: "MA-CN-004",
    descriptor: "Multiply and divide positive decimals using flexible and efficient strategies.",
    teach: "Money calculations, unit price, quantity times cost and cost per kit.",
    trigger: "Build a full itemised kit under $100.",
    evidence: "Accurate cost table and unit-price comparison.",
    status: "Directly assessed",
  },
  {
    subject: "Mathematics",
    area: "Number and Algebra: Calculating with number",
    code: "MA-CN-005",
    descriptor:
      "Use appropriate rounding, estimation strategies and context to check reasonableness of solutions.",
    teach: "Estimation before calculation and rounding in a money context.",
    trigger: "Check whether the proposed total is realistic before finalising.",
    evidence: "Estimation note and reasonableness explanation.",
    status: "Directly assessed",
  },
  {
    subject: "Mathematics",
    area: "Number and Algebra: Modelling",
    code: "MA-MNA-001",
    descriptor:
      "Analyse real-world constraints, represent them mathematically, solve and interpret the result.",
    teach: "How to turn a real-world problem into a mathematical model.",
    trigger: "Create the best possible dignity kit under a fixed $100 constraint.",
    evidence: "Budget model, assumptions and interpreted recommendation.",
    status: "Directly assessed",
  },
  {
    subject: "Mathematics",
    area: "Number and Algebra: Understanding number",
    code: "MA-UN-001",
    descriptor: "Explore relationships between fractions, decimals and percentages.",
    teach: "Equivalence between $27, 27 percent and 27 out of 100.",
    trigger: "Translate budget allocations across forms.",
    evidence: "Working shown in calculations.",
    status: "Applied or practised",
  },
  {
    subject: "Mathematics",
    area: "Number and Algebra: Understanding number",
    code: "MA-UN-005",
    descriptor: "Apply proportional reasoning to equivalent ratios and fractions.",
    teach: "Scaling a kit from one person to ten people.",
    trigger: "If Shopfront had $1,000, how many equivalent kits could it create?",
    evidence: "Scaling calculation.",
    status: "Applied or practised",
  },
  {
    subject: "HASS Economics",
    area: "Economics and Business: Allocation of resources",
    code: "HS-EB-001",
    descriptor:
      "The way markets in Australia influence decisions about the allocation of resources to goods and services.",
    teach: "Scarcity, resources, allocation, opportunity cost, consumers and producers.",
    trigger: "The $100 budget means every choice excludes another choice.",
    evidence: "Allocation rationale and opportunity-cost explanation.",
    status: "Directly assessed",
  },
  {
    subject: "HASS Economics",
    area: "Economics and Business: Consumer decisions",
    code: "HS-EB-006",
    descriptor: "Factors that influence major consumer and financial decisions.",
    teach: "Price, quality, need, durability, access, substitutes and value.",
    trigger: "Choose between cheap, durable, bulk and dignity-preserving options.",
    evidence: "Purchasing matrix and consumer decision justification.",
    status: "Directly assessed",
  },
  {
    subject: "HASS Economics",
    area: "Economics and Business: Budgeting",
    code: "HS-EB-007",
    descriptor:
      "Ways individuals plan and budget to achieve short-term and long-term financial goals.",
    teach: "Budget categories, constraints, trade-offs and monitoring totals.",
    trigger: "Stay under $100 while meeting identified needs.",
    evidence: "Budget plan and final balance.",
    status: "Directly assessed",
  },
  {
    subject: "HASS Economics",
    area: "HASS Skills: Evaluating",
    code: "HS-EV-001",
    descriptor:
      "Generate alternatives, compare options, evaluate costs and benefits and plan action.",
    teach: "How to compare alternatives using consistent criteria.",
    trigger: "Compare at least three kit configurations before choosing one.",
    evidence: "Decision matrix and action recommendation.",
    status: "Directly assessed",
  },
  {
    subject: "HASS Economics",
    area: "Economics and Business: Demand and supply",
    code: "HS-EB-002",
    descriptor: "How demand and supply models show interactions between consumers and businesses.",
    teach: "Demand, supply, availability and price movement.",
    trigger: "Explain why essential product prices or availability can change.",
    evidence: "Supplier comparison notes.",
    status: "Applied or practised",
  },
  {
    subject: "HASS Economics",
    area: "Economics and Business: Consumer rights",
    code: "HS-EB-008",
    descriptor: "Rights and responsibilities of consumers and businesses in Australia.",
    teach: "Accurate product information, safe products, misleading claims and refunds.",
    trigger: "Decide whether a product is safe, truthful and suitable for someone else.",
    evidence: "Consumer responsibility notes in purchasing rationale.",
    status: "Applied or practised",
  },
  {
    subject: "Science Inquiry",
    area: "Science Inquiry: Questioning and predicting",
    code: "SC-QP-001",
    descriptor:
      "Propose investigable questions and make predictions to identify patterns and test relationships.",
    teach: "Testable questions and predictions linked to a product claim.",
    trigger: "Which product claim should Shopfront trust?",
    evidence: "Investigation question and prediction.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    area: "Science Inquiry: Planning and conducting",
    code: "SC-PC-001",
    descriptor:
      "Plan and conduct reproducible investigations, manage risks and consider ethical issues.",
    teach: "Variables, fair testing, repeated trials, risk and reproducibility.",
    trigger: "Design a fair product test before spending the money.",
    evidence: "Method, variables table and risk notes.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    area: "Science Inquiry: Processing, modelling and analysing",
    code: "SC-PMA-001",
    descriptor: "Construct tables and graphs to organise and process data.",
    teach: "Recording data clearly and choosing an appropriate graph.",
    trigger: "Represent test results for a purchase recommendation.",
    evidence: "Results table and graph.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    area: "Science Inquiry: Processing, modelling and analysing",
    code: "SC-PMA-002",
    descriptor:
      "Analyse data, identify patterns and anomalies, and draw conclusions based on evidence.",
    teach: "Pattern finding, anomaly discussion and evidence-based conclusions.",
    trigger: "Does the data justify including this product in the kit?",
    evidence: "Conclusion linked to the data.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    area: "Science Inquiry: Evaluating",
    code: "SC-EV-002",
    descriptor:
      "Construct evidence-based arguments to support conclusions or evaluate claims.",
    teach: "How to evaluate claims using test evidence rather than advertising.",
    trigger: "Should Shopfront trust the product claim?",
    evidence: "Scientific recommendation in the final proposal.",
    status: "Directly assessed",
  },
  {
    subject: "Science Inquiry",
    area: "Science Understanding",
    code: "Not claimed",
    descriptor:
      "The kit does not automatically cover a Year 8 Science Understanding descriptor.",
    teach: "Only add content-specific Science Understanding if the Science teacher designs it.",
    trigger: "Keep the Science claim defensible.",
    evidence: "No formal claim unless deliberately designed.",
    status: "Context only",
  },
  {
    subject: "English",
    area: "Literacy: Creating texts",
    code: "EN-CT-001",
    descriptor:
      "Plan, create, edit and publish written and multimodal texts for purpose and audience.",
    teach: "Proposal structure, audience, purpose, editing and publication.",
    trigger: "Convince Shopfront that this is the best use of $100.",
    evidence: "One-page final Shopfront proposal.",
    status: "Directly assessed",
  },
  {
    subject: "English",
    area: "Language: Cohesion",
    code: "EN-TSO-002",
    descriptor:
      "Strengthen paragraphs with examples, quotations and substantiation of claims.",
    teach: "Claim, evidence, explanation and paragraph cohesion.",
    trigger: "Every recommendation must be supported by evidence.",
    evidence: "Substantiated persuasive paragraphs.",
    status: "Directly assessed",
  },
  {
    subject: "English",
    area: "Language: Interacting with others",
    code: "EN-LFI-001",
    descriptor: "Recognise how language shapes relationships and roles.",
    teach: "Respectful language, dignity, power and representation.",
    trigger: "Choose language that does not diminish people experiencing hardship.",
    evidence: "Language choices in the dignity rationale and proposal.",
    status: "Directly assessed",
  },
  {
    subject: "English",
    area: "Literacy: Creating texts",
    code: "EN-CT-002",
    descriptor: "Plan, rehearse and deliver spoken and multimodal presentations.",
    teach: "Oral pitch structure, rehearsal, voice and multimodal support.",
    trigger: "Deliver a two-minute pitch to Shopfront or teachers.",
    evidence: "Optional pitch.",
    status: "Applied or practised",
  },
  {
    subject: "Religion",
    area: "Belief, Teaching, Texts",
    code: "Year 8 RE",
    descriptor: "People are made in the image and likeness of God.",
    teach: "Imago Dei and inherent human worth.",
    trigger: "What makes this a dignity kit rather than a cheap kit?",
    evidence: "Dignity statement using the concept correctly.",
    status: "Directly assessed",
  },
  {
    subject: "Religion",
    area: "People, Values, Society",
    code: "Year 8 RE",
    descriptor: "Catholic Social Teaching: Stewardship and Common Good.",
    teach: "Responsible use of resources and action for the good of all.",
    trigger: "How should the $100 be used responsibly and ethically?",
    evidence: "Ethical justification in the final recommendation.",
    status: "Directly assessed",
  },
  {
    subject: "Religion",
    area: "Religious Inquiry Skills",
    code: "Year 8 RE",
    descriptor:
      "Locate information, identify source purpose and viewpoints, use evidence and draw conclusions.",
    teach: "Source origin, purpose, point of view, usefulness and conclusion.",
    trigger: "Use evidence about needs, homelessness and dignity to justify the kit.",
    evidence: "Sourced dignity rationale.",
    status: "Directly assessed",
  },
  {
    subject: "HASS",
    area: "History, Geography and Civics",
    code: "Not claimed",
    descriptor:
      "These areas can provide context but should not be forced into formal assessment for this project.",
    teach: "Use only if a teacher deliberately designs a separate extension.",
    trigger: "Protect the credibility of the pitch.",
    evidence: "No formal claim in the shared assessment.",
    status: "Context only",
  },
];

const deliverables = [
  {
    part: "Part A",
    name: "The $100 Kit",
    detail:
      "Item list, supplier, quantity, unit price, total, category percentages and remaining balance.",
    assesses: "Mathematics + HASS",
  },
  {
    part: "Part B",
    name: "Decision Matrix",
    detail:
      "Three alternative configurations compared by cost, benefits, limitations, evidence and final value.",
    assesses: "HASS + Mathematics",
  },
  {
    part: "Part C",
    name: "Product Test",
    detail:
      "One product claim tested through question, prediction, variables, method, table, graph and conclusion.",
    assesses: "Science Inquiry",
  },
  {
    part: "Part D",
    name: "Dignity Statement",
    detail:
      "A 200-word explanation using Imago Dei plus Stewardship or Common Good to justify the choices.",
    assesses: "Religion + English",
  },
  {
    part: "Part E",
    name: "Final Shopfront Proposal",
    detail:
      "One-page proposal or two-minute pitch with claim, evidence, economic reasoning and recommendation.",
    assesses: "English + synthesis",
  },
];

const sequence = [
  {
    title: "Teach",
    detail: "Each subject explicitly teaches its own knowledge first.",
  },
  {
    title: "Launch",
    detail: "Students receive the authentic Shopfront $100 brief and the blank kit board.",
  },
  {
    title: "Recognise",
    detail: "Puzzle signals cue students to retrieve the right subject knowledge.",
  },
  {
    title: "Apply",
    detail: "Teams build budgets, matrices, tests, dignity rationales and proposals.",
  },
  {
    title: "Assess",
    detail: "Teachers mark only the evidence that belongs to their curriculum area.",
  },
];

const clueLevels = [
  {
    level: "Clue 1",
    name: "Metacognitive",
    detail: "Which subject have you learned something in that could help solve this problem?",
  },
  {
    level: "Clue 2",
    name: "Curriculum memory",
    detail: "Think back to scarcity, allocation, percentages, fair testing or persuasive evidence.",
  },
  {
    level: "Clue 3",
    name: "Scaffold",
    detail: "Use the named concept and complete the next calculation, test step or paragraph move.",
  },
];

const subjects = ["All", ...Array.from(new Set(curriculumRows.map((row) => row.subject)))];
const statuses: Array<"All" | Status> = [
  "All",
  "Directly assessed",
  "Applied or practised",
  "Context only",
];

export default function Home() {
  const [selectedLensId, setSelectedLensId] = useState("maths");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | Status>("Directly assessed");

  const selectedLens = lenses.find((lens) => lens.id === selectedLensId) ?? lenses[0];

  const filteredRows = useMemo(() => {
    return curriculumRows.filter((row) => {
      const subjectMatches = selectedSubject === "All" || row.subject === selectedSubject;
      const statusMatches = selectedStatus === "All" || row.status === selectedStatus;
      return subjectMatches && statusMatches;
    });
  }, [selectedStatus, selectedSubject]);

  const directCount = curriculumRows.filter((row) => row.status === "Directly assessed").length;
  const practiceCount = curriculumRows.filter((row) => row.status === "Applied or practised").length;
  const subjectCount = new Set(
    curriculumRows
      .filter((row) => row.status === "Directly assessed")
      .map((row) => row.subject),
  ).size;

  return (
    <main className="app-shell">
      <aside className="nav-rail" aria-label="Proposal sections">
        <a href="#brief">Brief</a>
        <a href="#lenses">Lenses</a>
        <a href="#matrix">Matrix</a>
        <a href="#puzzle">Puzzle</a>
        <a href="#assessment">Assess</a>
        <a href="#sequence">Plan</a>
      </aside>

      <div className="proposal-content">
        <section className="brief-band" id="brief">
          <div className="brief-copy">
            <p className="eyebrow">Teacher pitch dossier</p>
            <h1>The $100 Human Dignity Kit Challenge</h1>
            <p className="lead">
              Students design the most effective dignity kit possible for $100. Their decisions must be
              financially sound, evidence-based, respectful of human dignity and clearly justified to
              Shopfront.
            </p>
            <div className="brief-actions" aria-label="Primary proposal actions">
              <a href="#matrix">Check curriculum claims</a>
              <button type="button" onClick={() => window.print()}>
                Print pitch pack
              </button>
            </div>
          </div>
          <div className="impact-panel" aria-label="Proposal evidence summary">
            <p>Credibility test</p>
            <strong>{directCount}</strong>
            <span>direct assessment links across {subjectCount} learning areas</span>
            <dl>
              <div>
                <dt>Practised links</dt>
                <dd>{practiceCount}</dd>
              </div>
              <div>
                <dt>Forced claims</dt>
                <dd>0</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="lens-workbench" id="lenses">
          <div className="section-heading">
            <p className="eyebrow">Five disciplinary lenses</p>
            <h2>Each subject owns a real part of the problem</h2>
            <p>
              The project does not replace explicit teaching. It gives students a real moment to recognise,
              retrieve and apply what they have already learned.
            </p>
          </div>

          <div className="lens-grid">
            <div className="lens-selector" role="tablist" aria-label="Learning area lenses">
              {lenses.map((lens) => (
                <button
                  aria-selected={selectedLens.id === lens.id}
                  className={selectedLens.id === lens.id ? "is-active" : ""}
                  key={lens.id}
                  onClick={() => setSelectedLensId(lens.id)}
                  role="tab"
                  type="button"
                >
                  <span>{lens.token}</span>
                  {lens.subject}
                </button>
              ))}
            </div>

            <article className="lens-detail">
              <div className="token-lockup">
                <div className="token-mark" aria-hidden="true">
                  {selectedLens.signal}
                </div>
                <div>
                  <p>{selectedLens.token}</p>
                  <h3>{selectedLens.question}</h3>
                </div>
              </div>
              <p className="lens-claim">{selectedLens.claim}</p>

              <div className="detail-columns">
                <div>
                  <h4>Teach explicitly first</h4>
                  <ul>
                    {selectedLens.explicitTeaching.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Transfer cues</h4>
                  <ul>
                    {selectedLens.transferPrompts.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="evidence-row">
                <div>
                  <span>Assessable evidence</span>
                  <p>{selectedLens.evidence}</p>
                </div>
                <div>
                  <span>Direct codes</span>
                  <p>{selectedLens.assessed.join(", ")}</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="matrix-section" id="matrix">
          <div className="section-heading">
            <p className="eyebrow">Curriculum legitimacy matrix</p>
            <h2>What is taught, where it transfers, and what teachers can mark</h2>
          </div>

          <div className="filters" aria-label="Curriculum filters">
            <label>
              Subject
              <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)}>
                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </label>
            <label>
              Claim type
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as "All" | Status)}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="matrix-table" role="region" aria-label="Curriculum mapping table" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Curriculum point</th>
                  <th>Teach first</th>
                  <th>Project trigger</th>
                  <th>Evidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={`${row.subject}-${row.code}-${row.area}`}>
                    <td>
                      <strong>{row.subject}</strong>
                      <span>{row.area}</span>
                    </td>
                    <td>
                      <code>{row.code}</code>
                      <p>{row.descriptor}</p>
                    </td>
                    <td>{row.teach}</td>
                    <td>{row.trigger}</td>
                    <td>{row.evidence}</td>
                    <td>
                      <span className={`status-pill ${statusClass(row.status)}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="puzzle-section" id="puzzle">
          <div className="section-heading">
            <p className="eyebrow">Physical transfer system</p>
            <h2>The Dignity Kit Puzzle Board</h2>
            <p>
              Students collect five pieces without seeing subject labels first. The point is to notice the
              problem type, retrieve the relevant curriculum and use it.
            </p>
          </div>

          <div className="token-grid">
            {lenses.map((lens) => (
              <article className="token-card" key={lens.id}>
                <div className="mini-token" aria-hidden="true">
                  {lens.signal}
                </div>
                <span>{lens.token}</span>
                <h3>{lens.question}</h3>
                <p>{lens.subject}</p>
              </article>
            ))}
          </div>

          <div className="clue-grid">
            {clueLevels.map((clue) => (
              <article className="clue-card" key={clue.level}>
                <span>{clue.level}</span>
                <h3>{clue.name}</h3>
                <p>{clue.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="assessment-section" id="assessment">
          <div className="section-heading">
            <p className="eyebrow">Assessment design</p>
            <h2>One portfolio, separate legitimate assessment evidence</h2>
            <p>
              Students submit one coherent project portfolio. Each teacher marks only the evidence that
              belongs to their curriculum area.
            </p>
          </div>

          <div className="deliverable-grid">
            {deliverables.map((deliverable) => (
              <article className="deliverable-card" key={deliverable.part}>
                <span>{deliverable.part}</span>
                <h3>{deliverable.name}</h3>
                <p>{deliverable.detail}</p>
                <strong>{deliverable.assesses}</strong>
              </article>
            ))}
          </div>

          <div className="rubric-panel">
            <div>
              <h3>Simple marking scale</h3>
              <p>
                3 = Secure, 2 = Developing, 1 = Emerging, 0 = Not demonstrated. This keeps the
                project easy to mark while still ticking curriculum boxes.
              </p>
            </div>
            <div className="rubric-list" aria-label="Subject assessment ownership">
              <span>Maths: budget, percentages, decimals, estimation and modelling</span>
              <span>HASS: scarcity, allocation, budgeting and decision evaluation</span>
              <span>Science: question, fair test, data, graph and evidence-based conclusion</span>
              <span>English: persuasive proposal, evidence, cohesion and respectful language</span>
              <span>Religion: Imago Dei, Stewardship, Common Good and sourced dignity rationale</span>
            </div>
          </div>
        </section>

        <section className="sequence-section" id="sequence">
          <div className="section-heading">
            <p className="eyebrow">Implementation sequence</p>
            <h2>Learn, recognise, retrieve, apply, explain</h2>
          </div>

          <div className="sequence-line">
            {sequence.map((step, index) => (
              <article key={step.title}>
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>

          <div className="teacher-note">
            <h3>Pitch it as curriculum delivery, not an extra project</h3>
            <p>
              The proposal is strongest when teachers see what it replaces: a worksheet, test item or
              isolated response can become authentic evidence in the shared portfolio. History, Geography
              and Civics stay as possible context only, which protects the credibility of the model.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function statusClass(status: Status) {
  if (status === "Directly assessed") return "direct";
  if (status === "Applied or practised") return "practice";
  return "context";
}
