// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

BrowserMode.COLUMN_ORDER = [ 1, 0, 4, 5, 2, 3 ];


function BrowserMode (model)
{
    BaseMode.call (this, model, 0, 0);
    this.id = MODE_BROWSER;
    
    this.lastValue = 0;
}
BrowserMode.prototype = new BaseMode ();

BrowserMode.prototype.setValue = function (index, value)
{
    var session = this.model.getBrowser ().getPresetSession ();
    if (!session.isActive)
        return;

    var diff = value - this.lastValue;
    var isLeft = value == 0 || diff < 0;
    this.lastValue = value;
    
    switch (index)
    {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            if (isLeft)
                session.selectPreviousFilterItem (BrowserMode.COLUMN_ORDER[index]);
            else
                session.selectNextFilterItem (BrowserMode.COLUMN_ORDER[index]);
            break;
            
        case 6:
            // Not used
            break;

        case 7:
            if (isLeft)
                session.selectPreviousResult ();
            else
                session.selectNextResult ();
            break;
    }
};

BrowserMode.prototype.getValue = function (index) { return null; };
