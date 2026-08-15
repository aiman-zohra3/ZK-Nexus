// data/projects.ts
// ─────────────────────────────────────────────────────────
// Add a new project by pushing one more object to this array.
// Nothing else in the app needs to change — the landing
// section and the /projects/[slug] page both read from here.
// ─────────────────────────────────────────────────────────

export interface Project {
  slug: string;
  name: string;
  category: string;
  stack: string[];
  accent: string;
  image: string;
  landingLine: string;
  problem: string;
  solution: string;
  highlights: string[];
  demoUrl: string;
  metrics?: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}[];
  description?: string;
  
}

export const projects: Project[] = [
  {
    slug: "pizzano",
    name: "Pizzano",
    category: "COMMERCE",
    stack: ["Next.js", "PayPal", "JWT Auth"],
    accent: "violet",
    image: "/pizzano.png",
    landingLine: "Sell food online — keep every rupee of the profit.",
    problem:
      "Independent restaurants hand over 20–30% of every order to third-party delivery apps, and never get to keep the customer's details for themselves.",
    solution:
      "Pizzano is a complete ordering system a restaurant runs on its own site. Customers browse the menu, build an order, and pay securely — while the owner gets a private dashboard to add dishes, watch stock, and see every order land in real time. No commission, no middleman, no other app standing between the kitchen and the customer.",
    highlights: [
      "Customers build a cart and pay securely, card or PayPal",
      "Owners get a private dashboard to add and manage the menu",
      "Every order is saved, so the restaurant owns its own customer data",
      "A login wall keeps the dashboard visible to staff only",
    ],
    metrics: [
  {
    value: 2.5,
    suffix: "K+",
    label: "Orders",
  },
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Success Rate",
  },
  {
    value: 180,
    suffix: "ms",
    label: "Response Time",
  },
],
    
    description:"A full-stack food ordering platform that enables restaurants to manage their entire online ordering experience without relying on third-party delivery services. Customers can browse the menu, customize pizzas, place secure orders with PayPal integration, and track their order history, while administrators manage products, inventory, and orders through a protected JWT-authenticated dashboard.",
    demoUrl: "https://github.com/yashfalke77/food-ordering-app",
  },
  
  {
    slug: "FinCore",
    name: "FinCore",
    category: "FINTECH",
    stack: ["Next.js 15", "TypeScript", "AI Dashboard"],
    accent: "cyan",
    image: "/crm.jpg",
    landingLine: "Every client, every risk, one screen.",
    problem:
      "Insurance firms, investment houses, and wealth managers keep client records, risk flags, and compliance paperwork scattered across three or four different tools — and nobody has one clean view of a client until it's too late.",
    solution:
      "FinCore pulls it all into a single dashboard. A relationship manager can see who a client is, how risky their portfolio looks, and whether their paperwork is compliant, all without switching tabs. Built-in AI flags accounts that need a second look before a human ever has to go searching for them.",
    highlights: [
      "One dashboard for client records, risk scores, and compliance status",
      "AI flags accounts that need a closer look, automatically",
      "Built for insurance, investment, and wealth management teams",
      "Modern, fast interface that works the way a finance team actually thinks",
    ],
    metrics: [
  {
    value: 2.5,
    suffix: "K+",
    label: "Orders",
  },
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Success Rate",
  },
  {
    value: 180,
    suffix: "ms",
    label: "Response Time",
  },
],
    description:"A full-stack food ordering platform built with Next.js that enables restaurants to manage their entire online ordering experience without relying on third-party delivery services. Customers can browse the menu, customize pizzas, place secure orders with PayPal integration, and track their order history, while administrators manage products, inventory, and orders through a protected JWT-authenticated dashboard.",
    demoUrl: "https://github.com/MrXujiang/FinCore",
  },


  {
    slug: "Cryptix",
    name: "Cryptix",
    category: "THREAT RESEARCH",
    stack: ["Python", "Cross-Platform", "Webhook Relay"],
    accent: "violet",
    image: "/cryptix.jpg",
    landingLine: "Catches what a stolen password can't hide.",
    problem:
      "By the time a company notices a stolen password or an insider quietly copying files, the damage is already done. Security teams need to see keystroke-level activity to prove what happened — and catch it while it's happening.",
    solution:
      "Cryptix is a research tool built for security teams to study exactly this blind spot. It records activity with precise timestamps, tracks which window was active at the time, and can relay findings out in real time for a security team to review — all built to run quietly and safely across Windows, macOS, and Linux for controlled, authorized testing.",
    highlights: [
      "Timestamped activity capture accurate to the millisecond",
      "Tracks which application was in focus at every moment",
      "Automatic log rotation so nothing runs away with disk space",
      "Built for authorized security research and insider-threat testing only",
    ],
   metrics: [
  {
    value: 100,
    suffix: "K+",
    label: "Events Logged",
  },
  {
    value: 3,
    label: "Platforms",
  },
  {
    value: 5,
    suffix: "MB",
    label: "Log Rotation",
  },
],
      description:"Cryptix is a cross-platform cybersecurity research tool developed for authorized security testing and threat analysis. It captures keyboard activity with microsecond-precision timestamps, tracks the active application window across Windows, macOS, and Linux, and securely manages logs through automatic rotation. The tool includes runtime pause and resume controls, thread-safe resource handling, and webhook-based remote delivery simulation, making it suitable for studying user behavior, insider threats, and incident response workflows.",

    demoUrl:
      "https://github.com/CarterPerez-dev/Cybersecurity-Projects/tree/main/PROJECTS/beginner/keylogger",
  },



  {
    slug: "wetalk",
    name: "WeTalk",
    category: "PRIVACY",
    stack: ["Signal Protocol", "WebSockets", "Passkeys"],
    accent: "cyan",
    image: "/wetalk.jpg",
    landingLine: "Messages nobody in between can read.",
    problem:
      "Most chat apps promise privacy but still sit in the middle of every conversation. If their servers are ever breached, old messages can be exposed right along with new ones.",
    solution:
      "WeTalk locks every message on your device before it ever leaves — using the same trusted encryption approach behind Signal. Even if a server were compromised, past conversations stay unreadable, because each message uses its own disposable key. Sign in with a passkey instead of a password, and pick up the same conversation across every device you own.",
    highlights: [
      "Messages are encrypted before they leave your device, not after",
      "Old conversations stay private even if a server is ever breached",
      "Sign in with a passkey — no password to steal in the first place",
      "Live typing indicators, read receipts, and multi-device support",
    ],
    metrics: [
  {
    value: 256,
    suffix: "-bit",
    label: "Encryption",
  },
  {
    value: 40,
    prefix: "<",
    suffix: "ms",
    label: "Latency",
  },
  {
    value: 100,
    suffix: "%",
    label: "Forward Secrecy",
  },
],
    description:"WeTalk is a secure messaging application that prioritizes user privacy by implementing end-to-end encryption using the Signal Protocol. It ensures that messages are encrypted on the user's device before transmission, preventing any intermediary from accessing the content. The app supports passkey authentication for enhanced security, eliminating the need for traditional passwords. WeTalk also features real-time communication capabilities, including live typing indicators and read receipts, while maintaining multi-device support for seamless user experience across platforms.",
    demoUrl:
      "https://github.com/CarterPerez-dev/Cybersecurity-Projects/tree/main/PROJECTS/advanced/encrypted-p2p-chat",
  },
  
 
  
   
];

export function getProjectBySlug(
  slug: string
): Project | undefined {
  return projects.find((project) => project.slug === slug);
}