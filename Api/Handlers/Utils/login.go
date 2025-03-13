package utils

import (
	bdd "api/BDD"

	"golang.org/x/crypto/bcrypt"
)

type Player struct {
	Login    string `json:"login" validate:"required,alphanum"`
	Password string `json:"password" validate:"required"`
}

func IsUserExist(requestData *Player) (bool, string) {
	rslt := bdd.DbManager.SelectDB("SELECT playerUUID,password FROM players WHERE (email=? OR pseudo=?)", requestData.Login, requestData.Login)
	defer rslt.Close()
	if rslt.Next() {
		var playerUUID, password string
		rslt.Scan(&playerUUID, &password)
		err := bcrypt.CompareHashAndPassword([]byte(password), []byte(requestData.Password))
		if err == nil {
			if jwtToken, err := CreateJWT(&playerUUID); err != nil {
				return false, ""
			} else {
				return true, jwtToken
			}
		}
	}
	return false, ""
}
