package handlers

import (
	"encoding/json"
	"expense-tracker/internal/models"
	"expense-tracker/internal/repository"
	"fmt"
	"net/http"
	"strconv"
)

type TransactionHandler struct {
	repo *repository.TransactionRepository
}

func NewTransactionHandler(repo *repository.TransactionRepository) *TransactionHandler {
	return &TransactionHandler{repo: repo}
}

func (h *TransactionHandler) GetTransaction(w http.ResponseWriter, r *http.Request) {
	// 1. Extract query parameters (e.g., /transactions?userId=1)
	userIDStr := r.URL.Query().Get("userId")

	// 2. Convert the string ID to an integer (Go is strict about types!)
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		// If the ID isn't a number, send a 400 Bad Request
		http.Error(w, "Invalid User ID format", http.StatusBadRequest)
		return
	}

	// 3. Ask the repository to get the data.
	transactions, err := h.repo.GetTransactionByUserID(userID)
	if err != nil {
		// If the database fails, send a 500 Internal Server Error
		http.Error(w, "Failed to retrieve transactions", http.StatusInternalServerError)
		return
	}

	var transactionResponse models.TransactionResponse
	transactionResponse.Transactions = transactions
	transactionResponse.Total = len(transactions)

	// 4. Set the header so the browser knows we are sending JSON data.
	w.Header().Set("Content-Type", "application/json")

	// 5. 'Encode' turns our Go slice into a JSON string and writes it to the response.
	json.NewEncoder(w).Encode(transactionResponse)
}

func (h *TransactionHandler) DeleteTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "Application/json")

	var payload models.AddTransactionResponse

	err := json.NewDecoder(r.Body).Decode(&payload.Data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		fmt.Println(err.Error())
		return
	}
	defer r.Body.Close()

	error := h.repo.DeleteTransaction(payload.Data.ID, payload.Data.UserID)

	if error != nil {
		w.WriteHeader(http.StatusBadRequest)
		payload.Message = error.Error()
	} else {
		w.WriteHeader(http.StatusAccepted)
		payload.Message = "transaction deleted successfully"
	}
	json.NewEncoder(w).Encode(payload)

	fmt.Println("delete transactions end point")
}

func (h *TransactionHandler) UpdateTransaction(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update transactions end point....")
	w.Header().Set("Content-Type", "application/json")
	var transactionData models.AddTransactionResponse

	err := json.NewDecoder(r.Body).Decode(&transactionData.Data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		return
	}
	defer r.Body.Close()

	transaction, err := h.repo.UpdateTransaction(transactionData.Data)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		transactionData.Message = err.Error()
		transactionData.Data = models.Transaction{}
	} else {
		w.WriteHeader(http.StatusCreated)
		transactionData.Message = "transaction updated successfully"
		transactionData.Data = transaction
	}
	json.NewEncoder(w).Encode(transactionData)

}

func (h *TransactionHandler) AddTransaction(w http.ResponseWriter, r *http.Request) {
	// Set header early so all responses (including errors) are JSON
	w.Header().Set("Content-Type", "application/json")

	var transactionData models.AddTransactionResponse

	err := json.NewDecoder(r.Body).Decode(&transactionData.Data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
		return
	}
	defer r.Body.Close()

	transaction, err := h.repo.AddTransactionByUserID(transactionData.Data)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		transactionData.Message = err.Error()
		transactionData.Data = models.Transaction{}
	} else {
		w.WriteHeader(http.StatusCreated)
		transactionData.Message = "transaction created successfully"
		transactionData.Data = transaction
	}
	json.NewEncoder(w).Encode(transactionData)

}
