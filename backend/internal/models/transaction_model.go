package models

import (
	"time"
)

type TransactionType string

const (
	Income  TransactionType = "income"
	Expense TransactionType = "expense"
)

type Transaction struct {
	ID          string          `json:"id" db:"id"`
	UserID      string          `json:"userId" db:"user_id"`
	CategoryID  string          `json:"categoryId" db:"category_id"`
	Type        TransactionType `json:"type" db:"type"`
	Amount      float64         `json:"amount" db:"amount"`
	Date        *time.Time      `json:"date" db:"date"`
	Note        *string         `json:"note" db:"note"` // Pointer allows null in JSON
	Description *string         `json:"description" db:"description"`
	CreatedAt   time.Time       `json:"createdAt" db:"created_at"`
}

type TransactionResponse struct {
	Total        int `json:"total"`
	Transactions []Transaction
}

type AddTransactionResponse struct {
	Message string      `json:"message"`
	Data    Transaction `json:"data"`
}
