import { v } from "convex/values";
import { mutation } from "./_generated/server";


export const CreateUser = mutation({
    args: {
      name: v.string(),
      email: v.string(),
    },
    handler: async (ctx, args) => {
      // ✅ Check for existing user
      const existingUsers = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("email"), args.email))
        .collect(); // <-- .collect() returns an array
  
      // If user doesn't exist, insert
      if (existingUsers.length === 0) {
        const data = {
          name: args.name,
          email: args.email,
          password: "nah man u all r bad",
        };
  
        const result = await ctx.db.insert("users", data);
        console.log("Inserted user:", result);
        return result;
      }
  
      // Return existing user
      return existingUsers[0];
    }
  });
  