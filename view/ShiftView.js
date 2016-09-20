// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

ShiftView.TRANSLATE = [ 0, 2, 4, 6, 1, 3, 5, -1, -1, 10, 8, -1, 11, 9, 7, -1 ];


function ShiftView (model)
{
    if (model == null)
        return;
    
    AbstractView.call (this, model);
}
ShiftView.prototype = new AbstractView ();

ShiftView.prototype.onActivate = function ()
{
    AbstractView.prototype.onActivate.call (this);

//    this.model.getCurrentTrackBank ().setIndication (false);
//    this.updateSceneButtons ();
//    this.updateIndication ();
};

ShiftView.prototype.drawGrid = function ()
{
    // Draw the keyboard
    var scaleOffset = this.model.getScales ().getScaleOffset ();
    // 0'C', 1'G', 2'D', 3'A', 4'E', 5'B', 6'F', 7'Bb', 8'Eb', 9'Ab', 10'Db', 11'Gb'
    for (var i = 7; i < 64; i++)
        this.surface.pads.light (36 + i, APC_COLOR_BLACK);
    this.surface.pads.light (36 + 0, scaleOffset == 0 ? AbstractView.KEY_SELECTED : AbstractView.KEY_WHITE);
    this.surface.pads.light (36 + 1, scaleOffset == 2 ? AbstractView.KEY_SELECTED : AbstractView.KEY_WHITE);
    this.surface.pads.light (36 + 2, scaleOffset == 4 ? AbstractView.KEY_SELECTED : AbstractView.KEY_WHITE);
    this.surface.pads.light (36 + 3, scaleOffset == 6 ? AbstractView.KEY_SELECTED : AbstractView.KEY_WHITE);
    this.surface.pads.light (36 + 4, scaleOffset == 1 ? AbstractView.KEY_SELECTED : AbstractView.KEY_WHITE);
    this.surface.pads.light (36 + 5, scaleOffset == 3 ? AbstractView.KEY_SELECTED : AbstractView.KEY_WHITE);
    this.surface.pads.light (36 + 6, scaleOffset == 5 ? AbstractView.KEY_SELECTED : AbstractView.KEY_WHITE);
    this.surface.pads.light (36 + 9, scaleOffset == 10 ? AbstractView.KEY_SELECTED : AbstractView.KEY_BLACK);
    this.surface.pads.light (36 + 10, scaleOffset == 8 ? AbstractView.KEY_SELECTED : AbstractView.KEY_BLACK);
    this.surface.pads.light (36 + 12, scaleOffset == 11 ? AbstractView.KEY_SELECTED : AbstractView.KEY_BLACK);
    this.surface.pads.light (36 + 13, scaleOffset == 9 ? AbstractView.KEY_SELECTED : AbstractView.KEY_BLACK);
    this.surface.pads.light (36 + 14, scaleOffset == 7 ? AbstractView.KEY_SELECTED : AbstractView.KEY_BLACK);
};

ShiftView.prototype.onGridNote = function (note, velocity)
{
    if (velocity == 0)
        return;

    var index = note - 36;
    if (index > 15)
        return;
    // Scale Base note selection
    var pos = AbstractView.TRANSLATE[index];
    if (pos == -1)
        return;
    this.model.getScales ().setScaleOffset (pos);
    Config.setScaleBase (Scales.BASES[pos]);
    displayNotification (Scales.BASES[pos]);
    this.surface.getActiveView ().updateNoteMapping ();
};

ShiftView.prototype.onPlay = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().toggleLoop ();
};

ShiftView.prototype.onRecord = function (event)
{
    if (event.isDown ())
        this.onFootswitch2 (127);
};

ShiftView.prototype.onScene = function (index, event)
{
    if (!event.isDown ())
        return;
    var viewID = VIEW_SESSION + index;
    if (viewID != VIEW_SESSION)
        this.model.getCurrentTrackBank ().setPreferredView (viewID);
    this.surface.previousViewId = viewID;
    // Refresh mode button lights
    this.surface.setPendingMode (this.surface.getCurrentMode ());
};

ShiftView.prototype.updateSceneButtons = function ()
{
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_1, this.surface.previousViewId == VIEW_SESSION   ? AbstractView.VIEW_SELECTED : AbstractView.VIEW_UNSELECTED);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_2, this.surface.previousViewId == VIEW_PLAY      ? AbstractView.VIEW_SELECTED : AbstractView.VIEW_UNSELECTED);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_3, this.surface.previousViewId == VIEW_DRUM      ? AbstractView.VIEW_SELECTED : AbstractView.VIEW_UNSELECTED);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_4, this.surface.previousViewId == VIEW_SEQUENCER ? AbstractView.VIEW_SELECTED : AbstractView.VIEW_UNSELECTED);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_5, this.surface.previousViewId == VIEW_RAINDROPS ? AbstractView.VIEW_SELECTED : AbstractView.VIEW_UNSELECTED);
};
