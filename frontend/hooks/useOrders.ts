"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Order, CreateOrderRequest } from "@/types/order";
import { auth } from "@/lib/firebase";

type UseOrdersOptions = {
    enabled?: boolean;
};

async function requireAuthenticatedUser() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Please sign in to access your orders.");
    }

    await user.getIdToken();
    return user;
}

export function useOrders({ enabled = true }: UseOrdersOptions = {}) {
    const queryClient = useQueryClient();

    const ordersQuery = useQuery<Order[]>({
        queryKey: ['orders'],
        enabled,
        queryFn: async () => {
            await requireAuthenticatedUser();
            const response = await api.get('/api/orders/');
            return response.data;
        },
        refetchInterval: enabled ? 5000 : false,
        retry: false,
    });

    const placeOrderMutation = useMutation({
        mutationFn: async (newOrder: CreateOrderRequest) => {
            await requireAuthenticatedUser();
            const response = await api.post('/api/orders/', newOrder);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        orders: ordersQuery.data || [],
        isLoading: ordersQuery.isLoading,
        isError: ordersQuery.isError,
        error: ordersQuery.error,
        placeOrder: placeOrderMutation.mutateAsync,
        isPlacing: placeOrderMutation.isPending,
    };
}
