package get

import (
	bdd "api/BDD"
	utils "api/Handlers/Utils"
	"encoding/json"
	"fmt"
	"net/http"
)

type MyFriendData struct {
	Pseudo string `json:"pseudo"`
	Avatar string `json:"avatar"`
}
type FriendRequestData struct {
	Pseudo    string `json:"pseudo"`
	Avatar    string `json:"avatar"`
	RequestId int    `json:"requestId"`
}
type FriendData struct {
	MyFriends map[string]MyFriendData   `json:"myFriends"`
	Requests  map[int]FriendRequestData `json:"requests"`
}

func Friend(w http.ResponseWriter, r *http.Request) {
	receiveToken := r.Header.Get("Authorization")
	if claims, err := utils.GetClaims(&receiveToken); err == nil {
		var data FriendData = FriendData{MyFriends: make(map[string]MyFriendData), Requests: make(map[int]FriendRequestData)}
		rslt := bdd.DbManager.SelectDB(
			`SELECT
				fr.friendsRequestId,
				p.pseudo,
				p.avatarProfile
			FROM
				friendsRequests fr
			JOIN
				players p
			ON
				fr.requestingPlayerUUID = p.playerUUID
			WHERE
				fr.requestedPlayerUUID = ?
		`, claims["UUID"])
		for rslt.Next() {
			var newRequest FriendRequestData
			rslt.Scan(&newRequest.RequestId, &newRequest.Pseudo, &newRequest.Avatar)
			data.Requests[newRequest.RequestId] = newRequest
		}
		rslt.Close()
		rslt = bdd.DbManager.SelectDB(`
		SELECT 
			p.playerUUID,
			p.pseudo,
			p.avatarProfile 
		FROM
			friends f 
		JOIN players p ON f.player1UUID = p.playerUUID OR f.player2UUID  = p.playerUUID 
		WHERE 
			(f.player1UUID = ? OR f.player2UUID = ?) AND p.playerUUID <> ?;
		`, claims["UUID"], claims["UUID"], claims["UUID"])
		for rslt.Next() {
			var newFriend MyFriendData
			var friendUUid string
			rslt.Scan(&friendUUid, &newFriend.Pseudo, &newFriend.Avatar)
			data.MyFriends[friendUUid] = newFriend
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
