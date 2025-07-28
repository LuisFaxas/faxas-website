export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Onboarding has its own layout, not using the portal layout
  return <>{children}</>;
}