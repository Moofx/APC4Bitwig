// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

Scales.OCTAVE_RANGE = 5;


function Controller (product)
{
    Config.init ();

    this.initButtonCache ();
    
    var output = new MidiOutput ();
    var input = new APCMidiInput ();
    
    this.scales = new Scales (36, 100, 8, 5);
    setModelSpecificColors (product);
    this.model = new Model (1, this.scales, 8, 5, 8, 6, 16, 16, true);
    
    // this.lastSlotSelection = null;
    this.model.getTrackBank ().addTrackSelectionListener (doObject (this, Controller.prototype.handleTrackChange));
    
    this.surface = new APC (output, input, product);
    var i;
    for (i = 0; i < 8; i++)
        this.surface.setLED (APC_KNOB_DEVICE_KNOB_LED_1 + i, 1);

    this.surface.setDefaultMode (MODE_PAN);

    this.surface.addMode (MODE_PAN, new PanMode (this.model));
    for (i = 0; i < 8; i++)
        this.surface.addMode (MODE_SEND1 + i, new SendMode (this.model, i));
    this.surface.addMode (MODE_MACRO, new MacroMode (this.model));
    this.surface.addMode (MODE_BROWSER, new BrowserMode (this.model));

    this.surface.addModeListener (doObject (this, function (oldMode, newMode)
    {
        this.updateMode (-1);
        this.updateMode (newMode);
    }));
    
    Config.addPropertyListener (Config.SCALES_SCALE, doObject (this, function ()
    {
        this.scales.setScaleByName (Config.scale);
        this.surface.getActiveView ().updateNoteMapping ();
    }));
    Config.addPropertyListener (Config.SCALES_BASE, doObject (this, function ()
    {
        this.scales.setScaleOffsetByName (Config.scaleBase);
        this.surface.getActiveView ().updateNoteMapping ();
    }));
    Config.addPropertyListener (Config.SCALES_IN_KEY, doObject (this, function ()
    {
        this.scales.setChromatic (!Config.scaleInKey);
        var view = this.surface.getActiveView ();
        if (view != null)
            view.updateNoteMapping ();
    }));

    this.surface.addView (VIEW_PLAY, new PlayView (this.model));
    this.surface.addView (VIEW_SESSION, new SessionView (this.model));
    this.surface.addView (VIEW_SEQUENCER, new SequencerView (this.model));
    this.surface.addView (VIEW_DRUM, new DrumView (this.model));
    this.surface.addView (VIEW_RAINDROPS, new RaindropsView (this.model));
    
    this.surface.setActiveView (VIEW_SESSION);
    this.surface.setPendingMode (MODE_PAN);
}
Controller.prototype = new AbstractController ();

Controller.prototype.flush = function ()
{
    AbstractController.prototype.flush.call (this);
    
    var isShift = this.surface.isShiftPressed ();

    var t = this.model.getTransport ();
    this.updateButton (APC_BUTTON_PLAY, t.isPlaying ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
    this.updateButton (APC_BUTTON_RECORD, t.isRecording ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);

    // Activator, Solo, Record Arm
    var tb = this.model.getCurrentTrackBank ();
    var selTrack = tb.getSelectedTrack ();
    var selIndex = selTrack == null ? -1 : selTrack.index;
    var isMkII = this.surface.isMkII ();
    for (var i = 0; i < 8; i++)
    {
        var track = tb.getTrack (i);
        this.updateChannelButton (APC_BUTTON_TRACK_SELECTION, i, i == selIndex ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.updateChannelButton (APC_BUTTON_SOLO, i, track.exists && (isShift ? track.autoMonitor : track.solo) ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.updateChannelButton (APC_BUTTON_ACTIVATOR, i, track.exists && (isShift ? track.monitor : !track.mute) ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);

        if (isMkII)
        {
            this.updateChannelButton (APC_BUTTON_A_B, i, track.exists && track.crossfadeMode != 'AB' ? (track.crossfadeMode == 'A' ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_BLINK) : APC_BUTTON_STATE_OFF);
            this.updateChannelButton (APC_BUTTON_RECORD_ARM, i, track.exists && track.recarm ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        }
        else
        {
            if (isShift)
                this.updateChannelButton (APC_BUTTON_RECORD_ARM, i, track.exists && track.crossfadeMode != 'AB' ? (track.crossfadeMode == 'A' ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_BLINK) : APC_BUTTON_STATE_OFF);
            else
                this.updateChannelButton (APC_BUTTON_RECORD_ARM, i, track.exists && track.recarm ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        }
    }
    this.updateButton (APC_BUTTON_MASTER, this.model.getMasterTrack ().isSelected () ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
    
    var device = this.model.getCursorDevice ();

    if (isMkII)
    {
        this.updateButton (APC_BUTTON_SESSION, t.isLauncherOverdub ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_SEND_C, t.isClickOn ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        
        this.updateButton (APC_BUTTON_DETAIL_VIEW, device.getSelectedDevice ().enabled ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_REC_QUANT, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_MIDI_OVERDUB, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_METRONOME, APC_BUTTON_STATE_OFF);
        
        this.updateButton (APC_BUTTON_CLIP_TRACK, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_DEVICE_ON_OFF, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_DEVICE_LEFT, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_DEVICE_RIGHT, APC_BUTTON_STATE_OFF);
        
        this.updateButton (APC_BUTTON_BANK, this.model.isEffectTrackBankActive () ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
    }
    else
    {
        this.updateButton (APC_BUTTON_DETAIL_VIEW, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_REC_QUANT, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_MIDI_OVERDUB, t.isLauncherOverdub ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_METRONOME, t.isClickOn ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        
        this.updateButton (APC_BUTTON_CLIP_TRACK, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_DEVICE_ON_OFF, device.getSelectedDevice ().enabled ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_DEVICE_LEFT, APC_BUTTON_STATE_OFF);
        this.updateButton (APC_BUTTON_DEVICE_RIGHT, APC_BUTTON_STATE_OFF);
    }
    
    this.updateDeviceKnobs ();
};

Controller.prototype.updateMode = function (mode)
{
    this.updateIndication (mode);
    if (this.surface.isMkII ())
    {
        this.surface.setButton (APC_BUTTON_PAN, mode == MODE_PAN ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.surface.setButton (APC_BUTTON_SEND_A, mode >= MODE_SEND1 && mode <= MODE_SEND8 ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.surface.setButton (APC_BUTTON_SEND_B, mode == MODE_MACRO ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
    }
    else
    {
        this.surface.setButton (APC_BUTTON_PAN, mode == MODE_PAN || mode == MODE_MACRO ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.surface.setButton (APC_BUTTON_SEND_A, mode == MODE_SEND1 || mode == MODE_SEND4 ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.surface.setButton (APC_BUTTON_SEND_B, mode == MODE_SEND2 || mode == MODE_SEND5 ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
        this.surface.setButton (APC_BUTTON_SEND_C, mode == MODE_SEND3 || mode == MODE_SEND6 ? APC_BUTTON_STATE_ON : APC_BUTTON_STATE_OFF);
    }        
};

Controller.prototype.updateIndication = function (mode)
{
    var isPan = mode == MODE_PAN;
    
    var tb = this.model.getCurrentTrackBank ();
    var cd = this.model.getCursorDevice ();
    for (var i = 0; i < 8; i++)
    {
        tb.setPanIndication (i, isPan);
        for (var j = 0; j < 8; j++)
        {
            tb.setSendIndication (i, j, mode == MODE_SEND1 && j == 0 ||
                                        mode == MODE_SEND2 && j == 1 ||
                                        mode == MODE_SEND3 && j == 2 ||
                                        mode == MODE_SEND4 && j == 3 ||
                                        mode == MODE_SEND5 && j == 4 ||
                                        mode == MODE_SEND6 && j == 5 ||
                                        mode == MODE_SEND7 && j == 6 ||
                                        mode == MODE_SEND8 && j == 7);
        }
        cd.getParameter (i).setIndication (!this.surface.isMacroActive);
        cd.getMacro (i).getAmount ().setIndication (this.surface.isMacroActive || mode == MODE_MACRO);
    }
};

Controller.prototype.updateDeviceKnobs = function ()
{
    var view = this.surface.getActiveView ();
    if (view == null || view.isKnobMoving)
        return;

    var cd = this.model.getCursorDevice ();
    for (var i = 0; i < 8; i++)
    {
        var value = this.surface.isMacroActive ? cd.getMacroParam (i).value : cd.getFXParam (i).value;
        this.surface.setLED (APC_KNOB_DEVICE_KNOB_1 + i, value ? value : 0);
    }
};

Controller.prototype.handleTrackChange = function (index, isSelected)
{
    var tb = this.model.getCurrentTrackBank ();
    if (!isSelected)
        return;

    // Recall last used view (if we are not in session mode)
    if (!this.surface.isActiveView (VIEW_SESSION))
    {
        var viewID = tb.getPreferredView (index);
        this.surface.setActiveView (viewID == null ? VIEW_PLAY : viewID);
    }

    if (this.surface.isActiveView (VIEW_PLAY))
        this.surface.getActiveView ().updateNoteMapping ();
};

Controller.prototype.initButtonCache = function ()
{
    this.buttonCache = [];
    this.buttonCache[APC_BUTTON_PLAY] = -1;
    this.buttonCache[APC_BUTTON_RECORD] = -1;
    this.buttonCache[APC_BUTTON_TRACK_SELECTION] = new Array ();
    this.buttonCache[APC_BUTTON_SOLO] = new Array ();
    this.buttonCache[APC_BUTTON_ACTIVATOR] = new Array ();
    this.buttonCache[APC_BUTTON_A_B] = new Array ();
    this.buttonCache[APC_BUTTON_RECORD_ARM] = new Array ();
    for (var i = 0; i < 8; i++)
    {
        this.buttonCache[APC_BUTTON_TRACK_SELECTION][i] = -1;
        this.buttonCache[APC_BUTTON_SOLO][i] = -1;
        this.buttonCache[APC_BUTTON_ACTIVATOR][i] = -1;
        this.buttonCache[APC_BUTTON_A_B][i] = -1;
        this.buttonCache[APC_BUTTON_RECORD_ARM][i] = -1;
    }
    this.buttonCache[APC_BUTTON_MASTER] = -1;
    this.buttonCache[APC_BUTTON_DETAIL_VIEW] = -1;
    this.buttonCache[APC_BUTTON_REC_QUANT] = -1;
    this.buttonCache[APC_BUTTON_MIDI_OVERDUB] = -1;
    this.buttonCache[APC_BUTTON_METRONOME] = -1;
    this.buttonCache[APC_BUTTON_CLIP_TRACK] = -1;
    this.buttonCache[APC_BUTTON_DEVICE_ON_OFF] = -1;
    this.buttonCache[APC_BUTTON_DEVICE_LEFT] = -1;
    this.buttonCache[APC_BUTTON_DEVICE_RIGHT] = -1;

    // Only MkII
    this.buttonCache[APC_BUTTON_SESSION] = -1;
    this.buttonCache[APC_BUTTON_SEND_C] = -1;
    this.buttonCache[APC_BUTTON_BANK] = -1;
};

Controller.prototype.updateChannelButton = function (button, index, value)
{
    if (this.buttonCache[button][index] == value)
        return;
    this.surface.setButtonEx (button, index, value);
    this.buttonCache[button][index] = value;
};

Controller.prototype.updateButton = function (button, value)
{
    if (this.buttonCache[button] == value)
        return;
    this.surface.setButton (button, value);
    this.buttonCache[button] = value;
};
