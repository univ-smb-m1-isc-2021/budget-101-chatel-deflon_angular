import {Component, Input, OnInit} from '@angular/core';
import {BudgetService} from "../../services/budget.service";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {formatDate} from "@angular/common";

export interface annualData {
  name: string;
  x: any[],
  y: number[],
  type: string,
  mode: string,
  marker: { color: string }
}

export interface recurrentExpense {
  amount: number,
  budgetId: number,
  date: string,
  id: number,
  label: string,
  repetition: string
}

export interface spreadExpense {
  amount: number,
  budgetId: number,
  start: string,
  end: string,
  id: number,
  label: string
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() budgets: any[] = [];
  @Input() expenses: any[] = [];
  colors = ['red', 'blue', 'green', 'purple', 'brown', 'pink', 'cyan', 'grey', 'black', 'yellow'];
  public months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  public graphAnnual = {
    data: [],
    layout: {width: "100%", height: "100%", title: 'Evolution des budgets sur l\'année'}
  };

  public graphGlobal = {
    data: [],
    layout: {
      width: "100%",
      height: "100%",
      title: 'Vue globale des budgets',
      colors: this.colors,
    }
  }

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    // @ts-ignore
    this.graphAnnual.data = this.setMonthlyData();
    // @ts-ignore
    this.graphGlobal.data = this.setAnnualData();
  }

  // FONCTIONS POUR CALCULER LA DATA DU GRAPH MENSUEL
  leap(year: number) {
    if (year % 100 == 0) year = year / 100;
    return year % 4 == 0;
  }

  calculateRecurrentExpenseMonthly(data: annualData, expense: recurrentExpense, month: number) {
    let updatedData = data;
    switch (expense.repetition) {
      case "DAILY":
        let startDay = parseInt(expense.date.substring(8, 10));
        let firstMonth = true;
        let days = 0;
        for (let i = month; i < 12; i++) {
          let currentMonth = i + 1;
          if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12) {
            days = 31;
          } else if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            days = 30;
          } else {
            let year = parseInt(expense.date.substring(0, 4));
            if (this.leap(year)) {
              days = 29;
            } else {
              days = 28;
            }
          }
          if (firstMonth) {
            days -= (startDay + 1); // +1 car le jour de début compte
            firstMonth = false;
          }
          updatedData.y[i] += (expense.amount * days);
        }
        break;
      case "WEEKLY":
        let day = parseInt(expense.date.substring(8, 10));
        let limit = 0;
        for (let i = month; i < 12; i++) {
          let currentMonth = i + 1;
          let week = 1;
          if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12) {
            limit = 31;
          } else if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            limit = 30;
          } else {
            let year = parseInt(expense.date.substring(0, 4));
            if (this.leap(year)) {
              limit = 29;
            } else {
              limit = 28;
            }
          }
          while (day < limit) {
            week += 1;
            day += 7;
          }
          updatedData.y[i] += (expense.amount * week);
          day = 1;
        }
        break;
      case "MONTHLY":
        for (let i = month; i <= 12; i++) {
          updatedData.y[i] += expense.amount;
        }
        break;
      case "THIRDLY":
        for (let i = month; i <= 12; i += 3) {
          updatedData.y[i] += expense.amount;
        }
        break;
      case "YEARLY":
        updatedData.y[month] += expense.amount;
        break;
      case "BIYEARLY":
        let currentYear = parseInt(formatDate(Date(), "yyyy-MM-DD", "en").substring(0, 4));
        let expenseYear = parseInt(expense.date.substring(0, 4));
        if (currentYear - expenseYear == 0) {
          updatedData.y[month] += expense.amount;
        }
        break;
    }
    return updatedData;
  }

  calculateSpreadExpenseMonthly(data: annualData, expense: spreadExpense) {
    let updatedData = data;
    let startMonth = (parseInt(expense.start.substring(5, 7)) - 1);
    let endMonth = (parseInt(expense.end.substring(5, 7)) - 1);
    let startYear = parseInt(expense.start.substring(0, 4));
    let endYear = parseInt(expense.end.substring(0, 4));
    if (startYear !== endYear) {
      let totalMonths = this.calculateTotalMonthSpreadExpense(expense.start, expense.end);
      let spreadAmount = Math.round(expense.amount / totalMonths * 10) / 10;
      for (let i = startMonth; i <= 12; i++) {
        updatedData.y[i] += spreadAmount;
      }
    } else {
      let spreadExpense = Math.round(expense.amount / ((endMonth + 1) - (startMonth + 1) + 1) * 10) / 10;
      for (let i = startMonth; i <= endMonth; i++) {
        updatedData.y[i] += spreadExpense;
      }
    }

    return updatedData;
  }

  setMonthlyData(): any[] {
    let currentData: annualData;
    let result = [];
    for (let i = 0; i < this.budgets.length; i++) {
      currentData = {
        name: this.budgets[i].name,
        x: this.months,
        y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: 'scatter',
        mode: 'lines+points',
        marker: {color: this.colors[i % this.colors.length]}
      }
      for (let j = 0; j < this.expenses.length; j++) {
        if (this.expenses[j].budgetId == this.budgets[i].id) {
          if (this.expenses[j].date !== undefined) {
            let month = (parseInt(this.expenses[j].date.substring(5, 7)) - 1);
            if (this.expenses[j].repetition !== undefined) {
              // Dépenses récurrentes
              currentData = this.calculateRecurrentExpenseMonthly(currentData, this.expenses[j], month);
            } else {
              // Dépenses ponctuelles
              currentData.y[month] += this.expenses[j].amount;
            }
          } else {
            // Dépenses étalées
            currentData = this.calculateSpreadExpenseMonthly(currentData, this.expenses[j]);
          }
        }
      }
      result.push(currentData);
    }

    return result;
  }

  // FONCTIONS POUR CALCULER LA DATA DU GRAPH ANNUEL
  calculateRecurrentExpenseAnnual(expense: recurrentExpense, month: number) {
    let value = 0;
    switch (expense.repetition) {
      case "DAILY":
        let startDay = parseInt(expense.date.substring(8, 10));
        let firstMonth = true;
        let days = 0;
        for (let i = month; i < 12; i++) {
          let currentMonth = i + 1;
          if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12) {
            days = 31;
          } else if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            days = 30;
          } else {
            let year = parseInt(expense.date.substring(0, 4));
            if (this.leap(year)) {
              days = 29;
            } else {
              days = 28;
            }
          }
          if (firstMonth) {
            days -= (startDay + 1); // +1 car le jour de début compte
            firstMonth = false;
          }
          value += (expense.amount * days);
        }
        break;
      case "WEEKLY":
        let day = parseInt(expense.date.substring(8, 10));
        let limit = 0;
        for (let i = month; i < 12; i++) {
          let currentMonth = i + 1;
          let week = 1;
          if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12) {
            limit = 31;
          } else if (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) {
            limit = 30;
          } else {
            let year = parseInt(expense.date.substring(0, 4));
            if (this.leap(year)) {
              limit = 29;
            } else {
              limit = 28;
            }
          }
          while (day < limit) {
            week += 1;
            day += 7;
          }
          value += (expense.amount * week);
          day = 1;
        }
        break;
      case "MONTHLY":
        for (let i = month; i <= 12; i++) {
          value += expense.amount;
        }
        break;
      case "THIRDLY":
        for (let i = month; i <= 12; i += 3) {
          value += expense.amount;
        }
        break;
      case "YEARLY":
        value = expense.amount;
        break;
      case "BIYEARLY":
        let currentYear = parseInt(formatDate(Date(), "yyyy-MM-DD", "en").substring(0, 4));
        let expenseYear = parseInt(expense.date.substring(0, 4));
        if (currentYear - expenseYear == 0) {
          value = expense.amount;
        }
        break;
    }
    return value;
  }

  calculateTotalMonthSpreadExpense(start: string, end: string) {
    let startYear = parseInt(start.substring(0, 4));
    let startMonth = parseInt(start.substring(5, 7));
    let lastMonthY1 = 13; // On part de 13 pour ne pas fausser les calculs, car 12 mois séparent janvier de décembre et non 11
    let endYear = parseInt(end.substring(0, 4));
    let endMonth = parseInt(end.substring(5, 7));
    let firstMonthLY = 1;

    // + 1 an pour compenser les mois restants qui composent l'année restante: startMonth à lastMonthY1 et firstMonthLY à endMonth
    let monthBetweenYears = ((endYear) - (startYear + 1)) * 12;
    let totalMonths = 0;

    if (monthBetweenYears > 0) {
      totalMonths = monthBetweenYears;
    }
    totalMonths += ((lastMonthY1 - startMonth) + (endMonth - firstMonthLY))

    return totalMonths;
  }

  calculateSpreadExpenseAnnual(expense: spreadExpense) {
    let startYear = parseInt(expense.start.substring(0, 4));
    let endYear = parseInt(expense.end.substring(0, 4));
    if (startYear !== endYear) {
      let totalMonths = this.calculateTotalMonthSpreadExpense(expense.start, expense.end); //expense.end
      let spreadAmount = Math.round(expense.amount / totalMonths * 10) / 10;
      let startMonth = parseInt(expense.start.substring(5, 7));
      let amount = 0;
      for (let i = startMonth; i <= 12; i++) {
        amount += spreadAmount;
      }
      return amount;
    } else {
      return expense.amount;
    }
  }

  setAnnualData(): any[] {
    let result: { values: number[], labels: string[], type: string } = { values: [], labels: [], type: 'pie' };
    for (let i = 0; i < this.budgets.length; i++) {
      let value = 0;
      result.labels.push(this.budgets[i].name);
      for (let j = 0; j < this.expenses.length; j++) {
        if (this.expenses[j].budgetId == this.budgets[i].id) {
          if (this.expenses[j].date !== undefined) {
            let month = (parseInt(this.expenses[j].date.substring(5, 7)) - 1);
            if (this.expenses[j].repetition !== undefined) {
              // Dépenses récurrentes
              value += this.calculateRecurrentExpenseAnnual(this.expenses[j], month);
            } else {
              // Dépenses ponctuelles
              value += this.expenses[j].amount;
            }
          } else {
            // Dépenses étalées
            value += this.calculateSpreadExpenseAnnual(this.expenses[j]);
          }
        }
      }
      if (value < 0) value = 0;
      result.values.push(value);
    }
    return [result];
  }
}
