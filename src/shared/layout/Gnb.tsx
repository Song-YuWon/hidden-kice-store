import Image from "next/image";

const NAV_ITEMS = [
  { label: "스토어", active: true },
  { label: "AI OMR WORK", active: false },
  { label: "챌린지", active: false },
  { label: "히든카이스 소개", active: false },
];

export function Gnb() {
  return (
    <header className="sticky top-0 z-20 flex w-full justify-center bg-white px-4 py-[10px] shadow-[0_3px_2px_rgba(0,0,0,0.12)]">
      <div className="flex h-20 w-full max-w-[1280px] items-center justify-between">
        <div className="flex items-center gap-[100px]">
          <Image src="/icons/logo.svg" alt="HIDDEN KICE" width={143} height={18} priority />
          <nav className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <span
                key={item.label}
                className={
                  item.active
                    ? "text-lg font-semibold text-primary"
                    : "text-lg font-semibold text-gray-300"
                }
              >
                {item.label}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex w-[401px] items-center justify-end gap-6">
          <div className="relative flex flex-col items-start">
            <Image src="/icons/cart.svg" alt="장바구니" width={24} height={24} />
            <span className="absolute -top-1.5 left-3.5 flex size-[15px] items-center justify-center rounded-full bg-primary text-[10px] text-white">
              1
            </span>
          </div>
          <div className="relative flex flex-col items-start">
            <Image src="/icons/bell.svg" alt="알림" width={24} height={24} />
            <span className="absolute -top-1.5 left-[11px] flex size-[15px] items-center justify-center rounded-full bg-primary text-[10px] text-white">
              1
            </span>
          </div>
          <Image src="/icons/user.svg" alt="마이페이지" width={24} height={24} />
        </div>
      </div>
    </header>
  );
}
