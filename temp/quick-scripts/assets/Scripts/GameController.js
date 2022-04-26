(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/GameController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '129a7GDnFNIuqNsuUxe+d5A', 'GameController', __filename);
// scripts/GameController.js

"use strict";

cc.Class({
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

        tmpSquare: {
            default: [],
            type: cc.Prefab
        },
        UIController: require("UIConTroller"),
        score: 0

    },

    onLoad: function onLoad() {

        this.listSquare = [];
        this.squarePool = new cc.NodePool();
        var initCount = 20;
        var tmpType = -1;
        for (var i = 0; i < initCount; ++i) {
            var square = cc.instantiate(this.square);
            this.squarePool.put(square);
        }
        this.node.on("ON_TYPE", this.onTouchCard, this);
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

        this.node.runAction(cc.sequence(cc.repeat(cc.sequence(action1, action2, action1, action3), this.listImage.length), cc.delayTime(1), cc.callFunc(function () {
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
                var x = -128 + col * 64;
                var y = 100 + -row * 64;
                var square = this.listSquare[index];

                cc.log("check pos: " + x + " : " + y);
                var startX = x === 0 ? 0 : x > 0 ? x + 50 : x - 50;
                var startY = y > 0 ? y + 50 : y - 50;

                square.emit("SHOW_INDEX");
                var moveAction = cc.moveTo(0.5, startX, startY).easing(cc.easeSineOut());
                var moveAction1 = cc.moveTo(0.5, x, y).easing(cc.easeSineOut());
                var sequence = cc.sequence(cc.delayTime(0.1 * duration), moveAction, moveAction1);
                square.runAction(sequence);
                index--;
                duration++;
            }
        }
    },
    createSquare: function createSquare(index, type, spriteFrame) {
        var square = null;
        if (this.squarePool.size() > 0) {
            cc.log("size pool: " + this.squarePool.size());
            square = this.squarePool.get();
            square.emit("REUSE");
        } else {
            square = cc.instantiate(this.square);
        }
        square.parent = this.node;
        cc.log("parent: " + this.node.name);
        // square.on(cc.Node.EventType.TOUCH_END, this.onClickCard, this);
        // this.node.on("ON_TYPE", this.onTouchCard, this);
        square.emit("INIT_INFO", index, type, spriteFrame, this);
        square.setPosition(0, 0, 0);
        this.listSquare.push(square);
    },
    onTouchCard: function onTouchCard(evt) {
        evt.stopPropagation();

        if (this.tmpSquare.length >= 2) return;

        var square = evt.target;
        var userData = evt.getUserData();
        var type = userData.type;
        cc.log("touchhhhhh: " + square.name);
        square.emit("TOUCH_SQUARE");
        this.pushToTempSquares(square, type);
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
        this.squarePool.put(square);
        var index = this.listSquare.indexOf(square);
        this.listSquare.splice(index, 1);
        cc.log("size pool: " + this.squarePool.size());
    },
    pushToTempSquares: function pushToTempSquares(square, type) {
        if (this.tmpSquare.length === 0) {
            this.pushToTempList(square);
            this.tmpType = type;
        } else if (this.tmpSquare.length === 1) {
            if (this.tmpSquare[0] != square) {
                this.pushToTempList(square);
                this.checkMatchSquare(type);
            }
        }
    },
    checkMatchSquare: function checkMatchSquare(type) {
        var _this2 = this;

        if (this.tmpSquare.length >= 2 && this.tmpType != -1) {

            var typeSquare1 = this.tmpType;
            var typeSquare2 = type;

            var sequence = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                if (typeSquare1 != typeSquare2) {
                    _this2.tmpSquare[0].emit("RESET_SQUARE");
                    _this2.tmpSquare[1].emit("RESET_SQUARE");
                } else {
                    _this2.tmpSquare[0].emit("MATCH_SQUARE");
                    _this2.tmpSquare[1].emit("MATCH_SQUARE");
                }
            }), cc.delayTime(1), cc.callFunc(function () {
                _this2.removeSquare(_this2.tmpSquare[0]);
                _this2.removeSquare(_this2.tmpSquare[1]);
                _this2.countScore();
                _this2.checkWinGame();

                _this2.clearTmpSquare();
                _this2.tmpType = -1;
            }));
            this.node.runAction(sequence);
        }
    },
    pushToTempList: function pushToTempList(square) {
        this.tmpSquare.push(square);
    },
    checkWinGame: function checkWinGame() {
        if (this.listSquare.length <= 0) {
            this.UIController.showVictory();
        }
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
        