'use client';

import React from 'react';
import { CAPSTONE_BLUEPRINT } from '../data/milestonesData';
import {
  Layers,
  Sparkles,
  Server,
  Database,
  Shield,
  Zap,
  Cpu,
  GitBranch,
  Boxes,
  Workflow,
  CheckCircle2,
} from 'lucide-react';

export const CapstoneArchitectView: React.FC = () => {
  const techStack = [
    { name: 'Spring Boot 3.3+', category: 'Framework', color: 'border-emerald-500/40 text-emerald-300' },
    { name: 'Java 21 LTS (Virtual Threads)', category: 'Runtime', color: 'border-amber-500/40 text-amber-300' },
    { name: 'PostgreSQL 16 + PGVector', category: 'Database', color: 'border-blue-500/40 text-blue-300' },
    { name: 'Apache Kafka (KRaft)', category: 'Messaging', color: 'border-purple-500/40 text-purple-300' },
    { name: 'Redis (Cache + SETNX)', category: 'In-Memory', color: 'border-rose-500/40 text-rose-300' },
    { name: 'Spring Security 6 (JWT)', category: 'Security', color: 'border-cyan-500/40 text-cyan-300' },
    { name: 'Docker Multi-Stage & K8s', category: 'DevOps', color: 'border-teal-500/40 text-teal-300' },
    { name: 'Resilience4j Circuit Breaker', category: 'Fault Tolerance', color: 'border-orange-500/40 text-orange-300' },
    { name: 'Micrometer Tracing + Zipkin', category: 'Observability', color: 'border-pink-500/40 text-pink-300' },
    { name: 'Spring AI + MCP Server', category: 'AI & Tools', color: 'border-indigo-500/40 text-indigo-300' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            Capstone Project Blueprint
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build one deep, production-grade distributed payment platform that grows across all 10 phases.
          </p>
        </div>

        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-semibold max-w-xs">
          ⭐ <strong>Golden Rule:</strong> One deep project with real enterprise patterns is worth 10 tutorial clones on your resume.
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Enterprise Technology Stack
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl bg-slate-950/60 border ${tech.color} flex flex-col justify-between`}
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {tech.category}
              </span>
              <span className="text-xs font-bold text-white mt-1">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual System Architecture Diagram Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-emerald-400" />
          Target Microservices System Topology
        </h3>

        {/* Visual Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
          {/* Client / Gateway */}
          <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              GW
            </div>
            <strong className="text-white text-xs">Spring Cloud Gateway</strong>
            <span className="text-[10px] text-slate-400">
              JWT Validation • Redis Token Bucket Limiter • CORS
            </span>
          </div>

          {/* Order Service */}
          <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ORD
            </div>
            <strong className="text-white text-xs">Order Service</strong>
            <span className="text-[10px] text-slate-400">
              PostgreSQL • Transactional Outbox • SAGA Initiator
            </span>
          </div>

          {/* Payment Service */}
          <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              PAY
            </div>
            <strong className="text-white text-xs">Payment Service</strong>
            <span className="text-[10px] text-slate-400">
              Redis SETNX Idempotency • Striping • Compensation
            </span>
          </div>

          {/* Event Backbone */}
          <div className="p-4 bg-slate-900 border border-purple-500/40 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              KFK
            </div>
            <strong className="text-white text-xs">Apache Kafka</strong>
            <span className="text-[10px] text-slate-400">
              Partitioning by OrderId • acks=all • Dead Letter Topics
            </span>
          </div>
        </div>
      </div>

      {/* Evolution Step-by-Step Across Phases */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Boxes className="w-4 h-4 text-emerald-400" />
          10-Phase Evolution Roadmap
        </h3>

        <div className="space-y-3">
          {CAPSTONE_BLUEPRINT.phasesEvolution.map((item) => (
            <div
              key={item.phaseId}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  P{item.phaseId}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.phaseName}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                    {item.evolution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
