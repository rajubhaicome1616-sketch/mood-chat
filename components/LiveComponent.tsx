
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';

// Audio decoding and encoding functions
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
}


const LiveComponent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Idle. Press Start to talk.');
  const [transcription, setTranscription] = useState<{user: string, bot: string}[]>([]);
  
  const sessionRef = useRef<LiveSession | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  
  const currentUserTranscription = useRef('');
  const currentBotTranscription = useRef('');
  
  const startConversation = async () => {
    if (!process.env.API_KEY) {
      setStatus('API Key not found. Please set it in your environment.');
      return;
    }
    
    if (isRecording) return;
    setIsRecording(true);
    setStatus('Connecting...');
    setTranscription([]);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioContextRef.current = outputAudioContext;
      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus('Connected. Start talking...');
            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = inputAudioContext;

            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              currentUserTranscription.current += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              currentBotTranscription.current += message.serverContent.outputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userText = currentUserTranscription.current;
              const botText = currentBotTranscription.current;
              if (userText || botText) {
                setTranscription(prev => [...prev, {user: userText, bot: botText}]);
              }
              currentUserTranscription.current = '';
              currentBotTranscription.current = '';
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
            if (base64Audio) {
              nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const sourceNode = outputAudioContext.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(outputAudioContext.destination);
              sourceNode.addEventListener('ended', () => sources.delete(sourceNode));
              sourceNode.start(nextStartTime);
              nextStartTime += audioBuffer.duration;
              sources.add(sourceNode);
            }
          },
          onclose: () => setStatus('Connection closed.'),
          onerror: (e) => {
              console.error(e)
              setStatus('An error occurred. Please check the console.')
          },
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setStatus('Error starting conversation. Check permissions and console.');
      setIsRecording(false);
    }
  };

  const stopConversation = () => {
    if (!isRecording) return;
    
    if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if(scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if(audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    if(outputAudioContextRef.current) {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }

    setIsRecording(false);
    setStatus('Idle. Press Start to talk.');
  };
  
  useEffect(() => {
    return () => {
      stopConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Live Conversation with Gemini</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">Speak into your microphone and have a real-time conversation. The transcription will appear below.</p>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 017 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H9a1 1 0 100 2h2a1 1 0 100-2h-1v-2.07z" clipRule="evenodd" />
                </svg>
            </div>
            <p className="font-medium text-lg text-gray-700 dark:text-gray-300">{status}</p>
            <div className="flex space-x-4">
                <button onClick={startConversation} disabled={isRecording} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">Start Conversation</button>
                <button onClick={stopConversation} disabled={!isRecording} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">Stop Conversation</button>
            </div>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 overflow-y-auto mt-4 border border-gray-200 dark:border-gray-600">
                {transcription.map((turn, index) => (
                    <div key={index} className="mb-2">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">You: <span className="font-normal text-gray-700 dark:text-gray-300">{turn.user}</span></p>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">Gemini: <span className="font-normal text-gray-700 dark:text-gray-300">{turn.bot}</span></p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default LiveComponent;
