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

    

    onLoad() {
    },

    showScore(score) {
        this.scoreLabel.string = "Score: " + score;
    },

    showVictory(){
        this.victoryPopup.active = true;
    },

    hidePlayButton(){
        cc.log("hide btn")
        this.playButton.node.active = false;
    },

    backVictory(){
        this.playButton.node.active = true;
        this.victoryPopup.active = false;
    },

    hideUIplayAgain(){
        this.hidePlayButton();
        this.victoryPopup.active = false;
    }
});
