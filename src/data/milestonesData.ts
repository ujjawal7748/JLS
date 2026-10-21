import { Milestone, Badge } from '../types';

export const MILESTONES_DATA: Milestone[] = [
  {
    id: 'm-foundations',
    title: 'Milestone 1: Java & Relational Core Master',
    phaseIds: [0],
    targetWeek: 1,
    description: 'Master OOP pillars, collections internals, streams, and 20 SQL query challenges.',
    rewardBadgeId: 'badge-java-craftsman',
    xpReward: 250,
  },
  {
    id: 'm-spring-boot',
    title: 'Milestone 2: Production REST API Engineer',
    phaseIds: [1],
    targetWeek: 2,
    description: 'Build robust REST APIs with Spring Core DI, validation, DTOs, and global RFC 7807 error handling.',
    rewardBadgeId: 'badge-bean-master',
    xpReward: 350,
  },
  {
    id: 'm-data-persistence',
    title: 'Milestone 3: Database & ORM Whisperer',
    phaseIds: [2],
    targetWeek: 3,
    description: 'Conquer Hibernate N+1 queries, @Transactional proxies, entity relationships, and Flyway migrations.',
    rewardBadgeId: 'badge-orm-whisperer',
    xpReward: 400,
  },
  {
    id: 'm-security-sentinel',
    title: 'Milestone 4: Zero-Trust Security Sentinel',
    phaseIds: [3],
    targetWeek: 4,
    description: 'Implement stateless JWT authentication, Spring Security 6 filter chain, BCrypt, and RBAC.',
    rewardBadgeId: 'badge-security-sentinel',
    xpReward: 450,
  },
  {
    id: 'm-junior-gateway',
    title: '⭐ GATEWAY MILESTONE: Junior Job-Ready Threshold',
    phaseIds: [0, 1, 2, 3, 4],
    targetWeek: 6,
    description:
      'Completed Phases 0 through 4! Full testing with Mockito & Testcontainers, AOP, and GitHub Actions CI. You now qualify to apply for Junior Java / Spring Boot Backend roles!',
    rewardBadgeId: 'badge-junior-ready',
    xpReward: 800,
    isJuniorMilestone: true,
  },
  {
    id: 'm-caching-streaming',
    title: 'Milestone 5: Event & Cache Maestro',
    phaseIds: [5],
    targetWeek: 7,
    description: 'Deploy Redis Cache-Aside with TTL and stream distributed events through Apache Kafka partitions.',
    rewardBadgeId: 'badge-kafka-wrangler',
    xpReward: 500,
  },
  {
    id: 'm-microservices',
    title: 'Milestone 6: Cloud Microservices Commander',
    phaseIds: [6],
    targetWeek: 9,
    description: 'Orchestrate Spring Cloud Gateway, Eureka discovery, Resilience4j circuit breakers, and Zipkin distributed tracing.',
    rewardBadgeId: 'badge-cloud-commander',
    xpReward: 600,
  },
  {
    id: 'm-cloud-containers',
    title: 'Milestone 7: Kubernetes & Container Captain',
    phaseIds: [7],
    targetWeek: 10,
    description: 'Package microservices with multi-stage Dockerfiles and deploy with K8s Deployments, Services, and Probes on Minikube.',
    rewardBadgeId: 'badge-k8s-captain',
    xpReward: 600,
  },
  {
    id: 'm-distributed-patterns',
    title: 'Milestone 8: Distributed Systems Architect',
    phaseIds: [8],
    targetWeek: 12,
    description: 'Master Transactional Outbox, SAGA compensation, Redis SETNX idempotency, Token-Bucket rate limiting, and CAP trade-offs.',
    rewardBadgeId: 'badge-distributed-sage',
    xpReward: 800,
  },
  {
    id: 'm-reactive-pioneer',
    title: 'Milestone 9: Reactive Streaming Virtuoso',
    phaseIds: [9],
    targetWeek: 13,
    description: 'Non-blocking WebFlux event loops, R2DBC reactive PostgreSQL, and real-time Server-Sent Events (SSE).',
    rewardBadgeId: 'badge-reactive-virtuoso',
    xpReward: 700,
  },
  {
    id: 'm-ai-engineer',
    title: 'Milestone 10: Spring AI & Agentic Backend Pioneer',
    phaseIds: [10],
    targetWeek: 14,
    description: 'Implement Spring AI ChatClient, PGVector RAG embeddings, and Model Context Protocol (MCP) server tools.',
    rewardBadgeId: 'badge-ai-pioneer',
    xpReward: 800,
  },
  {
    id: 'm-grand-graduation',
    title: '🏆 THE GRAND FINISH: Senior Job-Ready Mastery',
    phaseIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    targetWeek: 14,
    description: 'Completed the full 14-week curriculum, capstone payment platform, and comprehensive interview checklists!',
    rewardBadgeId: 'badge-grand-architect',
    xpReward: 1500,
  },
];

export const BADGES_DATA: Badge[] = [
  {
    id: 'badge-java-craftsman',
    title: 'Java Craftsman',
    description: 'Mastered Java 17/21 OOP, collections, streams, and SQL foundations.',
    icon: '☕',
    criteria: 'Complete Phase 0 topics & mini-project',
    xpReward: 250,
  },
  {
    id: 'badge-bean-master',
    title: 'Bean Master',
    description: 'Mastered Spring Inversion of Control, scopes, REST APIs, and validation.',
    icon: '🌱',
    criteria: 'Complete Phase 1 topics & mini-project',
    xpReward: 350,
  },
  {
    id: 'badge-orm-whisperer',
    title: 'ORM Whisperer',
    description: 'Demolished the N+1 problem, mastered @Transactional, and automated migrations.',
    icon: '🗄️',
    criteria: 'Complete Phase 2 topics & mini-project',
    xpReward: 400,
  },
  {
    id: 'badge-security-sentinel',
    title: 'Security Sentinel',
    description: 'Secured APIs with Spring Security 6, JWT, BCrypt, and RBAC.',
    icon: '🛡️',
    criteria: 'Complete Phase 3 topics & mini-project',
    xpReward: 450,
  },
  {
    id: 'badge-junior-ready',
    title: 'Junior Backend Ready',
    description: 'Passed the foundational junior hiring threshold (Phases 0–4 + CI/CD).',
    icon: '🚀',
    criteria: 'Complete Phases 0 through 4',
    xpReward: 800,
  },
  {
    id: 'badge-kafka-wrangler',
    title: 'Kafka & Cache Wrangler',
    description: 'Architected high-throughput Kafka event streaming and Redis caching.',
    icon: '⚡',
    criteria: 'Complete Phase 5 topics & mini-project',
    xpReward: 500,
  },
  {
    id: 'badge-cloud-commander',
    title: 'Cloud Commander',
    description: 'Orchestrated Spring Cloud Gateway, Eureka, and Resilience4j circuit breakers.',
    icon: '☁️',
    criteria: 'Complete Phase 6 topics & mini-project',
    xpReward: 600,
  },
  {
    id: 'badge-k8s-captain',
    title: 'Kubernetes Captain',
    description: 'Containerized multi-stage builds and orchestrated pods on Kubernetes.',
    icon: '☸️',
    criteria: 'Complete Phase 7 topics & mini-project',
    xpReward: 600,
  },
  {
    id: 'badge-distributed-sage',
    title: 'Distributed Systems Sage',
    description: 'Implemented Transactional Outbox, SAGA compensation, and Redis idempotency.',
    icon: '🔮',
    criteria: 'Complete Phase 8 topics & mini-project',
    xpReward: 800,
  },
  {
    id: 'badge-reactive-virtuoso',
    title: 'Reactive Virtuoso',
    description: 'Harnessed WebFlux event loops, Project Reactor streams, and R2DBC.',
    icon: '🌊',
    criteria: 'Complete Phase 9 topics & mini-project',
    xpReward: 700,
  },
  {
    id: 'badge-ai-pioneer',
    title: 'Agentic AI Pioneer',
    description: 'Integrated Spring AI, vector embeddings, RAG, and MCP servers.',
    icon: '🧠',
    criteria: 'Complete Phase 10 topics & mini-project',
    xpReward: 800,
  },
  {
    id: 'badge-grand-architect',
    title: 'Grand Microservices Architect',
    description: 'Completed the full 14-week study guide, capstone system, and mock prep.',
    icon: '👑',
    criteria: 'Complete all 11 phases and checklists',
    xpReward: 1500,
  },
];

export const CAPSTONE_BLUEPRINT = {
  title: 'Production Distributed Payments & E-Commerce Platform',
  subtitle: 'A single deep project that grows from monolith to enterprise microservices mesh',
  phasesEvolution: [
    {
      phaseId: 1,
      phaseName: 'Phase 1: REST Monolith Baseline',
      evolution:
        'Single Spring Boot 3 app with Order & Catalog entities, REST endpoints, DTOs, and global ProblemDetail validation.',
    },
    {
      phaseId: 2,
      phaseName: 'Phase 2: Relational Persistence',
      evolution:
        'Attach PostgreSQL via Flyway, establish bidirectional @OneToMany relationships, resolve N+1 with JOIN FETCH, and enforce optimistic locking with @Version.',
    },
    {
      phaseId: 3,
      phaseName: 'Phase 3: Identity & Security',
      evolution:
        'Add Auth server issuing stateless JWT tokens, BCrypt hashing, and enforce RBAC with @PreAuthorize("hasRole(\'ADMIN\')") on management APIs.',
    },
    {
      phaseId: 4,
      phaseName: 'Phase 4: Test Suite & CI',
      evolution:
        'Add unit tests with Mockito, @DataJpaTest with Testcontainers PostgreSQL, custom @LogExecutionTime aspect, and automated GitHub Actions CI.',
    },
    {
      phaseId: 5,
      phaseName: 'Phase 5: Caching & Event Streaming',
      evolution:
        'Cache catalog products in Redis with TTL; emit OrderCreatedEvent to Kafka partition keyed by customerId, consumed by inventory service.',
    },
    {
      phaseId: 6,
      phaseName: 'Phase 6: Microservices Decomposition',
      evolution:
        'Split into order-service, inventory-service, and payment-service, orchestrated by Spring Cloud Gateway, Eureka discovery, Resilience4j circuit breakers, and Zipkin tracing.',
    },
    {
      phaseId: 7,
      phaseName: 'Phase 7: Containerization & Minikube',
      evolution:
        'Write multi-stage Dockerfiles, compose all services in docker-compose.yml, and deploy to Kubernetes with 2 replicas, ClusterIP, and Actuator health probes.',
    },
    {
      phaseId: 8,
      phaseName: 'Phase 8: Distributed Reliability Patterns',
      evolution:
        'Implement Transactional Outbox table in order-service with Kafka message relay, SAGA compensation for payment failures, and Redis SETNX idempotency keys.',
    },
    {
      phaseId: 9,
      phaseName: 'Phase 9: Real-Time Streaming',
      evolution:
        'Build a real-time order tracking dashboard streaming live status updates over Server-Sent Events (SSE) with Spring WebFlux and R2DBC.',
    },
    {
      phaseId: 10,
      phaseName: 'Phase 10: Spring AI & MCP Assistant',
      evolution:
        'Add AI Assistant using Spring AI ChatClient, PGVector RAG semantic search across orders, and expose backend methods as Model Context Protocol (MCP) tools.',
    },
  ],
};

export const JOB_READINESS_CHECKLIST = [
  {
    id: 'chk-ioc',
    label: 'I can clearly explain IoC, DI, bean scopes (Singleton vs Prototype), and Spring Boot auto-configuration without looking at notes.',
    phaseRef: 1,
  },
  {
    id: 'chk-rest',
    label: 'I can build a secure REST API with database persistence, validation, error handling, and unit/integration tests from scratch.',
    phaseRef: 1,
  },
  {
    id: 'chk-jpa',
    label: 'I can diagnose and fix the N+1 query problem, explain @Transactional proxy mechanics, and explain the self-invocation pitfall.',
    phaseRef: 2,
  },
  {
    id: 'chk-security',
    label: 'I can explain the full JWT request flow through the Spring Security 6 filter chain and know why BCrypt is preferred over SHA-256.',
    phaseRef: 3,
  },
  {
    id: 'chk-testing',
    label: 'I have a public GitHub repo with a clean README, Testcontainers tests, multi-stage Dockerfile, and an active GitHub Actions CI pipeline.',
    phaseRef: 4,
  },
  {
    id: 'chk-messaging',
    label: 'I have used Kafka (partitions, consumer groups, acks=all) and Redis (cache-aside, TTL, SETNX) in a real project, not just read docs.',
    phaseRef: 5,
  },
  {
    id: 'chk-microservices',
    label: 'I can draw a complete microservices architecture (Gateway, Eureka, Services, Tracing) on a whiteboard and explain every box.',
    phaseRef: 6,
  },
  {
    id: 'chk-patterns',
    label: 'I can explain the Transactional Outbox, SAGA compensation, Idempotency, and the CAP theorem using a concrete payment example.',
    phaseRef: 8,
  },
];

export const RESUME_BULLETS = [
  'Architected a production-grade distributed payments & commerce platform using Spring Boot 3, Apache Kafka, Redis, and PostgreSQL.',
  'Engineered a Choreography-based SAGA with the Transactional Outbox pattern, guaranteeing atomic event publishing and automatic failure compensation across distributed services.',
  'Hardened microservices mesh with Spring Security 6, stateless JWT authorization, Redis SETNX-based idempotency keys, and token-bucket rate limiting.',
  'Containerized services using layered multi-stage Docker builds (reducing image footprint by 65%) and orchestrated deployment on Kubernetes with automated health probes and GitHub Actions CI/CD.',
  'Eliminated database bottlenecks by optimizing JPA/Hibernate queries, resolving N+1 fetch cascades with JOIN FETCH, and implementing Redis Cache-Aside with strict TTL eviction policies.',
];
