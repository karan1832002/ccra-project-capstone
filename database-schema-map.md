# Database Schema Map — CCRA Microservices

Generated via `information_schema.columns` introspection across all 10 PostgreSQL databases.

---

## Redundancies & Conflicts

The following overlapping domains were identified across microservice databases. Each entry lists the affected services, the conflicting tables, and the nature of the overlap.

### 1. User Identity (CRITICAL)

| Service | Table | Key Columns |
|---|---|---|
| `ccra-frontend-auth` | `user` | `id` (text), `name`, `email`, `email_verified`, `image`, `created_at`, `updated_at`, `role` |
| `ccra-user-service` | `users` | `id` (uuid), `email`, `password_hash`, `first_name`, `last_name`, `phone`, `province`, `role`, `email_verified`, `created_at`, `updated_at` |

**Conflict:** Two separate user tables with different primary key types (text vs uuid), different column sets, and different role defaults. The auth `user` table uses `name` as a single field while the user-service `users` table splits it into `first_name`/`last_name`. The user-service also stores `password_hash`, `phone`, and `province` which the auth service does not. No foreign key links exist between them.

### 2. Products & Orders (DUPLICATE)

| Service | Table | Key Columns |
|---|---|---|
| `ccra-frontend-auth` | `products` | `id` (uuid), `name`, `price` (numeric), `category`, `image`, `description`, `created_at` |
| `product-service-ccra` | `products` | `id` (uuid), `name`, `description`, `price_cents` (integer), `image`, `category`, `stock` (integer), `active` (boolean), `created_at` |

**Conflict:** Same table name with diverging schemas. Auth uses `price` (numeric, probably dollars); product-service uses `price_cents` (integer). Product-service adds `stock` and `active` fields that auth lacks.

| Service | Table | Key Columns |
|---|---|---|
| `ccra-frontend-auth` | `orders` | `id` (uuid), `user_id` (text), `total` (numeric), `status`, `created_at` |
| `product-service-ccra` | `orders` | `id` (uuid), `user_id` (text), `status`, `total_cents` (integer), `payment_id` (uuid), `created_at` |

**Conflict:** Divergent schemas. Auth uses `total` (numeric, probably dollars); product-service uses `total_cents` (integer). Product-service adds a `payment_id` foreign key.

| Service | Table | Key Columns |
|---|---|---|
| `ccra-frontend-auth` | `order_items` | `id` (uuid), `order_id`, `product_id`, `quantity`, `unit_price` (numeric) |
| `product-service-ccra` | `order_items` | `id` (uuid), `order_id`, `product_id`, `quantity`, `unit_price_cents` (integer) |

**Conflict:** Only difference is the price column name (`unit_price` vs `unit_price_cents`) and type (numeric vs integer).

### 3. Events (DUPLICATE)

| Service | Table | Key Columns |
|---|---|---|
| `ccra-frontend-auth` | `events` | `id` (uuid), `title`, `date` (text), `raw_date`, `raw_time`, `location`, `image`, `description`, `category`, `entries_open` (boolean), `created_at` |
| `ccra-even-service` | `events` | `id` (uuid), `rodeo_id` (uuid), `category`, `event_date` (date), `event_time` (time), `event_fee` (real) |

**Conflict:** Completely different event models. Auth `events` represents standalone rodeo events with flat text dates. Event-service `events` represents competition events that belong to a `rodeo` parent, with structured date/time types and an entry fee.

| Service | Table | Key Columns |
|---|---|---|
| `ccra-even-service` | `rodeos` | `id`, `rodeo_title`, `entries_open`, `entries_close`, `entry_fee`, `location`, `image`, `description`, `capacity`, `phone_in_entries`, `created_at` |

**Overlap:** The `rodeos` table in event-service has significant overlap with `events` in auth (title/rodeo_title, location, image, description, entries_open). These likely represent the same domain entity.

### 4. Notifications (DUPLICATE)

| Service | Table | Key Columns |
|---|---|---|
| `ccra-frontend-auth` | `notifications` | `id` (uuid), `user_id` (text), `channel`, `template`, `recipient`, `status`, `sent_at`, `created_at` |
| `ccra-notification-service` | `notifications` | `id` (uuid), `user_id` (text), `channel`, `template`, `recipient`, `status`, `sent_at`, `created_at` |

**Conflict:** Identical schema. These tables are exact duplicates across two separate databases. One should be designated as the canonical source and the other removed.

### 5. Cross-Service User References

Multiple services reference users via `user_id` columns with inconsistent types:
- `ccra-frontend-auth`: `user_id` is `text` type (matches auth `user.id`)
- `ccra-user-service`: `id` is `uuid` type
- `ccra-payment-service`: `user_id` is `uuid`
- `ccra-membership-service`: `user_id` is `uuid`
- `ccra-results-service`: `competitor_id` is `uuid`
- `ccra-even-service`: `user_id` in `event_registrations` is `uuid`
- `product-service-ccra`: `user_id` in `orders` is `text`

The `text` vs `uuid` mismatch between auth and every other service makes foreign key enforcement impossible across databases.

---

## Complete Schema by Service

### 1. product-service-ccra

**Tables:** `order_items`, `orders`, `products`

#### order_items
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `order_id` | uuid | NO | — |
| `product_id` | uuid | NO | — |
| `quantity` | integer | NO | — |
| `unit_price_cents` | integer | NO | — |

**Foreign Keys:**
- `order_id` → `orders.id`
- `product_id` → `products.id`

#### orders
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `user_id` | text | NO | — |
| `status` | text | NO | 'pending' |
| `total_cents` | integer | NO | — |
| `payment_id` | uuid | YES | — |
| `created_at` | timestamp | NO | now() |

#### products
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | NO | — |
| `description` | text | YES | — |
| `price_cents` | integer | NO | — |
| `image` | text | YES | — |
| `category` | text | YES | — |
| `stock` | integer | NO | 0 |
| `active` | boolean | NO | true |
| `created_at` | timestamp | NO | now() |

---

### 2. ccra-frontend-auth

**Tables:** `account`, `events`, `notifications`, `order_items`, `orders`, `products`, `session`, `sponsors`, `user`, `verification`

#### account
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | text | NO | — |
| `account_id` | text | NO | — |
| `provider_id` | text | NO | — |
| `user_id` | text | NO | — |
| `access_token` | text | YES | — |
| `refresh_token` | text | YES | — |
| `id_token` | text | YES | — |
| `access_token_expires_at` | timestamp | YES | — |
| `refresh_token_expires_at` | timestamp | YES | — |
| `scope` | text | YES | — |
| `password` | text | YES | — |
| `created_at` | timestamp | NO | now() |
| `updated_at` | timestamp | NO | — |

**FK:** `user_id` → `user.id`

#### events
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `title` | text | NO | — |
| `date` | text | NO | — |
| `raw_date` | text | YES | — |
| `raw_time` | text | YES | — |
| `location` | text | NO | — |
| `image` | text | YES | — |
| `description` | text | YES | — |
| `category` | text | YES | — |
| `entries_open` | boolean | YES | false |
| `created_at` | timestamp | YES | now() |

#### notifications
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `user_id` | text | NO | — |
| `channel` | text | NO | — |
| `template` | text | NO | — |
| `recipient` | text | NO | — |
| `status` | text | NO | 'queued' |
| `sent_at` | timestamp | YES | — |
| `created_at` | timestamp | NO | now() |

#### order_items
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `order_id` | uuid | NO | — |
| `product_id` | uuid | NO | — |
| `quantity` | integer | NO | 1 |
| `unit_price` | numeric | NO | — |

**FKs:** `order_id` → `orders.id`, `product_id` → `products.id`

#### orders
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `user_id` | text | YES | — |
| `total` | numeric | YES | — |
| `status` | text | YES | 'pending' |
| `created_at` | timestamp | YES | now() |

**FK:** `user_id` → `user.id`

#### products
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | NO | — |
| `price` | numeric | NO | — |
| `category` | text | YES | — |
| `image` | text | YES | — |
| `description` | text | YES | — |
| `created_at` | timestamp | YES | now() |

#### session
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | text | NO | — |
| `expires_at` | timestamp | NO | — |
| `token` | text | NO | — |
| `created_at` | timestamp | NO | now() |
| `updated_at` | timestamp | NO | — |
| `ip_address` | text | YES | — |
| `user_agent` | text | YES | — |
| `user_id` | text | NO | — |

**FK:** `user_id` → `user.id`

#### sponsors
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | NO | — |
| `logo` | text | YES | — |
| `website` | text | YES | — |
| `visible` | boolean | YES | true |
| `created_at` | timestamp | YES | now() |

#### user
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | text | NO | — |
| `name` | text | NO | — |
| `email` | text | NO | — |
| `email_verified` | boolean | NO | false |
| `image` | text | YES | — |
| `created_at` | timestamp | NO | now() |
| `updated_at` | timestamp | NO | now() |
| `role` | text | YES | 'member' |

#### verification
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | text | NO | — |
| `identifier` | text | NO | — |
| `value` | text | NO | — |
| `expires_at` | timestamp | NO | — |
| `created_at` | timestamp | NO | now() |
| `updated_at` | timestamp | NO | now() |

---

### 3. ccra-user-service

**Tables:** `users`

#### users
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `email` | text | NO | — |
| `password_hash` | text | NO | — |
| `first_name` | text | NO | — |
| `last_name` | text | NO | — |
| `phone` | text | YES | — |
| `province` | text | YES | — |
| `role` | text | NO | 'member' |
| `email_verified` | boolean | NO | false |
| `created_at` | timestamp | NO | now() |
| `updated_at` | timestamp | NO | now() |

---

### 4. ccra-admin-service

**Tables:** `announcements`

#### announcements
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `title` | text | NO | — |
| `body` | text | NO | — |
| `posted_by` | uuid | YES | — |
| `published` | boolean | NO | false |
| `created_at` | timestamp | NO | now() |

---

### 5. ccra-media-service

**Tables:** `media_files`

#### media_files
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `uploaded_by` | uuid | YES | — |
| `category` | text | NO | — |
| `file_name` | text | NO | — |
| `content_type` | text | NO | — |
| `size_bytes` | integer | NO | — |
| `blob_url` | text | NO | — |
| `related_event_id` | uuid | YES | — |
| `created_at` | timestamp | NO | now() |

---

### 6. ccra-ai-chat-service

**Tables:** `chat_messages`, `rulebook_chunks`

#### chat_messages
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `user_id` | uuid | YES | — |
| `role` | text | NO | — |
| `content` | text | NO | — |
| `created_at` | timestamp | NO | now() |

#### rulebook_chunks
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `section` | text | NO | — |
| `content` | text | NO | — |
| `embedding` | vector | YES | — |

---

### 7. ccra-notification-service

**Tables:** `notifications`

#### notifications
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `user_id` | text | NO | — |
| `channel` | text | NO | — |
| `template` | text | NO | — |
| `recipient` | text | NO | — |
| `status` | text | NO | 'queued' |
| `sent_at` | timestamp | YES | — |
| `created_at` | timestamp | NO | now() |

---

### 8. ccra-payment-service

**Tables:** `payments`

#### payments
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `user_id` | uuid | NO | — |
| `purpose` | text | NO | — |
| `reference_id` | uuid | YES | — |
| `amount_cents` | integer | NO | — |
| `currency` | text | NO | 'CAD' |
| `status` | text | NO | 'pending' |
| `provider` | text | NO | 'stripe' |
| `provider_ref` | text | YES | — |
| `created_at` | timestamp | NO | now() |

---

### 9. ccra-results-service

**Tables:** `results`

#### results
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `event_id` | uuid | NO | — |
| `competitor_id` | uuid | NO | — |
| `category` | text | NO | — |
| `score` | real | YES | — |
| `placement` | integer | YES | — |
| `points` | integer | YES | 0 |
| `recorded_at` | timestamp | NO | now() |
| `entry_id` | uuid | NO | — |
| `money` | real | YES | 0 |
| `ground` | real | YES | 0 |
| `rodeo_id` | uuid | NO | — |
| `rodeo_title` | text | NO | — |
| `rodeo_location` | text | NO | — |
| `rodeo_start` | date | NO | — |
| `rodeo_end` | date | NO | — |
| `event_date` | date | NO | — |
| `event_time` | time | NO | — |
| `competitor_name` | text | NO | — |

**Note:** Denormalized — stores `rodeo_*` and `competitor_name` inline rather than via joins.

---

### 10. ccra-even-service (event service)

**Tables:** `event_registrations`, `events`, `rodeo_dates`, `rodeo_draws`, `rodeos`

#### event_registrations
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `event_id` | uuid | NO | — |
| `user_id` | uuid | NO | — |
| `status` | text | NO | 'pending' |
| `registered_at` | timestamp | NO | now() |
| `competitor_name` | text | YES | — |

#### events
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `rodeo_id` | uuid | NO | — |
| `category` | text | NO | — |
| `event_date` | date | NO | — |
| `event_time` | time | NO | — |
| `event_fee` | real | NO | — |

**FK:** `rodeo_id` → `rodeos.id` (implied — not enforced by a DB-level foreign key)

#### rodeo_dates
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `rodeo_id` | uuid | NO | — |
| `date` | date | NO | — |
| `start_time` | time | YES | — |

#### rodeo_draws
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `rodeo_id` | uuid | NO | — |
| `draw_file` | text | YES | — |

#### rodeos
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `rodeo_title` | text | NO | — |
| `entries_open` | date | YES | — |
| `entries_close` | date | YES | — |
| `entry_fee` | real | YES | — |
| `location` | text | NO | — |
| `image` | text | YES | — |
| `description` | text | YES | — |
| `capacity` | integer | YES | — |
| `created_at` | timestamp | YES | now() |
| `phone_in_entries` | text | YES | — |

---

### 11. ccra-membership-service

**Tables:** `memberships`

#### memberships
| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() |
| `user_id` | uuid | NO | — |
| `membership_type` | text | NO | — |
| `status` | text | NO | 'pending' |
| `start_date` | date | NO | — |
| `expiry_date` | date | NO | — |
| `created_at` | timestamp | NO | now() |
| `updated_at` | timestamp | NO | now() |

---

## Summary of Findings

| # | Issue | Severity | Recommendation |
|---|---|---|---|
| 1 | `user` (auth) vs `users` (user-service) — dual identity stores | Critical | Designate one canonical user service; sync or migrate |
| 2 | `notifications` table exists identically in auth and notification-service | High | Remove one copy; route all notification traffic through `ccra-notification-service` |
| 3 | `products`, `orders`, `order_items` duplicated in auth and product-service with different price columns | High | Consolidate into `product-service-ccra`; standardize on `_cents` naming |
| 4 | `events` in auth vs `rodeos` + `events` in event-service — different domain models | High | Deprecate auth `events`; migrate to event-service model |
| 5 | Inconsistent `user_id` types: `text` in auth/product vs `uuid` in payment/membership/results/event | Medium | Standardize on `uuid` across all services |
| 6 | `results` table in results-service is denormalized (stores rodeo fields inline) | Low | Acceptable for read performance; document the trade-off |