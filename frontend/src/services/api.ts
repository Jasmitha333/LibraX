const API_BASE_URL = "http://localhost:8080/api";

// ==================== BOOKS ====================

export async function getBooks() {
    const response = await fetch(`${API_BASE_URL}/books`);

    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }

    return response.json();
}

export async function addBook(book: any) {
    const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
    });

    if (!response.ok) {
        throw new Error("Failed to add book");
    }

    return response.json();
}

export async function updateBook(id: string, book: any) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
    });

    if (!response.ok) {
        throw new Error("Failed to update book");
    }

    return response.json();
}

export async function deleteBook(id: string) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete book");
    }

    return response.json();
}


// ==================== MEMBERS ====================

export async function getMembers() {
    const response = await fetch(`${API_BASE_URL}/members`);

    if (!response.ok) {
        throw new Error("Failed to fetch members");
    }

    return response.json();
}

export async function addMember(member: any) {
    const response = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(member),
    });

    if (!response.ok) {
        throw new Error("Failed to add member");
    }

    return response.json();
}

export async function updateMember(id: string, member: any) {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(member),
    });

    if (!response.ok) {
        throw new Error("Failed to update member");
    }

    return response.json();
}

export async function deleteMember(id: string) {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete member");
    }

    return response.json();
}


// ==================== TRANSACTIONS ====================

export async function getTransactions() {
    const response = await fetch(`${API_BASE_URL}/transactions`);

    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return response.json();
}

export async function issueBook(transaction: any) {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
    });

    if (!response.ok) {
        throw new Error("Failed to issue book");
    }

    return response.json();
}

export async function returnBook(transactionId: string) {
    const response = await fetch(
        `${API_BASE_URL}/transactions/${transactionId}`,
        {
            method: "PUT",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to return book");
    }

    return response.json();
}