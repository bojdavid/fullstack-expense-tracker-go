package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"expense-tracker/internal/config"
	"expense-tracker/internal/database"
	"expense-tracker/internal/handlers"
	"expense-tracker/internal/repository"

	_ "github.com/go-sql-driver/mysql"
)

func handleRequest(cfg *config.Config, transRepo *repository.TransactionRepository, categoryRepo *repository.CategoryRepository) {
	myRoute := mux.NewRouter().StrictSlash(true)
	transHandler := handlers.NewTransactionHandler(transRepo)
	catHandler := handlers.NewCategoryHandler(categoryRepo)

	myRoute.HandleFunc("/login", handlers.LoginHandler)
	myRoute.HandleFunc("/register", handlers.RegisternHandler)

	// categories route
	myRoute.HandleFunc("/add-category", handlers.AddCategory)
	myRoute.HandleFunc("/delete-category", handlers.DeleteCategories)
	myRoute.HandleFunc("/update-category", handlers.UpdateCategories)
	myRoute.HandleFunc("/get-categories", catHandler.GetCategories).Methods("GET")

	// transactions  route
	myRoute.HandleFunc("/update-transaction", transHandler.UpdateTransaction).Methods("PUT")
	myRoute.HandleFunc("/delete-transaction", transHandler.DeleteTransaction).Methods("DELETE")
	myRoute.HandleFunc("/add-transactions", transHandler.AddTransaction).Methods("POST")
	myRoute.HandleFunc("/get-transactions", transHandler.GetTransaction).Methods("GET")

	fmt.Printf("Server running on port %s\n", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, myRoute))

}

func main() {
	fmt.Println("Starting expense tracker api")

	cfg := config.LoadConfig()
	db := database.ConnectDB(cfg)
	defer db.Close() // Ensure the connection closes when the app stops

	// 3. Setup Layers (Dependency Injection)
	// We plug DB -> Repo -> Handler
	transRepo := repository.NewTransactionRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)

	//Start the Server
	handleRequest(cfg, transRepo, categoryRepo)

}
