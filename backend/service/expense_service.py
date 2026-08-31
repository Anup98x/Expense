






from repo.expense_repo import ExpenseRepo


class ExpenseService:
    def __init__(self,expense_repo:ExpenseRepo) -> None:
        self.expense_repo=expense_repo
