const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        })
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            },
        });
        response.code(201);
        return response;
    };
};

const getAllBooksHandler = (request ,h) => {
    const limitedBooks = books.slice(0, 2);
    const response = h.response({
        status: 'success',
        data: {
            books: limitedBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.find((n) => n.id === id);

    if(book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response; 
}

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if(name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    if(id === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        response.code(404);
        return response;
    }

    if(index === -1){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    if(index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    };
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if(index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;

}



module.exports = { 
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};