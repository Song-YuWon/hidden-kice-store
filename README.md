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

## 기술 스택과 선택 이유

| 영역 | 선택 | 이유 |
| --- | --- | --- |
| 프레임워크 | Next.js 16 (App Router) | 과제 요구사항이 명시한 스택. 파일 기반 라우팅과 레이아웃 공유(GNB/Footer)를 그대로 활용. 이 페이지는 전부 CSR이라 서버 컴포넌트의 이점은 거의 없지만, 향후 다른 라우트(상품 상세, 마이페이지 등)에서 서버 렌더링이 필요할 때 전환 비용이 낮다는 점을 고려했습니다. |
| 언어 | TypeScript | Supabase 응답 타입, 상품 필터 상태 등을 컴파일 타임에 검증하기 위해 사용했습니다. |
| 스타일 | Tailwind CSS v4 | Figma MCP가 추출한 스타일(색상 hex, 폰트 크기 등)을 거의 그대로 유틸리티 클래스로 옮길 수 있어 디자인-코드 싱크 속도가 빠릅니다. `app/globals.css`의 `@theme`에 Figma 변수(`Color/primary/default` 등)를 디자인 토큰으로 등록해 재사용했습니다. |
| 데이터 패칭 | TanStack Query | 검색어/필터/페이지가 바뀔 때마다 쿼리 키가 달라지는 구조라 캐싱·중복 요청 방지·로딩 상태 관리가 필요했습니다. `placeholderData: keepPreviousData`로 페이지 전환 시 깜빡임 없이 이전 데이터를 보여주다가 교체합니다. |
| 데이터베이스 | Supabase (Postgres + PostgREST) | 별도 백엔드 서버 없이 RLS로 읽기 전용 공개 API를 만들 수 있어 "화면에 보이는 부분 위주"인 이번 과제 범위에 적합했습니다. |
| 폰트 | Pretendard (npm 패키지) | Figma 디자인의 폰트가 Pretendard였고, Google Fonts에는 없어 npm 패키지의 정적 CSS를 `globals.css`에서 바로 import했습니다. |

## 폴더 구조

```
src/
  app/                      # 라우팅 전용: layout/page/providers만 둡니다.
    layout.tsx              # 루트 레이아웃 (GNB, Footer, Providers 조립)
    page.tsx                # "/" 페이지 (배너 + 상품 섹션 조립)
    providers.tsx           # TanStack Query Provider
    globals.css             # Tailwind, 디자인 토큰, 폰트

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

**왜 feature 단위로 나눴나요?**
현재는 상품 도메인 하나뿐이지만, 과제에서 요구한 "확장 가능한 구조"를 고려해
`app/`에는 라우팅과 조립 코드만 두고, 도메인 로직(API/훅/타입/컴포넌트)은
`features/<domain>` 아래에 모았습니다. 장바구니·주문·인증 같은 도메인이
추가되면 `features/cart`, `features/auth`처럼 같은 패턴으로 옆에 추가하면
되고, 여러 도메인에서 함께 쓰는 GNB/Footer/버튼 같은 조각은 `shared/`에
둡니다. `api/hooks/components/types`로 한 번 더 나눈 이유는, 리스트가
길어졌을 때 "이 도메인의 서버 통신 코드가 어디 있는지" "UI가 어디 있는지"를
파일명이 아니라 폴더만 보고 찾을 수 있게 하기 위해서입니다.

## 주요 구현 결정

- **검색/필터/페이지네이션을 서버(Supabase) 쿼리로 처리**: 더미 데이터가
  30건이라 클라이언트에서 걸러도 체감 차이는 없지만, 실제 서비스에서는
  상품이 수천~수만 건이 될 수 있으므로 `ilike`(검색), `eq`(필터),
  `range` + `count: 'exact'`(페이지네이션)를 Supabase 쿼리 단계에서
  적용해 "데이터 양이 늘어도 그대로 쓸 수 있는" 패턴을 선택했습니다.
- **할인가는 저장하지 않고 계산**: `products` 테이블에는 정가(`price`)와
  할인율(`discount_rate`)만 저장하고, 화면에 보여줄 할인가는
  `getDiscountedPrice()`에서 매번 계산합니다. 정가/할인율 정책이 바뀌어도
  데이터를 다시 채워 넣을 필요가 없습니다.
- **RLS 읽기 전용 정책**: `anon`/`authenticated` 역할에 `SELECT` 정책만
  부여하고 INSERT/UPDATE/DELETE 정책은 만들지 않았습니다. 익명 키가
  브라우저에 노출되어도 데이터를 바꿀 수 없습니다.
- **검색 디바운스(300ms)**: 입력할 때마다 요청을 보내지 않도록
  `ProductsSection`에서 입력값과 실제 쿼리에 쓰는 값을 분리했습니다.
- **로딩 / 에러 / 빈 상태**: 최초 로딩 시 카드 모양의 스켈레톤을 보여주고,
  Supabase 요청이 실패하면 에러 메시지를, 검색 결과가 0건이면 안내 문구를
  보여줍니다.
- **프로모션 배너는 이미지 1장을 더미로 반복, 4초 간격 자동 슬라이드**:
  Figma에서 내보낼 수 있는 배너 이미지가 1장뿐이라 `SLIDES` 배열에 같은
  경로를 5번 넣었습니다. 실제 배너 이미지 4장만 추가하면 바로 동작하도록
  슬라이드 배열과 렌더링 로직을 분리했고, `translateX` 트랜지션으로 옆으로
  넘어가는 애니메이션을 줘서 "자동으로 넘어가는 중"이라는 게 눈에 보이도록
  했습니다(이미지가 같아서 숫자 배지만 바뀌면 멈춘 것처럼 보일 수 있어서).
- **GNB 메뉴/장바구니·알림 아이콘은 정적**: Figma 주석에 "NAVBAR는 구조만"
  이라고 명시되어 있어 클릭 동작 없이 구조와 스타일만 구현했습니다.
- **검색/필터/페이지 상태를 URL 쿼리스트링에 동기화**: `useState`만 쓰면
  새로고침하거나 링크를 공유했을 때 "전체 1페이지"로 초기화돼 버립니다.
  `useSearchParams`/`useRouter`로 `?filter=패스&q=시즌5&page=2` 형태로
  URL에 반영해서 새로고침·링크 공유·브라우저 뒤로가기에서도 같은 화면을
  다시 보여주도록 했습니다. (Next.js는 정적 페이지에서 `useSearchParams`를
  쓰는 컴포넌트를 `<Suspense>`로 감싸야 해서 `page.tsx`에 스켈레톤을
  fallback으로 둔 Suspense 경계를 추가했습니다.)
- **CSR을 선택한 것의 SEO 트레이드오프**: 서버가 보내는 최초 HTML에는
  상품 데이터가 없고 브라우저에서 Supabase 호출이 끝나야 채워지기 때문에,
  JS를 실행하지 않는 검색엔진 크롤러나 메신저 링크 미리보기 봇은 상품명/
  가격을 읽지 못합니다. 이번 과제는 요구사항 자체가 CSR이었고, 스토어
  목록 페이지는 검색엔진 유입보다 내부 트래픽이 중요하다고 가정해 이
  단점을 감수했습니다. 실제 서비스라면 상품 상세 페이지만 SSR/SSG로
  만들어 개별 상품의 검색 노출을 확보하는 절충안을 고려했을 것입니다.
- **RLS 쓰기 차단을 실제로 검증**: "정책을 안 만들었으니 막혔겠지"로
  끝내지 않고, 공개 anon key로 직접 INSERT를 시도해 막히는지 확인했습니다.

  ```bash
  curl -X POST "https://ukqsepagzkrmdghszbzp.supabase.co/rest/v1/products" \
    -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>" \
    -H "Content-Type: application/json" \
    --data '{"name":"test","type":"단품","price":1,"discount_rate":0,"image_url":"x"}'
  # -> 401 { "code": "42501",
  #          "message": "new row violates row-level security policy for table \"products\"" }
  ```

  브라우저에 노출되는 키로는 조회만 가능하고 쓰기는 Postgres 레벨에서
  거부된다는 걸 실제 응답으로 확인했습니다.
- **가격 계산 로직에 유닛 테스트 추가**: `getDiscountedPrice`/`formatKrw`는
  입력과 출력이 분명한 순수 함수라 테스트 가치가 높다고 판단해 Vitest로
  테스트를 추가했습니다(`src/features/products/utils/price.test.ts`,
  `npm run test`). UI 전체를 테스트하기보다, 숫자가 틀리면 바로 눈에 띄는
  "돈 계산" 로직부터 우선순위를 두었습니다.

## 시간 제약으로 생략/단순화한 부분

- 데스크톱(1440px) 기준으로 작업했고, 2~3열까지는 반응형 그리드를 넣었지만
  모바일 전용 레이아웃(GNB 햄버거 메뉴 등)은 만들지 않았습니다.
- 장바구니/알림/로그인 아이콘, GNB 메뉴는 클릭해도 동작하지 않습니다
  (디자인 주석에 따라 의도된 범위입니다).
- 프로모션 배너는 이미지 1장을 반복 사용하며, 4초 간격으로 자동 슬라이드만
  구현했습니다(이미지 자체가 달라지는 건 아님).
