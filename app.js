const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
app.use(express.json());
const sqlite3 = require("sqlite3");

const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;

const inititlizeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB error: ${e.message}`);
    process.exit(1);
  }
};

inititlizeDbAndServer();

//API Get players
app.get("/players/", async (request, response) => {
  const getAllPlayersQuery = `SELECT * 
    FROM cricket_team 
    ORDER BY player_id;`;
  const players = await db.all(getAllPlayersQuery);
  response.send(players);
});

//API get player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * 
        FROM cricket_team
        WHERE player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API post player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team 
    (
    player_name,
    jersey_number,
    role) 
    VALUES (
    "${player_name}", ${jersey_number},"${role}");`;
  await db.get(addPlayerQuery);
  response.send("Player Added to Team");
});

//API update
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const updatePlayerQuery = `UPDATE cricket_team 
        SET player_name = "${player_name}",
            jersey_number = ${jersey_number},
            role = "${role}";`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team 
        WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
