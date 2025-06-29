// src/pages/AdminDashboard.tsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import TemplateSelector from '../dashboard/components/TemplateSelector';
import ProjectManager from '../AdminDashboard/components/ProjectManager';
import { useContractRead } from 'wagmi';
import { STAKE_STREAM_ADDRESS, stakeStreamABI } from '@/context/contractData';
import { Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('create');
  const [createdProjects, setCreatedProjects] = useState<string[]>([]);
  
  // Read projects from contract
  const { data: projects, isLoading } = useContractRead({
    address: STAKE_STREAM_ADDRESS,
    abi: stakeStreamABI,
    functionName: 'getAllProjects', 
  });

  const handleProjectCreated = (projectId: string) => {
    setCreatedProjects(prev => [...prev, projectId]);
    setActiveTab('manage');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Project Management</h1>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg">
          Admin Dashboard
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
          <TabsTrigger value="create">Create Project</TabsTrigger>
          <TabsTrigger value="manage">Manage Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <TemplateSelector onProjectCreated={handleProjectCreated} />
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Projects</h2>
              <Button 
                onClick={() => setActiveTab('create')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                + Create New
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <ProjectManager 
                projects={projects || []} 
                createdProjects={createdProjects}
              />
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>
            {/* Analytics content will go here */}
            <div className="text-center py-12 text-gray-500">
              <p>Analytics dashboard coming soon</p>
              <p className="text-sm mt-2">Track project performance and user engagement</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}