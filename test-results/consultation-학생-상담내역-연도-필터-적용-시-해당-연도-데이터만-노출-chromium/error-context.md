# Test info

- Name: 학생 상담내역 >> 연도 필터 적용 시 해당 연도 데이터만 노출
- Location: /Users/kwon/Desktop/project/software-design/WEB/tests/consultation.spec.ts:14:3

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="username"]')

    at /Users/kwon/Desktop/project/software-design/WEB/tests/consultation.spec.ts:16:16
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
   3 | test.describe('학생 상담내역', () => {
   4 |   test('로그인 후 상담내역 페이지에서 본인 상담 데이터만 노출', async ({ page }) => {
   5 |     await page.goto('/login');
   6 |     await page.fill('input[name="username"]', 'student1');
   7 |     await page.fill('input[name="password"]', 'password1');
   8 |     await page.click('button[type="submit"]');
   9 |     await page.goto('/student/consultation');
  10 |     await expect(page.locator('.consultation-list')).toBeVisible();
  11 |     await expect(page.locator('.consultation-list .consultation-card')).toHaveCountGreaterThan(0);
  12 |   });
  13 |
  14 |   test('연도 필터 적용 시 해당 연도 데이터만 노출', async ({ page }) => {
  15 |     await page.goto('/login');
> 16 |     await page.fill('input[name="username"]', 'student1');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  17 |     await page.fill('input[name="password"]', 'password1');
  18 |     await page.click('button[type="submit"]');
  19 |     await page.goto('/student/consultation');
  20 |     await page.selectOption('select[name="year-filter"]', '2024');
  21 |     await expect(page.locator('.consultation-list .consultation-card')).toContainText('2024');
  22 |   });
  23 | });
  24 |
```