(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Square.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bde07hH36lFD7NcI2WClEpB', 'Square', __filename);
// scripts/Square.js

"use strict";

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var GameController = require("GameController");

cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        type: 0,

        labelIndex: {
            default: null,
            type: cc.Label
        },
        labelType: {
            default: null,
            type: cc.Label
        },
        defaultSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        t: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.node.on("INIT_INFO", this.initInfor, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.tounchSquare, this);
    },
    initInfor: function initInfor(index, type, Sprite) {
        this.index = index;
        this.type = type;
        this.spriteOpen = Sprite;

        this.labelIndex.string = index;
        this.labelType.string = type;
    },
    tounchSquare: function tounchSquare() {
        var _this = this;

        if (!GameController.instance.isCanPlay()) return;
        cc.log("can play: " + GameController.instance.isCanPlay());

        var tempSquare = GameController.instance.getTmpSquare();
        if (!tempSquare) {
            this.openSquare();
            GameController.instance.setTmpSquare(this);
        } else {
            var tempType = tempSquare.getType();

            if (tempSquare != this) {
                var sequence = cc.sequence(cc.callFunc(function () {
                    _this.openSquare();
                }), cc.delayTime(1), cc.callFunc(function () {
                    if (tempType === _this.getType()) {
                        _this.matchSquare();
                        tempSquare.matchSquare();
                        GameController.instance.countScore();
                        GameController.instance.checkWinGame();
                        GameController.instance.setCanPlay(false);
                    } else {
                        _this.resetSquare();
                        tempSquare.resetSquare();
                        GameController.instance.clearTmpSquare();
                    }
                }));
                this.node.runAction(sequence);
            }
        }
    },
    openSquare: function openSquare() {
        var _this2 = this;

        var scaleIn = cc.scaleTo(0.3, 0, 1);
        var scaleOut = cc.scaleTo(0.3, 1, 1);
        var sequence = cc.sequence(scaleIn, cc.callFunc(function () {
            _this2.node.getComponent(cc.Sprite).spriteFrame = _this2.spriteOpen;
        }), scaleOut);
        this.node.runAction(sequence);
    },
    resetSquare: function resetSquare() {
        var _this3 = this;

        GameController.instance.setCanPlay(true);
        var scaleIn = cc.scaleTo(0.3, 0, 1);
        var scaleOut = cc.scaleTo(0.3, 1, 1);
        var sequence = cc.sequence(scaleIn, cc.callFunc(function () {
            _this3.node.getComponent(cc.Sprite).spriteFrame = _this3.defaultSprite;
        }), scaleOut);
        this.node.runAction(sequence);
    },
    matchSquare: function matchSquare() {
        var _this4 = this;

        this.node.zIndex = 1;
        var scaleIn = cc.scaleTo(0.3, 2, 2);
        var sequence = cc.sequence(scaleIn, cc.callFunc(function () {
            _this4.node.removeFromParent(true);
            GameController.instance.clearTmpSquare();
            GameController.instance.checkWinGame();
            GameController.instance.setCanPlay(true);
        }));

        this.node.runAction(sequence);
        GameController.instance.removeSquare(this);
    },
    getType: function getType() {
        return this.type;
    },
    getIndex: function getIndex() {
        return this.index;
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
        //# sourceMappingURL=Square.js.map
        