import { useState, useEffect } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { STAKE_STREAM_ADDRESS, stakeStreamABI } from '@/context/contractData'
import { Button } from '@/components/ui/button'



interface CreateTemplateForm {
  id: string
  name: string
  description: string
  fundingGoal: string
  deadline: string
}

interface CreateTemplateProps {
  onProjectCreated: (id: string) => void
}

export default function CreateTemplate({
  onProjectCreated,
}: CreateTemplateProps) {
  const { address } = useAccount()

  const [form, setForm] = useState<CreateTemplateForm>({
    id: '',
    name: '',
    description: '',
    fundingGoal: '',
    deadline: '',
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTemplateForm, string>>
  >({})
  const [pendingTx, setPendingTx] = useState<`0x${string}` | null>(null)
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  // Validate form fields, returns true if valid
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTemplateForm, string>> = {}

    if (!form.id.trim()) newErrors.id = 'Project ID is required'
    if (!form.name.trim()) newErrors.name = 'Project name is required'
    if (!form.description.trim())
      newErrors.description = 'Description is required'

    if (!form.fundingGoal.trim()) {
      newErrors.fundingGoal = 'Funding goal is required'
    } else if (
      isNaN(Number(form.fundingGoal)) ||
      Number(form.fundingGoal) <= 0
    ) {
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
      [name]: name === 'templateType' ? Number(value) : value,
    }))
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
      })
    }
  }, [isConfirmed, pendingTx, form.id, onProjectCreated])

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md'
    >
      <div>
        <label
          htmlFor='id'
          className='mb-1 block text-sm font-semibold text-gray-700'
        >
          Project ID
        </label>
        <input
          id='id'
          name='id'
          value={form.id}
          onChange={handleChange}
          placeholder='Unique project identifier'
          className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
            errors.id ? 'border-red-500' : ''
          }`}
          aria-invalid={!!errors.id}
          aria-describedby='id-error'
          required
        />
        {errors.id && (
          <p id='id-error' className='mt-1 text-sm text-red-600'>
            {errors.id}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='name'
          className='mb-1 block text-sm font-semibold text-gray-700'
        >
          Project Name
        </label>
        <input
          id='name'
          name='name'
          value={form.name}
          onChange={handleChange}
          placeholder='Name of the project'
          className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
            errors.name ? 'border-red-500' : ''
          }`}
          aria-invalid={!!errors.name}
          aria-describedby='name-error'
          required
        />
        {errors.name && (
          <p id='name-error' className='mt-1 text-sm text-red-600'>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='description'
          className='mb-1 block text-sm font-semibold text-gray-700'
        >
          Description
        </label>
        <input
          id='description'
          name='description'
          value={form.description}
          onChange={handleChange}
          placeholder='Brief description'
          className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
            errors.description ? 'border-red-500' : ''
          }`}
          aria-invalid={!!errors.description}
          aria-describedby='description-error'
          required
        />
        {errors.description && (
          <p id='description-error' className='mt-1 text-sm text-red-600'>
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='fundingGoal'
          className='mb-1 block text-sm font-semibold text-gray-700'
        >
          Funding Goal (in wei)
        </label>
        <input
          id='fundingGoal'
          name='fundingGoal'
          type='number'
          min='1'
          step='1'
          value={form.fundingGoal}
          onChange={handleChange}
          placeholder='Funding goal in wei'
          className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
            errors.fundingGoal ? 'border-red-500' : ''
          }`}
          aria-invalid={!!errors.fundingGoal}
          aria-describedby='fundingGoal-error'
          required
        />
        {errors.fundingGoal && (
          <p id='fundingGoal-error' className='mt-1 text-sm text-red-600'>
            {errors.fundingGoal}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='deadline'
          className='mb-1 block text-sm font-semibold text-gray-700'
        >
          Deadline (UNIX timestamp)
        </label>
        <input
          id='deadline'
          name='deadline'
          type='number'
          min={Math.floor(Date.now() / 1000) + 1}
          step='1'
          value={form.deadline}
          onChange={handleChange}
          placeholder='Future UNIX timestamp'
          className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
            errors.deadline ? 'border-red-500' : ''
          }`}
          aria-invalid={!!errors.deadline}
          aria-describedby='deadline-error'
          required
        />
        {errors.deadline && (
          <p id='deadline-error' className='mt-1 text-sm text-red-600'>
            {errors.deadline}
          </p>
        )}
      </div>


      <Button
        type='submit'
        disabled={isPending || isConfirming}
        className='w-full rounded-md bg-indigo-600 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {isPending || isConfirming ? 'Creating...' : 'Create Project'}
      </Button>

      {error && (
        <p className='mt-2 text-red-600' role='alert' aria-live='assertive'>
          {error.message}
        </p>
      )}
    </form>
  )
}
