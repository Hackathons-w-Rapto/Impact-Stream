// src/components/dashboard/TemplateSelector.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Cpu, 
  Users, 
  Gamepad 
} from "lucide-react";

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

export default function TemplateSelector({ 
  onSelectTemplate 
}: { 
  onSelectTemplate: (templateId: number) => void 
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  
  const templates: Template[] = [
    {
      id: 0,
      name: "Climate Action",
      description: "Renewable energy and conservation projects",
      templateType: 0,
      defaultFundingGoal: BigInt(50000 * 10**6),
      defaultDuration: BigInt(90 * 24 * 60 * 60),
      rewardPercentage: BigInt(1500),
      active: true
    },
    {
      id: 1,
      name: "Tech Innovation",
      description: "Blockchain and AI development projects",
      templateType: 1,
      defaultFundingGoal: BigInt(100000 * 10**6),
      defaultDuration: BigInt(60 * 24 * 60 * 60),
      rewardPercentage: BigInt(1200),
      active: true
    },
    {
      id: 2,
      name: "Social Impact",
      description: "Community development and education",
      templateType: 2,
      defaultFundingGoal: BigInt(25000 * 10**6),
      defaultDuration: BigInt(120 * 24 * 60 * 60),
      rewardPercentage: BigInt(1800),
      active: true
    },
    {
      id: 3,
      name: "Gaming Ecosystem",
      description: "Web3 games and metaverse projects",
      templateType: 3,
      defaultFundingGoal: BigInt(75000 * 10**6),
      defaultDuration: BigInt(45 * 24 * 60 * 60),
      rewardPercentage: BigInt(1000),
      active: true
    }
  ];

  const getIcon = (type: number) => {
    switch(type) {
      case 0: return <Leaf className="h-6 w-6 text-green-500" />;
      case 1: return <Cpu className="h-6 w-6 text-blue-500" />;
      case 2: return <Users className="h-6 w-6 text-purple-500" />;
      case 3: return <Gamepad className="h-6 w-6 text-red-500" />;
      default: return <div className="h-6 w-6 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Project Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map(template => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all ${
              selectedTemplate === template.id 
                ? 'border-2 border-umi-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
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
          disabled={selectedTemplate === null}
          onClick={() => selectedTemplate !== null && onSelectTemplate(selectedTemplate)}
          className="bg-umi-primary hover:bg-umi-dark px-8 py-4"
        >
          Create Project from Template
        </Button>
      </div>
    </div>
  );
}