// src/components/dashboard/ProjectCustomizationForm.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TemplateSelector } from './TemplateSelector';
import { Loader } from 'lucide-react';

interface ProjectCustomizationFormProps {
  template: TemplateSelector;
  onCreate: (customData: {
    id: string;
    name: string;
    description: string;
    fundingGoal: bigint;
    deadline: bigint;
  }) => void;
  isCreating?: boolean;
}

export default function ProjectCustomizationForm({ 
  template,
  onCreate,
  isCreating
}: ProjectCustomizationFormProps) {
  const [projectId, setProjectId] = useState('');
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description);
  const [fundingGoal, setFundingGoal] = useState(Number(template.defaultFundingGoal) / 10**6);
  const [durationDays, setDurationDays] = useState(Number(template.defaultDuration) / (24 * 60 * 60));
  
  const handleCreate = () => {
    if (!projectId.trim()) {
      alert("Please enter a project ID");
      return;
    }
    
    // Basic validation
    if (fundingGoal <= 0) {
      alert("Funding goal must be positive");
      return;
    }
    
    if (durationDays <= 0) {
      alert("Duration must be at least 1 day");
      return;
    }
    
    onCreate({
      id: projectId,
      name,
      description,
      fundingGoal: BigInt(fundingGoal * 10**6),
      deadline: BigInt(Math.floor(Date.now() / 1000) + (durationDays * 24 * 60 * 60))
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Project</CardTitle>
        <p className="text-sm text-gray-500">
          Based on: {template.name} template
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label>Project ID *</Label>
            <Input 
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="e.g. solar-project-2024"
            />
            <p className="text-sm text-gray-500 mt-1">
              Unique identifier (cannot be changed later)
            </p>
          </div>
          
          <div>
            <Label>Project Name *</Label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Funding Goal (USDC) *</Label>
              <Input 
                type="number"
                value={fundingGoal}
                onChange={(e) => setFundingGoal(Number(e.target.value))}
                min="100"
                step="100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum: $100 USDC
              </p>
            </div>
            
            <div>
              <Label>Duration (Days) *</Label>
              <Input 
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min="1"
                max="365"
              />
              <p className="text-sm text-gray-500 mt-1">
                1-365 days
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h3 className="font-medium mb-2">Project Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Project ID:</div>
              <div className="font-mono">{projectId || '-'}</div>
              
              <div className="text-gray-500">Funding Goal:</div>
              <div>${fundingGoal.toLocaleString()} USDC</div>
              
              <div className="text-gray-500">Duration:</div>
              <div>{durationDays} days</div>
              
              <div className="text-gray-500">Template:</div>
              <div>{template.name}</div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleCreate}
              disabled={isCreating || !projectId || !name || fundingGoal < 100}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
            >
              {isCreating ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Creating Project...
                </>
              ) : "Create Project"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}