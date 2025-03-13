package utils

import (
	bdd "api/BDD"
	"fmt"
)

func GetPlayerOnEndpointWithFriend(limitMin, limitMax int, selectedEndpoint, uuid string, selectedValue interface{}) LeaderBoardData {
	data := LeaderBoardData{
		Data: make(map[int]PlayerData),
	}
	rslt := bdd.DbManager.SelectDB(`
	SELECT 
		closedPlayer.playerUUID,
		closedPlayer.pseudo,
		closedPlayer.avatarProfile,
		closedPlayer.totalScore,
		closedPlayer.numberOfWin,
		closedPlayer.numberOfLoose,
		closedPlayer.avgAccuracy,
		closedPlayer.killPerSeconde,
		closedPlayer.numberOfSoloGamePlay,
		rankedPlayer.ranking
	FROM
		(SELECT * FROM (SELECT playerUUID, pseudo, avatarProfile, totalScore, numberOfWin, numberOfLoose, avgAccuracy, numberOfSoloGamePlay, killPerSeconde, ABS(`+selectedEndpoint+` - ?) AS distance FROM players p
		WHERE `+selectedEndpoint+` >= ? AND playerUUID !=? AND `+selectedEndpoint+` IS NOT NULL
		AND playerUUID IN (SELECT 
			p.playerUUID
			FROM
				friends f 
			JOIN players p ON f.player1UUID = p.playerUUID OR f.player2UUID = p.playerUUID 
			WHERE 
				(f.player1UUID = ? OR f.player2UUID = ?)
		)
		ORDER BY distance ASC
		LIMIT `+fmt.Sprint(limitMin)+`) ORDER BY distance DESC  ) as closedPlayer
	JOIN
		(SELECT pseudo, (SELECT COUNT(*) FROM players p2 WHERE p2.`+selectedEndpoint+` IS NOT NULL AND p2.`+selectedEndpoint+` > p.`+selectedEndpoint+`) + 1 AS ranking
		FROM players p WHERE p.`+selectedEndpoint+` IS NOT NULL
		ORDER BY p.`+selectedEndpoint+` DESC) as rankedPlayer
	USING (pseudo)
	UNION
	SELECT
		closedPlayer.playerUUID, closedPlayer.pseudo, closedPlayer.avatarProfile, closedPlayer.totalScore, closedPlayer.numberOfWin, closedPlayer.numberOfLoose, closedPlayer.avgAccuracy, closedPlayer.killPerSeconde, closedPlayer.numberOfSoloGamePlay, rankedPlayer.ranking
	FROM
		(SELECT * FROM (SELECT playerUUID, pseudo, avatarProfile, totalScore, numberOfWin, numberOfLoose, avgAccuracy, numberOfSoloGamePlay, killPerSeconde, ABS(? - `+selectedEndpoint+`) AS distance FROM players p
		WHERE `+selectedEndpoint+` <= ? AND `+selectedEndpoint+` IS NOT NULL
		AND playerUUID IN (SELECT 
			p.playerUUID
			FROM
				friends f 
			JOIN players p ON f.player1UUID = p.playerUUID OR f.player2UUID = p.playerUUID 
			WHERE 
				(f.player1UUID = ? OR f.player2UUID = ?)
		)
		ORDER BY distance ASC
		LIMIT `+fmt.Sprint(limitMax)+`) ORDER BY distance ASC ) as closedPlayer
	JOIN
		(SELECT pseudo, (SELECT COUNT(*) FROM players p2 WHERE p2.`+selectedEndpoint+` IS NOT NULL AND p2.`+selectedEndpoint+` > p.`+selectedEndpoint+`) + 1 AS ranking
		FROM players p WHERE p.`+selectedEndpoint+` IS NOT NULL
		ORDER BY p.`+selectedEndpoint+` DESC) as rankedPlayer
	USING (pseudo)
	ORDER BY rankedPlayer.ranking ASC;
	`, selectedValue, selectedValue, uuid, uuid, uuid, uuid, selectedValue, selectedValue, uuid, uuid, uuid)
	for rslt.Next() {
		newPlayer := PlayerData{
			IsSelectedPlayer: false,
		}
		rslt.Scan(&newPlayer.Uuid, &newPlayer.Pseudo, &newPlayer.Avatar, &newPlayer.TotalScore, &newPlayer.NumberGameWin, &newPlayer.NumberGameLoose, &newPlayer.AvgAccuracy, &newPlayer.KillPerSeconde, &newPlayer.NumberOfSoloGamePlay, &newPlayer.Ranking)
		if newPlayer.Uuid == uuid {
			newPlayer.IsSelectedPlayer = true
		}
		data.Data[newPlayer.Ranking] = newPlayer
	}
	return data
}
