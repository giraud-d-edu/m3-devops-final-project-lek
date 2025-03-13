package bdd

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// In this file we create a structure that will be used to use the database in sqlite with 4 functions

var DbManager *DatabaseManager

type DatabaseManager struct{}

func NewDatabaseManager() *DatabaseManager {
	return &DatabaseManager{}
}

func (dm *DatabaseManager) OpenDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./BDD/db.db")
	if err != nil {
		return nil, err
	}
	return db, nil
}

func (dm *DatabaseManager) CloseDB(db *sql.DB) error {
	if db != nil {
		return db.Close()
	}
	return nil
}

func (dm *DatabaseManager) SelectDB(query string, args ...interface{}) *sql.Rows {
	db, err := dm.OpenDB()
	// fmt.Printf("Query : %v\n", query)
	if err != nil {
		fmt.Printf("error in the function SelectDB in open db : %v\n", err)
		return nil
	}
	defer dm.CloseDB(db)

	rows, err := db.Query(query, args...)
	if err != nil {
		fmt.Printf("Error in Select method: %v\n", err)
		fmt.Printf("Query : %v\n", query)
		return nil
	}
	return rows
}

func (dm *DatabaseManager) AddDeleteUpdateDB(query string, args ...interface{}) sql.Result {
	db, err := dm.OpenDB()
	if err != nil {
		fmt.Printf("error in the function AddDeleteUpdateDB in open db : %v\n", err)
		return nil
	}
	defer dm.CloseDB(db)
	result, err := db.Exec(query, args...)
	if err != nil {
		fmt.Printf("error in the function AddDeleteUpdateDB : %v\n", err)
		return nil
	}
	return result
}
