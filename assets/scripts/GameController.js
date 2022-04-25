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

    onLoad() {
        GameController.instance = this;
        this.score = 0;
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
            cc.repeat(cc.sequence(action1, action2, action3), this.listImage.length),
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
                let x = - 130 + (col * 64);
                let y = 150 + (-row * 64);
                let square = this.listSquare[index];
                let moveAction = cc.moveTo(1, x, y).easing(cc.easeBackInOut());
                let sequence = cc.sequence(
                    cc.delayTime(0.1 * duration),
                    moveAction,
                );
                square.runAction(sequence);
                index--;
                duration++;
            }
        }
               
    },

    createSquare(index, type, spriteFrame) {
        let square = cc.instantiate(this.square);
        square.parent = this.node;
        // index++;
        square.emit("INIT_INFO", index, type, spriteFrame);
        square.setPosition(0, -130, 0);
        let fadeIn = cc.fadeIn(0.1);
        square.runAction(fadeIn);
        this.listSquare.push(square);
    },

    radomInteger: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    },

    //4
    randomElementInArray: function (arr) {
        let index = radomInteger(0, arr.length - 1);
        return arr[index];
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
        let index = this.listSquare.indexOf(square);
        this.listSquare.splice(index, 1);
        this.setCanPlay(true);
    },

    pushToTempSquares(square) {

        if (this.tmpSquare.length === 0) {
            this.pushToTempList(square);
            return;
        }
        else if(this.tmpSquare.length === 1){
            if(this.tmpSquare[0] != square){
                this.pushToTempList(square);
                this.checkMatchSquare();
            }
        }
    },

    checkMatchSquare(){
        if(this.tmpSquare.length < 2) return;

        let typeSquare1 = this.tmpSquare[0].getType();
        let typeSquare2 = this.tmpSquare[1].getType();

        let sequence = cc.sequence(
            cc.delayTime(1),
            cc.callFunc(()=>{
                if(typeSquare1 != typeSquare2){
                    this.tmpSquare[0].resetSquare();
                    this.tmpSquare[1].resetSquare();
                }
                else{
                    this.tmpSquare[0].matchSquare();
                    this.tmpSquare[1].matchSquare();
                    this.countScore();
                    this.checkWinGame();
                }
            }),
            cc.delayTime(0.5),
            cc.callFunc(()=>{
                this.clearTmpSquare();
            })

        );
        this.node.runAction(sequence);
    },

    pushToTempList(square) {
        this.tmpSquare.push(square);
    },

    checkWinGame() {
        if (this.listSquare.length > 0)
            return;
        this.UIController.showVictory();
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

    setCanPlay(canPlay) {
        this.canPlay = canPlay;
    },

    isCanPlay() {
        return this.canPlay;
    }

});
