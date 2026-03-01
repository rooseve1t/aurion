// server/voice-processor.ts

import { SpeechRecognition } from 'web-speech-api';

class VoiceProcessor {
    private recognition: SpeechRecognition;

    constructor() {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const results = event.results;
            const transcript = results[results.length - 1][0].transcript;
            console.log("Heard: ", transcript);
            // Process the transcript here
        };

        this.recognition.onerror = (event: SpeechRecognitionError) => {
            console.error('Error occurred in recognition: ' + event.error);
        };

        this.recognition.onend = () => {
            console.log('Recognition service disconnected');
        };
    }

    public startListening() {
        this.recognition.start();
        console.log('Voice recognition activated. Try speaking into the microphone.');
    }

    public stopListening() {
        this.recognition.stop();
        console.log('Voice recognition deactivated.');
    }
}

// Example usage
const voiceProcessor = new VoiceProcessor();
voiceProcessor.startListening();

// To stop listening later, you can call:
// voiceProcessor.stopListening();
