package get

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type GameTracking struct {
	TotalScore  int       `json:"score"`
	AvgAccuracy int       `json:"accuracy"`
	GameDate    time.Time `json:"gameDate"`
}
type HistoricGameTracking struct {
	Data map[string]GameTracking `json:"data"`
}
type Game struct {
	NumberOfLine string `json:"numberOfLine" validate:"required"`
}

func Tracking(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	requestData := Game{
		NumberOfLine: params["numberOfLine"][0],
	}
	if err := utils.Validator.Struct(&requestData); err != nil {
		fmt.Printf("Invalid request data in LeaderBoardWithLimit method : %v\n", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	receiveToken := r.Header.Get("Authorization")
	if claims, err := utils.GetClaims(&receiveToken); err == nil {
		var data HistoricGameTracking = HistoricGameTracking{Data: make(map[string]GameTracking)}
		rslt := bdd.DbManager.SelectDB(
			`
			SELECT 
				trackingGameId,
				accuracy,
				totalScore,
				gameDate
			FROM 
				trackingGames tg 
			WHERE 
				playerUUID = ?
			ORDER BY gameDate DESC
			LIMIT `+requestData.NumberOfLine+`
		`, claims["UUID"])
		for rslt.Next() {
			var newGame GameTracking
			var gameId int
			rslt.Scan(&gameId, &newGame.AvgAccuracy, &newGame.TotalScore, &newGame.GameDate)
			data.Data[fmt.Sprint(gameId)] = newGame
		}
		rslt.Close()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	} else {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		fmt.Println("Failed to get claims in LeaderBoard method")
		return
	}
}
