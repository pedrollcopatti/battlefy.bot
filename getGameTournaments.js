const axios = require('axios');

async function getGameTournaments(gameId) {


  const response = await axios.get(`https://search.battlefy.com/tournament/browse/${gameId}`)
    const tournaments = response.data.tournaments;
    return tournaments;
}

module.exports = getGameTournaments;

