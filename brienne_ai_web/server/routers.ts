import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  addConversationMessage,
  createConversation,
  deleteConversationForUser,
  getConversationForUser,
  getMessagesForConversation,
  listConversationsForUser,
} from "./db";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

const needsCurrentInformation = (message: string) => /\b(latest|today|current|news|weather|price|stock|score|recent|this week|right now)\b/i.test(message);

const conversationIdSchema = z.string().uuid();

function titleFromMessage(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > 72 ? `${normalized.slice(0, 72).trimEnd()}…` : normalized;
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  ai: router({
    chat: publicProcedure
      .input(z.object({ messages: z.array(chatMessageSchema).min(1).max(12), conversationId: conversationIdSchema.optional() }))
      .mutation(async ({ input, ctx }) => {
        const latestMessage = input.messages.at(-1);
        if (!latestMessage || latestMessage.role !== "user") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Send a user question to continue the conversation." });
        }

        let persistedConversationId: string | null = null;
        try {
          if (ctx.user) {
            persistedConversationId = input.conversationId ?? crypto.randomUUID();
            const existingConversation = input.conversationId
              ? await getConversationForUser(input.conversationId, ctx.user.id)
              : undefined;

            if (input.conversationId && !existingConversation) {
              throw new TRPCError({ code: "NOT_FOUND", message: "This conversation is unavailable." });
            }

            if (!existingConversation) {
              await createConversation({
                id: persistedConversationId,
                userId: ctx.user.id,
                title: titleFromMessage(latestMessage.content),
              });
            }

            await addConversationMessage({
              id: crypto.randomUUID(),
              conversationId: persistedConversationId,
              role: "user",
              content: latestMessage.content,
            });
          }

          const completion = await invokeLLM({
            model: "gpt-5-mini",
            maxTokens: 900,
            messages: [
              {
                role: "system",
                content: "You are BRIENNE, a precise, warm, and safety-first personal AI assistant. Answer the user's question in concise Markdown. You may explain, draft, plan, and reason, but never claim to control the user's computer, access their private data, take external actions, or browse live websites. If a question relies on current, changing, or high-stakes information, say briefly that it should be confirmed with a current trusted source. Do not invent sources, citations, or recent events. Encourage independent professional help for medical, legal, financial, or safety-critical decisions.",
              },
              ...input.messages,
            ],
          });

          const message = completion.choices[0]?.message?.content;
          if (!message || typeof message !== "string") {
            throw new Error("The AI service returned no text.");
          }

          if (persistedConversationId) {
            await addConversationMessage({
              id: crypto.randomUUID(),
              conversationId: persistedConversationId,
              role: "assistant",
              content: message,
            });
          }

          return {
            message,
            conversationId: persistedConversationId,
            webSearchUrl: needsCurrentInformation(latestMessage.content)
              ? `https://www.google.com/search?q=${encodeURIComponent(latestMessage.content)}`
              : null,
          };
        } catch (error) {
          console.error("[ai.chat] Unable to complete chat", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "BRIENNE could not respond right now. Please try again shortly." });
        }
      }),
  }),
  history: router({
    list: protectedProcedure.query(({ ctx }) => listConversationsForUser(ctx.user.id)),
    get: protectedProcedure.input(z.object({ conversationId: conversationIdSchema })).query(async ({ ctx, input }) => {
      const record = await getMessagesForConversation(input.conversationId, ctx.user.id);
      if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "This conversation is unavailable." });
      return record;
    }),
    delete: protectedProcedure.input(z.object({ conversationId: conversationIdSchema })).mutation(async ({ ctx, input }) => {
      const deleted = await deleteConversationForUser(input.conversationId, ctx.user.id);
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "This conversation is unavailable." });
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
