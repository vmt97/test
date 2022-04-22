"use strict";
cc._RF.push(module, '129a7GDnFNIuqNsuUxe+d5A', 'GameController');
// scripts/GameController.js

"use strict";

var UIController = require("UIController");

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
            default: null,
            type: cc.Prefab
        },

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

        var index = 0;
        if (UIController) UIController.instance.hidePlayButton();

        var typeCreate = 0;
        var action1 = cc.delayTime(0.1);
        var action2 = cc.callFunc(function () {
            index++;
            _this.createSquare(index, typeCreate, _this.listImage[typeCreate]);
        }, this);
        var action3 = cc.callFunc(function () {
            index++;
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
        var index = 0;
        // this.listSquare = this.listSquare.sort(() => Math.random() - 0.5);
        for (var row = 0; row < maxRow; row++) {
            for (var col = 0; col < maxCol; col++) {

                var x = -130 + col * 64;
                var y = 150 + -row * 64;

                var square = this.listSquare[index];
                var moveAction = cc.moveTo(1, x, y).easing(cc.easeBackInOut());
                var sequence = cc.sequence(cc.delayTime(0.1 * index), moveAction);
                square.runAction(sequence);
                index++;
            }
        }
    },
    createSquare: function createSquare(index, type, spriteFrame) {
        var square = cc.instantiate(this.square);
        square.parent = this.node;
        // index++;
        square.emit("INIT_INFO", index, type, spriteFrame);
        square.setPosition(0, -130, 0);
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
        this.tmpSquare = null;
    },
    removeSquare: function removeSquare(square) {
        var index = this.listSquare.indexOf(square);
        this.listSquare.splice(index, 1);
        this.setCanPlay(true);
    },
    checkWinGame: function checkWinGame() {
        if (this.listSquare.length > 0) return;
        if (UIController) UIController.instance.showVictory();
    },
    countScore: function countScore() {
        var _this2 = this;

        var action1 = cc.delayTime(0.1);
        var action2 = cc.callFunc(function () {
            _this2.score += 1;
            _this2.setScore();
        }, this);
        this.node.runAction(cc.repeat(cc.sequence(action1, action2), 10));
    },
    setScore: function setScore() {
        if (UIController) UIController.instance.showScore(this.score);
    },
    playAgain: function playAgain() {
        if (UIController) UIController.instance.hideUIplayAgain();
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