"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface ReviewAssessmentItem {
  id: string;
  type: string;
  typeTitle: string;
  status: string;
  submittedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  latestReview?: {
    id: string;
    reviewerRole: string;
    status: string;
    decision: string | null;
    note: string | null;
    reviewedAt: string;
  } | null;
}

export interface MotherReviewGroup {
  motherId: string;
  motherName: string;
  phoneNumber: string | null;
  email: string | null;
  userStatus?: string | null;
  registeredAt?: string | null;

  // Data Pribadi
  dateOfBirth?: string | null;
  education?: string | null;
  occupation?: string | null;
  address?: string | null;

  // Data Persalinan
  deliveryDate: string | null;
  daysPostpartum: number | null;
  deliveryMethod?: string | null;
  gravida?: number | null;
  parity?: number | null;
  abortus?: number | null;

  // Data Bayi
  babyName: string | null;
  babyGender?: string | null;
  birthWeight?: number | null;
  birthLength?: number | null;

  // Faktor Risiko & Riwayat Penyakit
  hypertension?: boolean;
  diabetes?: boolean;
  preEclampsia?: boolean;
  anxietyDisorder?: boolean;
  depressionHistory?: boolean;

  // Kontak Darurat
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone?: string | null;

  // Catatan Bidan
  midwifeNotes?: string | null;

  // Status Antrean & Riwayat
  pendingCount: number;
  completedCount: number;
  totalAssessments: number;
  latestDate: string;
  latestType: string;
  pendingAssessments: ReviewAssessmentItem[];
  completedAssessments: ReviewAssessmentItem[];
}

interface ManifestOption {
  type: string;
  title: string;
}

interface MidwifeReviewDataTableProps {
  initialMothers: MotherReviewGroup[];
  manifests: ManifestOption[];
}

export default function MidwifeReviewDataTable({
  initialMothers,
  manifests,
}: MidwifeReviewDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // State untuk melacak baris mana yang di-expand (default: semua tertutup)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // State untuk tab aktif di dalam baris expanded ("reviews" atau "profile")
  const [activeTabPerMother, setActiveTabPerMother] = useState<Record<string, "reviews" | "profile">>({});

  const toggleExpand = (motherId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(motherId)) {
        next.delete(motherId);
      } else {
        next.add(motherId);
      }
      return next;
    });
  };

  const setMotherTab = (motherId: string, tab: "reviews" | "profile") => {
    setActiveTabPerMother((prev) => ({
      ...prev,
      [motherId]: tab,
    }));
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredMothers.map((m) => m.motherId)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Filter logic
  const filteredMothers = useMemo(() => {
    return initialMothers.filter((m) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = m.motherName.toLowerCase().includes(q);
        const matchesPhone = m.phoneNumber?.toLowerCase().includes(q);
        const matchesEmail = m.email?.toLowerCase().includes(q);
        const matchesBaby = m.babyName?.toLowerCase().includes(q);
        const matchesAddress = m.address?.toLowerCase().includes(q);
        const matchesType = [...m.pendingAssessments, ...m.completedAssessments].some(
          (a) => a.type.toLowerCase().includes(q) || a.typeTitle.toLowerCase().includes(q)
        );

        if (!matchesName && !matchesPhone && !matchesEmail && !matchesBaby && !matchesAddress && !matchesType) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter === "PENDING" && m.pendingCount === 0) {
        return false;
      }
      if (statusFilter === "COMPLETED" && m.completedCount === 0) {
        return false;
      }

      // 3. Assessment Type Filter
      if (selectedType !== "ALL") {
        const hasMatchingAssessment = [...m.pendingAssessments, ...m.completedAssessments].some(
          (a) => a.type === selectedType
        );
        if (!hasMatchingAssessment) {
          return false;
        }
      }

      return true;
    });
  }, [initialMothers, searchQuery, statusFilter, selectedType]);

  // Overall Statistics
  const totalMothers = initialMothers.length;
  const totalPendingReviews = useMemo(
    () => initialMothers.reduce((acc, curr) => acc + curr.pendingCount, 0),
    [initialMothers]
  );
  const totalCompletedReviews = useMemo(
    () => initialMothers.reduce((acc, curr) => acc + curr.completedCount, 0),
    [initialMothers]
  );

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const formatDateShort = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stat Cards — Klik kartu untuk filter langsung */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Ibu Terdaftar */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter("ALL");
            setSelectedType("ALL");
            setSearchQuery("");
          }}
          className={`text-left bg-card border rounded-2xl p-4 flex items-center justify-between gap-3.5 shadow-sm transition hover:shadow-md cursor-pointer ${
            statusFilter === "ALL" && !selectedType && !searchQuery
              ? "border-primary ring-2 ring-primary/20"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
              👥
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Ibu Terdaftar
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{totalMothers}</span>
                <span className="text-[11px] text-primary font-medium">Klik untuk lihat semua</span>
              </div>
            </div>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">Semua</span>
        </button>

        {/* Card 2: Antrean Perlu Ditinjau */}
        <button
          type="button"
          onClick={() => setStatusFilter("PENDING")}
          className={`text-left bg-card border rounded-2xl p-4 flex items-center justify-between gap-3.5 shadow-sm transition hover:shadow-md cursor-pointer ${
            statusFilter === "PENDING"
              ? "border-amber-500 ring-2 ring-amber-500/20"
              : "border-border hover:border-amber-500/50"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xl">
              ⏳
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Antrean Perlu Ditinjau
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-amber-600">{totalPendingReviews}</span>
                {totalPendingReviews > 0 && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse">
                    Segera
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-lg font-medium">
            Filter
          </span>
        </button>

        {/* Card 3: Riwayat Selesai */}
        <button
          type="button"
          onClick={() => setStatusFilter("COMPLETED")}
          className={`text-left bg-card border rounded-2xl p-4 flex items-center justify-between gap-3.5 shadow-sm transition hover:shadow-md cursor-pointer ${
            statusFilter === "COMPLETED"
              ? "border-sage-500 ring-2 ring-sage-500/20"
              : "border-border hover:border-sage-500/50"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sage-500/10 text-sage-600 flex items-center justify-center font-bold text-xl">
              ✅
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Riwayat Selesai
              </p>
              <p className="text-2xl font-bold text-sage-600">{totalCompletedReviews}</p>
            </div>
          </div>
          <span className="text-xs text-sage-700 bg-sage-50 dark:bg-sage-950/50 px-2 py-1 rounded-lg font-medium">
            Filter
          </span>
        </button>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              id="search-mother-input"
              type="text"
              placeholder="Cari nama ibu, nomor HP, nama bayi, atau jenis skrining..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Expand / Collapse All Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-foreground transition"
            >
              Buka Semua
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* Filter Badges / Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs">
          <span className="font-semibold text-muted-foreground mr-1">Status:</span>
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              statusFilter === "ALL"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua Ibu ({initialMothers.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3 py-1.5 rounded-full font-medium transition inline-flex items-center gap-1.5 ${
              statusFilter === "PENDING"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Ada Antrean ({initialMothers.filter((m) => m.pendingCount > 0).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("COMPLETED")}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              statusFilter === "COMPLETED"
                ? "bg-sage-600 text-white"
                : "bg-sage-50 dark:bg-sage-950/40 text-sage-700 dark:text-sage-300 hover:bg-sage-100"
            }`}
          >
            Ada Riwayat Selesai ({initialMothers.filter((m) => m.completedCount > 0).length})
          </button>

          {/* Divider */}
          <span className="text-border mx-1 hidden sm:inline">|</span>

          {/* Type Filter */}
          <span className="font-semibold text-muted-foreground mr-1">Jenis:</span>
          <button
            type="button"
            onClick={() => setSelectedType("ALL")}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              selectedType === "ALL"
                ? "bg-secondary text-secondary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua
          </button>
          {manifests.map((manifest) => (
            <button
              key={manifest.type}
              type="button"
              onClick={() => setSelectedType(manifest.type)}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                selectedType === manifest.type
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {manifest.type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Datatable */}
      {filteredMothers.length === 0 ? (
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <p className="font-semibold text-foreground text-base">Tidak ada data ibu yang sesuai</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {searchQuery
              ? `Tidak ditemukan ibu dengan pencarian "${searchQuery}". Coba sesuaikan kata kunci atau bersihkan filter.`
              : "Belum ada ibu terdaftar yang sesuai kriteria filter saat ini."}
          </p>
          {(searchQuery || statusFilter !== "ALL" || selectedType !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setSelectedType("ALL");
              }}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition inline-block"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-10 px-4 py-3.5 text-center"></th>
                  <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground">Nama Ibu & Status</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground">Kontak & Alamat</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground">Antrean Review</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground">Riwayat Selesai</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-muted-foreground">Aktivitas Terakhir</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMothers.map((mother) => {
                  const isExpanded = expandedIds.has(mother.motherId);
                  const hasPending = mother.pendingCount > 0;
                  const currentTab = activeTabPerMother[mother.motherId] || "reviews";

                  return (
                    <tr
                      key={mother.motherId}
                      className={`group transition-colors ${
                        hasPending
                          ? "bg-amber-500/[0.02] hover:bg-amber-500/[0.05]"
                          : "hover:bg-muted/20"
                      }`}
                    >
                      <td colSpan={7} className="p-0">
                        {/* Parent Row */}
                        <div
                          onClick={() => toggleExpand(mother.motherId)}
                          className="flex items-center w-full px-4 py-4 cursor-pointer select-none"
                        >
                          <div className="w-10 flex-shrink-0 text-center text-muted-foreground group-hover:text-foreground">
                            <span
                              className={`inline-block transition-transform duration-200 ${
                                isExpanded ? "rotate-90 text-primary font-bold" : ""
                              }`}
                            >
                              ▶
                            </span>
                          </div>

                          {/* Mother Name & Postpartum */}
                          <div className="flex-1 min-w-[200px] px-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                                {mother.motherName}
                              </span>
                              {mother.daysPostpartum !== null ? (
                                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                                  H+{mother.daysPostpartum} Nifas
                                </span>
                              ) : (
                                <span className="text-[11px] text-muted-foreground">
                                  Terdaftar
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                              {mother.deliveryDate && (
                                <span>Persalinan: {formatDateShort(mother.deliveryDate)}</span>
                              )}
                              {mother.babyName && (
                                <span className="text-foreground/80">• Bayi: {mother.babyName}</span>
                              )}
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="w-44 px-2 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">{mother.phoneNumber || "-"}</p>
                            <p className="truncate">{mother.email || mother.address || "-"}</p>
                          </div>

                          {/* Pending Review Badge */}
                          <div className="w-44 px-2">
                            {hasPending ? (
                              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                {mother.pendingCount} Perlu Ditinjau
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-muted-foreground text-xs font-medium px-2 py-1">
                                — Tidak ada antrean
                              </span>
                            )}
                          </div>

                          {/* Completed Count Badge */}
                          <div className="w-36 px-2">
                            {mother.completedCount > 0 ? (
                              <span className="inline-flex items-center gap-1.5 bg-sage-50 border border-sage-200 text-sage-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                                {mother.completedCount} Selesai
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs font-medium">0 Selesai</span>
                            )}
                          </div>

                          {/* Latest Activity */}
                          <div className="w-44 px-2 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">{mother.latestType}</p>
                            <p className="text-[11px]">{formatDate(mother.latestDate)}</p>
                          </div>

                          {/* Action Button */}
                          <div className="w-28 px-2 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(mother.motherId);
                              }}
                              className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition ${
                                isExpanded
                                  ? "bg-muted text-foreground border-border"
                                  : hasPending
                                  ? "bg-amber-600 text-white border-amber-600 hover:bg-amber-700"
                                  : "bg-card text-foreground border-border hover:bg-muted"
                              }`}
                            >
                              {isExpanded ? "Tutup ▲" : hasPending ? "Tinjau ▼" : "Detail ▼"}
                            </button>
                          </div>
                        </div>

                        {/* EXPANDED ACCORDION CONTENT */}
                        {isExpanded && (
                          <div className="bg-muted/15 border-t border-border px-6 md:px-8 py-5 space-y-5 animate-in fade-in-50 duration-200">
                            {/* Inner Tab Switcher: Skrining vs Data Lengkap */}
                            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setMotherTab(mother.motherId, "reviews")}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                    currentTab === "reviews"
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <span>📋 Antrean & Riwayat Skrining</span>
                                  <span className="bg-background/20 px-2 py-0.5 rounded-full text-[11px]">
                                    {mother.totalAssessments}
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setMotherTab(mother.motherId, "profile")}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                    currentTab === "profile"
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <span>👤 Data Lengkap & Rekam Klinis Ibu</span>
                                  {mother.hypertension || mother.preEclampsia || mother.diabetes ? (
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Ada catatan komorbid" />
                                  ) : null}
                                </button>
                              </div>

                              <div className="text-xs text-muted-foreground">
                                ID Pasien: <span className="font-mono text-foreground">{mother.motherId}</span>
                              </div>
                            </div>

                            {/* TAB 1: SKRINING & REVIEW */}
                            {currentTab === "reviews" && (
                              <div className="space-y-6">
                                {/* SECTION 1: ANTREAN REVIEW */}
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                      <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">
                                        Antrean Review Menunggu Tindakan ({mother.pendingAssessments.length})
                                      </h4>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      Peninjauan tingkat pertama oleh Bidan
                                    </span>
                                  </div>

                                  {mother.pendingAssessments.length === 0 ? (
                                    <div className="bg-card border border-dashed border-border rounded-xl p-4 text-center text-xs text-muted-foreground">
                                      Tidak ada assessment yang menunggu review untuk ibu ini saat ini.
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                      {mother.pendingAssessments.map((item) => (
                                        <div
                                          key={item.id}
                                          className="bg-card border border-amber-200/80 dark:border-amber-900/50 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                                        >
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                              <span className="font-bold text-foreground text-sm">
                                                {item.typeTitle}
                                              </span>
                                              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                Menunggu Review
                                              </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                              Dikirim pada:{" "}
                                              <span className="font-medium text-foreground">
                                                {item.submittedAt
                                                  ? formatDate(item.submittedAt)
                                                  : formatDate(item.createdAt)}
                                              </span>
                                            </p>
                                          </div>

                                          <Link
                                            id={`btn-review-${item.id}`}
                                            href={`/midwife/review/${item.id}`}
                                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap flex items-center gap-1.5"
                                          >
                                            <span>Tinjau Sekarang</span>
                                            <span>→</span>
                                          </Link>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* SECTION 2: RIWAYAT REVIEW */}
                                <div className="space-y-3 pt-4 border-t border-border">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded-full bg-sage-500" />
                                      <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">
                                        Riwayat Review Terdahulu ({mother.completedAssessments.length})
                                      </h4>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      Daftar skrining yang sudah selesai atau sedang ditindaklanjuti
                                    </span>
                                  </div>

                                  {mother.completedAssessments.length === 0 ? (
                                    <div className="bg-card border border-dashed border-border rounded-xl p-4 text-center text-xs text-muted-foreground">
                                      Belum ada riwayat review sebelumnya untuk ibu ini.
                                    </div>
                                  ) : (
                                    <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                                      {mother.completedAssessments.map((item) => {
                                        const displayDate = item.updatedAt || item.completedAt || item.createdAt;

                                        return (
                                          <div
                                            key={item.id}
                                            className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
                                          >
                                            <div className="space-y-1">
                                              <div className="flex items-center gap-2.5 flex-wrap">
                                                <span className="font-semibold text-foreground text-sm">
                                                  {item.typeTitle}
                                                </span>

                                                {item.status === "UNDER_REVIEW" ? (
                                                  <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    Review Tingkat 2
                                                  </span>
                                                ) : item.status === "REJECTED" ? (
                                                  <span className="inline-flex items-center gap-1 bg-blush-50 border border-blush-200 text-blush-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    Dikembalikan
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center gap-1 bg-sage-50 border border-sage-200 text-sage-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    Selesai Ditinjau
                                                  </span>
                                                )}
                                              </div>

                                              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                                <span>Terakhir diupdate: {formatDate(displayDate)}</span>
                                                {item.latestReview?.decision && (
                                                  <span className="text-foreground font-medium">
                                                    • Keputusan: {item.latestReview.decision}
                                                  </span>
                                                )}
                                                {item.latestReview?.note && (
                                                  <span className="italic truncate max-w-sm">
                                                    &quot;{item.latestReview.note}&quot;
                                                  </span>
                                                )}
                                              </div>
                                            </div>

                                            <Link
                                              id={`btn-detail-${item.id}`}
                                              href={`/midwife/review/${item.id}`}
                                              className="bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold px-3.5 py-2 rounded-xl transition border border-border whitespace-nowrap"
                                            >
                                              Lihat Detail
                                            </Link>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* TAB 2: DATA LENGKAP & REKAM KLINIS IBU */}
                            {currentTab === "profile" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">
                                {/* Kartu 1: Biodata & Kontak Pribadi */}
                                <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                                    <span className="text-primary font-bold">👤</span>
                                    <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">
                                      Biodata & Kontak Ibu
                                    </h5>
                                  </div>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Nama Lengkap:</span>
                                      <span className="font-semibold text-foreground text-right">{mother.motherName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Nomor WhatsApp / HP:</span>
                                      <span className="font-medium text-foreground">{mother.phoneNumber || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Email Akun:</span>
                                      <span className="text-foreground truncate max-w-[200px]">{mother.email || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Tanggal Lahir:</span>
                                      <span className="text-foreground">{mother.dateOfBirth ? formatDateShort(mother.dateOfBirth) : "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Pendidikan:</span>
                                      <span className="text-foreground">{mother.education || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Pekerjaan:</span>
                                      <span className="text-foreground">{mother.occupation || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Alamat Domisili:</span>
                                      <span className="text-foreground text-right max-w-[220px]">{mother.address || "—"}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Kartu 2: Riwayat Persalinan & Hari Nifas */}
                                <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                                    <span className="text-primary font-bold">🩺</span>
                                    <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">
                                      Data Persalinan & Nifas
                                    </h5>
                                  </div>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground">Tanggal Persalinan:</span>
                                      <span className="font-semibold text-foreground">
                                        {mother.deliveryDate ? formatDateShort(mother.deliveryDate) : "—"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground">Masa Nifas Saat Ini:</span>
                                      {mother.daysPostpartum !== null ? (
                                        <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                                          Hari ke-{mother.daysPostpartum}
                                        </span>
                                      ) : (
                                        <span className="text-muted-foreground">—</span>
                                      )}
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Metode Persalinan:</span>
                                      <span className="font-medium text-foreground">{mother.deliveryMethod || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Riwayat Obstetri:</span>
                                      <span className="font-medium text-foreground">
                                        G{mother.gravida ?? "?"} P{mother.parity ?? "?"} A{mother.abortus ?? "0"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Status Verifikasi:</span>
                                      <span className="text-foreground font-medium">{mother.userStatus || "ACTIVE"}</span>
                                    </div>
                                    {mother.midwifeNotes && (
                                      <div className="pt-2 border-t border-border">
                                        <span className="text-muted-foreground block mb-1">Catatan Bidan:</span>
                                        <p className="p-2 bg-muted/40 rounded-lg text-foreground italic">
                                          &quot;{mother.midwifeNotes}&quot;
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Kartu 3: Data Bayi */}
                                <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                                    <span className="text-primary font-bold">👶</span>
                                    <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">
                                      Data Bayi
                                    </h5>
                                  </div>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Nama Bayi:</span>
                                      <span className="font-semibold text-foreground">{mother.babyName || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Jenis Kelamin:</span>
                                      <span className="text-foreground">
                                        {mother.babyGender === "Male"
                                          ? "Laki-laki"
                                          : mother.babyGender === "Female"
                                          ? "Perempuan"
                                          : mother.babyGender || "—"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Berat Badan Lahir:</span>
                                      <span className="text-foreground font-medium">
                                        {mother.birthWeight ? `${mother.birthWeight} gram / kg` : "—"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Panjang Badan Lahir:</span>
                                      <span className="text-foreground font-medium">
                                        {mother.birthLength ? `${mother.birthLength} cm` : "—"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Kartu 4: Faktor Risiko & Kontak Darurat */}
                                <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                                    <span className="text-primary font-bold">⚠️</span>
                                    <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">
                                      Faktor Risiko & Kontak Darurat
                                    </h5>
                                  </div>

                                  {/* Skrining Komorbid */}
                                  <div className="space-y-1.5 text-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">Hipertensi:</span>
                                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                                        mother.hypertension ? "bg-rose-100 text-rose-800" : "bg-muted text-muted-foreground"
                                      }`}>
                                        {mother.hypertension ? "Ya (Risiko)" : "Tidak"}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">Diabetes Melitus:</span>
                                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                                        mother.diabetes ? "bg-rose-100 text-rose-800" : "bg-muted text-muted-foreground"
                                      }`}>
                                        {mother.diabetes ? "Ya (Risiko)" : "Tidak"}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">Pre-Eklampsia:</span>
                                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                                        mother.preEclampsia ? "bg-rose-100 text-rose-800" : "bg-muted text-muted-foreground"
                                      }`}>
                                        {mother.preEclampsia ? "Ya (Risiko)" : "Tidak"}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">Riwayat Gangguan Kecemasan:</span>
                                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                                        mother.anxietyDisorder ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"
                                      }`}>
                                        {mother.anxietyDisorder ? "Ya" : "Tidak"}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">Riwayat Depresi:</span>
                                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                                        mother.depressionHistory ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"
                                      }`}>
                                        {mother.depressionHistory ? "Ya" : "Tidak"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Kontak Darurat */}
                                  <div className="pt-2.5 border-t border-border space-y-1 text-xs">
                                    <p className="font-semibold text-foreground">Kontak Darurat:</p>
                                    <p className="text-muted-foreground">
                                      {mother.emergencyContactName ? (
                                        <>
                                          <span className="font-medium text-foreground">{mother.emergencyContactName}</span>
                                          {mother.emergencyContactRelationship && ` (${mother.emergencyContactRelationship})`}
                                          {mother.emergencyContactPhone && ` • ${mother.emergencyContactPhone}`}
                                        </>
                                      ) : (
                                        "— Tidak tercantum"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-border">
            {filteredMothers.map((mother) => {
              const isExpanded = expandedIds.has(mother.motherId);
              const hasPending = mother.pendingCount > 0;
              const currentTab = activeTabPerMother[mother.motherId] || "reviews";

              return (
                <div key={mother.motherId} className="p-4 space-y-3">
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(mother.motherId)}
                    className="cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-base text-foreground flex items-center gap-2">
                          {mother.motherName}
                          <span className="text-xs font-normal text-muted-foreground">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </p>
                        {mother.daysPostpartum !== null ? (
                          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                            H+{mother.daysPostpartum} Nifas
                          </span>
                        ) : (
                          <span className="inline-block text-xs text-muted-foreground mt-1">
                            Terdaftar
                          </span>
                        )}
                      </div>

                      {hasPending ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {mother.pendingCount} Antrean
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-sage-50 border border-sage-200 text-sage-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {mother.completedCount} Selesai
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>HP: {mother.phoneNumber || "-"}</p>
                      {mother.babyName && <p>Bayi: {mother.babyName}</p>}
                      <p>Skrining terakhir: {mother.latestType} ({formatDateShort(mother.latestDate)})</p>
                    </div>
                  </div>

                  {/* Mobile Expanded Section */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-border space-y-4 animate-in fade-in-50 duration-200">
                      {/* Mobile Tabs */}
                      <div className="flex rounded-xl bg-muted p-1 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setMotherTab(mother.motherId, "reviews")}
                          className={`flex-1 py-1.5 rounded-lg transition ${
                            currentTab === "reviews"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Skrining ({mother.totalAssessments})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMotherTab(mother.motherId, "profile")}
                          className={`flex-1 py-1.5 rounded-lg transition ${
                            currentTab === "profile"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Data Pasien
                        </button>
                      </div>

                      {currentTab === "reviews" ? (
                        <>
                          {/* Antrean */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                                Antrean Review ({mother.pendingAssessments.length})
                              </p>
                            </div>
                            {mother.pendingAssessments.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic bg-muted/40 p-2.5 rounded-lg text-center">
                                Tidak ada antrean review
                              </p>
                            ) : (
                              mother.pendingAssessments.map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-card border border-amber-200 rounded-xl p-3 space-y-2"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="font-bold text-xs text-foreground">{item.typeTitle}</span>
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                      Menunggu
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground">
                                    {formatDate(item.submittedAt || item.createdAt)}
                                  </p>
                                  <Link
                                    id={`btn-mobile-review-${item.id}`}
                                    href={`/midwife/review/${item.id}`}
                                    className="block w-full text-center bg-amber-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-amber-700 transition"
                                  >
                                    Tinjau Sekarang →
                                  </Link>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Riwayat */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-sage-500" />
                              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                                Riwayat Review ({mother.completedAssessments.length})
                              </p>
                            </div>
                            {mother.completedAssessments.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic bg-muted/40 p-2.5 rounded-lg text-center">
                                Belum ada riwayat review
                              </p>
                            ) : (
                              mother.completedAssessments.map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-card border border-border rounded-xl p-3 space-y-2"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="font-semibold text-xs text-foreground">
                                      {item.typeTitle}
                                    </span>
                                    <span
                                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                        item.status === "COMPLETED"
                                          ? "bg-sage-100 text-sage-800"
                                          : item.status === "UNDER_REVIEW"
                                          ? "bg-indigo-100 text-indigo-800"
                                          : "bg-blush-100 text-blush-800"
                                      }`}
                                    >
                                      {item.status === "COMPLETED"
                                        ? "Selesai"
                                        : item.status === "UNDER_REVIEW"
                                        ? "Level 2"
                                        : "Dikembalikan"}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground">
                                    {formatDate(item.updatedAt || item.completedAt || item.createdAt)}
                                  </p>
                                  <Link
                                    id={`btn-mobile-detail-${item.id}`}
                                    href={`/midwife/review/${item.id}`}
                                    className="block w-full text-center bg-muted text-foreground text-xs font-semibold py-2 rounded-lg border border-border hover:bg-muted/80 transition"
                                  >
                                    Lihat Detail
                                  </Link>
                                </div>
                              ))
                            )}
                          </div>
                        </>
                      ) : (
                        /* Mobile Profile View */
                        <div className="space-y-3 text-xs">
                          <div className="bg-card border border-border rounded-xl p-3 space-y-2">
                            <p className="font-bold text-foreground">Data Persalinan & Bayi</p>
                            <div className="space-y-1 text-muted-foreground">
                              <p>Persalinan: {mother.deliveryDate ? formatDateShort(mother.deliveryDate) : "—"}</p>
                              <p>Metode: {mother.deliveryMethod || "—"}</p>
                              <p>Obstetri: G{mother.gravida ?? "?"} P{mother.parity ?? "?"} A{mother.abortus ?? "0"}</p>
                              <p>Bayi: {mother.babyName || "—"} ({mother.babyGender || "—"})</p>
                              <p>BB/PB Lahir: {mother.birthWeight || "—"} / {mother.birthLength || "—"}</p>
                            </div>
                          </div>

                          <div className="bg-card border border-border rounded-xl p-3 space-y-2">
                            <p className="font-bold text-foreground">Faktor Risiko</p>
                            <div className="flex flex-wrap gap-1.5">
                              {mother.hypertension && <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">Hipertensi</span>}
                              {mother.diabetes && <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">Diabetes</span>}
                              {mother.preEclampsia && <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">Pre-Eklampsia</span>}
                              {mother.anxietyDisorder && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Kecemasan</span>}
                              {mother.depressionHistory && <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Depresi</span>}
                              {!mother.hypertension && !mother.diabetes && !mother.preEclampsia && !mother.anxietyDisorder && !mother.depressionHistory && (
                                <span className="text-muted-foreground italic">Tidak ada faktor risiko tercatat</span>
                              )}
                            </div>
                          </div>

                          <div className="bg-card border border-border rounded-xl p-3 space-y-1">
                            <p className="font-bold text-foreground">Kontak Darurat</p>
                            <p className="text-muted-foreground">
                              {mother.emergencyContactName ? `${mother.emergencyContactName} (${mother.emergencyContactRelationship}) - ${mother.emergencyContactPhone}` : "—"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
