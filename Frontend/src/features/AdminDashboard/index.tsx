// src/pages/AdminDashboard.tsx
import { useState } from 'react'
import { Loader } from 'lucide-react'
import { useReadContract } from 'wagmi'
import { STAKE_STREAM_ADDRESS, stakeStreamABI } from '@/context/contractData'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { ThemeSwitch } from '@/components/theme-switch'
import ProjectManager from '../AdminDashboard/components/ProjectManager'
// import TemplateSelector from '../dashboard/components/TemplateSelector'
import CreateTemplate from '../AdminDashboard/components/CreateTemplate'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('create')
  const [createdProjects, setCreatedProjects] = useState<string[]>([])

  // Read projects from contract
  const { data: projects, isLoading } = useReadContract({
    address: STAKE_STREAM_ADDRESS,
    abi: stakeStreamABI,
    functionName: 'getAllProjects',
  })

  const handleProjectCreated = (projectId: string) => {
    setCreatedProjects((prev) => [...prev, projectId])
    setActiveTab('manage')
  }

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Project Management
          </h1>
          <div className='rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-white'>
            Admin Dashboard
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='mx-auto grid w-full max-w-2xl grid-cols-3'>
            <TabsTrigger value='create'>Create Project</TabsTrigger>
            <TabsTrigger value='manage'>Manage Projects</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value='create' className='mt-6'>
            <Card className='p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Create New Project</h2>
              <CreateTemplate onProjectCreated={handleProjectCreated} />
            </Card>
          </TabsContent>

          <TabsContent value='manage' className='mt-6'>
            <Card className='p-6'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-xl font-semibold'>Manage Projects</h2>
                <Button
                  onClick={() => setActiveTab('create')}
                  className='bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                >
                  + Create New
                </Button>
              </div>

              {isLoading ? (
                <div className='flex justify-center py-12'>
                  <Loader className='h-8 w-8 animate-spin text-blue-500' />
                </div>
              ) : (
                <ProjectManager
                  projects={Array.isArray(projects) ? projects : []}
                  createdProjects={createdProjects}
                />
              )}
            </Card>
          </TabsContent>

          <TabsContent value='analytics' className='mt-6'>
            <Card className='p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Platform Analytics</h2>
              {/* Analytics content will go here */}
              <div className='py-12 text-center text-gray-500'>
                <p>Analytics dashboard coming soon</p>
                <p className='mt-2 text-sm'>
                  Track project performance and user engagement
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'AdminDashboard/overview',
    isActive: true,
    disabled: false,
  },
]
