package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBPassword string
	DBName     string
	DBUser     string
	Port       string
	Jwt_Secret string
}

func LoadConfig() *Config {
	// It's okay if .env is missing in production (env vars might be set in the OS)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from system environment")
	}

	return &Config{
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBName:     os.Getenv("DB_NAME"),
		DBUser:     os.Getenv("DB_USER"),
		Port:       getEnv("PORT", "8080"), // Default to 8080
		Jwt_Secret: getEnv("JWT_SECRET", "default_secret_key"),
	}
}

// Helper function to provide default values
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
