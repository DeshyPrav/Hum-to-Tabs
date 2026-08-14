console.log("app.js is running");

function frequencyToNoteNumber(freq) {
    return 12 * Math.log2(freq / 440) + 69;
}

console.log(frequencyToNoteNumber(440));

let lowE = [
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E"
];

console.log(lowE[3]);
