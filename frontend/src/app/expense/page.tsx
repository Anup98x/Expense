"use client";
import { useEffect, useMemo, useState } from "react";
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [category, setCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
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
        { method: "GET", credentials: "include" },
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
  useEffect(() => {
    fetchExpenses();
  }, [page, category, minAmount, maxAmount, startDate, endDate]);
  const filteredExpenses = useMemo(() => {
    if (!search.trim()) {
      return expenses;
    }
    const query = search.toLowerCase();
    return expenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(query) ||
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query),
    );
  }, [expenses, search]);
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;
  const totalPages = Math.ceil(total / pageSize);
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const resetFilters = () => {
    setCategory("");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setSearch("");
    setPage(1);
  };
  return (
    <main className="min-h-screen bg-slate-50">
      {" "}
      {/* NAVBAR */}{" "}
      <nav className="border-b border-slate-200 bg-white">
        {" "}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white shadow-lg shadow-emerald-500/20">
              {" "}
              ${" "}
            </div>{" "}
            <div>
              {" "}
              <h1 className="font-bold text-slate-900">
                {" "}
                ExpenseTracker{" "}
              </h1>{" "}
              <p className="text-xs text-slate-400"> Personal Finance </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="hidden text-sm text-slate-500 sm:block">
            {" "}
            Expense Dashboard{" "}
          </div>{" "}
        </div>{" "}
      </nav>{" "}
      {/* CONTENT */}{" "}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {" "}
        {/* HEADER */}{" "}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {" "}
          <div>
            {" "}
            <p className="mb-1 text-sm font-medium text-emerald-600">
              {" "}
              FINANCE OVERVIEW{" "}
            </p>{" "}
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {" "}
              Your Expenses{" "}
            </h2>{" "}
            <p className="mt-1 text-slate-500">
              {" "}
              Track and manage your spending in one place.{" "}
            </p>{" "}
          </div>{" "}
          <button
            onClick={fetchExpenses}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            {" "}
            ↻ Refresh{" "}
          </button>{" "}
        </div>{" "}
        {/* SUMMARY CARDS */}{" "}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {" "}
          {/* Total expenses */}{" "}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {" "}
            <div className="mb-4 flex items-center justify-between">
              {" "}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                {" "}
                ₹{" "}
              </div>{" "}
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                {" "}
                Spending{" "}
              </span>{" "}
            </div>{" "}
            <p className="text-sm font-medium text-slate-500">
              {" "}
              Current Page Spending{" "}
            </p>{" "}
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              {" "}
              {formatAmount(totalAmount)}{" "}
            </h3>{" "}
          </div>{" "}
          {/* Number of expenses */}{" "}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {" "}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
              {" "}
              #{" "}
            </div>{" "}
            <p className="text-sm font-medium text-slate-500">
              {" "}
              Total Expenses{" "}
            </p>{" "}
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              {" "}
              {total}{" "}
            </h3>{" "}
          </div>{" "}
          {/* Average */}{" "}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {" "}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600">
              {" "}
              ↗{" "}
            </div>{" "}
            <p className="text-sm font-medium text-slate-500">
              {" "}
              Average Expense{" "}
            </p>{" "}
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              {" "}
              {formatAmount(averageAmount)}{" "}
            </h3>{" "}
          </div>{" "}
        </div>{" "}
        {/* FILTER SECTION */}{" "}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {" "}
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            {" "}
            <div>
              {" "}
              <h3 className="font-semibold text-slate-900">
                {" "}
                Filter Expenses{" "}
              </h3>{" "}
              <p className="text-sm text-slate-400">
                {" "}
                Narrow down your expenses using filters.{" "}
              </p>{" "}
            </div>{" "}
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-slate-500 transition hover:text-emerald-600"
            >
              {" "}
              Reset Filters{" "}
            </button>{" "}
          </div>{" "}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {" "}
            {/* Search */}{" "}
            <div className="lg:col-span-2">
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                {" "}
                SEARCH{" "}
              </label>{" "}
              <input
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />{" "}
            </div>{" "}
            {/* Category */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                {" "}
                CATEGORY{" "}
              </label>{" "}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                {" "}
                <option value="">All Categories</option>{" "}
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {" "}
                    {item.charAt(0).toUpperCase() + item.slice(1)}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            {/* Min */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                {" "}
                MIN AMOUNT{" "}
              </label>{" "}
              <input
                type="number"
                min="0"
                placeholder="0"
                value={minAmount}
                onChange={(e) => {
                  setMinAmount(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />{" "}
            </div>{" "}
            {/* Max */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                {" "}
                MAX AMOUNT{" "}
              </label>{" "}
              <input
                type="number"
                min="0"
                placeholder="50000"
                value={maxAmount}
                onChange={(e) => {
                  setMaxAmount(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />{" "}
            </div>{" "}
            {/* Start Date */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                {" "}
                START DATE{" "}
              </label>{" "}
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />{" "}
            </div>{" "}
            {/* End Date */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                {" "}
                END DATE{" "}
              </label>{" "}
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* ERROR */}{" "}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            {" "}
            <p className="text-sm font-medium text-red-600"> {error} </p>{" "}
          </div>
        )}{" "}
        {/* EXPENSE TABLE */}{" "}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {" "}
          <div className="border-b border-slate-200 px-6 py-5">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <div>
                {" "}
                <h3 className="font-semibold text-slate-900">
                  {" "}
                  Recent Expenses{" "}
                </h3>{" "}
                <p className="mt-1 text-sm text-slate-400">
                  {" "}
                  {total} expense{total !== 1 ? "s" : ""} found{" "}
                </p>{" "}
              </div>{" "}
              <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                {" "}
                Page {page} of {Math.max(totalPages, 1)}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Loading!*/}{" "}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              {" "}
              <div className="flex flex-col items-center gap-3">
                {" "}
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />{" "}
                <p className="text-sm text-slate-400">
                  {" "}
                  Loading expenses...{" "}
                </p>{" "}
              </div>{" "}
            </div>
          ) : filteredExpenses.length === 0 ? (
            /* Empty */ <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              {" "}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                {" "}
                💸{" "}
              </div>{" "}
              <h3 className="font-semibold text-slate-900">
                {" "}
                No expenses found{" "}
              </h3>{" "}
              <p className="mt-1 max-w-sm text-sm text-slate-400">
                {" "}
                Try changing your filters or add a new expense to get
                started.{" "}
              </p>{" "}
            </div>
          ) : (
            <>
              {" "}
              {/* Desktop table */}{" "}
              <div className="hidden overflow-x-auto md:block">
                {" "}
                <table className="w-full">
                  {" "}
                  <thead className="bg-slate-50">
                    {" "}
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {" "}
                      <th className="px-6 py-4"> Expense </th>{" "}
                      <th className="px-6 py-4"> Category </th>{" "}
                      <th className="px-6 py-4"> Date </th>{" "}
                      <th className="px-6 py-4 text-right"> Amount </th>{" "}
                    </tr>{" "}
                  </thead>{" "}
                  <tbody className="divide-y divide-slate-100">
                    {" "}
                    {filteredExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="transition hover:bg-slate-50"
                      >
                        {" "}
                        <td className="px-6 py-5">
                          {" "}
                          <div className="flex items-center gap-4">
                            {" "}
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold uppercase text-emerald-600">
                              {" "}
                              {expense.title.charAt(0)}{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <p className="font-semibold text-slate-800">
                                {" "}
                                {expense.title}{" "}
                              </p>{" "}
                              <p className="mt-1 max-w-xs truncate text-sm text-slate-400">
                                {" "}
                                {expense.description}{" "}
                              </p>{" "}
                            </div>{" "}
                          </div>{" "}
                        </td>{" "}
                        <td className="px-6 py-5">
                          {" "}
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                            {" "}
                            {expense.category}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td className="px-6 py-5 text-sm text-slate-500">
                          {" "}
                          {formatDate(expense.created_at)}{" "}
                        </td>{" "}
                        <td className="px-6 py-5 text-right">
                          {" "}
                          <span className="font-bold text-slate-900">
                            {" "}
                            {formatAmount(expense.amount)}{" "}
                          </span>{" "}
                        </td>{" "}
                      </tr>
                    ))}{" "}
                  </tbody>{" "}
                </table>{" "}
              </div>{" "}
              {/* Mobile cards */}{" "}
              <div className="divide-y divide-slate-100 md:hidden">
                {" "}
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="p-5">
                    {" "}
                    <div className="flex items-start justify-between gap-4">
                      {" "}
                      <div className="flex items-center gap-3">
                        {" "}
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-bold uppercase text-emerald-600">
                          {" "}
                          {expense.title.charAt(0)}{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <p className="font-semibold text-slate-800">
                            {" "}
                            {expense.title}{" "}
                          </p>{" "}
                          <p className="text-xs text-slate-400">
                            {" "}
                            {formatDate(expense.created_at)}{" "}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                      <p className="font-bold text-slate-900">
                        {" "}
                        {formatAmount(expense.amount)}{" "}
                      </p>{" "}
                    </div>{" "}
                    <div className="mt-3 flex items-center justify-between">
                      {" "}
                      <p className="text-sm text-slate-400">
                        {" "}
                        {expense.description}{" "}
                      </p>{" "}
                      <span className="ml-3 shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                        {" "}
                        {expense.category}{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </>
          )}{" "}
          {/* PAGINATION: */}{" "}
          {!loading && totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 sm:px-6">
              {" "}
              <p className="text-sm text-slate-500">
                {" "}
                Showing page{" "}
                <span className="font-semibold text-slate-700">
                  {" "}
                  {page}{" "}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {" "}
                  {totalPages}{" "}
                </span>{" "}
              </p>{" "}
              <div className="flex items-center gap-2">
                {" "}
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {" "}
                  ← Previous{" "}
                </button>{" "}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {" "}
                  Next →{" "}
                </button>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
