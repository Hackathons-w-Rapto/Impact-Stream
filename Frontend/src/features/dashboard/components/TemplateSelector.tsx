// src/components/dashboard/TemplateSelector.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Cpu, 
  Users, 
  Gamepad,
  Loader,
  ChevronLeft
} from "lucide-react";
import { useAccount, useWriteContract, useTransaction } from 'wagmi';
import { STAKE_STREAM_ADDRESS, stakeStreamABI } from '@/context/contractData';
import ProjectCustomizationForm from './ProjectCustomizationFrom';

interface Template {
  id: number;
  name: string;
  description: string;
  templateType: number;
  defaultFundingGoal: bigint;
  defaultDuration: bigint;
  rewardPercentage: bigint;
  active: boolean;
}

interface TemplateSelectorProps {
  onProjectCreated: (projectId: string) => void;
}

export default function TemplateSelector({ onProjectCreated }: TemplateSelectorProps) {
  const [step, setStep] = useState<'select' | 'customize'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { address } = useAccount();

  const { 
    data: createData,
    writeContract: createProject,
    status: createStatus,
    isError: isCreateError
  } = useWriteContract({
    address: STAKE_STREAM_ADDRESS,
    abi: stakeStreamABI,
    functionName: 'createProject',
  });
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useTransaction({
    hash: createData,
  });
  
  const templates: Template[] = [
    // ... same templates array as before ...
  ];

  const getIcon = (type: number) => {
    switch (type) {
      case 0:
        return <Leaf className="h-6 w-6 text-green-500" />;
      case 1:
        return <Cpu className="h-6 w-6 text-blue-500" />;
      case 2:
        return <Users className="h-6 w-6 text-purple-500" />;
      case 3:
        return <Gamepad className="h-6 w-6 text-pink-500" />;
      default:
        return null;
    }
  };

  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);

  const handleCreateProject = (customData: {
    id: string;
    name: string;
    description: string;
    fundingGoal: bigint;
    deadline: bigint;
  }) => {
    if (!address) {
      alert({
        title: "Wallet not connected",
        description: "Please connect your wallet",
        variant: "destructive"
      });
      return;
    }
    
    try {
      createProject({
        address: STAKE_STREAM_ADDRESS,
        abi: stakeStreamABI,
        functionName: 'createProject',
        args: [
          customData.id,
          customData.name,
          customData.description,
          customData.fundingGoal,
          customData.deadline
        ]
      });

      setPendingProjectId(customData.id);

      alert({
        title: "Project creation started",
        description: "Transaction submitted to blockchain",
      });
    } catch (error) {
      alert({
        title: "Creation failed",
        description: (error instanceof Error ? error.message : "Could not create project"),
        variant: "destructive"
      });
    }
  };

  // Handle transaction confirmation
  if (isConfirmed && createData && pendingProjectId) {
    alert({
      title: "Project created!",
      description: "Your project is now live on the blockchain",
    });

    onProjectCreated(pendingProjectId);
  }

  if (step === 'customize' && selectedTemplate) {
    return (
      <div>
        <Button 
          variant="link" 
          className="text-gray-600 mb-4 pl-0"
          onClick={() => setStep('select')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to templates
        </Button>
        <ProjectCustomizationForm 
          template={selectedTemplate}
          onCreate={handleCreateProject}
          isCreating={createStatus === 'pending' || isConfirming}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Project Template</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map(template => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all ${
              selectedTemplate?.id === template.id 
                ? 'border-2 border-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                {getIcon(template.templateType)}
                <CardTitle>{template.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-500">Funding Goal</div>
                  <div className="font-medium">
                    ${(Number(template.defaultFundingGoal) / 10**6).toLocaleString()} USDC
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Duration</div>
                  <div className="font-medium">
                    {Number(template.defaultDuration) / (24 * 60 * 60)} days
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Reward</div>
                  <div className="font-medium">
                    {Number(template.rewardPercentage) / 100}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          disabled={!selectedTemplate}
          onClick={() => setStep('customize')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4"
        >
          Customize & Create Project
        </Button>
      </div>
      
      {(createStatus === 'pending' || isConfirming) && (
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Loader className="h-5 w-5 mx-auto animate-spin text-blue-500" />
          <p className="mt-2 text-blue-700">
            {createStatus === 'pending' ? "Creating project..." : "Confirming transaction..."}
          </p>
        </div>
      )}
      
      {isCreateError && (
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <h3 className="font-medium text-red-800">
            Failed to create project
          </h3>
          <p className="text-sm text-red-600">
            Please check your wallet and try again
          </p>
        </div>
      )}
    </div>
  );
}