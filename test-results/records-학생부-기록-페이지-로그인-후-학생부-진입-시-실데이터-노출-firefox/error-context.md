# Test info

- Name: 학생부(기록) 페이지 >> 로그인 후 학생부 진입 시 실데이터 노출
- Location: /Users/kwon/Desktop/project/software-design/WEB/tests/records.spec.ts:4:3

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="username"]')

    at /Users/kwon/Desktop/project/software-design/WEB/tests/records.spec.ts:6:16
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
   3 | test.describe('학생부(기록) 페이지', () => {
   4 |   test('로그인 후 학생부 진입 시 실데이터 노출', async ({ page }) => {
   5 |     await page.goto('/login');
>  6 |     await page.fill('input[name="username"]', 'student1');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
   7 |     await page.fill('input[name="password"]', 'password1');
   8 |     await page.click('button[type="submit"]');
   9 |     await page.goto('/student/records');
  10 |     await expect(page.locator('.records-tabs')).toBeVisible();
  11 |     await expect(page.locator('.attendance-table')).toBeVisible();
  12 |   });
  13 |
  14 |   test('탭 전환 시 각 데이터 정상 노출', async ({ page }) => {
  15 |     await page.goto('/login');
  16 |     await page.fill('input[name="username"]', 'student1');
  17 |     await page.fill('input[name="password"]', 'password1');
  18 |     await page.click('button[type="submit"]');
  19 |     await page.goto('/student/records');
  20 |     await page.click('.records-tabs >> text=행동 발달');
  21 |     await expect(page.locator('.behavior-table')).toBeVisible();
  22 |   });
  23 | });
  24 |
```