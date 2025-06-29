import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Cpu, Users, Gamepad } from "lucide-react"

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
  onSelectTemplate?: (template: Template) => void;
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const templates: Template[] = [
    // ... your templates array ...
  ];

  const getIcon = (type: number) => {
    switch (type) {
      case 0: return <Leaf className="h-6 w-6 text-green-500" />;
      case 1: return <Cpu className="h-6 w-6 text-blue-500" />;
      case 2: return <Users className="h-6 w-6 text-purple-500" />;
      case 3: return <Gamepad className="h-6 w-6 text-pink-500" />;
      default: return null;
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
              selectedTemplate?.id === template.id
                ? 'border-2 border-primary shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => {
              setSelectedTemplate(template)
              onSelectTemplate?.(template)
            }}
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
      {/* Optionally, show a button to confirm selection */}
      {/* <Button disabled={!selectedTemplate} onClick={() => onSelectTemplate?.(selectedTemplate)}>Select Template</Button> */}
    </div>
  )
}