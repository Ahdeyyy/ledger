// TODO: remove type from income and expenses
type Expense = {
	id: string;
	amount: number;
	category: string;
	date: string;
};

type Income = {
	id: string;
	amount: number;
	category: string;
	date: string;
};

type Category = {
	id: string;
	name: string;
	for: string;
};

export type Account = {
	id: string;
	name: string;
	balance: number;
	currency: string;
	incomes: Income[];
	expenses: Expense[];
};

export type { Income, Expense, Category };
