(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/GameController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '129a7GDnFNIuqNsuUxe+d5A', 'GameController', __filename);
// scripts/GameController.js

"use strict";

var GameController = cc.Class({
    extends: cc.Component,

    properties: {
        listImage: {
            default: [],
            type: cc.SpriteFrame
        },

        square: {
            default: null,
            type: cc.Prefab
        },

        listSquare: {
            default: [],
            type: cc.Prefab
        },

        tmpSquare: {
            default: [],
            type: cc.Prefab
        },
        UIController: require("UIConTroller"),
        score: 0,
        canPlay: true
    },

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        GameController.instance = this;
        this.score = 0;
    },


    initLevel: function initLevel() {
        var _this = this;

        this.UIController.hidePlayButton();
        var index = this.listImage.length * 2 + 1;
        var typeCreate = 0;
        var action1 = cc.delayTime(0.1);
        var action2 = cc.callFunc(function () {
            index--;
            _this.createSquare(index, typeCreate, _this.listImage[typeCreate]);
        }, this);
        var action3 = cc.callFunc(function () {
            index--;
            _this.createSquare(index, typeCreate, _this.listImage[typeCreate]);
            typeCreate++;
        }, this);

        this.node.runAction(cc.sequence(cc.repeat(cc.sequence(action1, action2, action3), this.listImage.length), cc.delayTime(1), cc.callFunc(function () {
            _this.setUpPositionSquares();
        })));
    },

    setUpPositionSquares: function setUpPositionSquares() {
        var maxRow = 4;
        var maxCol = 5;
        var index = this.listSquare.length - 1;
        var duration = 0;

        // this.listSquare = this.listSquare.sort(() => Math.random() - 0.5);
        for (var row = 0; row < maxRow; row++) {
            for (var col = 0; col < maxCol; col++) {
                var x = -130 + col * 64;
                var y = 150 + -row * 64;
                var square = this.listSquare[index];
                var moveAction = cc.moveTo(1, x, y).easing(cc.easeBackInOut());
                var sequence = cc.sequence(cc.delayTime(0.1 * duration), moveAction);
                square.runAction(sequence);
                index--;
                duration++;
            }
        }
    },
    createSquare: function createSquare(index, type, spriteFrame) {
        var square = cc.instantiate(this.square);
        square.parent = this.node;
        // index++;
        square.emit("INIT_INFO", index, type, spriteFrame);
        square.setPosition(0, -130, 0);
        var fadeIn = cc.fadeIn(0.1);
        square.runAction(fadeIn);
        this.listSquare.push(square);
    },


    radomInteger: function radomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    },

    //4
    randomElementInArray: function randomElementInArray(arr) {
        var index = radomInteger(0, arr.length - 1);
        return arr[index];
    },

    getTmpSquare: function getTmpSquare() {
        return this.tmpSquare;
    },
    setTmpSquare: function setTmpSquare(square) {
        this.tmpSquare = square;
    },
    clearTmpSquare: function clearTmpSquare() {
        this.tmpSquare = [];
    },
    removeSquare: function removeSquare(square) {
        var index = this.listSquare.indexOf(square);
        this.listSquare.splice(index, 1);
        this.setCanPlay(true);
    },
    pushToTempSquares: function pushToTempSquares(square) {

        if (this.tmpSquare.length === 0) {
            this.pushToTempList(square);
            return;
        } else if (this.tmpSquare.length === 1) {
            if (this.tmpSquare[0] != square) {
                this.pushToTempList(square);
                this.checkMatchSquare();
            }
        }
    },
    checkMatchSquare: function checkMatchSquare() {
        var _this2 = this;

        if (this.tmpSquare.length < 2) return;

        var typeSquare1 = this.tmpSquare[0].getType();
        var typeSquare2 = this.tmpSquare[1].getType();

        var sequence = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            if (typeSquare1 != typeSquare2) {
                _this2.tmpSquare[0].resetSquare();
                _this2.tmpSquare[1].resetSquare();
            } else {
                _this2.tmpSquare[0].matchSquare();
                _this2.tmpSquare[1].matchSquare();
                _this2.countScore();
                _this2.checkWinGame();
            }
        }), cc.delayTime(0.5), cc.callFunc(function () {
            _this2.clearTmpSquare();
        }));
        this.node.runAction(sequence);
    },
    pushToTempList: function pushToTempList(square) {
        this.tmpSquare.push(square);
    },
    checkWinGame: function checkWinGame() {
        if (this.listSquare.length > 0) return;
        this.UIController.showVictory();
    },
    countScore: function countScore() {
        var _this3 = this;

        var action1 = cc.delayTime(0.1);
        var action2 = cc.callFunc(function () {
            _this3.score += 1;
            _this3.setScore();
        }, this);
        this.node.runAction(cc.repeat(cc.sequence(action1, action2), 10));
    },
    setScore: function setScore() {
        this.UIController.showScore(this.score);
    },
    playAgain: function playAgain() {
        this.UIController.hideUIplayAgain();
        this.initLevel();
    },
    setCanPlay: function setCanPlay(canPlay) {
        this.canPlay = canPlay;
    },
    isCanPlay: function isCanPlay() {
        return this.canPlay;
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
        //# sourceMappingURL=GameController.js.map
        