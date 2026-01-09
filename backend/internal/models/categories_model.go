package models

type Category struct {
	ID        string `json:"id" db:"id"`
	UserID    string `json:"userId" db:"user_id"`
	Name      string `json:"name" db:"name"`
	Type      string `json:"type" db:"type"` // 'income' or 'expense'
	IsDefault bool   `json:"isDefault" db:"is_default"`
}
