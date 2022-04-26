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
        score: 0,

    },

    onLoad() {

        this.listSquare = [];
        this.squarePool = new cc.NodePool();
        let initCount = 20;
        let tmpType = -1;
        for (let i = 0; i < initCount; ++i) {
            let square = cc.instantiate(this.square);
            this.squarePool.put(square);
        }
        this.node.on("ON_TYPE", this.onTouchCard, this);

    },


    initLevel: function () {
        this.UIController.hidePlayButton();
        let index = (this.listImage.length * 2) + 1;
        let typeCreate = 0;
        let action1 = cc.delayTime(0.1);
        let action2 = cc.callFunc(() => {
            index--;
            this.createSquare(index, typeCreate, this.listImage[typeCreate]);
        }, this);
        let action3 = cc.callFunc(() => {
            index--;
            this.createSquare(index, typeCreate, this.listImage[typeCreate]);
            typeCreate++;
        }, this);


        this.node.runAction(cc.sequence(
            cc.repeat(cc.sequence(action1, action2, action1, action3), this.listImage.length),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.setUpPositionSquares();
            })
        )
        );
    },

    setUpPositionSquares() {
        let maxRow = 4;
        let maxCol = 5;
        let index = this.listSquare.length - 1;
        let duration = 0;

        // this.listSquare = this.listSquare.sort(() => Math.random() - 0.5);
        for (let row = 0; row < maxRow; row++) {
            for (let col = 0; col < maxCol; col++) {
                let x = - 128 + (col * 64);
                let y = 100 + (-row * 64);
                let square = this.listSquare[index];

                cc.log("check pos: " + x + " : " + y );
                let startX = x === 0 ? 0 : (x > 0 ? x + 50 : x - 50);
                let startY = y > 0 ? y +50 : y -50;

                square.emit("SHOW_INDEX");
                let moveAction = cc.moveTo(0.5, startX, startY).easing(cc.easeSineOut());
                let moveAction1 = cc.moveTo(0.5, x, y).easing(cc.easeSineOut());
                let sequence = cc.sequence(
                    cc.delayTime(0.1 * duration),
                    moveAction,
                    moveAction1,
                );
                square.runAction(sequence);
                index--;
                duration++;
            }
        }
    },

    createSquare(index, type, spriteFrame) {
        let square = null;
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


    onTouchCard(evt) {
        evt.stopPropagation();

        if (this.tmpSquare.length >= 2)
            return;
        let square = evt.target;
        let userData = evt.getUserData();
        let type = userData.type;
        cc.log("touchhhhhh: " + square.name);
        square.emit("TOUCH_SQUARE");
        this.pushToTempSquares(square, type);

    },

    getTmpSquare() {
        return this.tmpSquare;
    },

    setTmpSquare(square) {
        this.tmpSquare = square;
    },

    clearTmpSquare() {
        this.tmpSquare = [];
    },

    removeSquare(square) {
        this.squarePool.put(square);
        let index = this.listSquare.indexOf(square);
        this.listSquare.splice(index, 1);
        cc.log("size pool: " + this.squarePool.size());
    },

    pushToTempSquares(square, type) {
        if (this.tmpSquare.length === 0) {
            this.pushToTempList(square);
            this.tmpType = type;
        }
        else if (this.tmpSquare.length === 1) {
            if (this.tmpSquare[0] != square) {
                this.pushToTempList(square);
                this.checkMatchSquare(type);    
            }
        }
    },

    checkMatchSquare(type) {
        if (this.tmpSquare.length >= 2 && this.tmpType != -1) {


            let typeSquare1 = this.tmpType;
            let typeSquare2 = type;

            let sequence = cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    if (typeSquare1 != typeSquare2) {
                        this.tmpSquare[0].emit("RESET_SQUARE");
                        this.tmpSquare[1].emit("RESET_SQUARE");
                    }
                    else {
                        this.tmpSquare[0].emit("MATCH_SQUARE");
                        this.tmpSquare[1].emit("MATCH_SQUARE");
                    }
                }),
                cc.delayTime(1),
            
                cc.callFunc(() => {
                    this.removeSquare(this.tmpSquare[0]);
                    this.removeSquare(this.tmpSquare[1]);
                    this.countScore();
                    this.checkWinGame();

                    this.clearTmpSquare();
                    this.tmpType = -1;
                })
            );
            this.node.runAction(sequence);
        }
    },

    pushToTempList(square) {
        this.tmpSquare.push(square);
    },

    checkWinGame() {
        if (this.listSquare.length <= 0) {
            this.UIController.showVictory();
        }
    },

    countScore() {
        let action1 = cc.delayTime(0.1);
        let action2 = cc.callFunc(() => {
            this.score += 1;
            this.setScore();
        }, this);
        this.node.runAction(cc.repeat(cc.sequence(action1, action2), 10));
    },

    setScore() {
        this.UIController.showScore(this.score);
    },

    playAgain() {
        this.UIController.hideUIplayAgain();
        this.initLevel();
    },


});
