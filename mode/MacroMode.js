// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014-2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MacroMode (model)
{
    BaseMode.call (this, model, 2, 0);
    this.id = MODE_MACRO;
    this.params = [ { index: 0, name: '' }, { index: 1, name: '' }, { index: 2, name: '' }, { index: 3, name: '' }, { index: 4, name: '' }, { index: 5, name: '' }, { index: 6, name: '' }, { index: 7, name: '' } ];

    this.cursorDevice = this.model.getCursorDevice ();
}
MacroMode.prototype = new BaseMode ();

MacroMode.prototype.setValue = function (index, value)
{
    this.cursorDevice.getMacro (index).getAmount ().set (value, Config.maxParameterValue);
};

MacroMode.prototype.getValue = function (index)
{
    return this.cursorDevice.getMacroParam (index).value;
};
