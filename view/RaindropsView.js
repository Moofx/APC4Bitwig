// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractRaindropsView.NUM_DISPLAY_ROWS = 5;

function RaindropsView (model)
{
    AbstractRaindropsView.call (this, model);
}
RaindropsView.prototype = new AbstractRaindropsView ();

RaindropsView.prototype.onScene = function (index, event)
{
    if (!event.isDown ())
        return;

    this.ongoingResolutionChange = true;

    switch (index)
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
            this.scrollRight (event);
            break;
        case 4:
            this.scrollLeft (event);
            break;
    }
    this.updateNoteMapping ();
    
    this.ongoingResolutionChange = false;    
};

RaindropsView.prototype.onOctaveDown = function (event)
{
    if (event.isDown ())
        this.scrollDown (event);
};

RaindropsView.prototype.onOctaveUp = function (event)
{
    if (event.isDown ())
        this.scrollUp (event);
};

RaindropsView.prototype.updateSceneButtons = function ()
{
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_1, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_2, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_3, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_4, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_5, APC_BUTTON_STATE_ON);
};
