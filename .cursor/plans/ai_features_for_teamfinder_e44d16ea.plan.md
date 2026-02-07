---
name: AI Features for TeamFinder
overview: "A plan of AI-powered features that fit TeamFinder’s domain: matching individuals with teams/teammates using existing user skills, bios, events, and interest/lead signals."
todos: []
isProject: false
---

# AI Features for TeamFinder

TeamFinder connects **individuals** (who have a bio and skills list) with **teams** and **events**. Today, discovery is list-based with simple filters (e.g. team name substring in [TeamService.searchTeams](backend/src/main/java/com/project/TeamFinder/service/TeamService.java)). There is no skill-based or semantic matching. The plan below suggests AI features that build on your existing data and flows.

---

## YC and comparable companies: who’s similar and how we differ

**Finding:** There is **no YC-backed company** that does the same thing as TeamFinder (event-scoped team/teammate finding for hackathons or college events). The closest YC product is **YC Co-Founder Matching**, which targets a different use case.

### YC-related


| Company / product          | What it does                                                                                                                                                        | Diff vs TeamFinder                                                                                                                                                                                                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **YC Co-Founder Matching** | YC’s own platform to find **co-founders** to start a company (long-term). Profile + skills + location; matching engine; 100k+ matches; in-person meetups in SF/NYC. | **Different goal:** Co-founder = start a company together. TeamFinder = find teammates/teams for **a specific event** (hackathon, college event). No overlap in use case.                                                                                                                                                                                   |
| **Nowadays** (YC S23)      | AI for **corporate event planning** (retreats, logistics, booking).                                                                                                 | **Different:** Event *planning*, not team/teammate *matching* for participants.                                                                                                                                                                                                                                                                             |
| **Popl** (YC W21)          | Event **lead capture** and CRM (badges, sync to CRM) at conferences.                                                                                                | **Different:** B2B lead capture at events, not helping individuals find teams or teammates.                                                                                                                                                                                                                                                                 |
| **Luma (lu.ma)**           | Event **discovery, ticketing, invites** (not YC-backed; seed-funded).                                                                                               | **Different:** Event hosting/discovery only; no team formation or matching.                                                                                                                                                                                                                                                                                 |
| **Devpost**                | Full **hackathon platform**: host hackathons, submissions, judging, plus **team formation** (open project, join project, team-up requests). Not YC-backed.          | **Closest comparable.** Diff: Devpost = hackathon *hosting* + one feature for team formation. TeamFinder = **only** matching individuals with teams/teammates around **events** (any event type, college-scoped). TeamFinder is event-centric (per-event “interested users,” per-event teams); Devpost is project-centric (open projects, join by project). |
| **HackBud**                | **Hackathon team/teammate finder**: team finder, teammate finder, filter by skills/tech/domain, team profiles, global hackathon list. Free; not YC-backed.          | **Very similar idea.** Diff: HackBud = **global pool** + hackathon list (find people across many hackathons). TeamFinder = **per-event** pool (users interested in *this* event, teams for *this* event) and **college/organization context** (events created by reps). TeamFinder is tighter scoping and event-first.                                      |


### Summary

- **YC:** No YC company does event-scoped teammate/team finding. YC Co-Founder Matching is co-founder dating for startups, not event teams.
- **Closest comparables (non-YC):** **Devpost** (hackathon platform with team formation) and **HackBud** (dedicated hackathon team finder with global pool).
- **TeamFinder’s angle:** Event-first, per-event interested users and teams, college/reprep context, and a product focused **only** on matching (no hackathon hosting or global directory). AI features (recommendations, semantic search, skill normalization) can sharpen that differentiator.

---

## 1. Smart matching and recommendations (high impact)

**Teammate recommendations (Find Teammates flow)**  

- **Input:** Event + current user profile (skills, bio).  
- **Output:** Rank or re-rank “interested users” for that event by **skill fit** and optionally **bio similarity**.  
- **Data:** Use `User.bio`, `User.skills`, and optionally `Lead` (user A interested in user B) as implicit feedback.  
- **Implementation:** Backend endpoint e.g. `GET /api/events/{eventId}/recommended-users` that takes the same pool as `getInterestedUsers(eventId)` and re-ranks by: (a) skill overlap with current user or with a “needed skills” hint, (b) optional embedding similarity of bios. No new UI required initially—replace or augment the order of the list in [FindTeammatesPeople](frontend/teamfinder-frontend/src/modules/find/FindTeammatesPeople.tsx).

**Team recommendations (Find Team flow)**  

- **Input:** Event + current user (skills, bio).  
- **Output:** Rank teams by “fit” (e.g. teams that need skills the user has, or that have a similar focus).  
- **Data:** Team members’ skills (from existing `UserProjection`/skills), team name, event description.  
- **Implementation:** Endpoint e.g. `GET /api/events/{eventId}/recommended-teams` that re-ranks `getAllTeamsWithMembers(eventId)` by skill gap fill or semantic relevance. Surface in [FindActualTeams](frontend/teamfinder-frontend/src/modules/teams/components/FindActualTeams.tsx) as “Recommended for you” or reorder the list.

**Lead-based learning (medium term)**  

- Use `Lead` (user1, user2, eventId) and `UserInterestedInTeam` as positive signals to learn “users like you tend to be interested in users/teams like these” and refine rankings over time (e.g. simple collaborative filtering or a small ranking model).

---

## 2. Skill extraction and normalization

**Problem:** Skills are free-form; matching by exact string is brittle (“React” vs “react” vs “React.js”).  

- **Skill extraction from bio:** Use an LLM or NER to suggest a list of skills from `User.bio` (e.g. on profile save or in “Improve profile”). Pre-fill or suggest additions to the existing `skills` list in [Profile](frontend/teamfinder-frontend/src/modules/profile/components/Profile.tsx).  
- **Normalization:** Maintain a small taxonomy or alias map (e.g. “React”, “React.js” → canonical “React”) so that matching and search use canonical skills. Can be done in backend when storing or when computing recommendations.

---

## 3. Semantic and natural-language search

**Current:** Team search is substring on name ([TeamService.searchTeams](backend/src/main/java/com/project/TeamFinder/service/TeamService.java)); no search on user bio/skills.  

- **Semantic search for users:** “Find me a frontend developer who knows design” → embed the query and match against embedded bios + skills (and optionally event description). Requires embedding users (or their bios) and a vector store (e.g. pgvector if you stay on Postgres).  
- **Semantic search for teams:** Same idea for team name + member bios/skills + event description.  
- **UX:** Optional search box on Find Teammates / Find Team that accepts natural language and calls a new search endpoint returning ranked users or teams.

---

## 4. Copy and content assistance

**Event/team descriptions:**  

- **Auto-draft:** From a short prompt (e.g. “college hackathon, focus on AI”), generate or extend `Event.description` or team blurb. Useful in [MakeEvent](frontend/teamfinder-frontend/src/modules/events/components/MakeEvent.tsx) and team creation.  
- **Improve:** “Improve this description” button that calls an LLM to polish existing text (tone, clarity, length).

**Profile:**  

- **Bio suggestions:** “Suggest a bio” from skills and name to help users who leave bio empty.  
- **Profile completeness:** Simple checklist or score (e.g. “Adding skills might help you get more matches”) driven by rules or a tiny classifier.

---

## 5. Explaining recommendations (trust and UX)

**“Why this person / team?”**  

- For each recommended user or team, show a short line: e.g. “Skills match: React, Node” or “Similar focus: full-stack projects.”  
- Implementation: Return with each recommendation a list of “match reasons” (e.g. overlapping skills, bio similarity score bucket). Renders in the same cards in Find Teammates / Find Team.

---

## 6. Team composition suggestions (when creating/editing teams)

**Context:** User creates or edits a team for an event ([CreateTeamRequestDTO](backend/src/main/java/com/project/TeamFinder/dto/CreateTeamRequestDTO.java), team management UI).  

- **Suggest roles/skills:** From event name/description, suggest “You might want: 1 designer, 1 backend, 1 frontend” or “Suggested skills: Python, React.”  
- **Gap analysis:** “Your team has frontend and design; consider adding someone with backend or DevOps.”  
- Uses event + current member skills; can be rule-based or LLM-based.

---

## 7. Moderation and safety (optional)

- **Flagging:** Simple classifier or LLM pass on user bio and team name/description for inappropriate content; queue for review or block.  
- **Spam/fake:** Heuristic or ML signals (e.g. duplicate bios, empty profiles, suspicious interest patterns) to prioritize or down-rank.

---

## 8. Conversational / chatbot finder (larger scope)

- **Flow:** User says “I need a designer for a hackathon next month” → parse intent (role, event type, time) → suggest events + users or teams.  
- **Implementation:** Chat UI that calls an LLM to extract structured query, then reuse existing APIs (events, recommended-users, recommended-teams) and present results in a conversational way.  
- Fits the “find teammates / find team” flows but is a bigger feature (dialogue state, parsing, UX).

---

## Suggested implementation order


| Priority | Feature                                         | Why                                                    |
| -------- | ----------------------------------------------- | ------------------------------------------------------ |
| 1        | Teammate recommendations (skill + optional bio) | Uses existing data; immediate value in Find Teammates. |
| 2        | Team recommendations (skill fit)                | Symmetric with above; uses same skill model.           |
| 3        | Match reasons (“Why this person/team?”)         | Builds trust and clarifies ranking.                    |
| 4        | Skill extraction from bio + normalization       | Better data quality for 1–3.                           |
| 5        | Semantic/natural-language search                | Better discovery when users don’t know exact keywords. |
| 6        | Copy assistance (event/team/profile)            | Improves content quality with low risk.                |
| 7        | Team composition suggestions                    | Helps team creators; builds on skill/event data.       |
| 8        | Lead-based learning, moderation, chatbot        | After core matching and search are in place.           |


---

## Technical notes

- **Stack:** Backend is Java/Spring; frontend is React. Recommendations and semantic search can live in Spring (calling external APIs or in-process models).  
- **Data:** All needed fields exist: `User` (bio, skills), `Event` (name, description), `Team` + members, `Lead`, `UserInterestedInTeam`. No schema change required for a first version of recommendations.  
- **APIs:** LLMs/embeddings via OpenAI, Anthropic, or open-source (e.g. sentence-transformers) behind a small internal service or serverless function. Vector search can be pgvector (Postgres) or a dedicated vector DB.  
- **Privacy:** Recommendations and search should respect existing auth and event visibility; only recommend users/teams the user is already allowed to see (e.g. interested users for that event, teams for that event).

This plan stays aligned with your current architecture and focuses on matching and discovery; you can implement the first 2–3 items for clear impact with minimal change to existing flows.

---

## DevOps enhancements

**Current state:** Basic Docker setup, no CI/CD, minimal logging, Actuator included but not configured, manual deployment. Below are enhancements to improve reliability, observability, and developer experience.

### 1. CI/CD pipeline (high priority)

**Problem:** No automated testing, building, or deployment. Manual Docker builds and deployments.

**GitHub Actions workflows:**

- **Backend CI/CD** (`.github/workflows/backend-ci.yml`):
  - **On push to main/PR:** Run Maven tests (`mvn test`), build JAR, run integration tests, build Docker image, push to container registry (Docker Hub/GHCR), deploy to staging (Railway/Render).
  - **On tag/release:** Deploy to production with version tags.
  - **Matrix testing:** Test on Java 17 and 21 (future-proofing).
  - **Caching:** Cache Maven dependencies (`~/.maven`) and Docker layers.
- **Frontend CI/CD** (`.github/workflows/frontend-ci.yml`):
  - **On push to main/PR:** Run `npm ci`, lint (`npm run lint`), build (`npm run build`), run tests (if added), deploy preview to Vercel.
  - **On merge to main:** Deploy to production Vercel.
- **Security scanning** (`.github/workflows/security.yml`):
  - **Dependency scanning:** Use Dependabot or Snyk to scan `pom.xml` and `package.json` for vulnerabilities.
  - **Container scanning:** Scan Docker images with Trivy or Snyk.
  - **Secret scanning:** Use GitHub’s secret scanning to detect leaked secrets.

**Benefits:** Automated testing, consistent builds, faster deployments, security checks.

---

### 2. Improved Docker setup

**Current:** Single-stage Dockerfile copying pre-built JAR; no multi-stage build or optimization.

**Enhancements:**

- **Multi-stage Dockerfile** (`backend/Dockerfile`):
  ```dockerfile
  # Stage 1: Build
  FROM maven:3.9-eclipse-temurin-17 AS build
  WORKDIR /app
  COPY pom.xml .
  RUN mvn dependency:go-offline
  COPY src ./src
  RUN mvn clean package -DskipTests

  # Stage 2: Runtime
  FROM eclipse-temurin:17-jre-alpine
  WORKDIR /app
  COPY --from=build /app/target/*.jar app.jar
  RUN addgroup -S spring && adduser -S spring -G spring
  USER spring:spring
  EXPOSE 8080
  ENTRYPOINT ["java", "-jar", "app.jar"]
  ```
  Benefits: Smaller image (JRE only), faster builds (dependency caching), non-root user.
- **Docker Compose for local dev** (`docker-compose.yml`):
  - **Services:** Backend (Spring Boot), PostgreSQL, pgAdmin (optional).
  - **Networks:** Internal network for service communication.
  - **Volumes:** Postgres data persistence, optional hot-reload volume for backend.
  - **Environment:** `.env` file for secrets (gitignored).
  - **Health checks:** Wait for Postgres readiness before starting backend.
- **.dockerignore** (already exists but empty):
  - Add: `target/`, `.git/`, `.idea/`, `*.md`, `src/test/`, `.env`.

**Benefits:** Faster local setup, consistent environments, smaller production images.

---

### 3. Logging and monitoring

**Current:** Using `System.out.println`; Actuator dependency exists but not configured.

**Structured logging:**

- **Replace System.out with SLF4J/Logback:**
  - Add `logback-spring.xml` in `backend/src/main/resources/`.
  - **Console appender:** JSON format for production (easier parsing).
  - **File appender:** Rotating logs (10MB, 10 files).
  - **Log levels:** `INFO` default, `DEBUG` in dev, `WARN`/`ERROR` in prod.
  - **MDC:** Add request ID, user ID, event ID to logs for tracing.
- **Replace all `System.out.println**` in:
  - [ImageHandlerService.java](backend/src/main/java/com/project/TeamFinder/service/ImageHandlerService.java) (lines 78, 82, 102, 105).
  - Any other services using print statements.

**Spring Boot Actuator configuration:**

- **Enable endpoints** in `application.properties`:
  ```properties
  management.endpoints.web.exposure.include=health,info,metrics,prometheus
  management.endpoint.health.show-details=when-authorized
  management.metrics.export.prometheus.enabled=true
  ```
- **Custom health checks:** Database connectivity, Supabase storage connectivity, email service.
- **Metrics:** HTTP request metrics, JVM metrics, custom business metrics (e.g., events created, teams formed).

**External monitoring (optional):**

- **Application Performance Monitoring (APM):** New Relic, Datadog, or Sentry for error tracking and performance.
- **Uptime monitoring:** UptimeRobot or Pingdom to alert on downtime.
- **Log aggregation:** Send logs to CloudWatch (AWS), Datadog, or ELK stack.

**Benefits:** Better debugging, production visibility, proactive issue detection.

---

### 4. Environment and secrets management

**Current:** `.env` file (gitignored), `application.properties` also gitignored; no template or validation.

**Enhancements:**

- **Environment template** (`.env.example`):
  - Document all required variables with descriptions.
  - Include defaults where safe (e.g., `SPRING_PROFILES_ACTIVE=dev`).
  - Separate sections: Database, JWT, Email, Supabase, etc.
- **Configuration validation:**
  - **Startup check:** Validate required env vars on app startup; fail fast with clear errors.
  - **Spring profiles:** `dev`, `staging`, `prod` with profile-specific configs.
- **Secrets management (production):**
  - **Railway/Render:** Use platform secrets (already supported).
  - **Vercel:** Use Vercel environment variables for frontend `BASE_URL` and API keys.
  - **Consider:** AWS Secrets Manager, HashiCorp Vault, or Doppler for centralized secrets (if multi-cloud).
- **Frontend config:**
  - Replace hardcoded `BASE_URL` in [config.ts](frontend/teamfinder-frontend/src/config.ts) with `import.meta.env.VITE_API_URL`.
  - Add `.env.example` for frontend with `VITE_API_URL=http://localhost:8080`.

**Benefits:** Easier onboarding, fewer config errors, secure secret handling.

---

### 5. Database migrations and backups

**Current:** JPA auto-DDL (likely `spring.jpa.hibernate.ddl-auto=update`); no migration tooling or backup strategy.

**Database migrations:**

- **Flyway or Liquibase:**
  - **Flyway** (recommended for Spring Boot): Add `spring.flyway.enabled=true`, create `src/main/resources/db/migration/` with versioned SQL files (`V1__initial_schema.sql`, `V2__add_skills_column.sql`).
  - **Benefits:** Version-controlled schema, rollback capability, consistent dev/staging/prod schemas.
- **Disable auto-DDL in production:**
  ```properties
  spring.jpa.hibernate.ddl-auto=validate  # or 'none' in prod
  ```

**Backup strategy:**

- **Automated backups:**
  - **Postgres provider:** Use managed Postgres backups (Railway/Render/AWS RDS) with daily snapshots and point-in-time recovery.
  - **Manual script:** `pg_dump` cron job (if self-hosted) to S3 or cloud storage.
  - **Retention:** 7 days daily, 4 weeks weekly, 12 months monthly.
- **Backup testing:**
  - Monthly restore test to verify backups.
  - Document restore procedure in `docs/BACKUP_RESTORE.md`.

**Benefits:** Schema versioning, disaster recovery, data safety.

---

### 6. Testing infrastructure

**Current:** Some unit/integration tests exist; no test coverage reporting or test automation in CI.

**Enhancements:**

- **Test coverage:**
  - **JaCoCo Maven plugin:** Add to `pom.xml`, generate coverage reports, fail build if coverage < 70% (configurable).
  - **Coverage reports:** Publish to GitHub Actions artifacts or Codecov.
- **Test categories:**
  - **Unit tests:** Fast, isolated (Mockito for mocks).
  - **Integration tests:** `@SpringBootTest` with Testcontainers for Postgres (real DB in Docker).
  - **API tests:** Use `@WebMvcTest` for controller tests, `MockMvc` for HTTP layer.
- **Frontend testing:**
  - **Vitest:** Add to `package.json` for unit tests.
  - **Playwright or Cypress:** E2E tests for critical flows (signup → verification → login, create team).
- **Test data:**
  - **Fixtures:** Reusable test data builders (e.g., `UserTestBuilder`, `EventTestBuilder`).
  - **Database seeding:** Use Flyway test migrations or `@Sql` annotations.

**Benefits:** Higher code quality, regression prevention, confidence in deployments.

---

### 7. Performance and optimization

**Current:** No performance monitoring or optimization.

**Enhancements:**

- **Database optimization:**
  - **Indexes:** Add indexes on frequently queried columns (`users.email`, `teams.event_id`, `event_users.event_id`, `leads.event_id`).
  - **Query analysis:** Enable Hibernate SQL logging in dev, use `EXPLAIN ANALYZE` for slow queries.
  - **Connection pooling:** Configure HikariCP (default in Spring Boot) with appropriate pool size.
- **Caching:**
  - **Spring Cache:** Add `@Cacheable` for read-heavy endpoints (e.g., `getAllEvents`, `getInterestedUsers`).
  - **Redis (optional):** For distributed caching if scaling horizontally.
- **Frontend optimization:**
  - **Bundle analysis:** Use `vite-bundle-visualizer` to identify large dependencies.
  - **Code splitting:** Lazy load routes in React Router.
  - **Image optimization:** Use Next.js Image component or `sharp` for image resizing (if migrating).
- **CDN:** Use Vercel’s CDN for frontend assets (already included).

**Benefits:** Faster response times, better user experience, lower infrastructure costs.

---

### 8. Security enhancements

**Current:** Basic JWT auth, CORS configured, secrets in env vars.

**Enhancements:**

- **Security headers:**
  - **Spring Security:** Add security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`).
  - **Content Security Policy (CSP):** Configure CSP headers for frontend.
- **Rate limiting:**
  - **Bucket4j or Resilience4j:** Add rate limiting to auth endpoints (`/auth/login`, `/auth/signup`) to prevent brute force.
  - **IP-based:** Limit requests per IP per minute.
- **Dependency updates:**
  - **Dependabot:** Enable in GitHub to auto-create PRs for security updates.
  - **OWASP Dependency Check:** Run in CI to scan for known vulnerabilities.
- **Secrets scanning:**
  - **GitHub Secret Scanning:** Already enabled; ensure no secrets in code history (use `git-secrets` or `truffleHog`).
- **HTTPS enforcement:**
  - Ensure all production endpoints use HTTPS (Railway/Render/Vercel handle this).

**Benefits:** Reduced attack surface, protection against common vulnerabilities.

---

### 9. Documentation and runbooks

**Current:** README with basic setup; no operational docs.

**Enhancements:**

- **README updates:**
  - **Architecture diagram:** High-level system diagram (Mermaid).
  - **Local development:** Step-by-step setup with Docker Compose.
  - **Deployment:** How to deploy to staging/production.
  - **Troubleshooting:** Common issues and solutions.
- **Operational runbooks** (`docs/runbooks/`):
  - **Deployment:** Step-by-step deployment process.
  - **Rollback:** How to rollback a bad deployment.
  - **Incident response:** What to do when the app is down.
  - **Database migrations:** How to run migrations in production.
- **API documentation:**
  - **OpenAPI/Swagger:** Add SpringDoc OpenAPI to auto-generate API docs at `/swagger-ui.html`.
  - **Postman collection:** Export API endpoints for testing.

**Benefits:** Easier onboarding, faster incident resolution, better knowledge sharing.

---

### 10. Infrastructure as code (optional, for future)

**Current:** Manual infrastructure setup on Railway/Render.

**Future consideration:**

- **Terraform or Pulumi:** Define infrastructure (Postgres, compute, storage) as code.
- **Benefits:** Reproducible infrastructure, version control, easier multi-environment setup.

**Note:** Not urgent if using Railway/Render (they handle infra), but useful if migrating to AWS/GCP.

---

## Suggested DevOps implementation order


| Priority | Enhancement                                               | Why                                                 |
| -------- | --------------------------------------------------------- | --------------------------------------------------- |
| 1        | CI/CD pipeline (backend + frontend)                       | Automates testing and deployment; immediate value.  |
| 2        | Improved Docker setup (multi-stage, docker-compose)       | Better local dev experience and smaller images.     |
| 3        | Structured logging + Actuator                             | Essential for production debugging and monitoring.  |
| 4        | Environment/secrets management (.env.example, validation) | Prevents config errors and improves onboarding.     |
| 5        | Database migrations (Flyway)                              | Version-controlled schema; critical for production. |
| 6        | Testing infrastructure (coverage, integration tests)      | Improves code quality and prevents regressions.     |
| 7        | Database backups and restore testing                      | Data safety and disaster recovery.                  |
| 8        | Performance optimization (indexes, caching)               | Better user experience and scalability.             |
| 9        | Security enhancements (rate limiting, headers)            | Protects against common attacks.                    |
| 10       | Documentation and runbooks                                | Knowledge sharing and operational efficiency.       |


---

## Technical notes

- **Current stack:** Backend: Spring Boot 3.3.5, Java 17, PostgreSQL, Docker. Frontend: React/Vite, Vercel. Storage: Supabase.
- **Deployment:** Backend on Railway/Render, Frontend on Vercel.
- **No breaking changes:** All enhancements are additive and don’t require changing existing code (except logging replacements).
- **Cost:** Most enhancements are free (GitHub Actions, Docker Hub free tier, Actuator). Optional paid services: APM (Sentry free tier), monitoring (UptimeRobot free tier).

Start with CI/CD, Docker improvements, and logging for immediate impact. Then add migrations, testing, and monitoring as you scale.