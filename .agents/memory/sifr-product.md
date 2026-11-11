---
name: Sifr product boundaries
description: User-specified identity, language roadmap, and demo commerce constraints.
---
Sifr is a Kuwait-focused Islamic bookshop for students first, then general readers and institutions. The user requested Arabic by default with RTL, English switching, and translation structure extensible to Turkish and Russian.

**Why:** These are explicit product audience and language requirements, not inferred from implementation.

**How to apply:** Preserve bilingual behavior and prioritize student discovery when extending the store.

Payments must remain explicitly simulated until real gateway integration is separately requested; never collect real card details. The assistant recommends from the catalogue, answers order/shipping questions in the interface language, and refers religious rulings to qualified scholars.

**Why:** The user explicitly requested a demo checkout and an assistant that does not issue fatwas.

**How to apply:** Do not silently enable live charges, fulfillment, or religious advisory behavior.
