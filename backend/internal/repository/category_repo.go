package repository

import (
	"database/sql"
	//"errors"
	"expense-tracker/internal/models"
)

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (c *CategoryRepository) GetCategoriesByUserID(userId string) ([]models.Category, error) {
	query := `select id, name, type, is_default, user_id from categories where user_id=?`

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
