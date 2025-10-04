import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  expenses: [],
  currentExpense: null,
  loading: false,
  error: null,
}

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload
      state.loading = false
    },
    setCurrentExpense: (state, action) => {
      state.currentExpense = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setLoading, setExpenses, setCurrentExpense, setError, clearError } = expenseSlice.actions
export default expenseSlice.reducer
