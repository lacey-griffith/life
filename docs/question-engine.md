# Life OS — Question Engine v0.1

## Purpose

The Question Engine should not ask, “Which prompt is next?” It should approximate a gentler question:

> What kind of invitation is appropriate for how this person is arriving today?

It must never claim certainty about a person's emotional state or diagnose the reason for a difficult day.

## Arrival states

### Open
Present, curious, okay. Favor exploration, presence, identity, wonder, and connection.

### Heavy
Tired, overwhelmed, anxious, or carrying something. Reduce cognitive load. Favor comfort, ease, grounding, and optional reflection. Avoid unsolicited deep excavation.

### Distant
Numb, unsure, disconnected. Do not demand explanations. Favor sensory noticing, simple choices, and gentle arrival.

### Hopeful
Something feels possible. Favor curiosity, dreams, possibility, growth, and meaningful action without converting hope into productivity pressure.

## Depth

### Level 1 — Gentle
Low-friction noticing. Safe for most ordinary check-ins.

### Level 2 — Reflective
Invites interpretation or identity-level noticing without requiring major vulnerability.

### Level 3 — Deep
Explores recurring tensions, unmet needs, values, or difficult truths. Requires contextual fit.

### Level 4+ — Transformational
Rare. Requires earned trust, sufficient context, user affinity for deeper reflection, and strong safeguards against overreach.

## Question metadata

Each curated question should eventually include:

- `id`
- `pillar`
- `depth`
- `arrival_states`
- `intent`
- `timing`
- `cooldown`
- `requires_trust`
- `follow_up_paths`
- `remembrance_safe`
- `user_affinity`
- `avoid_when`

## Adaptation

Questions are curated first and adaptive second.

Adaptation can use:

- explicit feedback: helped / more like this / not right now
- recurring themes in user-created moments
- question response depth and frequency
- timing and cooldowns
- explicitly saved preferences
- patterns the user has confirmed as meaningful

The engine should not infer that a long answer means distress or that a short answer means disengagement.

## Remembrance and grief

Grief receives first-class treatment for both humans and animals.

The system may offer comfort questions, storytelling, remembrance, or a no-words ritual such as lighting a lantern.

It should never frame grief as something to optimize away.

Example:

> Is there someone — human or animal — you are missing today? Would remembering them feel comforting, or would you rather simply let their name be here with you?

## Voice

The system may learn a user's preferred emotional register, including humor and profanity, but tone adaptation must remain context-sensitive. Irreverence that feels warm during ordinary frustration may be inappropriate during grief or acute distress.

## Pattern language

Prefer:

> I've noticed mornings outside appear often in moments you chose to keep. Does that feel meaningful to you?

Avoid:

> You need to spend more time outside.

Prefer:

> This constellation has been quiet lately. Would you like to visit it?

Avoid:

> You haven't done photography in 74 days.

## Non-goals

The Question Engine is not a diagnostic system, therapist replacement, authority on the user's life, or mechanism for maximizing engagement.
