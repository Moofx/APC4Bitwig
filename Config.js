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

Config.initListeners (Config.QUANTIZE_AMOUNT);


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
    
    ///////////////////////////
    // Play and Sequencer

    Config.activateQuantizeAmountSetting (prefs);
};
