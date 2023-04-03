import Database from 'tauri-plugin-sql-api';
import { trace, info, error, attachConsole } from 'tauri-plugin-log-api';
// import { expenses, incomes } from './store';
const detach = await attachConsole();

// let setup = false;

// const db = await Database.load('sqlite:finance1.db');

// export async function database_setup() {
// 	try {
// 		await db.execute('PRAGMA journal_Mode = WAL');
// 	} catch (error) {
// 		console.error('could not activate WAL mode: ', error);
// 	}

// 	try {
// 		db.execute('PRAGMA busy_timeout = 2000');
// 	} catch (error) {
// 		console.error('could not activate set busy time out: ', error);
// 	}

// 	try {
// 		//
// 		db.execute(`
//       CREATE TABLE IF NOT EXISTS categories (
//       Id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL UNIQUE
//     );`);
// 	} catch (error) {
// 		console.error(error);
// 	}
// 	try {
// 		//
// 		db.execute(`
//       CREATE TABLE IF NOT EXISTS income (
//       Id INTEGER PRIMARY KEY AUTOINCREMENT,
//       amount DOUBLE NOT NULL,
//       category TEXT,
//       type TEXT,
//       date DATETIME NOT NULL DEFAULT CURRENT_DATE
      
//     );`);
// 	} catch (error) {
// 		console.error(error);
// 	}
// 	try {
// 		//
// 		db.execute(`
//       CREATE TABLE IF NOT EXISTS expense (
//       Id INTEGER PRIMARY KEY AUTOINCREMENT,
//       amount DOUBLE NOT NULL,
//       category TEXT,
//       type TEXT,
//       date DATETIME NOT NULL DEFAULT CURRENT_DATE
//     );`);
// 	} catch (error) {
// 		console.error(error);
// 	}
// 	try {
// 		//
// 		db.execute(`
//       CREATE TABLE IF NOT EXISTS acccount (
//       Id INTEGER PRIMARY KEY AUTOINCREMENT,
// 	  name TEXT UNIQUE,
//       currency TEXT NOT NULL DEFAULT 'USD',
//       balance DOUBLE NOT NULL DEFAULT 0.0
      
//     );`);
// 	} catch (error) {
// 		console.error(error);
// 	}
// 	setup = true;
// }

// if (!setup) await database_setup();

// export async function create_account(name: string, balance: number) {
// 	await db.execute('INSERT INTO account (name, balance) VALUES ($1,$2)', [name, balance]);
// }

// export async function get_accounts() {
// 	try {
// 		const accounts = await db.select('SELECT * FROM accounts');
// 		return accounts;
// 	} catch (error) {
// 		console.error(error);
// 		return [];
// 	}
// }

// export async function get_accouny(name: string) {
// 	try {
// 		const account = await db.select('SELECT * FROM accounts WHERE name = $1', [name]);
// 		return account;
// 	} catch (error) {
// 		console.error(error);
// 		return [];
// 	}
// }
// export async function create_income(amount: number, category: string, type: string) {
// 	try {
// 		const res = await db.execute('INSERT INTO income (amount, category, type) VALUES($1, $2, $3)', [
// 			amount,
// 			category,
// 			type
// 		]);
// 		const new_income = await get_income(res.lastInsertId);
// 		incomes.update((incomes) => [...incomes, new_income[0]]);

// 		return true;
// 	} catch (error) {
// 		console.error(error);
// 		return false;
// 	}
// }

// export async function get_income(id: number) {
// 	try {
// 		const income: [] = await db.select('SELECT * FROM income WHERE id = $1', [id]);
// 		return income;
// 	} catch (error) {
// 		console.error(error);
// 		return [];
// 	}
// }

// export async function get_incomes(): Promise<[]> {
// 	try {
// 		const incomes: [] = await db.select('SELECT * FROM income ORDER BY date DESC');
// 		return incomes;
// 	} catch (error) {
// 		console.error(error);
// 		return [];
// 	}
// }

// export async function create_expense(amount: number | undefined, category: string, type: string) {
// 	try {
// 		const res = await db.execute(
// 			'INSERT INTO expense (amount, category, type) VALUES ($1, $2, $3)',
// 			[amount, category, type]
// 		);
// 		const new_expense = await get_expense(res.lastInsertId);
// 		expenses.update((expenses) => [...expenses, new_expense[0]]);
// 		return true;
// 	} catch (error) {
// 		console.error(error);
// 		return false;
// 	}
// }

// export async function get_expenses() {
// 	try {
// 		const expenses: [] = await db.select('SELECT * FROM expense ORDER BY date DESC');
// 		return expenses;
// 	} catch (error) {
// 		console.error(error);
// 		return [];
// 	}
// }

// export async function get_expense(id: number) {
// 	try {
// 		const expense: [] = await db.select('SELECT * FROM expense WHERE id = $1', [id]);
// 		return expense;
// 	} catch (error) {
// 		console.error(error);
// 		return [];
// 	}
// }
