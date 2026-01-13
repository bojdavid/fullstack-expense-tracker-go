package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID        string     `json:"id" db:"id"`
	Name      string     `json:"name" db:"name"`
	Email     string     `json:"email" db:"email"`
	Password  string     `json:"password,omitempty" db:"password"` // omitempty/ - hides it from JSON
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
}

type User_Login struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"` // Plain text from request, hashed in DB
}

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

type User_Response struct {
	Message string `json:"message"`
	Data    User   `json:"data"`
	Status  bool   `json:"status"`
}

type UserL_Response struct {
	Message string `json:"message"`
	Token   string `json:"token"`
	Status  bool   `json:"status"`
}

type MyCustomClaims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}
