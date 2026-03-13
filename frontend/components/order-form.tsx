"use client";

import { useState } from 'react';
import { OrderSide, OrderType } from '@/types/order';
import { useOrders } from '@/hooks/useOrders';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type OrderFormProps = {
    isAuthenticated?: boolean;
};

export default function OrderForm({ isAuthenticated = false }: OrderFormProps) {
    const { placeOrder, isPlacing } = useOrders({ enabled: isAuthenticated });
    const [side, setSide] = useState<OrderSide>('BUY');
    const [type, setType] = useState<OrderType>('MARKET');
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        if (!isAuthenticated) {
            setStatus({ type: 'error', message: 'Please sign in before placing an order.' });
            return;
        }

        try {
            await placeOrder({
                symbol,
                side,
                order_type: type,
                quantity: parseFloat(quantity),
                price: type === 'LIMIT' ? parseFloat(price) : undefined,
            });
            setStatus({ type: 'success', message: 'Mock order placed successfully.' });
            setQuantity('');
            setPrice('');
        } catch (error: any) {
            setStatus({ type: 'error', message: error.response?.data?.detail || 'Failed to place order' });
        }
    };

    return (
        <div className="glass-panel p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Place Order
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                    Mock Data
                </span>
            </h2>

            <p className="text-sm text-text-muted mb-6">
                Orders are simulated in this build so you can demo the full flow safely without submitting real exchange trades.
            </p>

            <div className="flex gap-2 mb-6 p-1 bg-background rounded-lg">
                <button
                    onClick={() => setSide('BUY')}
                    className={`flex-1 py-2 rounded-md font-semibold transition-all ${side === 'BUY' ? 'bg-green-500 text-black' : 'text-text-muted hover:text-text'}`}
                >
                    Buy
                </button>
                <button
                    onClick={() => setSide('SELL')}
                    className={`flex-1 py-2 rounded-md font-semibold transition-all ${side === 'SELL' ? 'bg-red-500 text-black' : 'text-text-muted hover:text-text'}`}
                >
                    Sell
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-x-0 space-y-4">
                <div>
                    <label className="block text-sm text-text-muted mb-1">Symbol</label>
                    <input
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        className="input-field w-full"
                        placeholder="BTCUSDT"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-1">Order Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as OrderType)}
                        className="input-field w-full"
                    >
                        <option value="MARKET">Market</option>
                        <option value="LIMIT">Limit</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-text-muted mb-1">Quantity</label>
                    <input
                        type="number"
                        step="any"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="input-field w-full"
                        placeholder="0.001"
                        required
                    />
                </div>

                {type === 'LIMIT' && (
                    <div>
                        <label className="block text-sm text-text-muted mb-1">Price</label>
                        <input
                            type="number"
                            step="any"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="input-field w-full"
                            placeholder="65000"
                            required
                        />
                    </div>
                )}

                {status && (
                    <div className={`p-3 rounded-lg flex items-center gap-3 text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {status.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPlacing || !isAuthenticated}
                    className={`w-full py-3 rounded-xl font-bold text-lg mt-4 transition-all active:scale-95 ${side === 'BUY' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                        } text-black disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isPlacing ? 'Processing...' : isAuthenticated ? `${side === 'BUY' ? 'Buy' : 'Sell'} ${symbol}` : 'Sign in to trade'}
                </button>
            </form>
        </div>
    );
}
