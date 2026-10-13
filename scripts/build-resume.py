from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

out=Path(__file__).resolve().parents[1] / 'public/documents/israel-oduguwa-resume.pdf'
styles={
 'name': ParagraphStyle('name',fontName='Helvetica-Bold',fontSize=25,leading=29,textColor=HexColor('#15243c'),spaceAfter=7),
 'role': ParagraphStyle('role',fontName='Helvetica',fontSize=12,leading=16,textColor=HexColor('#2563eb'),spaceAfter=8),
 'contact': ParagraphStyle('contact',fontName='Helvetica',fontSize=9,leading=13,textColor=HexColor('#435269'),spaceAfter=11),
 'body': ParagraphStyle('body',fontName='Helvetica',fontSize=10,leading=14,textColor=HexColor('#243247'),spaceAfter=8),
 'section': ParagraphStyle('section',fontName='Helvetica-Bold',fontSize=11,leading=15,textColor=HexColor('#2563eb'),spaceBefore=13,spaceAfter=9),
 'company': ParagraphStyle('company',fontName='Helvetica-Bold',fontSize=11,leading=15,textColor=HexColor('#15243c'),spaceBefore=8,spaceAfter=3),
 'meta': ParagraphStyle('meta',fontName='Helvetica',fontSize=9,leading=13,textColor=HexColor('#536174'),spaceAfter=7),
 'bullet': ParagraphStyle('bullet',fontName='Helvetica',fontSize=9.7,leading=13.5,textColor=HexColor('#243247'),leftIndent=10,firstLineIndent=-10,spaceAfter=5),
}
flow=[]
def p(text,style='body'): flow.append(Paragraph(text,styles[style]))
def bullet(text): p('- '+text,'bullet')
def job(name,role,dates): p(name,'company'); p(role+' | '+dates,'meta')

def footer(c,doc):
 c.saveState(); c.setStrokeColor(HexColor('#dce3ee')); c.line(42,35,A4[0]-42,35); c.setFillColor(HexColor('#536174')); c.setFont('Helvetica',8); c.drawString(42,23,'Israel Oduguwa | Senior Full Stack Software Engineer'); c.drawRightString(A4[0]-42,23,str(doc.page)); c.restoreState()

p('Israel Oduguwa','name')
p('Senior Full Stack Software Engineer | Architecture, Payments &amp; AI','role')
p('<link href="mailto:oduguwa.israel22@gmail.com">oduguwa.israel22@gmail.com</link><br/><link href="https://israel-oduguwa.vercel.app/">israel-oduguwa.vercel.app</link> | <link href="https://github.com/Israel-oduguwa">github.com/Israel-oduguwa</link>','contact')
p('Senior full-stack engineer with 6+ years designing and building production systems. Defined marketplace architecture, guided seven developers and migrated 5,000+ user accounts. Work spans backend and data services, cloud infrastructure, payment reliability and AI orchestration, with infrastructure cost reductions of more than 75%.')
p('Technical focus','section')
p('<b>Product:</b> TypeScript, JavaScript, React, Next.js, Tailwind CSS, Node.js, Express, NestJS, Python.<br/><b>Systems:</b> PostgreSQL, MongoDB, Firebase/Firestore, Stripe, authorization, background jobs, reconciliation, CI/CD, AWS, Google Cloud, Vercel.<br/><b>Applied AI:</b> retrieval-backed recommendations, embeddings, model evaluation, agent workflows, OpenAI integrations, Remotion and asynchronous media pipelines.','body')
p('Selected professional experience','section')
job('Excel Health Careers Training','Senior Software Engineer, contract','Mar 2025 - Apr 2026')
bullet('Redesigned the Next.js enrollment journey, increasing completed enrollments by <b>73%</b> and reducing manual operational work by <b>40%</b> during the contract period.')
bullet('Engineered the transaction layer across registration records, Stripe events, enrollment state and administration, supporting <b>8,000+ successful transactions</b>. Added event deduplication, reconciliation and recovery for delayed, failed and out-of-order delivery.')
bullet('Designed and launched an AI acquisition engine using registration and Stripe revenue data to select campaign workflows and measure results. The work contributed to a <b>60% increase in qualified student acquisition</b>, with quality gates and publishing checks before release.')
bullet('Orchestrated OpenAI, ElevenLabs, Remotion and AWS Lambda for asynchronous media generation. Verified bounded concurrency, progress polling, retries and rollback for render or publishing failures; generation completed in <b>under eight minutes per item</b>.')
job('KinsCare','Software Engineer; technical leadership','Oct 2022 - Dec 2025')
bullet('Migrated the React frontend to Next.js and modernized deployment and infrastructure, reducing infrastructure spend by <b>over 75%</b>. Recorded Lighthouse performance improved from <b>59 to 90</b>, with SEO at <b>100</b>.')
bullet('Defined marketplace architecture and guided <b>seven developers</b> through system design and code review across onboarding, geospatial matching, lead routing, subscriptions, conversations and administration.')
bullet('Planned and implemented the Realm-to-Clerk identity migration for <b>5,000+ users</b> despite limited exportable identity data, preserving account continuity and access.')
bullet('Built Python and Express pipelines to refresh, normalize and index thousands of school, course and healthcare records. Maintained model/data artifacts, embeddings and retrieval-backed recommendation APIs with cached results and persisted experiment assignments.')
bullet('Developed matching and triage workflows that reduced manual agent review by approximately <b>60%</b> and delivered qualified matches within <b>three days</b>.')
flow.append(PageBreak())
p('Israel Oduguwa','company')
p('Further experience, open-source work and education','meta')
p('Current engineering evaluation work','section')
job('micro1','AI Evaluation Expert / Frontend Software Engineer','Jul 2026 - Present')
bullet('Design source-grounded frontend software-engineering evaluation tasks using realistic technical prompts and structured reference materials to assess reasoning, correctness and instruction following.')
bullet('Create expert reference outputs and objective assessment criteria. Review generated technical deliverables for correctness, completeness, source use, performance, security and maintainability. Internal evaluation materials remain confidential.')
p('Open-source engineering','section')
job('SafeStripe','Creator, architecture and implementation','2026')
bullet('Designed five reliability contracts covering stable operation identity, durable webhook admission, worker ownership, guarded business effects and atomic state/outbox intent. Built the TypeScript engine, four database adapters and Express/Next.js integrations.')
bullet('Documented transaction and recovery limits with architecture decisions, runbooks and reproducible benchmarks. Added process-level worker failure tests and adapter conformance coverage.')
bullet('Retained a real Stripe sandbox lifecycle report covering twelve journeys. A duplicate replay added ten admissions while preserving the original Firestore paid receipt and paid time. Published version <b>0.3.0 as an evaluation preview</b>, with explicit production-validation limits.')
p('<link href="https://github.com/Israel-oduguwa/SafeStripe">github.com/Israel-oduguwa/SafeStripe</link> | <link href="https://israel-oduguwa.github.io/SafeStripe/">Documentation and public evidence</link>','meta')
p('Earlier experience','section')
job('Silicio','Full Stack Developer &amp; Frontend Instructor','Nov 2021 - Apr 2022')
bullet('Built registration, payment and administrative workflows for a training platform serving more than 400 students per semester. Taught and mentored <b>800+ learners</b> across two semesters.')
job('CareerAwesome','Full Stack Developer','Feb 2020 - Aug 2021')
bullet('Implemented client and server features for a job-discovery and career-planning MVP, working with product designers and engineers on personalized guidance and delivery.')
p('Education','section')
p('<b>B.Sc., Food Science and Technology</b><br/>Obafemi Awolowo University | 2018 - 2022')
p('Professional coursework','section')
p('<b>Building AI Agents with OpenAI</b> - Edureka, Coursera specialization | Apr 2026<br/>Three courses covering agent design, development and deployment. <link href="https://coursera.org/verify/specialization/J6PYEOZO0PN5">Verify credential</link>')
p('<b>Generative AI for NodeJS: OpenAI, LangChain - TypeScript</b> - Udemy, Alex Dan | Jul 2024<br/>7.5-hour course. <link href="https://www.udemy.com/certificate/UC-3eb8e8b7-669e-42de-bb6a-cc4766816210/">Verify credential</link>')
SimpleDocTemplate(str(out),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=40,bottomMargin=48,title='Israel Oduguwa - Senior Full Stack Software Engineer',author='Israel Oduguwa').build(flow,onFirstPage=footer,onLaterPages=footer)
print(out)
