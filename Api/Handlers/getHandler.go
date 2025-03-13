package handlers

import (
	get "api/Handlers/Methods/Get"
	"net/http"
	"strings"
)

var getHandlersWith2Endpoint = map[string]func(string, http.ResponseWriter, *http.Request){
	"leaderBoardWithLimit":           get.LeaderBoardWithLimit,
	"leaderboard":                    get.LeaderBoard,
	"leaderBoardWithFriendWithLimit": get.LeaderBoardWithFriendWithLimit,
	"leaderboardWithFriend":          get.LeaderBoardWithFriend,
}
var getHandlersWith1Endpoint = map[string]func(http.ResponseWriter, *http.Request){
	"myStats":        get.MyStats,
	"myProfile":      get.MyProfile,
	"myFriend":       get.Friend,
	"myGameGrid":     get.Grid,
	"myGameTracking": get.Tracking,
}

func GetHandler(w http.ResponseWriter, r *http.Request) {
	splitedPath := strings.Split(r.URL.Path, "/")
	if len(splitedPath) == 3 {
		if handler, handlerExist := getHandlersWith2Endpoint[splitedPath[1]]; handlerExist {
			handler(splitedPath[2], w, r)
		} else {
			http.Error(w, "Not Found", http.StatusNotFound)
		}
	} else {
		if handler, handlerExist := getHandlersWith1Endpoint[splitedPath[1]]; handlerExist {
			handler(w, r)
		} else {
			http.Error(w, "Not Found", http.StatusNotFound)
		}
	}
}
