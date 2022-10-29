function HealthBar(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      MonsterHealth: 100,
      HumanHealth: 100,
      round: "",
      winner: null,
      battlelog: []
    };
  },

  watch: {
    MonsterHealth(value) {
      if (value < 0 && this.HumanHealth < 0) {
        this.winner = "tie"; // Tie match
      } else if (value < 0) {
        this.winner = "human"; // Monster lost
      }
    },

    HumanHealth(value) {
      if (value < 0 && this.MonsterHealth < 0) {
        this.winner = "tie"; //tie match
      } else if (value < 0) {
        this.winner = "monster"; // Human lost
      }
    },
  },

  computed: {
    updateMonsterHealthBar() {
      if (this.MonsterHealth < 0) {
        this.MonsterHealth = 0;
      }
      return { width: this.MonsterHealth + "%" };
    },

    updateHumanHealthBar() {
      if (this.HumanHealth < 0) {
        this.HumanHealth = 0;
      }
      return { width: this.HumanHealth + "%" };
    },

    checkRoundDisableButton() {
      if (this.round === "") {
        return true;
      }
      return this.round % 4 !== 0;
    },
  },

  methods: {
    attackMonster() {
      this.round++;
      const monsterattackvalue = HealthBar(5, 12);
      this.MonsterHealth = this.MonsterHealth - monsterattackvalue;
      this.RecordBattleLog(monsterattackvalue,'Attack','Player');
      this.attackHuman();
    },

    attackHuman() {
      const humanattackvalue = HealthBar(8, 12);
      this.HumanHealth -= humanattackvalue;
      this.RecordBattleLog(humanattackvalue,'Attack','Monster');
    },

    attackSpecialMonster() {
      this.round++;
      const monsterspecialattackvalue = HealthBar(15, 20);
      this.MonsterHealth -= monsterspecialattackvalue;
      this.RecordBattleLog(monsterspecialattackvalue,'Special Attack','Player');
      this.attackHuman();
    },

    healPlayer() {
      const healplayervalue = HealthBar(5, 16);
      if (this.HumanHealth + healplayervalue > 100) {
        this.HumanHealth = 100;
      } else {
        this.HumanHealth += healplayervalue;
      }
      this.RecordBattleLog(healplayervalue,'Heal','Player');
      this.attackHuman();
    },

    resetGame(){
        this.MonsterHealth = 100;
        this.HumanHealth = 100;
        this.round = 0,
        this.winner = null;
        this.battlelog = []
    },

    surrenderGame(){
        this.winner = "monster";
        this.RecordBattleLog('0','Surrended','Player');
    },

    RecordBattleLog(health, what, player){
        this.battlelog.unshift({
            actionhealth : health,
            actionbywhat : what,
            actionbywho : player,   
        });
    }
  },
});

app.mount("#game");
