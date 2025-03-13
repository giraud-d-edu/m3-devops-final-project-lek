package bdd

import (
	"fmt"
	"math"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func round(x float64, places int) float64 {
	facteur := math.Pow10(places)
	return float64(int(x*facteur)) / facteur
}

// This file creates and fills the database with dummy data
func Seeder() {
	fmt.Println("Seed in progress")
	DbManager.AddDeleteUpdateDB(`
	DROP TABLE IF EXISTS players;
	CREATE TABLE players (
		playerUUID TEXT(128) NOT NULL UNIQUE,
		avatarProfile TEXT(256) NOT NULL DEFAULT 'panda.png',
		email TEXT(256) NOT NULL UNIQUE,
		pseudo TEXT(100) NOT NULL UNIQUE,
		password TEXT NOT NULL,
		avgAccuracy INTEGER NOT NULL DEFAULT 0,
		killPerSeconde FLOAT NOT NULL DEFAULT 0,
		totalScore INTEGER NOT NULL DEFAULT 0,
		numberOfWin INTEGER NOT NULL DEFAULT 0,
		numberOfLoose INTEGER NOT NULL DEFAULT 0, 
		numberOfSoloGamePlay INTEGER NOT NULL DEFAULT 0,
		numberOfGameWithStrike INTEGER NOT NULL DEFAULT 0,
		bestStrike INTEGER NOT NULL DEFAULT 0,
		CONSTRAINT players_PK PRIMARY KEY (playerUUID)
	);`)
	DbManager.AddDeleteUpdateDB(`
	DROP TABLE IF EXISTS tournaments;
	CREATE TABLE tournaments (
		tournamentId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		name TEXT(128) NOT NULL
	);`)
	DbManager.AddDeleteUpdateDB(`
	DROP TABLE IF EXISTS games;
	CREATE TABLE games (
		gameId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		player1UUID TEXT NOT NULL,
		player2UUID TEXT NOT NULL,
		"start" TEXT,
		"end" TEXT,
		tournamentId INTEGER,
		CONSTRAINT games_FK FOREIGN KEY (player2UUID) REFERENCES players(playerUUID) ON UPDATE CASCADE,
		CONSTRAINT games_FK_1 FOREIGN KEY (player1UUID) REFERENCES players(playerUUID) ON UPDATE CASCADE,
		CONSTRAINT games_FK_2 FOREIGN KEY (tournamentId) REFERENCES tournaments(tournamentId) ON UPDATE CASCADE
	);`)
	DbManager.AddDeleteUpdateDB(`
	DROP TABLE IF EXISTS friendsRequests;
	CREATE TABLE friendsRequests (
		friendsRequestId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		requestingPlayerUUID TEXT(128) NOT NULL,
		requestedPlayerUUID TEXT(128) NOT NULL,
		CONSTRAINT friendsRequestFK1 FOREIGN KEY (requestingPlayerUUID) REFERENCES players(playerUUID) ON UPDATE CASCADE,
		CONSTRAINT friendsRequestFK2 FOREIGN KEY (requestedPlayerUUID) REFERENCES players(playerUUID) ON UPDATE CASCADE
	);`)
	DbManager.AddDeleteUpdateDB(`
	DROP TABLE IF EXISTS friends;
	CREATE TABLE friends (
		friendsId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		player1UUID TEXT(128) NOT NULL,
		player2UUID TEXT(128) NOT NULL,
		CONSTRAINT friendsFK1 FOREIGN KEY (player1UUID) REFERENCES players(playerUUID) ON UPDATE CASCADE,
		CONSTRAINT friendsFK2 FOREIGN KEY (player2UUID) REFERENCES players(playerUUID) ON UPDATE CASCADE
	);`)
	DbManager.AddDeleteUpdateDB(`
	DROP TABLE IF EXISTS trackingGames;
	CREATE TABLE trackingGames (
		trackingGameId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		playerUUID TEXT(128) NOT NULL,
		accuracy INTEGER NOT NULL DEFAULT 0,
		totalScore INTEGER NOT NULL DEFAULT 0,
		gameDate DATE NOT NULL,
		CONSTRAINT trackingGamesFK1 FOREIGN KEY (playerUUID) REFERENCES players(playerUUID) ON UPDATE CASCADE
	);`)
	DbManager.AddDeleteUpdateDB(`
	DROP TABLE IF EXISTS gridGames;
	CREATE TABLE gridGames (
		gridGamesId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		playerUUID TEXT(128) NOT NULL,
		accuracy INTEGER NOT NULL DEFAULT 0,
		totalScore INTEGER NOT NULL DEFAULT 0,
		killPerSeconde FLOAT NOT NULL DEFAULT 0,
		gameDate DATE NOT NULL,
		bestStrike INTEGER NOT NULL DEFAULT 0,
		CONSTRAINT gridGamesIdFK1 FOREIGN KEY (playerUUID) REFERENCES players(playerUUID) ON UPDATE CASCADE
	);`)
	password, err := bcrypt.GenerateFromPassword([]byte("azertyuiop"), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Failde to hash password")
	}
	DbManager.AddDeleteUpdateDB("INSERT INTO players (playerUUID, email, pseudo, password) VALUES (?, ?, ?, ?);", uuid.New().String(), "testAccountForDev@gmail.com", "t", string(password))
	pseudos := []string{
		"ShadowBlade", "CyberPulse", "PhoenixRider", "NeonStrike", "MysticFury",
		"QuantumSpecter", "SkyRogue", "BlazeRunner", "DarkVoyager", "ThunderCaster",
		"RapidFire", "IceFang", "StormChaser", "SoulReaper", "EternalKnight",
		"TechNinja", "DragonSlayer", "GhostPirate", "SilverWing", "LunarGuardian",
		"TacticalAssassin", "VenomShadow", "WildWolf", "ShadowPhoenix", "BladeMaster",
		"CyberNinja", "Firestorm", "NeonNemesis", "MysticHunter", "StarStriker",
		"StormSorcerer", "FrostBite", "DarkKnight", "GhostRecon", "SpectralBlade",
		"Thunderbolt", "VortexAssassin", "IronClad", "SonicSamurai", "InfernoFury",
		"PlasmaPilot", "NightmareNinja", "OmegaOps", "Blackout", "CrusaderClash",
		"VoidVoyager", "ApexPredator",
	}
	images := []string{"bear.png", "panda.png", "rabbit.png"}
	for _, pseudo := range pseudos {
		source := rand.NewSource(time.Now().UnixNano())
		random := rand.New(source)
		randomIndex := rand.Intn(len(images))
		randomKillPerSeconde := 1 + rand.Float64()*(5)
		randomNumberOfWin := random.Intn(101)
		randomNumberOfLoose := random.Intn(101)
		randomNumberOfSoloGamePlay := random.Intn(101)
		randomTotalScore := (randomNumberOfWin + randomNumberOfLoose + randomNumberOfSoloGamePlay) * (500 + random.Intn(1500))
		var playerUUID string = uuid.New().String()
		password, err := bcrypt.GenerateFromPassword([]byte(pseudo), bcrypt.DefaultCost)
		if err != nil {
			fmt.Println("Failde to hash password")
		}
		DbManager.AddDeleteUpdateDB(`
			INSERT INTO players 
			(playerUUID, email, pseudo, password, killPerSeconde, numberOfWin, numberOfLoose, numberOfSoloGamePlay, avgAccuracy, totalScore, avatarProfile, numberOfGameWithStrike, bestStrike) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
		`, playerUUID, pseudo+"@gmail.com", pseudo, string(password), round(randomKillPerSeconde, 2), randomNumberOfWin, randomNumberOfLoose, randomNumberOfSoloGamePlay, random.Intn(101), randomTotalScore, images[randomIndex], randomNumberOfSoloGamePlay+randomNumberOfLoose, random.Intn(75))
		for i := 0; i < (randomNumberOfSoloGamePlay / 2); i++ {
			DbManager.AddDeleteUpdateDB(`
			INSERT INTO trackingGames 
			(playerUUID, accuracy, totalScore, gameDate) 
			VALUES (?,?,?,?);`, playerUUID, random.Intn(101), (randomNumberOfSoloGamePlay/2)*(500+random.Intn(1500)), time.Now())
			DbManager.AddDeleteUpdateDB(`
			INSERT INTO gridGames 
			(playerUUID, killPerSeconde, accuracy, totalScore, gameDate, bestStrike) 
			VALUES (?,?,?,?,?,?);`, playerUUID, round(1+rand.Float64()*(5), 2), random.Intn(101), (randomNumberOfSoloGamePlay/2)*(500+random.Intn(1500)), time.Now(), random.Intn(75))
		}
	}
	fmt.Println("Seed is finished")
}
