package put

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
)

type NewPlayer struct {
	Email  string `json:"email" validate:"required,email"`
	Pseudo string `json:"pseudo" validate:"required,alphanum"`
	Avatar string `json:"avatar" validate:"required,min=8"`
}

type ProfileReturnMessage struct {
	Updated bool `json:"updated"`
}

func Profile(w http.ResponseWriter, r *http.Request) {
	encodedBody := json.NewDecoder(r.Body)
	defer r.Body.Close()
	var requestData NewPlayer
	if err := encodedBody.Decode(&requestData); err != nil {
		http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
		return
	}
	if err := utils.Validator.Struct(&requestData); err != nil {
		fmt.Printf("Invalid request data in Profile method : %v\n", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	receiveToken := r.Header.Get("Authorization")
	if claims, err := utils.GetClaims(&receiveToken); err == nil {
		rslt := bdd.DbManager.SelectDB("SELECT playerUUID FROM players WHERE (email=? OR pseudo=?) AND playerUUID != ?", requestData.Email, requestData.Pseudo, claims["UUID"])
		defer rslt.Close()
		if rslt.Next() {
			http.Error(w, "This username or email already taken", http.StatusBadRequest)
			return
		}
		bdd.DbManager.AddDeleteUpdateDB(`
		UPDATE 
			players 
		SET 
			pseudo = ?,
			email = ?,
			avatarProfile = ?
		WHERE playerUUID = ?;
		`, requestData.Pseudo, requestData.Email, requestData.Avatar, claims["UUID"])
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ProfileReturnMessage{true})
	} else {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		fmt.Println("Failed to get claims in LeaderBoard method")
		return
	}
}
