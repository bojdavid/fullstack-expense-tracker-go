package handlers

import (
	"encoding/json"
	"expense-tracker/internal/models"
	"expense-tracker/internal/repository"
	"fmt"
	"net/http"
)

type CategoryHandler struct {
	repo *repository.CategoryRepository
}

func NewCategoryHandler(repo *repository.CategoryRepository) *CategoryHandler {
	return &CategoryHandler{repo: repo}
}

func (c *CategoryHandler) GetCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "Application/json")
	var categories []models.Category

	userId := r.URL.Query().Get("userId")

	cats, err := c.repo.GetCategoriesByUserID(userId)
	if err != nil {
		http.Error(w, "Failed to retrieve categories", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	categories = cats
	json.NewEncoder(w).Encode(categories)

	fmt.Fprint(w, "get categories end point")
}

func DeleteCategories(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "delete categories end point")
}

func UpdateCategories(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "update categories end point")
}

func AddCategory(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "add categories end point")
}
