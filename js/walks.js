window.UX_WALKS = {
  "ground": {
    "id": "ground",
    "kicker": "Design systems",
    "title": "The ground layer",
    "blurb": "Five stations on shared tokens, component behavior, and maintaining the connection between Figma and code.",
    "readUrl": "systems.html",
    "minutes": "4",
    "stations": [
      {
        "title": "A shared foundation",
        "lede": "A design system should help teams make consistent decisions in Figma, in code, and as the product changes.",
        "visual": "quote",
        "quote": "A shared foundation, with room for the product to evolve.",
        "caption": "The goal of this approach.",
        "tags": [
          "Shared decisions",
          "Components",
          "Maintenance"
        ],
        "say": "Greetings, I am Oslo. The ground layer is a point of view on design systems: give designers, developers, and AI tools a shared foundation for making decisions. The proposed approach starts with one product surface, then defines its shared values, component behavior, and maintenance process. Press Next for the three things that support it, or ask about this foundation.",
        "asks": [
          "Why start with one surface?",
          "What should a team get from a design system?"
        ]
      },
      {
        "title": "Three things the system needs",
        "lede": "Shared decisions, a maintained connection to code, and a way to catch inconsistencies.",
        "visual": "holds",
        "caption": "Define tokens. Connect design and code. Choose practical checks.",
        "tags": [
          "Tokens",
          "Ownership",
          "Checks"
        ],
        "say": "First, give shared values meaningful names and map them between design and code. Second, agree how changes are published, reviewed, and resolved. Third, choose requirements that can be checked automatically and keep human review for decisions that need context. MCP can support an integration, but the workflow and ownership still need to be defined for the project. Press Next to see how the layers fit together.",
        "asks": [
          "Which checks can be automated?",
          "What does the team need to agree before connecting Figma and code?"
        ]
      },
      {
        "title": "How the layers fit together",
        "lede": "Tokens, components, patterns, and product screens each have a different job.",
        "visual": "cut",
        "caption": "The terrain diagram shows the dependencies between the layers.",
        "tags": [
          "Products",
          "Patterns",
          "Components",
          "Tokens"
        ],
        "say": "Read this terrain diagram from the foundation up. Tokens define shared values. Components give those values structure and behavior. Patterns combine components for recurring tasks, and product screens bring them together for a specific need. The terrain language is a visual guide to those relationships. Next is an illustrative comparison of ambiguous values and explicit definitions.",
        "asks": [
          "What belongs in a token rather than a component?",
          "When should a product need a new pattern?"
        ]
      },
      {
        "title": "Make the decisions explicit",
        "lede": "Compare ambiguous values with shared names and component rules.",
        "visual": "cores",
        "caption": "Illustrative examples of unspecified and defined values.",
        "tags": [
          "Values",
          "Names",
          "Behavior"
        ],
        "say": "These are illustrative examples. On the left, color, spacing, and component boundaries are still ambiguous. On the right, named values and rules give design and engineering a shared reference. This does not prove an automated pipeline has shipped; it explains the kind of definition that pipeline would need. Press Next for the proposed approach to maintaining that connection.",
        "asks": [
          "How do you choose useful token names?",
          "How do you handle an exception on a real product?"
        ]
      },
      {
        "title": "Keep design and code connected",
        "lede": "Shared definitions need a publishing process, review, and clear ownership.",
        "visual": "trail",
        "caption": "Figma, shared token definitions, and production code.",
        "tags": [
          "Figma",
          "Shared tokens",
          "Code",
          "Review"
        ],
        "say": "Shared token definitions connect the design file and production code, but the team also needs a way to publish changes, review differences, and resolve conflicts. The proposed engagement has four steps: compare one surface, define its tokens, specify the components and their states, and agree how to maintain them. The case studies show the product contexts behind this point of view; they do not demonstrate every step of this proposed workflow. You can read the full page or ask about a step.",
        "asks": [
          "Who should own a token change?",
          "What would the first engagement deliver?"
        ]
      }
    ]
  },
  "m365": {
    "id": "m365",
    "kicker": "Microsoft 365",
    "title": "Performance Monitoring",
    "blurb": "Five stations on a proactive admin surface: incident cards that change with the investigation, advisories people can act on, and impact you can scan under pressure.",
    "readUrl": "work/performance-monitoring.html",
    "minutes": "4",
    "stations": [
      {
        "title": "The job is context, not another dashboard",
        "lede": "Service disruption in Microsoft 365 is rarely a single alert. Admins were bouncing between status pages, email, and tribal knowledge.",
        "visual": "image",
        "src": "images/work/hero-imac.png",
        "alt": "Performance Monitoring on a desktop in the Microsoft 365 Admin Center",
        "caption": "V1 overview: incidents and advisories in the console admins already live in.",
        "tags": [
          "Shipped V1",
          "Admin Center",
          "M365 Creative Studio"
        ],
        "say": "Greetings, I am Oslo. Performance Monitoring is a tenant-facing experience in the Microsoft 365 Admin Center. The central design problem was how admins would use a recommendation during a day-to-day incident. Tenant and VIP research helped connect those recommendations to infrastructure context. Data visualization was another core contribution: impact charts and timelines made the monitoring information available for investigation. Press Next for the incident card, or ask about the work.",
        "asks": [
          "What did the product designer own?",
          "What information did an admin need during an open investigation?"
        ]
      },
      {
        "title": "Incident cards that change with the investigation",
        "lede": "A card carries the problem, the impact, and the timestamp — then the actions change when the status changes.",
        "visual": "image",
        "src": "images/work/investigation-states.png",
        "alt": "Incident investigation states including under investigation, false alarm, and service restored",
        "caption": "Under Investigation offers False Alarm or Service Restored. Restored incidents let you add detail or move on.",
        "tags": [
          "Adaptive cards",
          "AI impact",
          "States"
        ],
        "say": "The incident card keeps the description, impact estimate, timestamps, and investigation updates together. Machine learning used service and network signals, including Exchange, packet traffic, and data-loss information across Microsoft and third-party infrastructure, to inform estimates, predictions, and advisories. The design challenge was making those recommendations practical in the incident details. Actions change with investigation status. Press Next for the distinction between tenant actions and Microsoft repair updates.",
        "asks": [
          "How do the actions change with status?",
          "What is documented about the AI impact estimate?"
        ]
      },
      {
        "title": "Advisories people can act on",
        "lede": "Tenant-level problems get steps. Microsoft-level incidents stay honest about repair work already in motion.",
        "visual": "image",
        "src": "images/work/impact-metrics.png",
        "alt": "Impact metrics and notification setup for Performance Monitoring",
        "caption": "Notifications across email, phone, and SMS, with severity and tenant filters so urgent issues actually interrupt.",
        "tags": [
          "Advisories",
          "Tenant vs Microsoft",
          "Notifications"
        ],
        "say": "The advisory flow distinguishes who can take the next step. Tenant-level problems can include actions for the admin. Microsoft-level incidents show repair information to follow. Notification setup includes email, phone, and SMS with severity and tenant filters. The design brings responsibility and the next update into the same context. Press Next to see how the chart presents affected-user count and duration of impact.",
        "asks": [
          "How are tenant actions different from Microsoft repair updates?",
          "What notification controls are documented?"
        ]
      },
      {
        "title": "Duration and impact, read as one story",
        "lede": "User count and time in impact run as two lines. Enough to see pattern, not so much that an admin has to decode it under pressure.",
        "visual": "image",
        "src": "images/work/duration-chart.png",
        "alt": "Line chart comparing user count and duration of impact over an incident window",
        "caption": "Dual series: people affected and time in impact, designed to be scanned before it is studied.",
        "tags": [
          "Dual series",
          "Scan first",
          "Color as meaning"
        ],
        "say": "Data visualization was a core part of this work. The chart presents affected-user count and duration of impact as named series, with details on hover. Historic timelines give admins another view of the period, distinguishing incidents, advisories, and stacked scenarios. The qualitative outcome was more insight into affected infrastructure and a more practical path to remediation. The case does not publish a measured task-time improvement. Press Next for the Outlook collaboration.",
        "asks": [
          "What can an admin compare in the chart?",
          "How do the historic timelines complement the incident cards?"
        ]
      },
      {
        "title": "Outlook, where the crash already is",
        "lede": "Proactive alerts stay inside a familiar client instead of asking admins to open yet another console.",
        "visual": "image",
        "src": "images/work/outlook.png",
        "alt": "Outlook integration showing crash and performance signals",
        "caption": "Built with the Outlook team: crash signals named in the place people already work.",
        "tags": [
          "Outlook",
          "Crash signals",
          "Native, not bolted on"
        ],
        "say": "The Outlook collaboration brings crash and performance signals into the client experience. It extends the monitoring story beyond the Admin Center. The prototype work also connected investigation states, conditional copy, and page transitions so research participants and engineering partners could review a flow rather than only isolated screens. That is the end of this walk. You can read the full case, ask a question, or choose another walk.",
        "asks": [
          "What does the case document about Outlook?",
          "How were prototypes used in research and engineering reviews?"
        ]
      }
    ]
  }
};
