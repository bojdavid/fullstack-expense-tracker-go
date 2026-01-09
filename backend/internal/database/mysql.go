package database

import (
	"database/sql"
	"expense-tracker/internal/config"
	"fmt"
	"log"
	"time"
)

func ConnectDB(cfg *config.Config) *sql.DB {
	// 1. Define the Data Source Name (DSN)
	// Format: username:password@tcp(127.0.0.1:3306)/dbname
	dsn := fmt.Sprintf("%s:%s@tcp(127.0.0.1:3306)/%s?parseTime=true",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
	)

	// 2. Open the connection
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	// 3. Set connection pool settings (Best Practice)
	db.SetMaxOpenConns(10)           // Max total connections
	db.SetMaxIdleConns(5)            // Max connections sitting idle
	db.SetConnMaxLifetime(time.Hour) // Recycle connections after 1 hour

	// 4. Actually test the connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Database is unreachable:", err)
	}

	fmt.Println("Successfully connected to MySQL!")
	return db
}
