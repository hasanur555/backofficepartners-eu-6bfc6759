import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublicProposal } from "@/lib/proposals.functions";
import { ProposalDocument } from "@/components/ProposalDocument";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const q = (slug: string) => queryOptions({ queryKey: ["proposal", slug], queryFn: () => getPublicProposal({ data: { slug } }) });

export const Route = createFileRoute("/p/$slug")({
  loader: async ({ context, params }) => {
    const r = await context.queryClient.ensureQueryData(q(params.slug));
    if (!r) throw notFound();
    return r;
  },
  head: () => ({
    meta: [
      { title: "Your proposal — Travel BackOffice Partners" },
      { name: "description", content: "Service proposal and invoice from Travel BackOffice Partners." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Your proposal — Travel BackOffice Partners" },
      { property: "og:description", content: "Service proposal and invoice from Travel BackOffice Partners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PublicProposal,
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">This proposal link is not valid.</div>,
});

function PublicProposal() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(q(slug));
  if (!data) return null;
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="no-print mb-4 flex justify-end">
        <Button onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Download PDF</Button>
      </div>
      <ProposalDocument data={data.data} />
    </main>
  );
}
