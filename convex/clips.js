import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const uploadClip = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("clips", {
      url: args.url,
      createdAt: Date.now(),
    });
  },
});
