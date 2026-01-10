package repository

import (
	"database/sql"
	"errors"
	"expense-tracker/internal/models"
	"fmt"
)

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (c *CategoryRepository) GetCategoriesByUserID(userId string) ([]models.Category, error) {
	query := `select id, name, type, is_default, user_id from categories where user_id=? or is_default = 1`

	rows, err := c.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []models.Category

	for rows.Next() {
		var cat models.Category
		err := rows.Scan(
			&cat.ID,
			&cat.Name,
			&cat.Type,
			&cat.IsDefault,
			&cat.UserID,
		)
		if err != nil {
			return nil, err
		}

		categories = append(categories, cat)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}

func (c *CategoryRepository) DeleteCategory(id string) error {
	var isDefault bool
	var categoryID string
	query := `SELECT id, is_default FROM categories WHERE id = ? `

	// Execute the query and Scan the result into variables
	err := c.db.QueryRow(query, id).Scan(&categoryID, &isDefault)

	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("category not found")
		}
		return err
	}

	// If is_default is true (1 in MySQL), we prevent deletion
	if isDefault {
		return fmt.Errorf("cannot delete category: it is a default category")
	}

	// If it's not default, proceed with deletion
	deleteQuery := `DELETE FROM categories WHERE id = ?`
	_, err = c.db.Exec(deleteQuery, id)
	if err != nil {
		return fmt.Errorf("failed to delete category: %v", err)
	}

	return nil
}

func (c *CategoryRepository) UpdateCategories(category models.Category) (models.Category, error) {
	var exists int
	err := c.db.QueryRow("SELECT COUNT(*) FROM categories WHERE id = ? ", category.ID).Scan(&exists)

	query := `UPDATE categories set name=? where user_id = ? and id=?`
	result, err := c.db.Exec(query, category.Name, category.UserID, category.ID)
	if err != nil {
		return category, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return category, err
	}
	fmt.Println(rowsAffected)
	if rowsAffected == 0 && exists == 0 {
		return category, errors.New("no category found with the given ID")
	}
	if rowsAffected == 0 && exists > 0 {
		return category, errors.New("no changes were made to the new update")
	}

	return category, nil
}

func (c *CategoryRepository) AddCategory(category models.Category) (models.Category, error) {
	query := `INSERT INTO categories(id, user_id, name, type, is_default) VALUES (UUID(), ?, ?, ?, ?)`

	_, err := c.db.Exec(query, category.UserID, category.Name, category.Type, category.IsDefault)
	if err != nil {
		return category, err
	}

	return category, nil
}
