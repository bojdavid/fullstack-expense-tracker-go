package models

import "time"

type GroupRole string

const (
	RoleAdmin  GroupRole = "admin"  //can add income, (edit, delete )transactions
	RoleMember GroupRole = "member" //can only add expense and view transactions, admins should be notified when a member wants to add an income

)

// Group represents a shared workspace/wallet
type Group struct {
	ID          string     `json:"id" db:"id"`
	OwnerID     string     `json:"owner_id" db:"owner_id"` // The creator/super-admin - can delete group
	Name        string     `json:"name" db:"name"`         // Added: Groups need names
	MemberCount int        `json:"member_count" db:"member_count"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at" db:"updated_at"`
}

// GroupMember represents a user's relationship to a group
type GroupMember struct {
	UserID   string    `json:"user_id" db:"user_id"`
	GroupID  string    `json:"group_id" db:"group_id"`
	Role     GroupRole `json:"role" db:"role"` // "admin" or "member"
	JoinedAt time.Time `json:"joined_at" db:"joined_at"`
}

// GroupTransaction represents an expense or payment within a group
type GroupTransaction struct {
	ID        string          `json:"id" db:"id"`
	GroupID   string          `json:"group_id" db:"group_id"`
	UserID    string          `json:"user_id" db:"user_id"` // Who paid/initiated
	Amount    float64         `json:"amount" db:"amount"`   // Added: Essential field
	Type      TransactionType `json:"type" db:"type"`       // e.g., "EXPENSE" or "SETTLEMENT"
	Note      string          `json:"note" db:"note"`
	CreatedAt time.Time       `json:"created_at" db:"created_at"`

	// Virtual field: Not in DB, but often needed for frontend
	PaidBy string `json:"paid_by_name,omitempty" db:"-"`
}
