"use strict";
cc._RF.push(module, 'bde07hH36lFD7NcI2WClEpB', 'Square');
// scripts/Square.js

"use strict";

var squareState;
squareState = cc.Enum({
    OPEN: 0,
    CLOSE: 1
});

cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        type: 0,

        GameController: require("GameController"),
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
        spriteOpen: {
            default: null,
            type: cc.SpriteFrame
        },
        state: {
            default: squareState.CLOSE,
            type: squareState
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.state = squareState.CLOSE;
        this.node.on("INIT_INFO", this.initInfor, this);
        this.node.on("REUSE", this.reuse, this);
        this.node.on("OPEN_SQUARE", this.openSquare, this);
        this.node.on("RESET_SQUARE", this.resetSquare, this);
        this.node.on("MATCH_SQUARE", this.matchSquare, this);
        this.node.on("TOUCH_SQUARE", this.touchSquare, this);
        this.node.on("GET_TYPE", this.squareType, this);

        this.node.on("SHOW_INDEX", this.showIndex, this);

        // this.node.on(cc.Node.EventType.TOUCH_START,this.touchSquare,this);


        var fadeIn = cc.fadeIn(0.1);
        this.node.runAction(fadeIn);
    },
    showIndex: function showIndex() {
        cc.log("index: " + this.index);
    },
    onClickSquare: function onClickSquare() {
        this.clickItemEvent = new cc.Event.EventCustom('ON_TYPE', true);
        this.clickItemEvent.setUserData({
            type: this.type
        });
        this.node.dispatchEvent(this.clickItemEvent);
    },
    squareType: function squareType(evt) {
        cc.log("type: " + this.type);
    },
    initInfor: function initInfor(index, type, Sprite, GameController) {
        this.index = index;
        this.type = type;
        this.spriteOpen = Sprite;
        this.GameController = GameController;

        this.labelIndex.string = index;
        this.labelType.string = type;
    },
    touchSquare: function touchSquare() {
        if (this.state === squareState.CLOSE) this.openSquare();

        // this.GameController.pushToTempSquares(this);
        // this.GameController.emit("PUSH_TEMP",this);
    },
    openSquare: function openSquare() {
        var _this = this;

        this.state = squareState.OPEN;
        var scaleIn = cc.scaleTo(0.3, 0, 1);
        var scaleOut = cc.scaleTo(0.3, 1, 1);
        var sequence = cc.sequence(scaleIn, cc.callFunc(function () {
            _this.labelIndex.node.active = false;
            _this.node.getComponent(cc.Sprite).spriteFrame = _this.spriteOpen;
        }), scaleOut);
        this.node.runAction(sequence);
    },
    resetSquare: function resetSquare() {
        var _this2 = this;

        this.state = squareState.CLOSE;
        var scaleIn = cc.scaleTo(0.3, 0, 1);
        var scaleOut = cc.scaleTo(0.3, 1, 1);
        var sequence = cc.sequence(scaleIn, cc.callFunc(function () {
            _this2.labelIndex.node.active = true;
            _this2.node.getComponent(cc.Sprite).spriteFrame = _this2.defaultSprite;
        }), scaleOut);
        this.node.runAction(sequence);
    },
    matchSquare: function matchSquare() {
        this.node.zIndex = 1;
        var scaleIn = cc.scaleTo(0.5, 2, 2);
        this.node.runAction(scaleIn);
    },
    getType: function getType() {
        return this.type;
    },
    getIndex: function getIndex() {
        return this.index;
    },
    unuse: function unuse() {},
    reuse: function reuse() {
        this.node.scaleX = 1;
        this.node.scaleY = 1;
        this.state = squareState.CLOSE;
        this.labelIndex.node.active = true;
        this.node.getComponent(cc.Sprite).spriteFrame = this.defaultSprite;
    }
});

cc._RF.pop();