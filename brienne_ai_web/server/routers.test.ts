import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

vi.mock("./db", () => ({
  addConversationMessage: vi.fn(),
  createConversation: vi.fn(),
  deleteConversationForUser: vi.fn(),
  getConversationForUser: vi.fn(),
  getMessagesForConversation: vi.fn(),
  listConversationsForUser: vi.fn(),
}));

import {
  addConversationMessage,
  createConversation,
  deleteConversationForUser,
  getConversationForUser,
  getMessagesForConversation,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const mockInvokeLLM = vi.mocked(invokeLLM);
const mockAddConversationMessage = vi.mocked(addConversationMessage);
const mockCreateConversation = vi.mocked(createConversation);
const mockDeleteConversationForUser = vi.mocked(deleteConversationForUser);
const mockGetConversationForUser = vi.mocked(getConversationForUser);
const mockGetMessagesForConversation = vi.mocked(getMessagesForConversation);

const signedInContext = {
  user: {
    id: 42,
    openId: "brienne-test-user",
    name: "BRIENNE Tester",
    email: "tester@example.com",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
} as TrpcContext;

describe("ai.chat", () => {
  beforeEach(() => {
    mockInvokeLLM.mockReset();
    mockAddConversationMessage.mockReset();
    mockCreateConversation.mockReset();
    mockDeleteConversationForUser.mockReset();
    mockGetConversationForUser.mockReset();
    mockGetMessagesForConversation.mockReset();
  });

  it("returns the assistant response and a current-information handoff when needed", async () => {
    mockInvokeLLM.mockResolvedValue({
      choices: [{ message: { content: "Weather changes quickly, so verify it with a current source." } }],
    } as never);

    const caller = appRouter.createCaller({} as TrpcContext);
    const result = await caller.ai.chat({
      messages: [{ role: "user", content: "What is the weather today in Nairobi?" }],
    });

    expect(result.message).toContain("verify");
    expect(result.webSearchUrl).toContain("google.com/search");
    expect(mockInvokeLLM).toHaveBeenCalledWith(expect.objectContaining({ model: "gpt-5-mini" }));
  });

  it("rejects empty chat messages", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    await expect(caller.ai.chat({ messages: [{ role: "user", content: "" }] })).rejects.toThrow();
  });

  it("persists signed-in prompts and replies inside one user-owned conversation", async () => {
    mockInvokeLLM.mockResolvedValue({ choices: [{ message: { content: "Stored reply." } }] } as never);
    mockGetConversationForUser.mockResolvedValue(undefined);

    const caller = appRouter.createCaller(signedInContext);
    const result = await caller.ai.chat({ messages: [{ role: "user", content: "Remember this project note." }] });

    expect(result.conversationId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(mockCreateConversation).toHaveBeenCalledWith(expect.objectContaining({ userId: 42, title: "Remember this project note." }));
    expect(mockAddConversationMessage).toHaveBeenCalledTimes(2);
    expect(mockAddConversationMessage).toHaveBeenNthCalledWith(1, expect.objectContaining({ role: "user", content: "Remember this project note." }));
    expect(mockAddConversationMessage).toHaveBeenNthCalledWith(2, expect.objectContaining({ role: "assistant", content: "Stored reply." }));
  });
});

describe("history authorization", () => {
  it("requires a signed-in user before exposing stored conversation records", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    await expect(caller.history.list()).rejects.toThrow("Please login");
  });

  it("loads and deletes only a requested signed-in user's conversation", async () => {
    const conversationId = "682ecf18-7e53-4134-bafc-eef1812a5000";
    mockGetMessagesForConversation.mockResolvedValue({
      conversation: { id: conversationId, userId: 42, title: "Saved note" },
      messages: [{ id: "b9e3a672-11ca-4410-805b-38ca386f99ef", conversationId, role: "user", content: "Saved text" }],
    } as never);
    mockDeleteConversationForUser.mockResolvedValue(true);

    const caller = appRouter.createCaller(signedInContext);
    const loaded = await caller.history.get({ conversationId });
    const deleted = await caller.history.delete({ conversationId });

    expect(loaded.messages[0]?.content).toBe("Saved text");
    expect(mockGetMessagesForConversation).toHaveBeenCalledWith(conversationId, 42);
    expect(deleted).toEqual({ success: true });
    expect(mockDeleteConversationForUser).toHaveBeenCalledWith(conversationId, 42);
  });
});
