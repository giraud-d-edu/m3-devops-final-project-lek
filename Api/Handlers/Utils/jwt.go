package utils

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var j = os.Getenv("JWT_SECRET")
var jwtKey = []byte(j)

func CreateJWT(userUUID *string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["UUID"] = *userUUID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	tokenString, err := token.SignedString(jwtKey)
	return tokenString, err
}

func GetClaims(allTokenString *string) (jwt.MapClaims, error) {
	splittedToken := strings.Split(*allTokenString, ":")
	if claims, err := ParseJWT(&splittedToken[1]); err == nil {
		return claims, nil
	} else {
		return nil, err
	}
}

func ParseJWT(tokenString *string) (jwt.MapClaims, error) {
	// Testing the jwt encoding method and valid jwtKey
	token, err := jwt.Parse(*tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid encoding method: %v", token.Header["alg"])
		}
		return jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	// checks whether the token is valid and returns a dictionary with the information contained in it
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, fmt.Errorf("invalid token")
	}
}
