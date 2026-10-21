import { NextRequest, NextResponse } from 'next/server';

interface RequestPayload {
  phaseTitle?: string;
  topicTitle: string;
  subTopicTitle?: string;
  keyConcepts?: string[];
  mode?:
    | 'more-detailed'
    | 'regenerate-explanation'
    | 'regenerate-examples'
    | 'deep-dive'
    | 'code-walkthrough'
    | 'interview-drill'
    | 'troubleshooting'
    | 'custom';
  customQuery?: string;
  userApiKey?: string;
  previousExamplesContext?: string;
}

// Check configuration status
export async function GET() {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  return NextResponse.json({
    hasEnvKey,
    defaultModel: 'gemini-3.8-flash',
    supportedModes: [
      'more-detailed',
      'regenerate-explanation',
      'regenerate-examples',
      'deep-dive',
      'code-walkthrough',
      'interview-drill',
      'troubleshooting',
      'custom',
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestPayload = await req.json();
    const {
      phaseTitle,
      topicTitle,
      subTopicTitle,
      keyConcepts,
      mode = 'more-detailed',
      customQuery,
      userApiKey,
      previousExamplesContext,
    } = body;

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
            'No Gemini API key found. Please add GEMINI_API_KEY=your_key in your .env.local file.',
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

    let systemPrompt = '';

    if (mode === 'regenerate-explanation') {
      systemPrompt = `You are a Principal Java & Spring Boot Software Architect at a high-scale enterprise tech company.
The user wants a FRESH, deeper, and alternative in-depth technical explanation for:
- Main Topic: ${topicTitle}
${subTopicTitle ? `- Subtopic: ${subTopicTitle}` : ''}
${keyConcepts && keyConcepts.length > 0 ? `- Concepts: ${keyConcepts.join(', ')}` : ''}

Generate a crystal-clear, exhaustive explanation focusing on:
1. 🧠 **Deep Mental Model & Architectural Mechanics**:
   - Internal JVM memory model, bytecode/proxy mechanics, thread scheduling, and container lifecycle.
   - Exact execution sequence when a request hits this layer.
2. ⚡ **Why Earlier Alternatives Failed**:
   - Why simpler or traditional approaches break down under enterprise concurrency or high scale.
3. ⚠️ **Subtle Edge Cases**:
   - Edge cases that senior interviewers test for.

Write in authoritative, direct markdown. Zero generic buzzwords.`;
    } else if (mode === 'regenerate-examples') {
      systemPrompt = `You are a Principal Java & Spring Boot Software Architect at a high-scale enterprise tech company.
The user wants BRAND NEW, DISTINCT real-life enterprise production examples and code for:
- Main Topic: ${topicTitle}
${subTopicTitle ? `- Subtopic: ${subTopicTitle}` : ''}
${previousExamplesContext ? `- Note: The previous example covered: "${previousExamplesContext}". Generate a completely DIFFERENT industry domain (e.g. choose between FinTech Payments, Healthcare Patient Telemetry, High-Frequency Trading, Streaming Video Transcoding, or Logistics Fleet Routing).` : ''}

Generate:
1. 🏢 **Real-Life Enterprise Business Problem**:
   - Describe a realistic high-traffic enterprise production scenario (volume, latency requirements, failure consequences).
   - Architecture diagram (ASCII / flow).
2. 💻 **Production Java 21 & Spring Boot 3 Code**:
   - Complete, compile-ready, runnable production code implementing this exact real-life scenario.
   - Annotations, validation, proper exception handling, and virtual threads / modern records.
3. 🛡️ **Production Reliability & Gotchas**:
   - What fails under 10,000 RPS in this scenario and how the code guards against it.

Write in authoritative, direct markdown. Complete runnable code blocks.`;
    } else if (mode === 'more-detailed') {
      systemPrompt = `You are a Principal Java & Spring Boot Software Architect at a high-scale enterprise tech company.
The user requested a **More Detailed** breakdown with deep technical explanation AND real-life production examples for:
- Phase: ${phaseTitle || 'Spring Boot to Microservices'}
- Main Topic: ${topicTitle}
${subTopicTitle ? `- Subtopic: ${subTopicTitle}` : ''}
${keyConcepts && keyConcepts.length > 0 ? `- Key Concepts: ${keyConcepts.join(', ')}` : ''}
${customQuery ? `- Custom User Focus: ${customQuery}` : ''}

Generate an exhaustive, senior-level guide formatted in clean, rich Markdown with these explicit sections:

# ${subTopicTitle || topicTitle} — Detailed Technical Analysis & Real-Life Production Architecture

> **Executive Overview**: A 2-sentence summary of why this exists and what catastrophic problem it prevents in distributed systems.

---

### 1. 🧠 In-Depth Technical Explanation & Mechanics
- **How it works under the hood**: JVM heap layout, classloading, Spring container bean factory / proxy lifecycle (CGLIB vs JDK dynamic proxy), or network socket I/O.
- **Step-by-step internal execution lifecycle**: Trace what happens behind the scenes from the moment the code runs.
- **Why this design was chosen**: Compare directly against naïve alternatives and explain the trade-offs (latency vs throughput vs consistency).

---

### 2. 🏢 Real-Life Enterprise Production Scenarios
Provide 2 concrete, vivid real-world industry applications:
- **Scenario A (e.g. High-Scale Payments / E-Commerce)**: Exact business requirements, throughput targets, and how this technology solves it.
- **Scenario B (e.g. Real-Time Telemetry / Microservices Async Processing)**: Another distinct enterprise use case.
- **Architectural Flow**: Clear ASCII diagram illustrating the request/data pipeline.

---

### 3. 💻 Complete Production-Grade Java 21 & Spring Boot 3 Code
Write clean, compile-ready, modern code solving the real-life scenario:
- Modern Java 21 features (records, sealed interfaces, pattern matching).
- Production Spring Boot 3 annotations, configuration beans, proper thread boundaries.
- Error handling, timeouts, and metrics.
- Inline comments explaining non-obvious engineering decisions.

\`\`\`java
// Complete production implementation
\`\`\`

---

### 4. ⚠️ Enterprise Traps, Memory Leaks & Concurrency Gotchas
- 3 real production bugs/outages caused by misuse of this topic (e.g., connection starvation, proxy bypass, infinite recursion, memory leaks).
- Exact failure signature + the production fix.

---

### 5. 🎯 Senior Engineer Interview Drills
- **Interview Question 1**: Tricky architectural / concurrency scenario.
  - **Senior Model Answer**: Punchy, keyword-rich answer.
- **Interview Question 2**: Internal mechanics question.
  - **Senior Model Answer**: Deep-dive answer.
`;
    } else {
      systemPrompt = `You are a Principal Java & Spring Boot Software Architect at a high-scale enterprise tech company.
The user is studying a 3-month roadmap for high-paying Java/Spring Boot backend engineering roles.
Generate comprehensive documentation for:
Topic: ${topicTitle}
${subTopicTitle ? `Subtopic: ${subTopicTitle}` : ''}
${keyConcepts ? `Concepts: ${keyConcepts.join(', ')}` : ''}
${customQuery ? `Specific Query: ${customQuery}` : ''}
Focus: ${mode}`;
    }

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
