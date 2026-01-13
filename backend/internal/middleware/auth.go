package middleware

import (
	"context"
	"encoding/json"
	"expense-tracker/internal/handlers"
	"expense-tracker/internal/models"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get header: Authorization: Bearer <token>
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"status":  false,
				"message": "unauthorized user",
			})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &models.MyCustomClaims{}

		// 2. Parse and validate
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return handlers.JwtKey, nil
		})

		if err != nil || !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"status":  false,
				"message": "unauthorized user",
			})

			return
		}

		// Add UserID to context so other handlers can use it
		ctx := context.WithValue(r.Context(), "userID", claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
