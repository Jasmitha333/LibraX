export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
    issuedCopies: number;
    status: string;
}

export interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    booksBorrowed: number;
}

export interface Transaction {
    id: string;
    memberName: string;
    bookTitle: string;
    issueDate: string;
    dueDate: string;
    fine: number;
    status: string;
}