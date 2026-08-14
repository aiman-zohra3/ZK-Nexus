export interface AboutValue {
  title: string;
  description: string;
  image: string;
}

export interface AboutPrinciple {
  number: string;
  title: string;
  description: string;
  highlighted?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface AboutStat {
  value: number;
  suffix: string;
  title: string;
}

export const missionText =
  "Empowering businesses through secure and scalable technology solutions that drive measurable growth and long-term success.";

export const storyTexts: string[] = [
  "Technology moves fast. Businesses need more than beautiful websites. They need secure and scalable solutions.",
  "Most agencies focus only on design or development. Very few build security into the process from day one.",
  "That's why ZK Nexus exists—to bridge the gap between innovation, performance, and cybersecurity.",
  "We build for what's next, not just what's now.",
];

export const values: AboutValue[] = [
  {
    title: "Security First",
    description: "Built secure from day one.",
    image: "/security.jfif",
  },
  {
    title: "Quality Driven",
    description: "Scalable experiences that last.",
    image: "/quality.jfif",
  },
  {
    title: "Transparency",
    description: "Clear timelines, full visibility.",
    image: "/transparency.jfif",
  },
  {
    title: "Long-Term Partnerships",
    description: "Growing with our clients.",
    image: "/partenership.jfif",
  },
];

export const principles: AboutPrinciple[] = [
  {
    number: "01",
    title: "Security First",
    description: "Secure architecture, built in from the start.",
  },
  {
    number: "02",
    title: "Transparency",
    description: "Honest timelines, full visibility.",
    highlighted: true,
  },
  {
    number: "03",
    title: "Quality",
    description: "Scalable systems, built to perform.",
  },
  {
    number: "04",
    title: "Partnership",
    description: "An extension of your team.",
  },
  {
    number: "05",
    title: "Continuous Innovation",
    description: "Always learning, always improving.",
  },
];

export const team: TeamMember[] = [
  {
    name: "Eesha Baig",
    role: "Founder & Full Stack Engineer",
    image: "/woman1.jfif",
    bio: "Leads product strategy, full stack development, and ensures every solution balances innovation, scalability, and security.",
  },
  {
    name: "Hassan Malik",
    role: "Cybersecurity Engineer",
    image: "/man1.jfif",
    bio: "Protects applications through penetration testing, secure architecture, vulnerability assessments, and cloud security.",
  },
  {
    name: "Ahmed Khan",
    role: "UI/UX Designer",
    image: "/man2.jfif",
    bio: "Designs intuitive user experiences and modern interfaces that help businesses stand out and convert visitors into customers.",
  },
  {
    name: "Aiman Zohra",
    role: "Project Manager",
    image: "/woman2.jfif",
    bio: "Coordinates teams, streamlines workflows, and ensures every project is delivered on time with complete transparency.",
  },
  {
    name: "Usman Tariq",
    role: "Backend & Cloud Engineer",
    image: "/man3.jfif",
    bio: "Builds scalable APIs, cloud infrastructure, and automation systems that power secure enterprise-grade applications.",
  },
];

export const stats: AboutStat[] = [
  { value: 20, suffix: "+", title: "Projects Delivered" },
  { value: 10, suffix: "+", title: "Technologies Mastered" },
  { value: 100, suffix: "%", title: "Security Focused" },
  { value: 24, suffix: "/7", title: "Commitment To Quality" },
];