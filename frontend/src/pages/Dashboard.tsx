import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <p className="text-lg font-medium">Total Projects</p>
          <p className="text-3xl mt-2">12</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-lg font-medium">Users Staked</p>
          <p className="text-3xl mt-2">108</p>
        </CardContent>
      </Card>
    </div>
  );
}
