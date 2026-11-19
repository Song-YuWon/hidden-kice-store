# 히든카이스 교재 스토어 (신입사원 채용 과제)

Figma 디자인("히든카이스 교재 스토어 목록 페이지", node `1:186`)을 기반으로 구현한
교재 스토어 목록 페이지입니다. Next.js + Supabase로 상품 목록을 CSR로 불러와
검색 / 필터 / 페이지네이션을 제공합니다.

- 배포 URL: https://hidden-kice-store-fawn.vercel.app
- GitHub: https://github.com/Song-YuWon/hidden-kice-store

## 실행 방법

```bash
npm install
cp .env.example .env.local   # Supabase 프로젝트 URL / anon key 입력
npm run dev                  # http://localhost:3000
```

Supabase 테이블/정책/더미 데이터는 `supabase/schema.sql`에 정리되어 있습니다.
새 Supabase 프로젝트의 SQL Editor에 그대로 붙여넣어 실행하면 이 프로젝트와
동일한 상태로 재현할 수 있습니다.

```bash
npm run build && npm run start   # 프로덕션 빌드 확인
npm run test                      # 유닛 테스트 (할인가 계산 로직)
```

## 기술 스택

| 영역 | 선택 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 데이터 패칭 | TanStack Query |
| 데이터베이스 | Supabase (Postgres + PostgREST, RLS 읽기 전용) |
| 폰트 | Pretendard |

## 폴더 구조

```
src/
  app/                      # 라우팅 전용: layout/page/providers만 둡니다.
    layout.tsx              # 루트 레이아웃 (GNB, Footer, Providers 조립)
    page.tsx                # "/" 페이지 (배너 + 상품 섹션 조립)
    providers.tsx           # TanStack Query Provider
    globals.css             # Tailwind, 디자인 토큰, 폰트
    api/ping/route.ts       # Supabase 비활성화 방지용 핑 (Vercel Cron에서 호출)

  features/
    products/                # "상품" 도메인 전용 코드. 다른 도메인이 생기면
      types/product.ts       # (예: features/cart, features/auth) 이 옆에 추가합니다.
      api/getProducts.ts      # Supabase 쿼리 (검색/필터/페이지네이션)
      hooks/useProducts.ts     # TanStack Query 훅
      utils/price.ts           # 할인가 계산, 통화 포맷
      components/
        ProductsSection.tsx    # 검색/필터/페이지 상태를 들고 있는 컨테이너
        SearchBar.tsx
        FilterTabs.tsx
        ProductGrid.tsx
        ProductCard.tsx
        Pagination.tsx

  shared/
    layout/                  # 여러 페이지에서 재사용되는 레이아웃 조각
      Gnb.tsx
      PromoBanner.tsx
      Footer.tsx

  lib/
    supabase/client.ts        # Supabase 클라이언트 싱글턴

supabase/
  schema.sql                 # 테이블/RLS/더미 데이터 (재현용)
```

도메인 로직(API/훅/타입/컴포넌트)은 `features/<domain>` 아래에 모으고,
`app/`에는 라우팅·조립 코드만 두는 feature 단위 구조입니다. 장바구니·주문·
인증 같은 도메인이 추가되면 `features/cart`, `features/auth`처럼 같은
패턴으로 옆에 추가할 수 있고, 여러 도메인이 공유하는 GNB/Footer 같은 조각은
`shared/`에 둡니다.

## 주요 구현 결정

- 검색/필터/페이지네이션은 Supabase 쿼리(`ilike`/`eq`/`range`+`count`)로 처리
- 할인가는 저장하지 않고 `getDiscountedPrice()`에서 매번 계산
- RLS는 `SELECT` 정책만 부여한 읽기 전용 (anon key로 쓰기 불가, curl로 검증함)
- 검색 입력 300ms 디바운스
- 로딩 스켈레톤 / 에러 / 빈 결과 상태 구현
- 검색/필터/페이지 상태를 URL 쿼리스트링에 동기화(새로고침·링크 공유·뒤로가기 지원)
- `getDiscountedPrice`/`formatKrw`에 Vitest 유닛 테스트 추가
- `/api/ping` + Vercel Cron(1회/일) + GitHub Actions(2회/일)로 Supabase 무료
  플랜 비활성화(일주일 이상 미사용 시 자동 일시정지) 방지

## 시간 제약으로 생략/단순화한 부분

- 데스크톱(1440px) 기준으로 작업했고, 2~3열까지는 반응형 그리드를 넣었지만
  모바일 전용 레이아웃(GNB 햄버거 메뉴 등)은 만들지 않았습니다.
- 장바구니/알림/로그인 아이콘, GNB 메뉴는 클릭해도 동작하지 않습니다
  (디자인 주석에 따라 의도된 범위입니다).
- 프로모션 배너는 이미지 1장을 반복 사용하며, 4초 간격으로 자동 슬라이드만
  구현했습니다(이미지 자체가 달라지는 건 아님).
