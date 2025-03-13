package get

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
)

func getRankingOfOnePlayer(uuid, selectedEndpoint string) int {
	rslt := bdd.DbManager.SelectDB(`
	SELECT
		ranking
	FROM
		players p
	INNER JOIN
		(SELECT pseudo, (SELECT COUNT(*) FROM players p2 WHERE p2.`+selectedEndpoint+` IS NOT NULL AND p2.`+selectedEndpoint+` > p.`+selectedEndpoint+`) + 1 AS ranking
		FROM players p WHERE p.`+selectedEndpoint+` IS NOT NULL
		ORDER BY p.`+selectedEndpoint+` DESC) as rankedPlayer
	USING (pseudo)
	WHERE playerUUID = ?
	`, uuid)
	var Ranking int
	for rslt.Next() {
		rslt.Scan(&Ranking)
	}
	return Ranking
}

func LeaderBoard(endpoint string, w http.ResponseWriter, r *http.Request) {
	receiveToken := r.Header.Get("Authorization")
	if claims, err := utils.GetClaims(&receiveToken); err == nil {
		var selectedEndpoint string
		switch endpoint {
		case "kps":
			selectedEndpoint = "killPerSeconde"
		case "win":
			selectedEndpoint = "numberOfWin"
		case "loose":
			selectedEndpoint = "numberOfLoose"
		case "solo":
			selectedEndpoint = "numberOfSoloGamePlay"
		case "acc":
			selectedEndpoint = "avgAccuracy"
		case "score":
			selectedEndpoint = "totalScore"
		default:
			http.Error(w, "Invalid endpoint", http.StatusUnauthorized)
			fmt.Printf("Invalid endpoint : %v\n", endpoint)
			return
		}
		var data utils.LeaderBoardData
		rslt := bdd.DbManager.SelectDB("SELECT playerUUID, "+selectedEndpoint+" FROM players WHERE playerUUID = ?", claims["UUID"])
		var rawPlayer utils.RawPlayer
		for rslt.Next() {
			rslt.Scan(&rawPlayer.Uuid, &rawPlayer.SelectedData)
		}
		if uuid, ok := claims["UUID"].(string); ok {
			ranking := getRankingOfOnePlayer(uuid, selectedEndpoint)
			if ranking <= 5 {
				data = utils.GetPlayerOnEndpoint(ranking-1, 5+(5-(ranking-1)), selectedEndpoint, uuid, rawPlayer.SelectedData)
				data.LimitMin, data.LimitMax = ranking-1, 5+(5-(ranking-1))
			} else {
				data = utils.GetPlayerOnEndpoint(5, 5, selectedEndpoint, uuid, rawPlayer.SelectedData)
				data.LimitMin, data.LimitMax = 5, 5
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	} else {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		fmt.Println("Failed to get claims in LeaderBoard method")
		return
	}
}
