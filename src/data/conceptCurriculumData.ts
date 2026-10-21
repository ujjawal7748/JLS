import { Phase } from '../types';

export const CONCEPT_CURRICULUM_DATA: Phase[] = [
  {
    id: 0,
    title: 'Phase 0: Java, SQL, Git & HTTP Foundations',
    subtitle: 'Core Language Mechanics & Protocol Engineering',
    weeksCompressed: '1–1.5 weeks',
    originalWeeks: '4–6 weeks',
    priority: 'Must',
    targetWeek: 'Week 1',
    whyItMatters:
      'Spring is a framework that heavily reflects, proxies, and calls your code. If language fundamentals like polymorphism, equals/hashCode, collections, streams, or exception hierarchies are shaky, Spring feels like black magic and debugging becomes sheer guesswork. Most failed backend interviews fail here.',
    fastTrackFocus:
      'Spend ~3 days on OOP, collections, exceptions, and streams (write code, do not just watch). 2 days on SQL (joins, group by, transactions, indexes) and 1 day on Git, Maven, and HTTP. Skim JVM, concurrency, and Java 21 features to master the vocabulary first.',
    overviewVideoQuery: 'https://www.youtube.com/results?search_query=java+full+course+for+beginners+2025',
    capstoneContribution:
      'Set up Git repository, Maven multi-module pom.xml structure, configure domain model baseline.',
    miniProject: {
      title: 'Console Banking / Library Engine & SQL 20-Query Suite',
      description:
        'A modular Java console application utilizing classes, interfaces, generic collections, and Stream pipelines with custom exceptions and unit tests. Followed by 20 production SQL queries on PostgreSQL.',
      requirements: [
        'Model Account, Transaction, Customer with proper Encapsulation & Records.',
        'Use HashMap & ConcurrentHashMap for thread-safe in-memory cache.',
        'Filter and aggregate transaction streams with Collectors.groupingBy and map.',
        'Write 20 complex SQL queries: Inner/Left Joins, GROUP BY HAVING, and window aggregations.',
      ],
      verificationSteps: [
        'Override equals and hashCode in your model and write a unit test demonstrating HashMap lookup.',
        'Run EXPLAIN ANALYZE on a join query with an index to observe cost difference.',
      ],
    },
    interviewQuestions: [],
    resources: [],
    topics: [
      {
        id: 'p0-t1-oop',
        phaseId: 0,
        title: 'Object-Oriented Programming (OOP) Deep Dive',
        summary: 'Encapsulation, Composition over Inheritance, Polymorphism in Spring DI, and Interface Abstraction.',
        keyConcepts: ['Encapsulation & Invariants', 'Composition over Inheritance', 'Dynamic Method Dispatch', 'Programming to Interfaces'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=java+OOP+concepts+explained+Amigoscode',
        interviewTip: 'Polymorphism is how Spring injects bean implementations via interfaces without modifying client code.',
        quizzes: [],
        subTopics: [
          {
            id: 'p0-st-oop-pillars',
            topicId: 'p0-t1-oop',
            title: 'The 4 Pillars of OOP & Spring Architectural Parallels',
            overview:
              'Understanding how Encapsulation, Inheritance, Polymorphism, and Abstraction form the mechanical foundation of modern Spring Framework architecture.',
            docUrl: 'https://docs.oracle.com/javase/tutorial/java/concepts/',
            docLabel: 'Oracle Java OOP Specification',
            youtube: {
              channelName: 'Amigoscode',
              searchQuery: 'Java OOP concepts full tutorial Amigoscode',
              url: 'https://www.youtube.com/results?search_query=java+OOP+concepts+Amigoscode',
            },
            subSubTopics: [
              {
                id: 'p0-sst-encapsulation',
                title: 'Encapsulation & Domain Invariants',
                conceptDetails:
                  'Encapsulation bundles data with behavior and conceals internal representation behind controlled accessors. In backend enterprise architecture, true encapsulation means domain objects enforce their own validation invariants (e.g., account balance cannot be negative) rather than exposing raw public setters where any external service can corrupt domain state.',
                codeSnippet: `// Production Pattern: Enforcing Encapsulation Invariants in Domain Entity
public class BankAccount {
    private final String accountNumber;
    private BigDecimal balance;

    public BankAccount(String accountNumber, BigDecimal initialDeposit) {
        if (initialDeposit.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Initial deposit cannot be negative");
        }
        this.accountNumber = accountNumber;
        this.balance = initialDeposit;
    }

    public synchronized void withdraw(BigDecimal amount) {
        if (amount.compareTo(balance) > 0) {
            throw new InsufficientFundsException("Insufficient funds for withdrawal");
        }
        this.balance = this.balance.subtract(amount);
    }
}`,
                keyTakeaways: [
                  'Keep mutable fields private and avoid boilerplate public setters.',
                  'Mutate state through expressive domain methods (e.g. account.withdraw()).',
                  'Ensures invariants remain intact across all concurrent caller threads.',
                ],
                interviewTrap:
                  'Don\'t confuse encapsulation with simple getter/setter boilerplate! An object with public getters and setters on every field is merely an anemic data bag, not an encapsulated entity.',
                docUrl: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
                youtube: {
                  channelName: 'Telusko',
                  searchQuery: 'Encapsulation in Java Telusko',
                  url: 'https://www.youtube.com/results?search_query=Encapsulation+in+Java+Telusko',
                },
              },
              {
                id: 'p0-sst-polymorphism',
                title: 'Polymorphism & Spring Dependency Injection',
                conceptDetails:
                  'Polymorphism allows one interface reference to manifest distinct runtime behaviors depending on the concrete class instance injected. In Spring, controllers and services declare dependencies on interfaces (e.g. PaymentGateway). At runtime, Spring polymorphically wires either StripePaymentGateway or PayPalPaymentGateway based on configuration.',
                codeSnippet: `// Polymorphic Spring Service Contract
public interface PaymentGateway {
    PaymentResult charge(BigDecimal amount, String customerToken);
}

@Service("stripeGateway")
public class StripePaymentGateway implements PaymentGateway {
    public PaymentResult charge(BigDecimal amount, String customerToken) {
        // Stripe SDK logic
        return new PaymentResult(true, "ch_stripe_123");
    }
}

@Service
public class CheckoutService {
    private final PaymentGateway paymentGateway;

    // Spring resolves implementation polymorphically
    public CheckoutService(@Qualifier("stripeGateway") PaymentGateway paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
}`,
                keyTakeaways: [
                  'Subtyping polymorphism decouples consumer classes from concrete implementations.',
                  'Enables trivial test mocking: swap production gateway with a MockPaymentGateway.',
                  'Spring IoC container relies heavily on interface-based runtime polymorphism.',
                ],
                interviewTrap:
                  'Be ready to explain the difference between Compile-time (Method Overloading) and Runtime (Method Overriding / Subtyping) polymorphism.',
                docUrl: 'https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html',
                youtube: {
                  channelName: 'Dan Vega',
                  searchQuery: 'Spring Dependency Injection polymorphism Dan Vega',
                  url: 'https://www.youtube.com/results?search_query=Spring+Dependency+Injection+Dan+Vega',
                },
              },
            ],
          },
          {
            id: 'p0-st-composition',
            topicId: 'p0-t1-oop',
            title: 'Composition over Inheritance & Fragile Base Class Problem',
            overview:
              'Why modern Java backend architecture avoids deep inheritance hierarchies and favors composing behavior via private interface instances.',
            docUrl: 'https://en.wikipedia.org/wiki/Composition_over_inheritance',
            docLabel: 'Design Patterns: Composition vs Inheritance',
            youtube: {
              channelName: 'Bouali Ali',
              searchQuery: 'Composition over Inheritance Java Bouali Ali',
              url: 'https://www.youtube.com/results?search_query=Composition+over+Inheritance+Java',
            },
            subSubTopics: [
              {
                id: 'p0-sst-fragile-base',
                title: 'The Fragile Base Class Trap',
                conceptDetails:
                  'Inheritance couples subclasses tightly to the internal implementation details of superclasses. If a superclass changes its internal method delegation, subclasses can break unexpectedly. Composition treats dependencies as black boxes behind interfaces, preventing unintended side effects.',
                codeSnippet: `// ❌ Fragile Inheritance
public class CustomHashSet extends HashSet<String> {
    private int addCount = 0;
    @Override public boolean add(String s) { addCount++; return super.add(s); }
    @Override public boolean addAll(Collection<? extends String> c) {
        // TRAP: super.addAll() internally calls add(), doubling addCount!
        addCount += c.size();
        return super.addAll(c);
    }
}

// ✅ Robust Composition (Wrapper/Decorator Pattern)
public class InstrumentedSet<E> implements Set<E> {
    private final Set<E> innerSet;
    private int addCount = 0;
    public InstrumentedSet(Set<E> set) { this.innerSet = set; }
    public boolean add(E e) { addCount++; return innerSet.add(e); }
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return innerSet.addAll(c);
    }
}`,
                keyTakeaways: [
                  'Inheritance violates encapsulation by exposing superclass internals.',
                  'Composition wraps the dependency as a private final field.',
                  'Used ubiquitously across Spring (e.g. DelegatingPasswordEncoder, FilterChainProxy).',
                ],
                interviewTrap:
                  'When asked about OOP best practices, always state: "Favor object composition over class inheritance (Item 18, Effective Java)".',
                youtube: {
                  channelName: 'Amigoscode',
                  searchQuery: 'Effective Java Composition Amigoscode',
                  url: 'https://www.youtube.com/results?search_query=Composition+over+Inheritance+Amigoscode',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'p0-t2-collections',
        phaseId: 0,
        title: 'Java Collections Framework Internals',
        summary: 'Deep dive into hashing, buckets, red-black trees, equals/hashCode contract, and ConcurrentHashMap.',
        keyConcepts: ['HashMap Bucket Indexing', 'TREEIFY_THRESHOLD = 8', 'equals() & hashCode() Contract', 'ConcurrentHashMap Lock Striping'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=java+collections+hashmap+internals+Telusko',
        interviewTip: 'Know what happens when two unequal keys return the same hashCode: hash collision handled by linked list chaining, converted to a Red-Black tree if binCount >= 8.',
        quizzes: [],
        subTopics: [
          {
            id: 'p0-st-hashmap',
            topicId: 'p0-t2-collections',
            title: 'HashMap Internals & Collision Resolution',
            overview:
              'Understanding bucket arrays, bitwise index hashing, linked list chaining, and Red-Black treeification in Java 8+.',
            docUrl: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html',
            docLabel: 'Oracle Java 21 HashMap API',
            youtube: {
              channelName: 'Telusko',
              searchQuery: 'How HashMap works internally in Java Telusko',
              url: 'https://www.youtube.com/results?search_query=How+HashMap+works+internally+in+Java+Telusko',
            },
            subSubTopics: [
              {
                id: 'p0-sst-hash-buckets',
                title: 'Bucket Resolution & Treeification',
                conceptDetails:
                  'Java HashMap maintains an array of Node<K,V>[] buckets. When key is inserted, its hashCode() is perturbed via (h ^ (h >>> 16)) to distribute entropy, and bucket index is computed as (n - 1) & hash. When multiple keys hash to the same bucket, collisions chain in a singly linked list. When a bucket reaches TREEIFY_THRESHOLD (8 items) and table capacity >= 64, it converts to a Red-Black Tree (TreeNode) improving search from O(n) to O(log n).',
                codeSnippet: `// JDK HashMap Bucket Index Calculation
static final int hash(Object key) {
    int h;
    // XOR higher 16 bits with lower 16 bits to prevent clustering
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

// Fast bitwise modulo (only works because table length 'n' is power of 2)
int bucketIndex = (n - 1) & hash;`,
                keyTakeaways: [
                  'Default initial capacity is 16; default load factor is 0.75.',
                  'Table resizes by 2x when size exceeds (capacity * loadFactor).',
                  'Java converts linked list bin to Red-Black tree at 8 entries to defend against HashDoS attacks.',
                ],
                interviewTrap:
                  'Why must HashMap table size always be a power of 2? Because (n - 1) & hash is computationally identical to hash % n, but runs in 1 CPU cycle using bitwise AND!',
                youtube: {
                  channelName: 'Java Techie',
                  searchQuery: 'HashMap internal working Java Techie',
                  url: 'https://www.youtube.com/results?search_query=HashMap+internal+working+Java+Techie',
                },
              },
              {
                id: 'p0-sst-equals-hashcode',
                title: 'The equals() and hashCode() Contract',
                conceptDetails:
                  'If obj1.equals(obj2) is true, their hashCode() MUST return the exact same integer. If you override equals() without hashCode(), two logically identical objects compute different hash codes, landing in completely different buckets. A map.get(key) call will fail to find the value even though equals() would evaluate to true.',
                codeSnippet: `// Best Practice: Proper equals and hashCode in Java 17+
public class CustomerId {
    private final String tenantId;
    private final long userId;

    public CustomerId(String tenantId, long userId) {
        this.tenantId = Objects.requireNonNull(tenantId);
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CustomerId that)) return false;
        return userId == that.userId && tenantId.equals(that.tenantId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tenantId, userId);
    }
} // Or simply use: public record CustomerId(String tenantId, long userId) {}`,
                keyTakeaways: [
                  'Contract rule: a.equals(b) => a.hashCode() == b.hashCode().',
                  'Unequal objects CAN have identical hash codes (hash collision).',
                  'In Java 17+, prefer Records which auto-generate flawless equals() and hashCode().',
                ],
                interviewTrap:
                  'What happens if you mutate an object that is already stored as a key in a HashMap? Its hashCode changes, so future get() calls will search the wrong bucket and return null, creating a silent memory leak!',
                docUrl: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html#hashCode()',
                youtube: {
                  channelName: 'Amigoscode',
                  searchQuery: 'equals and hashCode Java Amigoscode',
                  url: 'https://www.youtube.com/results?search_query=equals+and+hashCode+Java+Amigoscode',
                },
              },
              {
                id: 'p0-sst-concurrenthashmap',
                title: 'ConcurrentHashMap: Lock Striping & CAS',
                conceptDetails:
                  'Hashtable and Collections.synchronizedMap() synchronize every single method, blocking all threads. ConcurrentHashMap achieves high concurrent throughput: reads are lock-free; empty bucket insertions use atomic Compare-And-Swap (CAS); non-empty bucket insertions synchronize only on the head node of that specific bucket bin.',
                codeSnippet: `// Thread-Safe Concurrent In-Memory Cache Pattern
public class TokenCache {
    private final ConcurrentHashMap<String, UserSession> sessionCache = new ConcurrentHashMap<>();

    public UserSession getOrCreateSession(String token, String userId) {
        // Atomic computeIfAbsent: lock is held only on the specific bucket
        return sessionCache.computeIfAbsent(token, k -> new UserSession(userId, System.currentTimeMillis()));
    }
}`,
                keyTakeaways: [
                  'Null keys and null values are strictly forbidden in ConcurrentHashMap.',
                  'Reads require zero locking (volatile reads).',
                  'Writes lock only the collision bin head node, not the entire map.',
                ],
                interviewTrap:
                  'Why does ConcurrentHashMap reject null keys/values? Because in multithreaded environments, map.get(k) returning null creates an unresolvable race condition between "key was absent" and "key was mapped to null".',
                youtube: {
                  channelName: 'Defog Tech',
                  searchQuery: 'ConcurrentHashMap internal working Defog Tech',
                  url: 'https://www.youtube.com/results?search_query=ConcurrentHashMap+internal+working',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'p0-t3-modern-java',
        phaseId: 0,
        title: 'Streams, Lambdas & Modern Java (17 & 21)',
        summary: 'Stream pipelines, Collectors, Optional patterns, Java 17 Records, and Java 21 Virtual Threads.',
        keyConcepts: ['Lazy Stream Evaluation', 'Collectors.groupingBy', 'Records as Immutable DTOs', 'Virtual Threads & Carrier Pinning'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=java+17+21+features+virtual+threads+Dan+Vega',
        interviewTip: 'Virtual threads unmount from carrier threads during blocking I/O, enabling millions of concurrent connections without reactive complexity.',
        quizzes: [],
        subTopics: [
          {
            id: 'p0-st-streams',
            topicId: 'p0-t3-modern-java',
            title: 'Java Streams & Functional Pipelines',
            overview:
              'Mastering intermediate lazy operators (map, filter, flatMap) and terminal collectors (groupingBy, toList).',
            docUrl: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html',
            docLabel: 'Java Streams API Reference',
            youtube: {
              channelName: 'Amigoscode',
              searchQuery: 'Java Streams tutorial Amigoscode',
              url: 'https://www.youtube.com/results?search_query=Java+Streams+tutorial+Amigoscode',
            },
            subSubTopics: [
              {
                id: 'p0-sst-stream-collectors',
                title: 'Stream Pipelines & Advanced Collectors',
                conceptDetails:
                  'Streams are lazy declarative pipelines. Intermediate operations (filter, map) merely construct an execution graph; computation executes only when a terminal operation (collect, findFirst) is called. Collectors.groupingBy partitions data into Map structures in one pass.',
                codeSnippet: `// Advanced Stream Pipeline: Aggregate Orders by Status
public Map<OrderStatus, BigDecimal> calculateRevenueByStatus(List<Order> orders) {
    return orders.stream()
        .filter(order -> order.getCreatedAt().isAfter(Instant.now().minus(30, ChronoUnit.DAYS)))
        .collect(Collectors.groupingBy(
            Order::getStatus,
            Collectors.reducing(BigDecimal.ZERO, Order::getTotalAmount, BigDecimal::add)
        ));
}`,
                keyTakeaways: [
                  'Intermediate operations are lazy; terminal operations trigger execution.',
                  'Never use Streams to perform heavy state mutations with side effects.',
                  'Collectors.groupingBy is a standard interview test question.',
                ],
                interviewTrap:
                  'Never reuse a closed Stream! Once a terminal operation is called, the stream is consumed. Attempting another operation throws IllegalStateException: stream has already been operated upon or closed.',
                youtube: {
                  channelName: 'Java Techie',
                  searchQuery: 'Java Streams groupingBy Collectors Java Techie',
                  url: 'https://www.youtube.com/results?search_query=Java+Streams+groupingBy+Java+Techie',
                },
              },
              {
                id: 'p0-sst-virtual-threads',
                title: 'Java 21 Virtual Threads (Project Loom)',
                conceptDetails:
                  'Traditional Java platform threads map 1:1 to heavy OS kernel threads (~1MB stack), capping concurrency at a few thousand threads before exhausting RAM. Java 21 Virtual Threads are lightweight JVM-managed user-mode threads (bytes of heap). When blocking on network or database I/O, the JVM unmounts the virtual thread from its underlying OS carrier thread, allowing the carrier thread to execute other work.',
                codeSnippet: `// Configuring Java 21 Virtual Threads in Spring Boot 3.2+
// application.properties:
// spring.threads.virtual.enabled=true

// Manual Virtual Thread Executor
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1)); // Unmounts carrier thread!
            return "Task " + i;
        });
    });
} // Auto-waits for all 10,000 tasks to finish!`,
                keyTakeaways: [
                  'Enables standard blocking code to scale to millions of concurrent requests.',
                  'Activated with one line: spring.threads.virtual.enabled=true.',
                  'Eliminates the primary reason to adopt complex reactive WebFlux frameworks for CRUD.',
                ],
                interviewTrap:
                  'What is Carrier Thread Pinning in Java 21? When a virtual thread blocks inside a synchronized block or native method, it cannot unmount from its carrier thread. Fix by replacing synchronized with java.util.concurrent.locks.ReentrantLock!',
                docUrl: 'https://openjdk.org/jeps/444',
                docLabel: 'JEP 444: Virtual Threads Specification',
                youtube: {
                  channelName: 'Dan Vega',
                  searchQuery: 'Java 21 Virtual Threads Spring Boot Dan Vega',
                  url: 'https://www.youtube.com/results?search_query=Java+21+Virtual+Threads+Spring+Boot+Dan+Vega',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'p0-t4-sql',
        phaseId: 0,
        title: 'Relational SQL, Indexes & ACID Transactions',
        summary: 'Mastering Joins, B-Tree index mechanics, leftmost prefix rule, and transaction isolation anomalies.',
        keyConcepts: ['INNER vs LEFT JOIN', 'B-Tree Leftmost Prefix Rule', 'ACID Properties', 'Dirty Reads vs Phantom Reads'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=sql+indexing+transactions+acid+Hussein+Nasser',
        interviewTip: 'Indexes speed up SELECT queries but slow down INSERT, UPDATE, and DELETE because the B-Tree must be rebalanced.',
        quizzes: [],
        subTopics: [
          {
            id: 'p0-st-indexing',
            topicId: 'p0-t4-sql',
            title: 'B-Tree Indexes & Query Execution Plans',
            overview:
              'How relational databases traverse B-Tree index pages and why bad query design triggers full sequential table scans.',
            docUrl: 'https://www.postgresql.org/docs/current/indexes-types.html',
            docLabel: 'PostgreSQL Index Types Guide',
            youtube: {
              channelName: 'Hussein Nasser',
              searchQuery: 'Database Indexing B-Tree Hussein Nasser',
              url: 'https://www.youtube.com/results?search_query=Database+Indexing+B-Tree+Hussein+Nasser',
            },
            subSubTopics: [
              {
                id: 'p0-sst-leftmost-prefix',
                title: 'Composite Indexes & The Leftmost Prefix Rule',
                conceptDetails:
                  'A composite index on columns (tenant_id, created_at, status) organizes keys lexicographically starting with tenant_id. Queries filtering by tenant_id, or by (tenant_id, created_at), traverse the index tree efficiently. However, a query filtering solely on status CANNOT use this index because the root nodes are ordered by tenant_id.',
                codeSnippet: `// PostgreSQL Composite Index Creation
CREATE INDEX idx_orders_tenant_date_status 
ON orders (tenant_id, created_at DESC, status);

-- ✅ Uses index fully (matches leftmost prefix):
SELECT * FROM orders WHERE tenant_id = 'org_42' AND created_at > '2026-01-01';

-- ❌ Ignores index (violates leftmost prefix, triggers Seq Scan):
SELECT * FROM orders WHERE status = 'PENDING';`,
                keyTakeaways: [
                  'Place high-cardinality equality columns first in composite indexes.',
                  'Range filters (<, >) should follow equality filters.',
                  'Always use EXPLAIN ANALYZE in PostgreSQL to verify index usage.',
                ],
                interviewTrap:
                  'Wrapping an indexed column in a function (e.g. WHERE LOWER(email) = "x") disables standard B-Tree indexes! You must create an expression-based index: CREATE INDEX ON users (LOWER(email)).',
                youtube: {
                  channelName: 'Hussein Nasser',
                  searchQuery: 'Database B-Tree Index Hussein Nasser',
                  url: 'https://www.youtube.com/results?search_query=Database+Index+Hussein+Nasser',
                },
              },
              {
                id: 'p0-sst-acid-isolation',
                title: 'ACID Properties & Isolation Anomalies',
                conceptDetails:
                  'ACID guarantees reliability: Atomicity (WAL journals), Consistency (schema constraints), Isolation (concurrency control), and Durability (fsync to disk). Concurrency anomalies include: 1) Dirty Read (reading uncommitted write), 2) Non-Repeatable Read (row changes between 2 reads), 3) Phantom Read (new rows inserted matching range).',
                codeSnippet: `// SQL Isolation Level Summary Matrix:
-- Read Uncommitted: Allows Dirty Reads, Non-Repeatable Reads, Phantoms
-- Read Committed:   Prevents Dirty Reads (Default in PostgreSQL & Oracle)
-- Repeatable Read:  Prevents Dirty & Non-Repeatable Reads (Default in MySQL)
-- Serializable:     Prevents ALL anomalies (Strict sequential simulation)`,
                keyTakeaways: [
                  'PostgreSQL defaults to Read Committed.',
                  'Dirty reads are impossible in Read Committed.',
                  'Serializable isolation prevents race conditions but risks serialization failure rollbacks.',
                ],
                interviewTrap:
                  'What is a Dirty Read? Transaction A reads an uncommitted change from Transaction B. If Transaction B rolls back, Transaction A operated on hallucinated phantom data!',
                docUrl: 'https://www.postgresql.org/docs/current/transaction-iso.html',
                youtube: {
                  channelName: 'Hussein Nasser',
                  searchQuery: 'ACID Isolation Levels Hussein Nasser',
                  url: 'https://www.youtube.com/results?search_query=ACID+Isolation+Levels+Hussein+Nasser',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 1,
    title: 'Phase 1: Spring Core, Spring Boot, MVC & REST APIs',
    subtitle: 'The Heart of the Enterprise Java Backend Job',
    weeksCompressed: '1.5 weeks',
    originalWeeks: '4–5 weeks',
    priority: 'Must',
    targetWeek: 'Week 2',
    whyItMatters:
      'Almost every backend Java role evaluates Spring Core, Dependency Injection, request lifecycle, RESTful design, and validation. Candidates who cannot explain Inversion of Control or how DispatcherServlet converts a request fail in the first 15 minutes.',
    fastTrackFocus:
      'Master DI and beans, auto-configuration principles, REST CRUD, Jakarta validation, global exception handlers (@RestControllerAdvice), and DTO mapping. Swagger, Actuator, and DevTools take under an hour each.',
    overviewVideoQuery: 'https://www.youtube.com/results?search_query=spring+boot+3+full+course+for+beginners+2025',
    capstoneContribution:
      'Initialize Order & Catalog REST API services with clean controller-service-repository layered architecture and global ProblemDetail error handling.',
    miniProject: {
      title: 'Production-Grade Task / Catalog REST API',
      description:
        'Complete CRUD API with Jakarta validation, @RestControllerAdvice exception handling, MapStruct DTO mapping, OpenAPI/Swagger docs, Actuator health metrics, and dev/prod profile switching.',
      requirements: [
        'Constructor injection throughout; zero field @Autowired.',
        'Custom response envelope or RFC 7807 ProblemDetail format for errors.',
        'DTO separation: Never expose raw entity objects to API consumers.',
        'Springdoc OpenAPI integration with interactive Swagger UI at /swagger-ui.html.',
      ],
      verificationSteps: [
        'Send invalid POST request and verify 400 Bad Request with field-level validation messages.',
        'Verify /actuator/health returns {"status":"UP"} and /actuator/metrics is operational.',
      ],
    },
    interviewQuestions: [],
    resources: [],
    topics: [
      {
        id: 'p1-t1-ioc',
        phaseId: 1,
        title: 'Inversion of Control (IoC) & Dependency Injection (DI)',
        summary: 'Container mechanics, constructor injection, @Qualifier, and BeanPostProcessor proxies.',
        keyConcepts: ['IoC Principle', 'Constructor Injection Immutability', '@Primary vs @Qualifier', 'ApplicationContext Lifecycle'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=spring+ioc+dependency+injection+Dan+Vega',
        interviewTip: 'Always favor constructor injection: it allows final fields, prevents circular dependency bugs, and makes unit testing effortless.',
        quizzes: [],
        subTopics: [
          {
            id: 'p1-st-ioc-di',
            topicId: 'p1-t1-ioc',
            title: 'IoC Principle vs DI Implementation',
            overview:
              'How the Spring ApplicationContext manages object lifecycles, and why constructor injection is the industry gold standard.',
            docUrl: 'https://docs.spring.io/spring-framework/reference/core/beans/introduction.html',
            docLabel: 'Spring Framework IoC Documentation',
            youtube: {
              channelName: 'Dan Vega',
              searchQuery: 'Spring Dependency Injection Constructor Injection Dan Vega',
              url: 'https://www.youtube.com/results?search_query=Spring+Dependency+Injection+Dan+Vega',
            },
            subSubTopics: [
              {
                id: 'p1-sst-constructor-injection',
                title: 'Constructor vs Field Injection (@Autowired)',
                conceptDetails:
                  'Field injection (@Autowired on private fields) relies on reflection to mutate fields after object construction. This hides dependencies, forbids final immutable fields, and makes unit testing impossible without starting a heavy Spring context. Constructor injection makes dependencies explicit, enforces immutability via final fields, and fails compilation if dependencies are missing.',
                codeSnippet: `// ❌ Anti-Pattern: Field Injection
@Service
public class OrderService {
    @Autowired
    private PaymentClient paymentClient; // Not final, hidden dependency
}

// ✅ Best Practice: Constructor Injection with final fields
@Service
public class OrderService {
    private final PaymentClient paymentClient;
    private final OrderRepository orderRepository;

    // In Spring 4.3+, single constructor does NOT need @Autowired
    public OrderService(PaymentClient paymentClient, OrderRepository orderRepository) {
        this.paymentClient = Objects.requireNonNull(paymentClient);
        this.orderRepository = Objects.requireNonNull(orderRepository);
    }
}`,
                keyTakeaways: [
                  'Constructor injection supports final immutable fields.',
                  'Prevents NullPointerExceptions during isolated Mockito unit testing.',
                  'Detects circular dependencies at application startup.',
                ],
                interviewTrap:
                  'Why avoid @Autowired on fields? Because you cannot instantiate the service manually in a unit test (`new OrderService()`) without using slow reflection or running the full Spring container.',
                docUrl: 'https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html#beans-constructor-injection',
                youtube: {
                  channelName: 'Amigoscode',
                  searchQuery: 'Why field injection is evil Spring Boot Amigoscode',
                  url: 'https://www.youtube.com/results?search_query=Why+field+injection+is+evil+Amigoscode',
                },
              },
              {
                id: 'p1-sst-scopes-lifecycle',
                title: 'Bean Scopes & The Singleton Concurrency Trap',
                conceptDetails:
                  'Spring beans are Singletons by default (one shared instance per ApplicationContext). Because Tomcat serves each HTTP request on a separate worker thread, hundreds of concurrent threads invoke methods on the SAME singleton bean instance simultaneously. Never store request-specific mutable state in singleton bean instance fields!',
                codeSnippet: `// 🚨 FATAL PRODUCTION TRAP: Mutable instance state in Singleton Bean!
@Service
public class ReportService {
    // Shared across ALL user threads! Concurrency race condition catastrophe!
    private String currentReportUser; 

    public void generateReport(String userId) {
        this.currentReportUser = userId; // Thread B overwrites Thread A's user!
        executeSlowJob();
    }
}

// ✅ Correct Pattern: Pass state via method parameters (Thread Stack)
@Service
public class ReportService {
    public void generateReport(String userId) {
        // userId lives safely on the current thread's private stack frame
        executeSlowJob(userId);
    }
}`,
                keyTakeaways: [
                  'Singleton scope is default; Prototype scope creates new instance on each lookup.',
                  'Singleton beans must be strictly stateless.',
                  'Use method parameters or ThreadLocal for request-scoped state.',
                ],
                interviewTrap:
                  'What happens when a Singleton bean injects a Prototype bean via constructor injection? The prototype is resolved ONLY ONCE when the singleton initializes, rendering the prototype an accidental singleton! Use ObjectFactory or @Lookup to obtain fresh prototypes.',
                docUrl: 'https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html',
                youtube: {
                  channelName: 'Telusko',
                  searchQuery: 'Spring Bean Scopes Singleton Prototype Telusko',
                  url: 'https://www.youtube.com/results?search_query=Spring+Bean+Scopes+Telusko',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'p1-t2-mvc-rest',
        phaseId: 1,
        title: 'Spring MVC, REST APIs & Global Validation',
        summary: 'DispatcherServlet flow, Jakarta validation, @RestControllerAdvice, and RFC 7807 ProblemDetail.',
        keyConcepts: ['DispatcherServlet Front Controller', 'HttpMessageConverter', 'Jakarta Bean Validation', 'RFC 7807 ProblemDetail'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=spring+boot+rest+controlleradvice+problemdetail+Bouali+Ali',
        interviewTip: 'Never expose JPA entities directly from controllers. Use DTOs with MapStruct to prevent schema leaks and circular JSON references.',
        quizzes: [],
        subTopics: [
          {
            id: 'p1-st-dispatcher',
            topicId: 'p1-t2-mvc-rest',
            title: 'DispatcherServlet Request Flow',
            overview:
              'Step-by-step trace of how an HTTP packet enters the Tomcat container and resolves to a JSON response.',
            docUrl: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html',
            docLabel: 'Spring MVC DispatcherServlet Architecture',
            youtube: {
              channelName: 'Bouali Ali',
              searchQuery: 'Spring Boot DispatcherServlet architecture Bouali Ali',
              url: 'https://www.youtube.com/results?search_query=Spring+Boot+DispatcherServlet+architecture+Bouali+Ali',
            },
            subSubTopics: [
              {
                id: 'p1-sst-dispatch-flow',
                title: 'The 7-Step DispatcherServlet Request Cycle',
                conceptDetails:
                  '1) Request hits DispatcherServlet (Front Controller). 2) Queries HandlerMapping to locate matching @RestController method. 3) Delegates to HandlerAdapter. 4) HandlerMethodArgumentResolver parses parameters and executes @Valid validation. 5) Controller executes service business logic. 6) HttpMessageConverter (Jackson) serializes return object into JSON. 7) Response returned through servlet filter chain to client.',
                codeSnippet: `// Architecture Request Flow:
// Client Request -> DispatcherServlet
//      -> HandlerMapping (finds /api/v1/orders)
//      -> HandlerAdapter
//      -> @RestController method execution
//      -> MappingJackson2HttpMessageConverter (Object -> JSON)
//      -> HTTP 200/201 Response`,
                keyTakeaways: [
                  'DispatcherServlet is the front controller coordinating Spring MVC.',
                  'Jackson HttpMessageConverter converts Java POJOs/Records to JSON.',
                  'Exceptions bubble up to @RestControllerAdvice handlers.',
                ],
                interviewTrap:
                  'Be ready to sketch this 7-step diagram on a whiteboard in any Senior Spring Boot interview!',
                youtube: {
                  channelName: 'Java Techie',
                  searchQuery: 'Spring MVC DispatcherServlet request flow Java Techie',
                  url: 'https://www.youtube.com/results?search_query=Spring+MVC+DispatcherServlet+flow+Java+Techie',
                },
              },
              {
                id: 'p1-sst-error-handling',
                title: 'RFC 7807 ProblemDetail & @RestControllerAdvice',
                conceptDetails:
                  'Spring Boot 3 standardizes REST API error responses using the IETF RFC 7807 specification. Instead of returning raw 500 stack traces or non-standard error maps, @RestControllerAdvice catches MethodArgumentNotValidException or domain exceptions and returns structured ProblemDetail objects.',
                codeSnippet: `// Production RFC 7807 Global Exception Handler
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "Request payload validation failed"
        );
        problem.setTitle("Validation Failure");
        problem.setType(URI.create("https://api.example.com/errors/validation"));

        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
        problem.setProperty("invalidFields", fieldErrors);
        return problem;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }
}`,
                keyTakeaways: [
                  'RFC 7807 provides a machine-readable standard (status, title, detail, type).',
                  '@RestControllerAdvice centralizes error responses across all controllers.',
                  'Prevents leaking database table names or internal stack traces to clients.',
                ],
                interviewTrap:
                  'Never return raw internal server exceptions to clients in production! It creates severe security vulnerabilities by leaking database engines and library versions.',
                docUrl: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html',
                youtube: {
                  channelName: 'Dan Vega',
                  searchQuery: 'Spring Boot 3 Problem Details RFC 7807 Dan Vega',
                  url: 'https://www.youtube.com/results?search_query=Spring+Boot+3+Problem+Details+Dan+Vega',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Phase 2: Data Access (JPA, Hibernate, SQL & NoSQL)',
    subtitle: 'Persistence Engineering, Proxies & Query Optimization',
    weeksCompressed: '1 week',
    originalWeeks: '3–4 weeks',
    priority: 'Must',
    targetWeek: 'Week 3',
    whyItMatters:
      'Nearly every backend application stores data, and JPA/Hibernate is where 80% of production performance catastrophes and concurrency bugs originate. Interviewers ruthlessly probe N+1 queries, transaction proxies, and lazy loading.',
    fastTrackFocus:
      'Focus deeply on relationships, reproduce and fix the N+1 problem, @Transactional proxy rules (and the self-invocation pitfall), derived queries, and pagination. Skim Envers and Specifications.',
    overviewVideoQuery: 'https://www.youtube.com/results?search_query=spring+data+jpa+hibernate+full+course+spring+boot+3',
    capstoneContribution:
      'Design PostgreSQL schema with Flyway migrations, implement Order, OrderItem, and Customer entities with @Version optimistic locking and audited timestamps.',
    miniProject: {
      title: 'PostgreSQL E-Commerce Data Layer with N+1 Diagnostic Suite',
      description:
        'Complete relational data persistence tier with bidirectional @OneToMany relationships, Flyway schema migrations, Pageable endpoints, and a dedicated test demonstrating an intentional N+1 query and its resolution with JOIN FETCH.',
      requirements: [
        'Flyway migration scripts (V1__init_schema.sql, V2__add_indexes.sql).',
        'Auditing with @CreatedDate, @LastModifiedDate via @EntityListeners(AuditingEntityListener.class).',
        'Optimistic locking using @Version on Order entity.',
        'Logging SQL queries with datasource-proxy or p6spy to verify zero redundant queries.',
      ],
      verificationSteps: [
        'Trigger findOrdersWithItems() and verify in Hibernate logs that exactly 1 SQL query executes instead of 1 + N queries.',
        'Attempt concurrent updates to the same entity and verify OptimisticLockException is handled.',
      ],
    },
    interviewQuestions: [],
    resources: [],
    topics: [
      {
        id: 'p2-t1-nplusone',
        phaseId: 2,
        title: 'Fetching Strategies & The N+1 Query Problem',
        summary: 'Lazy vs Eager loading, identifying 1+N cascades, and resolving via JOIN FETCH and @EntityGraph.',
        keyConcepts: ['N+1 Problem Cause', 'JOIN FETCH JPQL', '@EntityGraph Optimization', 'Batch Fetching (default_batch_fetch_size)'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=hibernate+n%2B1+problem+explained+Vlad+Mihalcea',
        interviewTip: 'Always remember: @ManyToOne defaults to EAGER in JPA! Explicitly set fetch = FetchType.LAZY to prevent accidental joins.',
        quizzes: [],
        subTopics: [
          {
            id: 'p2-st-n1-resolution',
            topicId: 'p2-t1-nplusone',
            title: 'Diagnosing & Demolishing N+1 Cascades',
            overview:
              'How Hibernate triggers redundant database queries during collection iteration and how to fix it with single-trip JOIN FETCH.',
            docUrl: 'https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.entity-graph',
            docLabel: 'Spring Data JPA EntityGraph Guide',
            youtube: {
              channelName: 'Vlad Mihalcea',
              searchQuery: 'Hibernate N+1 query problem Vlad Mihalcea',
              url: 'https://www.youtube.com/results?search_query=Hibernate+N%2B1+query+problem+Vlad+Mihalcea',
            },
            subSubTopics: [
              {
                id: 'p2-sst-n1-fix',
                title: 'N+1 Reproduction & JOIN FETCH Solution',
                conceptDetails:
                  'When querying 100 Orders with a lazily loaded List<OrderItem>, Hibernate fires 1 initial query for orders. Then, when iterating through each order\'s items, Hibernate triggers 100 separate subsequent queries (1 + N = 101 total database queries). JOIN FETCH in JPQL forces a single SQL INNER/LEFT JOIN fetching parent and child records in a single network round-trip.',
                codeSnippet: `// ❌ Triggers 1 + N (101 SQL Queries):
@Query("SELECT o FROM Order o")
List<Order> findAllOrders();

// ✅ Resolves to exactly 1 single SQL Query with JOIN FETCH:
@Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.customer.id = :customerId")
List<Order> findOrdersWithItems(@Param("customerId") Long customerId);

// ✅ Alternative: Dynamic @EntityGraph
@EntityGraph(attributePaths = {"items", "customer"})
List<Order> findByStatus(OrderStatus status);`,
                keyTakeaways: [
                  '1 initial query + N child queries kills database performance under load.',
                  'Fix via JPQL `JOIN FETCH` or Spring Data `@EntityGraph`.',
                  'Configure `spring.jpa.properties.hibernate.default_batch_fetch_size=50` as a global safety net.',
                ],
                interviewTrap:
                  'Why not simply set FetchType.EAGER everywhere? Because EAGER loads children even when you only need the parent ID, and EAGER still triggers N+1 when using JPQL queries!',
                youtube: {
                  channelName: 'Amigoscode',
                  searchQuery: 'Spring Boot JPA N+1 problem Amigoscode',
                  url: 'https://www.youtube.com/results?search_query=Spring+Boot+JPA+N%2B1+problem+Amigoscode',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'p2-t2-tx',
        phaseId: 2,
        title: '@Transactional Mechanics, Proxies & Pitfalls',
        summary: 'Spring AOP proxy interception, self-invocation proxy bypass, and propagation levels.',
        keyConcepts: ['AOP Proxy Interception', 'Self-Invocation Bypass', 'REQUIRED vs REQUIRES_NEW', 'Rollback Rules'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=spring+transactional+self+invocation+explained+Marco+Behler',
        interviewTip: 'Calling a @Transactional method from within the same class (this.method()) bypasses the Spring AOP proxy, so no database transaction is created!',
        quizzes: [],
        subTopics: [
          {
            id: 'p2-st-tx-proxies',
            topicId: 'p2-t2-tx',
            title: '@Transactional Proxy Mechanics & The Self-Invocation Trap',
            overview:
              'Understanding how Spring AOP wraps beans in dynamic proxies and why internal method calls break transaction boundaries.',
            docUrl: 'https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-decl-explained.html',
            docLabel: 'Spring Declarative Transaction Management',
            youtube: {
              channelName: 'Marco Behler',
              searchQuery: 'Spring Transactional how it works Marco Behler',
              url: 'https://www.youtube.com/results?search_query=Spring+Transactional+how+it+works+Marco+Behler',
            },
            subSubTopics: [
              {
                id: 'p2-sst-self-invocation',
                title: 'The Self-Invocation Proxy Bypass Bug',
                conceptDetails:
                  'Spring creates an AOP proxy around @Transactional beans. When an outside controller invokes a method on the bean, it calls the proxy. The proxy opens the transaction and delegates to the target object. However, if Method A calls Method B inside the SAME class using this.methodB(), the invocation runs directly on the raw instance, completely bypassing the proxy wrapper!',
                codeSnippet: `// 🚨 FATAL INTERVIEW TRAP: Self-Invocation Failure
@Service
public class OrderService {
    public void processOrder(Order order) {
        // 'this.saveWithAudit()' bypasses the proxy!
        // NO database transaction is started! Rollback will NOT occur on error!
        this.saveWithAudit(order); 
    }

    @Transactional
    public void saveWithAudit(Order order) {
        orderRepository.save(order);
        auditRepository.save(new AuditLog("ORDER_CREATED"));
    }
}

// ✅ Fix: Extract transactional method to a separate dedicated service
@Service
public class OrderService {
    private final OrderAuditService auditService; // Separate Spring proxy bean!
    public void processOrder(Order order) {
        auditService.saveWithAudit(order); // Proxy intercepts cleanly!
    }
}`,
                keyTakeaways: [
                  'Spring AOP proxies intercept external bean calls only.',
                  'Internal self-invocations bypass proxies and ignore @Transactional.',
                  'Fix by refactoring to a separate service bean or injecting the self bean.',
                ],
                interviewTrap:
                  'By default, @Transactional only rolls back on unchecked exceptions (RuntimeException). To roll back on checked exceptions, declare `@Transactional(rollbackFor = Exception.class)`.',
                youtube: {
                  channelName: 'Bouali Ali',
                  searchQuery: 'Spring @Transactional pitfalls Bouali Ali',
                  url: 'https://www.youtube.com/results?search_query=Spring+Transactional+pitfalls',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Phase 3: Security (Spring Security 6, JWT, OAuth2, RBAC)',
    subtitle: 'Zero-Trust Architecture & Identity Management',
    weeksCompressed: '1 week',
    originalWeeks: '3 weeks',
    priority: 'Must',
    targetWeek: 'Week 4',
    whyItMatters:
      'Security is the ultimate hiring filter. Anyone can copy-paste a tutorial JWT filter, but interviewers immediately test if you understand the SecurityFilterChain, why BCrypt is slow by design, and how to configure Spring Security 6 without deprecated adapters.',
    fastTrackFocus:
      'Master the SecurityFilterChain bean with the modern lambda DSL, BCrypt password hashing, stateless JWT validation filter (OncePerRequestFilter), and @PreAuthorize method security. Treat Google OAuth2 and refresh token rotation as stretch goals.',
    overviewVideoQuery: 'https://www.youtube.com/results?search_query=spring+boot+3+spring+security+6+jwt+full+course',
    capstoneContribution:
      'Implement authentication service issuing RS256/HS256 signed JWTs with custom claims and configure downstream API Gateway and resource services with RBAC.',
    miniProject: {
      title: 'Stateless JWT Auth Server & RBAC Gateway Filter',
      description:
        'Registration and login endpoints with BCrypt hashing, JWT access & refresh token generation, custom OncePerRequestFilter parsing Authorization: Bearer, and role enforcement (ROLE_USER, ROLE_ADMIN).',
      requirements: [
        'Spring Security 6 SecurityFilterChain configuration bean (zero WebSecurityConfigurerAdapter).',
        'Custom AuthenticationEntryPoint returning 401 Unauthorized ProblemDetail JSON.',
        'Custom AccessDeniedHandler returning 403 Forbidden ProblemDetail JSON.',
        'Integration tests validating that unauthenticated requests receive clean 401 JSON.',
      ],
      verificationSteps: [
        'Attempt login with invalid password; verify BCrypt prevents timing attacks and returns 401.',
        'Access an @PreAuthorize("hasRole(\'ADMIN\')") endpoint with a USER token; verify 403 response.',
      ],
    },
    interviewQuestions: [],
    resources: [],
    topics: [
      {
        id: 'p3-t1-jwt',
        phaseId: 3,
        title: 'Spring Security 6 FilterChain & Stateless JWTs',
        summary: 'Configuring SecurityFilterChain with lambda DSL, OncePerRequestFilter, BCrypt, and RBAC.',
        keyConcepts: ['SecurityFilterChain Lambda DSL', 'OncePerRequestFilter', 'BCrypt Adaptive Work Factor', 'Role vs Authority'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=spring+security+6+jwt+full+course+Amigoscode',
        interviewTip: 'WebSecurityConfigurerAdapter is completely removed in Spring Security 6. Always register a @Bean SecurityFilterChain.',
        quizzes: [],
        subTopics: [
          {
            id: 'p3-st-filterchain',
            topicId: 'p3-t1-jwt',
            title: 'SecurityFilterChain Architecture & JWT Filter',
            overview:
              'Building a modern stateless authentication pipeline using OncePerRequestFilter and SecurityContextHolder.',
            docUrl: 'https://docs.spring.io/spring-security/reference/servlet/architecture.html',
            docLabel: 'Spring Security Filter Architecture Guide',
            youtube: {
              channelName: 'Amigoscode',
              searchQuery: 'Spring Boot 3 Spring Security 6 JWT Amigoscode',
              url: 'https://www.youtube.com/results?search_query=Spring+Boot+3+Spring+Security+6+JWT+Amigoscode',
            },
            subSubTopics: [
              {
                id: 'p3-sst-jwt-filter',
                title: 'OncePerRequestFilter & SecurityContextHolder',
                conceptDetails:
                  'A custom JWT filter extends OncePerRequestFilter. It extracts the Authorization header, validates the digital signature and expiration, constructs an Authentication token, and sets it in SecurityContextHolder.getContext().setAuthentication(authToken). Downstream filters inspect this context to grant access.',
                codeSnippet: `// Production Pattern: Spring Security 6 FilterChain Configuration
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // Safe for stateless token APIs
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}`,
                keyTakeaways: [
                  'SessionCreationPolicy.STATELESS ensures no HTTP session cookies are created.',
                  'JWT signature guarantees integrity, not confidentiality (payload is visible Base64).',
                  'hasRole("ADMIN") automatically expects authority "ROLE_ADMIN".',
                ],
                interviewTrap:
                  'Why is BCrypt preferred over SHA-256 for password hashing? Because SHA-256 is designed to be fast (billions of hashes/sec on GPUs), making brute forcing trivial. BCrypt is intentionally slow and salted, with an exponential work factor.',
                youtube: {
                  channelName: 'Java Techie',
                  searchQuery: 'Spring Security 6 JWT Authentication Java Techie',
                  url: 'https://www.youtube.com/results?search_query=Spring+Security+6+JWT+Java+Techie',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Phase 5: Caching and Messaging (Redis and Kafka)',
    subtitle: 'High-Throughput In-Memory & Distributed Event Streaming',
    weeksCompressed: '1–1.5 weeks',
    originalWeeks: '4 weeks',
    priority: 'Should',
    targetWeek: 'Week 6',
    whyItMatters:
      'Real production systems require sub-millisecond cache latency and asynchronous event decoupling. Redis and Kafka are standard requirements across backend engineering job descriptions.',
    fastTrackFocus:
      'Master the Kafka mental model (topics, partitions, consumer groups, acks=all, idempotent producer) and Spring Cache abstraction with Redis (@Cacheable, TTL, cache-aside). Skip Kafka Streams and Redis Streams initially.',
    overviewVideoQuery: 'https://www.youtube.com/results?search_query=spring+boot+kafka+redis+tutorial+full+course',
    capstoneContribution:
      'Implement Redis caching layer for catalog items and publish OrderCreatedEvent to Kafka, consumed by notification & inventory consumers.',
    miniProject: {
      title: 'Distributed Event-Driven Order Processing with Kafka & Redis',
      description:
        'A multi-service flow: when an order is created, emit an event to a partitioned Kafka topic with key orderId. An inventory consumer reads the event, decrements stock, and updates a Redis cache using the Cache-Aside pattern.',
      requirements: [
        'Docker Compose defining Kafka, Zookeeper/KRaft, and Redis.',
        'Spring for Apache Kafka with KafkaTemplate and @KafkaListener.',
        '@Cacheable and @CacheEvict configured with explicit TTL (Time-To-Live).',
        'Dead Letter Topic (DLT) retry handler for unprocessable poison messages.',
      ],
      verificationSteps: [
        'Publish 100 orders with identical customerId keys; verify they land in the exact same partition and are processed strictly in order.',
        'Verify cache hit in Redis CLI (KEYS * and GET) without hitting PostgreSQL.',
      ],
    },
    interviewQuestions: [],
    resources: [],
    topics: [
      {
        id: 'p5-t1-kafka',
        phaseId: 5,
        title: 'Apache Kafka Mental Model & Reliability',
        summary: 'Topics, partitions, offsets, consumer groups, acks=all, idempotent producers, and dead letter topics.',
        keyConcepts: ['Partition Key Ordering', 'Consumer Group Parallelism', 'acks=all & min.insync.replicas', 'Dead Letter Publishing Recoverer'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=kafka+architecture+explained+Viktor+Gamov+Confluent',
        interviewTip: 'Kafka guarantees strict ordering ONLY within a single partition, NOT across the entire topic! All events with the same key route to the same partition.',
        quizzes: [],
        subTopics: [
          {
            id: 'p5-st-partitions',
            topicId: 'p5-t1-kafka',
            title: 'Partitions, Keys & Ordering Guarantees',
            overview:
              'How Kafka distributes load across partitions and ensures sequential ordering for matching entity IDs.',
            docUrl: 'https://kafka.apache.org/documentation/#intro_concepts_and_terms',
            docLabel: 'Apache Kafka Official Documentation',
            youtube: {
              channelName: 'Confluent Developer (Viktor Gamov)',
              searchQuery: 'Apache Kafka 101 Confluent Developer',
              url: 'https://www.youtube.com/results?search_query=Apache+Kafka+101+Confluent',
            },
            subSubTopics: [
              {
                id: 'p5-sst-partition-key',
                title: 'Partition Key Hashing & Consumer Groups',
                conceptDetails:
                  'Producers publish events with a key (e.g. orderId). Kafka computes hash(key) % partitionCount. All events sharing the exact same key land on the same partition and are consumed strictly in order by one consumer instance in a consumer group. If key is null, messages are distributed across partitions in a sticky batch round-robin.',
                codeSnippet: `// Production Pattern: High-Durability Kafka Producer & Consumer
@Service
public class OrderEventPublisher {
    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    public void publishOrder(OrderCreatedEvent event) {
        // Keying by customerId guarantees strict ordering per customer
        kafkaTemplate.send("orders.v1", event.customerId(), event)
            .whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Sent offset: {}", result.getRecordMetadata().offset());
                }
            });
}

@Component
public class InventoryEventListener {
    @KafkaListener(topics = "orders.v1", groupId = "inventory-service-group")
    public void onOrderCreated(OrderCreatedEvent event) {
        // Consumer handles event idempotently
        inventoryService.reserveStock(event.orderId(), event.items());
    }
}`,
                keyTakeaways: [
                  'Strict ordering is guaranteed within a partition only.',
                  'Consumer group assigns at most 1 consumer per partition.',
                  'Extra consumers beyond partition count remain idle backups.',
                ],
                interviewTrap:
                  'What does acks=all guarantee? The leader broker waits for all in-sync replicas (ISRs) to acknowledge the write before responding, guaranteeing zero message loss if leader crashes.',
                youtube: {
                  channelName: 'TechWorld with Nana',
                  searchQuery: 'Kafka explained for beginners TechWorld with Nana',
                  url: 'https://www.youtube.com/results?search_query=Kafka+explained+for+beginners+TechWorld+with+Nana',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 8,
    title: 'Phase 8: Distributed-Systems Patterns',
    subtitle: 'SAGA, Transactional Outbox, Idempotency & Rate Limiting',
    weeksCompressed: '1.5–2 weeks',
    originalWeeks: '4 weeks',
    priority: 'Differentiator',
    targetWeek: 'Weeks 10–11',
    whyItMatters:
      'This phase separates mid-level engineers from tutorial copiers. These patterns appear in every Senior System Design interview, particularly for payment and commerce systems.',
    fastTrackFocus:
      'Implement Idempotency with Redis SETNX, the Transactional Outbox pattern, and a Choreography SAGA with compensation. Understand CAP theorem, eventual consistency, token-bucket rate limiting, and Dead Letter Topics.',
    overviewVideoQuery: 'https://www.youtube.com/results?search_query=microservices+design+patterns+saga+outbox+cqrs+explained',
    capstoneContribution:
      'Implement Transactional Outbox in order-service with Kafka message relay, SAGA compensation for payment failures, and Redis SETNX idempotency keys on payment endpoints.',
    miniProject: {
      title: 'Reliable Payment SAGA with Transactional Outbox & Idempotency',
      description:
        'A multi-service payment flow: Client sends request with Idempotency-Key. Order service saves order and Outbox event in a single database transaction. A message relay publishes the event to Kafka. Payment service charges account; if payment fails, a compensating event cancels the order and restores inventory.',
      requirements: [
        'Idempotency filter using Redis SET key value NX EX 86400.',
        'Transactional Outbox table with separate polling/CDC publisher.',
        'Choreography SAGA handling both success and failure compensation.',
        'Token-Bucket rate limiter on API Gateway using Redis Lua script.',
      ],
      verificationSteps: [
        'Send 5 identical concurrent POST /payments requests with the same Idempotency-Key; verify customer is charged exactly once and 4 return cached response.',
        'Simulate payment failure and verify compensating transaction cancels the order in PostgreSQL.',
      ],
    },
    interviewQuestions: [],
    resources: [],
    topics: [
      {
        id: 'p8-t1-patterns',
        phaseId: 8,
        title: 'Transactional Outbox & SAGA Orchestration',
        summary: 'Atomic dual-write solutions, Outbox tables, Debezium CDC, and SAGA compensating transactions.',
        keyConcepts: ['Dual-Write Problem', 'Transactional Outbox', 'Compensating SAGA Actions', 'Redis SETNX Idempotency'],
        youtubeSearchUrl: 'https://www.youtube.com/results?search_query=saga+transactional+outbox+pattern+microservices+Chris+Richardson',
        interviewTip: 'Dual-write problem: A service cannot atomically commit to a relational DB and send an event to Kafka without distributed 2PC. Outbox solves this.',
        quizzes: [],
        subTopics: [
          {
            id: 'p8-st-outbox',
            topicId: 'p8-t1-patterns',
            title: 'The Transactional Outbox Pattern',
            overview:
              'Guaranteeing atomic state updates and event publishing without distributed 2-phase commit.',
            docUrl: 'https://microservices.io/patterns/data/transactional-outbox.html',
            docLabel: 'Microservices.io Transactional Outbox Pattern',
            youtube: {
              channelName: 'Hussein Nasser',
              searchQuery: 'Transactional Outbox Pattern Hussein Nasser',
              url: 'https://www.youtube.com/results?search_query=Transactional+Outbox+Pattern+Hussein+Nasser',
            },
            subSubTopics: [
              {
                id: 'p8-sst-dualwrite',
                title: 'Solving the Dual-Write Problem',
                conceptDetails:
                  'If you update the database and then call kafkaTemplate.send(), the app can crash before sending the event (event lost!). If you send the event first, the database transaction might roll back (phantom event sent!). Outbox pattern writes the business change AND an outbox record in the SAME local database transaction. A separate relay (Debezium CDC or poller) publishes the event reliably to Kafka with at-least-once delivery.',
                codeSnippet: `// Production Pattern: Atomic Local Transactional Outbox
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OutboxRepository outboxRepository;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // 1. Save business entity
        Order order = orderRepository.save(new Order(request));

        // 2. Save event row in SAME local DB transaction!
        OutboxEvent event = new OutboxEvent(
            "ORDER_CREATED",
            order.getId().toString(),
            objectMapper.writeValueAsString(new OrderCreatedPayload(order))
        );
        outboxRepository.save(event);

        return order; // Atomic! Either both commit or both rollback.
    }
}`,
                keyTakeaways: [
                  'Outbox table acts as a reliable temporary event queue in the DB.',
                  'Message relay (Debezium / polling job) publishes events to Kafka.',
                  'Guarantees at-least-once delivery; consumers must be idempotent.',
                ],
                interviewTrap:
                  'How do downstream consumers protect against duplicate events from Outbox at-least-once delivery? Through an Idempotency Deduplication Table checking messageId before processing!',
                youtube: {
                  channelName: 'ByteByteGo',
                  searchQuery: 'Transactional Outbox Pattern ByteByteGo',
                  url: 'https://www.youtube.com/results?search_query=Transactional+Outbox+ByteByteGo',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
