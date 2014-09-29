// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

CLIP_LENGTHS = [ '1 Beat', '2 Beats', '1 Bar', '2 Bars', '4 Bars', '8 Bars', '16 Bars', '32 Bars' ];
CLIP_LENGTHS_INDICES = [ 6, 5, 4, 3, 2, 1, 0, 7 ];

AbstractView.prototype.stopPressed = false;
AbstractView.prototype.isTempoInc = false;
AbstractView.prototype.isTempoDec = false;
AbstractView.prototype.isKnobMoving = false;
AbstractView.prototype.moveStartTime = 0;

AbstractView.prototype.usesButton = function (buttonID)
{
    switch (buttonID)
    {
        case APC_BUTTON_STOP_ALL_CLIPS:
        case APC_BUTTON_CLIP_STOP:
        case APC_BUTTON_CLIP_LAUNCH_1:
        case APC_BUTTON_CLIP_LAUNCH_2:
        case APC_BUTTON_CLIP_LAUNCH_3:
        case APC_BUTTON_CLIP_LAUNCH_4:
        case APC_BUTTON_CLIP_LAUNCH_5:
        case APC_BUTTON_SCENE_LAUNCH_1:
        case APC_BUTTON_SCENE_LAUNCH_2:
        case APC_BUTTON_SCENE_LAUNCH_3:
        case APC_BUTTON_SCENE_LAUNCH_4:
        case APC_BUTTON_SCENE_LAUNCH_5:
            return false;
    }
    return true;
};

//--------------------------------------
// Transport
//--------------------------------------

AbstractView.prototype.onPlay = function (event)
{
    if (!event.isDown ())
        return;
    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleLoop ();
    else
    {
        if (!this.restartFlag)
        {
            this.model.getTransport ().play ();
            this.doubleClickTest ();
        }
        else
        {
            this.model.getTransport ().stopAndRewind ();
            this.restartFlag = false;
        }
    }
};

AbstractView.prototype.onStop = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().stop ();
};

AbstractView.prototype.onRecord = function (event)
{
    if (!event.isDown ())
        return;
    
    if (this.surface.isShiftPressed ())
        this.onFootswitch2 (127);
    else
        this.model.getTransport ().record ();
};

//--------------------------------------
// Navigation
//--------------------------------------

AbstractView.prototype.onTempo = function (increase)
{
    this.model.getTransport ().changeTempo (increase, this.surface.isShiftPressed ());
};

AbstractView.prototype.onNudge = function (isPlus, event)
{
    if (isPlus)
    {
        if (event.isDown ())
            this.isTempoInc = true;
        else if (event.isUp ())
            this.isTempoInc = false;
    }
    else
    {
        if (event.isDown ())
            this.isTempoDec = true;
        else if (event.isUp ())
            this.isTempoDec = false;
    }
    this.doChangeTempo ();
};

AbstractView.prototype.doChangeTempo = function ()
{
    if (!this.isTempoInc && !this.isTempoDec)
        return;
    this.model.getTransport ().changeTempo (this.isTempoInc, this.surface.isShiftPressed ());
    scheduleTask (doObject (this, function ()
    {
        this.doChangeTempo ();
    }), null, 200);
};

AbstractView.prototype.onCueLevel = function (value)
{
    this.model.getTransport ().changePosition (value < 65, this.surface.isShiftPressed ());
};

AbstractView.prototype.onShift = function (event) {};

//--------------------------------------
// Track
//--------------------------------------

AbstractView.prototype.onSelectTrack = function (index, event)
{
    if (!event.isDown ())
        return;
        
    if (this.surface.isPressed (APC_BUTTON_SEND_A))
        this.surface.setPendingMode (MODE_SEND1 + index);
    else if (this.surface.isShiftPressed ())
    {
        index = CLIP_LENGTHS_INDICES[index];
        displayNotification (CLIP_LENGTHS[index]);
        this.model.getCurrentTrackBank ().setNewClipLength (index);
    }
    else
        this.model.getCurrentTrackBank ().select (index);
};

AbstractView.prototype.onActivator = function (index, event)
{
    if (event.isDown ())
        this.model.getCurrentTrackBank ().toggleMute (index);
};

AbstractView.prototype.onSolo = function (index, event)
{
    if (event.isDown ())
        this.model.getCurrentTrackBank ().toggleSolo (index);
};

AbstractView.prototype.onRecArm = function (index, event)
{
    if (event.isDown ())
        this.model.getCurrentTrackBank ().toggleArm (index);
};

AbstractView.prototype.onAorB = function (channel, event)
{
    if (event.isDown ())
        this.model.getCurrentTrackBank ().toggleCrossfadeMode (channel);
};

AbstractView.prototype.onVolume = function (index, value)
{
    this.model.getCurrentTrackBank ().setVolume (index, value);
};

AbstractView.prototype.onPan = function (event)
{
    if (event.isDown ())
        this.surface.setPendingMode (MODE_PAN);
};
     
AbstractView.prototype.onSend = function (sendIndex, event)
{
    if (!event.isDown ())
        return;
     
    // No Sends on FX tracks
    if (this.model.isEffectTrackBankActive ())
        return;
    this.surface.setPendingMode (MODE_SEND1 + (sendIndex + (this.surface.isShiftPressed () ? 3 : 0)));
};

AbstractView.prototype.onUser = function (event)
{
    if (!event.isDown ())
        return;

    this.surface.setPendingMode (MODE_MACRO);
};

AbstractView.prototype.onCrossfader = function (value)
{
    this.model.getTransport ().setCrossfade (value);
};

AbstractView.prototype.onMasterVolume = function (value)
{
    this.model.getMasterTrack ().setVolume (value);
};

AbstractView.prototype.onMaster = function (event)
{
    if (event.isDown ())
        this.model.getMasterTrack ().select ();
};

AbstractView.prototype.onBank = function (event)
{
    if (!event.isDown ())
        return;
    this.model.toggleCurrentTrackBank ();
    if (this.model.isEffectTrackBankActive ())
    {
        // No Sends on effect tracks
        var mode = this.surface.getCurrentMode ();
        if (mode >= MODE_SEND1 && mode <= MODE_SEND8)
            this.surface.setPendingMode (MODE_PAN);
    }
};

//--------------------------------------
// Device
//--------------------------------------

AbstractView.prototype.onDeviceOnOff = function (event)
{
    if (event.isDown ())
        this.model.getCursorDevice ().toggleEnabledState ();
};

AbstractView.prototype.onDeviceValueKnob = function (index, value)
{
    var cd = this.model.getCursorDevice ();
    var param = cd.getFXParam (index);
    param.value = value;
    cd.setParameter (index, param.value);
    
    this.moveStartTime = new Date ().getTime ();
    if (this.isKnobMoving)
        return;

    this.isKnobMoving = true;
    this.startCheckKnobMovement ();
};

AbstractView.prototype.onDeviceLeft = function (event)
{
    if (!event.isDown ())
        return;

    if (this.surface.isShiftPressed ())
        this.model.getCursorDevice ().previousParameterPage ();
    else
        this.model.getCursorDevice ().selectPrevious ();
};

AbstractView.prototype.onDeviceRight = function (event)
{
    if (!event.isDown ())
        return;
    if (this.surface.isShiftPressed ())
        this.model.getCursorDevice ().nextParameterPage ();
    else
        this.model.getCursorDevice ().selectNext ();
};

AbstractView.prototype.onClipTrack = function (event)
{
    if (event.isDown ())
        this.model.getApplication ().toggleDevices ();
};


//--------------------------------------
// Further buttons
//--------------------------------------

AbstractView.prototype.onTapTempo = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().tapTempo ();
};

AbstractView.prototype.onMetronome = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().toggleClick ();
};

AbstractView.prototype.onMidiOverdub = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().toggleLauncherOverdub ();
};

AbstractView.prototype.onQuantize = function (event)
{
    if (event.isDown ())
        this.model.getApplication ().quantize ();
};

AbstractView.prototype.onDetailView = function (event)
{
    if (!event.isDown ())
        return;
        
    var app = this.model.getApplication ();
    switch (app.perspective)
    {
        case 'ARRANGE':
            app.setPerspective ('MIX');
            break;
        case 'MIX':
            app.setPerspective ('EDIT');
            break;
        case 'EDIT':
            app.setPerspective ('ARRANGE');
            break;
    }
};

//--------------------------------------
// Clips
//--------------------------------------

AbstractView.prototype.onStopAllClips = function (event)
{
    if (event.isDown ())
        this.model.getCurrentTrackBank ().getClipLauncherScenes ().stop ();
};

AbstractView.prototype.onClipStop = function (channel, event)
{
    if (event.isDown ())
    {
        if (this.surface.isShiftPressed ())
            this.model.getCurrentTrackBank ().returnToArrangement (channel);
        else
            this.model.getCurrentTrackBank ().stop (channel);
        this.surface.setButtonEx (APC_BUTTON_CLIP_STOP, channel, APC_BUTTON_STATE_ON);
    }
    else if (event.isUp ())
        this.surface.setButtonEx (APC_BUTTON_CLIP_STOP, channel, APC_BUTTON_STATE_OFF);
};

//--------------------------------------
// Footswitch
//--------------------------------------

AbstractView.prototype.onFootswitch1 = function (value) {};

AbstractView.prototype.onFootswitch2 = function (value)
{
    if (value != 127)
        return;
    var tb = this.model.getCurrentTrackBank ();
    var t = tb.getSelectedTrack ();
    if (t != null)
    {
        var slotIndex = this.getSelectedSlot (t);
        if (slotIndex == -1)
            slotIndex = 0;
            
        for (var i = 0; i < 8; i++)
        {
            var sIndex = (slotIndex + i) % 8;
            var s = t.slots[sIndex];
            if (!s.hasContent)
            {
                var slots = tb.getClipLauncherSlots (t.index);
                slots.createEmptyClip (sIndex, Math.pow (2, tb.getNewClipLength ()));
                if (slotIndex != sIndex)
                    slots.select (sIndex);
                slots.launch (sIndex);
                this.model.getTransport ().setLauncherOverdub (true);
                return;
            }
        }
    }
    displayNotification ("In the current selected grid view there is no empty slot. Please scroll down.");
};

//--------------------------------------
// Protected API
//--------------------------------------

AbstractView.prototype.getSelectedSlot = function (track)
{
    for (var i = 0; i < track.slots.length; i++)
        if (track.slots[i].isSelected)
            return i;
    return -1;
};

AbstractView.prototype.checkKnobMovement = function ()
{
    if (!this.isKnobMoving)
        return;
    if (new Date ().getTime () - this.moveStartTime > 200)
        this.isKnobMoving = false;
    else
        this.startCheckKnobMovement ();
};

AbstractView.prototype.startCheckKnobMovement = function ()
{
    scheduleTask (doObject (this, function ()
    {
        this.checkKnobMovement ();
    }), [], 100);
};
