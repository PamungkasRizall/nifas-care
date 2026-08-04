import type { Question } from "../epds/types";

export const GAD7_QUESTIONS: Question[] = [
  {
    id: "gad7_q1",
    text: "Merasa gugup, cemas, atau tegang:",
    options: [
      { text: "Tidak pernah sama sekali", score: 0 },
      { text: "Beberapa hari", score: 1 },
      { text: "Lebih dari separuh waktu", score: 2 },
      { text: "Hampir setiap hari", score: 3 },
    ],
  },
  {
    id: "gad7_q2",
    text: "Tidak bisa berhenti atau mengendalikan kekhawatiran:",
    options: [
      { text: "Tidak pernah sama sekali", score: 0 },
      { text: "Beberapa hari", score: 1 },
      { text: "Lebih dari separuh waktu", score: 2 },
      { text: "Hampir setiap hari", score: 3 },
    ],
  },
  {
    id: "gad7_q3",
    text: "Terlalu banyak khawatir tentang berbagai hal:",
    options: [
      { text: "Tidak pernah sama sekali", score: 0 },
      { text: "Beberapa hari", score: 1 },
      { text: "Lebih dari separuh waktu", score: 2 },
      { text: "Hampir setiap hari", score: 3 },
    ],
  },
  {
    id: "gad7_q4",
    text: "Kesulitan bersantai (susah relaks):",
    options: [
      { text: "Tidak pernah sama sekali", score: 0 },
      { text: "Beberapa hari", score: 1 },
      { text: "Lebih dari separuh waktu", score: 2 },
      { text: "Hampir setiap hari", score: 3 },
    ],
  },
  {
    id: "gad7_q5",
    text: "Gelisah sehingga sulit duduk diam:",
    options: [
      { text: "Tidak pernah sama sekali", score: 0 },
      { text: "Beberapa hari", score: 1 },
      { text: "Lebih dari separuh waktu", score: 2 },
      { text: "Hampir setiap hari", score: 3 },
    ],
  },
  {
    id: "gad7_q6",
    text: "Menjadi mudah kesal atau mudah tersinggung:",
    options: [
      { text: "Tidak pernah sama sekali", score: 0 },
      { text: "Beberapa hari", score: 1 },
      { text: "Lebih dari separuh waktu", score: 2 },
      { text: "Hampir setiap hari", score: 3 },
    ],
  },
  {
    id: "gad7_q7",
    text: "Merasa takut seolah-olah sesuatu yang buruk akan terjadi:",
    options: [
      { text: "Tidak pernah sama sekali", score: 0 },
      { text: "Beberapa hari", score: 1 },
      { text: "Lebih dari separuh waktu", score: 2 },
      { text: "Hampir setiap hari", score: 3 },
    ],
  },
];
