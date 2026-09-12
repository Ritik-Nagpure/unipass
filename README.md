# UniPass

UniPass is a self-hosted Identity and Single Sign-On (SSO) platform
designed to provide a centralized identity layer for multiple
applications.

The platform allows users to create and manage their UniPass identity
once and then use that identity to authenticate with applications
integrated with UniPass.

UniPass is designed as a **modular monolith** with strict
**Domain-Driven Design (DDD)** and separation of concerns. The backend
is built with **Node.js, Express, TypeScript, PostgreSQL, and Drizzle
ORM**, while the user-facing dashboard is built with **React** and
served as a static build by the Express application.

------------------------------------------------------------------------

## 1. Why UniPass Exists

When multiple applications are developed independently, authentication
can quickly become duplicated across every application.

Without a centralized identity provider:

-   Every application maintains its own users.
-   Every application implements login and logout.
-   Password management is duplicated.
-   Session management is duplicated.
-   Security fixes must be implemented repeatedly.
-   Users need separate accounts for different applications.
-   Applications need their own mechanisms to determine who a user is.

UniPass centralizes these responsibilities.

``` text
                    UniPass
                       |
          +------------+------------+
          |                         |
       Users                    Applications
          |                         |
          v                         v
    User Dashboard            OAuth / OIDC
          |                         |
          +------------+------------+
                       |
                       v
                  Identity
```

The objective is to make UniPass the trusted identity provider for
applications that integrate with it.

An application does not need to manage the user's UniPass password.
Instead, the application delegates authentication to UniPass and
receives a verifiable authentication result.

------------------------------------------------------------------------

# 2. Core Concept

UniPass acts as an **Identity Provider (IdP)** and **OAuth 2.0 / OpenID
Connect authorization server**.

An integrated application becomes an OAuth client.

``` text
User
 |
 | Login
 v
Application
 |
 | Redirect to UniPass
 v
UniPass
 |
 | Authenticate user
 | Create/reuse UniPass session
 | Request consent when required
 v
Authorization Code
 |
 | Exchange code
 v
Application
 |
 | Receives tokens
 v
Authenticated User
```

The application's trust is based on the OAuth/OIDC protocol and
cryptographic token verification rather than trusting arbitrary
information supplied by the browser.

------------------------------------------------------------------------

# 3. Technology Stack

## Backend

-   Node.js
-   Express
-   TypeScript
-   PostgreSQL
-   Drizzle ORM
-   Redis (planned/available for infrastructure needs)
-   OAuth 2.0
-   OpenID Connect
-   JWT / cryptographic signing
-   Zod for validation
-   Winston for logging

## Frontend

-   React
-   TypeScript
-   TanStack Router
-   TanStack Query
-   Redux Toolkit
-   React Router-based application structure through the existing
    routing setup
-   Static production build served by Express

## Monorepo

The project is maintained inside an Nx workspace.

``` text
apps/
├── unipass/
└── unipass-api/
```

------------------------------------------------------------------------

# 4. Product Scope

UniPass is designed around three major responsibilities.

## 4.1 User Identity

UniPass manages:

-   User registration
-   User profile
-   Password management
-   Authentication
-   Sessions
-   Logout
-   Connected applications
-   Access/consent management
-   Account settings
-   Security information
-   Audit history

## 4.2 Application Authentication

External applications can integrate with UniPass to:

-   Register an OAuth client
-   Redirect users to UniPass
-   Authenticate users through UniPass
-   Request specific scopes
-   Receive authorization codes
-   Exchange authorization codes for tokens
-   Identify authenticated users through OIDC
-   Verify tokens using UniPass public keys

## 4.3 Centralized Identity

The long-term goal is for multiple applications to trust the same
UniPass identity.

``` text
             +----------------+
             |    UniPass     |
             |      IdP       |
             +-------+--------+
                     |
          +----------+----------+
          |          |          |
          v          v          v
       App A       App B       App C
```

A user authenticates with UniPass instead of maintaining separate
credentials for every integrated application.

------------------------------------------------------------------------

# 5. V1 --- Complete SSO Product

V1 is intended to be a complete and usable SSO platform, not just a
collection of authentication APIs.

## Identity

-   User registration
-   User login
-   User logout
-   User profile
-   Password management
-   Session management
-   Active session listing
-   Session revocation

## OAuth 2.0

-   OAuth client registration
-   Client management
-   Redirect URI validation
-   Authorization endpoint
-   Authorization Code flow
-   PKCE
-   Token endpoint
-   Token revocation
-   OAuth scopes

## OpenID Connect

-   OIDC discovery
-   ID tokens
-   UserInfo endpoint
-   OIDC claims
-   JWKS endpoint
-   Cryptographic token verification

## User Dashboard

-   Login
-   Registration
-   Dashboard
-   Profile
-   Password management
-   Active sessions
-   Connected applications
-   Application details
-   Consent/access management
-   Account settings

## Security and Operations

-   Secure authentication
-   Password hashing
-   Session security
-   CSRF protection
-   Rate limiting
-   Request validation
-   Error handling
-   Audit logging
-   Signing key management
-   Key rotation foundation
-   Structured logging

------------------------------------------------------------------------

# 6. V2 --- Enhancements

V2 builds on the V1 architecture without redesigning the system.

Planned capabilities include:

-   Multi-factor authentication
-   Organizations
-   Membership management
-   External/social identity connections
-   Authentication policies
-   Improved security controls
-   Enhanced account security UI
-   Advanced application management
-   More granular authorization

The existing V1 domains remain the foundation.

``` text
V1
 |
 +-- MFA
 +-- Organizations
 +-- Connections
 +-- Policies
 +-- Security enhancements
```

------------------------------------------------------------------------

# 7. V3 --- Advanced Identity

V3 adds enterprise and advanced identity capabilities.

Planned capabilities include:

-   SAML
-   WebAuthn
-   Passkeys
-   Identity federation
-   Enterprise identity providers
-   Risk assessment
-   Advanced authentication policies
-   Advanced security and identity controls

``` text
V2
 |
 +-- SAML
 +-- WebAuthn / Passkeys
 +-- Federation
 +-- Risk Engine
```

V3 is an extension of the existing identity architecture rather than a
rewrite.

------------------------------------------------------------------------

# 8. Architecture

UniPass uses a **modular monolith**.

A modular monolith means:

-   One deployable backend application
-   One primary codebase
-   Strong internal domain boundaries
-   Independent business modules
-   Explicit dependencies
-   Shared infrastructure where appropriate
-   Ability to extract a domain later if scale or organizational
    requirements justify it

``` text
                    Express Application
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          Users          Auth          OAuth
             |             |             |
             +-------------+-------------+
                           |
                     Application Layer
                           |
                       Domain Layer
                           |
                  Infrastructure Layer
                           |
             +-------------+-------------+
             |             |             |
        PostgreSQL       Redis          KMS
```

The architecture intentionally avoids premature microservices.

------------------------------------------------------------------------

# 9. Backend Folder Structure

The backend is located at:

``` text
apps/unipass-api/src/
```

The structure follows DDD and separation of concerns.

``` text
src/
├── main.ts
├── app.ts
│
├── config/
│
├── routes/
│
├── middleware/
│
├── modules/
│   ├── users/
│   ├── auth/
│   ├── sessions/
│   ├── clients/
│   ├── oauth/
│   ├── oidc/
│   ├── tokens/
│   ├── consent/
│   ├── keys/
│   ├── audit/
│   │
│   ├── mfa/
│   ├── organizations/
│   ├── connections/
│   ├── policies/
│   │
│   ├── saml/
│   ├── webauthn/
│   ├── federation/
│   └── risk/
│
├── infrastructure/
│
└── shared/
```

------------------------------------------------------------------------

# 10. Backend Application Layer

## `main.ts`

Application entry point.

Responsibilities:

-   Start the Node.js process
-   Load application bootstrap
-   Start the HTTP server
-   Handle process-level startup concerns

It should contain minimal business logic.

## `app.ts`

Express application composition.

Responsibilities:

-   Create/configure Express
-   Register middleware
-   Register routes
-   Configure static React serving
-   Configure error handling

The application composition belongs here rather than inside individual
domains.

------------------------------------------------------------------------

# 11. Backend Configuration

``` text
config/
├── env.ts
├── app.config.ts
├── database.config.ts
└── security.config.ts
```

### `env.ts`

Responsible for environment configuration and environment validation.

Examples:

-   Database URL
-   Port
-   Session configuration
-   Cryptographic configuration
-   External provider configuration

### `app.config.ts`

Application-level configuration.

### `database.config.ts`

Database connection configuration.

### `security.config.ts`

Security-related configuration such as:

-   Token lifetimes
-   Session configuration
-   Cookie configuration
-   Security policies
-   Cryptographic settings

Configuration should be centralized rather than reading environment
variables throughout the application.

------------------------------------------------------------------------

# 12. Backend Routing

``` text
routes/
├── index.ts
├── auth.routes.ts
├── user.routes.ts
├── session.routes.ts
├── client.routes.ts
├── oauth.routes.ts
├── oidc.routes.ts
├── consent.routes.ts
├── audit.routes.ts
└── admin.routes.ts
```

Express routers provide the HTTP boundary.

The router should not contain business logic.

``` text
HTTP Request
     |
     v
Express Router
     |
     v
Controller
     |
     v
Application Use Case
     |
     v
Domain
```

This keeps Express-specific concerns separate from the domain.

------------------------------------------------------------------------

# 13. Backend Middleware

``` text
middleware/
├── auth.middleware.ts
├── error.middleware.ts
├── validation.middleware.ts
├── rate-limit.middleware.ts
├── csrf.middleware.ts
└── request-context.middleware.ts
```

Middleware handles cross-cutting HTTP concerns.

Examples:

-   Authentication context
-   Request validation
-   Error normalization
-   Rate limiting
-   CSRF protection
-   Request IDs / tracing context

Business decisions should remain inside application/domain layers.

------------------------------------------------------------------------

# 14. DDD Module Structure

Each important bounded context follows a similar structure.

Example:

``` text
modules/users/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

## Domain

Contains business rules and domain models.

``` text
domain/
├── entities/
├── value-objects/
├── repositories/
└── errors/
```

The domain should not depend on Express, Drizzle, Redis, or other
infrastructure technologies.

## Application

Contains use cases and application orchestration.

``` text
application/
├── use-cases/
├── services/
└── dto/
```

Examples:

-   Create user
-   Login user
-   Register OAuth client
-   Authorize application
-   Exchange authorization code
-   Grant consent

## Infrastructure

Contains technical implementations.

``` text
infrastructure/
└── persistence/
```

Examples:

-   Drizzle repository implementations
-   Database queries
-   External provider integrations

## Presentation

Contains HTTP-specific implementation.

``` text
presentation/
├── controllers/
├── routes/
└── schemas/
```

Controllers translate HTTP requests into application use cases and
translate results back into HTTP responses.

------------------------------------------------------------------------

# 15. V1 Backend Domains

## `users`

Owns the user identity.

Responsibilities:

-   User entity
-   Email identity
-   User ID
-   User profile
-   User persistence
-   User retrieval/update

## `auth`

Owns authentication behavior.

Responsibilities:

-   Registration
-   Login
-   Logout
-   Password changes
-   Authentication errors
-   Password-related operations

## `sessions`

Owns authenticated UniPass sessions.

Responsibilities:

-   Session creation
-   Session retrieval
-   Session listing
-   Session revocation
-   Session lifecycle

## `clients`

Owns applications registered with UniPass.

Responsibilities:

-   OAuth client registration
-   Client metadata
-   Redirect URIs
-   Client lifecycle
-   Client validation

## `oauth`

Owns OAuth protocol behavior.

Responsibilities:

-   Authorization requests
-   Authorization Code
-   PKCE
-   Authorization flow
-   Token exchange orchestration
-   OAuth validation

## `oidc`

Owns OpenID Connect behavior.

Responsibilities:

-   OIDC discovery
-   UserInfo
-   OIDC claims
-   OIDC protocol behavior

## `tokens`

Owns token lifecycle.

Responsibilities:

-   Access tokens
-   Refresh tokens
-   ID tokens
-   Token verification
-   Token lifecycle
-   Token persistence where required

## `consent`

Owns user authorization decisions.

Responsibilities:

-   Grant consent
-   Revoke consent
-   Application access
-   Requested scopes

## `keys`

Owns cryptographic signing keys.

Responsibilities:

-   Signing keys
-   Key storage abstraction
-   Key rotation
-   JWKS

## `audit`

Owns security and activity auditing.

Examples:

-   User login
-   Failed login
-   Session creation
-   Session revocation
-   Client registration
-   Consent changes
-   Security events

------------------------------------------------------------------------

# 16. V2 and V3 Domains

The architecture already reserves boundaries for future capabilities.

## V2

``` text
modules/
├── mfa/
├── organizations/
├── connections/
└── policies/
```

These modules should remain unused until their implementation phase.

## V3

``` text
modules/
├── saml/
├── webauthn/
├── federation/
└── risk/
```

These modules extend the identity platform without changing the
fundamental V1 architecture.

------------------------------------------------------------------------

# 17. Infrastructure

``` text
infrastructure/
├── database/
│   ├── client.ts
│   └── schema.ts
│
├── cache/
│   └── redis.ts
│
├── crypto/
│   ├── encryption.ts
│   ├── hashing.ts
│   └── random.ts
│
├── email/
│   └── email-provider.ts
│
├── events/
│   ├── event-bus.ts
│   └── event-publisher.ts
│
└── logging/
    └── logger.ts
```

Infrastructure contains implementations of technical concerns shared
across domains.

### Database

PostgreSQL is the primary system of record.

Drizzle is used for:

-   Schema definition
-   Queries
-   Migrations
-   Database access

### Redis

Redis is available for concerns such as:

-   Temporary OAuth state
-   Rate limiting
-   Session/cache workloads
-   Short-lived authentication data
-   Distributed coordination when required

Redis should not replace PostgreSQL as the source of truth for identity.

### Crypto

Cryptographic operations are centralized.

This prevents cryptographic logic from being duplicated throughout
controllers and services.

### Events

The event abstraction allows security and operational events to be
published without coupling domains directly to a particular message
broker.

### Logging

Centralized structured logging supports production troubleshooting and
observability.

------------------------------------------------------------------------

# 18. Shared Layer

``` text
shared/
├── errors/
│   ├── app-error.ts
│   └── error-codes.ts
│
├── types/
│   ├── common.types.ts
│   └── express.d.ts
│
├── constants/
│   └── index.ts
│
└── utils/
    └── pagination.ts
```

The shared layer contains only genuinely cross-domain functionality.

It should not become a dumping ground for business logic.

------------------------------------------------------------------------

# 19. React UI Structure

The React application is located at:

``` text
apps/unipass/
```

The current application follows a feature-oriented structure.

``` text
src/
├── app/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── details/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── multi-factor-auth/
│   │   ├── profile/
│   │   └── settings/
│   │
│   ├── shared/
│   │
│   ├── app.module.css
│   ├── app.spec.tsx
│   ├── app.tsx
│   └── nx-welcome.tsx
│
├── assets/
├── routes/
├── main.tsx
├── router.ts
└── routeTree.gen.ts
```

------------------------------------------------------------------------

# 20. UI Feature Structure

The UI is organized by product feature rather than by technical type.

## `features/auth`

Authentication-related screens and components.

Examples:

-   Login
-   Registration
-   Authentication state
-   Authentication forms
-   Authentication API integration

## `features/dashboard`

Main authenticated user dashboard.

Examples:

-   Overview
-   Account summary
-   Security summary
-   Application activity

## `features/details`

Reusable detail-oriented feature screens.

This area can contain application/user/security detail views that do not
belong exclusively to one authentication workflow.

## `features/home`

Public/home experience.

Examples:

-   Landing page
-   Product introduction
-   Public navigation

## `features/layout`

Application shell and shared page composition.

Examples:

-   Header
-   Sidebar
-   Navigation
-   Main layout
-   Responsive layout

## `features/multi-factor-auth`

Reserved for the MFA user experience.

The feature exists in the UI architecture so V2 can extend the existing
application rather than restructure it.

## `features/profile`

User identity management.

Examples:

-   Profile information
-   Personal information
-   Account information

## `features/settings`

User account and application settings.

Examples:

-   Password management
-   Security settings
-   Session management
-   Application preferences

------------------------------------------------------------------------

# 21. UI Shared Layer

``` text
app/shared/
```

Contains UI functionality that is genuinely reusable across multiple
features.

Examples:

-   Shared components
-   Common hooks
-   Shared types
-   UI utilities
-   Common API helpers

Feature-specific behavior should remain inside its feature.

------------------------------------------------------------------------

# 22. Routing

The UI uses a dedicated routing structure:

``` text
routes/
main.tsx
router.ts
routeTree.gen.ts
```

Routing is responsible for mapping URLs to application screens.

Conceptually:

``` text
/login
/register
/dashboard
/profile
/settings
/sessions
/applications
/applications/:id
/consent
```

OAuth authorization screens can use the same React application while
remaining logically separate from the authenticated dashboard.

------------------------------------------------------------------------

# 23. UI ↔ API Communication

The React dashboard communicates with the Express API.

``` text
React
  |
  | HTTP
  v
Express API
  |
  v
Application Layer
  |
  v
Domain
  |
  v
Database
```

The frontend should not directly access:

-   PostgreSQL
-   Redis
-   Cryptographic keys
-   Internal repositories
-   Domain persistence

Only the API is exposed to the browser.

------------------------------------------------------------------------

# 24. Static UI Serving

In production, the React application is built into static assets.

Express serves those assets.

Conceptually:

``` text
Browser
   |
   +---- /api/* -----------------> Express API
   |
   +---- /oauth/* ----------------> OAuth endpoints
   |
   +---- /oidc/* -----------------> OIDC endpoints
   |
   +---- / -----------------------> React static application
```

This allows UniPass to be deployed as a single application while still
maintaining a clean separation between UI and API concerns.

------------------------------------------------------------------------

# 25. OAuth / OIDC Flow

The primary V1 integration flow is:

``` text
Application
    |
    | 1. Redirect user
    v
UniPass /authorize
    |
    | 2. Authenticate
    v
UniPass Login
    |
    | 3. Existing session or login
    v
UniPass Session
    |
    | 4. Consent
    v
Authorization Code
    |
    | 5. Redirect to application
    v
Application Callback
    |
    | 6. Exchange code
    v
UniPass /oauth/token
    |
    +------ Access Token
    +------ ID Token
    +------ Refresh Token
```

The application can use the ID token and OIDC UserInfo to identify the
authenticated user.

Access tokens are used for authorized API access.

------------------------------------------------------------------------

# 26. Security Model

Security is a first-class architectural concern.

Important controls include:

-   Authorization Code flow
-   PKCE
-   State validation
-   OIDC nonce validation
-   Exact redirect URI validation
-   Secure session cookies
-   Password hashing
-   Token expiry
-   Refresh token lifecycle management
-   Token revocation
-   CSRF protection
-   Rate limiting
-   Brute-force protection
-   Signing key rotation
-   JWKS
-   Audit logs
-   Secure secret management

UniPass must never expose or share a user's password with an external
application.

------------------------------------------------------------------------

# 27. Scalability Strategy

The initial system is intentionally a modular monolith.

``` text
                 UniPass
                    |
        +-----------+-----------+
        |           |           |
      Auth        OAuth       Users
        |           |           |
        +-----------+-----------+
                    |
              Infrastructure
                    |
          PostgreSQL / Redis
```

The system can scale vertically and horizontally before considering
service extraction.

If a domain eventually requires independent scaling, deployment,
ownership, or fault isolation, it can be extracted behind an explicit
interface.

The target is:

``` text
Modular Monolith
       |
       v
Scale application
       |
       v
Identify real bottlenecks
       |
       v
Extract only justified domains
```

Microservices are not the default architecture.

------------------------------------------------------------------------

# 28. Development Strategy

Implementation should proceed incrementally.

## Stage 1 --- Foundation

-   Express bootstrap
-   Configuration
-   PostgreSQL
-   Drizzle
-   Error handling
-   Validation
-   Logging
-   Testing

## Stage 2 --- Identity

-   Users
-   Registration
-   Password hashing
-   Login
-   Sessions
-   Logout

## Stage 3 --- OAuth/OIDC

-   OAuth clients
-   Authorization endpoint
-   PKCE
-   Authorization Code
-   Token endpoint
-   Access tokens
-   Refresh tokens
-   ID tokens
-   UserInfo
-   JWKS
-   OIDC discovery

## Stage 4 --- Dashboard

-   Authentication UI
-   Dashboard
-   Profile
-   Password management
-   Sessions
-   Applications
-   Consent
-   Settings

## Stage 5 --- External Integration

Create a separate demo application and integrate it with UniPass.

The integration must prove:

``` text
Application
    |
    v
UniPass Login
    |
    v
Authorization
    |
    v
Code
    |
    v
Tokens
    |
    v
Application identifies user
```

This is the most important V1 acceptance scenario.

## Stage 6 --- Production Hardening

-   Security controls
-   Rate limiting
-   Token lifecycle
-   Key rotation
-   Audit logging
-   Observability
-   Failure handling
-   CI/CD
-   Production deployment

------------------------------------------------------------------------

# 29. Version Evolution

The versions are additive.

``` text
                         V1
                          |
          +---------------+---------------+
          |               |               |
        Identity        OAuth            OIDC
          |               |               |
          +---------------+---------------+
                          |
                         V2
                          |
          +---------------+---------------+
          |               |               |
         MFA        Organizations     Connections
                          |
                       Policies
                          |
                         V3
                          |
          +---------------+---------------+
          |               |               |
        SAML          WebAuthn        Federation
                                          |
                                        Risk
```

V2 and V3 should extend V1 rather than replace it.

------------------------------------------------------------------------

# 30. Design Principles

UniPass follows these principles:

1.  **Domain-first design**
2.  **Strict separation of concerns**
3.  **Protocol correctness over convenience**
4.  **Security by design**
5.  **Explicit module boundaries**
6.  **Infrastructure behind abstractions**
7.  **PostgreSQL as the source of truth**
8.  **No premature microservices**
9.  **Incremental scalability**
10. **Testable application/domain logic**
11. **Minimal coupling between bounded contexts**
12. **External applications never receive user passwords**

------------------------------------------------------------------------

# 31. CI/CD Strategy

The repository uses separate development and release branches.

``` text
develop
   |
   | Manual pipeline
   v
Quality → Lint → Test → Build


develop
   |
   | Pull Request / Merge
   v
main
   |
   | Automatic pipeline
   v
Quality ─┐
Lint ────┼──> Build
Test ────┘
             |
             v
       Manual Approval
             |
             v
        Production
```

The `develop` branch is intended for active development and manual CI
execution.

The `main` branch represents the release/production path.

Production deployment requires explicit approval through the protected
production environment.

------------------------------------------------------------------------

# 32. Current Project Philosophy

UniPass is intentionally being built as a serious production-oriented
identity platform rather than a basic login application.

The project should demonstrate practical understanding of:

-   Authentication
-   Authorization
-   OAuth 2.0
-   OpenID Connect
-   Sessions
-   Cryptography
-   Token security
-   API design
-   Domain-Driven Design
-   Express architecture
-   PostgreSQL
-   Distributed-system foundations
-   Security
-   Observability
-   CI/CD
-   Scalable application architecture

The implementation should favor correctness and clear boundaries over
unnecessary complexity.

------------------------------------------------------------------------

## Project Status

Current architectural target:

``` text
Backend:        Node.js + Express + TypeScript
Frontend:       React
Architecture:   Modular Monolith
Design:         Strict DDD
Database:       PostgreSQL
ORM:            Drizzle
Identity:       UniPass
Protocols:      OAuth 2.0 + OpenID Connect
V1:             Complete SSO Product
V2:             Advanced Authentication & Management
V3:             Enterprise / Advanced Identity
Deployment:     Express + static React build
```

UniPass V1 is the foundation. V2 and V3 should evolve from that
foundation without requiring a rewrite.
