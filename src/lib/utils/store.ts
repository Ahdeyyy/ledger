import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Account, Expense, Income } from './types';
import type { Writable } from 'svelte/store';

type AccountStore = Writable<string>;
type AccountMap = Map<string, Account>;

const emptyMap: AccountMap = new Map();

export const accounts: AccountStore = localStorageStore('account', MapToString(emptyMap));
export const addTabSet: Writable<number> = localStorageStore('addTabSet', 0);
export const recordTabSet: Writable<number> = localStorageStore('recordTabSet', 0);

export function MapToString(map: AccountMap): string {
	return JSON.stringify(Array.from(map.entries()));
}

export function StringToMap(str: string): AccountMap {
	return new Map(JSON.parse(str));
}

export function filterExpensesByCategory(expenses: Expense[]): Map<string, number> {
	const map = new Map();
	expenses.forEach((expense) => {
		const category = expense.category;
		const categoryAmount = map.get(category) || 0;
		map.set(category, categoryAmount + expense.amount);
	});
	return map;
}

export function getMonthlyData(monthly_data: Expense[] | Income[]) {
	const values: number[] = [];
	const labels = [...new Set(monthly_data.map((i) => i.category))];
	labels.forEach((label) => {
		values.push(
			monthly_data.filter((i) => i.category === label).reduce((acc, i) => acc + i.amount, 0)
		);
	});

	return {
		labels: labels,
		datasets: [
			{
				name: 'monthly expense',
				values: values
			}
		]
	};
}

export function filterIncomeByCategory(income: Income[]): Map<string, number> {
	const map = new Map();
	income.forEach((income) => {
		const category = income.category;
		const categoryAmount = map.get(category) || 0;
		map.set(category, categoryAmount + income.amount);
	});
	return map;
}
