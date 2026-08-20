import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { vi } from "vitest";

vi.mock("streamdown", () => ({
  Streamdown: ({ children }: { children: string }) => children,
}));

import { AIChatBox } from "@/components/AIChatBox";
import { startSpeechOutput, startVoiceRecognitionSession, stopSpeechOutput, stripMarkdownForSpeech } from "@/hooks/useBrowserVoice";
import { CHAT_ERROR_MESSAGE, SAFETY_NOTICE } from "./chatContent";

describe("BRIENNE chat states", () => {
  it("renders a disabled send control and loading indicator while an answer is in progress", () => {
    const markup = renderToStaticMarkup(
      <AIChatBox
        messages={[{ role: "user", content: "Explain this." }]}
        onSendMessage={() => undefined}
        isLoading
      />,
    );

    expect(markup).toContain("animate-spin");
    expect(markup).toContain("disabled");
  });

  it("keeps the user-visible error and safety language explicit", () => {
    expect(CHAT_ERROR_MESSAGE).toContain("could not complete");
    expect(SAFETY_NOTICE).toContain("Verify important");
  });

  it("prepares Markdown responses for browser speech output", () => {
    expect(stripMarkdownForSpeech("## Read [this](https://example.com) and `confirm`.")).toBe("Read this and confirm.");
    expect(stripMarkdownForSpeech("```ts\nconst hidden = true;\n```\nContinue.")).toBe("Code block omitted. Continue.");
  });

  it("starts voice recognition, returns a transcript, and exposes denied-microphone status", () => {
    const recognition = {
      lang: "",
      continuous: false,
      interimResults: false,
      onstart: null,
      onend: null,
      onerror: null,
      onresult: null,
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn(),
    } as Parameters<typeof startVoiceRecognitionSession>[0];
    const onTranscript = vi.fn();
    const onListeningChange = vi.fn();
    const onStatus = vi.fn();

    startVoiceRecognitionSession(recognition, "en-US", onTranscript, { onListeningChange, onStatus });
    recognition.onstart?.();
    recognition.onresult?.({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: "Voice draft" } }] });
    recognition.onerror?.({ error: "not-allowed" });

    expect(recognition.start).toHaveBeenCalledOnce();
    expect(onTranscript).toHaveBeenCalledWith("Voice draft");
    expect(onStatus).toHaveBeenCalledWith(expect.stringContaining("Microphone permission"));
  });

  it("limits ambient motion to browsers that do not request reduced motion", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(css).toContain(".brienne-orbit-one { animation:");
  });

  it("plays and stops a spoken response through browser speech synthesis", () => {
    const synth = { cancel: vi.fn(), speak: vi.fn() };
    const onSpeakingChange = vi.fn();
    const onStatus = vi.fn();
    class TestUtterance {
      lang = "";
      pitch = 1;
      rate = 1;
      onstart: ((event: SpeechSynthesisEvent) => void) | null = null;
      onend: ((event: SpeechSynthesisEvent) => void) | null = null;
      onerror: ((event: SpeechSynthesisErrorEvent) => void) | null = null;
      constructor(public text: string) {}
    }
    const utterance = startSpeechOutput(
      synth,
      "**Read this reply.**",
      "en-US",
      { onSpeakingChange, onStatus },
      TestUtterance as unknown as typeof SpeechSynthesisUtterance,
    );

    utterance?.onstart?.(new Event("start") as SpeechSynthesisEvent);
    utterance?.onend?.(new Event("end") as SpeechSynthesisEvent);
    stopSpeechOutput(synth, { onSpeakingChange, onStatus });

    expect(synth.speak).toHaveBeenCalledOnce();
    expect(synth.cancel).toHaveBeenCalledTimes(2);
    expect(onStatus).toHaveBeenCalledWith("BRIENNE is reading the latest reply.");
    expect(onStatus).toHaveBeenCalledWith("Spoken reply stopped.");
  });
});
