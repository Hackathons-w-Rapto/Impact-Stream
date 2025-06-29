import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { STAKE_STREAM_ADDRESS, stakeStreamABI } from '@/context/contractData'
import { Button } from '@/components/ui/button'

interface CreateTemplateForm {
  id: string
  name: string
  description: string
  fundingGoal: string
  deadline: string
  templateType: number
}

interface CreateTemplateProps {
  onProjectCreated: (id: string) => void
}

export default function CreateTemplate({ onProjectCreated }: CreateTemplateProps) {
  const { address } = useAccount()

  const [form, setForm] = useState<CreateTemplateForm>({
    id: '',
    name: '',
    description: '',
    fundingGoal: '',
    deadline: '',
    templateType: 0,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreateTemplateForm, string>>>({})
  const [pendingTx, setPendingTx] = useState<`0x${string}` | null>(null)
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Validate form fields, returns true if valid
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTemplateForm, string>> = {}

    if (!form.id.trim()) newErrors.id = 'Project ID is required'
    if (!form.name.trim()) newErrors.name = 'Project name is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'

    if (!form.fundingGoal.trim()) {
      newErrors.fundingGoal = 'Funding goal is required'
    } else if (isNaN(Number(form.fundingGoal)) || Number(form.fundingGoal) <= 0) {
      newErrors.fundingGoal = 'Funding goal must be a positive number'
    }

    if (!form.deadline.trim()) {
      newErrors.deadline = 'Deadline is required'
    } else {
      const deadlineNum = Number(form.deadline)
      if (isNaN(deadlineNum) || deadlineNum <= Math.floor(Date.now() / 1000)) {
        newErrors.deadline = 'Deadline must be a future UNIX timestamp'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'templateType' ? Number(value) : value,
    }))
    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!address) {
      alert('Please connect your wallet')
      return
    }
    if (!validate()) return

    try {
      writeContract({
        address: STAKE_STREAM_ADDRESS,
        abi: stakeStreamABI,
        functionName: 'createProject',
        args: [
          form.id.trim(),
          form.name.trim(),
          form.description.trim(),
          BigInt(form.fundingGoal),
          BigInt(form.deadline),
          form.templateType,
        ],
      })
      setPendingTx(hash ?? null)
    } catch (err) {
      console.error('Write contract error:', err)
    }
  }

  // Call onProjectCreated when confirmed
  useEffect(() => {
    if (isConfirmed && pendingTx) {
      onProjectCreated(form.id)
      setPendingTx(null)
      // Reset form
      setForm({
        id: '',
        name: '',
        description: '',
        fundingGoal: '',
        deadline: '',
        templateType: 0,
      })
    }
  }, [isConfirmed, pendingTx, form.id, onProjectCreated])

  return (
 <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <div>
    <label htmlFor="id" className="block text-sm font-semibold text-gray-700 mb-1">
      Project ID
    </label>
    <input
      id="id"
      name="id"
      value={form.id}
      onChange={handleChange}
      placeholder="Unique project identifier"
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
        errors.id ? 'border-red-500' : ''
      }`}
      aria-invalid={!!errors.id}
      aria-describedby="id-error"
      required
    />
    {errors.id && (
      <p id="id-error" className="text-red-600 text-sm mt-1">
        {errors.id}
      </p>
    )}
  </div>

  <div>
    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
      Project Name
    </label>
    <input
      id="name"
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Name of the project"
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
        errors.name ? 'border-red-500' : ''
      }`}
      aria-invalid={!!errors.name}
      aria-describedby="name-error"
      required
    />
    {errors.name && (
      <p id="name-error" className="text-red-600 text-sm mt-1">
        {errors.name}
      </p>
    )}
  </div>

  <div>
    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
      Description
    </label>
    <input
      id="description"
      name="description"
      value={form.description}
      onChange={handleChange}
      placeholder="Brief description"
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
        errors.description ? 'border-red-500' : ''
      }`}
      aria-invalid={!!errors.description}
      aria-describedby="description-error"
      required
    />
    {errors.description && (
      <p id="description-error" className="text-red-600 text-sm mt-1">
        {errors.description}
      </p>
    )}
  </div>

  <div>
    <label htmlFor="fundingGoal" className="block text-sm font-semibold text-gray-700 mb-1">
      Funding Goal (in wei)
    </label>
    <input
      id="fundingGoal"
      name="fundingGoal"
      type="number"
      min="1"
      step="1"
      value={form.fundingGoal}
      onChange={handleChange}
      placeholder="Funding goal in wei"
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
        errors.fundingGoal ? 'border-red-500' : ''
      }`}
      aria-invalid={!!errors.fundingGoal}
      aria-describedby="fundingGoal-error"
      required
    />
    {errors.fundingGoal && (
      <p id="fundingGoal-error" className="text-red-600 text-sm mt-1">
        {errors.fundingGoal}
      </p>
    )}
  </div>

  <div>
    <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-1">
      Deadline (UNIX timestamp)
    </label>
    <input
      id="deadline"
      name="deadline"
      type="number"
      min={Math.floor(Date.now() / 1000) + 1}
      step="1"
      value={form.deadline}
      onChange={handleChange}
      placeholder="Future UNIX timestamp"
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
        errors.deadline ? 'border-red-500' : ''
      }`}
      aria-invalid={!!errors.deadline}
      aria-describedby="deadline-error"
      required
    />
    {errors.deadline && (
      <p id="deadline-error" className="text-red-600 text-sm mt-1">
        {errors.deadline}
      </p>
    )}
  </div>

  <div>
    <label htmlFor="templateType" className="block text-sm font-semibold text-gray-700 mb-1">
      Template Type
    </label>
    <select
      id="templateType"
      name="templateType"
      value={form.templateType}
      onChange={handleChange}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      aria-label="Select template type"
    >
      <option value={0}>Type 0</option>
      <option value={1}>Type 1</option>
      {/* Add more options as needed */}
    </select>
  </div>

  <Button
    type="submit"
    disabled={isPending || isConfirming}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
  >
    {isPending || isConfirming ? 'Creating...' : 'Create Project'}
  </Button>

  {error && (
    <p className="text-red-600 mt-2" role="alert" aria-live="assertive">
      {error.message}
    </p>
  )}
</form>

  )
}
