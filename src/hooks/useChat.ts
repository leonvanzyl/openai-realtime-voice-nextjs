import { useState, useCallback, useRef, useEffect } from "react";

export const useChat = () => {
  // Separate state management
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  // Separate refs
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  const disconnect = useCallback(() => {
    mediaStream.current?.getTracks().forEach((track) => track.stop());
    dataChannel.current?.close();
    peerConnection.current?.close();

    mediaStream.current = null;
    dataChannel.current = null;
    peerConnection.current = null;
    audioElement.current = null;

    setIsConnected(false);
    setError(null);
    setTranscript("");
  }, []);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setTranscript("");

      // Get auth token
      const { client_secret: { value: EPHEMERAL_KEY } = { value: undefined } } =
        await fetch("/api/realtime-token", {
          method: "POST",
        }).then((res) => res.json());

      if (!EPHEMERAL_KEY) throw new Error("Failed to get ephemeral token");

      // Setup WebRTC
      peerConnection.current = new RTCPeerConnection();
      audioElement.current = new Audio();
      audioElement.current.autoplay = true;

      // Handle incoming audio
      // When audio arrives, the ontrack event
      peerConnection.current.ontrack = (e) => {
        if (audioElement.current) {
          audioElement.current.srcObject = e.streams[0];
        }
      };

      mediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStream.current.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, mediaStream.current!);
      });

      dataChannel.current =
        peerConnection.current.createDataChannel("oai-events");
      dataChannel.current.onmessage = (e) => {
        const event = JSON.parse(e.data);
        console.log("Received event:", event);

        // Clear transcript when a new response starts
        if (event.type === "response.created") {
          setTranscript("");
        }
        // Handle audio transcript deltas for transcript
        else if (event.type === "response.audio_transcript.delta") {
          setTranscript((prev) => prev + event.delta);
        } else if (event.type === "response.audio_transcript.done") {
          // Optionally handle the complete transcript if needed
          // setTranscript(event.transcript);
        }
      };

      // Handle connection
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      const baseUrl = process.env.NEXT_PUBLIC_OPENAI_BASE_URL!;
      const model = process.env.NEXT_PUBLIC_OPENAI_REALTIME_MODEL!;

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpResponse.ok)
        throw new Error("Failed to establish WebRTC connection");

      await peerConnection.current.setRemoteDescription({
        type: "answer",
        sdp: await sdpResponse.text(),
      });

      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
      disconnect();
    } finally {
      setIsConnecting(false);
    }
  }, [disconnect]);

  useEffect(() => () => disconnect(), [disconnect]);

  const sendMessage = useCallback((message: any) => {
    if (dataChannel.current?.readyState === "open") {
      dataChannel.current.send(JSON.stringify(message));
    }
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    transcript,
    connect,
    disconnect,
    sendMessage,
  };
};
