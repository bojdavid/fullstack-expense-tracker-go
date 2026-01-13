// internal/middleware/auth.go
package middleware

import (
	"context"
	"encoding/json"
	"expense-tracker/internal/models"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// Pass the secret string as a parameter here
func AuthMiddleware(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

			token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
				// Use the secret passed from the config
				return []byte(secret), nil
			})

			if err != nil || !token.Valid {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]interface{}{
					"status":  false,
					"message": "unauthorized user",
				})
				return
			}

			ctx := context.WithValue(r.Context(), "userID", claims.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
