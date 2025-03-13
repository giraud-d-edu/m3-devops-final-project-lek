package post

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type ReceiveSoloPlayTraking struct {
	Accuracy int `json:"accuracy" validate:"required,numeric"`
	Score    int `json:"score" validate:"required,numeric"`
}

func SoloPlayTraking(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	var requestData ReceiveSoloPlayTraking
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
		return
	}
	if err := utils.Validator.Struct(requestData); err != nil {
		fmt.Printf("Invalid request data in SoloPlay method : %v\n", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	receiveToken := r.Header.Get("Authorization")
	if claims, err := utils.GetClaims(&receiveToken); err == nil {
		sqlQuery := `
		UPDATE 
			players 
		SET 
			numberOfSoloGamePlay = numberOfSoloGamePlay + 1,
			avgAccuracy = (avgAccuracy + ?)/2,
			totalScore = totalScore + ?
		WHERE playerUUID = ?;
		`
		bdd.DbManager.AddDeleteUpdateDB(sqlQuery, requestData.Accuracy, requestData.Score, claims["UUID"])
		sqlQuery = `
		INSERT INTO trackingGames 
		(playerUUID, accuracy, totalScore, gameDate) 
		VALUES (?,?,?,?);
		`
		bdd.DbManager.AddDeleteUpdateDB(sqlQuery, claims["UUID"], requestData.Accuracy, requestData.Score, time.Now())
		w.WriteHeader(http.StatusAccepted)
	} else {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		fmt.Println("Failed to get claims in SoloPlay method")
	}
}
