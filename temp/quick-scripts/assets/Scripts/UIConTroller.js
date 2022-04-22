(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UIConTroller.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c270asPQH5PbLUFII3NfggR', 'UIConTroller', __filename);
// scripts/UIConTroller.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        victoryPopup: {
            default: null,
            type: cc.Node
        },

        scoreLabel: {
            default: null,
            type: cc.Label
        },

        playButton: {
            default: null,
            type: cc.Button
        }
    },

    onLoad: function onLoad() {},
    showScore: function showScore(score) {
        this.scoreLabel.string = "Score: " + score;
    },
    showVictory: function showVictory() {
        this.victoryPopup.active = true;
    },
    hidePlayButton: function hidePlayButton() {
        cc.log("hide btn");
        this.playButton.node.active = false;
    },
    backVictory: function backVictory() {
        this.playButton.node.active = true;
        this.victoryPopup.active = false;
    },
    hideUIplayAgain: function hideUIplayAgain() {
        this.hidePlayButton();
        this.victoryPopup.active = false;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UIConTroller.js.map
        