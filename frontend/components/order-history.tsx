"use client";

import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';

type OrderHistoryProps = {
    isAuthenticated?: boolean;
};

export default function OrderHistory({ isAuthenticated = false }: OrderHistoryProps) {
    const { orders, isLoading, isError, error } = useOrders({ enabled: isAuthenticated });

    if (!isAuthenticated) {
        return <div className="glass-panel p-6 text-text-muted">Sign in to view your order history.</div>;
    }

    if (isLoading) return <div className="text-text-muted animate-pulse">Loading orders...</div>;

    if (isError) {
        return (
            <div className="glass-panel p-6 text-red-400">
                {(error as Error)?.message || "Failed to load orders."}
            </div>
        );
    }

    return (
        <div className="glass-panel overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">Order History</h2>
                <p className="mt-2 text-sm text-text-muted">This table reflects mock order records captured for the demo environment.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-background text-text-muted text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4">Symbol</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Side</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Quantity</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-text-muted">No orders found</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-text-muted">
                                        {format(new Date(order.created_at), 'MMM dd, HH:mm:ss')}
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{order.symbol}</td>
                                    <td className="px-6 py-4 text-sm">{order.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${order.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                            {order.side}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">${order.avg_price || order.price || '-'}</td>
                                    <td className="px-6 py-4">{order.quantity}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'FILLED' ? 'bg-green-500/10 text-green-500' :
                                                order.status === 'CANCELED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
