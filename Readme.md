# UniPass

> A centralized Authentication and Identity Provider (IdP) built with Express.js, TypeScript, PostgreSQL, Drizzle ORM, JWT, and OAuth 2.0/OpenID Connect.

---

# Overview

UniPass is a standalone authentication service responsible for managing user identities across multiple applications.

Applications integrated with UniPass do **not** maintain their own authentication system. Instead, they delegate all authentication responsibilities to UniPass while retaining complete control over their own business logic and authorization rules.

UniPass acts as a trusted Identity Provider (IdP) and issues secure JWT access tokens after successfully authenticating users.

This architecture follows the same principles used by modern authentication providers such as Auth0, Keycloak, Okta, and Microsoft Entra ID.

---

# Core Responsibilities

UniPass is responsible for:

* User Registration
* User Authentication
* OAuth Login (Google, GitHub, etc.)
* JWT Token Generation
* Refresh Token Management
* Email Verification
* Password Reset
* Multi-Factor Authentication (Future)
* Session Management
* Device Management
* Audit Logging
* OAuth Client Management
* Identity Claims
* User Profile Management

---

# What UniPass Does NOT Handle

UniPass is **not** responsible for application-specific authorization.

For example:

❌ Can the user edit a Workout?

❌ Can the user delete an Order?

❌ Can the user create a Blog?

❌ Can the user access Premium Fitness Plans?

These decisions belong entirely to the application.

---

# Authentication vs Authorization

Authentication answers:

> Who is this user?

Authorization answers:

> What is this user allowed to do?

UniPass performs authentication.

Each application performs authorization.

This separation keeps services loosely coupled, scalable, and easier to maintain.

---

# High-Level Architecture

```
                     +----------------------+
                     |       UniPass        |
                     |----------------------|
                     | Authentication       |
                     | OAuth                |
                     | JWT                  |
                     | Sessions             |
                     | User Management      |
                     +----------+-----------+
                                |
          |---------------------|-------------------------|
          |                     |                         |
          |                     |                         |
   Fitness App           Community App             Merchandise App
          |                     |                         |
    Authorization         Authorization          Authorization
     Business Logic       Business Logic          Business Logic
```

Every application trusts UniPass for user identity.

Each application owns its own authorization logic.

---

# Login Flow

```
User

↓

Open Fitness App

↓

Click Login

↓

Redirect to UniPass

↓

Authenticate
  • Email + Password
  • Google
  • GitHub

↓

UniPass validates credentials

↓

Generate Access Token

↓

Generate Refresh Token

↓

Redirect back to Fitness App

↓

User is authenticated
```

---

# Request Flow

```
GET /api/workouts

Authorization: Bearer JWT
```

The application verifies the JWT using UniPass's public key.

If valid:

```
Authenticated User

↓

Application Authorization

↓

Access Granted or Denied
```

No database lookup is required for every request.

---

# Authorization Flow

Example:

```
DELETE /workout/123
```

Application checks:

```
role == trainer

AND

subscription == premium
```

If allowed:

```
200 OK
```

Otherwise:

```
403 Forbidden
```

UniPass is never aware of workouts or business rules.

---

# Supported Authentication Methods

## Email & Password

Traditional authentication using securely hashed passwords.

---

## OAuth

* Google
* GitHub
* Microsoft (Future)
* Apple (Future)

---

## JWT Authentication

UniPass issues:

* Access Token
* Refresh Token

Applications validate Access Tokens locally.

---

## OpenID Connect

Provides standardized user identity information for integrated applications.

---

# JWT Claims

Example:

```json
{
  "sub": "user_123",
  "email": "john@example.com",
  "roles": [
    "trainer"
  ],
  "iss": "https://auth.unipass.dev",
  "aud": "fitness-app",
  "exp": 1712345678
}
```

Applications may use these claims to assist with authorization.

---

# OAuth Clients

Every integrated application must register with UniPass.

Each client receives:

* Client ID
* Client Secret
* Redirect URI
* Allowed Scopes
* Allowed Origins

Example:

```
Fitness App

Client ID:
fitness_app

Redirect URI:
https://fitness.example.com/auth/callback
```

---

# User Lifecycle

```
Register

↓

Verify Email

↓

Login

↓

Receive JWT

↓

Access Applications

↓

Refresh Token

↓

Logout

↓

Invalidate Session
```

---

# Database Modules

## Identity

* users
* user_profiles
* oauth_accounts

---

## Authentication

* refresh_tokens
* sessions
* devices

---

## Authorization Metadata

* roles
* permissions
* user_roles
* role_permissions

> These roles represent identity claims and are not application business rules.

---

## OAuth

* oauth_clients
* oauth_scopes
* oauth_authorizations

---

## Security

* email_verification_tokens
* password_reset_tokens
* login_attempts

---

## Audit

* audit_logs

---

# Security Features

* Password Hashing (Argon2)
* JWT Access Tokens
* Refresh Tokens
* HTTP Only Cookies (optional)
* CSRF Protection
* Rate Limiting
* CORS Protection
* Email Verification
* Password Reset
* Device Tracking
* Session Revocation
* Token Expiration
* Secure OAuth Flow

---

# Suggested Folder Structure

```
src
│
├── config
├── database
├── middleware
├── modules
│
│   ├── auth
│   ├── users
│   ├── oauth
│   ├── sessions
│   ├── tokens
│   ├── email
│   ├── audit
│   ├── clients
│   ├── roles
│   └── health
│
├── shared
│
│   ├── constants
│   ├── errors
│   ├── logger
│   ├── utils
│   └── validators
│
├── routes
├── app.ts
└── server.ts
```

---

# Recommended Technology Stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Runtime          | Node.js                    |
| Framework        | Express.js                 |
| Language         | TypeScript                 |
| Database         | PostgreSQL                 |
| ORM              | Drizzle ORM                |
| Authentication   | JWT                        |
| OAuth            | OAuth 2.0 + OpenID Connect |
| Validation       | Zod                        |
| Password Hashing | Argon2                     |
| Cache            | Redis (optional)           |
| Logging          | Pino                       |
| Testing          | Vitest                     |

---

# Design Principles

* Authentication is centralized.
* Authorization remains decentralized.
* Applications trust UniPass as the single source of identity.
* Applications own their business rules.
* JWTs are stateless and verified locally.
* OAuth enables secure third-party logins.
* The architecture is modular and extensible.
* Services remain loosely coupled.
* Security is prioritized by design.

---

# Future Enhancements

* Multi-Factor Authentication (MFA)
* WebAuthn / Passkeys
* Organization & Multi-Tenant Support
* SAML Integration
* Identity Federation
* Fine-Grained Attribute-Based Access Control (ABAC) Claims
* Admin Dashboard
* SDKs for React, Next.js, Express, and NestJS
* Event Webhooks
* Token Introspection Endpoint
* JWKS Endpoint
* OpenAPI Documentation
* Docker & Kubernetes Deployment
* Monitoring & Observability

---

# Project Goal

UniPass aims to provide a production-ready centralized identity platform that allows multiple applications to share a single authentication service while maintaining complete independence over their own authorization and business logic.

This separation of concerns results in a secure, scalable, and maintainable architecture suitable for modern distributed applications.
