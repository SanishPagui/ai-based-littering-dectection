import { v } from "convex/values";
import { query, mutation } from "./_generated/server"; // Importing query and mutation

// CreateUser Mutation - Insert or verify user existence
export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // ✅ Check if user already exists
    const existingUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect(); // Returns an array of matched users

    if (existingUsers.length === 0) {
      // Insert new user
      const newUser = {
        name: args.name,
        email: args.email,
        password: "nah man u all r bad", // Placeholder password
      };

      const result = await ctx.db.insert("users", newUser);
      console.info("Inserted new user:", result);
      return result;
    }

    // Return existing user
    console.info("User already exists, returning existing user:", existingUsers[0]);
    return existingUsers[0];
  },
});

// GetUser Query - Retrieve user data by email
export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first(); // Returns the first match or null

    return user;
  },
});
