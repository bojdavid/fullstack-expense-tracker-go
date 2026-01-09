package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBPassword string
	DBName     string
	DBUser     string
	Port       string
}

func LoadConfig() *Config {
	godotenv.Load()
	return &Config{
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBName:     os.Getenv("DB_NAME"),
		DBUser:     os.Getenv("DB_USER"),
		Port:       os.Getenv("PORT"),
	}
}
