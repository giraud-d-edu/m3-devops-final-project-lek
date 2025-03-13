package main

import (
	bdd "api/BDD"
	handlers "api/Handlers"
	utils "api/Handlers/Utils"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/go-playground/validator"
	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Erreur lors du chargement du fichier .env: %v", err)
	} else {
		fmt.Println("Fichier .env chargé avec succès !")
	}
}

func corsHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		h.ServeHTTP(w, r)
	})
}

func isValidToken(JWT *string) bool {
	if claims, err := utils.ParseJWT(JWT); err == nil && claims != nil {
		return true
	}
	return false
}

func authenticate(inLogin bool, validApiKey string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		splittedToken := strings.Split(tokenString, ":")
		if len(splittedToken) != 2 || splittedToken[0] != validApiKey {
			fmt.Printf("Api key invalid : %v\n", splittedToken[0])
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		if !inLogin && !isValidToken(&splittedToken[1]) {
			fmt.Printf("jwt invalid : %v\n", splittedToken[1])
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	LoadEnv()

	initDbManager := bdd.NewDatabaseManager()
	apiKey := os.Getenv("API_KEY")
	adress := os.Getenv("SERVER_ADRESS")
	bdd.DbManager = initDbManager
	if len(os.Args) > 1 && os.Args[1] == "--init" {
		bdd.Seeder()
		return
	}
	utils.Validator = validator.New()
	router := http.NewServeMux()
	router.Handle("/signin", authenticate(true, apiKey, http.HandlerFunc(handlers.MainHandler)))
	router.Handle("/signup", authenticate(true, apiKey, http.HandlerFunc(handlers.MainHandler)))
	router.Handle("/", authenticate(false, apiKey, http.HandlerFunc(handlers.MainHandler)))
	server := &http.Server{
		Addr:    adress,
		Handler: corsHandler(router),
	}
	fmt.Println("Serveur démarré sur : ", adress)
	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Erreur lors du démarrage du serveur:", err)
	}
}
