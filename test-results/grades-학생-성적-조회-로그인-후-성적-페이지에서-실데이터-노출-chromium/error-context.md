# Test info

- Name: 학생 성적 조회 >> 로그인 후 성적 페이지에서 실데이터 노출
- Location: /Users/kwon/Desktop/project/software-design/WEB/tests/grades.spec.ts:4:3

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="username"]')

    at /Users/kwon/Desktop/project/software-design/WEB/tests/grades.spec.ts:6:16
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
   3 | test.describe('학생 성적 조회', () => {
   4 |   test('로그인 후 성적 페이지에서 실데이터 노출', async ({ page }) => {
   5 |     await page.goto('/login');
>  6 |     await page.fill('input[name="username"]', 'student1');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
   7 |     await page.fill('input[name="password"]', 'password1');
   8 |     await page.click('button[type="submit"]');
   9 |     await page.goto('/student/grades');
  10 |     await expect(page.locator('.grades-table')).toBeVisible();
  11 |     await expect(page.locator('.grades-table tr')).toHaveCountGreaterThan(1);
  12 |   });
  13 |
  14 |   test('성적 데이터 없는 경우 안내 메시지 노출', async ({ page }) => {
  15 |     await page.goto('/login');
  16 |     await page.fill('input[name="username"]', 'emptyuser');
  17 |     await page.fill('input[name="password"]', 'password1');
  18 |     await page.click('button[type="submit"]');
  19 |     await page.goto('/student/grades');
  20 |     await expect(page.locator('.empty-state')).toContainText('성적 정보가 없습니다');
  21 |   });
  22 | });
  23 |
```