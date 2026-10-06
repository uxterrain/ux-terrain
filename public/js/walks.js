window.UX_WALKS = {
  ground: {
    id: "ground",
    kicker: "Design systems",
    title: "The ground layer",
    blurb: "Five stations on how a system is held: tokens as bedrock, primitives as paths, and a trail that runs both ways between Figma and code.",
    readUrl: "systems.html",
    minutes: "4",
    stations: [
      {
        title: "The kit is not the ground",
        lede: "A library you flip through works when a person draws every screen. It fails the moment the interface is assembled later.",
        visual: "quote",
        quote: "We stop shipping a kit. We ship the ground the product stands on.",
        caption: "The claim this walk is built on.",
        tags: ["Tokens", "Primitives", "MCP"],
        say: "Greetings, I am Oslo. This walk is the ground layer — how UX Terrain holds a design system when the screen may not be drawn until later, by a second team, a pipeline, or an agent. A kit of parts used to be enough because a designer read the guidance. That habit does not survive runtime assembly. If a value is not named, it is sediment. If Figma and code can disagree, they will. Press Next and I will show you the three holds. Ask anything on this station if you want to linger.",
        asks: ["Why isn't a Figma library enough?", "Who is this walk for?"]
      },
      {
        title: "Three holds",
        lede: "Not new tools. A change in what the system is allowed to forget.",
        visual: "holds",
        caption: "Wiki to tokens. Handoff to two-way sync. Meeting to a check that fails.",
        tags: ["Decisions", "Trail", "Checks"],
        say: "Three holds, and they are the whole transformation. First, the decision lives in a named token, not a wiki paragraph someone has to remember. Second, the trail runs both ways — Figma and production share a map, kept honest through MCP, because a static redline washes out overnight. Third, a wrong composition fails a check instead of waiting for a review meeting that may never happen. Notice what sits under all three: a name both a designer and a machine can be held to. Ask about any hold, or press Next for the cut.",
        asks: ["What does two-way sync actually mean?", "What kind of check fails?"]
      },
      {
        title: "A cut through the system",
        lede: "Most libraries are a catalog with tokens at the back. We read them the other way — from the ground up.",
        visual: "cut",
        caption: "Most teams decorate the weather. The work is naming the bedrock.",
        tags: ["Sky", "Weather", "Paths", "Bedrock"],
        say: "This is a geological cut, not a org chart. Sky is the product — runtime UI, assembled later. Weather is patterns, recipes that may change. Paths are primitives: states, accessibility, what a card may contain. Bedrock is tokens, named once and shared by both files. Products should never have to invent new ground. If you only restyle the weather, the next surface will drift the same way. Next I will pull a core so you can see the difference between unnamed sediment and a logged sample.",
        asks: ["What belongs in bedrock versus weather?", "How do you start a cut on a live product?"]
      },
      {
        title: "What a core actually looks like",
        lede: "Pull a sample from a live admin surface and you can tell, immediately, whether the ground is named.",
        visual: "cores",
        caption: "Same product. Different honesty.",
        tags: ["Unlogged", "Logged", "Tokens"],
        say: "Left is an unlogged core. It still looks finished: that blue from last quarter, thirteen pixels or fourteen, a gap of seven or eleven or a bit more, a card that is also a panel. The code cannot be held to it. Right is logged: accent, type body, space three hundred, primitive card, text. Every band is a decision both files can answer to. Survey work is exactly this — find the unnamed sediment, then name only what that surface actually stands on. A short dictionary beats a theme file nobody uses. Next is the trail that keeps the core from drifting after you leave.",
        asks: ["How do you survey unnamed sediment?", "How many tokens should the first core have?"]
      },
      {
        title: "The trail that must run both ways",
        lede: "A handoff is a path that washes out overnight. The useful picture is a trail with cairns.",
        visual: "trail",
        caption: "Figma, a token cairn, production. MCP keeps the cairn stacked.",
        tags: ["Figma", "tokens.json", "Code", "MCP"],
        say: "Figma on one side, production on the other, tokens stacked in the middle like a cairn so neither walker gets lost. MCP is how we keep that cairn from being kicked over. Unnamed values leave the trail as drift. An engagement is four stakes: survey the drift on one surface, name the bedrock, cut ten primitives fully stated, then let weather in without the ground moving. We leave a map, not a dependency. That is the end of this walk. You can read the long page, ask a question, or take the M365 walk to see this thinking on a shipped admin surface.",
        asks: ["What are the four stakes?", "How does MCP keep Figma and code from forking?"]
      }
    ]
  },
  m365: {
    id: "m365",
    kicker: "Microsoft 365",
    title: "Performance Monitoring",
    blurb: "Five stations on a proactive admin surface: incident cards that change with the investigation, advisories people can act on, and impact you can scan under pressure.",
    readUrl: "work/performance-monitoring.html",
    minutes: "4",
    stations: [
      {
        title: "The job is context, not another dashboard",
        lede: "Service disruption in Microsoft 365 is rarely a single alert. Admins were bouncing between status pages, email, and tribal knowledge.",
        visual: "image",
        src: "images/work/hero-imac.png",
        alt: "Performance Monitoring on a desktop in the Microsoft 365 Admin Center",
        caption: "V1 overview: incidents and advisories in the console admins already live in.",
        tags: ["Shipped V1", "Admin Center", "M365 Creative Studio"],
        say: "Greetings, I am Oslo. This walk is Performance Monitoring — a tenant-facing surface in the Microsoft 365 Admin Center. The product problem was not a missing chart. Disruption is a moving mix of tenant issues, Microsoft-level incidents, and people who need a path while the investigation is still open. The job is faster root-cause context, and a response that changes as the incident changes. Designed with tenant and VIP research, then prototypes that were fully clickable so engineering and users reacted to a real flow. Press Next for the incident card, or ask how the work was owned.",
        asks: ["What did UX Terrain own on this product?", "Why not just add another status page?"]
      },
      {
        title: "Incident cards that change with the investigation",
        lede: "A card carries the problem, the impact, and the timestamp — then the actions change when the status changes.",
        visual: "image",
        src: "images/work/investigation-states.png",
        alt: "Incident investigation states including under investigation, false alarm, and service restored",
        caption: "Under Investigation offers False Alarm or Service Restored. Restored incidents let you add detail or move on.",
        tags: ["Adaptive cards", "AI impact", "States"],
        say: "The incident card is not a static summary. It morphs with investigation status. Under investigation you get False Alarm or Service Restored. Restored, you add detail or move on. Real-time description, AI-powered impact estimation, and precise timestamps sit on the card so an admin does not hunt a second tool for the recommendation. A dynamic newsfeed keeps the investigation current. That is confidence scaffolding for a non-deterministic system: the interface tells you what the machine thinks is happening, and gives you a low-friction override. Next: advisories, which split what you can fix from what you have to wait on.",
        asks: ["How does the card know which actions to show?", "What does the AI actually estimate?"]
      },
      {
        title: "Advisories people can act on",
        lede: "Tenant-level problems get steps. Microsoft-level incidents stay honest about repair work already in motion.",
        visual: "image",
        src: "images/work/impact-metrics.png",
        alt: "Impact metrics and notification setup for Performance Monitoring",
        caption: "Notifications across email, phone, and SMS, with severity and tenant filters so urgent issues actually interrupt.",
        tags: ["Advisories", "Tenant vs Microsoft", "Notifications"],
        say: "Advisories make active issues, impact, and the path to resolution visible in real time. If the problem is local to the tenant, the user gets steps they can take. If it is a Microsoft-level incident, the surface stays transparent about repair work already in motion — so people can fix what is theirs and wait with context when it is not. Notifications respect severity and tenant filters, across email, phone, and SMS, so urgent issues actually interrupt. The design principle is the same as the cards: do not dump status. Segment the action. Next is how duration and people-affected are read as one story instead of two widgets.",
        asks: ["How do you split tenant issues from Microsoft ones?", "How did you keep notifications from becoming noise?"]
      },
      {
        title: "Duration and impact, read as one story",
        lede: "User count and time in impact run as two lines. Enough to see pattern, not so much that an admin has to decode it under pressure.",
        visual: "image",
        src: "images/work/duration-chart.png",
        alt: "Line chart comparing user count and duration of impact over an incident window",
        caption: "Dual series: people affected and time in impact, designed to be scanned before it is studied.",
        tags: ["Dual series", "Scan first", "Color as meaning"],
        say: "Two lines, one story. People affected and duration of impact. Color separates the metrics. Hover reveals the point behind the number. It is a curated composition — enough to see pattern, not a telemetry dump. Under pressure, an admin should scan before they study. That is typography-and-color discipline applied to operations: just enough color to guide the eye, no decoration that competes with the incident. Historic timelines use the same idea later — red for incidents, blue for advisories, size for stacked scenarios. Next is Outlook, because some crashes never wait for the admin center to be opened.",
        asks: ["Why two lines instead of a table?", "How did you decide what to hide?"]
      },
      {
        title: "Outlook, where the crash already is",
        lede: "Proactive alerts stay inside a familiar client instead of asking admins to open yet another console.",
        visual: "image",
        src: "images/work/outlook.png",
        alt: "Outlook integration showing crash and performance signals",
        caption: "Built with the Outlook team: crash signals named in the place people already work.",
        tags: ["Outlook", "Crash signals", "Native, not bolted on"],
        say: "Built with the Outlook team, this flags crash scenarios and names the culprit in the place people already work. The monitoring surface can be excellent and still fail if the first signal lives in a console nobody has open. So the integration is native, not a guest badge. Prototypes were treated as the product: every state clickable, conditional copy, page transitions — so research and engineering reviewed the same artifact. That is the end of this walk. You can read the full case, ask a question, or take the ground layer walk to see the system thinking underneath surfaces like this.",
        asks: ["Why put the signal in Outlook?", "How were prototypes used in research?"]
      }
    ]
  }
};
