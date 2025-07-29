export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start page has its own layout, not using the portal layout
  return <>{children}</>;
}