import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { adminQueue } from "@/lib/data";

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Admin panel</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review user documents, verify listings, and manage the platform.
        </p>
      </div>
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Verification queue
        </h2>
        <div className="divide-y divide-slate-100">
          {adminQueue.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{item.document}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="warning">{item.status}</Badge>
                <Button variant="secondary">Review</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Admin actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Button>Verify selected users</Button>
          <Button variant="secondary">Verify cars</Button>
          <Button variant="secondary">Ban user</Button>
        </div>
      </Card>
    </div>
  );
}
