import type { QuizQuestion } from "@/types/quiz";

/**
 * The QuizNova question bank — exactly 10 technology questions, each with
 * four options and one correct answer.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What does the acronym CPU stand for?",
    options: [
      { id: "q1-a", text: "Central Processing Unit" },
      { id: "q1-b", text: "Computer Personal Unit" },
      { id: "q1-c", text: "Central Program Utility" },
      { id: "q1-d", text: "Core Processing Utility" },
    ],
    correctOptionId: "q1-a",
  },
  {
    id: "q2",
    prompt: "Which language is primarily used to style web pages?",
    options: [
      { id: "q2-a", text: "HTML" },
      { id: "q2-b", text: "CSS" },
      { id: "q2-c", text: "SQL" },
      { id: "q2-d", text: "Python" },
    ],
    correctOptionId: "q2-b",
  },
  {
    id: "q3",
    prompt: "What does HTTP stand for?",
    options: [
      { id: "q3-a", text: "HyperText Transfer Protocol" },
      { id: "q3-b", text: "High Transfer Text Process" },
      { id: "q3-c", text: "Hyperlink Transmission Protocol" },
      { id: "q3-d", text: "Host Transfer Type Protocol" },
    ],
    correctOptionId: "q3-a",
  },
  {
    id: "q4",
    prompt: "Which company originally developed the JavaScript language?",
    options: [
      { id: "q4-a", text: "Microsoft" },
      { id: "q4-b", text: "Sun Microsystems" },
      { id: "q4-c", text: "Netscape" },
      { id: "q4-d", text: "IBM" },
    ],
    correctOptionId: "q4-c",
  },
  {
    id: "q5",
    prompt: "In computing, what is a 'bit'?",
    options: [
      { id: "q5-a", text: "A group of eight bytes" },
      { id: "q5-b", text: "The smallest unit of data, either 0 or 1" },
      { id: "q5-c", text: "A type of network cable" },
      { id: "q5-d", text: "A programming language" },
    ],
    correctOptionId: "q5-b",
  },
  {
    id: "q6",
    prompt: "Which of these is a relational database management system?",
    options: [
      { id: "q6-a", text: "MongoDB" },
      { id: "q6-b", text: "Redis" },
      { id: "q6-c", text: "PostgreSQL" },
      { id: "q6-d", text: "Cassandra" },
    ],
    correctOptionId: "q6-c",
  },
  {
    id: "q7",
    prompt: "What does the 'S' in HTTPS signify?",
    options: [
      { id: "q7-a", text: "Standard" },
      { id: "q7-b", text: "Secure" },
      { id: "q7-c", text: "Server" },
      { id: "q7-d", text: "Static" },
    ],
    correctOptionId: "q7-b",
  },
  {
    id: "q8",
    prompt:
      "Which data structure follows the Last In, First Out (LIFO) principle?",
    options: [
      { id: "q8-a", text: "Queue" },
      { id: "q8-b", text: "Stack" },
      { id: "q8-c", text: "Linked list" },
      { id: "q8-d", text: "Tree" },
    ],
    correctOptionId: "q8-b",
  },
  {
    id: "q9",
    prompt: "What is the primary purpose of an operating system?",
    options: [
      { id: "q9-a", text: "To browse the internet" },
      { id: "q9-b", text: "To manage hardware and software resources" },
      { id: "q9-c", text: "To design web pages" },
      { id: "q9-d", text: "To store files permanently" },
    ],
    correctOptionId: "q9-b",
  },
  {
    id: "q10",
    prompt:
      "Which protocol is used to translate domain names into IP addresses?",
    options: [
      { id: "q10-a", text: "FTP" },
      { id: "q10-b", text: "SMTP" },
      { id: "q10-c", text: "DNS" },
      { id: "q10-d", text: "DHCP" },
    ],
    correctOptionId: "q10-c",
  },
];
