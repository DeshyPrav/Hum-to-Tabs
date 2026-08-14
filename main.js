console.log("NEW VERSION");

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

let A = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A"
];
console.log(A[3]);

let D = [
    "D",
    "D#",
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
    "D"
];

console.log(D[5]);
