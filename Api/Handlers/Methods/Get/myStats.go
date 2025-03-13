package get

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
)

type MyStatsData struct {
	TotalScore           int     `json:"totalScore"`
	NumberGameWin        int     `json:"numberGameWin"`
	NumberGameLoose      int     `json:"numberGameLoose"`
	AvgAccuracy          int     `json:"avgAccuracy"`
	NumberOfSoloGamePlay int     `json:"numberOfSoloGamePlay"`
	KillPerSeconde       float64 `json:"kps"`
}

func MyStats(w http.ResponseWriter, r *http.Request) {
	receiveToken := r.Header.Get("Authorization")
	if claims, err := utils.GetClaims(&receiveToken); err == nil {
		rslt := bdd.DbManager.SelectDB(`
		SELECT 
			totalScore,
			numberOfWin,
			numberOfLoose,
			avgAccuracy,
			killPerSeconde,
			numberOfSoloGamePlay
		FROM
			players
		WHERE
			playerUUID = ?`, claims["UUID"])
		var myStats MyStatsData
		for rslt.Next() {
			rslt.Scan(&myStats.TotalScore, &myStats.NumberGameWin, &myStats.NumberGameLoose, &myStats.AvgAccuracy, &myStats.KillPerSeconde, &myStats.NumberOfSoloGamePlay)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(myStats)
		return
	} else {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		fmt.Println("Failed to get claims in MyStats method")
		return
	}
}
