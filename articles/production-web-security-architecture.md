---
slug: "production-web-security-architecture"
title: "Web security architecture across browser, service and database boundaries"
description: "Trace authority and data across a production web system, then verify where each threat is prevented, detected and contained."
date: "2026-10-13"
updatedAt: "2026-10-14"
contextDate: "2025-09-18"
tags:
  - Security architecture
  - Web systems
  - Authorization
---

A web system can use HTTPS, verified tokens and parameterized queries while still allowing a tenant administrator to download another tenant's export. Security depends on how authority crosses boundaries, not just whether a list of controls appears in the stack.

I would review the system as a sequence of decisions: who supplied this input, which identity has been established, which capability is being exercised, what data may cross the boundary, and what happens if that decision is wrong.

The worked design is a hypothetical multi-tenant application with browser sessions, server commands, background exports and private object storage. Each boundary has a threat, an authority decision and a verification obligation.

## Draw authority as well as network connections

A network diagram shows where requests travel. Add the credentials and trust decisions at each hop:

```text
untrusted browser input
  -> edge: TLS, request limits, trusted proxy metadata
  -> session verification: actor identity
  -> membership + action policy: scoped authority
  -> domain command: validated business operation
  -> database: constrained role + transaction + tenant boundary
  -> job: recorded purpose and authority
  -> object storage: limited access capability
```

An internal network location should not automatically grant application authority. A worker, administrator tool or compromised sibling service can still issue an unauthorized command. Use authenticated service identity and explicit capabilities where services cross boundaries.

Inventory assets and plausible threats: private records, financial state, credentials, accepted operations, availability and audit evidence. Prioritize controls by the harm and access path. A public content page and an administrator refund command do not need identical exposure or recovery behavior.

Use a verification standard to organize coverage. The [OWASP ASVS project](https://owasp.org/www-project-application-security-verification-standard/) provides structured application-security requirements. Choose and pin the version used by the review; a checklist reference without implementation evidence is not a completed verification.

## Give the browser a minimal, recoverable session

For a browser-backed application, a server-managed session in an appropriately scoped secure cookie can keep provider tokens away from ordinary JavaScript. That choice trades browser token exposure for server session storage and revocation responsibilities.

Use Secure and HttpOnly where appropriate, define SameSite behavior for the actual login and cross-site flows, and avoid broad cookie domain scope. HttpOnly reduces direct script access to the cookie; an XSS payload may still perform actions as the user through the application. Preventing XSS remains necessary.

Rotate session identity when authentication state or privilege changes, set expiration rules, and support revocation. Sensitive commands may require recent authentication or an additional factor according to the risk. Do not assume a long-lived session always represents the user's current authority.

When using OAuth-based login, use a maintained implementation and the provider's supported flow. [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700), published in January 2025, updates OAuth security guidance, including authorization-code protections and redirect handling. OAuth authorization and application login have distinct responsibilities; OpenID Connect supplies identity-layer semantics where used.

Validate token issuer, audience, signature, allowed algorithms and time conditions through a trusted library. A token's JSON payload is untrusted until verification succeeds. Plan key rotation and bounded key fetching so an unknown key ID cannot cause an unbounded dependency workload.

## Protect state-changing requests according to credential behavior

Cookies are sent by the browser according to their scope, including some requests a user did not intend to initiate. State-changing endpoints need cross-site request forgery protection appropriate to the framework and deployment: anti-CSRF tokens, origin validation and cookie policy can work together.

Do not change business state through GET requests. Prefetchers, crawlers and embedded resources can issue reads without the user's intention to perform an action. An unsafe GET also complicates caching and retry semantics.

CORS controls browser access to responses. It does not authorize a resource and does not prevent a non-browser client from making a request. Credentialed origins should be explicit and validated; reflecting arbitrary origins into an allow rule is not a policy.

Trust forwarded headers only from configured proxies. A caller-supplied forwarded host or protocol can affect redirects, cookie behavior and generated links if the application accepts it blindly. Validate the deployment's host and proxy model rather than copying a generic setting.

## Stop browser injection at the output boundary

Use context-appropriate escaping for text, attributes, URLs and scripts. A value safe in HTML text is not automatically safe inside a JavaScript string or URL. Rich HTML needs a maintained sanitizer configured for the allowed content model.

Minimize third-party scripts, review what data they can access, and pin or verify assets where the integration supports it. A marketing script running on an authenticated administrator page shares a powerful browser context.

Deploy Content Security Policy as an additional layer. The [OWASP CSP guidance](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) describes its role alongside safe application code. A nonce-based policy needs unpredictable per-response nonces and compatible rendering; reusing a static nonce undermines its purpose.

Roll out a policy with controlled reporting, then enforce the tested policy. Reports can contain sensitive URLs and arrive at high volume, so their collection endpoint needs limits and retention rules. A report-only policy observes violations but does not block them.

Keep clickjacking controls and form destinations aligned with actual embedding requirements. Broad exceptions added to make one integration work can open unrelated privileged pages. Test the protected workflows after policy changes.

## Authorize the action at the resource boundary

Authentication establishes an actor. Authorization decides whether that actor can perform this action on this resource now. Tenant membership, ownership, role, workflow state and delegated capability may all matter.

Resolve those facts server-side. Do not trust hidden form fields, disabled buttons or a client-provided role. The [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) recommends denial by default and checks on every request. Apply the same principle to exports, websocket messages, jobs and support tooling.

Avoid a central middleware check that merely proves the user is signed in while handlers perform unscoped resource access. Middleware can establish trusted context; the resource command should enforce its specific policy.

Decide how revocation affects queued work. A recorded export command might carry a bounded capability accepted at enqueue time, or the worker might require current membership before execution. Either can be appropriate under a defined policy. A serialized user object should not decide this accidentally.

Keep exceptional access explicit. Support impersonation or emergency access needs limited scope, duration, purpose and audit evidence. Ordinary request credentials should not inherit that capability.

## Constrain persistence and private-object access

Use parameterized queries and a runtime database role with only needed privileges. Separate schema ownership and migration credentials. Tenant-aware row policies can contain an omitted filter, but their bypass roles and context-setting authority must be reviewed.

Use constraints for relationship invariants and transactions for local atomic changes. Input validation does not prevent concurrent requests from violating a rule that lacks database enforcement. A secure command also needs correct concurrency behavior.

Object storage should remain private where the data is private. Before issuing an access URL, authorize the resource and select the object key from trusted storage. A caller-supplied key must not be enough to retrieve a file. Bound the capability's lifetime and response behavior.

Do not place sensitive exports in a predictable public directory and rely on obscurity. Keep export ownership and expiration records, and delete or revoke according to the product's retention policy. Search indexes and caches need equivalent tenant and permission scoping.

## Restrict outbound work and bound attacker-controlled cost

A server that fetches user-supplied URLs can access destinations the browser cannot. Protect against server-side request forgery with an allowed-destination policy, redirect checks and network egress constraints. Account for private address ranges, metadata services, IPv6 and DNS changes.

Prefer narrowly defined integrations over a general privileged fetch endpoint. A URL parser is necessary but does not establish that the resolved destination is allowed. Validate at the point of connection with a controlled client and deployment network policy.

Limit input size before parsing, decompressed size before processing, file types before invoking converters, and job cost before admission. An authenticated request can still be abusive. Apply quotas to expensive business operations as well as request rates.

Use bounded concurrency and deadlines for dependency work. An attacker who holds connections or triggers expensive parsing can exhaust availability without breaking authentication. Availability controls are part of the security architecture.

## Keep the software supply and deployment authority narrow

Pin dependencies through lockfiles, review updates and track vulnerabilities relevant to the deployed version. Build and deployment systems hold credentials with substantial authority; they need least privilege and protected release paths.

Separate build-time and runtime secrets. Browser-exposed configuration must be intentional. A public-prefixed environment variable or a serialized server prop can disclose a secret despite the source file living in a server directory.

Verify artifacts and deployment configuration, not just repository code. Headers, storage permissions, proxy trust and database roles can differ between preview and production. Tests should identify which environment they inspected.

Prepare credential rotation and compromise response. The ability to revoke a session, disable an integration token and reconstruct sensitive actions is an architectural feature, not an incident-time improvisation.

## Trace a revoked user through a background export

The user is authorized when requesting an export. Before the worker starts, an administrator removes their tenant membership. The stored job still exists, the worker still has database credentials, and a browser may still hold an earlier session. This history tests several authority lifetimes at once.

Choose whether the accepted job carries a bounded capability or requires current authorization. For a sensitive export, the product may require reauthorization at execution and delivery. Record the decision in the job contract. A copied role field cannot serve as evidence of current membership, and a worker's broad database role should not make the policy irrelevant.

If a file already exists, issuing a new download URL is another authorized action. Validate the output's ownership record and current delivery policy. A previously issued signed URL can remain usable until its expiry under the storage mechanism's contract, so immediate revocation requires a different delivery design. Keep that consequence visible when choosing URL lifetime.

Test all three moments: admission, execution and delivery. Then attempt a cross-tenant job identifier and inspect the response and audit records. A secure ordinary request handler does not establish that the asynchronous path obeys the same boundary.

## Protect the importer from becoming a privileged network client

An application that imports documents from URLs receives more than a filename. It receives a requested network destination. A public-looking hostname can resolve to a prohibited address, and an allowed destination can redirect somewhere else. Validate the resolved connection and each redirect under a narrow destination policy, with deployment egress controls as another boundary.

Prefer integrations with a defined provider and resource identifier over arbitrary URL fetching. The latter requires handling address families, DNS changes, redirects, credentials and response limits correctly. The [OWASP SSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) distinguishes allowlist approaches and network controls for these paths.

Limit the response as it arrives. A declared content length is an input, not proof that the body will stay within it. Compressed bodies need a decompressed-size bound, and converters need execution and memory limits. Avoid sending ambient cookies, bearer tokens or internal headers to a supplied destination.

Retain safe failure categories: destination denied, redirect denied, response too large, unsupported type or conversion timeout. They support diagnosis without logging secrets embedded in URLs. A failure should also release request slots, files and connections; otherwise a denied input can still consume availability.

## Make containment an executable operation

For a leaked integration credential, identify where it is used, which actions it authorizes, and how to rotate it without losing accepted work. Disable the compromised capability, replace the credential, inspect affected operation records and reconcile uncertain effects. A secret rotated in one deployment but left active in a worker or CI variable is an incomplete containment.

For session compromise, exercise revocation against active requests, new requests and long-lived connections. Decide whether sockets must be closed or reauthorized before sensitive messages. Cached membership and permission decisions need a revocation policy too; deleting a session record cannot invalidate authority copied into unrelated caches automatically.

Preserve audit evidence with a trusted actor identity, effective tenant, operation, outcome and correlation reference. Restrict who can alter it. An application log supplied entirely by the caller is not an authoritative record of a privileged action. During the drill, verify both that authority stops and that the accepted history remains reconstructible.

## Verify attack paths and recovery evidence

Build negative tests around the threat model: another tenant's ID, revoked membership, forged role input, unauthorized export, cross-site mutation, malicious rich content and forbidden outbound destinations. Check resulting state and data exposure, not merely an error status.

Test privileged paths separately and inspect audit records. Record actor, scope, action, outcome and relevant operation identity without storing credentials or full sensitive payloads. Preserve evidence needed to distinguish denied attempts from accepted effects.

Run recovery exercises for session compromise, leaked provider credentials and a failed dependency. Verify that revocation propagates and that accepted operations remain reconstructible. Detection without a usable containment path leaves the team dependent on manual guesswork.

A security architecture is credible when an engineer can trace a sensitive action from browser input to durable effect, explain each authority decision, and show tests that prevent or contain the plausible failures at those boundaries.
