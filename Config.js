// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015-2016
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

load ("framework/core/AbstractConfig.js");

// ------------------------------
// Static configurations
// ------------------------------

// Inc/Dec of knobs
Config.fractionValue     = 1;
Config.fractionMinValue  = 0.5;
Config.maxParameterValue = 128;

// How fast the track and scene arrows scroll the banks/scenes
Config.trackScrollInterval = 100;
Config.sceneScrollInterval = 100;


// ------------------------------
// Editable configurations
// ------------------------------

Config.SCALES_SCALE          = 0;
Config.SCALES_BASE           = 1;
Config.SCALES_IN_KEY         = 2;
Config.BEHAVIOUR_ON_STOP     = 3;
Config.SELECT_CLIP_ON_LAUNCH = 4;

Config.initListeners (Config.SELECT_CLIP_ON_LAUNCH);


Config.init = function ()
{
    var prefs = host.getPreferences ();

    ///////////////////////////
    // Scale

    Config.activateScaleSetting (prefs);
    Config.activateScaleBaseSetting (prefs);
    Config.activateScaleInScaleSetting (prefs);
    
    ///////////////////////////
    // Workflow

    Config.activateBehaviourOnStopSetting (prefs);
    Config.activateSelectClipOnLaunchSetting (prefs);
};
