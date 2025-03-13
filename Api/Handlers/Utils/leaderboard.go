package utils

import (
	bdd "api/BDD"
	"fmt"
)

type RawPlayer struct {
	Uuid         string
	SelectedData interface{}
}
type PlayerData struct {
	IsSelectedPlayer     bool    `json:"isSelectedPlayer"`
	Uuid                 string  `json:"uuid"`
	Pseudo               string  `json:"pseudo"`
	Ranking              int     `json:"ranking"`
	Avatar               string  `json:"avatar"`
	TotalScore           int     `json:"totalScore"`
	NumberGameWin        int     `json:"numberGameWin"`
	NumberGameLoose      int     `json:"numberGameLoose"`
	AvgAccuracy          int     `json:"avgAccuracy"`
	NumberOfSoloGamePlay int     `json:"numberOfSoloGamePlay"`
	KillPerSeconde       float64 `json:"kps"`
}
type LeaderBoardData struct {
	LimitMin int                `json:"limitMin" validate:"required"`
	LimitMax int                `json:"limitMax" validate:"required"`
	Data     map[int]PlayerData `json:"data"`
	Top5     map[int]PlayerData `json:"top5"`
}
type LeaderBoardReceive struct {
	LimitMin string `json:"limitMin" validate:"required"`
	LimitMax string `json:"limitMax" validate:"required"`
}

func GetTop5(selectedEndpoint, uuid string) map[int]PlayerData {
	data := make(map[int]PlayerData)
	rslt := bdd.DbManager.SelectDB(`
	SELECT 
		playerUUID,
		pseudo,
		avatarProfile,
		totalScore,
		numberOfWin,
		numberOfLoose,
		avgAccuracy,
		killPerSeconde,
		numberOfSoloGamePlay,
		ranking
	FROM
		players p3 
	JOIN
		(SELECT pseudo, (SELECT COUNT(*) FROM players p2 WHERE p2.` + selectedEndpoint + ` IS NOT NULL AND p2.` + selectedEndpoint + ` > p.` + selectedEndpoint + `) + 1 AS ranking
		FROM players p WHERE p.` + selectedEndpoint + ` IS NOT NULL
		ORDER BY p.` + selectedEndpoint + ` DESC) as rankedPlayer
	USING (pseudo)
	ORDER BY rankedPlayer.ranking ASC
	LIMIT 5;`)
	for rslt.Next() {
		newPlayer := PlayerData{
			IsSelectedPlayer: false,
		}
		rslt.Scan(&newPlayer.Uuid, &newPlayer.Pseudo, &newPlayer.Avatar, &newPlayer.TotalScore, &newPlayer.NumberGameWin, &newPlayer.NumberGameLoose, &newPlayer.AvgAccuracy, &newPlayer.KillPerSeconde, &newPlayer.NumberOfSoloGamePlay, &newPlayer.Ranking)
		if newPlayer.Uuid == uuid {
			newPlayer.IsSelectedPlayer = true
		}
		data[newPlayer.Ranking] = newPlayer
	}
	return data
}

func GetPlayerOnEndpoint(limitMin, limitMax int, selectedEndpoint, uuid string, selectedValue interface{}) LeaderBoardData {
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
		ORDER BY distance ASC
		LIMIT `+fmt.Sprint(limitMax)+`) ORDER BY distance ASC ) as closedPlayer
	JOIN
		(SELECT pseudo, (SELECT COUNT(*) FROM players p2 WHERE p2.`+selectedEndpoint+` IS NOT NULL AND p2.`+selectedEndpoint+` > p.`+selectedEndpoint+`) + 1 AS ranking
		FROM players p WHERE p.`+selectedEndpoint+` IS NOT NULL
		ORDER BY p.`+selectedEndpoint+` DESC) as rankedPlayer
	USING (pseudo)
	ORDER BY rankedPlayer.ranking ASC;
	`, selectedValue, selectedValue, uuid, selectedValue, selectedValue)
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
	data.Top5 = GetTop5(selectedEndpoint, uuid)
	for key := range data.Data {
		if _, keyExist := data.Top5[key]; keyExist {
			delete(data.Data, key)
		}
	}
	return data
}
