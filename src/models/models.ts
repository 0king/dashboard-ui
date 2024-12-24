
//schema:
//Level -> subject -> topic -> subtopic -> questions

export interface Level {
    id: number;
    name: string;
    media?: string;
    description?: string;
}

export interface Subject {
    id: number;
    name: string;
    levelId: number;
    media?: string;
    description?: string;
}

export interface Topic {
    id: number;
    name: string;
    subjectId: number;
    media?: string;
    description?: string;
    parentId?: number;
}

export interface Question {
    id: string;
    title: string;
    type: string;
    content: string[];
    media?: string[];
    minutes: number;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    examId: number;
    topicId: number;
    solution: Solution;
}

export interface Solution {
    id: number;
    content: string[];
    media?: string[];
    createdAt: Date;
    updatedAt: Date;
    minutes: number;
}

export interface Exam {
    id: number;
    name: string;
    minutes: number;
    description?: string;
    image?: string;
    questions: Question[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Author {
    id: number;
    name: string;
    email: string;
}
