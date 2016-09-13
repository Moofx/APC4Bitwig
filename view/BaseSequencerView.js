// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Note: Overwrite these with your specific controller colors
BaseSequencerView.COLOR_SELECTED_RESOLUTION_OFF = 0;
BaseSequencerView.COLOR_SELECTED_RESOLUTION_ON  = 1;

function BaseSequencerView (model, rows, cols)
{
    if (!model) // Called on first prototype creation
        return;
    AbstractSequencerView.call (this, model, rows, cols);
}
BaseSequencerView.prototype = new AbstractSequencerView ();

BaseSequencerView.prototype.onActivate = function ()
{
    AbstractSequencerView.prototype.onActivate.call (this);
    this.model.getCurrentTrackBank ().setIndication (false);
};

BaseSequencerView.prototype.onClipStop = function (channel, event)
{
    if (!event.isDown ())
        return;
    this.selectedIndex = channel;
    this.clip.setStepLength (this.resolutions[this.selectedIndex]);
    displayNotification (this.resolutionsStr[this.selectedIndex]);
};

BaseSequencerView.prototype.updateSceneButtons = function ()
{
    if (this.model.canSelectedTrackHoldNotes ())
    {
        for (var i = 0; i < 8; i++)
            this.surface.updateButtonEx (APC_BUTTON_CLIP_STOP, i, i == this.selectedIndex ? BaseSequencerView.COLOR_SELECTED_RESOLUTION_ON : BaseSequencerView.COLOR_SELECTED_RESOLUTION_OFF);
    }
    else
    {
        for (var i = 0; i < 8; i++)
            this.surface.updateButtonEx (APC_BUTTON_CLIP_STOP, i, BaseSequencerView.COLOR_SELECTED_RESOLUTION_OFF);
    }
};
