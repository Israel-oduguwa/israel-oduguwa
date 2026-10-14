# Reliable UI state for multi-step workflows

Prevent stale validation, lost drafts and duplicate submissions by modeling ownership, revisions and uncertain outcomes explicitly.

Written with AI assistance.

A user edits a form while remote validation is running. The old result returns after the edit and enables the Next button. Later, the final submission times out, so the user clicks again. The interface has two separate correctness problems: it accepted evidence for an obsolete draft and it treated an unknown server outcome as a failed operation.

Multi-step interfaces need a model of what is current, what is proven and what has been accepted remotely. A step index and several booleans are rarely enough once validation, autosave and submission overlap.

The hypothetical workflow uses React 18-compatible reducers. Its [executable example](https://github.com/Israel-oduguwa/israel-oduguwa/tree/main/examples/engineering-series) verifies draft-revision ownership; saving and submission require the separate server contracts developed below.

## Separate the draft from the accepted workflow

The browser owns a draft until a server command accepts it. The server owns the business workflow after acceptance. A local step such as “review” is a presentation state; a server status such as `payment_pending` is an authoritative business state.

Keep these representations separate. Navigating Back should not undo a completed payment. Editing a saved draft should not silently alter an already submitted application. The product must define which fields remain editable and which command creates an amendment.

Record a local draft revision and the server revision it was based on. Each user edit increments the local revision. Saving or submitting includes the relevant server revision so the backend can detect conflicting changes.

Use derived values for simple facts. If the current step is stored, whether it is the last step can be calculated. If a draft's validation state is valid for its revision, `canAdvance` can be derived. The [React state-structure guidance](https://react.dev/learn/choosing-the-state-structure) recommends avoiding contradictory and duplicated state; a workflow benefits from making those contradictions structurally difficult.

## Model pending work with identity and evidence

Validation needs more than `isLoading`. Store which request owns the result and which draft revision it evaluated.

```text
draft revision 4
  -> validation request V1 for revision 4
  -> user edit creates revision 5
  -> V1 completes
  -> reject V1 as evidence for revision 5
```

The transport may support cancellation, but cancellation is not the correctness guard. A response can arrive after an abort, a mock may ignore it, or another async stage may already have started. The reducer decides whether the result still owns the state it wants to change.

The tested example accepts a validation completion only when both token and revision match:

```javascript
case 'validation_finished':
  if (state.validation.status !== 'pending' ||
      event.token !== state.validation.token ||
      event.revision !== state.revision) {
    return state;
  }
  return {
    ...state,
    validation: {
      status: event.valid ? 'valid' : 'invalid',
      revision: event.revision,
    },
  };
```

An edit invalidates prior validation and increments the revision. The Next button is enabled only when validation is valid for the current revision. A request token should be unique for that controller's lifetime; reusing a field value as its identity can fail when the user edits A, then B, then A again.

Keep the reducer pure. Effects perform network work and dispatch results; they do not mutate the draft behind the reducer. React's [reducer-and-context guide](https://react.dev/learn/scaling-up-with-reducer-and-context) provides the composition pattern. Context can distribute state within a workflow, but it does not turn remote data into authoritative local state.

## Make validation scopes and dependencies explicit

Some validation is local and immediate: required fields, length and format. Other validation depends on server facts: an available appointment, a tenant-specific policy or a unique identifier. A locally valid draft can still be rejected at submission because those facts changed.

Associate validation with its inputs. If a shipping quote depends on address, items and delivery method, changing any of them invalidates the quote. A per-field error object alone does not capture that dependency.

Represent validation outcomes as pending, valid, invalid or unavailable where the distinction matters. A network failure is not evidence that the input is invalid. Give the user a retry path and preserve their draft.

Avoid forcing every edit through remote validation. Debounce or validate at a meaningful transition, bound requests and cancel obsolete work where possible. Keep the ownership check even when debouncing reduces overlap.

The server must revalidate the accepted command. Browser validation improves usability and reduces avoidable requests; it is not a security or consistency boundary.

## Treat autosave as concurrent persistence

Autosave can complete out of order. Save S1 captures revision 4, save S2 captures revision 5, and S2 reaches the server first. Without a version rule, S1 can overwrite the newer draft afterward.

Options include serializing saves, sending revision-aware conditional updates, or accepting patches with an explicit merge policy. Serializing requests simplifies one browser's behavior but does not handle another tab or device. The server needs a concurrency contract too.

Track what was saved. A “Saved” label should refer to a particular revision, not merely the completion of any request. If the user edits during saving, completion of the older save must not imply that the current draft is persisted.

A version conflict needs a user-facing recovery policy. Preserve the local draft, retrieve the current server state, and show the fields or decision that conflict. Blindly retrying with the new version can overwrite someone else's accepted edit.

Offline persistence has privacy implications. Decide which drafts may be stored on a device, how they expire and what happens on account or tenant switching. A local-storage key based only on a route can restore another account's draft on a shared browser.

## Represent submission uncertainty as a first-class state

The final command may commit while its HTTP response is lost. Setting `submission = failed` and enabling an identical fresh submission can duplicate a business operation.

Use a stable operation identity created for the logical submission. Persist it with the draft or accepted command according to the recovery design. Reuse it when retrying that submission, and compare input on the server so conflicting reuse is rejected.

```text
ready -> submitting
submitting -> accepted
submitting -> rejected with actionable errors
submitting -> outcome_unknown -> retrieve by operation identity
```

An unknown outcome is neither success nor definitive failure. Show a clear status and provide a bounded lookup or reconciliation path. Do not ask the user to guess whether to pay again.

Disable repeated interaction while a request is owned, but treat that as interface protection. A user can refresh, open another tab or issue a request directly. The server's durable admission and idempotency rules prevent duplicated effects across those paths.

When an accepted operation continues asynchronously, show its durable reference and current status. A spinner tied to one browser request should not be the only way to know whether the operation exists.

## Define navigation and resumption semantics

A step URL can be useful for refresh and back navigation, but it is not proof that preceding requirements are satisfied. Loading a later step should inspect the draft and server workflow before enabling its actions.

Persist the minimum needed to resume. Keep an explicit draft schema version and migrate or reject old representations safely. A newly required field must not disappear because an old local draft restored a shape the current code assumes is complete.

When leaving the page, distinguish unsaved edits from pending authoritative work. The interface can warn about losing a draft; it should not imply that navigation cancels an already accepted command. Cancellation needs its own server operation if the business supports it.

Account and tenant switching should dispose pending controllers and clear scoped local state. A late result from the previous tenant must not populate the new screen. Include scope in request identity and invalidate ownership when the workflow is unmounted or changed.

## Make accessibility part of the state model

Move focus deliberately when the user advances, returns or encounters validation errors. A visually highlighted field is insufficient for someone navigating with a keyboard or screen reader. Associate errors with fields and provide an error summary when several fields need attention.

Announce meaningful asynchronous status without announcing every keystroke. “Saving,” “Saved,” and “Save failed” should reflect the revision-aware persistence state. Keep status regions stable so updates are understandable.

Preserve user input after an error. Unexpectedly clearing a form can make recovery harder than the original failure. For sensitive fields whose retention is restricted, explain the required re-entry at the point where it matters.

Avoid making the step indicator the only navigation control. Buttons need clear labels, visible focus and enough space to operate on small screens. A complex state model is worthwhile only if the interface communicates its transitions clearly.

## A changed field can invalidate more than one step

Consider a booking draft with address, service, price quote and consent. The price is validated for address revision 4 and service revision 2. The user changes the address on an earlier step. Returning to the review screen should not display the old quote as current merely because that screen's own fields were untouched.

Represent the inputs used to obtain derived evidence. A quote can carry its address revision, service revision, expiry and provider reference. `canSubmit` checks those against the current draft and server policy. Store the evidence; derive whether it is usable. Keeping a separate `quoteIsValid` boolean invites disagreement after an edit or timer event.

![An edit invalidates validation evidence before the next request can own it](https://israel-oduguwa.vercel.app/images/articles/ui-validation.svg)

Expiry is a transition too. A quote valid when rendered may expire while the user reads the review. The UI should show the changed state and refresh deliberately; the server still validates the accepted command. Use a recorded timestamp and a server-defined expiry rule, rather than assuming the browser clock alone decides a financial fact.

## Resolve a save conflict without losing the local draft

Three representations are useful: the base snapshot the edit began from, the local draft, and the newly fetched server snapshot. For each field, compare local and remote changes against the base. If only one side changed, a merge may be straightforward. If both changed differently, preserve both values and ask for a decision appropriate to the field.

Arrays and domain operations need more care. Reordering two applicants is not always equivalent to replacing an entire array. Removing a dependent field may invalidate another edit. A generic shallow merge cannot determine whether an accepted appointment, role change or payment detail remains valid.

When a user resolves the conflict, create a new draft revision based on the reviewed server version. Invalidate evidence affected by the resolution and save under the concurrency contract. A “retry save” action that quietly adopts the new version but keeps every local value is an overwrite policy, not conflict resolution.

Keep the recovery usable on a small screen. Show changed fields with clear labels and retain a way to inspect the server value. Focus should move to the conflict summary, then to the field the user chooses to resolve. An error toast that disappears while the user is comparing values is not enough.

## Scope persistence to the account and schema

A locally stored draft needs an identity that includes account, tenant, workflow and draft schema version. Clearing the visible form on sign-out while keeping an unscoped storage record allows the next user of that browser to restore it. Review both in-memory state and persistent state during scope changes.

Versioned drafts need migration rules. Suppose version 1 stores a free-text service name and version 2 requires a service identifier. Restoring the old string into an empty identifier field is misleading. Resolve it against an allowed current choice or return the user to that step with their original input preserved for reference.

For sensitive workflows, decide whether local persistence is appropriate at all. If it is, bound its lifetime and record the deletion behavior. Browser storage is not a secure vault for arbitrary credentials or private documents. Upload references also need server-side ownership and expiry checks when a draft resumes.

## Recover a lost submission response by identity

After a timeout, retain the submission identity and the input fingerprint. Query the server's operation endpoint under current authorization. If the operation exists, show its actual accepted state. If it was definitively rejected, present the actionable errors. If no conclusive result is available, retain an unknown state and a bounded recovery action.

A fresh page load should use that same identity. Creating another identity during mount converts a transport retry into a new business operation. The server must also distinguish identical replay from conflicting reuse, because another tab or an interrupted browser can repeat the request without the UI's disabled button.

The user-facing message should describe what is known: “Your submission is being checked. Reference X.” Avoid a success message before acceptance or a failure message based only on a lost response. Good state architecture is visible in those details. It lets the user recover without having to infer the server's history from a spinner.

## Test event histories rather than screenshots alone

Test a late valid result after an invalidating edit, a late error after a newer success, and an A–B–A sequence. Test two saves completing out of order, a second tab updating the server revision, and a submission whose response is lost after commit.

Use controlled promises to choose completion order. Assert that obsolete events cause no state write or navigation. An end-state screenshot can miss an intermediate advance or a temporarily incorrect status.

The standalone test edits revision 1 while its validation is pending, creates revision 2, then delivers a valid result for revision 1. The reducer returns the unchanged current state and `canAdvance` remains false. That result verifies one ownership invariant; the full product still needs integration tests for save conflicts and durable submission recovery.

Add a small set of browser tests for keyboard navigation, focus after errors, refresh resumption and tenant switching. Keep most transition logic tests below the browser layer so failures identify the event history that broke.

A reliable workflow lets the user recover without reconstructing what the software knows. It preserves their draft, identifies which revision has been validated or saved, and gives accepted operations a durable life beyond the browser request.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/reliable-multi-step-ui-state).
