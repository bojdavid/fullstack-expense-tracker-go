package handlers

import (
	"encoding/json"
	"net/http"
)

func GetAllGroups(w http.ResponseWriter, r *http.Request) {
	//Get all groups the user is currently in, return no groups if the user is not in any
	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "Data of all the groups the user is on"})
}

func GetGroup(w http.ResponseWriter, r *http.Request) {
	/*
		Get a single group by userId and groupId, returns the neccessary values, also displays all members in the group

	*/
	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "Single Group"})
}

func EditGroup(w http.ResponseWriter, r *http.Request) {
	/*
		Edit the group Name or any other thing i guess
		only admins can edit group

	*/
	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "Edit group"})
}

func DeleteGroup(w http.ResponseWriter, r *http.Request) {
	/*
		only admins can delete group
	*/
	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "Delete group"})
}

func CreateGroup(w http.ResponseWriter, r *http.Request) {
	/*
		only admins can delete group
	*/
	w.Header().Set("Content-Type", "Application/json")

	json.NewEncoder(w).Encode(map[string]string{"message": "Create group"})
}
