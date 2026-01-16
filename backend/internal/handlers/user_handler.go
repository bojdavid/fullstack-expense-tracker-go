package handlers

import (
	"encoding/json"
	"expense-tracker/internal/config"
	"expense-tracker/internal/models"
	"expense-tracker/internal/repository"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	repo *repository.UserRepository
	cfg  *config.Config
}

func NewAuthHandler(repo *repository.UserRepository, cfg *config.Config) *AuthHandler {
	return &AuthHandler{repo: repo, cfg: cfg}
}

func (u *AuthHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "Application/json")
	var response models.UserL_Response
	var payload models.User_Login

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		response.Message = "invalid json format"
		w.WriteHeader(500)
	}

	data, err := u.repo.GetUserByEmail(payload.Email)

	if err != nil {
		w.WriteHeader(500)
		response.Message = "Invalid email or password"
		json.NewEncoder(w).Encode(response)
		return
	}
	err_hash := bcrypt.CompareHashAndPassword([]byte(data.Password), []byte(payload.Password))
	if err_hash != nil {
		response.Message = err_hash.Error()
		w.WriteHeader(401)
	} else {

		// 3. Generate JWT
		expirationTime := time.Now().Add(24 * time.Hour)
		claims := &models.MyCustomClaims{
			UserID: data.ID,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(expirationTime),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

		tokenString, err := token.SignedString([]byte(u.cfg.Jwt_Secret))
		if err != nil {
			w.WriteHeader(500)
			return
		}

		response.Token = tokenString
		response.Message = "Login Successful"
		response.Status = true
	}

	json.NewEncoder(w).Encode(response)
	fmt.Println("Login route handler")
}

func (u *AuthHandler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "Application/json")
	var response models.User_Response

	err := json.NewDecoder(r.Body).Decode(&response.Data)
	if err != nil {
		w.WriteHeader(500)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid json format"})
		return
	}

	hash, err2 := bcrypt.GenerateFromPassword([]byte(response.Data.Password), bcrypt.DefaultCost)
	if err2 != nil {
		w.WriteHeader(500)
		response.Message = err2.Error()
	}
	response.Data.Password = string(hash)

	err_ := u.repo.CreateNewUser(response.Data)
	if err_ != nil {
		w.WriteHeader(http.StatusBadRequest)
		response.Message = err_.Error()
	} else {
		response.Message = "User created successfully"
		response.Status = true
		w.WriteHeader(http.StatusCreated)
	}

	json.NewEncoder(w).Encode(response)

	fmt.Println("regsiter route handler")
}
