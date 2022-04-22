"use strict";
cc._RF.push(module, 'c270asPQH5PbLUFII3NfggR', 'UIConTroller');
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

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        UIConTroller.instance = this;
    },
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