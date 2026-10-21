import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Spring Boot to Microservices • 90-Day Study Tracker & Notes',
  description:
    'Structured study roadmap and engineering guide for mastering Java 21, Spring Boot 3, Kafka, Redis, Docker, Kubernetes, and Distributed Systems.',
  keywords: [
    'Spring Boot 3',
    'Microservices',
    'Java 21',
    'Apache Kafka',
    'Kubernetes',
    'Redis',
    'PostgreSQL',
    'Distributed Systems',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
