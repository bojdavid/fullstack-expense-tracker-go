package handlers

import (
	"fmt"
	"net/http"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Login route handler")
}

func RegisternHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "regsiter route handler")
}
