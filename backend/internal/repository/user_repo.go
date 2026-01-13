package repository

import (
	"database/sql"
	"expense-tracker/internal/models"
	"fmt"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (u *UserRepository) CreateNewUser(userData models.User) error {
	// 1. Check if user already exists
	var existingEmail string
	query_check := `SELECT email FROM users WHERE email = ?`

	// We try to scan the email into the variable.
	// If it finds a row, err will be nil (User Exists!)
	err := u.db.QueryRow(query_check, userData.Email).Scan(&existingEmail)

	// If err is nil, it means we found a user with that email
	if err == nil {
		return fmt.Errorf("user with email %s already exists", userData.Email)
	}

	// If the error is something OTHER than "No Rows Found", it's a real DB error
	if err != sql.ErrNoRows {
		return err
	}

	// 2. If we reach here, the email is available. Proceed with INSERT
	query := `INSERT INTO users (id, name, email, password) VALUES(UUID(), ?, ?, ?)`

	_, err = u.db.Exec(query, userData.Name, userData.Email, userData.Password)
	if err != nil {
		return err
	}

	return nil
}

func (u *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	query := `SELECT id, name, email, password, created_at FROM users WHERE email = ?`

	err := u.db.QueryRow(query, email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
