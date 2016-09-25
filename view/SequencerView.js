// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractNoteSequencerView.NUM_DISPLAY_ROWS   = 5;
AbstractNoteSequencerView.NUM_SEQUENCER_ROWS = 4;
AbstractNoteSequencerView.NUM_OCTAVE         = 4;

function SequencerView (model)
{
    AbstractNoteSequencerView.call (this, model);
}
SequencerView.prototype = new AbstractNoteSequencerView ();

SequencerView.prototype.updateSceneButtons = function ()
{
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_1, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_2, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_3, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_4, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_5, APC_BUTTON_STATE_ON);
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

SequencerView.prototype.updateNoteMapping = function ()
{
    AbstractSequencerView.prototype.updateNoteMapping.call (this);
    this.updateScale ();
};
