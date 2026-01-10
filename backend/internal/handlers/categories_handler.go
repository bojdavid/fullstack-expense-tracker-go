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
	var categories models.GetAllCategoriesResponse

	userId := r.URL.Query().Get("userId")

	cats, err := c.repo.GetCategoriesByUserID(userId)
	if err != nil {
		w.WriteHeader(400)
		categories.Data = nil
		categories.Message = "Failed to retrieve categories"
		fmt.Println(err)

	} else {
		categories.Data = cats
		categories.Message = "All categories"
		categories.Total = len(cats)
	}

	json.NewEncoder(w).Encode(categories)

}

func (c *CategoryHandler) DeleteCategories(w http.ResponseWriter, r *http.Request) {

	fmt.Println("delete categories end point")

	w.Header().Set("Content-Type", "Application/json")

	var response models.CategoryResponse

	err := json.NewDecoder(r.Body).Decode(&response.Data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		return
	}
	defer r.Body.Close()

	err_ := c.repo.DeleteCategory(response.Data.ID)
	if err_ != nil {
		w.WriteHeader(http.StatusBadRequest)
		response.Message = err_.Error()
	} else {
		w.WriteHeader(200)
		response.Message = "Transaction deleted successfully"
	}

	json.NewEncoder(w).Encode(response)
}

func (c *CategoryHandler) UpdateCategories(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update categories end point")
	w.Header().Set("Content-Type", "Application/json")

	var response models.CategoryResponse

	err := json.NewDecoder(r.Body).Decode(&response.Data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		return
	}
	defer r.Body.Close()

	_, err_ := c.repo.UpdateCategories(response.Data)
	if err_ != nil {
		w.WriteHeader(http.StatusBadRequest)
		response.Message = err_.Error()
	} else {
		w.WriteHeader(201)
		response.Message = "Category updated successfully"

	}

	json.NewEncoder(w).Encode(response)

}

func (c *CategoryHandler) AddCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "Application/json")

	var response models.CategoryResponse
	err := json.NewDecoder(r.Body).Decode(&response.Data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		return
	}
	defer r.Body.Close()

	_, err_ := c.repo.AddCategory(response.Data)
	if err_ != nil {
		w.WriteHeader(http.StatusBadRequest)
		response.Message = err_.Error()
	} else {
		response.Message = "Category Added Successfully"
		w.WriteHeader(201)
	}

	json.NewEncoder(w).Encode(response)

}
