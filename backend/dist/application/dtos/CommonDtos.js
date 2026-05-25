"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const paginate = (data, page, limit, total) => ({
    data,
    meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
    }
});
exports.paginate = paginate;
