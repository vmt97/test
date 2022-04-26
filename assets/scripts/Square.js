
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

        GameController : require("GameController"),
        labelIndex: {
            default : null,
            type: cc.Label
        },
        labelType: {
            default : null,
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
            type:squareState
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.state = squareState.CLOSE;
        this.node.on("INIT_INFO", this.initInfor, this);
        this.node.on("REUSE", this.reuse, this);
        this.node.on("OPEN_SQUARE", this.openSquare, this);
        this.node.on("RESET_SQUARE", this.resetSquare, this);
        this.node.on("MATCH_SQUARE", this.matchSquare, this);
        this.node.on("TOUCH_SQUARE",this.touchSquare,this);
        this.node.on("GET_TYPE",this.squareType,this);

        this.node.on("SHOW_INDEX",this.showIndex,this);

        // this.node.on(cc.Node.EventType.TOUCH_START,this.touchSquare,this);

       
        let fadeIn = cc.fadeIn(0.1);
        this.node.runAction(fadeIn);
    },

    showIndex(){
        cc.log("index: " + this.index);
    },


    onClickSquare(){
        this.clickItemEvent = new cc.Event.EventCustom('ON_TYPE', true);
        this.clickItemEvent.setUserData({
            type: this.type,
        });
        this.node.dispatchEvent(this.clickItemEvent);
    },


    squareType(evt){
        cc.log("type: " + this.type);
    },


    initInfor(index, type, Sprite, GameController){
        this.index = index;
        this.type = type;
        this.spriteOpen = Sprite;
        this.GameController = GameController;

        this.labelIndex.string = index;
        this.labelType.string = type;
    },

    touchSquare(){
        cc.log("touch square: " + this.type + " : " + this.index);
        if(this.state === squareState.CLOSE)
            this.openSquare();

        // this.GameController.pushToTempSquares(this);
        // this.GameController.emit("PUSH_TEMP",this);
    },


    openSquare(){
        this.state = squareState.OPEN;
        let scaleIn = cc.scaleTo(0.3,0,1);
        let scaleOut = cc.scaleTo(0.3,1,1);
        let sequence = cc.sequence(
                scaleIn,
                cc.callFunc(()=>{
                    this.labelIndex.node.active = false;
                    this.node.getComponent(cc.Sprite).spriteFrame = this.spriteOpen;                    
                }),
                scaleOut);
        this.node.runAction(sequence);
    },

    resetSquare(){
        this.state = squareState.CLOSE;
        let scaleIn = cc.scaleTo(0.3,0,1);
        let scaleOut = cc.scaleTo(0.3,1,1);
        let sequence = cc.sequence(
                scaleIn,
                cc.callFunc(()=>{
                    this.labelIndex.node.active = true;
                    this.node.getComponent(cc.Sprite).spriteFrame = this.defaultSprite;                    
                }),
                scaleOut);
        this.node.runAction(sequence);
    },

    matchSquare(){
        this.node.zIndex = 1;
        let scaleIn = cc.scaleTo(0.5,2,2);
        this.node.runAction(scaleIn);

    },

    getType(){
        return this.type;
    },

    getIndex(){
        return this.index;
    },

    unuse(){
    },

    reuse(){
        cc.log("reuseeeeeeee");
        this.node.scaleX = 1;
        this.node.scaleY = 1;
        this.state = squareState.CLOSE;
        this.labelIndex.node.active = true;
        this.node.getComponent(cc.Sprite).spriteFrame = this.defaultSprite;  
    }

   
});


