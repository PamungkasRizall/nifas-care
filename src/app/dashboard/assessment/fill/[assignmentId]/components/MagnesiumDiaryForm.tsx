"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Serving {
  id: string;
  name: string;
  weight: number;
  magnesium: number;
}

interface Food {
  id: string;
  name: string;
  servings: Serving[];
}

interface Category {
  id: string;
  name: string;
  foods: Food[];
}

interface MagnesiumDiaryFormProps {
  assignmentId: string;
  categories: Category[];
  target: number;
  initialItems?: Array<{ foodId: string; servingId: string; qty: number }>;
  readOnly?: boolean;
  onSubmit: (answers: {
    items: Array<{ foodId: string; servingId: string; qty: number }>;
  }) => Promise<{ success: boolean; message?: string }>;
}

export default function MagnesiumDiaryForm({
  assignmentId,
  categories,
  target,
  initialItems = [],
  readOnly = false,
  onSubmit,
}: MagnesiumDiaryFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<
    Array<{
      foodId: string;
      servingId: string;
      qty: number;
      foodName: string;
      servingName: string;
      magnesium: number;
    }>
  >(() => {
    // Map initial items to include names/magnesium values
    const foodsMap = new Map<
      string,
      { name: string; servings: Map<string, Serving> }
    >();
    categories.forEach((cat) => {
      cat.foods.forEach((f) => {
        const servingsMap = new Map<string, Serving>();
        f.servings.forEach((s) => servingsMap.set(s.id, s));
        foodsMap.set(f.id, { name: f.name, servings: servingsMap });
      });
    });

    return initialItems.map((item) => {
      const fInfo = foodsMap.get(item.foodId);
      const sInfo = fInfo?.servings.get(item.servingId);
      return {
        foodId: item.foodId,
        servingId: item.servingId,
        qty: item.qty,
        foodName: fInfo?.name || "Makanan tidak dikenal",
        servingName: sInfo?.name || "Porsi tidak dikenal",
        magnesium: sInfo?.magnesium || 0,
      };
    });
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [selectedServingId, setSelectedServingId] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedFood = selectedCategory?.foods.find(
    (f) => f.id === selectedFoodId,
  );
  const selectedServing = selectedFood?.servings.find(
    (s) => s.id === selectedServingId,
  );

  const handleAdd = () => {
    if (!selectedFoodId || !selectedServingId || qty <= 0) {
      setError("Silakan pilih makanan, porsi, dan isi jumlah konsumsi.");
      return;
    }

    const duplicate = items.find((i) => i.servingId === selectedServingId);
    if (duplicate) {
      setItems((prev) =>
        prev.map((i) =>
          i.servingId === selectedServingId ? { ...i, qty: i.qty + qty } : i,
        ),
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          foodId: selectedFoodId,
          servingId: selectedServingId,
          qty,
          foodName: selectedFood!.name,
          servingName: selectedServing!.name,
          magnesium: selectedServing!.magnesium,
        },
      ]);
    }

    // Reset inputs
    setSelectedServingId("");
    setQty(1);
    setError("");
  };

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totalMg = items.reduce(
    (sum, item) => sum + item.magnesium * item.qty,
    0,
  );
  const percent = Math.min(100, Math.round((totalMg / target) * 100));
  const isTargetMet = totalMg >= target;

  const handleSubmit = async () => {
    if (items.length === 0) {
      setError("Harap tambahkan minimal satu makanan yang dikonsumsi.");
      return;
    }

    setIsPending(true);
    setError("");

    try {
      const dataItems = items.map((i) => ({
        foodId: i.foodId,
        servingId: i.servingId,
        qty: i.qty,
      }));

      const res = await onSubmit({ items: dataItems });
      if (res.success) {
        router.push("/dashboard/assessment");
        router.refresh();
      } else {
        setError(res.message || "Gagal menyimpan log konsumsi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba kembali.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
      {/* Live Calculator AKG Progress */}
      <div className="bg-muted/30 border border-border p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
              Kalkulator Asupan Harian
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Estimasi total magnesium yang dikonsumsi hari ini.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full font-bold text-xs border ${
              isTargetMet
                ? "bg-sage-50 border-sage-200 text-sage-700"
                : "bg-amber-50 border-amber-200 text-amber-700"
            }`}
          >
            {isTargetMet ? "AKG Cukup" : "AKG Kurang"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 border-y border-border/60">
          <div>
            <span className="block text-[10px] text-muted-foreground uppercase font-bold">
              Total Asupan
            </span>
            <span className="text-2xl font-extrabold text-foreground mt-0.5 block tabular-nums">
              {totalMg} mg
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-muted-foreground uppercase font-bold">
              Target Harian
            </span>
            <span className="text-2xl font-extrabold text-foreground mt-0.5 block tabular-nums">
              {target} mg
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-muted-foreground uppercase font-bold">
              Persentase
            </span>
            <span className="text-2xl font-extrabold text-foreground mt-0.5 block tabular-nums">
              {percent}%
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-muted-foreground uppercase font-bold">
              Status
            </span>
            <span
              className={`text-lg font-bold mt-1 block ${isTargetMet ? "text-sage-700" : "text-amber-700"}`}
            >
              {isTargetMet ? "Terpenuhi" : "Belum Terpenuhi"}
            </span>
          </div>
        </div>

        {/* Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-border rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isTargetMet ? "bg-sage-500" : "bg-amber-500"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Input Form (Only if not readOnly) */}
      {/* Input Form (Only if not readOnly) */}
      {!readOnly && (
        <div className="border border-border rounded-2xl overflow-hidden bg-card/50 shadow-sm transition-all duration-300">
          {/* Card Header (Collapsible) */}
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/30 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🥗</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Catat Makanan Baru
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ketuk di sini untuk menambah log makan hari ini
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isFormOpen ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {/* Card Body */}
          {isFormOpen && (
            <div className="p-4 md:p-6 space-y-6 border-t border-border">
              {/* Step 1: Kategori */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  Pilih Kategori Makanan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((c) => {
                    const isSelected = selectedCategoryId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategoryId(c.id);
                          setSelectedFoodId("");
                          setSelectedServingId("");
                        }}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background border-border text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <span className="text-lg">
                          {c.id === "VEGETABLE" ||
                          c.name.toLowerCase().includes("sayur")
                            ? "🥦"
                            : c.id === "LEGUME" ||
                                c.name.toLowerCase().includes("kacang")
                              ? "🫘"
                              : c.id === "SEED" ||
                                  c.name.toLowerCase().includes("biji")
                                ? "🌻"
                                : c.id === "NUT"
                                  ? "🥜"
                                  : c.id === "GRAIN" ||
                                      c.name.toLowerCase().includes("karbo") ||
                                      c.name
                                        .toLowerCase()
                                        .includes("serealia") ||
                                      c.name.toLowerCase().includes("nasi")
                                    ? "🍚"
                                    : c.id === "FRUIT" ||
                                        c.name.toLowerCase().includes("buah")
                                      ? "🍎"
                                      : c.id === "SEAFOOD" ||
                                          c.name
                                            .toLowerCase()
                                            .includes("seafood")
                                        ? "🍤"
                                        : c.id === "FISH" ||
                                            c.name
                                              .toLowerCase()
                                              .includes("ikan")
                                          ? "🐟"
                                          : c.id === "MEAT" ||
                                              c.name
                                                .toLowerCase()
                                                .includes("daging") ||
                                              c.name
                                                .toLowerCase()
                                                .includes("lauk")
                                            ? "🍗"
                                            : c.id === "DAIRY" ||
                                                c.name
                                                  .toLowerCase()
                                                  .includes("susu") ||
                                                c.name
                                                  .toLowerCase()
                                                  .includes("keju")
                                              ? "🥛"
                                              : c.id === "BEVERAGE" ||
                                                  c.name
                                                    .toLowerCase()
                                                    .includes("minuman")
                                                ? "🥤"
                                                : c.name
                                                      .toLowerCase()
                                                      .includes("snack") ||
                                                    c.name
                                                      .toLowerCase()
                                                      .includes("cemilan")
                                                  ? "🍪"
                                                  : "🍽️"}
                        </span>
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Bahan Makanan */}
              {selectedCategoryId && (
                <div className="space-y-2.5 animate-fadeIn">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    Pilih Nama Makanan
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory?.foods.map((f) => {
                      const isSelected = selectedFoodId === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setSelectedFoodId(f.id);
                            setSelectedServingId("");
                          }}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                              : "bg-background border-border text-foreground hover:bg-muted/30"
                          }`}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Porsi */}
              {selectedFoodId && (
                <div className="space-y-2.5 animate-fadeIn">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    Pilih Ukuran Porsi
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedFood?.servings.map((s) => {
                      const isSelected = selectedServingId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedServingId(s.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-primary/10 border-primary text-primary shadow-sm"
                              : "bg-background border-border text-foreground hover:bg-muted/30"
                          }`}
                        >
                          <div>
                            <span className="block text-xs font-bold">
                              {s.name}
                            </span>
                            <span className="block text-[10px] text-muted-foreground">
                              {s.weight} gram
                            </span>
                          </div>
                          <span className="text-[10px] font-bold bg-muted px-2.5 py-1 rounded-full text-foreground border border-border">
                            {s.magnesium} mg Mg
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Qty & Action */}
              {selectedServingId && (
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-xs font-bold text-foreground">
                      Berapa banyak yang dimakan?
                    </span>
                    <div className="flex items-center border border-input rounded-xl overflow-hidden bg-background">
                      <button
                        type="button"
                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                        className="px-3 py-2 text-foreground font-bold hover:bg-muted active:bg-muted/50 transition-colors"
                      >
                        —
                      </button>
                      <span className="w-12 text-center text-sm font-bold tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty((prev) => prev + 1)}
                        className="px-3 py-2 text-foreground font-bold hover:bg-muted active:bg-muted/50 transition-colors"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full sm:w-auto bg-primary text-primary-foreground font-bold text-xs h-11 px-6 rounded-xl hover:opacity-90 active:scale-[0.98] transition"
                  >
                    Tambah ke Daftar Makan
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Diary Item List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">
          Daftar Makanan Hari Ini
        </h3>

        {items.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-8 text-center bg-muted/10">
            <p className="text-sm text-muted-foreground">
              Belum ada makanan yang dicatat untuk hari ini.
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-2xl divide-y divide-border overflow-hidden bg-card">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground text-sm">
                    {item.foodName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.servingName} &times; {item.qty} Porsi
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {item.magnesium * item.qty} mg Mg
                  </span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-blush-600 hover:text-blush-800 p-1.5 rounded-lg hover:bg-blush-50 transition-colors"
                      title="Hapus Makanan"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Errors & Submit Buttons */}
      {error && (
        <p className="text-xs font-semibold text-blush-600 leading-relaxed">
          {error}
        </p>
      )}

      {!readOnly && (
        <div className="flex gap-4">
          <button
            type="button"
            disabled={isPending}
            onClick={() => router.push("/dashboard/assessment")}
            className="flex-1 border border-border text-foreground font-semibold text-sm h-12 rounded-xl hover:bg-muted/20 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isPending || items.length === 0}
            onClick={handleSubmit}
            className="flex-1 bg-primary text-primary-foreground font-semibold text-sm h-12 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && (
              <svg
                className="animate-spin h-4 w-4 text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            Simpan & Kirim
          </button>
        </div>
      )}
    </div>
  );
}
