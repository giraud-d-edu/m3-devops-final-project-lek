package post

import (
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
)

func Login(w http.ResponseWriter, r *http.Request) {
	encodedBody := json.NewDecoder(r.Body)
	defer r.Body.Close()
	var requestData utils.Player
	if err := encodedBody.Decode(&requestData); err != nil {
		http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
		return
	}
	if err := utils.Validator.Struct(&requestData); err != nil {
		fmt.Printf("Invalid request data in Login method : %v\n", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	if isUserExist, jwtToken := utils.IsUserExist(&requestData); isUserExist {
		message := LoginAndRegisterMessage{Jwt: jwtToken}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(message)
	} else {
		http.Error(w, "This user don't exist", http.StatusUnauthorized)
		return
	}
}
