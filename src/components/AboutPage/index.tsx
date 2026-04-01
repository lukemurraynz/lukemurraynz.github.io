import React from "react";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type Pill = {
  label: string;
  background: string;
  color: string;
};

type Badge = {
  src: string;
  alt: string;
};

const technologyAreas: Pill[] = [
  { label: "Azure Application PaaS", background: "#0078D4", color: "#FFFFFF" },
  { label: "Azure AI Services", background: "#3CCBF4", color: "#000000" },
  { label: "DevOps", background: "#0078D7", color: "#FFFFFF" },
  { label: "Azure Compute Infrastructure", background: "#104581", color: "#FFFFFF" },
  { label: "Azure Cost, Resource & Configuration Management", background: "#50E6FF", color: "#000000" },
  { label: "Azure Hybrid & Migration", background: "#7FBA00", color: "#FFFFFF" },
  { label: "Azure Infrastructure as Code", background: "#FFB900", color: "#000000" },
  { label: "Azure Innovation Hub", background: "#F25022", color: "#FFFFFF" },
  { label: "Azure Integration PaaS", background: "#00A4EF", color: "#FFFFFF" },
  { label: "Azure Kubernetes and Open Source", background: "#326CE5", color: "#FFFFFF" },
  { label: "Azure Kubernetes and Opensource", background: "#326CE5", color: "#FFFFFF" },
  { label: "Azure Networking", background: "#737373", color: "#FFFFFF" },
  { label: "Azure Virtual Desktop", background: "#181717", color: "#FFFFFF" },
  { label: "Azure Storage", background: "#E00B1C", color: "#FFFFFF" },
  { label: "Azure Well-Architected, Resiliency & Observability", background: "#A4262C", color: "#FFFFFF" },
  { label: "PowerShell", background: "#012456", color: "#FFFFFF" },
  { label: "Microsoft Defender for Cloud", background: "#6B69D6", color: "#FFFFFF" },
  { label: "Entra ID", background: "#0F6CBD", color: "#FFFFFF" },
  { label: "Microsoft Sentinel", background: "#005B9F", color: "#FFFFFF" },
];

const communityContributions: Pill[] = [
  { label: "Azure Architecture Center contributor", background: "#0078D4", color: "#FFFFFF" },
  { label: "Cloud Adoption contributor", background: "#0F6CBD", color: "#FFFFFF" },
  { label: "YouTube videos", background: "#FF0000", color: "#FFFFFF" },
  { label: "Open-source contributor", background: "#46783E", color: "#FFFFFF" },
  { label: "Product feedback contributor", background: "#00A4EF", color: "#FFFFFF" },
  { label: "Microsoft Startup Expert", background: "#F25022", color: "#FFFFFF" },
  { label: "Mentorship", background: "#5E397A", color: "#FFFFFF" },
  { label: "Community speaker & organizer", background: "#6B69D6", color: "#FFFFFF" },
  { label: "Forum moderator & support", background: "#505050", color: "#FFFFFF" },
  { label: "Blog author", background: "#2A5E91", color: "#FFFFFF" },
];

const badges: Badge[] = [
  { src: "/img/aboutpage/AIMVPSummit_2024.png", alt: "AI MVP Summit Badge" },
  { src: "/img/aboutpage/ArchitectureCenter_Leader.png", alt: "Azure Architecture Center badge" },
  { src: "/img/aboutpage/ArchitectureCenter_Collaborator.png", alt: "Architecture Center Collaborator Badge" },
  { src: "/img/aboutpage/AzureAdministratoAssociateBadge.png", alt: "Azure Administrator Associate Badge" },
  { src: "/img/aboutpage/AzureBadger_CommunityHero_Badge.png", alt: "Azure Badger Community Hero" },
  { src: "/img/aboutpage/AzureBadger_ContentHero_Badge.png", alt: "Azure Badger Content Hero" },
  { src: "/img/aboutpage/AzureDeveloperAssociateBadge.png", alt: "Azure Developer Associate Badge" },
  { src: "/img/aboutpage/AzureIdentityAndAccessManagementContributor_Badge.png", alt: "Azure Identity and Access Management Contributor Badge" },
  { src: "/img/aboutpage/AzureNetworkEngineer_Badge.png", alt: "Azure Network Engineer Badge" },
  { src: "/img/aboutpage/AzureSecuriyEngineerBadge.png", alt: "Azure Security Engineer Badge" },
  { src: "/img/aboutpage/AzureSolutionsArchitectBadge.png", alt: "Azure Solutions Architect Badge" },
  { src: "/img/aboutpage/AzureVirtualDesktopSpecialtyBadge.png", alt: "Azure Virtual Desktop Specialty Badge" },
  { src: "/img/aboutpage/CyberSecurityArchitectBadge.png", alt: "Cybersecurity Architect Badge" },
  { src: "/img/aboutpage/DevPostAILearningHackathon_2024.png", alt: "Microsoft Developers AI Learning Hackathon" },
  { src: "/img/aboutpage/FinOpsCertifiedPractitioner.png", alt: "FinOps Certified Practitioner" },
  { src: "/img/aboutpage/KustoDetectiveAgencyCase2Limited.png", alt: "Kusto Detective Agency Case 2 Limited Badge" },
  { src: "/img/aboutpage/LinuxFoundationOpenAIFundamentals.png", alt: "Linux Foundation OpenAI Fundamentals Badge" },
  { src: "/img/aboutpage/LinuxFoundationScalingCloudNativeAppswithKEDA.png", alt: "Linux Foundation Scaling Cloud Native Apps with KEDA" },
  { src: "/img/aboutpage/MentorMVPFY25MicrosoftSkillsBootcampContributor.png", alt: "Microsoft Skills Bootcamp 2024" },
  { src: "/img/aboutpage/WinterSchool_Contributor_Badge_FY26.png", alt: "Winter School Contributor FY26 Badge" },
  { src: "/img/aboutpage/MicrosoftAISkillsFestGWRHolder.png", alt: "Microsoft AI Skills Fest - GUINNESS WORLD RECORDS" },
  { src: "/img/aboutpage/microsoft-global-hackathon-2024.png", alt: "Microsoft Global Hackathon 2024" },
  { src: "/img/aboutpage/microsoft-global-hackathon-2025.png", alt: "Microsoft Global Hackathon 2025" },
  { src: "/img/aboutpage/MVP2024Badge.png", alt: "MVP 2024 Badge" },
  { src: "/img/aboutpage/MVP2025Badge.png", alt: "MVP 2025 Badge" },
  { src: "/img/aboutpage/MVP2023Badge.png", alt: "MVP 2023 Badge" },
  { src: "/img/aboutpage/SpektraSystemsAzureExpert.png", alt: "Azure Expert Badge" },
  { src: "/img/aboutpage/WindowsCustomerConnectionProgramCommunityBadge.png", alt: "Windows Customer Connection Program Community Badge" },
];

function PillList({ items }: { items: Pill[] }) {
  return (
    <ul className={styles.pillList}>
      {items.map((item) => (
        <li
          key={item.label}
          className={styles.pill}
          style={
            {
              "--pill-bg": item.background,
              "--pill-fg": item.color,
            } as React.CSSProperties
          }
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <main className={`container margin-vert--xl ${styles.page}`}>
      <section className={styles.hero}>
        <div className={styles.portraitColumn}>
          <div className={styles.portraitCard}>
            <img
              src="/img/aboutpage/LukeMurray_Azure.jpg"
              alt="Profile picture of Luke Murray"
              className={styles.portrait}
            />
          </div>
        </div>

        <div className={styles.contentColumn}>
          <Heading as="h1">About Me</Heading>
          <p className={styles.lead}>
            My name is <strong>Luke Murray</strong>. I am a Microsoft MVP in Azure and a Microsoft Learn Expert who helps organizations design and implement secure, scalable cloud solutions.
          </p>
          <p>
            With over a decade of experience in IT, I specialize in Microsoft technologies, cloud architecture, automation, Infrastructure as Code, and DevOps practices. I am passionate about sharing knowledge through my blog, community contributions, and technical presentations.
          </p>
          <p>
            I hold multiple Microsoft Azure certifications and am recognized for my expertise in patterns and practices, cloud native solutions, and general solution architecture and delivery.
          </p>
          <p>I live and work in Hamilton, New Zealand.</p>
          <p>
            Want to connect? Feel free to{" "}
            <a
              href="https://www.linkedin.com/in/ljmurray/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              connect on LinkedIn
            </a>{" "}
            or reach me through any of the social media links in the navbar.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <Heading as="h2">Some of the technology areas I work with</Heading>
        <PillList items={technologyAreas} />
      </section>

      <section className={styles.section}>
        <Heading as="h2">Community Contributions</Heading>
        <PillList items={communityContributions} />
      </section>

      <section className={styles.section}>
        <Heading as="h2">Achievements and Certifications</Heading>
        <ul className={styles.badgeGrid}>
          {badges.map((badge) => (
            <li key={badge.src} className={styles.badgeCard}>
              <img
                src={badge.src}
                alt={badge.alt}
                className={styles.badgeImage}
                loading="lazy"
              />
              <span className={styles.badgeCaption}>{badge.alt}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
