// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PlayView (model)
{
    if (model == null)
        return;
    
    AbstractPlayView.call (this, model);
}
PlayView.prototype = new AbstractPlayView ();

PlayView.prototype.onActivate = function ()
{
    AbstractPlayView.prototype.onActivate.call (this);
    this.initMaxVelocity ();
};

PlayView.prototype.onGridNote = function (note, velocity)
{
    if (!this.model.canSelectedTrackHoldNotes () || this.noteMap[note] == -1)
        return;
    // Mark selected notes
    if (this.noteMap[note] != -1)
    {
        this.setPressedKeys (this.noteMap[note], true, velocity);
        this.surface.sendMidiEvent (0x90, this.noteMap[note], velocity);
    }
};

PlayView.prototype.scrollUp = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyLeft ();
    else
        this.model.getApplication ().arrowKeyUp ();
};

PlayView.prototype.scrollDown = function (event)
{
    if (this.surface.isShiftPressed ())
        this.model.getApplication ().arrowKeyRight ();
    else
        this.model.getApplication ().arrowKeyDown ();
};

PlayView.prototype.updateSceneButtons = function ()
{
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_1, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_2, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_3, APC_BUTTON_STATE_OFF);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_4, APC_BUTTON_STATE_ON);
    this.surface.updateButton (APC_BUTTON_SCENE_LAUNCH_5, APC_BUTTON_STATE_ON);
};

PlayView.prototype.updateArrows = function ()
{
    var tb = this.model.getCurrentTrackBank ();
    var sel = tb.getSelectedTrack ();
    this.canScrollLeft = sel != null && sel.index > 0 || tb.canScrollTracksUp ();
    this.canScrollRight = sel != null && sel.index < 7 || tb.canScrollTracksDown ();

    AbstractView.prototype.updateArrows.call (this);
};

PlayView.prototype.onScene = function (scene, event)
{
    if (!event.isDown ())
        return;
    if (!this.model.canSelectedTrackHoldNotes ())
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
            this.onOctaveUp (event);
            break;
        case 4:
            this.onOctaveDown (event);
            break;
    }
    this.updateNoteMapping ();
};

PlayView.prototype.onAccent = function (event)
{
    AbstractView.prototype.onAccent.call (this, event);
    if (event.isUp ())
        this.initMaxVelocity ();
};

PlayView.prototype.initMaxVelocity = function ()
{
    this.maxVelocity = initArray (Config.fixedAccentValue, 128);
    this.maxVelocity[0] = 0;
    this.surface.setVelocityTranslationTable (Config.accentActive ? this.maxVelocity : this.defaultVelocity);
};
