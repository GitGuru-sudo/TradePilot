const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE !== "false";

export default function MockModeBanner() {
    if (!isMockMode) {
        return null;
    }

    return (
        <div className="border-b border-amber-400/30 bg-amber-400/10">
            <div className="container mx-auto px-4 py-3 text-sm text-amber-100">
                Mock mode is enabled. Orders, balances, and trade history shown in this demo are simulated for assignment and deployment review.
            </div>
        </div>
    );
}
