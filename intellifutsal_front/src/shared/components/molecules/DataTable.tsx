import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    width?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    getRowId: (row: T) => number;
    getRowStatus?: (row: T) => boolean;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onToggleStatus?: (row: T) => void;
    customActions?: (row: T) => React.ReactNode;
    searchTerm?: string;
    searchKeys?: (keyof T)[];
    getRowLabel?: (row: T) => string;
    isDeleting?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T = any>({
    data,
    columns,
    getRowId,
    getRowStatus,
    onEdit,
    onDelete,
    onToggleStatus,
    customActions,
    searchTerm = "",
    searchKeys = [],
    getRowLabel,
    isDeleting = false,
    pageSize: pageSizeProp = 5,
    pageSizeOptions = [10, 25, 50, 100],
    showPageSizeSelector = true,
}: DataTableProps<T>) {
    const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeProp);

    useEffect(() => {
        // if parent changes default pageSize prop, respect it
        setPageSize(pageSizeProp);
        setPage(1);
    }, [pageSizeProp]);

    const filtered = useMemo(() => {
        if (!searchTerm || !searchKeys || searchKeys.length === 0) return data;

        const term = searchTerm.toLowerCase();
        return data.filter((row) =>
            searchKeys.some((key) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const raw = (row as any)[key as any];
                return raw != null && String(raw).toLowerCase().includes(term);
            })
        );
    }, [data, searchTerm, searchKeys]);

    // Reset to first page on filter/search/data changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm, filtered.length]);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);

    useEffect(() => {
        if (page !== safePage) setPage(safePage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safePage]);

    const startIdx = (safePage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalItems);

    const pagedRows = useMemo(() => {
        if (totalItems === 0) return [];
        return filtered.slice(startIdx, endIdx);
    }, [filtered, startIdx, endIdx, totalItems]);

    const canPrev = safePage > 1;
    const canNext = safePage < totalPages;

    const openDeleteModal = (row: T) => {
        if (!onDelete) return;
        setDeleteTarget(row);
    };

    const closeDeleteModal = () => setDeleteTarget(null);

    const confirmDelete = () => {
        if (!deleteTarget) return;
        onDelete?.(deleteTarget);
        closeDeleteModal();
    };

    const goTo = (p: number) => {
        const clamped = Math.min(Math.max(1, p), totalPages);
        setPage(clamped);
    };

    const renderPageButtons = () => {
        // compact pagination: 1 ... (p-1) p (p+1) ... last
        const pages = new Set<number>([1, totalPages, safePage - 1, safePage, safePage + 1]);
        const list = Array.from(pages)
            .filter((p) => p >= 1 && p <= totalPages)
            .sort((a, b) => a - b);

        const out: Array<number | "dots"> = [];
        for (let i = 0; i < list.length; i++) {
            const curr = list[i];
            const prev = list[i - 1];
            if (i > 0 && prev !== undefined && curr - prev > 1) out.push("dots");
            out.push(curr);
        }

        return out.map((item, idx) => {
            if (item === "dots") {
                return (
                    <span key={`dots-${idx}`} className="px-2 text-sm text-gray-400">
                        …
                    </span>
                );
            }

            const active = item === safePage;
            return (
                <button
                    key={item}
                    type="button"
                    onClick={() => goTo(item)}
                    disabled={isDeleting}
                    className={`min-w-9 h-9 px-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer
                        ${active
                            ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                    aria-current={active ? "page" : undefined}
                    title={`Página ${item}`}
                >
                    {item}
                </button>
            );
        });
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4"
                                    style={{ width: col.width }}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete || onToggleStatus || customActions) && (
                                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-4">
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {totalItems === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center py-8 text-sm text-gray-500">
                                    {searchTerm ? "No se encontraron resultados" : "No hay datos"}
                                </td>
                            </tr>
                        ) : (
                            pagedRows.map((row) => {
                                const id = getRowId(row);
                                const status = getRowStatus ? getRowStatus(row) : true;

                                return (
                                    <tr
                                        key={id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!status ? "opacity-60" : ""
                                            }`}
                                    >
                                        {columns.map((col, i) => (
                                            <td key={i} className="py-3 px-4 text-sm text-gray-700">
                                                {typeof col.accessor === "function"
                                                    ? col.accessor(row)
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    : ((row as any)[col.accessor as any] as React.ReactNode)}
                                            </td>
                                        ))}

                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {customActions?.(row)}

                                                {onToggleStatus && (
                                                    <button
                                                        onClick={() => onToggleStatus(row)}
                                                        title={status ? "Desactivar" : "Activar"}
                                                        className={`p-2 rounded-lg transition-colors cursor-pointer ${status
                                                                ? "text-green-600 hover:bg-green-50"
                                                                : "text-gray-400 hover:bg-gray-100"
                                                            }`}
                                                        disabled={isDeleting}
                                                    >
                                                        {status ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                                                    </button>
                                                )}

                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        title="Editar"
                                                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        disabled={isDeleting}
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                )}

                                                {onDelete && (
                                                    <button
                                                        onClick={() => openDeleteModal(row)}
                                                        title="Eliminar"
                                                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        disabled={isDeleting}
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination bar */}
            {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-white/70">
                    <div className="text-xs sm:text-sm text-gray-600">
                        Mostrando <span className="font-semibold">{startIdx + 1}</span>–{" "}
                        <span className="font-semibold">{endIdx}</span> de{" "}
                        <span className="font-semibold">{totalItems}</span>
                        {searchTerm ? <span className="text-gray-400"> (filtrados)</span> : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {showPageSizeSelector && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Filas:</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        const next = Number(e.target.value);
                                        setPageSize(next);
                                        setPage(1);
                                    }}
                                    disabled={isDeleting}
                                    className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                                >
                                    {pageSizeOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => goTo(1)}
                                disabled={!canPrev || isDeleting}
                                className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Primera"
                            >
                                «
                            </button>
                            <button
                                type="button"
                                onClick={() => goTo(safePage - 1)}
                                disabled={!canPrev || isDeleting}
                                className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Anterior"
                            >
                                ‹
                            </button>

                            <div className="flex items-center gap-1">{renderPageButtons()}</div>

                            <button
                                type="button"
                                onClick={() => goTo(safePage + 1)}
                                disabled={!canNext || isDeleting}
                                className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Siguiente"
                            >
                                ›
                            </button>
                            <button
                                type="button"
                                onClick={() => goTo(totalPages)}
                                disabled={!canNext || isDeleting}
                                className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Última"
                            >
                                »
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                isOpen={deleteTarget !== null}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                itemName={deleteTarget ? (getRowLabel ? getRowLabel(deleteTarget) : undefined) : undefined}
                description="Esta acción eliminará el registro de forma permanente."
                confirmText="Eliminar"
            />
        </>
    );
}