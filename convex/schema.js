import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    subscriptionId: v.optional(v.string()),
  }),
  clips: defineTable({
    url: v.string(),
    createdAt: v.number(),
  }),
  
});
