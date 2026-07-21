import type { Question } from "./types";

export const EPDS_QUESTIONS: Question[] = [
  {
    id: "epds_q1",
    text: "Saya mampu tertawa dan melihat sisi menyenangkan dari berbagai hal:",
    options: [
      { text: "Sama seperti biasanya", score: 0 },
      { text: "Tidak begitu banyak sekarang", score: 1 },
      { text: "Jelas kurang banyak sekarang", score: 2 },
      { text: "Tidak bisa sama sekali", score: 3 },
    ],
  },
  {
    id: "epds_q2",
    text: "Saya memandang ke depan dengan rasa senang terhadap berbagai hal:",
    options: [
      { text: "Sama seperti biasanya", score: 0 },
      { text: "Agak kurang dari biasanya", score: 1 },
      { text: "Jelas kurang dari biasanya", score: 2 },
      { text: "Hampir tidak bisa sama sekali", score: 3 },
    ],
  },
  {
    id: "epds_q3",
    text: "Saya menyalahkan diri sendiri secara tidak perlu ketika ada hal yang salah:",
    options: [
      { text: "Ya, hampir sepanjang waktu", score: 3 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Tidak terlalu sering", score: 1 },
      { text: "Tidak pernah", score: 0 },
    ],
  },
  {
    id: "epds_q4",
    text: "Saya merasa cemas atau khawatir tanpa alasan yang jelas:",
    options: [
      { text: "Tidak, tidak sama sekali", score: 0 },
      { text: "Hampir tidak pernah", score: 1 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Ya, sangat sering", score: 3 },
    ],
  },
  {
    id: "epds_q5",
    text: "Saya merasa takut atau panik tanpa alasan yang sangat jelas:",
    options: [
      { text: "Ya, cukup banyak", score: 3 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Tidak, tidak terlalu banyak", score: 1 },
      { text: "Tidak, tidak sama sekali", score: 0 },
    ],
  },
  {
    id: "epds_q6",
    text: "Banyak hal yang menumpuk dan membuat saya merasa tidak mampu mengatasinya:",
    options: [
      { text: "Ya, sebagian besar waktu saya tidak mampu mengatasinya sama sekali", score: 3 },
      { text: "Ya, kadang-kadang saya tidak mampu mengatasi seperti biasanya", score: 2 },
      { text: "Tidak, sebagian besar waktu saya dapat mengatasi dengan cukup baik", score: 1 },
      { text: "Tidak, saya dapat mengatasi masalah seperti biasanya", score: 0 },
    ],
  },
  {
    id: "epds_q7",
    text: "Saya merasa tidak bahagia sehingga saya mengalami kesulitan untuk tidur:",
    options: [
      { text: "Ya, hampir sepanjang waktu", score: 3 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Tidak terlalu sering", score: 1 },
      { text: "Tidak, tidak sama sekali", score: 0 },
    ],
  },
  {
    id: "epds_q8",
    text: "Saya merasa sedih atau sengsara:",
    options: [
      { text: "Ya, hampir sepanjang waktu", score: 3 },
      { text: "Ya, cukup sering", score: 2 },
      { text: "Tidak terlalu sering", score: 1 },
      { text: "Tidak, tidak sama sekali", score: 0 },
    ],
  },
  {
    id: "epds_q9",
    text: "Saya merasa sangat tidak bahagia sehingga saya menangis:",
    options: [
      { text: "Ya, hampir sepanjang waktu", score: 3 },
      { text: "Ya, cukup sering", score: 2 },
      { text: "Hanya kadang-kadang", score: 1 },
      { text: "Tidak, tidak pernah", score: 0 },
    ],
  },
  {
    id: "epds_q10",
    text: "Pikiran untuk mencelakakan diri sendiri pernah terpikir oleh saya:",
    options: [
      { text: "Ya, cukup sering", score: 3 },
      { text: "Kadang-kadang", score: 2 },
      { text: "Hampir tidak pernah", score: 1 },
      { text: "Tidak pernah", score: 0 },
    ],
  },
];
