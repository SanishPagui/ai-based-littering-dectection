import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    subscriptionId: v.optional(v.string()),
  }),
  litterVideos: defineTable({
    video: v.string(),
    timestamp: v.number(),
  }),
  
});
