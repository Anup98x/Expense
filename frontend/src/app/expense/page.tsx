"use client";

import { useEffect, useState } from "react";

type Expense = {
  id: string;
  title: string;
  description: string;
  amount: number;
  created_at: string;
  category: string;
};

type ExpenseResponse = {
  total: number;
  page: number;
  page_size: number;
  items: Expense[];
};

const categories = [
  "trek",
  "fuel",
  "personal",
  "internet",
  "electricity",
  "others",
];

export default function ExpensePage() {
  // =========================
  // EXPENSE DATA
  // =========================

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // =========================
  // FILTERS
  // =========================

  const [category, setCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // =========================
  // ADD EXPENSE
  // =========================

  const [showAddModal, setShowAddModal] = useState(false);

  const [newExpense, setNewExpense] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
  });

  // =========================
  // UPDATE EXPENSE
  // =========================

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // =========================
  // GET EXPENSES
  // =========================

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (category) {
        params.append("category", category);
      }

      if (minAmount) {
        params.append("min_amount", minAmount);
      }

      if (maxAmount) {
        params.append("max_amount", maxAmount);
      }

      if (startDate) {
        params.append("start_date", startDate);
      }

      if (endDate) {
        params.append("end_date", endDate);
      }

      params.append("page", page.toString());
      params.append("page_size", pageSize.toString());

      const res = await fetch(
        `http://localhost:8000/expense/?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data: ExpenseResponse = await res.json();

      setExpenses(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RUN GET WHEN PAGE/FILTER CHANGES
  // =========================

  useEffect(() => {
    fetchExpenses();
  }, [page, category, minAmount, maxAmount, startDate, endDate]);

  // =========================
  // ADD EXPENSE
  // =========================

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      const res = await fetch("http://localhost:8000/expense/", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          title: newExpense.title,
          description: newExpense.description,
          amount: Number(newExpense.amount),
          category: newExpense.category,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add expense");
      }

      setShowAddModal(false);

      setNewExpense({
        title: "",
        description: "",
        amount: "",
        category: "",
      });

      fetchExpenses();
    } catch (err: any) {
      setError(err.message || "Failed to add expense");
    }
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const handleDeleteExpense = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const res = await fetch(`http://localhost:8000/expense/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete expense");
      }

      fetchExpenses();
    } catch (err: any) {
      setError(err.message || "Failed to delete expense");
    }
  };

  // =========================
  // UPDATE EXPENSE
  // =========================

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingExpense) {
      return;
    }

    try {
      setError("");

      const res = await fetch(
        `http://localhost:8000/expense/${editingExpense.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            title: editingExpense.title,
            description: editingExpense.description,
            amount: editingExpense.amount,
            category: editingExpense.category,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update expense");
      }

      setEditingExpense(null);

      fetchExpenses();
    } catch (err: any) {
      setError(err.message || "Failed to update expense");
    }
  };

  // =========================
  // FORMAT AMOUNT
  // =========================

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // TOTAL SPENDING ON CURRENT PAGE
  // =========================

  const totalSpending = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const totalPages = Math.ceil(total / pageSize);

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-slate-50">
      {/* NAVBAR */}

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white">
              $
            </div>

            <div>
              <h1 className="font-bold text-slate-900">ExpenseTracker</h1>

              <p className="text-xs text-slate-400">Personal Finance</p>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              FINANCE OVERVIEW
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Your Expenses
            </h2>

            <p className="mt-1 text-slate-500">
              Track and manage your spending.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
          >
            + Add Expense
          </button>
        </div>

        {/* SUMMARY */}

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-slate-500">Total Expenses</p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">{total}</h3>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-slate-500">Current Page Spending</p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              {formatAmount(totalSpending)}
            </h3>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-slate-500">Current Page</p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">{page}</h3>
          </div>
        </div>

        {/* FILTERS */}

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border">
          <h3 className="mb-5 font-semibold text-slate-900">Filter Expenses</h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border px-4 py-3"
            >
              <option value="">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              placeholder="Min amount"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border px-4 py-3"
            />

            <input
              type="number"
              min="0"
              placeholder="Max amount"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border px-4 py-3"
            />

            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border px-4 py-3"
            />

            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border px-4 py-3"
            />
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* EXPENSE LIST */}

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h3 className="font-semibold text-slate-900">Recent Expenses</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              Loading expenses...
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">No expenses found.</p>
            </div>
          ) : (
            <div className="divide-y">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-6 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
                      {expense.title.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {expense.title}
                      </h4>

                      <p className="text-sm text-slate-400">
                        {expense.description}
                      </p>

                      <div className="mt-1 flex gap-3 text-xs">
                        <span className="rounded-full bg-slate-100 px-2 py-1 capitalize">
                          {expense.category}
                        </span>

                        <span className="text-slate-400">
                          {formatDate(expense.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <p className="font-bold text-slate-900">
                      {formatAmount(expense.amount)}
                    </p>

                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}

          <div className="flex items-center justify-between border-t p-5">
            <p className="text-sm text-slate-500">
              Page {page} of {Math.max(totalPages, 1)}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
              >
                ← Previous
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* ADD EXPENSE MODAL */}
      {/* ========================= */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleAddExpense}
            className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Expense</h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a new expense to your account.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Expense title"
                required
                value={newExpense.title}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-xl border px-4 py-3"
              />

              <textarea
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                type="number"
                min="0"
                placeholder="Amount"
                required
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    amount: e.target.value,
                  })
                }
                className="w-full rounded-xl border px-4 py-3"
              />

              <select
                required
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">Select category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border px-5 py-3"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================= */}
      {/* EDIT EXPENSE MODAL */}
      {/* ========================= */}

      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleUpdateExpense}
            className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Edit Expense
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your expense details.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                required
                value={editingExpense.title}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-xl border px-4 py-3"
              />

              <textarea
                value={editingExpense.description}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                type="number"
                min="0"
                required
                value={editingExpense.amount}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    amount: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border px-4 py-3"
              />

              <select
                required
                value={editingExpense.category}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-xl border px-4 py-3"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingExpense(null)}
                className="rounded-xl border px-5 py-3"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
