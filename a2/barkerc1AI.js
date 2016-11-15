var DumbAI = function(game, is_player_one, delay) {
	var key = '';
    if (is_player_one) {
		key = game.registerPlayerOne();
    } else {
		key = game.registerPlayerTwo();
    }

    var turn_delay = 0;
    if (delay != undefined) {
		turn_delay = delay;
    }

    var eventHandler = function(e) {
		var fleet = game.getFleetByKey(key);

		var needsMoreAction = true;
	switch (e.event_type) {
		case SBConstants.HIT_EVENT:

				setTimeout(function(){
					var goingToFire = false;

					for (var y = 0; y < game.getBoardSize(); y++){
						for (var x = 0; x < game.getBoardSize(); x++) {
							var sqr = game.queryLocation(key, x, y);
							var id = '#' + getId(x,y);

							switch (sqr.type) {
								case "p1":
									if (sqr.state == SBConstants.OK) {
										$(id).attr("class", "map-square friendly");
										game.shootAt(key, x, y);
										goingToFire = true;
									}
									break;
							}
						}
					}


					console.log("hit event: " + e.ship.getName());
					if (!goingToFire) {
						if (game.rotateShipCW(key, e.ship)) {
							console.log("hit rotation: " + e.ship.getName());
							needsMoreAction = false;
						} else if (game.moveShipForward(key, e.ship)) {
							console.log("hit fwd: " + e.ship.getName());
							needsMoreAction = false;
						} else if (game.moveShipBackward(key, e.ship)) {
							console.log("hit back: " + e.ship.getName());
							needsMoreAction = false;
						} else {
							var fired = false;

							do {
								var targetX = Math.floor(Math.random() * game.getBoardSize());
								var targetY = Math.floor(Math.random() * game.getBoardSize());

								var sqrTarget = game.queryLocation(key, targetX, targetY);

								if(sqrTarget.type == "invisible"){
									game.shootAt(key, targetX, targetY);
									needsMoreAction = false;
									fired = true;

								}

							} while (!fired);
						}
					}

				}, turn_delay);
				break;

	case SBConstants.TURN_CHANGE_EVENT:
	    if (needsMoreAction && (((e.who == SBConstants.PLAYER_ONE) && is_player_one) ||
		((e.who == SBConstants.PLAYER_TWO) && (!is_player_one)))) {
		{
		    setTimeout(function () {

		    	var goingToFire = false;
				var goingToMove = false;
				var targetX = 0;
				var targetY = 0;

				/**
				 * Will fire on enemy squares when they are seen
				 */
				for (var y = 0; y < game.getBoardSize(); y++){
					for (var x = 0; x < game.getBoardSize(); x++) {
						var sqr = game.queryLocation(key, x, y);
						var id = '#' + getId(x,y);

						switch (sqr.type) {
							case "p1":
								if (sqr.state == SBConstants.OK) {
									$(id).attr("class", "map-square friendly");
									targetX = x;
									targetY = y;
									goingToFire = true;
								}
								break;
						}
					}
				}

				if (e.event_type == SBConstants.HIT_EVENT) {
					console.log("hit event: " + e.ship.getName());
					if (game.rotateShipCCW(key, e.ship)) {
						console.log("rotation: " + e.ship.getName());
						attempt = 10000;
						goingToMove = true;
					} else if (game.rotateShipCW(key, e.ship)) {
						console.log("rotation: " + e.ship.getName());
						attempt = 10000;
						goingToMove = true;
					}
				}
				/**
				 * If the enemy isn't seen, we're going hunting for him.
				 *
				 * We'll select a random ship to randomly rotate or move forward
				 *
				 * If it isn't going to fire, it will try move a ship
				 *
				 */


				if (!goingToFire && !goingToMove) {
					var attempt = 0;
					while (attempt < 9999) {
						//will pick a ship
						var shipStatus = 1;
						var shipKey = -1;
						/*
						 * will select an alive ship
						 */

						while (shipStatus == 1) {
							shipKey = Math.floor(Math.random() * (4));
							shipStatus = fleet[shipKey].getStatus();
						}
						/**
						 * Will pick whether to rotate or move forward.
						 * I want the ship to move forward 75% of the time for more exploration.
						 */
						var action = Math.floor(Math.random() * (3));


						if (action > 0) {
							if (game.moveShipForward(key, fleet[shipKey])) {
								console.log("movement: " + fleet[shipKey].getName());
								goingToMove = true;
								attempt = 10000;
							}
						} else {
							var rotate = Math.floor(Math.random() * (1));
							switch (rotate){
								case 0:
									if (game.rotateShipCCW(key, fleet[shipKey])) {
										console.log("rotation: " + fleet[shipKey].getName());
										attempt = 10000;
										goingToMove = true;
									} else if (game.rotateShipCW(key, fleet[shipKey])) {
										console.log("rotation: " + fleet[shipKey].getName());
										attempt = 10000;
										goingToMove = true;
									}
									break;
								case 1:
									if (game.rotateShipCW(key, fleet[shipKey])) {
										console.log("rotation: " + fleet[shipKey].getName());
										attempt = 10000;
										goingToMove = true;
									} else if (game.rotateShipCCW(key, fleet[shipKey])) {
										console.log("rotation: " + fleet[shipKey].getName());
										attempt = 10000;
										goingToMove = true;
									}
									break;
							}

						}
						attempt++;
					}
				}




				if (goingToFire) {
		    		game.shootAt(key, targetX, targetY);
				} else if (goingToMove) {
					/**
					 * Do nothing more
					 */
				} else {
					/**
					 * will keep generating firing targets until an invisible square is chosen so it won't waste shots
					 * or fire at itself
					 */
					while(!goingToFire) {
						console.log("random firing");
						targetX = Math.floor(Math.random() * game.getBoardSize());
						targetY = Math.floor(Math.random() * game.getBoardSize());

						var sqrTarget = game.queryLocation(key, x, y);

						switch (sqrTarget.type) {
							case "invisible":
								goingToFire = true;
								game.shootAt(key, targetX, targetY);
								break;
						}

					}
				}

		    }, turn_delay);


		}
	    }
	    break;
	}
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      eventHandler);
	game.registerEventHandler(SBConstants.HIT_EVENT,
		eventHandler);
	game.registerEventHandler(SBConstants.MISS_EVENT,
		eventHandler);
	game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
		eventHandler);
	game.registerEventHandler(SBConstants.GAME_OVER_EVENT,
		eventHandler);

    this.giveUpKey = function() {
	return key;
    }
	
};
