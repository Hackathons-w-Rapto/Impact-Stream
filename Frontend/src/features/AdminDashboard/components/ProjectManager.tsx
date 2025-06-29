// src/components/dashboard/ProjectManager.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Calendar, Coins } from "lucide-react";
import { useContractWrite } from 'wagmi';
import { STAKE_STREAM_ADDRESS, stakeStreamABI } from '@/context/contractData';

interface Project {
  id: string;
  title: string;
  description: string;
  fundingGoal: bigint;
  currentStake: bigint;
  deadline: bigint;
  status: number; // 0 = Active, 1 = Completed, 2 = Canceled
}

interface ProjectManagerProps {
  projects: Project[];
  createdProjects: string[];
}

export default function ProjectManager({ projects, createdProjects }: ProjectManagerProps) {
  
  // Contract write for updating projects
  const { write: updateProject } = useContractWrite({
    address: STAKE_STREAM_ADDRESS,
    abi: stakeStreamABI,
    functionName: 'adminUpdateProject',
    onSuccess: () => {
      alert({
        title: "Project updated",
        description: "Changes saved to blockchain",
      });
    },
    onError: (error) => {
      alert({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Contract write for canceling projects
  interface CancelProjectWriteConfig {
    address: `0x${string}`;
    abi: typeof stakeStreamABI;
    functionName: 'cancelProject';
    onSuccess: () => void;
  }

  interface CancelProjectWriteResult {
    write: (args: { args: [string] }) => void;
  }

  const { write: cancelProject }: CancelProjectWriteResult = useContractWrite({
    address: '0xSTAKE_STREAM_ADDRESS',
    abi: stakeStreamABI,
    functionName: 'cancelProject',
    onSuccess: (): void => {
      alert({
        title: "Project canceled",
        description: "Project has been marked as canceled",
      });
    }
  } as CancelProjectWriteConfig);

  const handleUpdate = (projectId: string) => {
    // In a real implementation, we'd open a modal with form
    // For demo, we'll just extend the deadline by 30 days
    const newDeadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    updateProject({ args: [projectId, newDeadline, 0] });
  };
  
  const handleCancel = (projectId: string) => {
    cancelProject({ args: [projectId] });
  };
  
  const getStatusBadge = (status: number) => {
    switch(status) {
      case 0: return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
      case 1: return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Completed</span>;
      case 2: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Canceled</span>;
      default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Unknown</span>;
    }
  };
  
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };
  
  const formatUSDC = (amount: bigint) => {
    return `$${(Number(amount) / 10**6).toLocaleString()}`;
  };
  
  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 p-6 rounded-lg inline-block">
            <Coins className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium mt-4">No projects created yet</h3>
            <p className="text-gray-500 mt-2">
              Get started by creating your first project
            </p>
            <Button 
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              onClick={() => setActiveTab('create')}
            >
              Create Project
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 0).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatUSDC(projects.reduce((sum, p) => sum + p.currentStake, 0n))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Funding Goal</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {createdProjects.includes(project.id) && (
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      )}
                      {project.title}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>{formatUSDC(project.fundingGoal)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {formatUSDC(project.currentStake)}
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ 
                            width: `${Number(project.currentStake * 100n / project.fundingGoal)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {formatDate(project.deadline)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => handleUpdate(project.id)}
                        disabled={project.status !== 0}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive"
                        onClick={() => handleCancel(project.id)}
                        disabled={project.status !== 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}