import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiTestButtons } from "@/components/auth/ApiTestButtons";

type WelcomeCardProps = {
  name: string;
  email: string;
  roleLabel: string;
  businessName?: string | null;
};

// Temporary overview content. Real statistics and charts come later.
export function WelcomeCard({
  name,
  email,
  roleLabel,
  businessName,
}: WelcomeCardProps) {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Welcome, {name}</CardTitle>
        <CardDescription>
          {roleLabel} overview (statistics coming soon).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Email: {email}</p>
        <p>Role: {roleLabel}</p>
        {businessName && <p>Restaurant: {businessName}</p>}
        <ApiTestButtons />
      </CardContent>
    </Card>
  );
}