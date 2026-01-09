package models

import "time"

type User struct {
	ID        int        `json:"id" db:"id"`
	Name      string     `json:"name" db:"name"`
	Email     string     `json:"email" db:"email"`
	Password  string     `json:"password,omitempty" db:"password"` // omitempty/ - hides it from JSON
	CreatedAt *time.Time `json:"createdAt" db:"created_at"`
}
