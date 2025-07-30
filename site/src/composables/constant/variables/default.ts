import { PREVIEW_SELECTOR } from "./render";
import type { ResumeStyles } from "../../stores/style";

export const DEFAULT_STYLES = {
  marginV: 40,
  marginH: 45,
  lineHeight: 1.25,
  paragraphSpace: 5,
  themeColor: "#6A31D2",
  fontEN: {
    name: "Open Sans Regular"
  },
  fontSize: 12,
  paper: "A4"
} as ResumeStyles;

export const DEFAULT_MD_CONTENT = `---
name: John Doe
header:
  - text: |
      Senior Software Engineer
  - text: euristiq
    link: https://euristiq.com
  - text: <span class="iconify" data-icon="tabler:mail"></span> hello@euristiq.com
    link: mailto:hello@euristiq.com
---

Experienced backend developer with over seven years of expertise designing and delivering scalable, secure server-side applications. Specializes in modern Java and Kotlin, cloud-native development, and security-first engineering practices. Skilled in integrating third-party services and APIs within distributed, event-driven systems. Architects robust microservices using Domain-Driven Design, CQRS, and Event Sourcing, supported by automated CI/CD pipelines and infrastructure as code. A strong communicator and proactive learner dedicated to driving innovation and contributing to team success.

## Expertise
|                                            |                                                                                                                |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **Programming&nbsp;Languages:**            | Java, Kotlin, Python                                                                                           |
| **Data&nbsp;Stores:**                      | PostgreSQL, Redis, Cassandra, TimeScaleDB                                                                      |
| **AWS&nbsp;Cloud:**                        | RDS, ECS, SQS, DynamoDB, Kinesis, IoT Core, Cognito, Lambda, API Gateway, ElastiCache, S3, CloudFormation, CDK |
| **Azure&nbsp;/&nbsp;Other&nbsp;Cloud:**    | AKS, CosmosDB, Service Bus, Event Bus                                                                          |
| **Architecture&nbsp;&amp;&nbsp;Patterns:** | DDD, CQRS, Event Sourcing, Micro‑services, GraphQL                                                             |
| **Messaging&nbsp;&amp;&nbsp;Streaming:**   | Kafka, RabbitMQ, ActiveMQ, MQTT                                                                                |
| **IoT&nbsp;&amp;&nbsp;Protocols:**         | MQTT, LwM2M&nbsp;/&nbsp;CoAP, LoRaWAN, ZigBee                                                                  |
| **Tools:**                                 | Docker, Kubernetes, Terraform, JMeter, Spring Boot/Framework                                                   |
| **Certification:**                         | AWS Certified Solutions Architect– Associate                                                                   |

## Experience

**VMS:** Senior Software Engineer
  ~ **12/2023 - 04/2025**

Built a scalable vendor-management platform with SharePoint-based document collaboration.

Extended core process-automation engine, enabling configurable customer workflows. Implemented custom-field and flexible import/export modules.

**Achievements:**
- Delivered financial reporting pipeline integrated with Power BI → 40 % faster insights
- Introduced worker-budget feature reducing hiring-manager effort by 15 %.

**Tech stack:** Kotlin, Spring Framework, PostgreSQL, ActiveM, Kafka, AWS S3, ABAC

**IoT (Agricultural Farm Management):** Senior Software Engineer
  ~ **10/2022 - 12/2023**

Discovered and documented migration path from GCP to AWS. Designed IoT-ready architecture with FOTA for farm equipment. Migrated Java EE monolith to Spring Boot in under a week 35 % performance boost.

**Achievements:**
- Reduced application load time by 15% by optimizing database queries and implementing caching
- Created a CI/CD pipeline that automated the deployment process, reducing deployment time by 50%

**Tech stack:** Java, Spring Framework, AWS Cognito, ECS, RDS, S3, SES, SQS, DynamoDB, IoT

**IoT (Smart Fitness):** Senior Software Engineer
  ~ **01/2022 - 09/2022, 09/2023 - 12/2023**

Designed backend to aggregate and analyse sensor data & heart-rate-zone metrics. Deployed complete AWS infrastructure and provided production support.

**Achievements:** Real-time session analytics grew user base to ~100 k in first year

**Tech stack:** Java, Docker, Spring Framework, AWS Cognito, ECS, RDS, S3, SES, SQS, DynamoDB

**IoT (Dash-Cam Insurance):** Senior Software Engineer
  ~ **09/2021 - 08/2022**

Engineered real-time event pipeline for telemetry and accident detection. Implemented personalised insurance pricing based on driving behaviour. Led a small backend team and mentored junior developers.

**Achievements:**
- Delivered financial reporting pipeline integrated with Power BI → 40 % faster insights
- Designed and implemented a scalable microservices architecture for a high-traﬃc application

**Tech stack:** Java, Docker, MQTT, Spring Framework, AWS Cognito, ECS, RDS, S3, SES, SQS, Twilio, Kinesis. ElastiCache, API Gateway

**IoT (Fitness Equipment Telemetry):** Software Engineer
  ~ **04/2021 - 09/2021**

Built backend handling 1 M + telemetry points per day; cut equipment downtime 30 %

**Achievements:**
- Delivered financial reporting pipeline integrated with Power BI → 40 % faster insights.
- Reduced application load time by 15% by optimizing database queries and implementing caching mechanisms.

**Tech stack:** Java, Docker, MQTT, Spring Framework, AWS Cognito, IoT, ECS, RDS, S3, SES, SQS

**Earlier Roles (2019 - 2021)**  include building identity-verification, remote light-management, IoT  tracking, construction-management, on-prem IoT  analytics,  media-player CMS, logistics,  telecom,  and  project-management solutions with Java,  Spring, Docker, Kubernetes, AWS,  Azure and various messaging & IoT protocols.

## Education

**Lviv Polytechnic National University** - Faculty of Computer Science

~ **2013 - 2019**

Bachelor's & Master's degree in Computer Science


## Languages

- English: C1 (Advanced)
- Ukrainian - Native
`;

export const DEFAULT_CSS_CONTENT = `
/* Backbone CSS for Resume Template 1 */

/* Basic */

.resume-header {
  padding-bottom: 20px;
  text-align: left!important;
    background-image: url('https://files.slack.com/files-pri/T437TQE4V-F098592PBEH/logo-black-bg-transparent.png?pub_secret=d29c0e8bf7');
  background-repeat: no-repeat;
  background-position: top right;
  background-size: 120px auto; /* Adjust as needed */
}

.resume-header h1 {
  text-align: left!important;
}

${PREVIEW_SELECTOR} [data-scope="vue-smart-pages"][data-part="page"] {
  background-color: white;
  color: black;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}

${PREVIEW_SELECTOR} p,
${PREVIEW_SELECTOR} li,
${PREVIEW_SELECTOR} dl {
  margin: 0;
}

${PREVIEW_SELECTOR} dl {
  margin: 15px 0 0 0;
}

${PREVIEW_SELECTOR} h2 + dl {
  margin: 0;
}

/* Headings */

${PREVIEW_SELECTOR} h1,
${PREVIEW_SELECTOR} h2,
${PREVIEW_SELECTOR} h3 {
  font-weight: bold;
}

${PREVIEW_SELECTOR} h1 {
  font-size: 2.13em;
}

${PREVIEW_SELECTOR} h2 {
  margin-top: 20px!important;
  text-transform: uppercase;
}

${PREVIEW_SELECTOR} h2,
${PREVIEW_SELECTOR} h3 {
  margin-bottom: 5px;
  font-size: 1.2em;
}

${PREVIEW_SELECTOR} h2 {
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

/* Lists */

${PREVIEW_SELECTOR} ul,
${PREVIEW_SELECTOR} ol {
  padding-left: 1.5em;
  margin: 0.2em 0;
}

${PREVIEW_SELECTOR} ul {
  list-style-type: disc;
}

${PREVIEW_SELECTOR} ol {
  list-style-type: decimal;
}

/* Definition Lists */

${PREVIEW_SELECTOR} dl {
  display: flex;
}

${PREVIEW_SELECTOR} dl dt,
${PREVIEW_SELECTOR} dl dd:not(:last-child) {
  flex: 1;
}

/* Tex */

${PREVIEW_SELECTOR} :not(span.katex-display) > span.katex {
  font-size: 1em !important;
}

/* SVG & Images */

${PREVIEW_SELECTOR} svg.iconify {
  vertical-align: -0.2em;
}

${PREVIEW_SELECTOR} img {
  max-width: 100%;
}

/* Header */

${PREVIEW_SELECTOR} .resume-header {
  text-align: center;
}

${PREVIEW_SELECTOR} .resume-header h1 {
  text-align: center;
  line-height: 1;
  margin-bottom: 8px;
}

${PREVIEW_SELECTOR} .resume-header .resume-header-item {
  font-weight: normal;
}

${PREVIEW_SELECTOR} .resume-header .resume-header-item:first-of-type {
  font-weight: bold;
}

${PREVIEW_SELECTOR} .resume-header-item:not(.no-separator)::after {
  content: " | ";
}

/* Citations */

${PREVIEW_SELECTOR} [data-scope="cross-ref"][data-part="definitions"] {
  padding-left: 1.2em;
}

${PREVIEW_SELECTOR} [data-scope="cross-ref"][data-part="definition"] p {
  margin-left: 0.5em;
}

${PREVIEW_SELECTOR} [data-scope="cross-ref"][data-part="definition"]::marker {
  content: attr(data-label);
}

${PREVIEW_SELECTOR} [data-scope="cross-ref"][data-part="reference"] {
  font-size: 100%;
  top: 0;
}

/* Dark & print mode */
/* You might want to comment out the following lines if you change the background or text color. */

.dark ${PREVIEW_SELECTOR} [data-scope="vue-smart-pages"][data-part="page"] {
  background-color: hsl(213, 12%, 15%);
  color: hsl(216, 12%, 84%);
}

@media print {
  .dark ${PREVIEW_SELECTOR} [data-scope="vue-smart-pages"][data-part="page"] {
    background-color: white;
    color: black;
  }
}
`;
