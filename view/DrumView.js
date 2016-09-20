// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DrumView (model)
{
    AbstractDrumView.call (this, model, 2, 3);
}
DrumView.prototype = new AbstractDrumView ();

DrumView.prototype.getPadContentColor = function (drumPad)
{
    return this.surface.isMkII () && drumPad.color ? drumPad.color : AbstractDrumView.COLOR_HAS_CONTENT;
};

DrumView.prototype.playNote = function (note, velocity)
{
	this.surface.sendMidiEvent (0x90, note, velocity);
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

DrumView.prototype.updateSceneButtons = function ()
{
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_1, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_2, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_3, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_4, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_5, APC_BUTTON_STATE_ON);
};
