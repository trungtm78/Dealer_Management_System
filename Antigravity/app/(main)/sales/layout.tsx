export default function SalesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-full w-full">
            {children}
        </div>
    );
}
