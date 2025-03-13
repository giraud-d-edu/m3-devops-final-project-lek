package get

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func LeaderBoardWithLimit(endpoint string, w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	requestData := utils.LeaderBoardReceive{
		LimitMin: params["limitMin"][0],
		LimitMax: params["limitMax"][0],
	}
	if err := utils.Validator.Struct(&requestData); err != nil {
		fmt.Printf("Invalid request data in LeaderBoardWithLimit method : %v\n", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
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
		lim1, _ := strconv.Atoi(requestData.LimitMin)
		lim2, _ := strconv.Atoi(requestData.LimitMax)
		for rslt.Next() {
			rslt.Scan(&rawPlayer.Uuid, &rawPlayer.SelectedData)
		}
		if uuid, ok := claims["UUID"].(string); ok {
			data = utils.GetPlayerOnEndpoint(lim1, lim2, selectedEndpoint, uuid, rawPlayer.SelectedData)
			data.LimitMin, data.LimitMax = lim1, lim2
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
