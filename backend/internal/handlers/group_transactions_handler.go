package handlers

import (
	"encoding/json"
	"net/http"
)

func GetAllGroupTransactions(w http.ResponseWriter, r *http.Request) {
	/*
		Get All group transactions - group-id
	*/

	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "All group transactions []"})
}

func AddGroupTransaction(w http.ResponseWriter, r *http.Request) {
	/*
		Add a transaction to for the group, group-id, user-id
	*/

	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "Add group transaction (income/expense)"})
}

func DeleteGroupTransaction(w http.ResponseWriter, r *http.Request) {
	/*
		Delete a transaction to for the group
		Only admins can delete group transactions
	*/

	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "delete group transaction (income/expense)"})
}

func EditGroupTransaction(w http.ResponseWriter, r *http.Request) {
	/*
		Update a transaction for the group - group-id, user-id
		only admins can make updates to transactions
	*/

	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "update group transaction (income/expense)"})
}
