package post

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
)

type RequestedPlayer struct {
	Pseudo string `json:"username" validate:"required,alphanum"`
}

func RequestFriend(w http.ResponseWriter, r *http.Request) {
	receiveToken := r.Header.Get("Authorization")
	encodedBody := json.NewDecoder(r.Body)
	defer r.Body.Close()
	var requestData RequestedPlayer
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
		rslt := bdd.DbManager.SelectDB("SELECT playerUUID FROM players WHERE pseudo=? AND playerUUID != ?", requestData.Pseudo, claims["UUID"])
		if rslt.Next() {
			var requestedPlayerUUID string
			rslt.Scan(&requestedPlayerUUID)
			rslt.Close()
			rslt = bdd.DbManager.SelectDB("SELECT requestedPlayerUUID FROM friendsRequests WHERE requestingPlayerUUID=? AND requestedPlayerUUID=?", claims["UUID"], requestedPlayerUUID)
			if !rslt.Next() {
				rslt.Close()
				rslt = bdd.DbManager.SelectDB("SELECT friendsId  FROM friends f WHERE (player1UUID =? AND player2UUID =?) OR player2UUID = (player1UUID =? AND player2UUID =?)", claims["UUID"], requestedPlayerUUID, requestedPlayerUUID, claims["UUID"])
				if !rslt.Next() {
					rslt.Close()
					w.WriteHeader(http.StatusAccepted)
					bdd.DbManager.AddDeleteUpdateDB(`
				INSERT INTO friendsRequests (requestingPlayerUUID, requestedPlayerUUID) VALUES (?, ?)
				`, claims["UUID"], requestedPlayerUUID)
					return
				} else {
					rslt.Close()
					http.Error(w, "This player are already friend", http.StatusUnauthorized)
					return
				}
			} else {
				rslt.Close()
				http.Error(w, "This request already exist", http.StatusUnauthorized)
				return
			}
		}
		http.Error(w, "This requested user don't exist", http.StatusBadRequest)
	} else {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		fmt.Println("Failed to get claims in RequestFriend method")
		return
	}
}
