import Link from "next/link";

interface QueueItem {
  id: string;
  type: string;
  submittedAt: Date | null;
  mother: {
    name: string | null;
    email: string | null;
    motherProfile: {
      fullName: string | null;
      deliveryDate: Date | null;
    } | null;
  };
}

interface WorkspaceQueueProps {
  items: QueueItem[];
  reviewerPath: "doctor" | "nutritionist";
}

export default function WorkspaceQueue({ items, reviewerPath }: WorkspaceQueueProps) {
  if (items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-muted-foreground"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-semibold text-foreground">Semua tugas review klinis selesai</p>
        <p className="text-sm text-muted-foreground mt-1">
          Tidak ada kuesioner yang menunggu keputusan klinis Anda saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Nama Ibu</th>
              <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Hari Nifas</th>
              <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Jenis Screening</th>
              <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Tanggal Kirim</th>
              <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((a) => {
              const profile = a.mother.motherProfile;
              const motherName = profile?.fullName || a.mother.name || "Ibu";

              // Hitung Hari Nifas
              let daysPostpartum = 0;
              if (profile?.deliveryDate) {
                const delivery = new Date(profile.deliveryDate);
                const today = new Date();
                delivery.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                const diffTime = Math.abs(today.getTime() - delivery.getTime());
                daysPostpartum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              }

              return (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 font-semibold text-foreground">
                    {motherName}
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    Hari ke-{daysPostpartum}
                  </td>
                  <td className="px-5 py-4 font-medium">
                    {a.type}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {a.submittedAt
                      ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
                          new Date(a.submittedAt)
                        )
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      id={`btn-workspace-review-${a.id}`}
                      href={`/${reviewerPath}/review/${a.id}`}
                      className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition whitespace-nowrap"
                    >
                      Buka Workspace →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {items.map((a) => {
          const profile = a.mother.motherProfile;
          const motherName = profile?.fullName || a.mother.name || "Ibu";

          let daysPostpartum = 0;
          if (profile?.deliveryDate) {
            const delivery = new Date(profile.deliveryDate);
            const today = new Date();
            delivery.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(today.getTime() - delivery.getTime());
            daysPostpartum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          }

          return (
            <div key={a.id} className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">{motherName}</p>
                  <p className="text-xs text-muted-foreground">Hari Nifas: ke-{daysPostpartum}</p>
                </div>
                <span className="inline-flex items-center bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                  {a.type}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Dikirim pada:</p>
                <p className="mt-0.5">
                  {a.submittedAt
                    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(
                        new Date(a.submittedAt)
                      )
                    : "—"}
                </p>
              </div>
              <Link
                id={`btn-mobile-workspace-review-${a.id}`}
                href={`/${reviewerPath}/review/${a.id}`}
                className="block w-full text-center bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition mt-1"
              >
                Buka Workspace
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
