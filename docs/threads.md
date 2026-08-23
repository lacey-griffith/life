# Life OS — Threads

## Purpose

Threads helps a person notice where their life is actually going: interests, hobbies, environments, relationships, rituals, and sources of nourishment that may be emerging, steady, or becoming absent.

It should answer questions like:

- What keeps showing up in my life?
- What seems to bring me joy, ease, energy, connection, or aliveness?
- Is something becoming important to me before I have consciously named it?
- What used to nourish me that has gone quiet?
- Is there something I want to make more room for?

Threads is not a productivity dashboard or time tracker.

## Example

Entry:

> I enjoyed coffee in the garden this morning.

One mention should not create a Gardening thread.

Across time, semantically related entries might include:

- coffee outside
- repotted basil
- spent an hour messing with my plants
- watched birds from the porch
- worked in the garden before everyone woke up

The system may eventually suggest overlapping hypotheses such as `Garden`, `Nature`, or `Slow mornings`.

It should ask the person whether the interpretation is meaningful before promoting it into a durable Thread.

## Thread states

### Emerging

Appearing more often recently and potentially becoming meaningful.

### Steady

Consistently present over time and confirmed by the person as meaningful.

### Quiet

Previously meaningful but appearing less often recently.

`Quiet` must never imply neglect, failure, or that the activity needs to return.

## Signals

Threads may eventually consider:

- semantic similarity between entries
- frequency over time
- recency
- language associated with joy, ease, energy, curiosity, connection, or aliveness
- language associated with depletion or obligation
- explicit user confirmation
- explicit user rejection/correction
- stars associated with a topic
- direct answers to reflection questions

Frequency alone must never be treated as importance.

Time spent should only be represented when the user actually supplies duration or an external integration provides reliable duration data. Mentions are not hours.

## Confidence and authority

All inferred Threads begin as hypotheses.

Example:

> Garden has been showing up more often lately. Does it feel like it is becoming important to you?

Possible response:

- Yes
- Maybe
- Not really

The user remains the authority. They can rename, merge, split, reject, mute, or delete a Thread.

Corrections should influence future interpretation.

## Invitations, not prescriptions

Good:

> Photography does not show up often, but moments involving it tend to sound especially alive. Do you wish there were more room for it?

Good:

> Quiet mornings keep appearing alongside words like peaceful, easy, and content. Worth protecting?

Avoid:

> You should spend more time gardening.

Avoid:

> You have neglected photography for 23 days.

Avoid:

> Gardening increases your happiness by 34%.

## Relationship to the Night Sky

The Night Sky contains moments the person explicitly chose as meaningful.

Threads may analyze all saved reflections (with permission), including non-starred entries. A Thread is therefore not a constellation and should not automatically create or alter one.

A Thread may eventually help a person recognize why certain stars seem related, but the person's interpretation remains authoritative.

## Privacy architecture

The journal should remain local-first.

Semantic analysis must be optional and transparent. Before entries leave the device for remote analysis, Life OS must explain what will be analyzed and obtain explicit permission.

Do not expose AI provider credentials in the browser.

Likely architecture:

1. Local journal and storage layer.
2. Optional secure server-side semantic analysis endpoint.
3. Structured observations returned to the client.
4. User confirmation before inferred observations become durable Threads.

Local/on-device semantic analysis should be preferred if it becomes practical and sufficiently capable.

## Proposed data model

```js
thread = {
  id,
  name,
  status: 'emerging' | 'steady' | 'quiet',
  source: 'suggested' | 'user-created',
  confirmed: false,
  createdAt,
  updatedAt,
  entryIds: [],
  signals: {
    recentMentions: 0,
    priorMentions: 0,
    nourishing: 0,
    depleting: 0
  },
  userFeedback: {
    meaningful: null,
    wantsMoreRoom: null,
    muted: false
  }
}
```

Exact sentiment numbers should remain internal signals rather than being presented as pseudo-scientific scores.

## UI direction

Do not add a fourth primary navigation item yet.

Threads can initially surface as a quiet section within Archive or as occasional cards when a sufficiently strong pattern has earned attention.

Example card:

**Garden**

*Showing up more often lately*

> Does this feel like it is becoming important to you?

`Yes` · `Maybe` · `Not really`

## MVP prerequisites

Before semantic Threads ships:

- reliable backup + restore
- stable schema migrations
- clear privacy/consent model
- edit/delete support for source entries
- a way to correct or reject inferred Threads

## North Star

Threads should help someone notice their life without turning their life into analytics.
