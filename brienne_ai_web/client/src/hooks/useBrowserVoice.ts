import { useCallback, useEffect, useRef, useState } from "react";

type RecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{ isFinal?: boolean; 0?: { transcript?: string } }>;
};

type RecognitionErrorLike = { error?: string };

type BrowserRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: RecognitionErrorLike) => void) | null;
  onresult: ((event: RecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type BrowserRecognitionConstructor = new () => BrowserRecognition;

type RecognitionCallbacks = {
  onListeningChange: (isListening: boolean) => void;
  onStatus: (status: string) => void;
};

type SpeechCallbacks = {
  onSpeakingChange: (isSpeaking: boolean) => void;
  onStatus: (status: string) => void;
};

type SpeechSynthesisLike = {
  cancel: () => void;
  speak: (utterance: SpeechSynthesisUtterance) => void;
};

declare global {
  interface Window {
    SpeechRecognition?: BrowserRecognitionConstructor;
    webkitSpeechRecognition?: BrowserRecognitionConstructor;
  }
}

export const stripMarkdownForSpeech = (text: string) => text
  .replace(/```[\s\S]*?```/g, "Code block omitted.")
  .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
  .replace(/[#>*_`~]/g, " ")
  .replace(/\s+([.,!?;:])/g, "$1")
  .replace(/\s+/g, " ")
  .trim();

export function startVoiceRecognitionSession(
  recognition: BrowserRecognition,
  language: string,
  onTranscript: (transcript: string) => void,
  callbacks: RecognitionCallbacks,
) {
  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onstart = () => {
    callbacks.onListeningChange(true);
    callbacks.onStatus("Listening — speak your question.");
  };
  recognition.onresult = (event) => {
    let transcript = "";
    let isFinal = false;
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      transcript += result?.[0]?.transcript ?? "";
      isFinal = Boolean(result?.isFinal) || isFinal;
    }
    if (transcript.trim()) onTranscript(transcript.trim());
    if (isFinal) callbacks.onStatus("Voice draft ready. Review it, then send when you are ready.");
  };
  recognition.onerror = (event) => {
    callbacks.onListeningChange(false);
    callbacks.onStatus(event.error === "not-allowed"
      ? "Microphone permission was not granted. Enable it in your browser settings to use voice input."
      : "Voice input ended before a transcript was available. Try again or type your question.");
  };
  recognition.onend = () => callbacks.onListeningChange(false);

  try {
    recognition.start();
  } catch {
    callbacks.onStatus("Voice input is already starting. Please wait a moment.");
  }
  return recognition;
}

export function startSpeechOutput(
  synth: SpeechSynthesisLike,
  text: string,
  language: string,
  callbacks: SpeechCallbacks,
  Utterance = SpeechSynthesisUtterance,
) {
  const spokenText = stripMarkdownForSpeech(text).slice(0, 6000);
  if (!spokenText) {
    callbacks.onStatus("There is no reply to read aloud yet.");
    return null;
  }

  synth.cancel();
  const utterance = new Utterance(spokenText);
  utterance.lang = language;
  utterance.rate = 1.02;
  utterance.pitch = 0.96;
  utterance.onstart = () => {
    callbacks.onSpeakingChange(true);
    callbacks.onStatus("BRIENNE is reading the latest reply.");
  };
  utterance.onend = () => {
    callbacks.onSpeakingChange(false);
    callbacks.onStatus("Spoken reply finished.");
  };
  utterance.onerror = () => {
    callbacks.onSpeakingChange(false);
    callbacks.onStatus("Speech output could not start. Check your browser audio settings and try again.");
  };
  synth.speak(utterance);
  return utterance;
}

export function stopSpeechOutput(synth: Pick<SpeechSynthesisLike, "cancel">, callbacks: SpeechCallbacks) {
  synth.cancel();
  callbacks.onSpeakingChange(false);
  callbacks.onStatus("Spoken reply stopped.");
}

export function useBrowserVoice() {
  const recognitionRef = useRef<BrowserRecognition | null>(null);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState("Voice controls are checking this browser.");

  useEffect(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognitionSupported = Boolean(Recognition);
    const speechSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setIsRecognitionSupported(recognitionSupported);
    setIsSpeechSupported(speechSupported);
    setStatus(recognitionSupported && speechSupported ? "Voice controls ready." : "Some voice controls are unavailable in this browser.");

    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback((onTranscript: (transcript: string) => void) => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setStatus("Voice input is not supported in this browser. You can still type your question.");
      return;
    }

    window.speechSynthesis?.cancel();
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    startVoiceRecognitionSession(recognition, navigator.language || "en-US", onTranscript, {
      onListeningChange: setIsListening,
      onStatus: setStatus,
    });
  }, []);

  const cancelSpeech = useCallback(() => {
    if (window.speechSynthesis) stopSpeechOutput(window.speechSynthesis, { onSpeakingChange: setIsSpeaking, onStatus: setStatus });
  }, []);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setStatus("Speech output is not supported in this browser.");
      return;
    }
    startSpeechOutput(window.speechSynthesis, text, navigator.language || "en-US", { onSpeakingChange: setIsSpeaking, onStatus: setStatus });
  }, []);

  return {
    cancelSpeech,
    isListening,
    isRecognitionSupported,
    isSpeaking,
    isSpeechSupported,
    speak,
    startListening,
    status,
    stopListening,
  };
}
