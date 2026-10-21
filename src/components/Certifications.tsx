"use client";

import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import TiltCard from "./TiltCard";

interface Cert {
  code: string;
  issuer: string;
  title: string;
  detail: string;
  issued: string;
  status: string;
  accent: string;
  verify?: string;
}

const CERTS: Cert[] = [
  {
    code: "CERT_01",
    issuer: "IBM · CEAAI1IN",
    title: "BUILDING AGENTS WITH AGENTIC AI",
    detail: "IBM Career Education Program",
    issued: "ISSUED: JUL 15 2026",
    status: "VERIFIED ●",
    accent: "#00FF66",
    verify: "https://courses.ibmcep.cognitiveclass.ai/certificates/47cdf744bfa94f4d89bbb8c774ff5f8e",
  },
  {
    code: "CERT_02",
    issuer: "Oracle University / Oracle",
    title: "Oracle Certified Foundations Associate — Agentic AI",
    detail: "Earned the Oracle Certified Foundations Associate credential in Agentic AI, demonstrating foundational knowledge of agentic AI concepts and the technologies used to build AI-driven applications. This certification supports my ongoing interest in large language models, AI application development and intelligent software systems.",
    issued: "ISSUED: 14 October 2026",
    status: "VALID UNTIL 14 October 2028",
    accent: "#00FF66",
    verify: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=A77920B781D4E9389DCC2F21AE4F353BF4BD10AD86372F16A43D3E85709E4D9A",
  },
  {
    code: "CERT_04",
    issuer: "Claude Academy",
    title: "Claude Code 101",
    detail: "Completed Claude Academy's Claude Code 101 course, developing foundational familiarity with Claude Code and AI-assisted coding workflows. This credential complements my interests in AI application development, software engineering and developer productivity.",
    issued: "ISSUED: 21 October 2026",
    status: "COMPLETE ●",
    accent: "#00FF66",
    verify: "https://academy.claude.com/verify/c48925bb3e12edf5eb9200fd977f9667"
  },
  {
    code: "CERT_03",
    issuer: "Deloitte, through Forage",
    title: "Data Analytics Job Simulation",
    detail: "Completed Deloitte's Data Analytics Job Simulation through Forage, gaining practical exposure to data-analysis workflows and the type of analytical problem-solving used in professional business scenarios.",
    issued: "ISSUED: 4 September 2026",
    status: "COMPLETE ●",
    accent: "#00E5FF",
    verify: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_6a9ad6df71585ae06467befb_1788536437153_completion_certificate.pdf"
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <SectionHeader
          label="Verified"
          title="CERTIFICATIONS"
          sub="Credential records verified against issuer databases."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {CERTS.map((cert, i) => (
            <Reveal key={cert.code} delay={i * 0.1} className="h-full">
              <TiltCard
                className="h-full p-6 bg-[#0B1713]/60 border hover:shadow-[inset_0_0_28px_rgba(0,255,102,0.08)] transition-all duration-300"
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-[#A7B0B0]">{cert.code}</span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded"
                      style={{ color: cert.accent, backgroundColor: `${cert.accent}14` }}
                    >
                      {cert.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#00E5FF] mb-1">{cert.issuer}</div>
                  <h3 className="text-xl font-mono font-bold text-[#F5F7F7] mb-2 leading-tight">
                    {cert.title}
                  </h3>
                  <div className="text-xs font-mono text-[#A7B0B0] mb-3">{cert.detail}</div>
                  <div className="text-xs font-mono text-[#A7B0B0] mb-4">{cert.issued}</div>
                  {cert.verify ? (
                    <a
                      href={cert.verify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] hover:bg-[#00FF66]/20 transition-colors"
                    >
                      VERIFY CREDENTIAL ↗
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs border border-white/10 text-[#A7B0B0]">
                      NO PUBLIC LINK // ON REQUEST
                    </span>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}