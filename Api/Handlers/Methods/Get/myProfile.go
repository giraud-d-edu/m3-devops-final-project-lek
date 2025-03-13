package get

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
)

type MyProfileData struct {
	Pseudo string `json:"pseudo"`
	Avatar string `json:"avatar"`
	Email  string `json:"email"`
}

func MyProfile(w http.ResponseWriter, r *http.Request) {
	receiveToken := r.Header.Get("Authorization")
	if claims, err := utils.GetClaims(&receiveToken); err == nil {
		rslt := bdd.DbManager.SelectDB(`
		SELECT 
			pseudo,
			avatarProfile,
			email
		FROM
			players
		WHERE
			playerUUID = ?`, claims["UUID"])
		var myStats MyProfileData
		for rslt.Next() {
			rslt.Scan(&myStats.Pseudo, &myStats.Avatar, &myStats.Email)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(myStats)
		return
	} else {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		fmt.Println("Failed to get claims in MyProfile method")
		return
	}
}
