
# 0.3.0 (Aug 28th 2026)

- Align consumer headers with Gatelin gateway's new contract:
  - Rename consumer id header from `x-consumer-id` to `x-consumer-user-id`
  - Rename consumer name header from `x-consumer-nickname` to `x-consumer-name`
  - Store consumer information as `res.locals.consumer` `{ userId, nickname }` (was `{ id, nickname }`)
- Lower nickname minimum length validation from 5 to 3 characters to match Gatelin's `nickname` column constraint (`min: 3, max: 30`)
- Split nickname validation error into `Missing consumer nickname` (header absent or empty) and `Invalid consumer nickname` (present but not 3-30 characters)
- update dependencies: 
    - @dwtechs/checkard: 3.6.1,
    - @dwtechs/winstan: 0.7.1

# 0.2.0 (Apr 08th 2026)


- Store consumer information as a single `res.locals.consumer` object `{ id, nickname }` instead of separate `consumerId` and `consumerName` properties
- Rename consumer name header from `x-consumer-name` to `x-consumer-nickname`
- Update @dwtechs/winstan dependency to version 0.7.0 for better performance in debug mode

# 0.1.0 (Oct 31th 2025)

- Initial release
