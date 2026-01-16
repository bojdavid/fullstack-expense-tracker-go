package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

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

	// --- CORS IMPLEMENTATION START ---
	c := cors.New(cors.Options{
		// Allow all origins for development.
		//AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173"},
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: false, // Must be false if AllowedOrigins is "*"
		Debug:            false,
	})

	// Wrap the entire router with the CORS middleware
	handler := c.Handler(myRoute)
	// --- CORS IMPLEMENTATION END ---
	fmt.Printf("Server running on port %s\n", cfg.Port)
	// IMPORTANT: Pass 'handler' (with CORS) instead of 'myRoute'
	log.Fatal(http.ListenAndServe(":"+cfg.Port, handler))
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
