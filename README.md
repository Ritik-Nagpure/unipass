# UniPass SSO

## Centralized Single Sign-On & Identity Access Platform

UniPass is a centralized **Single Sign-On (SSO) and Identity & Access Management (IAM) platform** designed to allow users to authenticate once and securely access multiple independent applications.

Instead of every application implementing its own user registration, login, password management, authentication, and application permissions, UniPass provides a centralized identity and authentication layer.

External applications integrate with UniPass as trusted clients. Users are redirected to UniPass for authentication and authorization, after which UniPass securely returns an authentication result to the requesting application.

---

# Table of Contents

* Overview
* Problem Statement
* Application Target
* Core Objectives
* Key Features
* SSO Flow
* Authentication
* Authorization
* Application Integration
* Token Management
* User Dashboard
* Security
* Database
* Architecture
* Technology Stack
* Project Structure
* Advantages
* Disadvantages
* Limitations
* Scalability
* Reliability
* Observability
* CI/CD
* Deployment
* Testing Strategy
* Future Roadmap
* Production Considerations
* Non-Goals
* Getting Started
* Project Status
* License

---

# Overview

Modern organizations often operate multiple applications that require user authentication.

For example:

* Web Application
* Admin Portal
* Customer Portal
* SaaS Product
* Internal Tools
* Communication Platform
* E-commerce Platform

Without centralized authentication, every application may need to maintain:

* User registration
* Login
* Password hashing
* Password policies
* Sessions
* Authentication tokens
* Logout
* Account management
* Application permissions
* Security controls

This results in duplicated functionality and inconsistent security practices.

UniPass centralizes these responsibilities into a dedicated identity platform.

The applications become relying parties/clients while UniPass becomes the central authentication and identity provider.

---

# Problem Statement

The primary problem UniPass solves is **fragmented authentication and access management across multiple applications**.

Without UniPass:

Application A → own authentication

Application B → own authentication

Application C → own authentication

This creates:

* Duplicate user accounts
* Multiple passwords
* Repeated login experiences
* Duplicated authentication code
* Inconsistent security policies
* Difficult account management
* Difficult access revocation
* Increased maintenance cost

With UniPass:

User → UniPass → Application A

User → UniPass → Application B

User → UniPass → Application C

The user's identity and authentication are centralized.

---

# Application Target

UniPass targets organizations and product ecosystems that operate multiple applications requiring a common identity system.

## Primary Target

The primary target is an organization that owns multiple applications and wants centralized authentication across them.

Examples include:

* SaaS companies
* Enterprise software organizations
* Product ecosystems
* Internal enterprise applications
* Multi-product platforms
* B2B application platforms
* Consumer application ecosystems

## Secondary Target

UniPass can eventually be extended as an authentication service that third-party businesses integrate into their own applications.

External applications can use UniPass as their identity provider instead of implementing authentication independently.

---

# Core Objectives

The V1 system focuses on the following objectives:

1. Centralize user authentication.
2. Provide Single Sign-On across registered applications.
3. Allow applications to integrate securely with UniPass.
4. Provide application-level authorization.
5. Allow users to grant and revoke application access.
6. Issue verifiable authentication tokens.
7. Maintain authentication and authorization history.
8. Provide a secure and maintainable architecture.
9. Provide automated testing and CI/CD.
10. Deploy the first production-ready version.

---

# Key Features

## 1. User Registration

Users can create a UniPass account using:

* Full name
* Email
* Password

Passwords are securely hashed before being stored.

UniPass never stores plaintext passwords.

---

## 2. User Login

Users can authenticate using their UniPass credentials.

Successful authentication establishes an authenticated session/token context.

Failed authentication attempts are handled securely without exposing unnecessary account information.

---

## 3. Single Sign-On

The primary purpose of UniPass is to provide Single Sign-On.

A user authenticates with UniPass once and can subsequently access authorized applications without maintaining independent authentication credentials in every application.

---

## 4. External Application Registration

Applications must register with UniPass before participating in the SSO ecosystem.

An application contains information such as:

* Application ID
* Application name
* Application secret where applicable
* Registered redirect URI
* Application status

This establishes a trusted relationship between UniPass and the external application.

---

## 5. Redirect URI Validation

UniPass validates redirect URIs before returning authentication results.

Only registered redirect destinations are allowed.

This is a critical security feature because unrestricted redirects could introduce authentication-token leakage and open-redirect vulnerabilities.

---

## 6. OAuth-Based Authorization Flow

UniPass uses an OAuth 2.0 Authorization Code-style flow as the foundation for application authorization.

The flow allows an external application to request authentication through UniPass without directly handling the user's UniPass password.

The long-term architecture is intended to be compatible with OpenID Connect for standardized identity information.

---

## 7. User Consent

When an application requests access, the user can review and approve or deny the request.

This allows users to maintain control over which applications can access their identity.

---

## 8. Application Permissions

UniPass maintains a relationship between users and applications.

A user can:

* Grant application access
* View connected applications
* Revoke application access
* Review access status

---

## 9. JWT Authentication

UniPass can issue signed JWT-based tokens containing relevant identity and application claims.

Tokens can contain information such as:

* User identity
* Client/application identity
* Issuer
* Audience
* Expiration
* Issued-at timestamp
* Token identifier
* Scope where applicable

External applications can verify these tokens using the UniPass verification mechanism.

---

## 10. Token Verification

Applications must be able to verify that a token:

* Was issued by UniPass
* Has a valid signature
* Has not expired
* Was issued for the expected audience
* Contains valid claims

Token verification prevents applications from blindly trusting unverified client-provided identity information.

---

## 11. User Dashboard

Authenticated users receive a centralized dashboard.

The dashboard provides:

* User profile
* Connected applications
* Application access status
* Access grant information
* Access revocation

This provides users with a single place to manage their application access.

---

## 12. Profile Management

Users can manage their basic UniPass identity information.

Depending on the V1 implementation, this may include:

* Full name
* Email
* Account information

---

## 13. Login History

UniPass maintains authentication history.

Relevant information can include:

* User
* Application
* IP address
* Timestamp
* Authentication event

This provides visibility into authentication activity.

---

## 14. Audit Logging

Security-sensitive events can be recorded for traceability.

Examples include:

* Successful login
* Failed authentication
* Application authorization
* Application access revocation
* Authorization events
* Token-related events

Sensitive credentials and raw tokens should never be stored in audit logs.

---

# SSO Flow

A typical UniPass authentication flow is:

1. User opens an external application.
2. The application determines that authentication is required.
3. The application redirects the user to UniPass.
4. UniPass validates the application/client.
5. UniPass validates the redirect URI.
6. UniPass determines whether the user is already authenticated.
7. If not authenticated, UniPass presents the login experience.
8. User authenticates.
9. UniPass determines whether application authorization is required.
10. User approves or denies access.
11. UniPass generates a short-lived authorization result.
12. The external application exchanges the authorization result.
13. UniPass validates the request.
14. UniPass issues the appropriate authentication token.
15. The external application verifies the token.
16. The application establishes its own authenticated session.
17. The user can use the application.

The important security principle is that the external application should never receive or handle the user's UniPass password.

---

# Authentication vs Authorization

UniPass separates authentication from authorization.

## Authentication

Authentication answers:

"Who is this user?"

UniPass is responsible for authenticating the user.

## Authorization

Authorization answers:

"Is this user allowed to access this application?"

UniPass maintains application access relationships and user consent.

This separation allows the system to evolve toward a broader IAM architecture.

---

# Application Integration Model

External applications act as UniPass clients.

A client must provide:

* Application identifier
* Registered redirect URI
* Required authentication/authorization parameters
* Appropriate client credentials depending on the flow

The external application redirects users to UniPass instead of implementing its own centralized authentication experience.

After successful authorization, the application receives the authentication result and establishes its own application session.

---

# Security Model

Security is a primary concern because UniPass becomes a centralized identity authority.

The system therefore needs strong controls around:

* Password hashing
* Token signing
* Token expiration
* Redirect URI validation
* Client validation
* Authorization
* Session management
* Rate limiting
* CORS
* HTTPS
* Security headers
* Secret management
* Database access
* Input validation
* Audit logging
* Error handling

---

# Password Security

Passwords are never stored in plaintext.

UniPass uses bcrypt-based password hashing for V1.

Authentication compares the supplied password against the stored password hash.

Password hashes must never be returned through APIs.

---

# Token Security

Tokens should:

* Have limited lifetimes
* Be cryptographically signed
* Contain only required claims
* Be bound to the intended client where applicable
* Validate issuer and audience
* Be rejected after expiration
* Never be unnecessarily logged

Long-lived credentials should not be exposed through browser redirects.

---

# Database

UniPass uses PostgreSQL as its primary database.

The database is responsible for storing identity, application, authorization, and audit information.

Core entities include:

## Users

Stores UniPass identities.

Typical information:

* ID
* Email
* Password hash
* Full name
* Created timestamp
* Updated timestamp

## Applications

Stores registered UniPass clients.

Typical information:

* ID
* Application ID
* Application name
* Application secret
* Redirect URI
* Status

## User Applications

Represents the relationship between a user and an application.

Typical information:

* User ID
* Application ID
* Access granted timestamp
* Access revoked timestamp

## Login History

Stores authentication events.

Typical information:

* User ID
* Application ID
* IP address
* Login timestamp

## Authorization Data

Stores short-lived authorization state required to complete secure OAuth flows.

This may include:

* Authorization codes
* Expiration
* Client association
* User association
* Redirect URI association
* Usage/revocation state

---

# Technology Stack

## Frontend

* React
* Vite
* React Router

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* PostgreSQL

## ORM

* Drizzle ORM

## Authentication

* JWT
* bcrypt

## Development

* TypeScript/JavaScript depending on module
* ESLint
* Formatting tools
* Automated testing

## CI/CD

* GitHub Actions

---

# Architecture

At a high level, UniPass consists of:

## Frontend

Responsible for:

* Registration
* Login
* Consent
* Dashboard
* Profile
* Application access management

## Backend

Responsible for:

* Authentication
* Authorization
* OAuth flow
* Client validation
* Token generation
* Token verification
* User management
* Application management
* Audit logging

## Database

Responsible for:

* User persistence
* Application persistence
* Access relationships
* Authorization state
* Login history
* Audit events

## External Applications

External applications consume UniPass authentication rather than maintaining their own centralized UniPass identity.

---

# Project Structure

The repository follows a monorepo architecture.

The major components are:

## frontend

Contains the React/Vite user interface.

## backend

Contains the Express REST API, authentication logic, authorization logic, OAuth flow, token services, and database access.

## shared

Contains reusable contracts, types, DTOs, and other shared functionality.

---

# Advantages

## Centralized Authentication

Authentication logic exists in one dedicated platform instead of being duplicated across applications.

## Better User Experience

Users can authenticate once and access multiple connected applications.

## Centralized Access Management

Users can see and revoke application access from one location.

## Consistent Security

Password handling, token validation, authentication policies, and security controls can be standardized.

## Reduced Development Duplication

Applications no longer need to independently build complete authentication systems.

## Easier Application Onboarding

New applications can integrate with the existing UniPass authentication platform.

## Centralized Auditability

Authentication and authorization events can be analyzed centrally.

## Future IAM Expansion

The architecture provides a foundation for future capabilities such as:

* MFA
* Password reset
* Email verification
* Role-based access control
* Organization management
* SAML
* OpenID Connect
* Social login
* Enterprise identity federation

---

# Disadvantages

## Single Point of Identity Dependency

If UniPass becomes unavailable, applications depending on it may be unable to authenticate new users.

Availability therefore becomes a critical requirement as adoption increases.

## Security Impact of Compromise

UniPass becomes a high-value security target.

A compromise of the identity provider could affect multiple connected applications.

## Operational Complexity

OAuth, token security, identity management, application authorization, and session management are significantly more complex than implementing a simple login system.

## Migration Complexity

Existing applications with independent user accounts may require identity migration and account-linking strategies.

## Token Lifecycle Complexity

Token expiration, revocation, rotation, session management, and credential storage require careful design.

## Increased Infrastructure Responsibility

UniPass becomes responsible for maintaining a security-sensitive production service.

---

# Limitations of V1

The initial V1 intentionally focuses on core authentication and application authorization.

The following capabilities may not be included initially:

* Multi-factor authentication
* Password reset workflows
* Email verification
* Account recovery
* Social login
* Enterprise SAML federation
* Advanced OpenID Connect functionality
* Hardware security keys
* Adaptive/risk-based authentication
* Fine-grained RBAC
* Organization/tenant management
* Advanced session management
* Enterprise directory synchronization
* Advanced security analytics

These can be added in later versions.

---

# Scalability

The architecture should allow the system to scale independently.

Potential scaling dimensions include:

## Frontend

The frontend can be served through a CDN or scalable web infrastructure.

## Backend

The API should remain stateless where possible so multiple backend instances can run behind a load balancer.

## Database

PostgreSQL can initially run as the primary persistence layer and later evolve with:

* Connection pooling
* Read replicas
* Query optimization
* Partitioning where justified
* Backup and recovery infrastructure

## Cache

A distributed cache can eventually be introduced for suitable workloads such as:

* Short-lived authorization state
* Rate limiting
* Session data
* Frequently accessed client metadata

Caching should not be introduced prematurely.

---

# Reliability

Because UniPass is an identity service, availability is more important than for many ordinary applications.

Production reliability should eventually include:

* Health checks
* Readiness checks
* Automated deployment verification
* Database backups
* Disaster recovery
* Monitoring
* Alerting
* Graceful shutdown
* Horizontal application scaling
* Infrastructure redundancy

The V1 deployment can remain intentionally simple while maintaining a path toward higher availability.

---

# Observability

Production UniPass should provide:

* Structured application logs
* Request IDs
* Authentication event tracking
* Error tracking
* Database health monitoring
* Application health monitoring
* Deployment/version information
* Performance metrics
* Authentication failure monitoring

Sensitive information must never be written to logs.

---

# CI/CD

GitHub Actions is used to automate the software delivery lifecycle.

The intended pipeline includes:

1. Code checkout
2. Dependency installation
3. Linting
4. Type checking
5. Automated tests
6. Security/dependency checks
7. Production build
8. Database migration
9. Deployment
10. Health verification

Production deployment should require appropriate approval controls.

---

# Deployment

The initial production environment should prioritize:

* Low operational cost
* Security
* Simplicity
* Reproducibility
* Observability
* Future scalability

Production secrets must be stored outside source control.

The production database should not be unnecessarily exposed to the public internet.

All external traffic should use HTTPS.

---

# Testing Strategy

Testing should cover multiple levels.

## Unit Tests

Used for isolated business logic such as:

* Password validation
* JWT validation
* Client validation
* Redirect URI validation
* Authorization decisions

## Integration Tests

Used for:

* API endpoints
* Database operations
* Authentication flows
* Authorization flows
* Token exchange

## End-to-End Tests

Used for complete journeys:

* Registration
* Login
* SSO
* Consent
* Token exchange
* Dashboard
* Application access
* Revocation
* Logout

## Security Tests

Special attention should be given to:

* Invalid tokens
* Expired tokens
* Authorization-code replay
* Redirect URI manipulation
* Unauthorized application access
* Cross-user access
* Authentication abuse
* Input validation
* Token leakage

---

# Production Considerations

Before exposing UniPass to real users, the following should be reviewed carefully:

## Identity Provider Security

UniPass is a high-value security component.

A vulnerability can affect every connected application.

## Redirect URI Security

Redirect URIs must be validated strictly.

Wildcard or overly permissive redirect policies should be avoided.

## Secret Management

Secrets must be stored using an appropriate secret-management mechanism.

They should never be committed to Git.

## Token Lifetime

Tokens should have carefully selected expiration periods.

Long-lived access tokens increase security risk.

## Revocation

The system must define how revoked application permissions affect future authorization and token usage.

## Availability

Applications depending on UniPass need a strategy for handling UniPass outages.

## Disaster Recovery

Database backup and restore procedures must be tested rather than merely documented.

---

# Non-Goals for V1

The first version intentionally does not attempt to become a complete enterprise identity platform.

V1 prioritizes:

* Core SSO
* User authentication
* Application registration
* OAuth-style authorization
* Token issuance
* Token verification
* Application permissions
* User dashboard
* Audit history
* Production deployment

Advanced identity capabilities can be introduced after the core platform is stable.

---

# Future Roadmap

Potential future releases can expand UniPass into a complete identity platform.

## V2 — Account Security

* Email verification
* Password reset
* Password change
* MFA
* Login notifications
* Session management
* Device management

## V3 — OpenID Connect

* OIDC discovery
* Standard ID tokens
* UserInfo endpoint
* JWKS endpoint
* Standard scopes
* Standard claims

## V4 — Enterprise Identity

* SAML
* LDAP/Active Directory integration
* Enterprise federation
* Organization management
* Multi-tenancy
* Domain-based identity policies

## V5 — Advanced IAM

* RBAC
* ABAC
* Groups
* Roles
* Policy engine
* Fine-grained permissions
* Service identities

## V6 — Security Intelligence

* Risk-based authentication
* Suspicious login detection
* Device fingerprinting
* Security analytics
* Anomaly detection
* Automated threat response

---

# Architectural Direction

The long-term goal is for UniPass to evolve from a basic SSO application into a centralized identity and access platform.

The conceptual evolution is:

Authentication

→ SSO

→ OAuth 2.0

→ OpenID Connect

→ Identity Management

→ Access Management

→ Enterprise Federation

→ IAM Platform

The V1 implementation should therefore avoid proprietary authentication flows wherever practical and maintain compatibility with established identity standards.

---

# Example Ecosystem

A future UniPass ecosystem could contain:

* UniPass Identity
* SaaS Application
* Social Platform
* Communication Platform
* E-commerce Platform
* Admin Portal
* Developer Portal
* Internal Business Applications

All applications can rely on the same centralized identity platform while maintaining their own application-specific authorization and business logic.

---

# Success Criteria for V1

UniPass V1 is considered successful when:

* A user can register.
* A user can log in.
* An external application can register with UniPass.
* An external application can initiate SSO.
* UniPass validates the client.
* UniPass validates the redirect URI.
* The user can authenticate.
* The user can approve or deny application access.
* UniPass can issue an authorization result/token.
* The external application can verify the token.
* The user can view connected applications.
* The user can revoke application access.
* Authentication activity is recorded.
* Backend APIs are validated and protected.
* Automated tests pass.
* CI/CD is operational.
* The system can be deployed to production.
* Production health can be monitored.

---

# Project Status

## Version

V1 — Initial Production Release

## Current Focus

Core Single Sign-On and centralized application access management.

## Development Model

The project is developed as a monorepo containing frontend, backend, and shared components.

## Deployment Model

Automated CI/CD through GitHub Actions with a production deployment pipeline.

---

# Contributing

Development should follow the project's established engineering standards.

Before submitting changes:

* Run linting.
* Run tests.
* Verify the production build.
* Review security implications.
* Avoid committing secrets.
* Update relevant documentation.
* Keep authentication and authorization changes backward compatible where possible.

Security-sensitive changes should receive additional review before production deployment.

---

# Security

Security vulnerabilities should not be disclosed through public issue tracking.

Authentication, authorization, token handling, password management, redirect validation, and secret management should be treated as security-sensitive components.

---

# License

License information should be added according to the organization's chosen licensing model.

---

# Final Summary

UniPass is a centralized **SSO, authentication, and access-management platform**.

Its primary responsibility is to establish a trusted identity layer between users and multiple independent applications.

The platform centralizes authentication while allowing applications to retain ownership of their business logic and application-specific authorization.

The V1 architecture focuses on delivering a secure, standards-aligned, production-ready foundation that can evolve into a broader Identity and Access Management platform.

The long-term objective is to make UniPass the centralized identity foundation for an ecosystem of applications rather than simply another login application.
