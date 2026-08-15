/* ===== LAST VERIFIED =====================================================
   Bump this date whenever the quarterly refresh pass completes
   (see docs/QUARTERLY-REFRESH.md). It renders in the site footer.
   ISO format. The plan (R15) says it should never be older than ~4 months. */
window.CCAF_LAST_VERIFIED = '2026-08-15';

/* Card content registry. Content tickets (DIV-26..30) fill this per step;
   the two Reading cards below are SAMPLES proving the card system (DIV-24)
   and will be replaced during the DIV-27 content pass.
   Shape: { stepId: [{ id, title, minutes, quick, fromZero, examTwist }] }
   All strings are first-party authored HTML — no user or third-party input. */

window.CCAF_CARDS = {
  blueprint: [
    {
      id: 'exam-at-a-glance',
      title: 'The exam at a glance',
      minutes: 2,
      quick: `
        <p>CCA-F is a <strong>proctored, 60-question multiple-choice exam</strong> taken in
        <strong>120 minutes</strong> for <strong>$125</strong>, delivered through Pearson VUE —
        online with a webcam proctor, or at a test center. Results are reported on a scaled
        score out of 1000. The questions are scenario-based: they describe a situation and ask
        for the best architectural judgment, not a definition.</p>`,
      fromZero: `
        <p>Never taken a proctored cert? "Proctored" means a live invigilator checks your ID and
        watches via webcam — clear desk, no second monitor, no phone. Book through the official
        certification page (below); online slots are usually available within days. If your
        home setup is unreliable, a Pearson VUE test center removes all the tech risk.</p>`,
      examTwist: `
        <p>120 minutes for 60 questions sounds generous — it isn't, because every question is a
        paragraph-long scenario. Budget <strong>~90 seconds a question</strong>, flag anything
        that drags, and bank the saved time for the flagged ones. Finishing the first pass with
        20 minutes to review beats agonizing sequentially.</p>`,
    },
    {
      id: 'five-domains',
      title: 'The five domains and their weights',
      minutes: 2,
      quick: `
        <p>Everything on the exam maps to five weighted domains:</p>
        <ul>
          <li><strong>Agentic Architecture &amp; Orchestration — 27%</strong></li>
          <li><strong>Claude Code Configuration &amp; Workflows — 20%</strong></li>
          <li><strong>Prompt Engineering &amp; Structured Output — 20%</strong></li>
          <li><strong>Tool Design &amp; MCP Integration — 18%</strong></li>
          <li><strong>Context Management &amp; Reliability — 15%</strong></li>
        </ul>`,
      fromZero: `
        <p>In one line each: <em>agentic architecture</em> = when to use one agent, many agents,
        or none at all; <em>Claude Code</em> = configuring the CLI/agent harness (CLAUDE.md,
        hooks, skills, permissions); <em>prompt engineering</em> = getting reliable, structured
        answers; <em>tool design/MCP</em> = giving Claude well-shaped tools and integrations;
        <em>context management</em> = living within the context window without losing the plot.</p>`,
      examTwist: `
        <p>Weights are your study budget: the heaviest domain (27%) supplies roughly one in four
        questions, so a shaky day on agent orchestration costs more than one on context
        management. Read the blueprint's task statements literally — each one is the seed of a
        scenario you'll recognize on exam day.</p>`,
    },
    {
      id: 'official-sources',
      title: 'Official material worth your time',
      minutes: 2,
      quick: `
        <p>Start from the source before any community content:</p>
        <ul>
          <li><a href="https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification" target="_blank" rel="noopener">Official certification page</a> — registration ($125), the exam guide &amp; blueprint PDF, and the exam policies. The blueprint's domain/task breakdown is what this whole guide is organized around.</li>
          <li><a href="https://platform.claude.com/docs" target="_blank" rel="noopener">Claude platform docs</a> — the API, tool use, MCP, structured outputs, context management: the primary material the exam draws on.</li>
          <li><a href="https://code.claude.com/docs" target="_blank" rel="noopener">Claude Code docs</a> — configuration, CLAUDE.md, hooks, skills, and workflows: the second-heaviest exam domain.</li>
          <li><a href="https://www.freecodecamp.org/news/claude-certified-architect-foundations-prep-for-anthropic-s-new-certification-exam/" target="_blank" rel="noopener">freeCodeCamp prep course</a> — a free full-length video course if you want a lecture format alongside this guide.</li>
        </ul>`,
      fromZero: `
        <p>Suggested order: skim the official exam guide PDF once (don't study it — just learn
        the map), then come back here and work the five steps. The PDF's task statements will
        feel abstract now and obvious by the time you finish the Drills step.</p>`,
      examTwist: `
        <p>When two study sources disagree, <strong>the blueprint wins</strong>. Community
        guides (this one included) lag behind blueprint revisions — check the "last verified"
        date in the footer, and if the official PDF changed recently, trust it over any
        summary.</p>`,
    },
  ],
  reading: [
    {
      id: 'workflow-or-agent',
      domain: 'agentic',
      title: 'Workflow or agent? The first fork',
      minutes: 2,
      quick: `
        <p>The first architectural question is never "which model" — it's <strong>how much
        autonomy the problem needs</strong>. If the steps are known in advance (classify, then
        extract, then format), build a <em>workflow</em>: fixed steps with LLM calls inside.
        If the model must decide its own path — which tools, how many steps, when it's done —
        that's an <em>agent</em>. Workflows are cheaper, faster, and easier to debug; agents
        buy flexibility at the cost of predictability.</p>`,
      fromZero: `
        <p>Salesforce lens: a workflow is a <em>Flow</em> — every branch drawn in advance. An
        agent is like handing a case to a senior rep: you define the goal and the tools they
        may use, and they choose the path. You'd never hire a rep to do what a Flow does
        reliably for free — same rule here.</p>`,
      examTwist: `
        <p>Scenarios describing a <strong>repeatable, well-defined pipeline</strong> are bait
        for over-engineering: the "build an autonomous agent" option sounds impressive and is
        wrong. Pick the fixed workflow/chained-calls answer whenever the steps are knowable in
        advance. The reverse trap exists too — genuinely open-ended tasks where a rigid
        pipeline would fail.</p>`,
    },
    {
      id: 'single-vs-multi',
      domain: 'agentic',
      title: 'One agent beats five — until it doesn\'t',
      minutes: 2,
      quick: `
        <p>Default to <strong>one agent with good tools</strong>. Add more agents only when a
        real constraint forces it: context that won't fit one window, genuinely parallel
        workstreams, or subtasks needing different instructions or permissions. Every added
        agent brings coordination cost — handoffs lose information, and failures multiply.</p>`,
      fromZero: `
        <p>Think of one admin with the right permission sets versus a committee. The committee
        wins only when the work truly splits — separate territories, separate skills. Otherwise
        meetings (agent handoffs) eat all the gains.</p>`,
      examTwist: `
        <p>Multi-agent options glitter on the exam. The correct answer is usually the
        <strong>simplest architecture that satisfies the stated constraint</strong> — and the
        constraint is in the scenario's wording: "research spans dozens of documents in
        parallel" justifies subagents; "handle a support ticket" does not.</p>`,
    },
    {
      id: 'orchestrator-workers',
      domain: 'agentic',
      title: 'Orchestrator and subagents',
      minutes: 2,
      quick: `
        <p>The workhorse multi-agent pattern: a <strong>lead agent decomposes the task</strong>
        and dispatches scoped subagents, each with its <em>own clean context window</em> and a
        narrow brief. Subagents return summaries, not transcripts — the orchestrator holds the
        big picture and integrates results. Use it for parallel research, wide codebase sweeps,
        or specialist review passes.</p>`,
      fromZero: `
        <p>It's case swarming: a triage lead breaks a messy escalation into work items and
        routes each to a specialist queue. No specialist reads the whole case history — each
        gets exactly the slice they need, and the lead assembles the resolution.</p>`,
      examTwist: `
        <p>Cue phrases that point here: "context window fills up," "independent
        investigations," "parallel exploration," "specialist reviewers." When the scenario
        stresses <strong>isolation of contexts</strong> or <strong>fan-out</strong>, the answer
        is orchestrator + subagents — not one bigger prompt, and not fine-tuning.</p>`,
    },
    {
      id: 'api-sdk-code',
      domain: 'agentic',
      title: 'Messages API, Agent SDK, or Claude Code?',
      minutes: 2,
      quick: `
        <p>Three ways to build, in rising order of built-in machinery: the <strong>Messages
        API</strong> gives raw model access — you own the loop, tool execution, and state. The
        <strong>Agent SDK</strong> ships the agentic harness (tool loop, file access, subagents,
        hooks) as a library for production apps. <strong>Claude Code</strong> is the same
        harness as an interactive developer tool. Rule of thumb: API for custom control,
        SDK for shipping agents, Claude Code for building software with an agent.</p>`,
      fromZero: `
        <p>Rough analogy: Messages API is raw Apex — total control, you write everything. The
        Agent SDK is the platform's standard objects and automation — proven machinery you
        configure instead of rebuild. Claude Code is the setup UI on top. Choose by how much
        of the machine you want to own.</p>`,
      examTwist: `
        <p>Scenario says "team needs a production agent with tool use and file access,
        <em>minimal harness code</em>" → Agent SDK. "Fine-grained control over every token and
        a custom execution loop" → Messages API. "Developers automating their own workflow" →
        Claude Code. The wrong options are the same three names shuffled — match the
        <strong>ownership level</strong>, not the buzzword.</p>`,
    },
    {
      id: 'autonomy-brakes',
      domain: 'agentic',
      title: 'Autonomy needs brakes',
      minutes: 2,
      quick: `
        <p>Agent safety is an <strong>architecture property, not a prompt property</strong>.
        Instructions steer probabilistically; for actions that are irreversible or expensive —
        deletes, payments, sending messages — you gate with mechanisms: permission allowlists,
        human approval on specific tools, sandboxed execution, and least-privilege credentials.
        The prompt says "be careful"; the harness makes careless impossible.</p>`,
      fromZero: `
        <p>Exactly like an approval process on a high-value opportunity: the rep (agent) can
        draft anything, but the discount doesn't ship until a manager clicks approve. Profiles
        and field-level security exist because "please don't touch that" isn't a control.</p>`,
      examTwist: `
        <p>When a scenario involves a destructive or customer-visible action, the answer
        involving <strong>deterministic gating</strong> (approval step, permission rule, scoped
        credentials) beats every "improve the system prompt" option. Prompts are probabilistic;
        hooks and permissions are deterministic — the exam tests whether you know which layer
        to reach for.</p>`,
    },
    {
      id: 'measure-agents',
      domain: 'agentic',
      title: 'You can\'t improve what you don\'t measure',
      minutes: 2,
      quick: `
        <p>Production agents need <strong>evals</strong>: a fixed set of representative tasks,
        scored automatically (exact checks, rubric graders, or LLM-as-judge), run on every
        change. Without them, prompt edits are vibes — a fix for one case silently breaks
        three others. Start small: a dozen real cases beats a hundred synthetic ones.</p>`,
      fromZero: `
        <p>This is your regression suite and UAT rolled into one. You'd never deploy an Apex
        change without tests green; don't ship a prompt or tool change without the eval set
        green either.</p>`,
      examTwist: `
        <p>Cue: "quality dropped after we changed the prompt — what should the team have done?"
        The answer is <strong>establish evals/baselines before iterating</strong>, not "use a
        bigger model" and not "add more instructions." Anything resembling measure-first is
        usually the intended choice.</p>`,
    },
    {
      id: 'claude-md-brief',
      domain: 'claude-code',
      title: 'CLAUDE.md is your standing brief',
      minutes: 2,
      quick: `
        <p><strong>CLAUDE.md</strong> is a file at your project root that Claude Code loads
        into every session: conventions, commands, architecture notes, rules. It's how a team
        gets consistent behavior without re-explaining the project each time. Keep it short and
        binding — a page of load-bearing rules beats ten pages of description, because every
        line spends context budget on every request.</p>`,
      fromZero: `
        <p>Think of the onboarding doc you wish every new admin read before touching your org —
        except here it's actually read, every single session, automatically. What goes in it:
        "tests run with X," "never edit generated files," "deploys work like Y."</p>`,
      examTwist: `
        <p>Cue: "the team keeps getting inconsistent behavior across sessions" or "how do we
        make the agent follow project conventions?" The answer is a checked-in CLAUDE.md — not
        longer per-request prompts, and not a bigger model. If the scenario stresses
        <em>persistence across sessions</em>, it's this.</p>`,
    },
    {
      id: 'hooks-deterministic',
      domain: 'claude-code',
      title: 'Hooks: rules that cannot be ignored',
      minutes: 2,
      quick: `
        <p>Instructions in prompts are <em>probabilistic</em> — usually followed, never
        guaranteed. <strong>Hooks</strong> are shell commands that run automatically on events
        (before a tool call, after an edit, on session start) and can block, modify, or react
        deterministically. Policy that must hold 100% of the time — "never touch prod config,"
        "always run the formatter" — belongs in a hook, not a sentence.</p>`,
      fromZero: `
        <p>Salesforce lens: a prompt instruction is a help-text asking users to be careful; a
        hook is the validation rule that simply won't let the record save. You already know
        which one auditors trust.</p>`,
      examTwist: `
        <p>The word <strong>"must"</strong> or <strong>"never"</strong> in a scenario is the
        tell. Options offering "add it to the system prompt" are the trap; enforcement
        questions want the deterministic mechanism — a hook, a permission rule, or both.</p>`,
    },
    {
      id: 'skills-package-workflows',
      domain: 'claude-code',
      title: 'Skills: packaged, repeatable workflows',
      minutes: 2,
      quick: `
        <p>A <strong>skill</strong> is a folder of instructions (plus optional scripts and
        resources) that Claude loads on demand for a specific kind of task — a release
        checklist, a review playbook, a house writing style. Slash commands invoke them
        explicitly. Skills turn "the prompt that worked" into a versioned, shareable asset
        instead of something living in one person's chat history.</p>`,
      fromZero: `
        <p>Like a Flow template or a macro for your best procedure: written once by the person
        who knows it best, then run consistently by everyone else. If you find yourself pasting
        the same instructions twice, that's a skill asking to exist.</p>`,
      examTwist: `
        <p>Cue: "a multi-step process the team performs repeatedly" or "how do we standardize
        this workflow across the team?" → package it as a skill. Distinguish from CLAUDE.md
        (always-on project rules) — skills are <em>on-demand procedures</em>.</p>`,
    },
    {
      id: 'permissions-least-privilege',
      domain: 'claude-code',
      title: 'Permissions: least privilege for agents',
      minutes: 2,
      quick: `
        <p>Claude Code asks before running tools; <strong>permission settings and
        allowlists</strong> decide what runs without asking, what always asks, and what's
        denied outright. Production posture is least privilege: pre-approve the safe and
        routine (read files, run tests), gate the dangerous (network, deletes, credentials),
        and scope access to the directories the task actually needs.</p>`,
      fromZero: `
        <p>Profiles and permission sets, but for an agent: nobody gives every user Modify All
        Data just to close cases. Same instinct — grant the minimum that lets the work
        happen, and widen deliberately, not by default.</p>`,
      examTwist: `
        <p>Scenarios about <strong>unattended or CI-based</strong> agent runs turn on this:
        with no human at the prompt, the answer is a pre-configured allowlist plus denied
        dangerous actions — not "the agent will ask" (it can't) and not full autonomy.</p>`,
    },
    {
      id: 'headless-ci',
      domain: 'claude-code',
      title: 'Beyond the terminal: headless and CI',
      minutes: 2,
      quick: `
        <p>Claude Code isn't only interactive: it runs <strong>headless</strong> — scripted
        invocations with a prompt, pre-set permissions, and structured output — which is how
        you wire it into CI pipelines, scheduled jobs, and automation (review every PR, triage
        new issues, refresh docs). The same configuration surface (CLAUDE.md, hooks, skills,
        allowlists) governs both modes, so behavior stays consistent.</p>`,
      fromZero: `
        <p>Interactive mode is you working the org by hand; headless is the scheduled batch
        job. Same permissions model underneath — which is exactly why the permissions card
        matters before this one.</p>`,
      examTwist: `
        <p>Cue: "automatically on every pull request" or "nightly." The intended answer runs
        Claude Code non-interactively inside the pipeline with explicit permissions — watch
        for wrong options that assume a human approving each step.</p>`,
    },
    {
      id: 'system-prompt-contract',
      domain: 'prompting',
      title: 'The system prompt is a contract',
      minutes: 2,
      quick: `
        <p>Stable behavior lives in the <strong>system prompt</strong>: role, tone, hard
        constraints, output format, what to do when unsure. Per-message prompts carry the
        variable part — the task at hand. Specific beats vague ("cite the section number for
        every claim" vs "be accurate"), and positive instruction beats prohibition ("answer
        only from the provided document" vs "don't make things up").</p>`,
      fromZero: `
        <p>It's the job description versus the daily task list. You don't re-negotiate
        someone's role in every meeting — and if an assistant keeps making the same mistake,
        you fix the job description once, not every conversation.</p>`,
      examTwist: `
        <p>Cue: "the assistant repeatedly does X across many conversations." Recurring-behavior
        problems are <strong>system-prompt problems</strong>; one-off task problems are user-prompt
        problems. Options that patch a systemic issue with a per-message tweak are the trap.</p>`,
    },
    {
      id: 'structured-output-json',
      domain: 'prompting',
      title: 'JSON you can actually parse',
      minutes: 2,
      quick: `
        <p>When output feeds code, don't ask nicely — <strong>enforce structure</strong>. The
        reliable ladder: use the API's structured-output / schema features where available;
        otherwise define a tool whose input schema <em>is</em> your desired shape; validate
        the result and retry on failure. Free-text JSON requests ("respond only in JSON,
        please") are the fragile bottom rung.</p>`,
      fromZero: `
        <p>It's the difference between a required field with a data type and a free-text box
        with a pleading label. Integrations get built on the first kind. Schema = field
        definitions; validation = your required-field rules.</p>`,
      examTwist: `
        <p>Cue: "a downstream system consumes the response" or "parsing fails intermittently."
        The intended answer enforces a schema (structured outputs or tool definitions +
        validation), never "improve the prompt wording" alone. All four options will mention
        JSON — pick the <em>enforced</em> one.</p>`,
    },
    {
      id: 'few-shot-examples',
      domain: 'prompting',
      title: 'Show, don\'t tell: examples steer',
      minutes: 2,
      quick: `
        <p>Two or three well-chosen <strong>examples</strong> in the prompt beat paragraphs of
        adjectives. Examples nail down format, tone, and — most valuable — <em>edge-case
        handling</em>: include one example of a tricky input done right (empty input, mixed
        language, a borderline judgment call) and the model generalizes the pattern. Update the
        examples when you see a new failure class.</p>`,
      fromZero: `
        <p>Training a new teammate, you don't hand them ten pages of style guidance — you show
        them three great past cases and one nightmare case handled well. Prompts work the same
        way.</p>`,
      examTwist: `
        <p>Cue: "output format is inconsistent" or "handles unusual inputs badly." Adding
        few-shot exemplars (especially of the failing case) is usually the intended fix —
        cheaper than fine-tuning, more reliable than more adjectives. "Fine-tune a custom
        model" for a formatting problem is the classic over-reach distractor.</p>`,
    },
    {
      id: 'let-it-think',
      domain: 'prompting',
      title: 'Complex task? Let the model think',
      minutes: 2,
      quick: `
        <p>For multi-constraint reasoning — planning, math, tricky tradeoffs — give the model
        room to <strong>work before answering</strong>: extended thinking where the API offers
        it, or prompts that request explicit reasoning steps first. Decomposing one giant ask
        into stages (analyze → plan → produce) buys the same effect. The tradeoff is real:
        thinking costs tokens and latency, so switch it on for hard problems, not everything.</p>`,
      fromZero: `
        <p>You wouldn't ask an architect to blurt a final design in one breath; you'd expect
        working notes first. Same principle — and like billable hours, you spend deliberation
        where the decision is expensive, not on routine lookups.</p>`,
      examTwist: `
        <p>Cue: "fails on complex multi-step reasoning but simple queries are fine." Intended
        answer: enable extended thinking / step-wise reasoning or decompose the task — not
        raising temperature (that adds randomness, not rigor) and not just a bigger context.</p>`,
    },
    {
      id: 'mcp-in-90s',
      domain: 'tools-mcp',
      title: 'MCP in 90 seconds',
      minutes: 2,
      quick: `
        <p>The <strong>Model Context Protocol (MCP)</strong> is an open standard for connecting
        Claude to outside tools and data. An <em>MCP server</em> wraps a system (a database, an
        API, your email) and exposes three things: <strong>tools</strong> Claude can call,
        <strong>resources</strong> it can read, and <strong>prompts</strong> it can reuse.
        Claude discovers what a server offers at runtime — no hardcoding.</p>`,
      fromZero: `
        <p>Coming from Salesforce? Think of an MCP server like a <em>Named Credential plus an
        Apex callout wrapper</em> rolled into one reusable integration: it hides the messy
        connection details and presents a clean, discoverable interface. Instead of Salesforce
        calling out, though, it's Claude deciding <em>when</em> to use the integration based on
        your request.</p>`,
      examTwist: `
        <p>The exam rarely says "MCP." It describes a scenario — <em>"an agent needs live access
        to an internal inventory system through a standardized interface"</em> — and the options
        blur MCP with function calling, RAG, and fine-tuning. Cue to watch for:
        <strong>standardized/reusable interface to external systems</strong> → MCP. One-off
        function the model calls → tool use. Injecting documents into context → RAG.</p>`,
    },
    {
      id: 'tool-design-junior',
      domain: 'tools-mcp',
      title: 'Design tools for a bright junior colleague',
      minutes: 2,
      quick: `
        <p>The model only knows what your tool tells it. Good tools have a <strong>name that
        says what they do</strong>, a description that says <em>when to use them</em> (and when
        not to), few and unambiguous parameters, and outputs trimmed to what the next decision
        needs. One well-scoped tool beats three overlapping ones — overlap is where agents
        pick wrong.</p>`,
      fromZero: `
        <p>Write the tool description the way you'd brief a sharp new hire on a system they've
        never seen: what it's for, when to reach for it, what the fields mean. If two systems
        do nearly the same thing, you'd tell the hire which one wins — your descriptions must
        do the same.</p>`,
      examTwist: `
        <p>Cue: "the agent calls the wrong tool" or "passes bad parameters." The intended fix
        is almost always <strong>improve the tool interface</strong> — clearer descriptions,
        merged overlapping tools, tighter schemas — not scolding the model in the system
        prompt and not more examples.</p>`,
    },
    {
      id: 'tool-errors-teach',
      domain: 'tools-mcp',
      title: 'Error messages are prompts too',
      minutes: 2,
      quick: `
        <p>Whatever a tool returns — success or failure — becomes <strong>text the model reads
        and reasons over</strong>. "Error 400" teaches nothing; "date must be YYYY-MM-DD; you
        sent 14/08/2026" lets the agent fix itself on the next call. Design errors as
        instructions: say what went wrong, what valid looks like, and what to try instead.
        Make destructive operations idempotent so a confused retry can't double-fire.</p>`,
      fromZero: `
        <p>Same philosophy as a good validation rule message: "Close date must be in the
        current fiscal quarter" fixes the record; "FIELD_CUSTOM_VALIDATION_EXCEPTION" creates a
        support ticket. Agents are your fastest, most literal users — they act on exactly what
        the error says.</p>`,
      examTwist: `
        <p>Cue: "the agent gets stuck retrying a failing call." Look for the answer that
        <strong>improves the error surface</strong> (actionable message, recoverable design)
        over adding retries, raising limits, or prompt nagging — the exam loves testing that
        you treat tool output as part of the conversation.</p>`,
    },
    {
      id: 'retrieve-dont-stuff',
      domain: 'context',
      title: 'Retrieve, don\'t stuff',
      minutes: 2,
      quick: `
        <p>When the knowledge base outgrows the context window, the answer is
        <strong>retrieval</strong>: index the documents (typically as embeddings in a vector
        store), fetch only the passages relevant to the current question, and put those in
        context with citations. Stuffing everything in is slower, costlier, and buries the
        signal; retrieval scales with your corpus while the context stays lean.</p>`,
      fromZero: `
        <p>You don't attach the entire knowledge base to every case — you search it and quote
        the two articles that match. RAG (retrieval-augmented generation) is that reflex,
        automated: search first, then answer from what you found.</p>`,
      examTwist: `
        <p>Cue: "documentation is far larger than the context window" or "answers must cite
        current internal docs." Intended answer: retrieval/RAG. Classic distractors:
        fine-tuning (wrong — that bakes in stale knowledge, doesn't cite) and "use the model
        with the biggest window" (delays the problem, doesn't solve it).</p>`,
    },
    {
      id: 'compact-on-purpose',
      domain: 'context',
      title: 'Compaction: forgetting on purpose',
      minutes: 2,
      quick: `
        <p>Long sessions degrade because the window fills with stale turns and bulky tool
        output. <strong>Compaction</strong> fixes it: summarize the conversation so far, keep
        the goal, decisions, and recent state verbatim, and drop the rest. Do it proactively
        at boundaries (a subtask finishing) rather than waiting for the hard limit — what
        survives compaction is a design decision, not luck.</p>`,
      fromZero: `
        <p>It's the shift-change handoff: the outgoing nurse doesn't recite eight hours of
        events — they hand over a tight summary plus the current chart. The next shift works
        fine because the <em>right</em> things survived.</p>`,
      examTwist: `
        <p>Cue: "quality degrades as the conversation grows." Intended answer: summarize or
        compact the history (or hand off to a fresh context with a summary). Distractors:
        bigger model, higher temperature, more instructions — none address the filling
        window.</p>`,
    },
    {
      id: 'context-budget',
      domain: 'context',
      title: 'The context window is a budget',
      minutes: 2,
      quick: `
        <p>Everything Claude "sees" in a conversation — system prompt, history, tool results,
        your files — must fit one <strong>context window</strong>. It's a hard budget: when it
        runs low, something must be dropped, summarized, or compacted. Good agent design treats
        context as a resource to <em>spend deliberately</em>, not a bottomless log.</p>`,
      fromZero: `
        <p>Salesforce analogy: <em>governor limits</em>. You never design an Apex job assuming
        unlimited SOQL calls; you design around the ceiling. Same instinct here — long agent
        sessions need summarization, scoped retrieval, or sub-agents the way batch jobs need
        chunking.</p>`,
      examTwist: `
        <p>Watch for scenarios like <em>"the assistant's answers degrade in long support
        conversations."</em> The four options will all sound plausible (bigger model! more
        instructions!). The exam wants the <strong>context-management</strong> move:
        summarize/compact the history, or fetch only what's relevant instead of carrying
        everything forward.</p>`,
    },
  ],
};

/* Hero story + blocker waypoints (DIV-25) — Sangam's words, edited for length.
   Waypoints render inside the step they belong to (stepId), above the cards. */
window.CCAF_STORY = {
  hero: {
    lead: `I'm a Salesforce consultant with development experience. By the time CCA-F was
      announced I'd spent two years building outside my platform — OpenAI and Claude APIs
      from 2023, then Claude Code in the terminal, custom MCP servers, sales-report MCPs,
      agentic solutions wired into Google Chat and Teams, experiments with CrewAI and
      Cursor. I felt ready. I was also wrong about what the exam would be.`,
    why: `I didn't sit CCA-F to stay a developer. I still love building — but I wanted to
      understand a platform's <em>system</em>: how it operates, where its limits are, and
      how that differs from Salesforce's multitenant world. No other system mirrors
      Salesforce; each has its own architecture, tools, and conventions, and those are the
      things only an architect can teach a peer.`,
    result: `Scored <strong>977/1000</strong>. The real result was quieter than the number:
      the relief of seeing that it isn't <em>only</em> Salesforce I can build on — any system
      I can understand, I can build with Claude Code. That's what this guide is for. Whatever
      platform you're coming from, everyone starts in the same boat. This is a
      <strong>"you can do it"</strong> guide, not an "I did it" one.`,
  },
  waypoints: [
    {
      stepId: 'blueprint',
      title: 'Blocker 1 — "Are there enough good sources?"',
      body: `Less of a wall than I expected — the official courses were more than enough for the
        basics, and I ran a peer-group prep in two phases (Claude Code for building, then Claude
        Code for agentic work), teaching MCP sessions internally along the way. What no course
        gave me was the <strong>hands-on</strong>: build something real before you sit the exam.
        The blueprint tells you <em>what</em>; only building tells you <em>how it actually
        behaves</em>. That's why this guide has a Labs step and not just reading.`,
    },
    {
      stepId: 'reading',
      title: 'Blocker 2 — the mindset shift, and the day the questions changed',
      body: `Crossing from CRM thinking to agent-native architecture was the hardest part —
        and I hadn't been "prepping" at all; there was never a moment I thought "I'll take the
        exam." I'd just been building since 2023. That accidental practice was what made the
        concepts click. Then the exam itself moved the goalposts: <strong>the scenarios were
        framed nothing like where I'd come from</strong>. Every question was a situation, never
        a definition. The "how the exam twists this" lane on every card below exists because
        of that day.`,
    },
    {
      stepId: 'drills',
      title: 'Blocker 3 — the terminology and limitations wall',
      body: `Salesforce has one glossary; you memorize it once. Here you're not learning one
        system, you're building across many — MCP, the Agent SDK, context engineering, context
        loading, skills — and each brings its own vocabulary and its own limits that matter in
        practice. What made it stick was building with all of them: <em>Lumi</em>, my family
        co-pilot; <em>Nexus</em>, my chief of staff; <em>Sift</em>, an MCP server for my email;
        and <em>Sotto</em>, voice-AI dictation. I'm working to open-source all of them, with
        the learnings from building agentic AI along the way. That's my confession and my
        whole method: <strong>build, learn, and then you can crack CCA-F.</strong>`,
    },
  ],
};

/* Labs: build-it-yourself missions (DIV-28). Same card mechanics, different lanes:
   quick = the mission brief, lane 1 = outline, lane 2 = self-check.
   minutes here = rough build effort, not reading time. */
const MISSION_LANES = {
  zeroLabel: 'Mission outline',
  twistLabel: 'Self-check — can you answer these?',
  markLabels: ['Mark mission complete', '✓ Mission complete'],
};

/* Drills (DIV-29): original analogy-style questions written for this guide from
   the public blueprint's concepts. Scenario never names the concept; four close
   options; every option's explanation teaches the recognition cue.
   Shape: { id, domain, scenario, options: [{ text, explain }], correct } */
window.CCAF_DRILLS = [
  {
    id: 'q-loan-pipeline',
    domain: 'agentic',
    scenario: `A lending company processes thousands of applications daily. Every application goes through the same three stages: pull key fields from uploaded documents, check them against eligibility rules, and produce a draft decision letter. The team wants to add Claude to speed this up. What should they build?`,
    correct: 1,
    options: [
      { text: 'An autonomous agent with document, rules, and drafting tools that decides how to handle each application', explain: 'Tempting because "agent" sounds like the modern answer — but autonomy buys nothing here and costs predictability. The steps never vary.' },
      { text: 'A fixed three-stage pipeline of model calls with validation checks between stages', explain: 'Correct. When the steps are known in advance and repeated at volume, a deterministic workflow with gates is cheaper, faster, auditable, and easier to debug.' },
      { text: 'An orchestrator that spawns a subagent per application section', explain: 'Subagents solve context isolation and parallel exploration — neither is the bottleneck in a short, linear, per-document flow.' },
      { text: 'A single comprehensive prompt asking the model to do all three stages at once', explain: 'Loses the between-stage validation the business needs; one bad extraction silently corrupts the decision letter.' },
    ],
  },
  {
    id: 'q-forty-contracts',
    domain: 'agentic',
    scenario: `A compliance team must review 40 vendor contracts against a new data-privacy policy by Friday. Each contract can be reviewed independently, and leadership wants a one-page summary per contract plus an overall risk roll-up. Which architecture fits best?`,
    correct: 2,
    options: [
      { text: 'One long session reviewing contracts sequentially to maintain full awareness across all documents', explain: 'The context window fills long before contract 40; early findings degrade and the session slows. Cross-contract awareness isn\'t needed — reviews are independent.' },
      { text: 'A model with the largest available context window, loading all 40 contracts at once', explain: 'Even when everything technically fits, relevant details compete for attention and per-contract quality drops. Big windows delay the problem; they don\'t decompose it.' },
      { text: 'A lead agent dispatching one scoped review per contract, each returning a structured summary it rolls up', explain: 'Correct. Independent subtasks + parallel deadline + summaries-not-transcripts is the orchestrator/subagent signature.' },
      { text: 'Fine-tuning a model on the company\'s past contract reviews first', explain: 'Weeks of work for a Friday deadline, and it doesn\'t address the volume problem at all — a classic over-investment distractor.' },
    ],
  },
  {
    id: 'q-refund-gate',
    domain: 'agentic',
    scenario: `A support agent built on Claude can issue refunds through a tool. Company policy: refunds over $500 require manager sign-off. The compliance officer asks how the team will guarantee the policy holds. What's the right answer?`,
    correct: 0,
    options: [
      { text: 'An approval gate in the refund tool itself: amounts over $500 create a pending request a manager must confirm', explain: 'Correct. Policy that must hold 100% of the time belongs in a deterministic mechanism, not in model behavior. The tool boundary is where guarantees live.' },
      { text: 'A system-prompt rule: "Always ask for manager approval before refunds over $500"', explain: 'The instruction will usually be followed — and "usually" is exactly what a compliance officer cannot accept. Prompts are probabilistic.' },
      { text: 'Setting temperature to zero so the agent behaves consistently', explain: 'Temperature reduces randomness in wording, not judgment; a deterministic-sounding knob that guarantees nothing about policy.' },
      { text: 'Logging every refund to a dashboard reviewed weekly', explain: 'Detection after the fact, not prevention. Useful as a complement, never as the guarantee.' },
    ],
  },
  {
    id: 'q-convention-drift',
    domain: 'claude-code',
    scenario: `Developers on a team each use Claude Code on the same repository. Code style, test commands, and "never touch these generated files" rules keep getting applied inconsistently — each developer re-explains the project in their own words every session. What fixes this?`,
    correct: 3,
    options: [
      { text: 'A shared prompt template developers paste at the start of each session', explain: 'Closer — but paste-discipline decays, templates drift apart, and new hires don\'t know the template exists. It reinvents, badly, a built-in mechanism.' },
      { text: 'A wiki page documenting the conventions for developers to reference', explain: 'Documentation for humans that the agent never sees. The inconsistency is in what the agent is told, not what developers know.' },
      { text: 'Switching the team to a more capable model that infers conventions from the codebase', explain: 'Capability doesn\'t substitute for missing information — conventions like "which test command" are facts, not inferences.' },
      { text: 'A CLAUDE.md checked into the repository root with the commands, conventions, and hard rules', explain: 'Correct. Cross-session, cross-developer consistency is exactly what checked-in project memory is for: written once, loaded automatically for everyone.' },
    ],
  },
  {
    id: 'q-formatter-always',
    domain: 'claude-code',
    scenario: `A team requires that the code formatter runs after every file edit Claude Code makes — no exceptions, including when a session gets long and instructions fade. How should this be implemented?`,
    correct: 1,
    options: [
      { text: 'Add "always run the formatter after editing" to CLAUDE.md', explain: 'Right place for conventions, wrong tool for guarantees — instructions are followed probabilistically, and long-session fade is named in the scenario as the enemy.' },
      { text: 'A PostToolUse hook that runs the formatter automatically after edit operations', explain: 'Correct. Hooks execute deterministically on events regardless of conversation state. "No exceptions" is the cue for a mechanism, not a request.' },
      { text: 'A skill the developer invokes to format the codebase on demand', explain: 'Skills are on-demand procedures — this need is automatic and per-edit. Wrong invocation model.' },
      { text: 'Rely on code review to catch unformatted files before merge', explain: 'Human backstop, not enforcement — it catches the failure after the fact and burns reviewer time on what a machine guarantees for free.' },
    ],
  },
  {
    id: 'q-inventory-json',
    domain: 'prompting',
    scenario: `Claude's responses feed directly into an inventory system that expects a specific JSON shape. In production, roughly one response in fifty fails to parse — an apology sentence before the JSON, a missing field, a stray trailing comma. What's the robust fix?`,
    correct: 2,
    options: [
      { text: 'Strengthen the prompt: "Respond ONLY with valid JSON, no other text"', explain: 'Improves the odds, guarantees nothing — you\'d be tuning the failure rate, not eliminating the failure class.' },
      { text: 'Add few-shot examples of correctly formatted responses', explain: 'The strongest distractor — examples genuinely help format adherence, but "help" isn\'t "enforce," and the downstream system needs enforcement.' },
      { text: 'Enforce the shape with the API\'s structured-output/schema mechanism and validate before consuming', explain: 'Correct. When output feeds code, the schema is a contract to enforce at the API layer, with validation as the safety net — not a style preference to request.' },
      { text: 'Post-process responses with a regex that strips non-JSON text', explain: 'A brittle patch that fights symptoms one at a time; the missing-field case sails right through.' },
    ],
  },
  {
    id: 'q-disclaimer-habit',
    domain: 'prompting',
    scenario: `Across hundreds of separate conversations, an internal assistant keeps opening answers with a long legal-style disclaimer that users find annoying. Individual users tell it to stop and it does — until the next conversation starts. Where is the actual problem?`,
    correct: 0,
    options: [
      { text: 'In the system prompt — the recurring behavior should be corrected once, at the level every conversation inherits', explain: 'Correct. A behavior that repeats across conversations is systemic; per-conversation correction can\'t stick because each conversation starts from the same contract.' },
      { text: 'In user training — teach users to set preferences at the start of each conversation', explain: 'Pushes the cost of a one-line fix onto every user, forever. If everyone must say it, it belongs upstream.' },
      { text: 'In sampling parameters — lower the temperature for less verbose behavior', explain: 'Temperature shapes variability, not policy. The disclaimer isn\'t randomness; it\'s instruction-driven behavior.' },
      { text: 'In the model choice — a more advanced model would judge tone better', explain: 'The model is doing what its standing instructions produce. Swapping models without fixing the contract carries the problem along.' },
    ],
  },
  {
    id: 'q-two-tools',
    domain: 'tools-mcp',
    scenario: `An order-support agent has two tools: search_orders and get_order_details. It frequently calls search_orders with an order ID it already has, gets a clumsy result, then calls get_order_details anyway. What should the team fix first?`,
    correct: 1,
    options: [
      { text: 'Add a system-prompt rule listing when to use each tool', explain: 'Works around the real defect and adds standing context cost. Tool-selection knowledge belongs on the tools, where every future prompt benefits.' },
      { text: 'Rewrite the tool descriptions to state exactly when each applies — "use when you already have an order ID" vs "use to find orders by customer or date"', explain: 'Correct. The model selects tools by reading their interfaces; overlapping or vague descriptions are an interface bug. Fix the tools, not the scolding.' },
      { text: 'Remove search_orders so the agent can\'t pick wrong', explain: 'Destroys a capability that\'s needed when there is no ID yet. Amputation isn\'t disambiguation.' },
      { text: 'Add few-shot examples of correct tool-call sequences', explain: 'Patches common paths while leaving the ambiguity for every uncovered case — and spends prompt budget on what a one-line description fixes.' },
    ],
  },
  {
    id: 'q-org-integrations',
    domain: 'tools-mcp',
    scenario: `A company runs several Claude-based applications on different teams. Each needs access to the same internal systems — the wiki, the customer database, the ticket tracker. Today every team hand-writes its own integration code for each system. Engineering leadership wants this rationalized. What's the intended approach?`,
    correct: 3,
    options: [
      { text: 'A shared library of function-calling definitions each app imports', explain: 'Better than copy-paste, but still couples every app to one codebase and language, and offers no runtime discovery — a half-step toward the real answer.' },
      { text: 'A retrieval pipeline embedding all three systems\' content into one vector store', explain: 'Retrieval serves knowledge lookup; it can\'t create tickets or update records. The scenario needs actions, not just answers.' },
      { text: 'Fine-tuning a shared model on each internal system\'s API documentation', explain: 'Bakes stale API knowledge into weights and still doesn\'t give the model a way to actually call anything.' },
      { text: 'Standing up one MCP server per internal system, which every team\'s app connects to', explain: 'Correct. "Many apps × shared systems × standardized, discoverable interface" is the MCP signature — integrations written once, discovered at runtime by any client.' },
    ],
  },
  {
    id: 'q-forgotten-constraints',
    domain: 'context',
    scenario: `A troubleshooting assistant handles long support sessions. Around turn 60, users notice it re-suggests steps that already failed and forgets constraints stated early on ("customer is on the legacy plan"). What's the intended remedy?`,
    correct: 2,
    options: [
      { text: 'Move to the model with the largest context window available', explain: 'Postpones the cliff and doesn\'t fix attention dilution — the failed-steps list still drowns in accumulated transcript.' },
      { text: 'Add a system-prompt instruction: "Remember all constraints mentioned earlier in the conversation"', explain: 'Instructions can\'t recover signal buried under sixty turns of noise; this treats a budget problem as an obedience problem.' },
      { text: 'Periodically compact the conversation: summarize history, carrying forward constraints, failed steps, and current state', explain: 'Correct. Long-session degradation is a context-budget problem; deliberate summarization keeps the load-bearing facts in view and drops the noise.' },
      { text: 'Restart the conversation fresh whenever quality drops', explain: 'Fixes degradation by destroying the very constraints and history the user needs kept — the summary-less version of the right answer.' },
    ],
  },
  {
    id: 'q-policy-corpus',
    domain: 'context',
    scenario: `An HR assistant must answer questions from a 10,000-page, frequently-updated policy library, and every answer must cite the current policy section it came from. What's the right architecture?`,
    correct: 1,
    options: [
      { text: 'Load the complete policy library into the context window with each question', explain: 'Far beyond any window — and even if it fit, cost and attention dilution make it the wrong scaling story. Size cues retrieval.' },
      { text: 'Index the library for retrieval and fetch the relevant sections into context per question, citing what was fetched', explain: 'Correct. Corpus ≫ window + freshness + citations is the retrieval signature: fetch only what\'s relevant, from the current version, with provenance built in.' },
      { text: 'Fine-tune a model on the policy library so it answers from learned knowledge', explain: 'Frozen at training time (the library updates constantly) and can\'t cite sections — it fails both stated requirements at once.' },
      { text: 'Split the library across several parallel sessions and route questions to the right one', explain: 'A hand-rolled, coarser retrieval system with routing as a new failure mode — recognizable as effort spent avoiding the standard answer.' },
    ],
  },
];

/* Mock step (DIV-30): three original sample questions to set expectations —
   deliberately on concepts the Drills step did NOT cover (batch processing,
   prompt caching, model selection), so learners feel the exam's breadth —
   plus a curated panel of external full-length mocks (linked, never copied). */
window.CCAF_MOCK_SAMPLES = [
  {
    id: 'm-nightly-tickets',
    domain: 'context',
    scenario: `An operations team wants Claude to summarize all ~10,000 support tickets from the previous day, every night, for a morning report. Nobody reads results in real time, and finance is watching API spend closely. Which approach fits?`,
    correct: 2,
    options: [
      { text: 'Stream each summary as tickets arrive during the day for immediate availability', explain: 'Real-time machinery for a report nobody reads until morning — you\'d pay latency-optimized prices for zero benefit.' },
      { text: 'A loop calling the standard API for each ticket overnight with retry logic', explain: 'Works, but you\'re hand-building queueing, retries, and rate-limit management that the platform already offers — at a higher per-token price.' },
      { text: 'Submit the day\'s tickets as one batch-processing job and collect results when it completes', explain: 'Correct. Large volume + no latency requirement + cost pressure is the batch API signature: managed processing at a significant discount, results within the batch window.' },
      { text: 'Cache a summarization prompt so each ticket call reuses the cached prefix', explain: 'The strongest distractor — caching does cut cost on the shared prefix, but it optimizes each call rather than matching the workload\'s shape; it also combines with, not substitutes for, batching.' },
    ],
  },
  {
    id: 'm-shared-prefix',
    domain: 'prompting',
    scenario: `A customer-facing assistant sends the same 30-page product manual and instruction block with every single request — thousands of times an hour. Answer quality is good, but token costs are painful and time-to-first-token feels slow. What should the team reach for first?`,
    correct: 0,
    options: [
      { text: 'Prompt caching, so the unchanging manual-plus-instructions prefix is processed once and reused across requests', explain: 'Correct. A large, stable prefix repeated at high frequency is the caching signature — big cost and latency savings with zero quality change.' },
      { text: 'Trim the manual down to a short summary to shrink every request', explain: 'Saves tokens by sacrificing the very context that makes answers good — the scenario says quality is fine; don\'t trade it away first.' },
      { text: 'Fine-tune a model on the manual so it doesn\'t need to be sent at all', explain: 'Expensive, slow to update when the manual changes, and unnecessary when the repeated-prefix problem has a purpose-built solution.' },
      { text: 'Move the manual into a vector store and retrieve relevant sections per question', explain: 'Plausible for a huge corpus — but 30 pages fits comfortably, retrieval adds a failure mode, and the pain named is cost/latency, not relevance.' },
    ],
  },
  {
    id: 'm-triage-model',
    domain: 'agentic',
    scenario: `A team is building a router that labels incoming messages with one of six categories before passing them on. Volume is very high, latency must stay low, and the labels are simple. Separately, a second system writes in-depth architecture reviews. How should models be assigned?`,
    correct: 1,
    options: [
      { text: 'Use the most capable model for both — quality is always worth it', explain: 'Overpays massively on the high-volume simple task and adds latency where it hurts most. Capability should follow task difficulty, not brand loyalty.' },
      { text: 'A fast, small model for the classification router; a highly capable model for the architecture reviews', explain: 'Correct. Match model tier to task complexity: simple high-volume labeling wants speed and cost-efficiency; deep reasoning earns the premium model.' },
      { text: 'A small model for both, with better prompts closing the quality gap on reviews', explain: 'Prompting lifts a model within its class, but complex multi-constraint reasoning is exactly where tier differences are real.' },
      { text: 'Fine-tune one mid-tier model to handle both workloads', explain: 'One more fine-tuning-as-hammer distractor: cost and maintenance without matching either workload\'s actual need.' },
    ],
  },
];

window.CCAF_MOCK_LINKS = [
  {
    name: 'hamzafarooq — interactive practice exam',
    url: 'https://github.com/hamzafarooq/claude-certified-architect',
    note: '64 questions in your browser with instant explanations — closest feel to the drills here, at full length. (Open practice-exam.html from the repo.)',
  },
  {
    name: 'mominurr — timed mock exam',
    url: 'https://github.com/mominurr/cca-f-mock-exam',
    note: 'The full dress rehearsal: 60 questions on a 120-minute timer, mirroring the real format and pressure.',
  },
  {
    name: 'claudecertificationguide.com',
    url: 'https://claudecertificationguide.com/',
    note: 'The biggest free question volume — 250+ practice questions plus a full mock; good for grinding weak domains.',
  },
  {
    name: 'kamiimeteor — CCA-F dojo',
    url: 'https://github.com/kamiimeteor/cca-f-dojo',
    note: '163 questions, works offline — drill volume for commutes and flights.',
  },
];

window.CCAF_CARDS.labs = [
  {
    id: 'mission-mcp-server',
    minutes: 60,
    title: 'Mission 1 — Ship a minimal MCP server',
    quick: `
      <p><strong>Build the thing the exam keeps describing.</strong> Create a tiny MCP server
      that exposes one or two tools over your own data — a notes lookup, a "today's schedule"
      reader, anything real to you — and connect it to Claude Code. The moment you watch
      Claude discover your tools at runtime and choose when to call them, the MCP questions
      stop being abstract.</p>`,
    fromZero: `
      <p>1. Scaffold with an official MCP SDK (Python or TypeScript quickstart from the MCP
      docs).<br>
      2. Define one tool with a <em>deliberately good</em> name, description, and 1–2 typed
      parameters.<br>
      3. Register the server in Claude Code's MCP configuration and restart the session.<br>
      4. Ask a question that should trigger your tool — then one that shouldn't. Watch the
      choice happen.<br>
      5. Break it on purpose: blur the description ("does stuff with data") and see how tool
      selection degrades.</p>`,
    examTwist: `
      <p>What are the three things an MCP server can expose, and which did you use? Why does
      the tool <em>description</em> matter more than its implementation? What changed in
      Claude's behavior when you blurred it? If two servers exposed overlapping tools, how
      would you fix the ambiguity?</p>`,
    ...MISSION_LANES,
  },
  {
    id: 'mission-configure-project',
    minutes: 45,
    title: 'Mission 2 — Configure a project like you mean it',
    quick: `
      <p><strong>Turn a bare repo into a governed workspace.</strong> Take any project you own
      and give it the full Claude Code treatment: a CLAUDE.md with binding rules, one hook
      that deterministically blocks something, and one skill for a workflow you repeat. This
      is the 20% "Claude Code configuration" domain made muscle memory.</p>`,
    fromZero: `
      <p>1. Write a CLAUDE.md under one page: commands, conventions, two or three hard
      rules.<br>
      2. Add a PreToolUse hook that blocks an action you never want (e.g., editing a
      generated folder) — then try to make Claude do it anyway.<br>
      3. Package a repeated instruction set as a skill and invoke it.<br>
      4. Compare: which of your CLAUDE.md rules got followed <em>probabilistically</em>, and
      which did the hook enforce <em>absolutely</em>?</p>`,
    examTwist: `
      <p>Which layer would you use for "prefer small functions" versus "never commit to
      main"? Why is a one-page CLAUDE.md better than a ten-page one? When Claude ignored a
      soft rule, what was your fix — louder prose, or a mechanism?</p>`,
    ...MISSION_LANES,
  },
  {
    id: 'mission-subagent-fanout',
    minutes: 45,
    title: 'Mission 3 — Fan out with subagents',
    quick: `
      <p><strong>Feel why context isolation matters.</strong> Give Claude Code a genuinely
      wide task over a codebase — "audit every module for X" or "research these five
      questions" — and have it dispatch subagents. Then try the same task in one single
      context and compare quality, speed, and what got forgotten.</p>`,
    fromZero: `
      <p>1. Pick a task that fans out naturally (multi-file audit, multi-question
      research).<br>
      2. Run it with subagents; note how each returns a <em>summary</em>, not a
      transcript.<br>
      3. Re-run single-context; watch for drift, truncation, or forgotten early findings.<br>
      4. Deliberately over-split once — ten subagents for a two-file job — and feel the
      coordination tax.</p>`,
    examTwist: `
      <p>What information died at each handoff, and did it matter? At what task width did
      fan-out start beating one context? Why do orchestrators want summaries instead of full
      transcripts back? When was the over-split slower than no split?</p>`,
    ...MISSION_LANES,
  },
  {
    id: 'mission-context-cliff',
    minutes: 40,
    title: 'Mission 4 — Find the context cliff',
    quick: `
      <p><strong>Degrade a session on purpose, then rescue it.</strong> Work one long Claude
      Code session until answers get vague or early decisions get forgotten — then practice
      the rescue: compact the conversation into a tight summary and hand off to a fresh
      session that picks up seamlessly. You'll never fear long sessions again once you've
      done a clean handoff.</p>`,
    fromZero: `
      <p>1. Start a feature conversation and keep piling on: big file reads, verbose tool
      output, topic shifts.<br>
      2. Note the first symptom of degradation — what got forgotten first?<br>
      3. Ask for a handoff summary: goal, decisions made, current state, next steps.<br>
      4. Open a fresh session seeded only with that summary; continue the work.<br>
      5. Compare what survived your summary versus what you wish had.</p>`,
    examTwist: `
      <p>Which degraded first — instructions, early facts, or recent detail? What belongs
      verbatim in a compaction summary and what can be lossy? Why is compacting at a task
      boundary better than at the hard limit?</p>`,
    ...MISSION_LANES,
  },
  {
    id: 'mission-great-restructure',
    minutes: 90,
    title: 'Mission 5 — The great restructure',
    quick: `
      <p><strong>The judgment the exam actually tests.</strong> Take a messy small project
      (or deliberately mess one up) and have Claude Code plan and execute a structural
      revamp — reorganize files, extract modules, update imports. Your job isn't typing; it's
      <em>reviewing the plan, constraining the blast radius, and deciding what needs a
      gate</em>. This is architecture taste, practiced.</p>`,
    fromZero: `
      <p>1. Choose a project where restructuring is safe (or make a copy).<br>
      2. Ask for a restructure <em>plan first</em> — make Claude propose before touching
      anything.<br>
      3. Challenge one choice in the plan; make it defend or revise.<br>
      4. Execute in stages, reviewing diffs between stages; keep tests (or a smoke script)
      as your tripwire.<br>
      5. Afterward, write down which single constraint you'd gate with a hook in a team
      setting.</p>`,
    examTwist: `
      <p>What made you trust or reject the proposed plan? Which step would have been
      dangerous unstaged? If this ran unattended in CI, what permission boundaries and
      checks would you insist on? What's your personal tell now for "plan first" versus
      "just let it edit"?</p>`,
    ...MISSION_LANES,
  },
];
