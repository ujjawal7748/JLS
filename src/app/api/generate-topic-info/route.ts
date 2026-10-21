import { NextRequest, NextResponse } from 'next/server';

interface RequestPayload {
  phaseTitle?: string;
  topicTitle: string;
  subTopicTitle?: string;
  keyConcepts?: string[];
  mode?: 'deep-dive' | 'code-walkthrough' | 'interview-drill' | 'troubleshooting' | 'custom';
  customQuery?: string;
  userApiKey?: string;
}

// Check configuration status
export async function GET() {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  return NextResponse.json({
    hasEnvKey,
    defaultModel: 'gemini-3.8-flash',
    supportedModes: ['deep-dive', 'code-walkthrough', 'interview-drill', 'troubleshooting', 'custom'],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestPayload = await req.json();
    const { phaseTitle, topicTitle, subTopicTitle, keyConcepts, mode = 'deep-dive', customQuery, userApiKey } = body;

    // Resolve API key priority: client header -> request body -> process.env
    const headerKey = req.headers.get('x-gemini-key');
    const apiKey =
      (headerKey && headerKey.trim()) ||
      (userApiKey && userApiKey.trim()) ||
      (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) ||
      (process.env.NEXT_PUBLIC_GEMINI_API_KEY && process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim());

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_API_KEY',
          message:
            'No Gemini API key found. Please add GEMINI_API_KEY=your_key in your .env.local file, or enter your key in the Deep Dive settings bar.',
        },
        { status: 400 }
      );
    }

    if (!topicTitle && !customQuery) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_INPUT',
          message: 'Please provide at least a topicTitle or customQuery.',
        },
        { status: 400 }
      );
    }

    // Build specialized prompt based on mode
    let promptObjective = '';
    if (mode === 'code-walkthrough') {
      promptObjective = 'Focus heavily on complete, production-grade Java 21 / Spring Boot 3.x code, configuration classes, best architectural patterns, and step-by-step walkthrough.';
    } else if (mode === 'interview-drill') {
      promptObjective = 'Focus heavily on high-difficulty Senior & Staff Engineer interview questions, tricky whiteboarding scenarios, edge cases, and high-signal model answers.';
    } else if (mode === 'troubleshooting') {
      promptObjective = 'Focus heavily on production outages, memory leaks, high-concurrency race conditions, database connection pool starvation, and how to debug & monitor with Actuator / Prometheus / OpenTelemetry.';
    } else {
      promptObjective = 'Provide an exhaustive 360° technical deep-dive covering conceptual depth, architecture, production code, edge cases, and senior interview drills.';
    }

    const systemPrompt = `You are a Principal Java & Spring Boot Software Architect at a high-scale enterprise tech company.
The user is studying a 3-month roadmap to secure a high-paying Backend Engineer / Spring Boot role.

Your task is to generate human-developer-grade, comprehensive, actionable documentation and masterclass study notes.
Write in a direct, authoritative, senior-engineer style. Avoid generic corporate fluff or superficial summaries.

Topic Context:
- Phase: ${phaseTitle || 'Spring Boot to Microservices'}
- Main Topic: ${topicTitle}
${subTopicTitle ? `- Subtopic / Sub-subtopic: ${subTopicTitle}` : ''}
${keyConcepts && keyConcepts.length > 0 ? `- Key Concepts to Address: ${keyConcepts.join(', ')}` : ''}
${customQuery ? `- User Specific Focus Query: ${customQuery}` : ''}

Primary Objective: ${promptObjective}

Generate the response in rich, formatted Markdown with these distinct sections:

# ${subTopicTitle || topicTitle} — Deep Technical Guide

> **Core Philosophy**: A 2-sentence executive summary explaining what problem this technology solves and why it is essential in enterprise systems.

---

### 1. 🧠 Architectural Breakdown & The "Why"
- Plain-language intuition followed by internal mechanics (JVM heap, Spring ApplicationContext, CGLIB / JDK dynamic proxies, thread scheduling, or network I/O).
- Why standard alternatives were insufficient (e.g., why Spring Security filter chain replaced raw servlets, why Kafka replaced basic DB queues, why WebClient replaced RestTemplate).

### 2. 🏗️ Enterprise Production Flow
- Describe how a real transaction or request flows through this component in production (e.g. in a distributed payments, orders, or banking service).
- ASCII or clear structured diagram illustrating the pipeline.

### 3. 💻 Complete Production-Grade Java 21 & Spring Boot 3.x Code
- Write modern, compile-ready, idiomatic code using Spring Boot 3.x and Java 21 features (records, pattern matching, virtual threads where applicable).
- Include necessary annotations (@Configuration, @Service, @Bean, validation, exception handling).
- Add crisp inline comments on non-obvious engineering decisions.

\`\`\`java
// Production-ready implementation
\`\`\`

### 4. ⚠️ Critical Production Gotchas, Memory Leaks & Anti-Patterns
- List 3 real-world traps that cause production outages or subtle bugs (e.g., @Transactional self-invocation proxy bypass, N+1 query problem, unbounded thread pools, Jackson infinite serialization recursion).
- For each gotcha: Explain the failure mode + provide the exact fix code.

### 5. 🎯 Senior Engineer Interview Drills
Provide 3 challenging, real-world interview questions frequently asked by FAANG / Tier-1 tech firms on this exact topic:
- **Q1**: Tricky architectural / concurrency scenario.
  - **Model Answer**: Crisp, senior-level response with the exact technical keywords interviewers look for.
- **Q2**: Internal implementation question (e.g. How does Spring manage bean scopes or connection pools?).
  - **Model Answer**: Deep technical explanation.
- **Q3**: Production troubleshooting question (e.g. How would you debug high CPU or DB connection pool exhaustion?).
  - **Model Answer**: Structured RCA (Root Cause Analysis) strategy.

### 6. 📺 Recommended Video Channels & Official Specs
- Top YouTube creators with specific topics (e.g., Amigoscode, Dan Vega, Bouali Ali, Vlad Mihalcea, ByteByteGo, Hussein Nasser).
- Official Spring.io / Java documentation URLs and RFC specs.
`;

    // Try models in order of capability & availability
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let generatedText: string | null = null;
    let successfulModel = '';

    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: systemPrompt }],
                },
              ],
              generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 8192,
              },
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status} from model ${model}`;
          continue;
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;

        if (text) {
          generatedText = text;
          successfulModel = model;
          break;
        }
      } catch (err: any) {
        lastError = err?.message || 'Network error calling Gemini API';
      }
    }

    if (!generatedText) {
      return NextResponse.json(
        {
          success: false,
          error: 'GENERATION_FAILED',
          message: lastError || 'Failed to generate content with Gemini API. Check your API key and quota.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      model: successfulModel,
      topicTitle,
      subTopicTitle,
      phaseTitle,
      markdown: generatedText,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating topic info:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: error?.message || 'Internal server error while generating topic info.',
      },
      { status: 500 }
    );
  }
}
