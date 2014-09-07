// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function Grid (output, isMkII)
{
    this.output = output;
    this.isMkII = isMkII;

    this.arraySize = 5 * 8;
    this.currentButtonColors = initArray ([ APC_COLOR_BLACK, false, false], this.arraySize);
    this.buttonColors = initArray ([ APC_COLOR_BLACK, false, false], this.arraySize);
}

Grid.prototype.light = function (x, y, color, blink, fast)
{
    this.buttonColors[y * 8 + x] = [ color, blink, fast ];
};

Grid.prototype.flush = function ()
{
    for (var i = 0; i < this.arraySize; i++)
    {
        var baseChanged = false;
        if (this.equalsPads (this.currentButtonColors[i], this.buttonColors[i]))
            continue;
        this.currentButtonColors[i] = this.buttonColors[i];
        if (this.isMkII)
        {
            var pos = (4 - Math.floor (i / 8)) * 8 + (i % 8)
            this.output.sendNoteEx (this.buttonColors[i][1] ? 10 : (this.buttonColors[i][2] ? 14 : 0), pos, this.buttonColors[i][0]);
        }
        else
            this.output.sendNoteEx (i % 8, APC_BUTTON_CLIP_LAUNCH_1 + Math.floor (i / 8), this.buttonColors[i][0]);
        baseChanged = true;
    }
};

Grid.prototype.turnOff = function ()
{
    for (var i = 0; i < this.arraySize; i++)
    {
        this.buttonColors[i][0] = APC_COLOR_BLACK;
        this.buttonColors[i][1] = false;
        this.buttonColors[i][2] = false;
    }
    this.flush ();
};

Grid.prototype.equalsPads = function (pad1, pad2)
{
    for (var i = 0; i < 3; i++)
    {
        if (pad1[i] != pad2[i])
            return false;
    }
    return true;
};