console.log("HUM TO TAB - VERSION 8");


// ========================================
// 1. FREQUENCY → MIDI
// ========================================

function frequencyToNoteNumber(freq) {

    return 12 * Math.log2(freq / 440) + 69;

}

console.log(frequencyToNoteNumber(440));


// ========================================
// 2. GUITAR FRETBOARD
// Frets 0–12
// ========================================

let lowE = [
    "E", "F", "F#", "G", "G#", "A", "A#",
    "B", "C", "C#", "D", "D#", "E"
];

let A = [
    "A", "A#", "B", "C", "C#", "D", "D#",
    "E", "F", "F#", "G", "G#", "A"
];

let D = [
    "D", "D#", "E", "F", "F#", "G", "G#",
    "A", "A#", "B", "C", "C#", "D"
];

let G = [
    "G", "G#", "A", "A#", "B", "C", "C#",
    "D", "D#", "E", "F", "F#", "G"
];

let B = [
    "B", "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

let highE = [
    "E", "F", "F#", "G", "G#", "A", "A#",
    "B", "C", "C#", "D", "D#", "E"
];

let guitar = {
    "Low E": lowE,
    "A": A,
    "D": D,
    "G": G,
    "B": B,
    "High E": highE
};


// ========================================
// 3. FIND A NOTE ON THE GUITAR
// ========================================

function findPositions(note) {

    let positions = [];

    for (let stringName in guitar) {

        let string = guitar[stringName];

        for (let fret = 0; fret < string.length; fret++) {

            if (string[fret] === note) {

                positions.push({
                    string: stringName,
                    fret: fret
                });

            }

        }

    }

    return positions;

}


// ========================================
// 4. CHOOSE A GUITAR POSITION
// ========================================

function choosePosition(positions, previousPosition) {

    if (positions.length === 0) {

        return null;

    }


    // First note:
    // choose the lowest fret

    if (previousPosition === null) {

        let bestPosition = positions[0];

        for (let position of positions) {

            if (position.fret < bestPosition.fret) {

                bestPosition = position;

            }

        }

        return bestPosition;

    }


    // Later notes:
    // choose the position closest
    // to the previous fret

    let bestPosition = positions[0];

    let bestDistance =
        Math.abs(
            positions[0].fret -
            previousPosition.fret
        );

    for (let position of positions) {

        let distance =
            Math.abs(
                position.fret -
                previousPosition.fret
            );

        if (distance < bestDistance) {

            bestDistance = distance;

            bestPosition = position;

        }

    }

    return bestPosition;

}


// ========================================
// 5. PAGE ELEMENTS
// ========================================

let startButton =
    document.getElementById("startButton");

let stopButton =
    document.getElementById("stopButton");

let captureButton =
    document.getElementById("captureButton");

let clearButton =
    document.getElementById("clearButton");

let status =
    document.getElementById("status");

let frequencyDisplay =
    document.getElementById("frequencyDisplay");

let noteDisplay =
    document.getElementById("noteDisplay");

let melodyDisplay =
    document.getElementById("melodyDisplay");

let tabOutput =
    document.getElementById("tabOutput");


// ========================================
// 6. MICROPHONE VARIABLES
// ========================================

let audioContext = null;

let analyser = null;

let microphone = null;

let microphoneStream = null;

let detecting = false;


// ========================================
// 7. MELODY STORAGE
// ========================================

let melody = [];

let melodyPositions = [];

let previousPosition = null;


// ========================================
// 8. START MICROPHONE
// ========================================

startButton.addEventListener(
    "click",
    async function() {

        if (detecting) {

            return;

        }

        try {

            microphoneStream =
                await navigator.mediaDevices
                .getUserMedia({
                    audio: true
                });


            audioContext =
                new AudioContext();


            analyser =
                audioContext.createAnalyser();


            analyser.fftSize = 2048;


            microphone =
                audioContext
                .createMediaStreamSource(
                    microphoneStream
                );


            microphone.connect(analyser);


            detecting = true;


            status.textContent =
                "Microphone is working!";


            console.log(
                "MICROPHONE CONNECTED"
            );


            detectPitch();


        } catch (error) {

            console.log(error);

            status.textContent =
                "Microphone access denied.";

        }

    }
);


// ========================================
// 9. PITCH DETECTION
// ========================================

function detectPitch() {

    if (
        !detecting ||
        !analyser ||
        !audioContext
    ) {

        return;

    }


    let buffer =
        new Float32Array(
            analyser.fftSize
        );


    analyser.getFloatTimeDomainData(
        buffer
    );


    let frequency =
        autoCorrelate(
            buffer,
            audioContext.sampleRate
        );


    if (frequency !== -1) {

        frequencyDisplay.textContent =
            "Frequency: " +
            frequency.toFixed(2) +
            " Hz";


        let midi =
            frequencyToNoteNumber(
                frequency
            );


        let note =
            midiToNoteName(midi);


        let positions =
            findPositions(note);


        noteDisplay.textContent =
            "Note: " + note;


        console.log(
            frequency.toFixed(2),
            "Hz →",
            note
        );


        console.log(
            "Guitar positions:",
            positions
        );

    }


    if (detecting) {

        requestAnimationFrame(
            detectPitch
        );

    }

}


// ========================================
// 10. CAPTURE NOTE
// ========================================

captureButton.addEventListener(
    "click",
    function() {

        let currentNote =
            noteDisplay.textContent
            .replace("Note: ", "");


        if (
            currentNote === "--" ||
            currentNote === ""
        ) {

            console.log(
                "No note detected."
            );

            return;

        }


        let positions =
            findPositions(
                currentNote
            );


        let chosenPosition =
            choosePosition(
                positions,
                previousPosition
            );


        if (chosenPosition === null) {

            return;

        }


        melody.push(currentNote);

        melodyPositions.push(
            chosenPosition
        );


        previousPosition =
            chosenPosition;


        updateMelodyDisplay();


        console.log(
            "CAPTURED:",
            currentNote
        );


        console.log(
            "POSITION:",
            chosenPosition
        );

    }
);


// ========================================
// 11. DISPLAY CAPTURED MELODY
// ========================================

function updateMelodyDisplay() {

    if (melody.length === 0) {

        melodyDisplay.textContent =
            "No notes captured yet.";

        return;

    }


    melodyDisplay.textContent =
        melody.join(" → ");


    updatePositionDisplay();

}


// ========================================
// 12. DISPLAY GUITAR POSITIONS
// ========================================

function updatePositionDisplay() {

    let output = "";


    for (
        let i = 0;
        i < melodyPositions.length;
        i++
    ) {

        let position =
            melodyPositions[i];


        output +=
            melody[i] +
            " = " +
            position.string +
            " string, fret " +
            position.fret +
            "\n";

    }


    tabOutput.textContent =
        output;

}


// ========================================
// 13. CLEAR MELODY
// ========================================

clearButton.addEventListener(
    "click",
    function() {

        melody = [];

        melodyPositions = [];

        previousPosition = null;


        melodyDisplay.textContent =
            "No notes captured yet.";


        tabOutput.textContent =
            "";


        console.log(
            "MELODY CLEARED"
        );

    }
);


// ========================================
// 14. STOP MICROPHONE
// ========================================

stopButton.addEventListener(
    "click",
    function() {

        console.log(
            "STOP BUTTON PRESSED"
        );


        detecting = false;


        if (microphoneStream) {

            microphoneStream
                .getTracks()
                .forEach(
                    function(track) {

                        track.stop();

                    }
                );

            microphoneStream = null;

        }


        if (microphone) {

            microphone.disconnect();

            microphone = null;

        }


        if (audioContext) {

            audioContext.close();

            audioContext = null;

        }


        analyser = null;


        status.textContent =
            "Microphone off";


        frequencyDisplay.textContent =
            "Frequency: -- Hz";


        noteDisplay.textContent =
            "Note: --";


        console.log(
            "MICROPHONE STOPPED"
        );

    }
);


// ========================================
// 15. AUTOCORRELATION
// ========================================

function autoCorrelate(
    buffer,
    sampleRate
) {

    let SIZE = buffer.length;

    let rms = 0;


    for (
        let i = 0;
        i < SIZE;
        i++
    ) {

        rms +=
            buffer[i] *
            buffer[i];

    }


    rms =
        Math.sqrt(
            rms / SIZE
        );


    if (rms < 0.01) {

        return -1;

    }


    let bestOffset = -1;

    let bestCorrelation = 0;


    for (
        let offset = 20;
        offset < SIZE / 2;
        offset++
    ) {

        let correlation = 0;


        for (
            let i = 0;
            i < SIZE / 2;
            i++
        ) {

            correlation +=
                buffer[i] *
                buffer[i + offset];

        }


        correlation /=
            SIZE / 2;


        if (
            correlation >
            bestCorrelation
        ) {

            bestCorrelation =
                correlation;

            bestOffset =
                offset;

        }

    }


    if (bestOffset === -1) {

        return -1;

    }


    return sampleRate / bestOffset;

}


// ========================================
// 16. MIDI → NOTE NAME
// ========================================

function midiToNoteName(midi) {

    let noteNames = [
        "C", "C#", "D", "D#",
        "E", "F", "F#", "G",
        "G#", "A", "A#", "B"
    ];


    let noteIndex =
        Math.round(midi) % 12;


    return noteNames[noteIndex];

}


// ========================================
// END
// ========================================

console.log(
    "Hum-to-Tab Version 8 ready."
);
