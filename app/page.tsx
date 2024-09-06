'use client'

import { useState } from 'react'
import { ArrowRight, PlusCircle, DollarSign, Users, Trash2 } from 'lucide-react'

type Friend = {
  id: string
  name: string
}

type Expense = {
  id: number
  paidBy: string
  amount: number
  description: string
}

type Balance = {
  [key: string]: number
}

type Settlement = {
  from: string
  to: string
  amount: number
}

export default function Component() {
  const [step, setStep] = useState(1)
  const [friends, setFriends] = useState<Friend[]>([])
  const [newFriend, setNewFriend] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({ paidBy: '', amount: '', description: '' })

  const addFriend = () => {
    if (newFriend) {
      setFriends([...friends, { id: Date.now().toString(), name: newFriend }])
      setNewFriend('')
    }
  }

  const removeFriend = (id: string) => {
    setFriends(friends.filter(friend => friend.id !== id))
  }

  const addExpense = () => {
    if (newExpense.paidBy && newExpense.amount && newExpense.description) {
      setExpenses([...expenses, {
        id: expenses.length + 1,
        paidBy: newExpense.paidBy,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description
      }])
      setNewExpense({ paidBy: '', amount: '', description: '' })
    }
  }

  const calculateBalances = (): Balance => {
    const balances: Balance = {}
    friends.forEach(friend => balances[friend.name] = 0)

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const fairShare = totalExpense / friends.length

    expenses.forEach(expense => {
      balances[expense.paidBy] += expense.amount
    })

    friends.forEach(friend => {
      balances[friend.name] -= fairShare
    })

    return balances
  }

  const optimizeSettlements = (balances: Balance): Settlement[] => {
    const settlements: Settlement[] = []
    const debtors = Object.entries(balances).filter(([_, balance]) => balance < 0)
    const creditors = Object.entries(balances).filter(([_, balance]) => balance > 0)

    debtors.sort((a, b) => a[1] - b[1])
    creditors.sort((a, b) => b[1] - a[1])

    let i = 0, j = 0
    while (i < debtors.length && j < creditors.length) {
      const [debtor, debtAmount] = debtors[i]
      const [creditor, creditAmount] = creditors[j]
      const settlementAmount = Math.min(-debtAmount, creditAmount)

      if (settlementAmount > 0) {
        settlements.push({
          from: debtor,
          to: creditor,
          amount: settlementAmount
        })
      }

      if (-debtAmount < creditAmount) {
        creditors[j] = [creditor, creditAmount + debtAmount]
        i++
      } else if (-debtAmount > creditAmount) {
        debtors[i] = [debtor, debtAmount + creditAmount]
        j++
      } else {
        i++
        j++
      }
    }

    return settlements
  }

  const balances = calculateBalances()
  const settlements = optimizeSettlements(balances)

  return (
    <div className="min-h-screen bg-[#4A0E4E] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Expense Sharing App</h1>
        
        <div className="bg-[#3D0D41] rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Step {step}: {step === 1 ? 'Add Friends' : step === 2 ? 'Add Expenses' : step === 3 ? 'View Expenses' : step === 4 ? 'View Balances' : 'Settlement Plan'}
          </h2>
          
          {step === 1 && (
            <div>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Friend's name"
                  value={newFriend}
                  onChange={(e) => setNewFriend(e.target.value)}
                  className="flex-grow p-2 rounded bg-[#2C0B30] text-white border border-[#FFA500]"
                />
                <button onClick={addFriend} className="px-4 py-2 bg-[#FFA500] text-[#4A0E4E] rounded hover:bg-[#FF8C00]">
                  Add Friend
                </button>
              </div>
              <div className="space-y-2">
                {friends.map(friend => (
                  <div key={friend.id} className="flex justify-between items-center p-2 bg-[#2C0B30] rounded">
                    <span>{friend.name}</span>
                    <button onClick={() => removeFriend(friend.id)} className="text-[#FFA500] hover:text-[#FF8C00]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="paidBy" className="block text-white mb-1">Paid By</label>
                <select
                  id="paidBy"
                  className="w-full p-2 rounded bg-[#2C0B30] text-white border border-[#FFA500]"
                  value={newExpense.paidBy}
                  onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                >
                  <option value="">Select a friend</option>
                  {friends.map(friend => (
                    <option key={friend.id} value={friend.name}>{friend.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-white mb-1">Amount</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full p-2 rounded bg-[#2C0B30] text-white border border-[#FFA500]"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-white mb-1">Description</label>
                <input
                  id="description"
                  type="text"
                  placeholder="Expense description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full p-2 rounded bg-[#2C0B30] text-white border border-[#FFA500]"
                />
              </div>
              <button onClick={addExpense} className="w-full px-4 py-2 bg-[#FFA500] text-[#4A0E4E] rounded hover:bg-[#FF8C00] flex items-center justify-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              {expenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center mb-2 p-2 bg-[#2C0B30] rounded">
                  <span>{expense.description}</span>
                  <span>{expense.paidBy} paid ${expense.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div>
              {Object.entries(balances).map(([friend, balance]) => (
                <div key={friend} className="flex justify-between items-center mb-2 p-2 bg-[#2C0B30] rounded">
                  <span>{friend}</span>
                  <span className={balance > 0 ? 'text-green-400' : 'text-red-400'}>
                    {balance > 0 ? `Owed $${balance.toFixed(2)}` : `Owes $${(-balance).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {step === 5 && (
            <div>
              {settlements.map((settlement, index) => (
                <div key={index} className="flex items-center justify-between mb-2 p-2 bg-[#2C0B30] rounded">
                  <span>{settlement.from}</span>
                  <ArrowRight className="mx-2 text-[#FFA500]" />
                  <span>{settlement.to}</span>
                  <span className="font-bold ml-2 text-[#FFA500]">${settlement.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-[#FFA500] text-[#4A0E4E] rounded hover:bg-[#FF8C00]">
                Previous
              </button>
            )}
            {step < 5 && (
              <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-[#FFA500] text-[#4A0E4E] rounded hover:bg-[#FF8C00] ml-auto">
                Next
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#3D0D41] rounded-lg p-6 flex items-center justify-center">
            <DollarSign className="h-8 w-8 mr-2 text-[#FFA500]" />
            <div>
              <p className="text-2xl font-bold">${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
              <p className="text-sm text-gray-300">Total Expenses</p>
            </div>
          </div>
          <div className="bg-[#3D0D41] rounded-lg p-6 flex items-center justify-center">
            <Users className="h-8 w-8 mr-2 text-[#FFA500]" />
            <div>
              <p className="text-2xl font-bold">{friends.length}</p>
              <p className="text-sm text-gray-300">Group Members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}