window.EDA_WALKS = {
  floor: {
    id: "floor",
    kicker: "Accessibility",
    title: "The floor and the target",
    blurb: "Five stations on three names people mix: Section 508 as the procurement floor, WCAG 2.2 as the target, and the decision written under both.",
    readUrl: "eda.html",
    minutes: "4",
    stations: [
      {
        title: "Three names, three jobs",
        lede: "Section 508, WCAG, and the work on a real screen are not one idea said three ways.",
        visual: "bands",
        bands: [
          { kicker: "Floor", title: "Section 508", body: "The procurement rule. For web, WCAG 2.0 Level A and AA." },
          { kicker: "Target", title: "WCAG 2.2", body: "What this practice builds to. Stricter and newer than the floor." },
          { kicker: "Job", title: "The decision", body: "What was written for a surface. Unwritten work stays unwritten." }
        ],
        caption: "The foundation. Later stations are easier once these are apart.",
        tags: ["508", "WCAG 2.2", "The job"],
        say: "Greetings, I am Eda. This walk is the floor and the target. Three names get mixed together, and the rest of the trail is easier once they are apart. Section 508 is the procurement floor for federal technology. WCAG 2.2 is the current target this practice builds to. The job is the decision written under both. I stay on what was written down. I do not invent a ratio, a pattern, or an exception. Press Next and I will show you what the floor actually requires. Ask anything on this station if you want to linger.",
        asks: ["Why separate the floor from the target?", "Who is this walk for?"]
      },
      {
        title: "What the floor requires",
        lede: "Revised Section 508 is a federal rule for technology agencies develop, buy, maintain, or use.",
        visual: "bands",
        bands: [
          { kicker: "Web", title: "WCAG 2.0 A and AA", body: "The conformance the Revised 508 Standards require for web content." },
          { kicker: "Also in scope", title: "Software and documents", body: "The standard is not a web checklist with a broader name." },
          { kicker: "Also in scope", title: "Support", body: "Documentation and support services sit inside the same rule." }
        ],
        caption: "The floor. It is not the current target, and it is not a civil rights statute.",
        tags: ["Revised 508", "Web", "Support"],
        say: "Section 508 applies to information and communication technology that federal agencies develop, procure, maintain, or use. For web content, the Revised 508 Standards require WCAG 2.0 Level A and Level AA. The same standards also cover software, electronic documents, and support services. That is the floor. It is not the current target. Next I will name the target this practice actually builds to.",
        asks: ["What does 508 require for a web page?", "What else does 508 cover?"]
      },
      {
        title: "What the target adds",
        lede: "WCAG 2.2 is the bar this practice builds to. A criterion is not a finding unless a surface wrote it down.",
        visual: "quote",
        quote: "The floor is WCAG 2.0 AA, because 508 says so. The target is WCAG 2.2, because that is what we build to.",
        caption: "Newer than the floor. Still not an audit of a case that never wrote one.",
        tags: ["WCAG 2.2", "Focus", "Target size"],
        say: "WCAG 2.2 is stricter and newer than the 508 floor. This practice builds to 2.2: semantic HTML and ARIA at the root of a component, keyboard access, a visible focus, contrast that can fail a check, and state that is never carried by color alone. 2.2 also adds criteria the 2.0 floor does not contain, including focus that is not obscured, a minimum target size, and dragging that has another way. Those are the target. They are not a finding about a shipped screen unless that screen wrote the decision down. Next is where this practice puts the contract.",
        asks: ["What did 2.2 add that 2.0 does not have?", "Where does color alone fit?"]
      },
      {
        title: "The contract on the primitive",
        lede: "The written position is already on the ground layer. Accessibility is part of the primitive, not a pass at the end.",
        visual: "bands",
        bands: [
          { kicker: "States", title: "On the primitive", body: "Keyboard, focus, and name live with the component, not in a later sweep." },
          { kicker: "Contents", title: "A closed set", body: "Designers and machines pick from the set. They do not invent a new one." },
          { kicker: "Check", title: "It can fail", body: "A slipped contrast fails before a person sees it." }
        ],
        caption: "From the ground layer. Not a score for a case study.",
        tags: ["Primitives", "Contrast", "Checks"],
        say: "The contract sits on the primitive, with its states and what it is allowed to contain. A designer and a machine can both be held to it. A contrast that slips, or a composition that leaves the set, should fail a check before a person sees it. That is the written position of the ground layer. Performance Monitoring is the case that has an accessibility walk. Armada, SBI, and IQVIA do not, and I will not invent one. Next is the line I will not cross.",
        asks: ["What is an accessibility contract on a primitive?", "Why isn't contrast a last pass?"]
      },
      {
        title: "The line she will not cross",
        lede: "If it was not written, it does not get spoken.",
        visual: "quote",
        quote: "If the line is not written, Eda does not get to invent it.",
        caption: "The fence. Oslo holds the other map.",
        tags: ["Fence", "Oslo", "Written only"],
        say: "If a decision was not written, I do not get to supply one. I do not scan the page. I do not add a technique because an implementation already looks solid. Ask me about the floor, the target, or the contract on this walk. Performance Monitoring is the feature trail, if you want this reading on a shipped admin surface. For the design-systems story, Oslo holds that map. That is the end of this walk. You can ask a question, or press Choose walk to start again.",
        asks: ["What will you decline?", "When do I ask Oslo instead?"]
      }
    ]
  },
  m365: {
    id: "m365",
    kicker: "Microsoft 365",
    title: "Performance Monitoring",
    blurb: "Five stations on a shipped admin surface: status that is a name, steps that are sentences, and the places color is not allowed to carry the meaning alone.",
    readUrl: "work/performance-monitoring.html",
    minutes: "4",
    stations: [
      {
        title: "The job is a readable incident",
        anchor: "overview",
        lede: "An admin has to know the status, the impact, and the next action while the investigation is still open.",
        visual: "image",
        src: "images/work/hero-imac.png",
        alt: "Performance Monitoring on a desktop in the Microsoft 365 Admin Center",
        caption: "V1 overview. The accessibility job is reading this, not scoring it.",
        tags: ["Shipped V1", "Admin Center", "The job"],
        say: "Greetings, I am Eda. This walk is Performance Monitoring, read for accessibility. The product job is already written: disruption is a moving mix of tenant issues and Microsoft-level incidents, and people need a path while the investigation is still open. The accessibility job is the same sentence. Status, impact, and the next action have to be readable under pressure. This case did not publish a contrast ratio or an ARIA audit, and I will not supply one. Press Next for the incident card, where the status is a name. Ask anything on this station if you want to linger.",
        asks: ["What is the accessibility job on this screen?", "Why isn't this a conformance score?"]
      },
      {
        title: "Status is a name, not a color",
        anchor: "cards",
        lede: "Under Investigation, False Alarm, and Service Restored are written on the card. The actions change with those words.",
        visual: "image",
        src: "images/work/investigation-states.png",
        alt: "Incident investigation states including under investigation, false alarm, and service restored",
        caption: "The state is the label and the actions. Color is not the carrier.",
        tags: ["Named states", "Not color alone", "Actions"],
        say: "The card writes the state. Under Investigation offers False Alarm or Service Restored. Restored, you add detail or move on. The problem, the impact estimate, and the timestamp are text on the card. That is the target applied to a real surface: state is never carried by color alone, because the name and the actions are the state. I am not claiming a particular widget role or a keyboard pattern. The case did not write those. It wrote the words. Next is the advisory, where the path has to be a sentence too.",
        asks: ["Why is a named state enough?", "What did the case not write about this card?"]
      },
      {
        title: "The path is a sentence",
        anchor: "path",
        lede: "Tenant problems get steps. Microsoft-level incidents say what repair is already in motion. Urgent issues also leave the screen.",
        visual: "image",
        src: "images/work/impact-metrics.png",
        alt: "Impact metrics and notification setup for Performance Monitoring",
        caption: "Email, phone, and SMS, filtered by severity and tenant so the interruption is chosen.",
        tags: ["Written steps", "Tenant vs Microsoft", "Notifications"],
        say: "An advisory that is only a color is not a path. The case writes two kinds. If the problem is the tenant's, the user gets steps they can take. If it is a Microsoft-level incident, the surface says the repair is already in motion, so people can wait with context. Notifications carry the same urgency off the screen, by email, phone, and SMS, filtered by severity and tenant. That is a second channel, not a second palette. Next is the chart, which is the place this case lets color work, and the place it stops.",
        asks: ["How is a tenant issue different from a Microsoft one?", "Why do notifications matter here?"]
      },
      {
        title: "Color may separate. It may not carry.",
        anchor: "chart",
        lede: "User count and duration are two named lines. The case says color separates them, and hover reveals the point.",
        visual: "image",
        src: "images/work/duration-chart.png",
        alt: "Line chart comparing user count and duration of impact over an incident window",
        caption: "The series are named. The point behind the number is written as hover.",
        tags: ["Named series", "Hover", "WCAG 2.2"],
        say: "Two lines, and the case names them: people affected, and duration of impact. Color separates the metrics. Because the series have names, color is a second channel, which is allowed. Then the case says hover reveals the point behind the number. That is all it wrote. The WCAG 2.2 target asks that content available on hover also be available without it. This case did not write a keyboard path or a text alternative for that point. I will not invent one. Next is the week view, where red and blue have to keep their names.",
        asks: ["Why is color allowed on this chart?", "What is missing from the hover?"]
      },
      {
        title: "A week has to stay named",
        anchor: "week",
        lede: "Red marks incidents. Blue marks advisories. Size marks stacked scenarios. The color is a pair with a name.",
        visual: "image",
        src: "images/work/historic-timeline.png",
        alt: "Historical timeline of incidents and advisories",
        caption: "Red for incidents, blue for advisories. Size stands in for more than one scenario.",
        tags: ["Color plus a name", "Size", "Timeline"],
        say: "The historic timeline writes the mapping in words. Red marks incidents, blue marks advisories, and a larger dot stands in for stacked scenarios. Size is a second signal, not decoration. The risk is a dot whose only difference is its color. The case already pairs each color with a name, and that pairing has to travel with the mark, not live only in a legend someone has to remember. That is the end of this walk. You can read the case, ask a question, or take the floor and the target if you want the rules these stations were read against. Oslo walks the product story of the same surface.",
        asks: ["Why isn't a color legend enough?", "Where does Oslo's walk of this case start?"]
      }
    ]
  }
};
