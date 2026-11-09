/**
 * Fundalul comun al hero-urilor: grila de puncte, lumina mentă din dreapta sus
 * și, opțional, discul luminos din dreapta (cel din spatele instrumentului de pe Acasă).
 * Secțiunea părinte trebuie să aibă clasele din `heroSectionClass`.
 */
export const heroSectionClass =
  "relative overflow-hidden bg-gradient-to-b from-deep via-primary-container to-surface-lowest";

export default function HeroBackdrop({ glow = false }: { glow?: boolean }) {
  return (
    <>
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-10 h-[640px] w-[640px] rounded-full bg-secondary-container/20 blur-[130px]"
      />
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-[6%] top-1/2 hidden h-[440px] w-[440px] -translate-y-1/2 rounded-full bg-gradient-to-tr from-secondary-container/40 via-surface-lowest/60 to-transparent blur-2xl lg:block"
        />
      )}
    </>
  );
}
