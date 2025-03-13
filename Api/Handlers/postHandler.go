package handlers

import (
	postMethods "api/Handlers/Methods/Post"
	"net/http"
)

var posthandlers = map[string]func(http.ResponseWriter, *http.Request){
	"/signup":              postMethods.Register,
	"/signin":              postMethods.Login,
	"/soloPlayGrid":        postMethods.SoloPlayGrid,
	"/soloPlayTracking":    postMethods.SoloPlayTraking,
	"/requestFriend":       postMethods.RequestFriend,
	"/acceptFriendRequest": postMethods.AcceptFriend,
	"/refuseFriendRequest": postMethods.DeclineFriend,
}

func PostHandler(w http.ResponseWriter, r *http.Request) {
	if handler, handlerExist := posthandlers[r.URL.Path]; handlerExist {
		handler(w, r)
	} else {
		http.Error(w, "Not Found", http.StatusNotFound)
	}
}
