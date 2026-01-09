package repository

import (
	"database/sql"
	"errors"
	"expense-tracker/internal/models"
	"fmt"
)

type TransactionRepository struct {
	db *sql.DB
}

// NewTransactionRepository creates a new instance of the repository.
func NewTransactionRepository(db *sql.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) GetTransactionByUserID(userID int) ([]models.Transaction, error) {
	// 1. Define the SQL query. We use '?' as placeholders to prevent SQL Injection.
	query := `SELECT id, user_id, category_id, type, amount, date, note, description, created_at
              FROM transactions WHERE user_id = ?`

	// 2. Execute the query. This returns a 'rows' object.
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err // Return the error so the handler can notify the user
	}
	// 3. Very Important: Always close the rows to free up the DB connection.
	defer rows.Close()

	var transactions []models.Transaction

	// 4. Loop through the rows returned by the database.
	for rows.Next() {
		var t models.Transaction

		// 5. 'Scan' copies the data from the current row into the struct fields.
		// NOTE: The order of arguments must match the order in your SELECT statement.
		err := rows.Scan(
			&t.ID,
			&t.UserID,
			&t.CategoryID,
			&t.Type,
			&t.Amount,
			&t.Date,
			&t.Note,        // Scans into a *string to handle NULLs
			&t.Description, // Scans into a *string to handle NULLs
			&t.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		// 6. Append the populated struct to our slice (list).
		transactions = append(transactions, t)
	}

	// 7. Check if the loop encountered any errors during iteration.
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}

func (r *TransactionRepository) AddTransactionByUserID(t models.Transaction) (models.Transaction, error) {
	query := `INSERT INTO transactions (id, user_id, category_id, type, amount, date, note, description) 
              VALUES (UUID(),?, ?, ?, ?, ?, ?, ?)`

	_, err := r.db.Exec(query, t.UserID, t.CategoryID, t.Type, t.Amount, t.Date, t.Note, t.Description)
	if err != nil {
		// Return an empty transaction and the error
		return models.Transaction{}, err
	}

	return t, nil

	// Use QueryRow instead of Exec to capture the returned ID

}

func (r *TransactionRepository) UpdateTransaction(t models.Transaction) (models.Transaction, error) {
	// DEBUG: Check if ID exists before trying to update
	var exists int
	err := r.db.QueryRow("SELECT COUNT(*) FROM transactions WHERE id = ?", t.ID).Scan(&exists)
	fmt.Printf("Debug: Found %d rows with ID %s\n", exists, t.ID)

	query := `UPDATE transactions SET amount = ?, note = ?, date = ?, description = ?  WHERE id = ?`
	// Use Exec for UPDATE statements
	result, err := r.db.Exec(query, t.Amount, t.Note, t.Date, t.Description, t.ID)
	if err != nil {
		return t, err
	}

	// Check if the ID actually existed
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return t, err
	}
	fmt.Println(rowsAffected)
	if rowsAffected == 0 && exists == 0 {
		return t, errors.New("no transaction found with the given ID")
	}
	if rowsAffected == 0 && exists > 0 {
		return t, errors.New("no changes were made to the new update")
	}

	return t, nil
}

// delete a transasction record
func (r *TransactionRepository) DeleteTransaction(transactionID string, userID string) error {
	// 1. Use the DELETE SQL command.
	// We check for both ID and UserID so a user can't delete someone else's data.
	query := `DELETE FROM transactions WHERE id = ? AND user_id = ?`

	// 2. Use Exec instead of Query.
	// Exec is for statements that don't return rows.
	result, err := r.db.Exec(query, transactionID, userID)
	if err != nil {
		return err
	}

	// 3. Optional: Check if a row was actually deleted.
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no transaction found with ID %s for this user", transactionID)
	}

	return nil
}
