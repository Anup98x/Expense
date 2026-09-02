





from backend.repo.expense_repo import ExpenseRepo


class ExpenseService:
    def __init__(self,repo:ExpenseRepo):
        self.repo=repo
