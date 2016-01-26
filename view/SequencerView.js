// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

SequencerView.NUM_DISPLAY_ROWS = 8;
SequencerView.NUM_DISPLAY_COLS = 8;
SequencerView.NUM_OCTAVE       = 12;
SequencerView.START_KEY        = 36;

function SequencerView (model)
{
    AbstractSequencerView.call (this, model, 128, SequencerView.NUM_DISPLAY_COLS);
    this.offsetY = SequencerView.START_KEY;
    this.clip.scrollTo (0, SequencerView.START_KEY);
}
SequencerView.prototype = new AbstractSequencerView ();

SequencerView.prototype.onActivate = function ()
{
    this.updateScale ();
    AbstractSequencerView.prototype.onActivate.call (this);
};

SequencerView.prototype.drawSceneButtons = function ()
{
    if (this.surface.isShiftPressed ())
    {
        AbstractView.prototype.drawSceneButtons.call (this);
        return;
    }
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_1, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_2, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_3, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_4, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_5, APC_BUTTON_STATE_ON);
};

SequencerView.prototype.updateArrows = function ()
{
    this.canScrollUp = this.offsetY + SequencerView.NUM_OCTAVE <= this.clip.getRowSize () - SequencerView.NUM_OCTAVE;
    this.canScrollDown = this.offsetY - SequencerView.NUM_OCTAVE >= 0;
    this.canScrollLeft = this.offsetX > 0;
    this.canScrollRight = true; // TODO We do not know the number of steps
    AbstractSequencerView.prototype.updateArrows.call (this);
    this.drawSceneButtons ();
};

SequencerView.prototype.updateNoteMapping = function ()
{
    AbstractSequencerView.prototype.updateNoteMapping.call (this);
    this.updateScale ();
};

SequencerView.prototype.updateScale = function ()
{
    this.noteMap = this.canSelectedTrackHoldNotes () ? this.scales.getSequencerMatrix (SequencerView.NUM_DISPLAY_ROWS, this.offsetY) : this.scales.getEmptyMatrix ();
};

SequencerView.prototype.onScene = function (scene, event)
{
    if (!event.isDown ())
        return;
    switch (scene)
    {
        case 0:
            this.scales.nextScale ();
            Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
            displayNotification (this.scales.getName (this.scales.getSelectedScale ()));
            break;
        case 1:
            this.scales.prevScale ();
            Config.setScale (this.scales.getName (this.scales.getSelectedScale ()));
            displayNotification (this.scales.getName (this.scales.getSelectedScale ()));
            break;
		case 2:
			this.scales.toggleChromatic ();
			var isChromatic = this.scales.isChromatic ();
			Config.setScaleInScale (!isChromatic);
            displayNotification (isChromatic ? "Chromatic" : "In Key");
			break;
        case 3:
            this.scrollUp (event);
            break;
        case 4:
            this.scrollDown (event);
            break;
    }
    this.updateNoteMapping ();
};

SequencerView.prototype.scrollUp = function (event)
{
    this.updateOctave (Math.min (this.clip.getRowSize () - SequencerView.NUM_OCTAVE, this.offsetY + 5));
};

SequencerView.prototype.scrollDown = function (event)
{
    this.updateOctave (Math.max (0, this.offsetY - 5));
};

SequencerView.prototype.updateOctave = function (value)
{
    this.offsetY = value;
    this.updateScale ();
    displayNotification (this.scales.getSequencerRangeText (this.noteMap[0], this.noteMap[6]));
};

SequencerView.prototype.onGridNote = function (note, velocity)
{
    if (this.surface.isShiftPressed ())
    {
        this.onShiftGridNote (note, velocity);
        return;
    }

    if (!this.canSelectedTrackHoldNotes ())
        return;
    if (velocity == 0)
        return;
    var index = note - 36;
    var x = index % 8;
    var y = Math.floor (index / 8);
    this.clip.toggleStep (x, this.noteMap[y], Config.accentActive ? Config.fixedAccentValue : velocity);
};

SequencerView.prototype.drawGrid = function ()
{
    if (this.surface.isShiftPressed ())
    {
        this.drawShiftGrid ();
        return;
    }

    var isKeyboardEnabled = this.canSelectedTrackHoldNotes ();
    var step = this.clip.getCurrentStep ();
    var hiStep = this.isInXRange (step) ? step % SequencerView.NUM_DISPLAY_COLS : -1;
    for (var x = 0; x < SequencerView.NUM_DISPLAY_COLS; x++)
    {
        for (var y = 0; y < SequencerView.NUM_DISPLAY_ROWS; y++)
        {
            var row = this.noteMap[y];
            var isSet = this.clip.getStep (x, row);
            var hilite = x == hiStep;
            if (isKeyboardEnabled)
                this.surface.pads.lightEx (x, 4 - y, isSet ? (hilite ? AbstractSequencerView.COLOR_STEP_HILITE_CONTENT : AbstractSequencerView.COLOR_CONTENT) : hilite ? AbstractSequencerView.COLOR_STEP_HILITE_NO_CONTENT : this.scales.getColor (this.noteMap, y), null, false);
            else
                this.surface.pads.lightEx (x, 4 - y, AbstractSequencerView.COLOR_NO_CONTENT, null, false);
        }
    }
};
