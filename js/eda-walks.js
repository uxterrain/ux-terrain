window.EDA_WALKS = {
  "floor": {
    "id": "floor",
    "kicker": "Accessibility",
    "title": "Accessibility foundations",
    "blurb": "Five short stops on standards, design targets, component behavior, and evidence.",
    "readUrl": "work/eda.html",
    "minutes": "3",
    "stations": [
      {
        "title": "Standards, goals, and evidence",
        "lede": "Separate a requirement, a design target, and a verified result.",
        "visual": "bands",
        "bands": [
          {
            "kicker": "Requirement",
            "title": "Section 508",
            "body": "Federal technology requirements and their scope."
          },
          {
            "kicker": "Design target",
            "title": "WCAG 2.2",
            "body": "Criteria to translate into design and test questions."
          },
          {
            "kicker": "Evidence",
            "title": "The interface",
            "body": "What inspection and testing actually establish."
          }
        ],
        "caption": "Separate a requirement, a design target, and a verified result.",
        "tags": [],
        "say": "Hi, I’m Eda. This introduction separates three things: an accessibility requirement, the target a team chooses, and evidence about a particular interface. They are related, but they do not answer the same question. We’ll start with Section 508, then look at WCAG and how a team brings those considerations into component design.",
        "asks": [
          "Why distinguish a target from a verified result?",
          "What can this walk help me understand?"
        ]
      },
      {
        "title": "Where Section 508 fits",
        "lede": "Understand the context for federal technology requirements.",
        "visual": "bands",
        "bands": [
          {
            "kicker": "Web content",
            "title": "WCAG 2.0 A and AA",
            "body": "Incorporated by the Revised Standards for covered content."
          },
          {
            "kicker": "Scope",
            "title": "More than web pages",
            "body": "Other technology and content can also be covered."
          },
          {
            "kicker": "Next step",
            "title": "Check applicability",
            "body": "Use the official standards for the project’s context."
          }
        ],
        "caption": "Understand the context for federal technology requirements.",
        "tags": [],
        "say": "Section 508 concerns information and communication technology used by federal agencies. The Revised Standards incorporate WCAG 2.0 Level A and AA criteria for covered web content, with additional scope and exceptions in the standards. The important first step is identifying which requirements apply to the project. Next is the WCAG target described by this practice.",
        "asks": [
          "What is Section 508’s role?",
          "Where can I find the official requirements?"
        ]
      },
      {
        "title": "Use WCAG as a design reference",
        "lede": "Translate relevant criteria into specific design and test questions.",
        "visual": "quote",
        "quote": "A design target becomes useful when it leads to specific questions and tests.",
        "caption": "Translate relevant criteria into specific design and test questions.",
        "tags": [],
        "say": "This practice names WCAG 2.2 as a design target. It includes criteria on areas such as focus visibility, target size, and alternatives to dragging. Those criteria need to be translated into specific checks for the interface. Naming a target alone does not tell us how a particular screen performs. Next, we’ll look at component behavior.",
        "asks": [
          "Which interaction questions does WCAG help frame?",
          "How do you connect a criterion to a test?"
        ]
      },
      {
        "title": "Define the component behavior",
        "lede": "Document states, labels, focus, and interaction expectations.",
        "visual": "bands",
        "bands": [
          {
            "kicker": "Define",
            "title": "States and labels",
            "body": "Describe what changes and how it is communicated."
          },
          {
            "kicker": "Interact",
            "title": "Keyboard and focus",
            "body": "Specify how people move through the component."
          },
          {
            "kicker": "Review",
            "title": "Checks and testing",
            "body": "Combine automation with contextual evaluation."
          }
        ],
        "caption": "Document states, labels, focus, and interaction expectations.",
        "tags": [],
        "say": "A component definition should cover its states, labels, interaction, and accessibility expectations. Some requirements can be checked automatically; others need people to try the interface in context. The goal is to make those responsibilities part of the design and engineering work. Next, we’ll look at the evidence a guide can use.",
        "asks": [
          "What should a component specification include?",
          "Which checks need human review?"
        ]
      },
      {
        "title": "Know what the evidence can support",
        "lede": "Distinguish a design explanation from an accessibility audit.",
        "visual": "quote",
        "quote": "Explain what is documented. Test what the screenshot cannot show.",
        "caption": "Distinguish a design explanation from an accessibility audit.",
        "tags": [],
        "say": "I can explain the written guidance and help identify questions to review on a case-study screen. A screenshot can show labels and visual hierarchy, but it cannot establish keyboard behavior or screen-reader output. Those require the working interface and appropriate testing. That completes the introduction. Choose a case-study walk to see how these questions connect to a design.",
        "asks": [
          "What can a screenshot tell us?",
          "What needs testing in the working product?"
        ]
      }
    ],
    "sources": [
      {
        "title": "U.S. Access Board: Revised 508 Standards",
        "url": "https://www.access-board.gov/ict/"
      },
      {
        "title": "W3C: WCAG 2.2",
        "url": "https://www.w3.org/TR/WCAG22/"
      }
    ]
  },
  "m365": {
    "id": "m365",
    "kicker": "Microsoft 365",
    "title": "Performance Monitoring",
    "blurb": "Five short stops on readable incident states, actions, notifications, charts, and timelines.",
    "readUrl": "work/performance-monitoring.html",
    "minutes": "2",
    "stations": [
      {
        "title": "Understand the incident",
        "anchor": "overview",
        "lede": "Help admins find the status, impact, and next action.",
        "visual": "image",
        "src": "images/work/hero-imac.png",
        "alt": "Performance Monitoring on a desktop in the Microsoft 365 Admin Center",
        "caption": "Help admins find the status, impact, and next action.",
        "tags": [],
        "say": "Hi, I’m Eda. An admin needs to understand an incident while the investigation is still developing. This overview brings status, impact, and next steps into one place. We’ll look at the labels and interaction choices that support that task, starting with the incident card.",
        "asks": [
          "What should an admin find first?",
          "How can hierarchy help during an incident?"
        ]
      },
      {
        "title": "Name the investigation state",
        "anchor": "cards",
        "lede": "Keep the status and available actions understandable.",
        "visual": "image",
        "src": "images/work/investigation-states.png",
        "alt": "Incident investigation states including under investigation, false alarm, and service restored",
        "caption": "Keep the status and available actions understandable.",
        "tags": [],
        "say": "The card names the investigation state and changes the available actions with it. Labels such as Under Investigation and Service Restored give admins a direct description of what is happening. Naming the state helps, but the interaction still needs testing for keyboard access, focus, and updates. Next, we’ll look at the advisory information.",
        "asks": [
          "How do the labels help explain the state?",
          "What needs checking when the state changes?"
        ]
      },
      {
        "title": "Explain who can take action",
        "anchor": "path",
        "lede": "Distinguish tenant steps from Microsoft repair updates.",
        "visual": "image",
        "src": "images/work/outlook.png",
        "alt": "Advisory overview and detail panel with impact and recommended action",
        "caption": "Distinguish tenant steps from Microsoft repair updates.",
        "tags": [],
        "say": "The advisory flow separates steps the tenant can take from repair information supplied by Microsoft. That distinction helps an admin understand their responsibility and what to follow next. Notification preferences also need clear labels and feedback, so choosing a channel or severity does not depend on interpreting an icon. Next is the impact chart.",
        "asks": [
          "Why separate tenant actions from repair updates?",
          "What makes notification preferences easier to understand?"
        ]
      },
      {
        "title": "Make the chart usable beyond color",
        "anchor": "chart",
        "lede": "Identify the measures and provide access to point details.",
        "visual": "image",
        "src": "images/work/duration-chart.png",
        "alt": "Line chart comparing user count and duration of impact over an incident window",
        "caption": "Identify the measures and provide access to point details.",
        "tags": [],
        "say": "The chart names affected-user count and duration of impact. Those names help explain the measures, but we still need to check whether people can distinguish the lines without relying on color and reach point details without a mouse. The case describes hover details; it does not establish the keyboard behavior. Next is the historic timeline.",
        "asks": [
          "How could someone distinguish the series without color?",
          "What would you check about the point details?"
        ]
      },
      {
        "title": "Keep the timeline understandable",
        "anchor": "week",
        "lede": "Give incident categories and grouped events clear meaning.",
        "visual": "image",
        "src": "images/work/historic-overview.png",
        "alt": "Historical timeline of incidents and advisories",
        "caption": "Give incident categories and grouped events clear meaning.",
        "tags": [],
        "say": "The timeline distinguishes incidents from advisories and uses larger marks for stacked scenarios. The review question is whether someone can identify the category and understand the group without relying only on color or size. Clear labels and access to the underlying details matter here. That completes this walk. You can ask about the timeline or revisit another station.",
        "asks": [
          "What should a grouped event communicate?",
          "What would you test without relying on color?"
        ]
      }
    ]
  },
  "zone": {
    "id": "zone",
    "kicker": "Flotrak",
    "title": "Flotrak",
    "blurb": "Four short stops on readable guidance, metering points, connection status, and frame records.",
    "readUrl": "work/zone-focus.html",
    "minutes": "2",
    "stations": [
      {
        "title": "Explain the next adjustment",
        "anchor": "coach",
        "lede": "Pair a reading with an instruction the photographer can act on.",
        "visual": "image",
        "src": "images/work/zone/coach.png",
        "alt": "Standard mode with aperture 2.8, shutter 1/8000, Portra 400, and the written coach line",
        "caption": "Pair a reading with an instruction the photographer can act on.",
        "tags": [],
        "say": "Hi, I’m Eda. Flotrak is about learning what your camera settings do. Here, Coach turns a bright-scene reading into a suggestion: use a smaller aperture. That gives a beginner something to try, rather than just another number to interpret. I’d check whether they can find the advice, understand it, and make the adjustment themselves.",
        "asks": [
          "Why place the guidance next to the reading?",
          "What would you check with a beginner?"
        ]
      },
      {
        "title": "Give the points clear labels",
        "anchor": "viewfinder",
        "lede": "Connect the focus wedge, distance labels, and metering points.",
        "visual": "image",
        "src": "images/work/zone/viewfinder.png",
        "alt": "Advanced ambient viewfinder with horizon, wedge distances, and spots labeled A and B",
        "caption": "Connect the focus wedge, distance labels, and metering points.",
        "tags": [],
        "say": "Here, the wedge helps you picture distance, while A and B mark the two metering points. The challenge is making that relationship easy to understand while you’re taking a photo. I’d ask a beginner to explain what the points mean, then try adjusting them. Could they do it comfortably without dragging a tiny target?",
        "asks": [
          "What do A and B help explain?",
          "How could someone use this without precise dragging?"
        ]
      },
      {
        "title": "Make connection status readable",
        "anchor": "flash",
        "lede": "Keep the connection state and flash controls understandable together.",
        "visual": "image",
        "src": "images/work/zone/flash.png",
        "alt": "Flash deck with the Godox link written as connected, output, proximity, and group bias",
        "caption": "Keep the connection state and flash controls understandable together.",
        "tags": [],
        "say": "Before adjusting a flash, you need to know whether it’s connected. This concept shows that with a written label beside the status mark, so the dot doesn’t have to explain everything. I’d test what happens when the connection drops: can you tell what changed and which controls are still available?",
        "asks": [
          "Why pair a status mark with words?",
          "What should happen when the connection changes?"
        ]
      },
      {
        "title": "Keep the frame details organized",
        "anchor": "archive",
        "lede": "Group settings and notes under a named film roll.",
        "visual": "image",
        "src": "images/work/zone/archive.png",
        "alt": "Archive ledger with expanded rolls and labeled frame cells",
        "caption": "Group settings and notes under a named film roll.",
        "tags": [],
        "say": "After developing a roll, you’ll want to connect each photo with the choices you made. This archive concept keeps those notes and settings together by roll. I’d check how easily someone can find a particular frame and read its details, including with a keyboard or screen reader.",
        "asks": [
          "Why group the details by roll?",
          "What would you test in the working archive?"
        ]
      }
    ]
  },
  "armada": {
    "id": "armada",
    "kicker": "Atlas — Fleet Map",
    "title": "Atlas — Fleet Map",
    "readUrl": "work/armada.html",
    "blurb": "Four stops on fleet context, equipment status, incident indicators, and the live panel.",
    "minutes": "2",
    "stations": [
      {
        "title": "Identify the selected flight",
        "anchor": "overview",
        "lede": "Connect the selected drone to a recognizable route and record.",
        "caption": "Connect the selected drone to a recognizable route and record.",
        "tags": [],
        "say": "Hi, I’m Eda. A fleet map asks people to understand several moving objects at once. This view keeps a selected drone alongside the wider set of routes. The key review question is how someone identifies that selection and reaches its details, including without precise pointer use. Next, we’ll look at the equipment view.",
        "asks": [
          "How should a selected drone be identified?",
          "What would you check without a mouse?"
        ],
        "visual": "image",
        "src": "images/work/armada/fleet-paths.png",
        "alt": "Identify the selected flight — case-study illustration"
      },
      {
        "title": "Explain equipment status",
        "anchor": "hangar",
        "lede": "Keep device names, status, and alerts understandable.",
        "caption": "Keep device names, status, and alerts understandable.",
        "tags": [],
        "say": "The inventory view brings drones, docks, and controllers together with status and alerts. Names and written status information give people something to refer to beyond the device image. A useful check is whether the same status stays understandable in a list, an alert, and the selected record. Next is the incident on the map.",
        "asks": [
          "Why keep names beside device images?",
          "What should remain consistent across status views?"
        ],
        "visual": "image",
        "src": "images/work/armada/inventory.png",
        "alt": "Explain equipment status — case-study illustration"
      },
      {
        "title": "Connect an incident to its details",
        "anchor": "pin",
        "lede": "Keep the location, selected drone, and incident context together.",
        "caption": "Keep the location, selected drone, and incident context together.",
        "tags": [],
        "say": "An incident marker is a starting point for a review, not the whole explanation. Here, the map and selected-drone details share the workspace. The next check is whether the marker has an understandable identity and its details can be opened and dismissed predictably. Next, we’ll look at the live panel.",
        "asks": [
          "What should an incident marker communicate?",
          "How should someone move between the marker and details?"
        ],
        "visual": "image",
        "src": "images/work/armada/fleet-map.png",
        "alt": "Connect an incident to its details — case-study illustration"
      },
      {
        "title": "Keep live information understandable",
        "anchor": "feed",
        "lede": "Connect the camera view with mechanical and mission status.",
        "caption": "Connect the camera view with mechanical and mission status.",
        "tags": [],
        "say": "The panel connects the drone’s camera view with the route and live status information. Keeping those together helps preserve context. A working-product review would also check how updates are communicated and which important incident details are available outside the video. That completes the Atlas walk.",
        "asks": [
          "What context should remain beside the video?",
          "What would you test about live updates?"
        ],
        "visual": "image",
        "src": "images/work/armada/live-view.png",
        "alt": "Keep live information understandable — case-study illustration"
      }
    ]
  },
  "sbi": {
    "id": "sbi",
    "kicker": "SBI",
    "title": "SBI",
    "readUrl": "work/sbi.html",
    "blurb": "Four stops on forecast context, inventory decisions, filters, and map details.",
    "minutes": "2",
    "stations": [
      {
        "title": "Explain the forecast",
        "anchor": "overview",
        "lede": "Keep model information and data gaps near the forecast.",
        "caption": "Keep model information and data gaps near the forecast.",
        "tags": [],
        "say": "Hi, I’m Eda. SBI’s executives and sales stakeholders needed to understand a forecast before using it in an inventory decision. The model-summary view provides a place for its supporting information and data gaps. The review question is whether those qualifications are easy to find and understand alongside the result. Next, we’ll look at the business measures.",
        "asks": [
          "Why keep data gaps near a forecast?",
          "What would you check in a model-summary panel?"
        ],
        "visual": "image",
        "src": "images/work/sbi-hero.png",
        "alt": "Explain the forecast — case-study illustration"
      },
      {
        "title": "Give each measure a clear meaning",
        "anchor": "gap",
        "lede": "Connect the forecast with inventory and financial information.",
        "caption": "Connect the forecast with inventory and financial information.",
        "tags": [],
        "say": "The dashboard brings forecast inventory gaps together with stock and financial measures. Each number needs a clear name and context so people can compare the right things. A useful review would check units, chart descriptions, and how detail views connect to the overview. Next are the filters.",
        "asks": [
          "What context should accompany a forecast number?",
          "How should a detail view connect to its overview?"
        ],
        "visual": "image",
        "src": "images/work/sbi-insights.png",
        "alt": "Give each measure a clear meaning — case-study illustration"
      },
      {
        "title": "Explain a filter’s effect",
        "anchor": "filters",
        "lede": "Make dependent selections and resulting changes understandable.",
        "caption": "Make dependent selections and resulting changes understandable.",
        "tags": [],
        "say": "These filters explain how a scenario depends on its inputs. Tougher soil and faster drill-bit wear make the business question concrete: could replacement parts be needed sooner? The original diagram maps drilling conditions to supporting data and a measurement. I’d check whether someone can identify the selected conditions, understand added inputs, and change the scenario. Next is the map.",
        "asks": [
          "What should happen when a filter adds another input?",
          "How could a user review or undo a selection?"
        ],
        "visual": "image",
        "src": "images/work/sbi-08.png",
        "alt": "Explain a filter’s effect — case-study illustration"
      },
      {
        "title": "Make map details reachable",
        "anchor": "rig",
        "lede": "Keep location context connected to a readable record.",
        "caption": "Keep location context connected to a readable record.",
        "tags": [],
        "say": "The map brings location and drilling activity alongside well details. The useful accessibility question is whether a person can find the same important information through a readable record, not only through a map marker. The map can provide context while the details carry names and values. That completes the SBI walk.",
        "asks": [
          "What should a map record include?",
          "What would you check without using the map directly?"
        ],
        "visual": "image",
        "src": "images/work/sbi-13.png",
        "alt": "Make map details reachable — case-study illustration"
      }
    ]
  },
  "iqvia": {
    "id": "iqvia",
    "kicker": "IQVIA ePromo",
    "title": "IQVIA ePromo",
    "readUrl": "work/iqvia.html",
    "blurb": "Three stops on role-based navigation, document creation, and review comments.",
    "minutes": "2",
    "stations": [
      {
        "title": "Give each role a clear starting point",
        "anchor": "roles",
        "lede": "Help people recognize the tasks relevant to their role.",
        "caption": "Help people recognize the tasks relevant to their role.",
        "tags": [],
        "say": "Hi, I’m Eda. ePromo brings several roles into one review process. The role-based dashboard exploration gives each group a more relevant starting point. The key question is whether people can recognize where they are and find their next task without learning the whole platform first. Next is document creation.",
        "asks": [
          "How can a role-specific dashboard reduce confusion?",
          "What should navigation make clear?"
        ],
        "visual": "image",
        "src": "images/work/iqvia/iqvia-03.png",
        "alt": "Give each role a clear starting point — case-study illustration"
      },
      {
        "title": "Explain the next step",
        "anchor": "create",
        "lede": "Break document creation into understandable stages.",
        "caption": "Break document creation into understandable stages.",
        "tags": [],
        "say": "The creation flow separates identification, categorization, and content details. A progress indicator helps explain where the user is in that sequence. In the working product, I’d check field instructions, validation messages, and how someone returns to correct an earlier step. Next, we’ll look at the review conversation.",
        "asks": [
          "What makes a multi-step form easier to follow?",
          "What would you check when a field has an error?"
        ],
        "visual": "image",
        "src": "images/work/iqvia/iqvia-09.png",
        "alt": "Explain the next step — case-study illustration"
      },
      {
        "title": "Keep comments connected to the content",
        "anchor": "review",
        "lede": "Give annotations a clear relationship to the document.",
        "caption": "Give annotations a clear relationship to the document.",
        "tags": [],
        "say": "Comments and replies appear beside the content being reviewed. That relationship helps people understand what a discussion refers to. The interaction review should check how a person moves between an annotation and its content, and how author, time, and review status are communicated. That completes the ePromo walk.",
        "asks": [
          "How should an annotation identify its target?",
          "What would you check about moving between comments and content?"
        ],
        "visual": "image",
        "src": "images/work/iqvia/iqvia-14.png",
        "alt": "Keep comments connected to the content — case-study illustration"
      }
    ]
  },
  "oslo": {
    "id": "oslo",
    "kicker": "Oslo",
    "title": "Oslo",
    "readUrl": "work/oslo.html",
    "blurb": "Three stops on choosing a walk, understanding answers, and controlling the pace.",
    "minutes": "2",
    "stations": [
      {
        "title": "Explain the route before it starts",
        "anchor": "picker",
        "lede": "Let visitors understand what a walkthrough offers.",
        "caption": "Let visitors understand what a walkthrough offers.",
        "tags": [],
        "say": "Hi, I’m Eda. Oslo gives visitors a choice between a guided walk and an open question. The picker introduces each walk before it starts. A useful review checks whether the choices communicate their subject and whether the same options are reachable by keyboard. Next, we’ll look at the answer categories.",
        "asks": [
          "What should a walk choice tell the visitor?",
          "What would you check about keyboard selection?"
        ],
        "visual": "image",
        "src": "images/work/oslo/picker.png",
        "alt": "Explain the route before it starts — case-study illustration"
      },
      {
        "title": "Make the answer’s status clear",
        "anchor": "answers",
        "lede": "Distinguish evidence, interpretation, and missing information.",
        "caption": "Distinguish evidence, interpretation, and missing information.",
        "tags": [],
        "say": "Oslo’s answer design names documented facts, interpretations, and gaps. Those written categories help people understand how to read a response. Evidence links provide a next step. The working interface still needs checking for how replies and waiting states are announced, and whether each link has a useful name. Next is visitor control.",
        "asks": [
          "Why label interpretation separately from evidence?",
          "What would you check when a reply arrives?"
        ],
        "visual": "quote",
        "quote": "An answer needs understandable status and useful next steps."
      },
      {
        "title": "Let the visitor set the pace",
        "anchor": "station",
        "lede": "Keep questions and navigation available as separate choices.",
        "caption": "Keep questions and navigation available as separate choices.",
        "tags": [],
        "say": "A station presents a visual and a short explanation, with questions and navigation nearby. Next belongs to the visitor. A useful interaction check covers the focus order, the current-station indication, and what happens to focus when someone moves or closes the guide. That completes the Oslo walk.",
        "asks": [
          "Why should Next stay under visitor control?",
          "Where should focus go after a station changes?"
        ],
        "visual": "image",
        "src": "images/work/oslo/station.png",
        "alt": "Let the visitor set the pace — case-study illustration"
      }
    ]
  },
  "eda": {
    "id": "eda",
    "kicker": "Eda",
    "title": "Eda",
    "readUrl": "work/eda.html",
    "blurb": "Three stops on the guide’s role, evidence, and visitor control.",
    "minutes": "2",
    "stations": [
      {
        "title": "Explain the guide’s role",
        "anchor": "overview",
        "lede": "Make it clear what Eda can help a visitor understand.",
        "caption": "Make it clear what Eda can help a visitor understand.",
        "tags": [],
        "say": "Hi, I’m Eda. This case explains the guide you’re using. The starting point is a clear role: accessibility concepts and written interface decisions. Visitors should understand what the conversation offers before choosing a walk or asking a question. Next is how the guide handles evidence.",
        "asks": [
          "What should a guide explain before a walk starts?",
          "How is Eda’s role different from Oslo’s?"
        ],
        "visual": "image",
        "src": "images/work/card-eda.png",
        "alt": "Explain the guide’s role — case-study illustration"
      },
      {
        "title": "Make evidence and limits understandable",
        "anchor": "scope",
        "lede": "Explain what the material supports without repeating internal rules.",
        "caption": "Explain what the material supports without repeating internal rules.",
        "tags": [],
        "say": "An explanation should make the design decision easier to understand. If a question needs a measurement or an interaction test, I can say what information would answer it. That limitation belongs with the relevant question; it should not take over every introduction. Next is the pacing of the guide.",
        "asks": [
          "When should a guide mention missing evidence?",
          "What needs the working interface rather than a screenshot?"
        ],
        "visual": "quote",
        "quote": "Explain the decision first. Raise a test question when it matters."
      },
      {
        "title": "Keep control with the visitor",
        "anchor": "pace",
        "lede": "Let people pause, ask, move back, or continue.",
        "caption": "Let people pause, ask, move back, or continue.",
        "tags": [],
        "say": "The guide gives visitors a short explanation and room to ask their own question. Back and Next make the sequence predictable, while closing the panel returns attention to the case. A working-product review would check those controls, their focus behavior, and whether the current station is clear. That completes this walk.",
        "asks": [
          "What makes the pacing predictable?",
          "What would you test when the panel closes?"
        ],
        "visual": "quote",
        "quote": "A useful guide leaves room for the visitor’s question."
      }
    ]
  }
};
