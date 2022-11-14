const User = require('./user');
const dbUser = require('../database/models/user.model');

class Auction {
  constructor(room) {
    this.users = [];
    this.currentBidder = '';
    this.currentBid = 3.8;
    this.currentPlayer = '';
    this.timer = 25;
    this.interval = null;
    this.room = room;
    this.squad = 0;
    this.player = 0;
    this.confirm = 0;
    this.started = false;
  }

  startAuction() {
    this.started = true;
  }

  getStatus() {
    return this.started;
  }

  bid(socket, bidder) {
    if (this.currentBidder === bidder) {
      return;
    }
    const user = this.findUser(bidder);

    if (user.budget < this.currentBid) {
      return socket.emit('bid-error', {
        message: 'The current bid exceeds your budget.',
      });
    }
    if (user.players.length >= 11) {
      return socket.emit('bid-error', {
        message: 'Max players limit reached.',
      });
    }
    this.currentBid = (this.currentBid * 100 + 20) / 100;

    this.currentBidder = bidder;
    this.resetTimer();
  }

  findUser(user) {
    const currentUser = this.users.find((u) => {
      return u.user === user;
    });
    return currentUser;
  }

  servePlayer(squads) {
    const player = squads[this.squad].players[this.player];
    this.currentPlayer = player;
    this.room.emit('player', {
      player,
    });
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getCurrentBid() {
    const bidder = {
      bidder: this.currentBidder,
      bid: this.currentBid,
    };
    return bidder;
  }

  displayBidder() {
    const currentBidder = this.getCurrentBid();
    this.room.emit('bid', {
      currentBidder,
    });
  }

  resetBid(squads) {
    this.currentBidder = '';

    squads[this.squad].players[this.player].stats.batting
      ? (this.currentBid =
          squads[this.squad].players[this.player].stats.batting[
            squads[this.squad].players[this.player].stats.batting.length - 1
          ].value)
      : (this.currentBid =
          squads[this.squad].players[this.player].stats.bowling[
            squads[this.squad].players[this.player].stats.bowling.length - 1
          ].value);
  }

  resetTimer() {
    this.timer = 5;
    this.confirm = 0;
  }

  clearTimer() {
    clearInterval(this.interval);
  }

  startInterval() {
    const currObj = this;
    this.interval = setInterval(() => {
      currObj.decrementClock();
    }, 1000);
  }

  decrementClock() {
    if (this.timer === 0) {
      if (this.currentBidder) {
        this.addPlayer(this.currentPlayer, this.currentBid);
      }
      this.clearTimer();
      // this.resetBid();
    }
    const time = this.timer;
    const room = this.room;
    room.emit('display', {
      time,
    });
    this.timer--;
  }

  gameOver(squads, liveAuctions, room) {
    this.player++;
    if (squads[this.squad].players.length === this.player) {
      this.player = 0;
      this.squad++;
      if (squads.length === this.squad) {
        return true;
      }
    }
    return false;
  }

  addUser(user) {
    if (!this.dupUser(user)) this.users.push(new User(user));
  }

  removeUser(user) {
    this.users = this.users.filter((u) => user !== u.user);
  }

  dupUser(user) {
    const dup = this.users.filter((u) => user === u.user);
    if (dup.length === 0) {
      return false;
    }
    return true;
  }
  newresetTimer() {
    this.timer = 25;
    this.confirm = 0;
  }
  init() {
    this.room.emit('server-details', 3.8);
  }
  next(squads, liveAuctions, room) {
    this.confirm++;
    if (this.confirm === 1) {
      if (!this.gameOver(squads, liveAuctions, room)) {
        this.newresetTimer();
        this.resetBid(squads);
        this.startInterval();
        this.servePlayer(squads);

        let currBid;

        squads[this.squad].players[this.player].stats.batting
          ? (currBid =
              squads[this.squad].players[this.player].stats.batting[
                squads[this.squad].players[this.player].stats.batting.length - 1
              ].value)
          : (currBid =
              squads[this.squad].players[this.player].stats.bowling[
                squads[this.squad].players[this.player].stats.bowling.length - 1
              ].value);

        this.room.emit('server-details', currBid);
      }
    }
  }

  addPlayer(player, amount) {
    const currentUser = this.findUser(this.currentBidder);
    currentUser.addPlayer(player);

    amount -= 0.2;
    console.log('Amount: ', amount);
    currentUser.deduct(amount);
    this.confirm = 0;
    this.room.emit('users', {
      users: this.users,
    });
  }

  fetchPlayers() {
    return this.users;
  }
}

module.exports = Auction;
