import React from 'react'

export const SelectorPlan = ({ selectedPlan, setSelectedPlan } : {selectedPlan: string, setSelectedPlan: any}) => {
  const planes = [
    'Personal',
    'Empresarial',
    'Corporativo'
  ]
  return (
    <>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planes.map((plan, index) => (
                <button type="button" onClick={() => { setSelectedPlan(plan.toLowerCase()) }} className={`rounded-3xl ${selectedPlan === plan.toLowerCase() ? 'bg-main text-nigga' : ''} border-2 border-main px-4 py-2 uppercase text-main text-xl font-bold transition-colors hover:bg-main hover:text-nigga`} key={index}>{plan}</button>
            ))}
        </div>
    </>
  )
}
