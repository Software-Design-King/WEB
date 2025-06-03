# Test info

- Name: 인증 플로우 >> 로그인 상태에서 새로고침해도 인증 유지
- Location: /Users/kwon/Desktop/project/software-design/WEB/tests/auth.spec.ts:23:3

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="username"]')

    at /Users/kwon/Desktop/project/software-design/WEB/tests/auth.spec.ts:25:16
```

# Page snapshot

```yaml
- heading "인천대학교 학생 관리 시스템" [level=1]
- paragraph: 카카오 계정으로 로그인하여 시작하세요
- button "카카오 계정으로 로그인"
- paragraph: 인천대학교 학생 관리 시스템 | Software Design King
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // 인증(로그인/회원가입) 핵심 테스트
   4 |
   5 | test.describe('인증 플로우', () => {
   6 |   test('잘못된 정보로 로그인 시 에러 메시지 노출', async ({ page }) => {
   7 |     await page.goto('/login');
   8 |     await page.fill('input[name="username"]', 'wronguser');
   9 |     await page.fill('input[name="password"]', 'wrongpass');
  10 |     await page.click('button[type="submit"]');
  11 |     await expect(page.locator('.error-message')).toBeVisible();
  12 |   });
  13 |
  14 |   test('정상 로그인 시 대시보드로 이동', async ({ page }) => {
  15 |     await page.goto('/login');
  16 |     await page.fill('input[name="username"]', 'student1');
  17 |     await page.fill('input[name="password"]', 'password1');
  18 |     await page.click('button[type="submit"]');
  19 |     await expect(page).toHaveURL(/student\/dashboard/);
  20 |     await expect(page.locator('.user-greeting')).toBeVisible();
  21 |   });
  22 |
  23 |   test('로그인 상태에서 새로고침해도 인증 유지', async ({ page }) => {
  24 |     await page.goto('/login');
> 25 |     await page.fill('input[name="username"]', 'student1');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  26 |     await page.fill('input[name="password"]', 'password1');
  27 |     await page.click('button[type="submit"]');
  28 |     await expect(page).toHaveURL(/student\/dashboard/);
  29 |     await page.reload();
  30 |     await expect(page).toHaveURL(/student\/dashboard/);
  31 |     await expect(page.locator('.user-greeting')).toBeVisible();
  32 |   });
  33 | });
  34 |
```