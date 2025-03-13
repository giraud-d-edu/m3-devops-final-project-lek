package post

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
)

func AcceptFriend(w http.ResponseWriter, r *http.Request) {
	receiveToken := r.Header.Get("Authorization")
	encodedBody := json.NewDecoder(r.Body)
	defer r.Body.Close()
	var requestData RequestedId
	if err := encodedBody.Decode(&requestData); err != nil {
		http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
		return
	}
	if err := utils.Validator.Struct(&requestData); err != nil {
		fmt.Printf("Invalid request data in RequestFriend method : %v\n", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	if claims, err := utils.GetClaims(&receiveToken); err == nil {
		rslt := bdd.DbManager.SelectDB("SELECT requestingPlayerUUID FROM friendsRequests WHERE friendsRequestId = ? AND requestedPlayerUUID = ?;", requestData.RequestId, claims["UUID"])
		if rslt.Next() {
			var requestingPlayerUUID string
			rslt.Scan(&requestingPlayerUUID)
			rslt.Close()
			bdd.DbManager.AddDeleteUpdateDB("INSERT INTO friends (player1UUID, player2UUID) VALUES (?, ?);", requestingPlayerUUID, claims["UUID"])
			w.WriteHeader(http.StatusAccepted)
			bdd.DbManager.AddDeleteUpdateDB("DELETE FROM friendsRequests WHERE friendsRequestId = ?;", requestData.RequestId)
			return
		}
		http.Error(w, "This request does't exist", http.StatusBadRequest)
	} else {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		fmt.Println("Failed to get claims in AcceptFriend method")
		return
	}
}
