// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
//            Alexandre Bique
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

Scales.NOTE_NAMES    = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ];
Scales.BASES   = [ 'C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb' ];
Scales.OFFSETS = [  0,   7,   2,   9,   4,   11,  5,   10,   3,    8,    1,    6 ];

Scales.PLAY_SHIFT_COLS = 8;

Scales.DRUM_NOTE_START = 36;
Scales.DRUM_NOTE_END   = 100;
Scales.DRUM_MATRIX =
[
    0,   1,  2,  3, -1, -1, -1, -1, 
    4,   5,  6,  7, -1, -1, -1, -1, 
    8,   9, 10, 11, -1, -1, -1, -1, 
    12, 13, 14, 15, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1
];

Scales.PIANO_MATRIX =
[
    0,   2,  4,  5,  7,  9, 11, 12, 
   -1,   1,  3, -1,  6,  8, 10, -1, 
   12,  14, 16, 17, 19, 21, 23, 24, 
   -1,  13, 15, -1, 18, 20, 22, -1, 
   24,  26, 28, 29, 31, 33, 35, 36, 
   -1,  25, 27, -1, 30, 32, 34, -1, 
   36,  38, 40, 41, 43, 45, 47, 48, 
   -1,  37, 39, -1, 42, 44, 46, -1
];

Scales.INTERVALS =
[
    { name: 'Major',            notes: [ 0, 2, 4, 5, 7,  9,  11 ] },
    { name: 'Minor',            notes: [ 0, 2, 3, 5, 7,  8,  10 ] },
    { name: 'Dorian',           notes: [ 0, 2, 3, 5, 7,  9,  10 ] },
    { name: 'Mixolydian',       notes: [ 0, 2, 4, 5, 7,  9,  10 ] },
    { name: 'Lydian',           notes: [ 0, 2, 4, 6, 7,  9,  11 ] },
    { name: 'Phrygian',         notes: [ 0, 1, 3, 5, 7,  8,  10 ] },
    { name: 'Locrian',          notes: [ 0, 1, 3, 4, 6,  8,  10 ] },
    { name: 'Diminished',       notes: [ 0, 1, 3, 4, 6,  7,  9  ] },
    { name: 'Whole-half',       notes: [ 0, 2, 3, 5, 6,  8,  9  ] },
    { name: 'Whole Tone',       notes: [ 0, 2, 4, 6, 8,  10 ] },
    { name: 'Minor Blues',      notes: [ 0, 3, 5, 6, 7,  10 ] },
    { name: 'Minor Pentatonic', notes: [ 0, 3, 5, 7, 10 ] },
    { name: 'Major Pentatonic', notes: [ 0, 2, 4, 7, 9  ] },
    { name: 'Harmonic Minor',   notes: [ 0, 2, 3, 5, 7,  8,  11 ] },
    { name: 'Melodic Minor',    notes: [ 0, 2, 3, 5, 7,  9,  11 ] },
    { name: 'Super Locrian',    notes: [ 0, 1, 3, 4, 6,  8,  10 ] },
    { name: 'Bhairav',          notes: [ 0, 1, 4, 5, 7,  8,  11 ] },
    { name: 'Hungarian Minor',  notes: [ 0, 2, 3, 6, 7,  8,  11 ] },
    { name: 'Minor Gypsy',      notes: [ 0, 1, 4, 5, 7,  8,  10 ] },
    { name: 'Hirojoshi',        notes: [ 0, 4, 6, 7, 11 ] },
    { name: 'In-Sen',           notes: [ 0, 1, 5, 7, 10 ] },
    { name: 'Iwato',            notes: [ 0, 1, 5, 6, 10 ] },
    { name: 'Kumoi',            notes: [ 0, 2, 3, 7, 9  ] },
    { name: 'Pelog',            notes: [ 0, 1, 3, 7, 8  ] },
    { name: 'Spanish',          notes: [ 0, 1, 4, 5, 7,  9,  10 ] }
];

Scales.FOURTH_UP          = 0;
Scales.FOURTH_RIGHT       = 1;
Scales.THIRD_UP           = 2;
Scales.THIRD_RIGHT        = 3;
Scales.SEQUENT_UP         = 4;
Scales.SEQUENT_RIGHT      = 5;
Scales.EIGHT_UP           = 6;
Scales.EIGHT_RIGHT        = 7;
Scales.EIGHT_UP_CENTER    = 8;
Scales.EIGHT_RIGHT_CENTER = 9;

Scales.LAYOUT_NAMES  = [ '4th ^', '4th >',
                         '3rd ^', '3rd >',
                         'Seqent ^', 'Seqent >',
                         '8th ^', '8th >',
                         '8th ^ centered', '8th > centered' ];
Scales.ORIENT_UP     = 0;
Scales.ORIENT_RIGHT  = 1;

Scales.SCALE_COLOR_OFF          = 0;
Scales.SCALE_COLOR_OCTAVE       = 1;
Scales.SCALE_COLOR_NOTE         = 2;
Scales.SCALE_COLOR_OUT_OF_SCALE = 3;

Scales.OCTAVE_RANGE       = 4;
Scales.PIANO_OCTAVE_RANGE = 3;


Scales.getNames = function ()
{
    var scaleNames = [];
    for (var i = 0; i < Scales.INTERVALS.length; i++)
        scaleNames.push (Scales.INTERVALS[i].name);
    return scaleNames;
};


function Scales (startNote, endNote, numColumns, numRows)
{
    this.startNote     = startNote;
    this.endNote       = endNote; // last note + 1
    this.numColumns    = numColumns;
    this.numRows       = numRows;

    this.selectedScale = 0;      // Major
    this.scaleOffset   = 0;      // C
    this.scaleLayout   = Scales.FOURTH_UP;
    this.orientation   = Scales.ORIENT_UP;
    this.chromaticOn   = false;
    this.shift         = 3;
    this.octave        = 0;
    this.drumOctave    = 0;
    this.pianoOctave   = 0;

    this.generateMatrices ();
}

Scales.prototype.getName = function (scale)
{
    return scale < Scales.INTERVALS.length ? Scales.INTERVALS[scale].name : '';
};

Scales.prototype.getSelectedScale = function ()
{
    return this.selectedScale;
};

Scales.prototype.getScaleSize = function ()
{
    return this.scales.length;
};

Scales.prototype.setScale = function (scale)
{
    this.selectedScale = Math.max (0, Math.min (scale, this.scales.length - 1));
};

Scales.prototype.setScaleByName = function (scaleName)
{
    for (var i = 0; i < Scales.INTERVALS.length; i++)
    {
        if (Scales.INTERVALS[i].name == scaleName)
        {
            this.selectedScale = i;
            break;
        }
    }
};

Scales.prototype.nextScale = function ()
{
    this.setScale (this.selectedScale + 1);
};

Scales.prototype.prevScale = function ()
{
    this.setScale (this.selectedScale - 1);
};

Scales.prototype.getScaleOffset = function ()
{
    return this.scaleOffset;
};

Scales.prototype.setScaleOffset = function (scaleOffset)
{
    this.scaleOffset = Math.max (0, Math.min (scaleOffset, Scales.OFFSETS.length - 1));
};

Scales.prototype.changeScaleOffset = function (value)
{
    this.scaleOffset = changeValue (value, this.scaleOffset, 1, Scales.OFFSETS.length - 1);
};

Scales.prototype.setScaleOffsetByName = function (scaleOffsetName)
{
    for (var i = 0; i < Scales.BASES.length; i++)
    {
        if (Scales.BASES[i] == scaleOffsetName)
        {
            this.scaleOffset = i;
            break;
        }
    }
};

Scales.prototype.getScaleLayout = function ()
{
    return this.scaleLayout;
};

Scales.prototype.setScaleLayoutByName = function (scaleLayoutName)
{
    for (var i = 0; i < Scales.LAYOUT_NAMES.length; i++)
    {
        if (Scales.LAYOUT_NAMES[i] == scaleLayoutName)
        {
            this.setScaleLayout (i);
            break;
        }
    }
};

Scales.prototype.setScaleLayout = function (scaleLayout)
{
    this.scaleLayout = Math.max (Scales.FOURTH_UP, Math.min (scaleLayout, Scales.EIGHT_RIGHT_CENTER));
    this.orientation = this.scaleLayout % 2 == 0 ? Scales.ORIENT_UP : Scales.ORIENT_RIGHT;
    switch (this.scaleLayout)
    {
        case 0:
        case 1:
            this.setPlayShift (3);
            break;
        case 2:
        case 3:
            this.setPlayShift (2);
            break;
        case 4:
        case 5:
            this.setPlayShift (Scales.PLAY_SHIFT_COLS);
            break;
        case 6:
        case 7:
        case 8:
        case 9:
            this.setPlayShift (7);
            break;
    }
};

Scales.prototype.setChromatic = function (enable)
{
    this.chromaticOn = enable;
};

Scales.prototype.toggleChromatic = function ()
{
    this.chromaticOn = !this.chromaticOn;
};

Scales.prototype.isChromatic = function ()
{
    return this.chromaticOn;
};

Scales.prototype.setOctave = function (octave)
{
    this.octave = Math.max (-Scales.OCTAVE_RANGE, Math.min (octave, Scales.OCTAVE_RANGE));
};

Scales.prototype.getOctave = function ()
{
    return this.octave;
};

Scales.prototype.incOctave = function ()
{
    this.setOctave (this.octave + 1);
};

Scales.prototype.decOctave = function ()
{
    this.setOctave (this.octave - 1);
};

Scales.prototype.setDrumOctave = function (drumOctave)
{
    this.drumOctave = Math.max (-3, Math.min (drumOctave, 5));
};

Scales.prototype.getDrumOctave = function ()
{
    return this.drumOctave;
};

Scales.prototype.incDrumOctave = function ()
{
    this.setDrumOctave (this.drumOctave + 1);
};

Scales.prototype.decDrumOctave = function ()
{
    this.setDrumOctave (this.drumOctave - 1);
};

Scales.prototype.setPianoOctave = function (octave)
{
    this.pianoOctave = Math.max (-Scales.PIANO_OCTAVE_RANGE, Math.min (octave, Scales.PIANO_OCTAVE_RANGE));
};

Scales.prototype.getPianoOctave = function ()
{
    return this.pianoOctave;
};

Scales.prototype.incPianoOctave = function ()
{
    this.setPianoOctave (this.pianoOctave + 1);
};

Scales.prototype.decPianoOctave = function ()
{
    this.setPianoOctave (this.pianoOctave - 1);
};

Scales.prototype.setPlayShift = function (shift)
{
    this.shift = shift;
    this.generateMatrices ();
};

Scales.prototype.getPlayShift = function ()
{
    return this.shift;
};

Scales.prototype.getColor = function (noteMap, note)
{
    var midiNote = noteMap[note];
    if (midiNote == -1)
        return Scales.SCALE_COLOR_OFF;
    var n = (midiNote - Scales.OFFSETS[this.scaleOffset]) % 12;
    if (n == 0)
        return Scales.SCALE_COLOR_OCTAVE;
    if (this.isChromatic ())
    {
        var notes = Scales.INTERVALS[this.selectedScale].notes;
        for (var i = 0; i < notes.length; i++)
        {
            if (notes[i] == n)
                return Scales.SCALE_COLOR_NOTE;
        }
        return Scales.SCALE_COLOR_OUT_OF_SCALE;
    }
    return Scales.SCALE_COLOR_NOTE;
};

Scales.prototype.getNoteMatrix = function ()
{
    var matrix = this.getActiveMatrix ();
    var noteMap = this.getEmptyMatrix ();
    for (var note = this.startNote; note < this.endNote; note++)
    {
        var n = matrix[note - this.startNote] + Scales.OFFSETS[this.scaleOffset] + this.startNote + this.octave * 12;
        noteMap[note] = n < 0 || n > 127 ? -1 : n;
    }
    return noteMap;
};

Scales.prototype.getSequencerMatrix = function (length, offset)
{
    var matrix = this.getActiveMatrix ();
    var noteMap = initArray (-1, length);
    for (var note = 0; note < length; note++)
    {
        var n = matrix[note] + Scales.OFFSETS[this.scaleOffset] + offset;
        noteMap[note] = n < 0 || n > 127 ? -1 : n;
    }
    return noteMap;
};

Scales.prototype.getPianoMatrix = function ()
{
    var matrix = Scales.PIANO_MATRIX;
    var noteMap = this.getEmptyMatrix ();
    for (var note = this.startNote; note < this.endNote; note++)
    {
        var n = matrix[note - this.startNote] == -1 ? -1 : matrix[note - this.startNote] + this.startNote + this.pianoOctave * 12;
        noteMap[note] = n < 0 || n > 127 ? -1 : n;
    }
    return noteMap;
};

Scales.prototype.getEmptyMatrix = function ()
{
    return initArray (-1, 128);
};

Scales.prototype.getDrumMatrix = function ()
{
    var matrix = Scales.DRUM_MATRIX;
    var noteMap = this.getEmptyMatrix ();
    for (var note = Scales.DRUM_NOTE_START; note < Scales.DRUM_NOTE_END; note++)
    {
        var n = matrix[note - Scales.DRUM_NOTE_START] == -1 ? -1 : matrix[note - Scales.DRUM_NOTE_START] + Scales.DRUM_NOTE_START + this.drumOctave * 16;
        noteMap[note] = n < 0 || n > 127 ? -1 : n;
    }
    return noteMap;
};

Scales.prototype.getRangeText = function ()
{
    var matrix = this.getActiveMatrix ();
    var offset = Scales.OFFSETS[this.scaleOffset];
    return this.formatNote (offset + matrix[0]) + ' to ' + this.formatNote (offset + matrix[matrix.length - 1]);
};

Scales.prototype.getSequencerRangeText = function (from, to)
{
    return this.formatNoteAndOctave (from, -3) + ' to ' + this.formatNoteAndOctave (to, -3);
};

Scales.prototype.getDrumRangeText = function ()
{
    var s = this.startNote + this.drumOctave * 16;
    return this.formatDrumNote (s) + ' to ' + this.formatDrumNote (s + 15);
};

Scales.prototype.getPianoRangeText = function ()
{
    return this.formatNote (this.pianoOctave * 12) + ' to ' + this.formatNote ((this.pianoOctave + 4) * 12);
};

Scales.prototype.formatDrumNote = function (note)
{
    return this.formatNoteAndOctave (note, -3);
};

Scales.prototype.formatNote = function (note)
{
    return this.formatNoteAndOctave (note, this.octave);
};

Scales.prototype.formatNoteAndOctave = function (note, octaveOffset)
{
    return Scales.NOTE_NAMES[Math.abs(note % 12)] + (Math.floor (note / 12) + octaveOffset + 1);
};

Scales.prototype.createScale = function (scale)
{
    var len = scale.notes.length;
    var matrix = [];
    var chromatic = [];
    var isUp = this.orientation == Scales.ORIENT_UP;
    var shiftedNote = this.shift == this.numRows ? this.numRows : (this.shift == 7 ? 12 : scale.notes[this.shift % len]);
    var centerOffset = (this.scaleLayout == Scales.EIGHT_UP_CENTER || this.scaleLayout == Scales.EIGHT_RIGHT_CENTER) ? -3 : 0;
  
    for (var row = 0; row < this.numRows; row++)
    {
        for (var column = 0; column < this.numColumns; column++)
        {
            var y = isUp ? row : column;
            var x = isUp ? column : row;
            var offset = y * this.shift + x + centerOffset;
            
            var oct = Math.floor (offset / len);

            // Fix negative values introduced by centerOffset
            if (offset < 0)
            {
                offset = len + offset;
                oct = Math.floor (offset / len) - 1;
            }
            
            matrix.push (oct * 12 + scale.notes[offset % len]);
            chromatic.push (y * shiftedNote + x);
        }
    }
    return { name: scale.name, matrix: matrix, chromatic: chromatic };
};

Scales.prototype.getActiveMatrix = function ()
{
    return this.isChromatic () ? this.scales[this.selectedScale].chromatic : this.scales[this.selectedScale].matrix;
};

Scales.prototype.generateMatrices = function ()
{
    this.scales = [];
    for (var i = 0; i < Scales.INTERVALS.length; i++)
        this.scales.push (this.createScale (Scales.INTERVALS[i]));
};

// Function to hook in translation for grids who do not send midi notes 36-100
Scales.prototype.translateMatrixToGrid = function (matrix)
{
    return matrix;
};
