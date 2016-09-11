// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

DrumView.NUM_DISPLAY_COLS = 16;
DrumView.DRUM_START_KEY = 36;

function DrumView (model)
{
    AbstractSequencerView.call (this, model, 128, DrumView.NUM_DISPLAY_COLS);
    this.offsetY = DrumView.DRUM_START_KEY;
    this.canScrollUp = false;
    this.canScrollDown = false;
    this.selectedPad = 0;
    this.pressedKeys = initArray (0, 128);
    this.noteMap = this.scales.getEmptyMatrix ();

    this.loopPadPressed = -1;

    var tb = model.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        // Light notes send from the sequencer
        this.pressedKeys[note] = pressed ? velocity : 0;
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
    }));
}
DrumView.prototype = new AbstractSequencerView ();

DrumView.prototype.updateSceneButtons = function ()
{
    if (this.surface.isShiftPressed ())
    {
        AbstractView.prototype.updateSceneButtons.call (this);
        return;
    }
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_1, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_2, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_3, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_4, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_5, APC_BUTTON_STATE_ON);
};

DrumView.prototype.updateArrowStates = function ()
{
    this.canScrollLeft = this.offsetX > 0;
    this.canScrollRight = true; // TODO API extension required - We do not know the number of steps
};

DrumView.prototype.updateNoteMapping = function ()
{
    this.noteMap = this.model.canSelectedTrackHoldNotes () && !this.surface.isSelectPressed () ? this.scales.getDrumMatrix () : this.scales.getEmptyMatrix ();
    this.surface.setKeyTranslationTable (this.noteMap);
};

DrumView.prototype.onSelect = function (event)
{
    this.updateNoteMapping ();
};

DrumView.prototype.onGridNote = function (note, velocity)
{
    if (this.surface.isShiftPressed ())
    {
        this.onShiftGridNote (note, velocity);
        return;
    }

    if (!this.model.canSelectedTrackHoldNotes ())
        return;

    var index = note - 36;
    var x = index % 8;
    var y = Math.floor (index / 8);

    // Sequencer steps
    if (y >= 3)
    {
        if (velocity != 0)
        {
            var col = 8 * (4 - y) + x;
            this.clip.toggleStep (col, this.offsetY + this.selectedPad, Config.accentActive ? Config.fixedAccentValue : velocity);
        }
        return;
    }

    if (x < 4)
    {
        // 4x3 Drum Pad Grid

        this.selectedPad = 4 * y + x;   // 0-12
        var playedPad = velocity == 0 ? -1 : this.selectedPad;

        // Mark selected note
        this.pressedKeys[this.offsetY + this.selectedPad] = velocity;
        this.surface.sendMidiEvent (0x90, this.offsetY + this.selectedPad, velocity);
        
        if (playedPad < 0)
            return;
        
        return;
    }

    // Clip length/loop area
    var pad = (2 - y) * 4 + x - 4;
    if (velocity > 0)   // Button pressed
    {
        if (this.loopPadPressed == -1)  // Not yet a button pressed, store it
            this.loopPadPressed = pad;
    }
    else if (this.loopPadPressed != -1)
    {
        var start = this.loopPadPressed < pad ? this.loopPadPressed : pad;
        var end   = (this.loopPadPressed < pad ? pad : this.loopPadPressed) + 1;
        var quartersPerPad = this.model.getQuartersPerMeasure ();

        // Set a new loop between the 2 selected pads
        var newStart = start * quartersPerPad;
        this.clip.setLoopStart (newStart);
        this.clip.setLoopLength ((end - start) * quartersPerPad);
        this.clip.setPlayRange (newStart, end * quartersPerPad);

        this.loopPadPressed = -1;
    }
};

DrumView.prototype.onScene = function (index, event)
{
    if (!event.isDown ())
        return;
    switch (index)
    {
        case 3:
            this.onOctaveUp (event);
            break;
        case 4:
            this.onOctaveDown (event);
            break;
    }
};

DrumView.prototype.onOctaveDown = function (event)
{
    this.clearPressedKeys ();
    this.scales.decDrumOctave ();
    this.offsetY = DrumView.DRUM_START_KEY + this.scales.getDrumOctave () * 16;
    this.updateNoteMapping ();
    displayNotification (this.scales.getDrumRangeText ());
};

DrumView.prototype.onOctaveUp = function (event)
{
    this.clearPressedKeys ();
    this.scales.incDrumOctave ();
    this.offsetY = DrumView.DRUM_START_KEY + this.scales.getDrumOctave () * 16;
    this.updateNoteMapping ();
    displayNotification (this.scales.getDrumRangeText ());
};

DrumView.prototype.drawGrid = function ()
{
    if (this.surface.isShiftPressed ())
    {
        this.drawShiftGrid ();
        return;
    }

    if (!this.model.canSelectedTrackHoldNotes ())
    {
        this.surface.pads.turnOff ();
        return;
    }

    // 3x4 Drum Pad Grid
    var primary = this.model.getTrackBank ().primaryDevice;
    var hasDrumPads = primary.hasDrumPads ();
    var isSoloed = false;
    if (hasDrumPads)
    {
        for (var i = 0; i < 12; i++)
        {
            if (primary.getDrumPad (i).solo)
            {
                isSoloed = true;
                break;
            }
        }
    }
    var isRecording = this.model.hasRecordingState ();
    for (var y = 0; y < 3; y++)
    {
        for (var x = 0; x < 4; x++)
        {
            var index = 4 * y + x;
            this.surface.pads.lightEx (x, 4 - y, this.getPadColor (index, primary, hasDrumPads, isSoloed, isRecording), null, false);
        }
    }
    
    // Clip length/loop area
    var step = this.clip.getCurrentStep ();
    var quartersPerPad = this.model.getQuartersPerMeasure ();
    var stepsPerMeasure = Math.round (quartersPerPad / this.resolutions[this.selectedIndex]);
    var currentMeasure = Math.floor (step / stepsPerMeasure);
    var maxQuarters = quartersPerPad * 12;
    var start = this.clip.getLoopStart ();
    var loopStartPad = Math.floor (Math.max (0, start) / quartersPerPad);
    var loopEndPad   = Math.ceil (Math.min (maxQuarters, start + this.clip.getLoopLength ()) / quartersPerPad);
    for (var pad = 0; pad < 12; pad++)
        this.surface.pads.lightEx (4 + pad % 4, 2 + Math.floor (pad / 4), pad >= loopStartPad && pad < loopEndPad ? (pad == currentMeasure ? DrumView.COLOR_ACTIVE_MEASURE : DrumView.COLOR_MEASURE) : APC_COLOR_BLACK, null, false);
            
    // Paint the sequencer steps
    var hiStep = this.isInXRange (step) ? step % DrumView.NUM_DISPLAY_COLS : -1;
    for (var col = 0; col < DrumView.NUM_DISPLAY_COLS; col++)
    {
        var isSet = this.clip.getStep (col, this.offsetY + this.selectedPad);
        var hilite = col == hiStep;
        var x = col % 8;
        var y = 4 - Math.floor (col / 8);
        this.surface.pads.lightEx (x, 4 - y, isSet ? (hilite ? AbstractSequencerView.COLOR_STEP_HILITE_NO_CONTENT : AbstractSequencerView.COLOR_CONTENT) : hilite ? AbstractSequencerView.COLOR_STEP_HILITE_CONTENT : AbstractSequencerView.COLOR_NO_CONTENT, null, false);
    }
};

DrumView.prototype.getPadColor = function (index, primary, hasDrumPads, isSoloed, isRecording)
{
    // Playing note?
    if (this.pressedKeys[this.offsetY + index] > 0)
        return isRecording ? DrumView.COLOR_RECORD : DrumView.COLOR_PLAY;
    // Selected?
    if (this.selectedPad == index)
        return DrumView.COLOR_SELECTED;
    // Exists and active?
    var drumPad = primary.getDrumPad (index);
    if (!drumPad.exists || !drumPad.activated)
        return DrumView.COLOR_NO_CONTENT;
    // Muted or soloed?
    if (drumPad.mute || (isSoloed && !drumPad.solo))
        return DrumView.COLOR_MUTED;
    return this.surface.isMkII () && drumPad.color ? drumPad.color : DrumView.COLOR_HAS_CONTENT;
};

DrumView.prototype.clearPressedKeys = function ()
{
    for (var i = 0; i < 128; i++)
        this.pressedKeys[i] = 0;
};