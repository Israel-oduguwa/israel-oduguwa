# Keeping frontend systems maintainable as teams and features grow

Control dependency growth, shared-component variation and migration cost without turning every product change into framework work.

A shared table begins with sorting and pagination. Six teams add bulk actions, inline editing, grouped rows, custom filters and several permission models. The table now has dozens of flags, and changing one behavior requires checking unrelated products.

The problem is not that the component has become large. Its contract now contains several capabilities with different owners and incompatible assumptions. Maintainability depends on controlling those contracts and the cost of changing them.

The difficult cases emerge after many contributors and several product generations. Shared APIs, dependency direction and migration ownership determine whether an ordinary product change stays local or spreads through the codebase.

## Define maintainability as the cost of a real change

Choose representative changes: add a field to a workflow, replace a data endpoint, update a shared control, or migrate an authentication integration. Track the scope, review effort, regression risk and time needed to deploy them.

File count, component count and test coverage are incomplete proxies. A codebase can have many small files that all require coordinated edits. A large feature module can be maintainable if its public contract is narrow and its behavior is well tested.

Look for recurring coordination points. Which shared modules force many teams to review routine changes? Which dependencies cause route-wide bundle growth? Which product variants require conditional logic throughout the tree?

Use that evidence to prioritize architecture work. A speculative abstraction for a future product should not displace a measured problem in a widely used form or navigation system.

## Keep shared primitives below product capabilities

A button can own focus behavior, disabled state, loading presentation and visual variants. It should not decide whether a customer can cancel a subscription. A billing capability composes primitives and owns that policy's presentation.

Separate design primitives, interaction patterns and domain components. A dialog's focus management can be shared. A refund-confirmation dialog's data and command semantics belong to billing. Extracting both into a universal “action dialog” can create a contract too broad to reason about.

Use composition when behavior varies meaningfully. A table primitive can provide accessible structure and selection hooks while a feature owns its bulk actions. Avoid a boolean for every product difference.

```typescript
type Selection =
  | { mode: 'none' }
  | {
      mode: 'multiple';
      selectedIds: ReadonlySet<string>;
      onSelectionChange: (ids: ReadonlySet<string>) => void;
    };
```

This illustrative type makes a required callback explicit when selection is enabled. It is preferable to optional `selectable`, `selectedIds` and `onChange` props that can form contradictory combinations. The feature still owns what selecting rows means for its business action.

Do not create a shared package merely because two implementations look alike. Similar visual structure can conceal different lifecycle and accessibility requirements. Keep duplication until a stable shared contract is clear, then extract with ownership and tests.

## Enforce dependency direction with tools and review

Define which layers may import which others. Product features can depend on shared primitives and explicit contracts. Shared primitives should not import product features. Server-only access modules should not enter browser dependency graphs.

Use lint or build checks to catch forbidden imports. Review can then focus on semantic coupling that static tools cannot recognize. A legal import can still expose too much domain knowledge through a broad data type.

Avoid circular barrels that re-export every module. They obscure the dependency graph, can pull unexpected code into bundles and make initialization behavior harder to diagnose. Public entry points should expose an intentional API.

Monorepos and package boundaries help only if they express useful ownership. Twenty packages published in lockstep can have the same coordination burden as one repository plus additional versioning work. Choose boundaries that permit coherent changes and controlled compatibility.

Keep dependency upgrades routine. A year of deferred framework updates can turn a small compatibility change into a large migration. Pin versions, review release behavior and maintain a clear path for security and bug-fix updates.

## Assign state and contracts to an owner

Server data, form drafts, URL filters and temporary UI state need different lifetimes. A global store that receives all of them becomes a hidden dependency for unrelated features.

Keep drafts local to the workflow that owns them, with an explicit persistence contract when resumption is required. Use the URL for state users need to share or revisit. Use a remote-data cache when its invalidation and scope are understood.

The [React state-structure guidance](https://react.dev/learn/choosing-the-state-structure) describes avoiding redundant and contradictory state. Across a growing product, that means avoiding duplicate authoritative copies in several stores and components.

Define API response contracts rather than importing database entities into every view. Runtime validation belongs at external boundaries. A stable view contract lets the backend evolve storage without forcing presentation changes everywhere.

Error contracts deserve equal attention. Features should distinguish input errors, permission denial, conflict and dependency failure. A shared toast helper should present an outcome, not infer business semantics from an arbitrary exception string.

## Use a testing portfolio that matches ownership

Test shared primitives for their reusable obligations: keyboard interaction, focus, disabled behavior and accessible naming. Test domain policies independently of the browser. Test feature components through user-visible interactions and controlled async schedules.

Keep a small number of end-to-end tests for high-value workflows. They verify that contracts connect correctly across routes, server commands and persistence. A broad end-to-end suite that tests every internal permutation can become slow and difficult to diagnose.

Avoid tests that mirror implementation structure. A test asserting that a particular hook was called can pass while the user sees stale data. Test the observable contract: a late request must not overwrite the current selection, or a denied action must not mutate state.

Visual regression testing can catch unintended layout changes, but it needs stable fixtures and meaningful review. Do not automatically approve a large snapshot update simply because a shared component changed. Inspect representative states, including long content, errors and small screens.

React's [memo reference](https://react.dev/reference/react/memo) describes memoization as a performance optimization. Tests and correctness should not depend on a component avoiding a render; rendering must remain pure and safe when it happens again.

## Treat accessibility as a shared contract

Shared controls can reduce repeated accessibility work if their contract is clear. They can also distribute a defect to every product. Assign ownership for keyboard behavior, focus management, semantics and announcements.

Test composed workflows, not just isolated controls. A dialog can be accessible alone while a nested flow traps focus incorrectly. A form field can have a label while its validation message is never announced.

Design for content variation: long labels, localization, zoom and reduced motion. A component API that assumes every label is two short English words will become a maintenance problem as the product grows.

Make the default path accessible. Requiring every consumer to remember several accessibility props recreates the same convention problem as an authorization filter. Allow customization without making the safe behavior optional by accident.

## Budget performance by route and interaction

Track client bundle size, loading behavior and interaction responsiveness for important route classes. A shared package can increase the cost of every route even when only one feature needs its expensive dependency.

Keep heavy optional code near the feature that uses it and load it according to the interaction. Inspect what actually ships; a folder boundary does not guarantee bundle separation. Measure on representative devices and network conditions.

Set budgets with evidence and owners. An arbitrary kilobyte limit can block a valuable feature while missing a costly render loop. Connect the budget to user experience and the workload, then record justified exceptions and follow-up work.

Profile before adding memoization everywhere. An unstable prop identity can defeat memoization, while an unnecessary remote waterfall may dominate the user's wait. Choose the intervention that changes the measured bottleneck.

## Make shared-API migrations incremental

When a shared component contract changes, provide a compatibility interval or a small adapter. Document the new semantics, identify consumers and migrate them in bounded groups. A mechanical codemod can help with syntax; it cannot decide whether the new behavior is correct for each feature.

Use deprecation warnings and usage inventory where practical. Give the old API a removal owner and condition. An indefinite compatibility layer becomes another permanent contract to maintain.

Test old and new consumers during the transition. Deployment overlap matters when server contracts or independently released clients change. Keep schema additions compatible and avoid removing fields before supported consumers have migrated.

Record important decisions near the relevant package: why an API uses composition, which states it supports, and which product logic remains outside. Future contributors need the reason, not merely a rule forbidding another prop.

## Split a shared component when its obligations diverge

The table from the opening example has two difficult consumers. Finance needs stable selection across pages for an audited bulk action. Support needs a live list where incoming records can change the visible order. One universal selection rule cannot satisfy both without defining what happens when a selected record disappears, becomes unauthorized or changes revision.

Keep shared rendering and keyboard behavior where the contract remains common. Move selection semantics into each feature. Finance can submit explicit resource identities with expected revisions and receive per-item outcomes. Support can use a temporary visible selection for a local interaction. Making these different APIs visible is preferable to adding `financeMode`, `liveMode` and another dozen interactions to a primitive.

Review a proposed shared prop by asking who owns its invariant. `onSelectionChange` is an interaction contract. `canRefundSelectedRows` belongs to billing policy. A generic callback can still carry too much domain authority if consumers assume the shared component has performed authorization. Name and test the boundary so that presentation cannot silently become the command gate.

An extraction has a maintenance budget. Its owner needs representative consumers, accessible states and a migration plan. If every new product change requires modifying the shared package, the abstraction may be centralizing variation instead of reducing it. Keep the contract small enough that a reviewer can describe its supported states without knowing every product in the repository.

## Turn a performance budget into a review decision

Suppose a new shared date control adds a large parser to every route. Its source file is small and its component test is fast, but the browser pays for the dependency even on screens that never open it. Inspect emitted route bundles and the interaction that loads the control. A dependency graph in the source tree does not establish when the browser downloads or executes that code.

A useful budget identifies the route class, representative device, measurement method and owner. If a change crosses it, the review asks whether loading can be deferred, whether a smaller representation is possible, or whether the product benefit justifies the cost. Record that exception rather than relaxing the budget for every route.

Keep rendering correctness separate from performance tuning. React's [external-store API](https://react.dev/reference/react/useSyncExternalStore) requires immutable, stable snapshots until the store changes. A store returning a new object on every read can create unnecessary work; a store mutating the same object can conceal an update. Adding memoization around consumers does not repair the snapshot contract.

Measure real interactions after changes to a shared layer: opening a large menu, typing in a form while background data refreshes, switching tenants and rendering long content. A fast initial screenshot says little about those costs. Retain profiles that identify where time went, with the tested data size and device, so the next optimization can challenge the same hypothesis.

## Make a shared migration observable

For a replacement field API, inventory consumers and their behavioral requirements before writing a codemod. One consumer may rely on immediate validation, another on validation after blur, and another on a remote result tied to a draft revision. A syntax-only migration can preserve compilation while changing the product.

Provide a narrow adapter for the old API when it buys a safe compatibility interval. Mark it with an owner and removal condition. Track usage through static checks or build reports, then migrate representative consumers before the easiest ones. A difficult early consumer reveals missing semantics while the replacement is still affordable to change.

Retain accessibility and interaction tests around the adapter. If focus, labels or error announcements differ between old and new consumers, examine the difference rather than approving a snapshot update wholesale. The change should leave a simpler public contract after retirement, not two permanently supported ways of expressing the same field.

## Keep architecture work tied to product change

Review the dependency graph and shared APIs periodically using actual change history. Remove abstractions that no longer earn their complexity. Split a shared component when its consumers have diverged, even if that increases some duplication.

Assign ownership for shared code and provide a way for feature teams to request changes. A central team that becomes a bottleneck can encourage local forks; a shared package that accepts every request can become incoherent. A clear contract makes those decisions easier.

Use the next product change to check the architecture: identify its owning contract, its protecting tests and the teams required to release it. If an ordinary field change still touches unrelated features, the dependency problem remains.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/maintainable-frontend-systems).
