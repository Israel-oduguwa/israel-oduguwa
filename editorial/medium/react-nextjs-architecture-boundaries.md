# Architecture boundaries in a large React and Next.js application

Separate domain policy, server data access and browser interaction so a growing frontend stays secure and changeable.

This article was written with AI assistance. Sources and example verification are linked where relevant.

Technical context: 2025-07-17. Published 2026-10-13; the context date describes the technical era examined.

A frontend becomes difficult to change when a billing component imports database types, decides who may refund an invoice, fetches its own data and manages an unrelated navigation modal. Splitting it into smaller components may reduce file length while leaving every dependency intact.

Useful architecture boundaries separate responsibilities that change for different reasons. In a React 19 and Next.js 15 application, the server-client boundary adds another responsibility: deciding which code and data may reach the browser.

I would organize a large application around product capabilities, explicit data contracts and a small routing layer. The example is a hypothetical billing area with invoice viewing and refund requests. The snippets illustrate module boundaries rather than providing a complete application.

## Let routes compose a capability rather than own its policy

Keep route files responsible for framework integration: reading route inputs, invoking a server query, composing the page and defining metadata or loading behavior. Domain rules should remain usable from an action, job or API endpoint without importing a page component.

A possible structure is:

```text
app/(workspace)/invoices/[id]/page.tsx
features/billing/server/invoice-query.ts
features/billing/server/refund-command.ts
features/billing/domain/refund-policy.ts
features/billing/contracts/invoice-view.ts
features/billing/ui/invoice-detail.tsx
features/billing/ui/refund-form.tsx
shared/ui/button.tsx
shared/server/identity.ts
```

Folders are only evidence of intention. Enforce dependency direction through import rules, review and tests. Domain policy should not import the database driver or React. Browser components should not import a server-only credential module. A shared UI primitive should not know which billing plan the product sells.

Avoid a universal `shared` directory that receives anything used twice. Two features can have similar code with different semantics. Extract a shared abstraction when its contract and owner are clear, not just when duplication is visually noticeable.

## Return a view contract instead of a database row

A database entity often contains fields the UI should never receive: internal notes, provider references, personal data or permission-sensitive details. Passing it through a Server Component as client props can expose those fields even when the component never displays them.

Create a server-owned data-access function that resolves identity, scopes the resource and returns an explicit view model. The UI receives the data it needs and an action availability description for presentation.

```typescript
export type InvoiceView = {
  id: string;
  number: string;
  currency: string;
  totalMinor: number;
  status: 'open' | 'paid' | 'void';
  refund: { allowed: boolean; reason?: string };
};
```

The `allowed` field improves the interface; it does not authorize the later command. Authority can change between rendering and submission. The refund command must resolve current identity and verify the specific action against current state.

Validate external data at boundaries where TypeScript cannot guarantee runtime shape. An API response, stored JSON or URL parameter can violate a compile-time type. Keep parsing and error interpretation close to the boundary rather than scattering casts through components.

Use stable domain representations for money and dates. A formatted currency string belongs in presentation; a transaction command should receive an explicit minor-unit amount and currency under the domain's rules. Avoid floating-point arithmetic for financial invariants.

## Treat the server-client boundary as a data boundary

Server Components can read data in a server environment and compose interactive Client Components. The [React Server Components reference](https://react.dev/reference/rsc/server-components) distinguishes this rendering model from the browser bundle. It also distinguishes Server Components from Server Functions; `use server` is not a declaration that an ordinary component is a Server Component.

Keep interactive boundaries as narrow as practical. A refund form needs browser state and event handlers. The invoice query and its credentials do not. Putting `use client` at a large page-level module can pull unnecessary dependencies into the client graph.

Use server-only guards for modules that must never be imported into a client bundle, and inspect emitted bundles for sensitive or unexpected dependencies. A folder named `server` is not enforcement by itself.

Data passed to the client must be considered disclosed. Hiding a field behind CSS or omitting it from JSX does not protect a serialized prop. The same applies to errors: a detailed server exception can reveal internal structure if forwarded directly.

Next.js's [security guidance for Server Components and Actions](https://nextjs.org/blog/security-nextjs-server-components-actions), published in 2023, discusses data-access layers and security boundaries. A framework can help constrain imports and invocation, but the application still owns resource-level authorization and data minimization.

## Give each kind of state an owner

Server state describes authoritative or cached remote data. Form state describes a local draft. URL state describes shareable navigation. Ephemeral UI state describes an open menu or selected tab. They have different lifetimes and consistency rules.

Do not copy the invoice query result into a global store merely to make it accessible. That creates a second cache requiring invalidation. A client cache library may be useful for frequent interactive refetching; server rendering may be sufficient for another route. Make the choice by the interaction model.

Represent shareable filters in the URL when users need links, back navigation or refresh persistence. Validate them on the server and use a canonical representation. An unbounded filter object can generate unnecessary cache identities and requests.

Keep drafts separate from refreshed server snapshots. A background refetch should not erase an unsaved user edit. Record the base revision and define what happens when the authoritative record changes during editing: preserve the draft, show a conflict, or merge fields under explicit rules.

The [React state-structure guidance](https://react.dev/learn/choosing-the-state-structure) recommends avoiding contradictory and redundant state. In a large application, that principle also applies across stores and caches, not just within one component.

## Make commands own mutation and invalidation

A refund command should validate input, resolve actor and tenant, check the financial invariant, admit the operation durably and return a typed outcome. A button component should not assemble this policy from several unrelated API calls.

Return outcomes the UI can act on: accepted operation, validation error, permission denied, version conflict or outcome unknown. A generic boolean forces the UI to invent recovery behavior. Keep internal exceptions in server diagnostics and map them to a safe contract.

Plan invalidation as part of the command. Which invoice view, account balance or list becomes stale? Which data may remain cached? A successful mutation followed by a stale page is a broken user experience even when the database write was correct.

Next.js caching behavior changed in version 15. The [release announcement](https://nextjs.org/blog/next-15) describes changed defaults for fetch requests, GET Route Handlers and page segments in the client router cache. Review the application's pinned version and explicit configuration rather than relying on a remembered default from another major release.

Authorization scope must be part of cache design. A cache shared across tenants or permission levels can bypass correct query logic by serving a previously authorized response to a different actor. Separate public reusable content from private resource views.

## Compose loading and failure at meaningful boundaries

A page with several independent panels should not necessarily wait for the slowest optional panel before showing its main task. Use loading and error boundaries where partial usefulness exists.

Do not create a boundary around every tiny component. Excessive fragmentation can produce layout shifts, repetitive loading indicators and confusing failure states. Reserve stable space and decide which data is necessary before the user can act.

Separate permission denial from dependency failure. “You cannot access this invoice” and “the billing service is unavailable” require different UI and telemetry. Avoid revealing whether a resource exists when policy requires a non-disclosing response.

Client-side retry should be bounded and action-aware. Refetching a read is different from resubmitting a refund. A mutation retry must retain its operation identity and retrieve an uncertain outcome rather than blindly initiating another effect.

## Test boundaries where bugs cross them

Pure domain tests should cover policy and calculations without rendering React. Server integration tests should verify scoped queries, transactional commands and safe response contracts. Component tests should exercise interaction, accessibility and state transitions.

End-to-end tests should cover a few meaningful workflows across those boundaries: denied refund, stale invoice revision, accepted refund with delayed confirmation, and a dependency failure followed by recovery. Testing every internal function through the browser makes failures slow and hard to diagnose.

Add import-boundary checks and inspect client bundle changes. A new dependency can accidentally move a heavy package into a commonly visited route. Measure route-level loading and interaction performance on representative devices, including less capable ones.

Use contract fixtures for API evolution. A field added by the server should not require every browser to refresh instantly. During deployment overlap, old clients and new servers may interact. Commands and responses need a compatibility policy.

## Make ownership visible to the next team

Each capability needs an owner for its contracts, tests, operational signals and dependency changes. A shared component or library without an owner tends to accumulate incompatible requests until it becomes harder to change than the duplication it replaced.

Document the decisions that constrain future work: why billing commands remain server-only, which view fields may reach the client, how cache identity includes scope, and how drafts handle concurrent edits. Keep those decisions near the relevant code and link them from review guidance.

The result should let an engineer change a refund form without rediscovering financial authorization, or change persistence without rewriting the page. That is the practical value of the boundaries: smaller reasoning scope with the product's obligations still intact.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/react-nextjs-architecture-boundaries).
