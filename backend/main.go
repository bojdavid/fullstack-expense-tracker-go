package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"expense-tracker/internal/config"
	"expense-tracker/internal/database"
	"expense-tracker/internal/handlers"
	"expense-tracker/internal/middleware"
	"expense-tracker/internal/repository"

	_ "github.com/go-sql-driver/mysql"
)

func handleRequest(cfg *config.Config, transRepo *repository.TransactionRepository, categoryRepo *repository.CategoryRepository, userRepo *repository.UserRepository) {
	myRoute := mux.NewRouter().StrictSlash(true)
	transHandler := handlers.NewTransactionHandler(transRepo)
	catHandler := handlers.NewCategoryHandler(categoryRepo)
	authHandler := handlers.NewAuthHandler(userRepo, cfg)

	myRoute.HandleFunc("/login", authHandler.LoginHandler).Methods("POST")
	myRoute.HandleFunc("/register", authHandler.RegisterHandler).Methods("POST")

	// PROTECTED ROUTES
	api := myRoute.PathPrefix("/api").Subrouter()
	api.Use(middleware.AuthMiddleware(cfg.Jwt_Secret)) // Protects everything below

	// categories route
	api.HandleFunc("/add-category", catHandler.AddCategory)
	api.HandleFunc("/delete-category", catHandler.DeleteCategories)
	api.HandleFunc("/update-category", catHandler.UpdateCategories)
	api.HandleFunc("/get-categories", catHandler.GetCategories).Methods("GET")

	// transactions  route
	api.HandleFunc("/update-transaction", transHandler.UpdateTransaction).Methods("PUT")
	api.HandleFunc("/delete-transaction", transHandler.DeleteTransaction).Methods("DELETE")
	api.HandleFunc("/add-transactions", transHandler.AddTransaction).Methods("POST")
	api.HandleFunc("/get-transactions", transHandler.GetTransaction).Methods("GET")

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
	userRepo := repository.NewUserRepository(db)

	//Start the Server
	handleRequest(cfg, transRepo, categoryRepo, userRepo)

}
