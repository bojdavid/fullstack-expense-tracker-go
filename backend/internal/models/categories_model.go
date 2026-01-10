package models

import "database/sql"

type Category struct {
	ID        string         `json:"id" db:"id"`
	UserID    sql.NullString `json:"userId" db:"user_id"`
	Name      string         `json:"name" db:"name"`
	Type      string         `json:"type" db:"type"` // 'income' or 'expense'
	IsDefault bool           `json:"isDefault" db:"is_default"`
}

type CategoryResponse struct {
	Message string `json:"message"`
	Data    Category
}

type GetAllCategoriesResponse struct {
	Message string `json:"message"`
	Total   int
	Data    []Category
}
