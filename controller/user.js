class User {
  constructor(user) {
    this.user = user;
    this.moderator = user.moderator;
    this.budget = 50;
    this.batsmen = [];
    this.bowlers = [];
    this.allRounders = [];
    this.wicketKeepers = [];
    this.players = [];
    this.unknown = [];
  }

  deduct(amount) {
    console.log(amount);
    if (amount > this.budget) {
      throw new Error('Your budget does not allow you to bid');
    }
    var m = Number((Math.abs(amount) * 100).toPrecision(15));
    m = (Math.round(m) / 100) * Math.sign(amount);
    amount = m;
    this.budget -= amount;
    m = Number((Math.abs(this.budget) * 100).toPrecision(15));
    m = (Math.round(m) / 100) * Math.sign(this.budget);
    this.budget = m;
  }

  getBudget() {
    return this.budget;
  }

  addPlayer(player) {
    if (player.stats.role) {
      const role = player.stats.role.toLowerCase();
      if (role.includes('wicket')) {
        this.wicketKeepers.push(player);
      } else if (role.includes('all')) {
        this.allRounders.push(player);
      } else if (role.includes('bat')) {
        this.batsmen.push(player);
      } else if (role.includes('bowl')) {
        this.bowlers.push(player);
      }
    } else {
      this.unknown.push(player);
    }

    this.players.push(player);
  }

  getPlayers() {
    return this.players;
  }

  getTotalPlayers() {
    return this.players.length;
  }

  getBatsmen() {
    return this.batsmen;
  }

  getTotalBatsmen() {
    return this.players.length;
  }

  getBowlers() {
    return this.bowlers;
  }

  getTotalBowlers() {
    return this.bowlers.length;
  }

  getAllRounders() {
    return this.allRounders;
  }

  getTotalAllRounders() {
    return this.allRounders.length;
  }

  getWicketKeepers() {
    return this.wicketKeepers;
  }

  getTotalWicketKeepers() {
    return this.wicketKeepers.length;
  }
}

module.exports = User;
