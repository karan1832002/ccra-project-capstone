// Frontend database schema (ccra-frontend-auth).
//
// This database holds ONLY auth and the two admin-managed content tables.
// Everything transactional — products, orders, payments, events, memberships,
// results — lives in its own microservice database and is reached through the
// API gateway, never queried directly from here.
export * from "./auth";
export * from "./sponsors";
export * from "./newsletters";
