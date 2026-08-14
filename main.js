console.log("Hum to Tab is running");

// Frequency to MIDI note number
function frequencyToNoteNumber(freq) {
    return 12 * Math.log2(freq / 440) + 69;
}

console.log(frequencyToNoteNumber(440));


// Guitar strings, frets 0–12

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


// Put all strings into one guitar

let guitar = {
    "Low E": lowE,
    "A": A,
    "D": D,
    "G": G,
    "B": B,
    "High E": highE
};


// Test the guitar

console.log(guitar["Low E"][3]);
console.log(guitar["A"][3]);
console.log(guitar["D"][5]);
console.log(guitar["G"][0]);
console.log(guitar["B"][8]);
console.log(guitar["High E"][3]);
