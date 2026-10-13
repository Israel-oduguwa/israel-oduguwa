# A role is not enough to authorize a request

Checking ownership, tenant scope and resource state at the point where an application changes data.

This article was edited with AI assistance.

A route that checks `user.role === "admin"` can still authorize the wrong action. An administrator may belong to a different organization. A student may own an enrollment but not be allowed to change its paid status. A caregiver may edit a profile but not another person's verification result.

The question is more specific than “does this person have a role?” It is “can this actor perform this action on this resource in its current state?” That question needs the relevant data and a clear enforcement point.

## Start with the resource

For an enrollment update, identify the enrollment, its organization, its owner and its current state. Load those values from trusted application state. A request body can propose a new value, but it should not establish the caller's organization or authority.

The query itself can enforce part of the boundary. Looking up an enrollment by both ID and organization scope is safer than loading it globally and relying on every later caller to remember a tenant check.

```text
Authenticated actor
    → application organization membership
    → enrollment within that organization
    → permission for the requested action
    → allowed state transition
    → write
```

This policy outline separates authentication from authorization: establish the actor, then check permission for the resource and action.

## Keep enforcement near the write

A hidden button is useful interface behavior, but it does not authorize an API call. The server must enforce the rule. A service called by a route, worker or administrative tool needs a consistent policy rather than depending on one frontend path.

For a sensitive transition, the relevant resource state may change between an initial read and a later write. Use a transaction or a conditional update where the database supports it, and make the expected prior state part of the write. Otherwise, two individually authorized requests can combine into an invalid result.

An example is canceling an enrollment while another process marks it complete. Both requests need to respect the actual current state. The UI's earlier snapshot is not sufficient evidence.

## Workers are actors too

Background jobs often escape a careful authorization design. A worker may receive a resource ID and operate with broad service credentials. If the job's tenant scope or requested action is missing, the worker can accidentally cross boundaries even though the initiating route was correct.

Persist enough context to re-establish the job's scope. Avoid storing an unrestricted instruction to act on an arbitrary ID. Define which actions the worker can perform and validate that the resource still belongs to the expected organization.

Permissions can change while a job waits in the queue. Decide whether the action uses the initiating user's continuing authority, a narrowly defined system policy, or a previously approved business transition. Make that choice visible in the design.

## Test the denied paths

A successful administrator request is only the easiest test. More informative cases include a valid ID from another tenant, a user removed from an organization, a permitted actor requesting an invalid transition, and a worker retry after the resource changed.

A denial should not leak sensitive resource details. An audit record should explain the attempted action and its outcome without copying tokens, credentials or private request bodies into logs.

The [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) is a useful primary reference for denying by default and validating permissions on every request. The implementation still depends on the application's resources and business rules.

## A boundary libraries cannot invent

A payment library can verify a Stripe signature or preserve an operation ID. It cannot decide which employee is allowed to refund an order. That rule belongs to the application, which knows the actor, organization, order and approval policy.

This is why SafeStripe's documentation leaves application authorization with the caller. A clear boundary is easier to review than a convenient abstraction that quietly assumes everyone reaching it is allowed to spend or refund money.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/authorization-architecture-beyond-roles).
