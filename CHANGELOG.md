
# 0.3.0 (Aug 28th 2026)

- Align consumer headers with Gatelin's new contract:
  - Rename consumer id header from `x-consumer-id` to `x-consumer-user-id`
  - Rename consumer name header from `x-consumer-nickname` to `x-consumer-name`
  - Store consumer information as `res.locals.consumer` `{ userId, nickname }` (was `{ id, nickname }`)
- Lower nickname minimum length validation from 5 to 3 characters to match Gatelin's `nickname` column constraint (`min: 3, max: 30`)
- Split nickname validation error into `Missing consumer nickname` (header absent or empty) and `Invalid consumer nickname` (present but not 3-30 characters)
- Add `getAcl` middleware to parse and validate the `x-acl-fields` and `x-acl-conditions` headers injected by Gatelin, storing the result in `res.locals.acl` (`{ fields, conditions }`). Only the header shape is validated (structure, size, allowed operators); services must still check field names/conditions against their own entity model.
- Add `stripUnallowedFields` middleware to apply `res.locals.acl.fields` (set by `getAcl`) as an allow-list to `req.body.rows` (keeping `id`), so services no longer need to reimplement this projection themselves.
- update dependencies: 
    - @dwtechs/checkard: 3.7.0,
    - @dwtechs/winstan: 0.7.1

# 0.2.0 (Apr 08th 2026)


- Store consumer information as a single `res.locals.consumer` object `{ id, nickname }` instead of separate `consumerId` and `consumerName` properties
- Rename consumer name header from `x-consumer-name` to `x-consumer-nickname`
- Update @dwtechs/winstan dependency to version 0.7.0 for better performance in debug mode

# 0.1.0 (Oct 31th 2025)

- Initial release
