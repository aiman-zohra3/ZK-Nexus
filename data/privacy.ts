export interface PrivacyContentBlock {
  heading: string | null;
  body: string;
  list: string[];
}

export interface PrivacySection {
  number: string;
  id: string;
  title: string;
  content: PrivacyContentBlock[];
}

export const lastUpdated = "July 2026";

export const intro =
  'At ZK Nexus ("we," "us," "our," or "Company"), we are committed to protecting your privacy. This policy explains how we collect, use, disclose, and safeguard your information when you visit our website and engage with our services. By using ZK Nexus, you acknowledge that you have read and agree to the terms below.';

export const contactEmail = "privacy@zknexus.com";

export const sections: PrivacySection[] = [
  {
    number: "01",
    id: "information-we-collect",
    title: "Information We Collect",
    content: [
      {
        heading: "Personal Information You Voluntarily Provide",
        body: "We collect personal information that you voluntarily provide when you fill out contact forms, subscribe to our newsletter, apply for positions through our careers page, request quotes or consultations, or communicate with us through our contact channels.",
        list: [
          "Name and email address",
          "Phone number",
          "Company name and job title",
          "Project details you choose to share",
        ],
      },
      {
        heading: "Information Collected Automatically",
        body: "When you visit our website, certain information is collected automatically through cookies, analytics tools, and similar tracking technologies.",
        list: [
          "IP address",
          "Browser type and version",
          "Operating system and device information",
          "Pages visited and time spent on each page",
          "Referring websites and search queries",
        ],
      },
    ],
  },
  {
    number: "02",
    id: "use-of-information",
    title: "Use of Information",
    content: [
      {
        heading: null,
        body: "We use the information we collect for the following purposes:",
        list: [
          "Service Delivery — to provide, maintain, and improve our services and respond to inquiries",
          "Communications — to send marketing materials, updates, and service announcements",
          "Analytics — to understand how users interact with our website",
          "Legal Compliance — to comply with applicable laws and regulations",
          "Security — to protect against fraudulent or unauthorized activity",
          "Business Operations — to manage operations and troubleshoot technical issues",
          "Recruitment — to review applications and communicate with candidates",
        ],
      },
    ],
  },
  {
    number: "03",
    id: "sharing-your-information",
    title: "Sharing Your Information",
    content: [
      {
        heading: null,
        body: "We do not sell your personal information to third parties. We may share information in the following circumstances:",
        list: [
          "Service Providers — trusted third parties who process data under strict confidentiality agreements",
          "Legal Requirements — when required by law, court order, or government request",
          "Business Transfers — as part of a merger, acquisition, or asset sale",
          "With Your Consent — when you explicitly consent or request it",
        ],
      },
    ],
  },
  {
    number: "04",
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    content: [
      {
        heading: null,
        body: "We use cookies and similar technologies to enhance your browsing experience. You can control cookie preferences through your browser settings, though disabling certain cookies may impact website functionality.",
        list: [
          "Essential Cookies — required for website functionality",
          "Analytics Cookies — help us understand user behavior",
          "Marketing Cookies — used to deliver personalized content",
        ],
      },
    ],
  },
  {
    number: "05",
    id: "data-security",
    title: "Data Security",
    content: [
      {
        heading: null,
        body: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction — including encryption, secure servers, access controls, and regular security assessments. No method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
        list: [],
      },
    ],
  },
  {
    number: "06",
    id: "your-privacy-rights",
    title: "Your Privacy Rights",
    content: [
      {
        heading: null,
        body: "Depending on your location, you may have certain rights regarding your personal information:",
        list: [
          "Right to Access : request access to the personal information we hold",
          "Right to Correction : request correction of inaccurate or incomplete data",
          "Right to Deletion : request deletion, subject to legal obligations",
          "Right to Opt-Out : opt out of marketing communications",
          "Right to Data Portability : request a copy of your data in a portable format",
        ],
      },
    ],
  },
  {
    number: "07",
    id: "third-party-links",
    title: "Third-Party Links",
    content: [
      {
        heading: null,
        body: "Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies before providing personal information.",
        list: [],
      },
    ],
  },
  {
    number: "08",
    id: "childrens-privacy",
    title: "Children's Privacy",
    content: [
      {
        heading: null,
        body: "Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete it and terminate the associated account.",
        list: [],
      },
    ],
  },
  {
    number: "09",
    id: "international-transfers",
    title: "International Data Transfers",
    content: [
      {
        heading: null,
        body: "Your information may be transferred to, stored in, and processed in countries other than your country of residence, which may have data protection laws that differ from your home country. By using our services, you consent to such transfers.",
        list: [],
      },
    ],
  },
  {
    number: "10",
    id: "policy-changes",
    title: "Policy Changes",
    content: [
      {
        heading: null,
        body: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated policy on our website with a new effective date. Continued use of our services following such changes constitutes acceptance of the updated policy.",
        list: [],
      },
    ],
  },
  {
    number: "11",
    id: "contact-us",
    title: "Contact Us",
    content: [
      {
        heading: null,
        body: "If you have questions about this Privacy Policy, wish to exercise your privacy rights, or have concerns about our privacy practices, reach out to us. We respond to inquiries within 30 days of receipt.",
        list: [],
      },
    ],
  },
];