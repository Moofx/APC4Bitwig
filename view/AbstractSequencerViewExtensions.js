// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Note: Overwrite these with your specific controller colors
AbstractSequencerView.COLOR_SELECTED_RESOLUTION_OFF = 0;
AbstractSequencerView.COLOR_SELECTED_RESOLUTION_ON  = 1;

AbstractSequencerView.prototype.onActivate = function ()
{
    AbstractView.prototype.onActivate.call (this);
    this.model.getCurrentTrackBank ().setIndication (false);
};

AbstractSequencerView.prototype.onClipStop = function (channel, event)
{
    if (!event.isDown ())
        return;
    this.selectedIndex = channel;
    this.clip.setStepLength (this.resolutions[this.selectedIndex]);
    displayNotification (this.resolutionsStr[this.selectedIndex]);
};

AbstractSequencerView.prototype.updateSceneButtons = function ()
{
    if (this.model.canSelectedTrackHoldNotes ())
    {
        for (var i = 0; i < 8; i++)
            this.surface.updateButtonEx (APC_BUTTON_CLIP_STOP, i, i == this.selectedIndex ? AbstractSequencerView.COLOR_SELECTED_RESOLUTION_ON : AbstractSequencerView.COLOR_SELECTED_RESOLUTION_OFF);
    }
    else
    {
        for (var i = 0; i < 8; i++)
            this.surface.updateButtonEx (APC_BUTTON_CLIP_STOP, i, AbstractSequencerView.COLOR_SELECTED_RESOLUTION_OFF);
    }
};
