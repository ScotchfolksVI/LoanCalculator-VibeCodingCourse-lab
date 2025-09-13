import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Calendar, Percent } from 'lucide-react';

interface PaymentScheduleItem {
  month: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

function App() {
  const [loanAmount, setLoanAmount] = useState<string>('250000');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [loanTermMonths, setLoanTermMonths] = useState<string>('360');
  const [schedule, setSchedule] = useState<PaymentScheduleItem[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const months = parseInt(loanTermMonths);

    if (!principal || !annualRate || !months || principal <= 0 || annualRate < 0 || months <= 0) {
      setSchedule([]);
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalAmount(0);
      return;
    }

    const monthlyRate = annualRate / 12;
    const monthlyPaymentAmount = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    setMonthlyPayment(monthlyPaymentAmount);

    const newSchedule: PaymentScheduleItem[] = [];
    let remainingBalance = principal;
    let totalInterestPaid = 0;

    for (let month = 1; month <= months; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPaymentAmount - interestPayment;
      remainingBalance -= principalPayment;
      totalInterestPaid += interestPayment;

      // Handle final payment rounding
      if (month === months) {
        remainingBalance = 0;
      }

      newSchedule.push({
        month,
        monthlyPayment: monthlyPaymentAmount,
        principalPayment,
        interestPayment,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }

    setSchedule(newSchedule);
    setTotalInterest(totalInterestPaid);
    setTotalAmount(principal + totalInterestPaid);
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTermMonths]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Loan Calculator</h1>
          </div>
          <p className="text-lg text-gray-600">Calculate your monthly payments and view your complete repayment schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Loan Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="loanAmount" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4" />
                    Loan Amount
                  </label>
                  <input
                    type="text"
                    id="loanAmount"
                    value={formatNumber(loanAmount)}
                    onChange={(e) => setLoanAmount(e.target.value.replace(/,/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="250,000"
                  />
                </div>

                <div>
                  <label htmlFor="interestRate" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Percent className="h-4 w-4" />
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <label htmlFor="loanTermMonths" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4" />
                    Loan Term (Months)
                  </label>
                  <input
                    type="number"
                    id="loanTermMonths"
                    value={loanTermMonths}
                    onChange={(e) => setLoanTermMonths(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="360"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {parseInt(loanTermMonths) ? `${Math.round(parseInt(loanTermMonths) / 12)} years` : ''}
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              {monthlyPayment > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Payment:</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="text-lg font-semibold text-red-600">{formatCurrency(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Repayment Schedule</h2>
              
              {schedule.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-900">Month</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-900">Payment</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-900">Principal</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-900">Interest</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-900">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((payment, index) => (
                          <tr
                            key={payment.month}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                            }`}
                          >
                            <td className="px-4 py-3 font-medium text-gray-900">{payment.month}</td>
                            <td className="px-4 py-3 text-right text-gray-900">
                              {formatCurrency(payment.monthlyPayment)}
                            </td>
                            <td className="px-4 py-3 text-right text-green-600">
                              {formatCurrency(payment.principalPayment)}
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                              {formatCurrency(payment.interestPayment)}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900">
                              {formatCurrency(payment.remainingBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Enter loan details to see your repayment schedule</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;