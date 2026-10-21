import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'SpringMaster • 3-Month Spring Boot to Microservices Tracker',
  description:
    'The premier 14-week study roadmap and progress tracker for mastering Java, Spring Boot 3, Microservices, Kafka, Docker, Kubernetes, and Distributed Systems.',
  keywords: [
    'Spring Boot 3',
    'Microservices',
    'Java 21',
    'Kafka',
    'Kubernetes',
    'Redis',
    'Docker',
    'Distributed Systems',
    'Spring AI',
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
